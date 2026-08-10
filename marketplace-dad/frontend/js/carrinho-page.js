// carrinho-page.js - Lógica da página do carrinho

document.addEventListener("DOMContentLoaded", function () {
    renderizarCarrinho();

    // Botão limpar
    var btnLimpar = document.getElementById("btn-limpar");
    if (btnLimpar) {
        btnLimpar.addEventListener("click", function () {
            Carrinho.limpar();
            renderizarCarrinho();
        });
    }

    // Botão finalizar (simulação)
    var btnFinalizar = document.getElementById("btn-finalizar");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", function () {
            var modal = document.getElementById("modal-checkout");
            modal.hidden = false;
            // Foca no botão de fechar para acessibilidade
            document.getElementById("btn-fechar-modal").focus();
        });
    }

    // Fechar modal
    var btnFechar = document.getElementById("btn-fechar-modal");
    if (btnFechar) {
        btnFechar.addEventListener("click", function () {
            document.getElementById("modal-checkout").hidden = true;
            Carrinho.limpar();
            renderizarCarrinho();
        });
    }

    // Fechar modal com Escape (acessibilidade)
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            var modal = document.getElementById("modal-checkout");
            if (!modal.hidden) {
                modal.hidden = true;
                document.getElementById("btn-finalizar").focus();
            }
        }
    });
});

function renderizarCarrinho() {
    var itens = Carrinho.obterItens();
    var containerItens = document.getElementById("carrinho-itens");
    var containerVazio = document.getElementById("carrinho-vazio");
    var containerResumo = document.getElementById("carrinho-resumo");

    if (itens.length === 0) {
        containerItens.innerHTML = "";
        containerVazio.hidden = false;
        containerResumo.hidden = true;
        return;
    }

    containerVazio.hidden = true;
    containerResumo.hidden = false;

    // Renderiza cada item
    var html = "";
    for (var i = 0; i < itens.length; i++) {
        var item = itens[i];
        html +=
            '<div class="carrinho-item">' +
            '<img src="' + item.imagem + '" alt="' + item.nome + '">' +
            '<div class="carrinho-item-info">' +
            '<p class="carrinho-item-nome">' + item.nome + "</p>" +
            '<p class="carrinho-item-preco">R$ ' + item.preco.toFixed(2).replace(".", ",") +
            " × " + item.quantidade + "</p>" +
            "</div>" +
            '<button class="btn-remover" data-id="' + item.id + '" ' +
            'aria-label="Remover ' + item.nome + ' do carrinho">' +
            "Remover" +
            "</button>" +
            "</div>";
    }
    containerItens.innerHTML = html;

    // Atualiza totais
    var total = Carrinho.calcularTotal();
    document.getElementById("subtotal").textContent = "R$ " + total.toFixed(2).replace(".", ",");
    document.getElementById("total").textContent = "R$ " + total.toFixed(2).replace(".", ",");

    // Event listeners dos botões remover
    var botoesRemover = containerItens.querySelectorAll(".btn-remover");
    for (var j = 0; j < botoesRemover.length; j++) {
        botoesRemover[j].addEventListener("click", function () {
            var id = parseInt(this.getAttribute("data-id"));
            Carrinho.remover(id);
            renderizarCarrinho();
        });
    }
}