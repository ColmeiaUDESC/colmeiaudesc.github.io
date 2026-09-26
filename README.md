# Colmeia UDESC

Site oficial do **Colmeia**, grupo de extensão *Socialização em Software Livre e Hardware Livre* do Centro de Ciências Tecnológicas (CCT) da UDESC, em Joinville.

Acesse: https://colmeiaudesc.github.io

## Sobre o Colmeia

O Colmeia existe desde 2002 e leva conhecimento sobre software e hardware livre para escolas, universidades e para a comunidade. O grupo foi criado pelos professores Kariston Pereira e Claudio César de Sá e hoje é coordenado pelos professores Gilmário Barbosa dos Santos e Rafael Kingeski.

Entre as atividades do grupo estão:

- aulas e minicursos de programação com ferramentas livres, como o Projeto Resgate;
- caravanas para eventos como a Latinoware;
- organização do FLISoL, o Festival Latino-americano de Instalação de Software Livre;
- produção de vídeos e materiais abertos no YouTube;
- desenvolvimento da **Colmeia Linux**, uma distribuição baseada em Debian para estudantes que estão começando no Linux.

Para participar não é obrigatório cursar Ciência da Computação.

## O site

O site tem duas páginas:

- **Página inicial** (`index.html`): quem somos, projetos, membros e contato.
- **Colmeia Linux** (`distro.html`): apresentação da distro, download, como testar em máquina virtual, como gerar a ISO e próximos passos.

Foi feito só com HTML, CSS e JavaScript, sem etapas de build e sem dependências. O GitHub Pages publica os arquivos direto da branch principal.

```
index.html
distro.html
assets/
  css/colmeia.css
  js/colmeia.js
  img/            logos, mascote, foto do grupo e fundo de favos
```

## Ver o site no seu computador

Abra o `index.html` no navegador. Se preferir servir a pasta:

```sh
python -m http.server 8000
```

Depois acesse http://localhost:8000.

## Como editar

**Membros.** Ficam na seção `#membros` do `index.html`, organizados como uma colmeia. Cada membro é um bloco `favo` com uma abelha, o nome e o curso:

- `favo-bolsista`: favo cheio de mel, com a etiqueta "Bolsista";
- `favo-voluntario`: favo vazado, com a etiqueta "Voluntário";
- `favo-rainha`: coordenação.

Os favos ficam em fileiras (`favo-linha`). Fileiras vizinhas precisam ter um favo de diferença (por exemplo 2, 3, 2, 1) para os hexágonos se encaixarem. Se não der (ex.: uma fileira de 1 embaixo de uma de 3), adicione `favo-linha-meia` na fileira de baixo para deslocá-la meio favo.

Cada abelha pode ter um acessório: `ac-oculos`, `ac-laco`, `ac-fone`, `ac-bone`, `ac-gorro`, `ac-notebook`, `ac-cafe`, `ac-escuros`, `ac-gravata` ou `ac-coroa`. Basta trocar o `href` do segundo `<use>` dentro do favo.

**Projetos.** Seção `#projetos` do `index.html`. Para adicionar um projeto, copie um bloco `card`.

**Colmeia Linux.** Versões para download, instruções e roadmap ficam em `distro.html`.

**Cores.** As cores da identidade visual estão no início do `assets/css/colmeia.css`: amarelo `#FFCD2C`, creme `#FFE4A5` e grafite `#414042`.

## Contribuindo

1. Faça um fork deste repositório.
2. Crie uma branch para a sua alteração.
3. Confira o resultado no navegador, no computador e no celular.
4. Abra um pull request explicando o que mudou.

## Contato

- E-mail: colmeiacct@gmail.com
- GitHub: [@colmeiaUDESC](https://github.com/colmeiaUDESC)
- Instagram: [@colmeiaudesc](https://instagram.com/colmeiaudesc)
- YouTube: [Canal do Colmeia](https://www.youtube.com/channel/UC51KrWL94AfGxI_4l_E7uzA)

## Licença

Veja o arquivo `LICENSE`. Os logos da UDESC e do Colmeia pertencem às respectivas instituições.
