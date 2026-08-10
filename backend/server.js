(function corrigirCertificadosTLS() {
  const fs = require("fs");
  const bundleCorporativo = require("os").homedir() + "/All-CA-Bundle.pem";

  if (!fs.existsSync(bundleCorporativo)) return;
  if (process.env.NODE_EXTRA_CA_CERTS === bundleCorporativo) return;
  if (process.env.FIGUREFORGE_CA_FIX_APLICADO) return;

  const { spawnSync } = require("child_process");
  const resultado = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: "inherit",
    env: Object.assign({}, process.env, {
      NODE_EXTRA_CA_CERTS: bundleCorporativo,
      FIGUREFORGE_CA_FIX_APLICADO: "1",
    }),
  });
  process.exit(resultado.status);
})();

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { gerarFigureCompleta } = require("./huggingface");
const { banco, emailNormalizado, hashSenha, salvarBanco, senhaConfere } = require("./banco");

const app = express();
const PORTA = process.env.PORT || 3001;
const diretorioUploads = path.join(__dirname, "uploads");
const sessoes = new Map();
const duracaoSessaoMs = 12 * 60 * 60 * 1000;
const tiposImagem = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

fs.mkdirSync(diretorioUploads, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (tiposImagem[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("Envie uma imagem JPG, PNG ou WEBP"));
    }
  },
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(diretorioUploads));

function usuarioPublico(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    papel: usuario.papel,
    criadoEm: usuario.criadoEm,
  };
}

function criarSessao(usuario) {
  const token = crypto.randomBytes(32).toString("hex");
  sessoes.set(token, { usuarioId: usuario.id, expiraEm: Date.now() + duracaoSessaoMs });
  return token;
}

function tokenDaRequisicao(req) {
  const authorization = req.get("authorization") || "";
  const partes = authorization.match(/^Bearer\s+(.+)$/i);
  return partes ? partes[1] : null;
}

function autenticar(req, res, next) {
  const token = tokenDaRequisicao(req);
  const sessao = token && sessoes.get(token);

  if (!sessao || sessao.expiraEm < Date.now()) {
    if (token) sessoes.delete(token);
    return res.status(401).json({ erro: "Faça login para continuar" });
  }

  const usuario = banco.usuarios.find(function (item) { return item.id === sessao.usuarioId; });
  if (!usuario) {
    sessoes.delete(token);
    return res.status(401).json({ erro: "Sessão inválida" });
  }

  req.usuario = usuario;
  req.tokenSessao = token;
  next();
}

function exigirAdmin(req, res, next) {
  if (req.usuario.papel !== "admin") {
    return res.status(403).json({ erro: "Esta ação é exclusiva da administração" });
  }
  next();
}

function erroValidacao(mensagem) {
  const erro = new Error(mensagem);
  erro.status = 400;
  return erro;
}

function textoObrigatorio(valor, nomeCampo, minimo, maximo) {
  const texto = String(valor || "").trim();
  if (texto.length < minimo || texto.length > maximo) {
    throw erroValidacao(nomeCampo + " deve ter entre " + minimo + " e " + maximo + " caracteres");
  }
  return texto;
}

function validarUrlImagem(valor) {
  const texto = String(valor || "").trim();
  if (!texto) return null;

  try {
    const url = new URL(texto);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error();
    }
    return url.toString();
  } catch (erro) {
    throw erroValidacao("A URL da imagem deve começar com http:// ou https://");
  }
}

function arquivoImagemValido(arquivo) {
  if (!arquivo) return true;
  const cabecalho = arquivo.buffer;
  if (arquivo.mimetype === "image/jpeg") return cabecalho[0] === 0xff && cabecalho[1] === 0xd8 && cabecalho[2] === 0xff;
  if (arquivo.mimetype === "image/png") return cabecalho.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (arquivo.mimetype === "image/webp") return cabecalho.subarray(0, 4).toString() === "RIFF" && cabecalho.subarray(8, 12).toString() === "WEBP";
  return false;
}

function salvarImagem(arquivo) {
  if (!arquivo) return null;
  if (!arquivoImagemValido(arquivo)) {
    throw erroValidacao("O arquivo enviado não corresponde a uma imagem válida");
  }

  const nomeArquivo = crypto.randomBytes(16).toString("hex") + tiposImagem[arquivo.mimetype];
  fs.writeFileSync(path.join(diretorioUploads, nomeArquivo), arquivo.buffer, { mode: 0o600 });
  return "/uploads/" + nomeArquivo;
}

function removerImagemLocal(urlImagem) {
  if (!String(urlImagem || "").startsWith("/uploads/")) return;
  const nomeArquivo = path.basename(urlImagem);
  const caminhoArquivo = path.join(diretorioUploads, nomeArquivo);
  if (fs.existsSync(caminhoArquivo)) fs.unlinkSync(caminhoArquivo);
}

