var Autenticacao = (function () {
  var API_URL_AUTENTICACAO = "http://localhost:3001/api";
  var CHAVE_TOKEN = "figureforge_token";

  function token() {
    return sessionStorage.getItem(CHAVE_TOKEN);
  }

  function guardarSessao(resposta) {
    sessionStorage.setItem(CHAVE_TOKEN, resposta.token);
    return resposta.usuario;
  }

  function limparSessao() {
    sessionStorage.removeItem(CHAVE_TOKEN);
  }

  function requisicao(caminho, opcoes) {
    var configuracao = Object.assign({}, opcoes || {});
    configuracao.headers = Object.assign({}, configuracao.headers || {});
    if (token()) configuracao.headers.Authorization = "Bearer " + token();

    return fetch(API_URL_AUTENTICACAO + caminho, configuracao).then(function (resposta) {
      return resposta.text().then(function (texto) {
        var dados = texto ? JSON.parse(texto) : null;
        if (!resposta.ok) {
          var erro = new Error((dados && dados.erro) || "Não foi possível concluir a solicitação");
          erro.status = resposta.status;
          throw erro;
        }
        return dados;
      });
    });
  }

  function usuarioAtual() {
    if (!token()) return Promise.resolve(null);
    return requisicao("/auth/me")
      .then(function (resposta) { return resposta.usuario; })
      .catch(function () {
        limparSessao();
        return null;
      });
  }

  function sair() {
    return requisicao("/auth/logout", { method: "POST" })
      .catch(function () {})
      .then(function () {
        limparSessao();
        window.location.href = "index.html";
      });
  }

  function atualizarNavegacao() {
    var linkConta = document.querySelector("[data-link-conta]");
    var itemSair = document.querySelector("[data-item-sair]");
    var botaoSair = document.querySelector("[data-botao-sair]");
    if (!linkConta) return;

    usuarioAtual().then(function (usuario) {
      if (!usuario) return;
      linkConta.textContent = "Perfil";
      linkConta.href = "perfil.html";
      var itemAdmin = document.querySelector("[data-item-admin]");
      if (itemAdmin && usuario.papel === "admin") itemAdmin.hidden = false;
      if (itemSair) itemSair.hidden = false;
      if (botaoSair) botaoSair.addEventListener("click", sair);
    });
  }

  document.addEventListener("DOMContentLoaded", atualizarNavegacao);

  return {
    guardarSessao: guardarSessao,
    limparSessao: limparSessao,
    requisicao: requisicao,
    sair: sair,
    usuarioAtual: usuarioAtual,
  };
})();
