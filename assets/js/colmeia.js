const botaoMenu = document.querySelector(".menu-botao");
const menu = document.querySelector(".menu");
if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botaoMenu.setAttribute("aria-expanded", aberto);
  });
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => menu.classList.remove("aberto"))
  );
}

const observador = new IntersectionObserver(
  (entradas) =>
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visivel");
        observador.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".revelar").forEach((el) => observador.observe(el));

const itensMenu = [];
document.querySelectorAll(".menu a:not(.menu-destaque)").forEach((link) => {
  const href = link.getAttribute("href");
  const secao = href.startsWith("#") && document.getElementById(href.slice(1));
  if (secao) itensMenu.push({ link, secao });
});
// a ordem do menu não precisa ser a ordem das seções na página
itensMenu.sort((a, b) => (a.secao.compareDocumentPosition(b.secao) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

if (itensMenu.length) {
  let agendado = false;
  const marcarSecaoAtual = () => {
    agendado = false;
    const linha = window.innerHeight * 0.4;
    let atual = null;
    itensMenu.forEach((item) => {
      if (item.secao.getBoundingClientRect().top <= linha) atual = item;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      atual = itensMenu[itensMenu.length - 1];
    }
    itensMenu.forEach((item) => item.link.classList.toggle("ativo", item === atual));
  };
  window.addEventListener("scroll", () => {
    if (!agendado) {
      agendado = true;
      requestAnimationFrame(marcarSecaoAtual);
    }
  }, { passive: true });
  marcarSecaoAtual();
}

// botão ☀/☾ (o tema inicial é definido por tema.js; padrão escuro)
const raiz = document.documentElement;
const botaoTema = document.querySelector(".tema-botao");
const aplicarTema = (tema) => {
  raiz.setAttribute("data-tema", tema);
  if (botaoTema) botaoTema.setAttribute("aria-label", tema === "escuro" ? "Mudar para o modo claro" : "Mudar para o modo escuro");
};
const temaSalvo = () => {
  try { return localStorage.getItem("tema"); } catch (e) { return null; }
};
aplicarTema(temaSalvo() || raiz.getAttribute("data-tema") || "escuro");
if (botaoTema) {
  botaoTema.addEventListener("click", () => {
    const novo = raiz.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
    aplicarTema(novo);
    try { localStorage.setItem("tema", novo); } catch (e) {}
  });
}

// zoom de imagens: <a href="imagem-grande" data-zoom><img ...></a>
// sem JavaScript o link continua abrindo a imagem normalmente
const linksZoom = document.querySelectorAll("a[data-zoom]");
if (linksZoom.length) {
  const zoom = document.createElement("dialog");
  zoom.className = "zoom";
  zoom.setAttribute("aria-label", "Imagem ampliada");
  zoom.innerHTML = '<img alt=""><button class="zoom-fechar" type="button" aria-label="Fechar">×</button>';
  document.body.append(zoom);
  const imgZoom = zoom.querySelector("img");
  linksZoom.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      imgZoom.src = link.href;
      imgZoom.alt = link.querySelector("img")?.alt || "";
      zoom.showModal();
    })
  );
  // qualquer clique fecha (na imagem, no fundo ou no ×)
  zoom.addEventListener("click", () => zoom.close());
}

const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

document.addEventListener("dragstart", (e) => {
  if (e.target.closest && e.target.closest("img, svg")) e.preventDefault();
});
