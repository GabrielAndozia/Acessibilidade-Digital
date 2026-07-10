create table usuario (
    id_usuario serial primary key,
    nome varchar(100) not null,
    email varchar(150) not null unique,
    senha varchar(255) not null,
    data_cadastro timestamp not null
);

create table imagem (
    id_imagem serial primary key,
    id_usuario int,
    caminho_arquivo varchar(255) not null,
    data_envio timestamp not null,
    tipo_arquivo varchar(50),

    constraint fk_imagem_usuario
        foreign key (id_usuario)
        references usuario(id_usuario)
);

create table personalizacao (
    id_personalizacao serial primary key,
    id_usuario int not null,
    camisa varchar(100),
    calca varchar(100),
    calcado varchar(100),
    acessorio varchar(100),
    objeto_1 varchar(100),
    objeto_2 varchar(100),
    objeto_3 varchar(100),
    cor_primaria varchar(50),
    nome varchar(100),
    cor_secundaria varchar(50),
    tipo varchar(100)
        check (tipo in ('pre-definida', 'criada')),

    constraint fk_personalizacao_usuario
        foreign key (id_usuario)
        references usuario(id_usuario)
);

create table action_figure (
    id_action_figure serial primary key,
    id_imagem int not null,
    id_personalizacao int not null,
    caminho_gerado varchar(255) not null,
    status_geracao varchar(20) not null,
    data_geracao timestamp not null,
    pose varchar(100),
    fundo varchar(100),
    descricao text,

    constraint fk_action_imagem
        foreign key (id_imagem)
        references imagem(id_imagem),

    constraint fk_action_personalizacao
        foreign key (id_personalizacao)
        references personalizacao(id_personalizacao),

    constraint chk_status
        check (status_geracao in ('processando', 'concluida', 'erro'))
);

select * from usuario

select * from action_figure

select * from imagem

select * from personalizacao