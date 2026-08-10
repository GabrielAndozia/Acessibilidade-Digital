function exibirMensagemPerfil(mensagem, erro) {
  var elemento = document.getElementById("mensagem-perfil");
  elemento.textContent = mensagem;
  elemento.className = "mensagem-formulario" + (erro ? " mensagem-erro" : " mensagem-sucesso");
  elemento.hidden = false;
}

function iniciaisDoNome(nome) {
  return String(nome)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(function (parte) { return parte.charAt(0).toUpperCase(); })
    .join("");
}

function formatarData(data) {
  if (!data) return "agora";
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(data));
}

var anunciosDoPerfil = [];

function preencherPerfil(usuario, anuncios) {
  document.getElementById("perfil-avatar").textContent = iniciaisDoNome(usuario.nome);
  document.getElementById("perfil-nome").textContent = usuario.nome;
  document.getElementById("perfil-email").textContent = usuario.email;
  document.getElementById("perfil-papel").textContent = usuario.papel === "admin" ? "Administrador" : "Colecionador";
  document.getElementById("perfil-desde").textContent = "Membro desde " + formatarData(usuario.criadoEm);
  document.getElementById("perfil-form-nome").value = usuario.nome;
  anunciosDoPerfil = anuncios.length ? anuncios : anunciosDoPerfil;
  document.getElementById("estatistica-anuncios").textContent = anunciosDoPerfil.length;
  document.getElementById("estatistica-estoque").textContent = anuncios.filter(function (anuncio) {
    return Number(anuncio.estoque) > 0;
  }).length || anunciosDoPerfil.filter(function (anuncio) { return Number(anuncio.estoque) > 0; }).length;
  document.getElementById("estatistica-carrinho").textContent = Carrinho.contarItens();

  var atalhoAnuncios = document.getElementById("atalho-anuncios");
  var atalhoAdmin = document.getElementById("atalho-admin");
  if (usuario.papel === "admin") {
    atalhoAnuncios.hidden = true;
    atalhoAdmin.hidden = false;
  }
}

function configurarFormularioPerfil(usuario) {
  var formulario = document.getElementById("form-perfil");
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    var botao = formulario.querySelector('button[type="submit"]');
    botao.disabled = true;
    Autenticacao.requisicao("/auth/perfil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: formulario.elements.nome.value }),
    })
      .then(function (resposta) {
        preencherPerfil(resposta.usuario, []);
        exibirMensagemPerfil("Perfil atualizado com sucesso.");
      })
      .catch(function (erro) {
        exibirMensagemPerfil(erro.message, true);
      })
      .finally(function () {
        botao.disabled = false;
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  Autenticacao.usuarioAtual().then(function (usuario) {
    if (!usuario) {
      document.getElementById("acesso-perfil-negado").hidden = false;
      return;
    }

    Autenticacao.requisicao("/minhas-figuras")
      .then(function (anuncios) {
        document.getElementById("area-perfil").hidden = false;
        preencherPerfil(usuario, anuncios);
        configurarFormularioPerfil(usuario);
      })
      .catch(function (erro) {
        document.getElementById("acesso-perfil-negado").hidden = false;
        exibirMensagemPerfil(erro.message, true);
      });
  });
});
