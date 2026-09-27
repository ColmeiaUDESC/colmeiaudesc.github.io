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

// botão ☀/☾ (o tema inicial é definido por tema.js)
const raiz = document.documentElement;
const botaoTema = document.querySelector(".tema-botao");
const temaSistema = window.matchMedia("(prefers-color-scheme: dark)");
const aplicarTema = (tema) => {
  raiz.setAttribute("data-tema", tema);
  if (botaoTema) botaoTema.setAttribute("aria-label", tema === "escuro" ? "Mudar para o modo claro" : "Mudar para o modo escuro");
};
const temaSalvo = () => {
  try { return localStorage.getItem("tema"); } catch (e) { return null; }
};
aplicarTema(raiz.getAttribute("data-tema") || (temaSistema.matches ? "escuro" : "claro"));
if (botaoTema) {
  botaoTema.addEventListener("click", () => {
    const novo = raiz.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
    aplicarTema(novo);
    try { localStorage.setItem("tema", novo); } catch (e) {}
  });
}
// quem nunca clicou no botão continua acompanhando o sistema
temaSistema.addEventListener("change", (e) => {
  if (!temaSalvo()) aplicarTema(e.matches ? "escuro" : "claro");
});

const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

document.addEventListener("dragstart", (e) => {
  if (e.target.closest && e.target.closest("img, svg")) e.preventDefault();
});
