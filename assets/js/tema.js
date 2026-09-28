// Carregado no <head>, antes do CSS aparecer, para a página não piscar no tema errado.
// O tema escuro é o padrão do site; respeita a escolha salva caso o usuário tenha alternado.
(function () {
  var tema;
  try { tema = localStorage.getItem("tema"); } catch (e) {}
  if (tema !== "claro" && tema !== "escuro") {
    tema = "escuro";
  }
  document.documentElement.setAttribute("data-tema", tema);
})();
