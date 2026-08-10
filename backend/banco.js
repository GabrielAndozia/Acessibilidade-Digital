const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const figurasIniciais = require("./dados");

const caminhoBanco = path.join(__dirname, "dados-marketplace.json");

function hashSenha(senha) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(senha, salt, 64).toString("hex");
  return salt + ":" + hash;
}

function senhaConfere(senha, senhaHash) {
  const partes = String(senhaHash || "").split(":");
  if (partes.length !== 2) return false;

  const hashCalculado = crypto.scryptSync(senha, partes[0], 64);
  const hashArmazenado = Buffer.from(partes[1], "hex");
  return hashArmazenado.length === hashCalculado.length && crypto.timingSafeEqual(hashArmazenado, hashCalculado);
}

function emailNormalizado(email) {
  return String(email || "").trim().toLowerCase();
}

function criarBancoInicial() {
  const emailAdmin = emailNormalizado(process.env.ADMIN_EMAIL || "admin@figureforge.local");
  const senhaAdmin = process.env.ADMIN_PASSWORD || "admin123";
  const criadoEm = new Date().toISOString();
  const administrador = {
    id: 1,
    nome: "Administrador FigureForge",
    email: emailAdmin,
    senhaHash: hashSenha(senhaAdmin),
    papel: "admin",
    criadoEm: criadoEm,
  };

  return {
    proximoUsuarioId: 2,
    proximaFiguraId: Math.max.apply(null, figurasIniciais.map(function (figura) { return figura.id; })) + 1,
    usuarios: [administrador],
    figuras: figurasIniciais.map(function (figura) {
      return Object.assign({}, figura, {
        vendedorId: administrador.id,
        vendedorNome: administrador.nome,
        tipoVendedor: "Loja",
        criadoEm: criadoEm,
      });
    }),
  };
}

function escreverBanco(conteudo) {
  const arquivoTemporario = caminhoBanco + ".tmp";
  fs.writeFileSync(arquivoTemporario, JSON.stringify(conteudo, null, 2), { encoding: "utf8", mode: 0o600 });
  fs.renameSync(arquivoTemporario, caminhoBanco);
}

function carregarBanco() {
  if (!fs.existsSync(caminhoBanco)) {
    const bancoInicial = criarBancoInicial();
    escreverBanco(bancoInicial);
    return bancoInicial;
  }

  try {
    const banco = JSON.parse(fs.readFileSync(caminhoBanco, "utf8"));
    if (!Array.isArray(banco.usuarios) || !Array.isArray(banco.figuras)) {
      throw new Error("Estrutura inválida");
    }
    return banco;
  } catch (erro) {
    throw new Error("Não foi possível ler dados-marketplace.json: " + erro.message);
  }
}

const banco = carregarBanco();

function aplicarConfiguracaoAdmin() {
  if (!process.env.ADMIN_EMAIL && !process.env.ADMIN_PASSWORD) return;

  const administrador = banco.usuarios.find(function (usuario) { return usuario.papel === "admin"; });
  if (!administrador) throw new Error("Não existe uma conta administradora para configurar");

  if (process.env.ADMIN_EMAIL) {
    const novoEmail = emailNormalizado(process.env.ADMIN_EMAIL);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)) {
      throw new Error("ADMIN_EMAIL precisa ter um e-mail válido");
    }
    const emailEmUso = banco.usuarios.some(function (usuario) {
      return usuario.id !== administrador.id && usuario.email === novoEmail;
    });
    if (emailEmUso) throw new Error("ADMIN_EMAIL já pertence a outra conta");
    administrador.email = novoEmail;
  }

  if (process.env.ADMIN_PASSWORD) {
    if (process.env.ADMIN_PASSWORD.length < 6 || process.env.ADMIN_PASSWORD.length > 128) {
      throw new Error("ADMIN_PASSWORD deve ter entre 6 e 128 caracteres");
    }
    administrador.senhaHash = hashSenha(process.env.ADMIN_PASSWORD);
  }

  escreverBanco(banco);
}

aplicarConfiguracaoAdmin();

function salvarBanco() {
  escreverBanco(banco);
}

module.exports = {
  banco: banco,
  emailNormalizado: emailNormalizado,
  hashSenha: hashSenha,
  salvarBanco: salvarBanco,
  senhaConfere: senhaConfere,
};
