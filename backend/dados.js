// Array com as action figures do catálogo
// Cada objeto representa um produto no marketplace

const figuras = [
  {
    id: 1,
    nome: "Guerreiro Estelar",
    preco: 89.90,
    categoria: "ficção científica",
    descricao: "Action figure de guerreiro intergaláctico com armadura futurista e espada de energia.",
    imagem: "https://placehold.co/300x400/1a1a2e/eaeaea?text=Guerreiro+Estelar",
    acessorios: ["espada de energia", "escudo magnético"],
    estoque: 12
  },
  {
    id: 2,
    nome: "Samurai das Sombras",
    preco: 74.90,
    categoria: "fantasia",
    descricao: "Samurai misterioso com katana lendária e manto das sombras.",
    imagem: "https://placehold.co/300x400/2d132c/eaeaea?text=Samurai+Sombras",
    acessorios: ["katana", "manto das sombras", "shuriken"],
    estoque: 8
  },
  {
    id: 3,
    nome: "Robô Titã MK-7",
    preco: 129.90,
    categoria: "ficção científica",
    descricao: "Robô gigante articulado com canhão de plasma e sistema de voo.",
    imagem: "https://placehold.co/300x400/0f3460/eaeaea?text=Robo+Tita+MK7",
    acessorios: ["canhão de plasma", "jetpack"],
    estoque: 5
  },
  {
    id: 4,
    nome: "Arqueira Élfica",
    preco: 69.90,
    categoria: "fantasia",
    descricao: "Elfa arqueira com arco encantado e flechas de cristal.",
    imagem: "https://placehold.co/300x400/1b4332/eaeaea?text=Arqueira+Elfica",
    acessorios: ["arco encantado", "aljava de cristal", "capa élfica"],
    estoque: 15
  },
  {
    id: 5,
    nome: "Piloto Velocidade",
    preco: 59.90,
    categoria: "esportes",
    descricao: "Piloto de corrida futurista com capacete holográfico e traje aerodinâmico.",
    imagem: "https://placehold.co/300x400/4a0e0e/eaeaea?text=Piloto+Velocidade",
    acessorios: ["capacete holográfico", "volante magnético"],
    estoque: 20
  },
  {
    id: 6,
    nome: "Viking do Norte",
    preco: 84.90,
    categoria: "história",
    descricao: "Guerreiro viking com machado de guerra e escudo de madeira.",
    imagem: "https://placehold.co/300x400/3d0c02/eaeaea?text=Viking+Norte",
    acessorios: ["machado de guerra", "escudo de madeira", "elmo com chifres"],
    estoque: 10
  },
  {
    id: 7,
    nome: "Ninja Cyber",
    preco: 94.90,
    categoria: "ficção científica",
    descricao: "Ninja cibernético com lâminas retráteis e camuflagem óptica.",
    imagem: "https://placehold.co/300x400/16213e/eaeaea?text=Ninja+Cyber",
    acessorios: ["lâminas retráteis", "dispositivo de camuflagem"],
    estoque: 7
  },
  {
    id: 8,
    nome: "Dragão Místico",
    preco: 149.90,
    categoria: "fantasia",
    descricao: "Dragão articulado com asas móveis e sopro de fogo luminoso.",
    imagem: "https://placehold.co/300x400/4a1942/eaeaea?text=Dragao+Mistico",
    acessorios: ["base com pedra mística", "chama LED"],
    estoque: 3
  }
];

module.exports = figuras;
