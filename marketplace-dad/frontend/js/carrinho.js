// carrinho.js - Módulo compartilhado do carrinho (roda em todas as páginas)
// Usa localStorage para persistir o carrinho entre páginas

const Carrinho = {
    // Retorna os itens do carrinho
    obterItens: function () {
        const dados = localStorage.getItem("carrinho");
        return dados ? JSON.parse(dados) : [];
    },

    // Salva itens no localStorage
    salvar: function (itens) {
        localStorage.setItem("carrinho", JSON.stringify(itens));
        this.atualizarContador();
    },

    // Adiciona um item ao carrinho
    adicionar: function (figura) {
        const itens = this.obterItens();
        // Verifica se já existe
        const existente = itens.find(function (item) {
            return item.id === figura.id;
        });
        if (existente) {
            existente.quantidade += 1;
        } else {
            itens.push({
                id: figura.id,
                nome: figura.nome,
                preco: figura.preco,
                imagem: figura.imagem,
                quantidade: 1,
            });
        }
        this.salvar(itens);
    },

    // Remove um item pelo ID
    remover: function (id) {
        var itens = this.obterItens();
        itens = itens.filter(function (item) {
            return item.id !== id;
        });
        this.salvar(itens);
    },

    // Limpa todo o carrinho
    limpar: function () {
        localStorage.removeItem("carrinho");
        this.atualizarContador();
    },

    // Calcula o total
    calcularTotal: function () {
        var itens = this.obterItens();
        var total = 0;
        for (var i = 0; i < itens.length; i++) {
            total += itens[i].preco * itens[i].quantidade;
        }
        return total;
    },

    // Conta quantos itens tem
    contarItens: function () {
        var itens = this.obterItens();
        var total = 0;
        for (var i = 0; i < itens.length; i++) {
            total += itens[i].quantidade;
        }
        return total;
    },

    // Atualiza o contador visual no header (roda em todas as páginas)
    atualizarContador: function () {
        var contador = document.getElementById("carrinho-contador");
        if (contador) {
            contador.textContent = this.contarItens();
        }
    },
};

// Atualiza o contador assim que a página carrega
document.addEventListener("DOMContentLoaded", function () {
    Carrinho.atualizarContador();
});