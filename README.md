# Site do Colmeia UDESC

Site do grupo de extensão **Socialização em Software Livre e Hardware Livre (Colmeia)** (UDESC/CCT), incluindo a página da **Colmeia Linux**, nossa distro baseada em Debian.

HTML, CSS e JavaScript puros, sem build, sem dependências. Funciona direto no GitHub Pages.

## Estrutura

```
index.html          página principal (sobre, projetos, membros, contato)
distro.html         página da Colmeia Linux (download, testar em VM, build, roadmap)
assets/css/colmeia.css
assets/js/colmeia.js menu mobile, avatares dos membros, animações
assets/img/          logos, mascote e foto do grupo (extraídos da identidade visual oficial)
```

## Rodar localmente

Abra o `index.html` no navegador, ou sirva a pasta:

```bash
python -m http.server 8000
# acesse http://localhost:8000
```

## Editar

- **Membros:** em `index.html`, seção `#membros`, adicione/remova blocos `<div class="membro">`. As iniciais e a contagem são geradas sozinhas.
- **Projetos:** seção `#projetos`, copie um `<div class="card">`.
- **Versões da distro:** tabela em `distro.html#download`.
- **Cores:** variáveis no topo de `assets/css/colmeia.css`.

## Publicar no GitHub Pages

1. Suba estes arquivos na raiz do repositório.
2. *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`*.
3. O site fica em `https://<usuario>.github.io/<repositorio>/`.

## Licença

Código sob [MIT](LICENSE). Conteúdo textual sob CC BY-SA 4.0.
