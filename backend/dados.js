// Array com as action figures do catálogo
// Cada objeto representa um produto no marketplace

const figuras = [
  {
    id: 1,
    nome: "Guerreiro Estelar",
    preco: 89.90,
    categoria: "ficção científica",
    descricao: "Action figure de guerreiro intergaláctico com armadura futurista e espada de energia.",
    imagem: "http://localhost:3001/img/icon6.png",
    acessorios: ["espada de energia", "escudo magnético"],
    estoque: 12
  },
  {
    id: 2,
    nome: "Samurai das Sombras",
    preco: 74.90,
    categoria: "fantasia",
    descricao: "Samurai misterioso com katana lendária e manto das sombras.",
    imagem: "http://localhost:3001/img/icon2.png",
    acessorios: ["katana", "manto das sombras", "shuriken"],
    estoque: 8
  },
  {
    id: 3,
    nome: "Robô Titã MK-7",
    preco: 129.90,
    categoria: "ficção científica",
    descricao: "Robô gigante articulado com canhão de plasma e sistema de voo.",
    imagem: "http://localhost:3001/img/icon5.png",
    acessorios: ["canhão de plasma", "jetpack"],
    estoque: 5
  },
  {
    id: 4,
    nome: "Arqueira Élfica",
    preco: 69.90,
    categoria: "fantasia",
    descricao: "Elfa arqueira com arco encantado e flechas de cristal.",
    imagem: "http://localhost:3001/img/icon4.png",
    acessorios: ["arco encantado", "aljava de cristal", "capa élfica"],
    estoque: 15
  },
  {
    id: 5,
    nome: "Piloto Velocidade",
    preco: 59.90,
    categoria: "esportes",
    descricao: "Piloto de corrida futurista com capacete holográfico e traje aerodinâmico.",
    imagem: "http://localhost:3001/img/icon1.png",
    acessorios: ["capacete holográfico", "volante magnético"],
    estoque: 20
  },
  {
    id: 6,
    nome: "Viking do Norte",
    preco: 84.90,
    categoria: "história",
    descricao: "Guerreiro viking com machado de guerra e escudo de madeira.",
    imagem: "http://localhost:3001/img/icon3.png",
    acessorios: ["machado de guerra", "escudo de madeira", "elmo com chifres"],
    estoque: 10
  },
  {
    id: 7,
    nome: "Ninja Cyber",
    preco: 94.90,
    categoria: "ficção científica",
    descricao: "Ninja cibernético com lâminas retráteis e camuflagem óptica.",
    imagem: "http://localhost:3001/img/icon7.png",
    acessorios: ["lâminas retráteis", "dispositivo de camuflagem"],
    estoque: 7
  },
  {
    id: 8,
    nome: "Dragão Místico",
    preco: 149.90,
    categoria: "fantasia",
    descricao: "Dragão articulado com asas móveis e sopro de fogo luminoso.",
    imagem: "http://localhost:3001/img/icon6.png",
    acessorios: ["base com pedra mística", "chama LED"],
    estoque: 3
  }
];

module.exports = figuras;
