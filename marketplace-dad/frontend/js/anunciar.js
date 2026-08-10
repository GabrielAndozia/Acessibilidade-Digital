var anunciosDoUsuario = [];

function mensagemAnuncio(texto, erro) {
  var elemento = document.getElementById("mensagem-anuncio");
  elemento.textContent = texto;
  elemento.className = "mensagem-formulario" + (erro ? " mensagem-erro" : " mensagem-sucesso");
  elemento.hidden = false;
}

function criarElemento(tag, texto, classe) {
  var elemento = document.createElement(tag);
  if (texto) elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

function formatarPreco(preco) {
  return "R$ " + Number(preco).toFixed(2).replace(".", ",");
}

function renderizarAnuncios(figuras) {
  var lista = document.getElementById("lista-anuncios");
  lista.innerHTML = "";
  if (!figuras.length) {
    lista.appendChild(criarElemento("p", "Você ainda não publicou nenhum anúncio.", "carregando"));
    return;
  }

  figuras.forEach(function (figura) {
    var item = criarElemento("article", null, "item-gerenciamento");
    var imagem = document.createElement("img");
    imagem.src = figura.imagem;
    imagem.alt = figura.nome;
    item.appendChild(imagem);

    var conteudo = criarElemento("div", null, "item-gerenciamento-conteudo");
    conteudo.appendChild(criarElemento("h3", figura.nome));
    conteudo.appendChild(criarElemento("p", formatarPreco(figura.preco) + " · Estoque: " + figura.estoque));
    conteudo.appendChild(criarElemento("p", figura.categoria + " · " + figura.descricao, "texto-secundario"));
    var acoes = criarElemento("div", null, "acoes-gerenciamento");
    var editar = criarElemento("button", "Editar", "btn-secundario");
    editar.type = "button";
    editar.addEventListener("click", function () { iniciarEdicao(figura); });
    var excluir = criarElemento("button", "Excluir", "btn-perigo");
    excluir.type = "button";
    excluir.addEventListener("click", function () { excluirAnuncio(figura); });
    acoes.appendChild(editar);
    acoes.appendChild(excluir);
    conteudo.appendChild(acoes);
    item.appendChild(conteudo);
    lista.appendChild(item);
  });
}

function carregarAnuncios() {
  return Autenticacao.requisicao("/minhas-figuras").then(function (figuras) {
    anunciosDoUsuario = figuras;
    renderizarAnuncios(figuras);
  });
}

function iniciarEdicao(figura) {
  var formulario = document.getElementById("form-anuncio");
  formulario.elements.id.value = figura.id;
  formulario.elements.nome.value = figura.nome;
  formulario.elements.preco.value = figura.preco;
  formulario.elements.categoria.value = figura.categoria;
  formulario.elements.descricao.value = figura.descricao;
  formulario.elements.estoque.value = figura.estoque;
  formulario.elements.acessorios.value = (figura.acessorios || []).join(", ");
  formulario.elements.imagem.value = String(figura.imagem).startsWith("http") ? figura.imagem : "";
  document.getElementById("titulo-form-anuncio").textContent = "Editar anúncio";
  document.getElementById("botao-salvar-anuncio").textContent = "Salvar alterações";
  document.getElementById("botao-cancelar-edicao").hidden = false;
  formulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

function limparFormulario() {
  var formulario = document.getElementById("form-anuncio");
  formulario.reset();
  formulario.elements.id.value = "";
  document.getElementById("titulo-form-anuncio").textContent = "Novo anúncio";
  document.getElementById("botao-salvar-anuncio").textContent = "Publicar anúncio";
  document.getElementById("botao-cancelar-edicao").hidden = true;
}

function excluirAnuncio(figura) {
  if (!window.confirm("Excluir o anúncio \"" + figura.nome + "\"? Esta ação não pode ser desfeita.")) return;
  Autenticacao.requisicao("/figuras/" + figura.id, { method: "DELETE" })
    .then(function () {
      mensagemAnuncio("Anúncio excluído.");
      if (document.getElementById("form-anuncio").elements.id.value === String(figura.id)) limparFormulario();
      return carregarAnuncios();
    })
    .catch(function (erro) { mensagemAnuncio(erro.message, true); });
}

function configurarFormularioAnuncio() {
  var formulario = document.getElementById("form-anuncio");
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    var emEdicao = formulario.elements.id.value;
    var dados = new FormData(formulario);
    if (!formulario.elements.foto.files.length) dados.delete("foto");
    var botao = document.getElementById("botao-salvar-anuncio");
    botao.disabled = true;
    Autenticacao.requisicao(emEdicao ? "/figuras/" + emEdicao : "/figuras", {
      method: emEdicao ? "PUT" : "POST",
      body: dados,
    })
      .then(function () {
        mensagemAnuncio(emEdicao ? "Anúncio atualizado." : "Anúncio publicado no catálogo.");
        limparFormulario();
        return carregarAnuncios();
      })
      .catch(function (erro) { mensagemAnuncio(erro.message, true); })
      .finally(function () { botao.disabled = false; });
  });
  document.getElementById("botao-cancelar-edicao").addEventListener("click", limparFormulario);
}

document.addEventListener("DOMContentLoaded", function () {
  Autenticacao.usuarioAtual().then(function (usuario) {
    if (!usuario) {
      document.getElementById("acesso-negado").hidden = false;
      return;
    }
    if (usuario.papel === "admin") {
      window.location.replace("admin.html");
      return;
    }

    document.getElementById("area-anuncios").hidden = false;
    document.getElementById("boas-vindas-anuncios").textContent = "Olá, " + usuario.nome + ". Seus anúncios aparecem no catálogo como Pessoa física.";
    configurarFormularioAnuncio();
    carregarAnuncios().catch(function (erro) { mensagemAnuncio(erro.message, true); });
  });
});
