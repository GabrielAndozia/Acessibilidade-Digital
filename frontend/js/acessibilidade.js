var Acessibilidade = {
  CHAVE_STORAGE: "a11yPrefs",

  NIVEIS_FONTE: ["100%", "112.5%", "125%", "137.5%", "150%"],

  padrao: {
    fonteNivel: 0,
    altoContraste: false,
    espacamento: false,
    destacarLinks: false,
    guiaLeitura: false,
  },

  obterPrefs: function () {
    var dados = localStorage.getItem(this.CHAVE_STORAGE);
    if (!dados) return Object.assign({}, this.padrao);
    return Object.assign({}, this.padrao, JSON.parse(dados));
  },

  salvarPrefs: function (prefs) {
    localStorage.setItem(this.CHAVE_STORAGE, JSON.stringify(prefs));
  },

  aplicarPrefs: function () {
    var prefs = this.obterPrefs();

    document.documentElement.style.fontSize = this.NIVEIS_FONTE[prefs.fonteNivel];
    document.body.classList.toggle("a11y-alto-contraste", prefs.altoContraste);
    document.body.classList.toggle("a11y-espacamento", prefs.espacamento);
    document.body.classList.toggle("a11y-destacar-links", prefs.destacarLinks);
    document.body.classList.toggle("a11y-guia-ativa", prefs.guiaLeitura);

    this.atualizarBotoesPressionados(prefs);
    var textoNivel = document.getElementById("a11y-fonte-nivel");
    if (textoNivel) textoNivel.textContent = this.NIVEIS_FONTE[prefs.fonteNivel];
  },

  atualizarBotoesPressionados: function (prefs) {
    var mapa = {
      "a11y-guia": prefs.guiaLeitura,
      "a11y-espacamento": prefs.espacamento,
      "a11y-links": prefs.destacarLinks,
      "a11y-contraste": prefs.altoContraste,
    };
    for (var id in mapa) {
      var botao = document.getElementById(id);
      if (botao) botao.setAttribute("aria-pressed", mapa[id] ? "true" : "false");
    }
  },

  injetarPainel: function () {
    var html =
      '<div id="a11y-widget">' +
        '<button id="a11y-botao" class="a11y-botao" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="a11y-painel">' +
          '<span aria-hidden="true">&#9881;</span> Recursos Assistivos' +
        "</button>" +
        '<div id="a11y-painel" class="a11y-painel" role="region" aria-label="Painel de recursos assistivos" hidden>' +
          '<div class="a11y-painel-cabecalho">' +
            "<h2>Recursos Assistivos</h2>" +
            '<button id="a11y-fechar" class="a11y-fechar" type="button" aria-label="Fechar painel de acessibilidade">&times;</button>' +
          "</div>" +

          '<div class="a11y-secao">' +
            "<h3>Leitura</h3>" +
            '<button id="a11y-guia" class="a11y-item" type="button" aria-pressed="false">' +
              '<span class="a11y-item-icone" aria-hidden="true">&#8213;</span> Guia de leitura' +
            "</button>" +
            '<div class="a11y-item a11y-item-fonte">' +
              "<span>Tamanho da fonte</span>" +
              '<div class="a11y-fonte-controles">' +
                '<button id="a11y-fonte-menos" type="button" aria-label="Diminuir tamanho da fonte">A-</button>' +
                '<span id="a11y-fonte-nivel" aria-live="polite">100%</span>' +
                '<button id="a11y-fonte-mais" type="button" aria-label="Aumentar tamanho da fonte">A+</button>' +
              "</div>" +
            "</div>" +
            '<button id="a11y-espacamento" class="a11y-item" type="button" aria-pressed="false">' +
              '<span class="a11y-item-icone" aria-hidden="true">&#8597;</span> Espaçamento entre linhas' +
            "</button>" +
            '<button id="a11y-links" class="a11y-item" type="button" aria-pressed="false">' +
              '<span class="a11y-item-icone" aria-hidden="true">&#128279;</span> Destacar links' +
            "</button>" +
            '<button id="a11y-contraste" class="a11y-item" type="button" aria-pressed="false">' +
              '<span class="a11y-item-icone" aria-hidden="true">&#9685;</span> Alto contraste' +
            "</button>" +
          "</div>" +

          '<div class="a11y-secao">' +
            "<h3>Idioma e Libras</h3>" +
            '<div class="a11y-item a11y-item-translate">' +
              "<span>Traduzir página</span>" +
              '<div id="google_translate_element"></div>' +
            "</div>" +
            '<button id="a11y-libras" class="a11y-item" type="button">' +
              '<span class="a11y-item-icone" aria-hidden="true">&#129309;</span> Ativar Libras (VLibras)' +
            "</button>" +
            '<p class="a11y-creditos">Libras: <a href="https://vlibras.gov.br" target="_blank" rel="noopener noreferrer">VLibras</a>, tradutor oficial do Governo Federal.</p>' +
          "</div>" +

          '<button id="a11y-resetar" class="a11y-resetar" type="button">Restaurar padrão</button>' +
        "</div>" +
      "</div>" +
      '<div class="a11y-guia-overlay" aria-hidden="true">' +
        '<div class="a11y-guia-mascara-superior"></div>' +
        '<div class="a11y-guia-mascara-inferior"></div>' +
      "</div>";

    document.body.insertAdjacentHTML("beforeend", html);
  },

  configurarPainel: function () {
    var botao = document.getElementById("a11y-botao");
    var painel = document.getElementById("a11y-painel");
    var botaoFechar = document.getElementById("a11y-fechar");

    function abrirPainel() {
      painel.hidden = false;
      botao.setAttribute("aria-expanded", "true");
      botaoFechar.focus();
    }

    function fecharPainel() {
      painel.hidden = true;
      botao.setAttribute("aria-expanded", "false");
      botao.focus();
    }

    botao.addEventListener("click", function () {
      if (painel.hidden) {
        abrirPainel();
      } else {
        fecharPainel();
      }
    });

    botaoFechar.addEventListener("click", fecharPainel);

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && !painel.hidden) {
        fecharPainel();
      }
    });

    document.addEventListener("click", function (evento) {
      if (painel.hidden) return;
      var cliqueDentro = painel.contains(evento.target) || botao.contains(evento.target);
      if (!cliqueDentro) fecharPainel();
    });
  },

  configurarFuncionalidades: function () {
    var self = this;

    document.getElementById("a11y-fonte-mais").addEventListener("click", function () {
      var prefs = self.obterPrefs();
      prefs.fonteNivel = Math.min(prefs.fonteNivel + 1, self.NIVEIS_FONTE.length - 1);
      self.salvarPrefs(prefs);
      self.aplicarPrefs();
    });

    document.getElementById("a11y-fonte-menos").addEventListener("click", function () {
      var prefs = self.obterPrefs();
      prefs.fonteNivel = Math.max(prefs.fonteNivel - 1, 0);
      self.salvarPrefs(prefs);
      self.aplicarPrefs();
    });

    this.configurarToggle("a11y-guia", "guiaLeitura");
    this.configurarToggle("a11y-espacamento", "espacamento");
    this.configurarToggle("a11y-links", "destacarLinks");
    this.configurarToggle("a11y-contraste", "altoContraste");

    document.getElementById("a11y-resetar").addEventListener("click", function () {
      self.salvarPrefs(Object.assign({}, self.padrao));
      self.aplicarPrefs();
    });

    var overlay = document.querySelector(".a11y-guia-overlay");
    var mascaraSuperior = document.querySelector(".a11y-guia-mascara-superior");
    var mascaraInferior = document.querySelector(".a11y-guia-mascara-inferior");
    var FAIXA_ALTURA = 64;

    document.addEventListener("mousemove", function (evento) {
      if (!document.body.classList.contains("a11y-guia-ativa")) return;
      var y = evento.clientY;
      mascaraSuperior.style.height = Math.max(0, y - FAIXA_ALTURA / 2) + "px";
      mascaraInferior.style.top = (y + FAIXA_ALTURA / 2) + "px";
    });
  },

  configurarToggle: function (idBotao, chavePref) {
    var self = this;
    document.getElementById(idBotao).addEventListener("click", function () {
      var prefs = self.obterPrefs();
      prefs[chavePref] = !prefs[chavePref];
      self.salvarPrefs(prefs);
      self.aplicarPrefs();
    });
  },

  carregarGoogleTranslate: function () {
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement(
        { pageLanguage: "pt", layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
        "google_translate_element"
      );
    };

    var script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
  },

  carregarVLibras: function () {
    var html =
      '<div vw class="enabled">' +
        '<div vw-access-button class="active"></div>' +
        '<div vw-plugin-wrapper>' +
          '<div class="vw-plugin-top-wrapper"></div>' +
        "</div>" +
      "</div>";
    document.body.insertAdjacentHTML("beforeend", html);

    var script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.onload = function () {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    };
    document.body.appendChild(script);

    document.getElementById("a11y-libras").addEventListener("click", function () {
      var botaoVLibras = document.querySelector("[vw-access-button]");
      if (botaoVLibras) botaoVLibras.click();
    });
  },
};

document.addEventListener("DOMContentLoaded", function () {
  Acessibilidade.injetarPainel();
  Acessibilidade.configurarPainel();
  Acessibilidade.configurarFuncionalidades();
  Acessibilidade.aplicarPrefs();
  Acessibilidade.carregarGoogleTranslate();
  Acessibilidade.carregarVLibras();
});
