// campanha.js - Lógica do checklist interativo da página de conscientização

document.addEventListener("DOMContentLoaded", function () {
  var checkboxes = document.querySelectorAll('.checklist-form input[type="checkbox"]');
  var resultado = document.getElementById("checklist-resultado");
  var total = checkboxes.length;

  // Atualiza o contador quando qualquer checkbox muda
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", atualizarResultado);
  }

  function atualizarResultado() {
    var marcados = 0;
    for (var j = 0; j < checkboxes.length; j++) {
      if (checkboxes[j].checked) {
        marcados++;
      }
    }

    var porcentagem = Math.round((marcados / total) * 100);
    var mensagem = "";

    if (marcados === 0) {
      mensagem = "<strong>0 de " + total + "</strong> critérios atendidos. Comece agora!";
    } else if (porcentagem < 50) {
      mensagem =
        "<strong>" + marcados + " de " + total + "</strong> critérios atendidos (" +
        porcentagem + "%). Bom começo, mas ainda há bastante trabalho.";
    } else if (porcentagem < 80) {
      mensagem =
        "<strong>" + marcados + " de " + total + "</strong> critérios atendidos (" +
        porcentagem + "%). Progresso sólido! Continue melhorando.";
    } else if (porcentagem < 100) {
      mensagem =
        "<strong>" + marcados + " de " + total + "</strong> critérios atendidos (" +
        porcentagem + "%). Quase lá! Seu site está bem acessível.";
    } else {
      mensagem =
        "<strong>" + marcados + " de " + total + "</strong> critérios atendidos (100%). " +
        "Excelente! Seu site atende os principais critérios de acessibilidade WCAG.";
    }

    resultado.innerHTML = "<p>" + mensagem + "</p>";
  }
});
