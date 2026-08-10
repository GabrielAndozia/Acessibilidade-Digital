// catalogo.js - Carrega e exibe as figuras do backend

var API_URL = "http://localhost:3001/api";

function carregarCatalogo(categoria) {
    var url = API_URL + "/figuras";
    if (categoria && categoria !== "todas") {
        url += "?categoria=" + encodeURIComponent(categoria);
    }

    var grid = document.getElementById("grid-figuras");
    var carregando = document.getElementById("carregando");
    var erro = document.getElementById("erro");

    grid.innerHTML = "";
    carregando.hidden = false;
    erro.hidden = true;

    fetch(url)
        .then(function (resposta) {
            if (!resposta.ok) throw new Error("Erro ao carregar catálogo");
            return resposta.json();
        })
        .then(function (figuras) {
            carregando.hidden = true;
            renderizarFiguras(figuras, grid);
        })
        .catch(function () {
            carregando.hidden = true;
            erro.hidden = false;
        });
}

function adicionarTexto(elemento, texto) {
    elemento.textContent = texto;
    return elemento;
}

function renderizarFiguras(figuras, grid) {
    grid.innerHTML = "";
    if (figuras.length === 0) {
        grid.appendChild(adicionarTexto(document.createElement("p"), "Nenhuma figura encontrada nesta categoria.")).className = "carregando";
        return;
    }

    figuras.forEach(function (figura) {
        var card = document.createElement("article");
        card.className = "card-figura";

        var imagem = document.createElement("img");
        imagem.src = figura.imagem;
        imagem.alt = figura.nome + " - " + figura.descricao;
        card.appendChild(imagem);

        var corpo = document.createElement("div");
        corpo.className = "card-corpo";
        corpo.appendChild(adicionarTexto(document.createElement("span"), figura.categoria)).className = "card-categoria";
        corpo.appendChild(adicionarTexto(document.createElement("h2"), figura.nome)).className = "card-nome";
        corpo.appendChild(adicionarTexto(document.createElement("p"), figura.descricao)).className = "card-descricao";

        var vendedor = document.createElement("p");
        vendedor.className = "card-vendedor";
        vendedor.textContent = "Anunciado por " + (figura.vendedorNome || "FigureForge") + " · " + (figura.tipoVendedor || "Loja");
        corpo.appendChild(vendedor);

        var rodape = document.createElement("div");
        rodape.className = "card-footer";
        rodape.appendChild(adicionarTexto(document.createElement("span"), "R$ " + Number(figura.preco).toFixed(2).replace(".", ","))).className = "card-preco";

        var botao = document.createElement("button");
        botao.type = "button";
        botao.className = "btn-principal btn-adicionar";
        botao.textContent = "Adicionar";
        botao.setAttribute("aria-label", "Adicionar " + figura.nome + " ao carrinho");
        botao.addEventListener("click", function () {
            Carrinho.adicionar({
                id: figura.id,
                nome: figura.nome,
                preco: Number(figura.preco),
                imagem: figura.imagem,
            });
            botao.textContent = "Adicionado!";
            botao.setAttribute("aria-label", figura.nome + " adicionado ao carrinho");
            setTimeout(function () {
                botao.textContent = "Adicionar";
                botao.setAttribute("aria-label", "Adicionar " + figura.nome + " ao carrinho");
            }, 1500);
        });
        rodape.appendChild(botao);
        corpo.appendChild(rodape);
        card.appendChild(corpo);
        grid.appendChild(card);
    });
}

function configurarFiltros() {
    var botoes = document.querySelectorAll(".filtro-btn");
    for (var i = 0; i < botoes.length; i++) {
        botoes[i].addEventListener("click", function () {
            for (var j = 0; j < botoes.length; j++) {
                botoes[j].classList.remove("ativo");
                botoes[j].setAttribute("aria-pressed", "false");
            }
            this.classList.add("ativo");
            this.setAttribute("aria-pressed", "true");
            carregarCatalogo(this.getAttribute("data-categoria"));
        });
    }
}

function configurarAtalhosCategorias() {
    var atalhos = document.querySelectorAll("[data-categoria-atalho]");
    for (var i = 0; i < atalhos.length; i++) {
        atalhos[i].addEventListener("click", function () {
            var categoria = this.getAttribute("data-categoria-atalho");
            var filtro = document.querySelector('.filtro-btn[data-categoria="' + categoria + '"]');
            if (filtro) {
                filtro.click();
                document.getElementById("vitrine").scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    carregarCatalogo();
    configurarFiltros();
    configurarAtalhosCategorias();
});