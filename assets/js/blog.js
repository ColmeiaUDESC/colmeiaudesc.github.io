// Blog: lê assets/instagram/posts.json (gerado por scripts/instagram.py) e abre cada post num modal.

const POR_PAGINA = 12;
const grade = document.getElementById("posts");
const aviso = document.getElementById("posts-aviso");
const botaoMais = document.getElementById("posts-mais");
const modal = document.getElementById("post-modal");
const areaMidia = document.getElementById("post-midia");

const formatoData = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" });
let posts = [];
let mostrados = 0;
let navegarCarrossel = null; // setas do teclado no carrossel aberto

const icones = {
  carrossel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="7" width="14" height="14" rx="2"/><path d="M3 17V5a2 2 0 0 1 2-2h12"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  anterior: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  proximo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
};

const primeiraLinha = (texto) => (texto || "").split("\n").find((l) => l.trim()) || "";
const resumo = (texto, max = 110) => {
  const t = (texto || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).replace(/\s\S*$/, "") + "…" : t;
};

function mostrarAviso(html) {
  aviso.innerHTML = html;
  aviso.hidden = false;
}

function criarCard(post) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "post-card";
  card.setAttribute("aria-label", `Abrir post: ${resumo(primeiraLinha(post.legenda), 80) || "sem legenda"}`);

  const capa = document.createElement("div");
  capa.className = "post-capa";
  const img = document.createElement("img");
  img.src = post.midias[0].src;
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  capa.append(img);
  const ehVideo = post.tipo === "VIDEO";
  if (ehVideo || post.midias.length > 1) {
    const selo = document.createElement("span");
    selo.className = "post-tipo";
    selo.innerHTML = ehVideo ? icones.video : icones.carrossel;
    capa.append(selo);
  }

  const texto = document.createElement("div");
  texto.className = "post-texto";
  const data = document.createElement("time");
  data.dateTime = post.data;
  data.textContent = formatoData.format(new Date(post.data));
  const p = document.createElement("p");
  p.textContent = resumo(post.legenda) || "Ver post";
  texto.append(data, p);

  card.append(capa, texto);
  card.addEventListener("click", () => abrir(post));
  return card;
}

function mostrarMais() {
  const fatia = posts.slice(mostrados, mostrados + POR_PAGINA);
  grade.append(...fatia.map(criarCard));
  mostrados += fatia.length;
  botaoMais.hidden = mostrados >= posts.length;
}

// legenda com quebras de linha, e #hashtags / @menções / links clicáveis
function legendaComLinks(texto) {
  const frag = document.createDocumentFragment();
  const padrao = /(https?:\/\/[^\s]+)|#([\p{L}\p{N}_]+)|@([A-Za-z0-9._]+)/gu;
  let ultimo = 0;
  for (const m of texto.matchAll(padrao)) {
    frag.append(texto.slice(ultimo, m.index));
    const a = document.createElement("a");
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = m[0];
    if (m[1]) a.href = m[1];
    else if (m[2]) a.href = `https://www.instagram.com/explore/tags/${encodeURIComponent(m[2])}/`;
    else a.href = `https://www.instagram.com/${m[3]}/`;
    frag.append(a);
    ultimo = m.index + m[0].length;
  }
  frag.append(texto.slice(ultimo));
  return frag;
}

