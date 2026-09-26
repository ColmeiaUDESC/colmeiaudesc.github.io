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
document.querySelectorAll(".menu a").forEach((link) => {
  const href = link.getAttribute("href");
  const id = href.startsWith("#") ? href.slice(1) : href === "distro.html" ? "distro" : null;
  const secao = id && document.getElementById(id);
  if (secao) itensMenu.push({ link, secao });
});

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

const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

document.addEventListener("dragstart", (e) => {
  if (e.target.closest && e.target.closest("img, svg")) e.preventDefault();
});
