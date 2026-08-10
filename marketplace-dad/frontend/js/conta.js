function exibirMensagemConta(id, mensagem, erro) {
  var elemento = document.getElementById(id);
  elemento.textContent = mensagem;
  elemento.className = "mensagem-formulario" + (erro ? " mensagem-erro" : " mensagem-sucesso");
  elemento.hidden = false;
}

function redirecionarDepoisDoLogin(usuario) {
  window.location.href = usuario.papel === "admin" ? "admin.html" : "perfil.html";
}

function configurarFormularioConta(formulario, rota, mensagemId) {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    var botao = formulario.querySelector('button[type="submit"]');
    botao.disabled = true;
    Autenticacao.requisicao(rota, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: formulario.elements.nome ? formulario.elements.nome.value : undefined,
        email: formulario.elements.email.value,
        senha: formulario.elements.senha.value,
      }),
    })
      .then(function (resposta) {
        var usuario = Autenticacao.guardarSessao(resposta);
        redirecionarDepoisDoLogin(usuario);
      })
      .catch(function (erro) {
        exibirMensagemConta(mensagemId, erro.message, true);
      })
      .finally(function () {
        botao.disabled = false;
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  Autenticacao.usuarioAtual().then(function (usuario) {
    if (usuario) redirecionarDepoisDoLogin(usuario);
  });
  configurarFormularioConta(document.getElementById("form-login"), "/auth/login", "mensagem-login");
  configurarFormularioConta(document.getElementById("form-cadastro"), "/auth/cadastro", "mensagem-cadastro");
});