function dadosDaFigura(body, figuraAtual) {
  const preco = Number(body.preco);
  const estoque = Number(body.estoque);
  if (!Number.isFinite(preco) || preco <= 0 || preco > 1000000) {
    throw erroValidacao("Informe um preço válido");
  }
  if (!Number.isInteger(estoque) || estoque < 0 || estoque > 100000) {
    throw erroValidacao("Informe um estoque inteiro maior ou igual a zero");
  }

  const acessoriosRecebidos = Array.isArray(body.acessorios) ? body.acessorios : String(body.acessorios || "").split(",");
  const acessorios = acessoriosRecebidos
    .map(function (item) { return String(item).trim(); })
    .filter(Boolean)
    .slice(0, 6)
    .map(function (item) { return item.slice(0, 60); });

  return {
    nome: textoObrigatorio(body.nome, "Nome", 2, 80),
    preco: preco,
    categoria: textoObrigatorio(body.categoria, "Categoria", 2, 40),
    descricao: textoObrigatorio(body.descricao, "Descrição", 10, 600),
    estoque: estoque,
    acessorios: acessorios,
    imagem: validarUrlImagem(body.imagem) || (figuraAtual && figuraAtual.imagem) || "https://placehold.co/300x400/1a1a2e/eaeaea?text=Action+Figure",
  };
}

function podeGerenciarFigura(usuario, figura) {
  return usuario.papel === "admin" || figura.vendedorId === usuario.id;
}

app.post("/api/auth/cadastro", function (req, res) {
  const nome = textoObrigatorio(req.body.nome, "Nome", 2, 80);
  const email = emailNormalizado(req.body.email);
  const senha = String(req.body.senha || "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ erro: "Informe um e-mail válido" });
  }
  if (senha.length < 6 || senha.length > 128) {
    return res.status(400).json({ erro: "A senha deve ter entre 6 e 128 caracteres" });
  }
  if (banco.usuarios.some(function (usuario) { return usuario.email === email; })) {
    return res.status(409).json({ erro: "Já existe uma conta com este e-mail" });
  }

  const usuario = {
    id: banco.proximoUsuarioId++,
    nome: nome,
    email: email,
    senhaHash: hashSenha(senha),
    papel: "usuario",
    criadoEm: new Date().toISOString(),
  };
  banco.usuarios.push(usuario);
  salvarBanco();

  res.status(201).json({ usuario: usuarioPublico(usuario), token: criarSessao(usuario) });
});

app.post("/api/auth/login", function (req, res) {
  const email = emailNormalizado(req.body.email);
  const senha = String(req.body.senha || "");
  const usuario = banco.usuarios.find(function (item) { return item.email === email; });

  if (!usuario || !senhaConfere(senha, usuario.senhaHash)) {
    return res.status(401).json({ erro: "E-mail ou senha inválidos" });
  }

  res.json({ usuario: usuarioPublico(usuario), token: criarSessao(usuario) });
});

app.get("/api/auth/me", autenticar, function (req, res) {
  res.json({ usuario: usuarioPublico(req.usuario) });
});

app.patch("/api/auth/perfil", autenticar, function (req, res) {
  const nome = textoObrigatorio(req.body.nome, "Nome", 2, 80);
  req.usuario.nome = nome;

  banco.figuras.forEach(function (figura) {
    if (figura.vendedorId === req.usuario.id) figura.vendedorNome = nome;
  });
  salvarBanco();

  res.json({ usuario: usuarioPublico(req.usuario) });
});

app.post("/api/auth/logout", autenticar, function (req, res) {
  sessoes.delete(req.tokenSessao);
  res.status(204).end();
});

app.get("/api/figuras", function (req, res) {
  const categoria = String(req.query.categoria || "").trim().toLowerCase();
  const figuras = categoria
    ? banco.figuras.filter(function (figura) { return figura.categoria.toLowerCase() === categoria; })
    : banco.figuras;
  res.json(figuras);
});

app.get("/api/minhas-figuras", autenticar, function (req, res) {
  const figuras = req.usuario.papel === "admin"
    ? banco.figuras
    : banco.figuras.filter(function (figura) { return figura.vendedorId === req.usuario.id; });
  res.json(figuras);
});

app.get("/api/figuras/:id", function (req, res) {
  const id = Number(req.params.id);
  const figura = banco.figuras.find(function (item) { return item.id === id; });
  if (!figura) return res.status(404).json({ erro: "Figura não encontrada" });
  res.json(figura);
});

app.get("/api/categorias", function (req, res) {
  res.json(Array.from(new Set(banco.figuras.map(function (figura) { return figura.categoria; }))));
});

app.post("/api/figuras", autenticar, upload.single("foto"), function (req, res) {
  const dados = dadosDaFigura(req.body);
  const imagemEnviada = salvarImagem(req.file);
  if (imagemEnviada) dados.imagem = imagemEnviada;

  const figura = Object.assign({}, dados, {
    id: banco.proximaFiguraId++,
    vendedorId: req.usuario.id,
    vendedorNome: req.usuario.nome,
    tipoVendedor: req.usuario.papel === "admin" ? "Loja" : "Pessoa física",
    criadoEm: new Date().toISOString(),
  });
  banco.figuras.push(figura);
  salvarBanco();
  res.status(201).json(figura);
});

