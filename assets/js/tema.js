// Carregado no <head>, antes do CSS aparecer, para a página não piscar no tema errado.
// Usa a escolha salva pelo botão ☀/☾; sem escolha, segue o tema do sistema.
(function () {
  var tema;
  try { tema = localStorage.getItem("tema"); } catch (e) {}
  if (tema !== "claro" && tema !== "escuro") {
    tema = window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
  }
  document.documentElement.setAttribute("data-tema", tema);
})();
