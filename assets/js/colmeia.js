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

const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

document.addEventListener("dragstart", (e) => {
  if (e.target.closest && e.target.closest("img, svg")) e.preventDefault();
});