function codigoDoPost(link) {
  const m = /instagram\.com\/(?:p|reel|tv)\/([^/?#]+)/.exec(link || "");
  return m && m[1];
}

function montarMidia(post) {
  areaMidia.replaceChildren();
  areaMidia.classList.remove("post-midia-video");
  navegarCarrossel = null;

  // vídeo: usa o player oficial do Instagram
  const codigo = codigoDoPost(post.link);
  if (post.tipo === "VIDEO" && codigo) {
    areaMidia.classList.add("post-midia-video");
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.instagram.com/p/${codigo}/embed/`;
    iframe.title = "Vídeo do Instagram";
    iframe.loading = "lazy";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.setAttribute("allowfullscreen", "");
    areaMidia.append(iframe);
    return;
  }

  const trilho = document.createElement("div");
  trilho.className = "post-trilho";
  post.midias.forEach((midia, i) => {
    const img = document.createElement("img");
    img.src = midia.src;
    img.alt = post.midias.length > 1 ? `Imagem ${i + 1} de ${post.midias.length}` : "";
    img.decoding = "async";
    trilho.append(img);
  });
  areaMidia.append(trilho);
  if (post.midias.length < 2) return;

  const pontos = document.createElement("div");
  pontos.className = "post-pontos";
  post.midias.forEach(() => pontos.append(document.createElement("i")));
  const anterior = document.createElement("button");
  const proximo = document.createElement("button");
  anterior.className = "post-seta post-seta-anterior";
  proximo.className = "post-seta post-seta-proximo";
  anterior.type = proximo.type = "button";
  anterior.setAttribute("aria-label", "Imagem anterior");
  proximo.setAttribute("aria-label", "Próxima imagem");
  anterior.innerHTML = icones.anterior;
  proximo.innerHTML = icones.proximo;
  areaMidia.append(anterior, proximo, pontos);

  const irPara = (i) => trilho.scrollTo({ left: i * trilho.clientWidth, behavior: "smooth" });
  const atual = () => Math.round(trilho.scrollLeft / trilho.clientWidth);
  const atualizar = () => {
    const i = atual();
    [...pontos.children].forEach((p, j) => p.classList.toggle("ativo", j === i));
    anterior.hidden = i === 0;
    proximo.hidden = i === post.midias.length - 1;
  };
  anterior.addEventListener("click", () => irPara(atual() - 1));
  proximo.addEventListener("click", () => irPara(atual() + 1));
  trilho.addEventListener("scroll", () => requestAnimationFrame(atualizar), { passive: true });
  navegarCarrossel = (passo) => irPara(atual() + passo);
  atualizar();
}

function abrir(post, { atualizarUrl = true } = {}) {
  montarMidia(post);
  const data = document.getElementById("post-data");
  data.dateTime = post.data;
  data.textContent = formatoData.format(new Date(post.data));
  document.getElementById("post-legenda").replaceChildren(legendaComLinks(post.legenda || ""));
  document.getElementById("post-link").href = post.link;
  if (atualizarUrl) history.replaceState(null, "", `#post-${post.id}`);
  if (!modal.open) modal.showModal();
  modal.querySelector(".post-lado").scrollTop = 0;
}

modal.addEventListener("close", () => {
  areaMidia.replaceChildren(); // para o vídeo, se estiver tocando
  history.replaceState(null, "", location.pathname + location.search);
});
document.getElementById("post-fechar").addEventListener("click", () => modal.close());
// clicar fora do conteúdo (no fundo escuro) fecha
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});
modal.addEventListener("keydown", (e) => {
  if (!navegarCarrossel || e.target.closest("a")) return;
  if (e.key === "ArrowLeft") navegarCarrossel(-1);
  if (e.key === "ArrowRight") navegarCarrossel(1);
});
botaoMais.addEventListener("click", mostrarMais);

function abrirPeloEndereco() {
  const id = location.hash.startsWith("#post-") && location.hash.slice(6);
  const post = id && posts.find((p) => p.id === id);
  if (post) abrir(post, { atualizarUrl: false });
}
window.addEventListener("hashchange", abrirPeloEndereco);

fetch("assets/instagram/posts.json", { cache: "no-cache" })
  .then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then((dados) => {
    posts = (dados.posts || []).filter((p) => p.midias && p.midias.length);
    if (!posts.length) {
      mostrarAviso('As postagens aparecem aqui em breve. Enquanto isso, siga a gente no <a href="https://instagram.com/colmeiaudesc" target="_blank" rel="noopener">@colmeiaudesc</a>.');
      return;
    }
    mostrarMais();
    abrirPeloEndereco();
  })
  .catch(() => {
    mostrarAviso('Não foi possível carregar as postagens agora. Veja direto no <a href="https://instagram.com/colmeiaudesc" target="_blank" rel="noopener">Instagram</a>.');
  });
