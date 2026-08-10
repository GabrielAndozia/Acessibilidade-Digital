var anunciosAdmin = [];

function mensagemAdmin(texto, erro) {
  var elemento = document.getElementById("mensagem-admin");
  elemento.textContent = texto;
  elemento.className = "mensagem-formulario" + (erro ? " mensagem-erro" : " mensagem-sucesso");
  elemento.hidden = false;
}

function elementoAdmin(tag, texto, classe) {
  var elemento = document.createElement(tag);
  if (texto) elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

function renderizarAnunciosAdmin(figuras) {
  var lista = document.getElementById("lista-admin-anuncios");
  lista.innerHTML = "";
  if (!figuras.length) {
    lista.appendChild(elementoAdmin("p", "Nenhum anúncio cadastrado.", "carregando"));
    return;
  }

  figuras.forEach(function (figura) {
    var item = elementoAdmin("article", null, "item-gerenciamento");
    var imagem = document.createElement("img");
    imagem.src = figura.imagem;
    imagem.alt = figura.nome;
    item.appendChild(imagem);
    var conteudo = elementoAdmin("div", null, "item-gerenciamento-conteudo");
    conteudo.appendChild(elementoAdmin("h3", figura.nome));
    conteudo.appendChild(elementoAdmin("p", "R$ " + Number(figura.preco).toFixed(2).replace(".", ",") + " · Estoque: " + figura.estoque));
    conteudo.appendChild(elementoAdmin("p", "Anunciado por " + figura.vendedorNome + " (" + figura.tipoVendedor + ")", "texto-secundario"));
    var acoes = elementoAdmin("div", null, "acoes-gerenciamento");
    var editar = elementoAdmin("button", "Editar", "btn-secundario");
    editar.type = "button";
    editar.addEventListener("click", function () { editarAnuncioAdmin(figura); });
    var excluir = elementoAdmin("button", "Excluir", "btn-perigo");
    excluir.type = "button";
    excluir.addEventListener("click", function () { excluirAnuncioAdmin(figura); });
    acoes.appendChild(editar);
    acoes.appendChild(excluir);
    conteudo.appendChild(acoes);
    item.appendChild(conteudo);
    lista.appendChild(item);
  });
}

function renderizarUsuarios(usuarios) {
  var lista = document.getElementById("lista-usuarios");
  lista.innerHTML = "";
  usuarios.forEach(function (usuario) {
    var linha = document.createElement("tr");
    linha.appendChild(elementoAdmin("td", usuario.nome));
    linha.appendChild(elementoAdmin("td", usuario.email));
    linha.appendChild(elementoAdmin("td", usuario.papel === "admin" ? "Administrador" : "Pessoa física"));
    linha.appendChild(elementoAdmin("td", String(usuario.totalAnuncios)));
    var acao = document.createElement("td");
    if (usuario.papel !== "admin") {
      var excluir = elementoAdmin("button", "Remover", "btn-perigo btn-pequeno");
      excluir.type = "button";
      excluir.addEventListener("click", function () { removerUsuario(usuario); });
      acao.appendChild(excluir);
    } else {
      acao.textContent = "Conta atual";
    }
    linha.appendChild(acao);
    lista.appendChild(linha);
  });
}

function carregarPainel() {
  return Promise.all([
    Autenticacao.requisicao("/minhas-figuras"),
    Autenticacao.requisicao("/admin/usuarios"),
  ]).then(function (resultados) {
    anunciosAdmin = resultados[0];
    renderizarAnunciosAdmin(resultados[0]);
    renderizarUsuarios(resultados[1]);
  });
}

function editarAnuncioAdmin(figura) {
  var formulario = document.getElementById("form-admin-anuncio");
  formulario.elements.id.value = figura.id;
  formulario.elements.nome.value = figura.nome;
  formulario.elements.preco.value = figura.preco;
  formulario.elements.categoria.value = figura.categoria;
  formulario.elements.descricao.value = figura.descricao;
  formulario.elements.estoque.value = figura.estoque;
  formulario.elements.acessorios.value = (figura.acessorios || []).join(", ");
  formulario.elements.imagem.value = String(figura.imagem).startsWith("http") ? figura.imagem : "";
  document.getElementById("titulo-form-admin").textContent = "Editar anúncio";
  document.getElementById("botao-salvar-admin").textContent = "Salvar alterações";
  document.getElementById("botao-cancelar-admin").hidden = false;
  formulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

function limparFormularioAdmin() {
  var formulario = document.getElementById("form-admin-anuncio");
  formulario.reset();
  formulario.elements.id.value = "";
  document.getElementById("titulo-form-admin").textContent = "Cadastrar figure da loja";
  document.getElementById("botao-salvar-admin").textContent = "Cadastrar figure";
  document.getElementById("botao-cancelar-admin").hidden = true;
}

function excluirAnuncioAdmin(figura) {
  if (!window.confirm("Excluir o anúncio \"" + figura.nome + "\"? Esta ação não pode ser desfeita.")) return;
  Autenticacao.requisicao("/figuras/" + figura.id, { method: "DELETE" })
    .then(function () {
      mensagemAdmin("Anúncio excluído.");
      if (document.getElementById("form-admin-anuncio").elements.id.value === String(figura.id)) limparFormularioAdmin();
      return carregarPainel();
    })
    .catch(function (erro) { mensagemAdmin(erro.message, true); });
}

function removerUsuario(usuario) {
  if (!window.confirm("Remover a conta de " + usuario.nome + " e todos os anúncios dela? Esta ação não pode ser desfeita.")) return;
  Autenticacao.requisicao("/admin/usuarios/" + usuario.id, { method: "DELETE" })
    .then(function () {
      mensagemAdmin("Usuário e anúncios relacionados foram removidos.");
      return carregarPainel();
    })
    .catch(function (erro) { mensagemAdmin(erro.message, true); });
}

function configurarFormularioAdmin() {
  var formulario = document.getElementById("form-admin-anuncio");
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }
    var emEdicao = formulario.elements.id.value;
    var dados = new FormData(formulario);
    if (!formulario.elements.foto.files.length) dados.delete("foto");
    var botao = document.getElementById("botao-salvar-admin");
    botao.disabled = true;
    Autenticacao.requisicao(emEdicao ? "/figuras/" + emEdicao : "/figuras", {
      method: emEdicao ? "PUT" : "POST",
      body: dados,
    })
      .then(function () {
        mensagemAdmin(emEdicao ? "Anúncio atualizado." : "Figure cadastrada na loja.");
        limparFormularioAdmin();
        return carregarPainel();
      })
      .catch(function (erro) { mensagemAdmin(erro.message, true); })
      .finally(function () { botao.disabled = false; });
  });
  document.getElementById("botao-cancelar-admin").addEventListener("click", limparFormularioAdmin);
}

document.addEventListener("DOMContentLoaded", function () {
  Autenticacao.usuarioAtual().then(function (usuario) {
    if (!usuario || usuario.papel !== "admin") {
      document.getElementById("acesso-admin-negado").hidden = false;
      return;
    }
    document.getElementById("painel-admin").hidden = false;
    configurarFormularioAdmin();
    carregarPainel().catch(function (erro) { mensagemAdmin(erro.message, true); });
  });
});
