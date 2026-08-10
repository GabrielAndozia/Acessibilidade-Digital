var API_URL = "http://localhost:3001/api";

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("form-criar");
  var btnGerar = document.getElementById("btn-gerar");
  var resultado = document.getElementById("resultado");
  var resultadoConteudo = document.getElementById("resultado-conteudo");
  var gerando = document.getElementById("gerando");
  var inputFoto = document.getElementById("input-foto");
  var uploadArea = document.getElementById("upload-area");
  var uploadPreview = document.getElementById("upload-preview");

  var arquivoSelecionado = null;

  uploadArea.addEventListener("click", function () {
    inputFoto.click();
  });

  uploadArea.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      inputFoto.click();
    }
  });

  inputFoto.addEventListener("change", function () {
    if (inputFoto.files && inputFoto.files[0]) {
      mostrarPreview(inputFoto.files[0]);
    }
  });

  uploadArea.addEventListener("dragover", function (evento) {
    evento.preventDefault();
    uploadArea.classList.add("drag-over");
  });

  uploadArea.addEventListener("dragleave", function () {
    uploadArea.classList.remove("drag-over");
  });

  uploadArea.addEventListener("drop", function (evento) {
    evento.preventDefault();
    uploadArea.classList.remove("drag-over");
    if (evento.dataTransfer.files && evento.dataTransfer.files[0]) {
      var arquivo = evento.dataTransfer.files[0];
      if (arquivo.type.startsWith("image/")) {
        inputFoto.files = evento.dataTransfer.files;
        mostrarPreview(arquivo);
      }
    }
  });

  function mostrarPreview(arquivo) {
    arquivoSelecionado = arquivo;
    var reader = new FileReader();
    reader.onload = function (e) {
      uploadPreview.innerHTML =
        '<img src="' + e.target.result + '" alt="Foto selecionada para gerar action figure" class="foto-preview">' +
        '<p class="upload-texto">' + arquivo.name + " (" + (arquivo.size / 1024 / 1024).toFixed(1) + " MB)</p>" +
        '<p class="upload-formato">Clique para trocar a foto</p>';
    };
    reader.readAsDataURL(arquivo);
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nome = document.getElementById("input-nome").value.trim();
    var profissao = document.getElementById("input-profissao").value.trim();
    var roupa = obterRadioSelecionado("roupa");
    var acessorios = obterCheckboxesSelecionados("acessorios");
    var corCaixa = obterRadioSelecionado("corCaixa");

    var erros = [];
    if (!arquivoSelecionado) erros.push("Envie uma foto sua");
    if (!nome) erros.push("Digite seu nome");
    if (!profissao) erros.push("Digite sua profissão ou título");
    if (!roupa) erros.push("Selecione uma roupa");
    if (acessorios.length === 0) erros.push("Selecione pelo menos 1 acessório");
    if (acessorios.length > 3) erros.push("Selecione no máximo 3 acessórios");
    if (!corCaixa) erros.push("Selecione a cor da caixa");

    if (erros.length > 0) {
      mostrarErroFormulario(erros);
      return;
    }

    var formData = new FormData();
    formData.append("foto", arquivoSelecionado);
    formData.append("nome", nome);
    formData.append("profissao", profissao);
    formData.append("roupa", roupa);
    formData.append("acessorios", acessorios.join(","));
    formData.append("corCaixa", corCaixa);

    btnGerar.disabled = true;
    btnGerar.textContent = "Gerando...";
    gerando.hidden = false;
    resultado.hidden = true;
    limparErros();

    fetch(API_URL + "/gerar", {
      method: "POST",
      body: formData,
    })
      .then(function (resposta) {
        return resposta.json();
      })
      .then(function (data) {
        gerando.hidden = true;
        btnGerar.disabled = false;
        btnGerar.textContent = "Gerar Minha Action Figure";

        if (data.sucesso) {
          resultado.hidden = false;
          resultadoConteudo.innerHTML =
            '<img src="' + data.imagem + '" alt="Action figure personalizada de ' + nome + " - " + profissao + '" id="imagem-gerada">' +
            "<p>Sua action figure foi gerada com sucesso!</p>" +
            '<div class="resultado-acoes">' +
              '<button class="btn-principal" id="btn-download" aria-label="Baixar imagem da action figure">' +
                "Baixar Imagem" +
              "</button>" +
              '<button class="btn-secundario" id="btn-gerar-novamente" aria-label="Gerar novamente com as mesmas opções">' +
                "Gerar Novamente" +
              "</button>" +
            "</div>";

          document.getElementById("btn-download").addEventListener("click", function () {
            baixarImagem(data.imagem, nome);
          });

          document.getElementById("btn-gerar-novamente").addEventListener("click", function () {
            resultado.hidden = true;
            form.dispatchEvent(new Event("submit"));
          });
        } else {
          resultado.hidden = false;
          resultadoConteudo.innerHTML =
            '<p role="alert" class="erro-msg">' + (data.erro || data.mensagem) + "</p>" +
            "<p>Tente novamente ou mude algumas opções.</p>";
        }
      })
      .catch(function (erro) {
        gerando.hidden = true;
        btnGerar.disabled = false;
        btnGerar.textContent = "Gerar Minha Action Figure";
        resultado.hidden = false;
        resultadoConteudo.innerHTML =
          '<p role="alert" class="erro-msg">Erro de conexão. Verifique se o servidor está rodando.</p>';
      });
  });
});

function obterRadioSelecionado(nome) {
  var radios = document.querySelectorAll('input[name="' + nome + '"]');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) return radios[i].value;
  }
  return null;
}

function obterCheckboxesSelecionados(nome) {
  var checkboxes = document.querySelectorAll('input[name="' + nome + '"]');
  var selecionados = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) selecionados.push(checkboxes[i].value);
  }
  return selecionados;
}

function mostrarErroFormulario(erros) {
  limparErros();
  var html = '<div class="form-erros" role="alert" aria-live="assertive" tabindex="-1">';
  html += "<p><strong>Corrija os seguintes erros:</strong></p><ul>";
  for (var i = 0; i < erros.length; i++) {
    html += "<li>" + erros[i] + "</li>";
  }
  html += "</ul></div>";

  var form = document.getElementById("form-criar");
  form.insertAdjacentHTML("afterbegin", html);
  document.querySelector(".form-erros").focus();
}

function limparErros() {
  var erroAnterior = document.querySelector(".form-erros");
  if (erroAnterior) erroAnterior.remove();
}

function baixarImagem(dataUrl, nome) {
  var link = document.createElement("a");
  link.href = dataUrl;
  link.download = "action-figure-" + nome.toLowerCase().replace(/\s+/g, "-") + ".png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