app.put("/api/figuras/:id", autenticar, upload.single("foto"), function (req, res) {
  const id = Number(req.params.id);
  const figura = banco.figuras.find(function (item) { return item.id === id; });
  if (!figura) return res.status(404).json({ erro: "Figura não encontrada" });
  if (!podeGerenciarFigura(req.usuario, figura)) {
    return res.status(403).json({ erro: "Você só pode editar seus próprios anúncios" });
  }

  const dados = dadosDaFigura(req.body, figura);
  const imagemEnviada = salvarImagem(req.file);
  if (imagemEnviada) {
    removerImagemLocal(figura.imagem);
    dados.imagem = imagemEnviada;
  }
  Object.assign(figura, dados, { atualizadoEm: new Date().toISOString() });
  salvarBanco();
  res.json(figura);
});

app.delete("/api/figuras/:id", autenticar, function (req, res) {
  const id = Number(req.params.id);
  const indice = banco.figuras.findIndex(function (item) { return item.id === id; });
  if (indice === -1) return res.status(404).json({ erro: "Figura não encontrada" });
  if (!podeGerenciarFigura(req.usuario, banco.figuras[indice])) {
    return res.status(403).json({ erro: "Você só pode excluir seus próprios anúncios" });
  }

  const figura = banco.figuras[indice];
  removerImagemLocal(figura.imagem);
  banco.figuras.splice(indice, 1);
  salvarBanco();
  res.status(204).end();
});

app.get("/api/admin/usuarios", autenticar, exigirAdmin, function (req, res) {
  const usuarios = banco.usuarios.map(function (usuario) {
    const publico = usuarioPublico(usuario);
    publico.totalAnuncios = banco.figuras.filter(function (figura) { return figura.vendedorId === usuario.id; }).length;
    return publico;
  });
  res.json(usuarios);
});

app.delete("/api/admin/usuarios/:id", autenticar, exigirAdmin, function (req, res) {
  const id = Number(req.params.id);
  if (id === req.usuario.id) {
    return res.status(400).json({ erro: "O administrador não pode remover a própria conta" });
  }
  const indice = banco.usuarios.findIndex(function (usuario) { return usuario.id === id; });
  if (indice === -1) return res.status(404).json({ erro: "Usuário não encontrado" });

  banco.figuras
    .filter(function (figura) { return figura.vendedorId === id; })
    .forEach(function (figura) { removerImagemLocal(figura.imagem); });
  banco.figuras = banco.figuras.filter(function (figura) { return figura.vendedorId !== id; });
  banco.usuarios.splice(indice, 1);
  salvarBanco();
  res.status(204).end();
});

app.post("/api/gerar", upload.single("foto"), async function (req, res) {
  if (!req.file) {
    return res.status(400).json({ erro: "Envie uma foto sua para gerar a figure" });
  }
  if (!arquivoImagemValido(req.file)) {
    return res.status(400).json({ erro: "O arquivo enviado não corresponde a uma imagem válida" });
  }

  const { nome, profissao, roupa, acessorios, corCaixa } = req.body;
  if (!nome || !profissao || !roupa || !acessorios || !corCaixa) {
    return res.status(400).json({ erro: "Campos obrigatórios: nome, profissao, roupa, acessorios, corCaixa" });
  }

  const listaAcessorios = Array.isArray(acessorios)
    ? acessorios
    : String(acessorios).split(",").map(function (item) { return item.trim(); });
  if (listaAcessorios.length === 0 || listaAcessorios.length > 3) {
    return res.status(400).json({ erro: "Selecione de 1 a 3 acessórios" });
  }

  const resultado = await gerarFigureCompleta(req.file.buffer.toString("base64"), req.file.mimetype, {
    nome: nome,
    profissao: profissao,
    roupa: roupa,
    acessorios: listaAcessorios,
    corCaixa: corCaixa,
  });

  if (resultado.sucesso) {
    return res.json({
      sucesso: true,
      imagem: "data:" + resultado.mimeType + ";base64," + resultado.imagem,
      mimeType: resultado.mimeType,
    });
  }
  res.status(500).json(resultado);
});

app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ erro: "A imagem deve ter no máximo 10MB" });
    return res.status(400).json({ erro: err.message });
  }
  if (err) return res.status(err.status || 400).json({ erro: err.message || "Não foi possível concluir a solicitação" });
  next();
});

app.listen(PORTA, function () {
  console.log("Servidor rodando em http://localhost:" + PORTA);
  console.log("Token Hugging Face: " + (process.env.HF_API_TOKEN ? "configurado" : "NAO CONFIGURADO"));
});
