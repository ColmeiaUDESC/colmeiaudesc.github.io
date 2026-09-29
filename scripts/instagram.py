"""Baixa os posts do Instagram do Colmeia para o blog do site.

Roda no GitHub Actions (.github/workflows/instagram.yml). Usa a API oficial do
Instagram (Instagram API with Instagram Login), que precisa de um token de acesso
de uma conta profissional (Criador de conteúdo ou Empresa), guardado no secret IG_TOKEN.

Gera assets/instagram/posts.json e salva as imagens em assets/instagram/, porque
os links de mídia que a API devolve expiram depois de alguns dias.

Sem dependências: só a biblioteca padrão do Python 3.
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API = "https://graph.instagram.com"
CAMPOS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}"
# IG_LIMITE=0 (padrão) busca todos os posts; um número limita aos mais recentes
LIMITE_POSTS = int(os.environ.get("IG_LIMITE") or 0)
POR_PAGINA = 50
LIMITE_MIDIAS_CARROSSEL = 10

RAIZ = Path(__file__).resolve().parent.parent
PASTA = RAIZ / "assets" / "instagram"
JSON = PASTA / "posts.json"


class ErroApi(Exception):
    pass


def get_json(url, params=None):
    if params:
        url = f"{url}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as erro:
        # nunca mostra a URL: ela contém o token
        raise ErroApi(f"erro {erro.code} da API do Instagram: {erro.read().decode('utf-8', 'replace')}") from None


def baixar(url, destino):
    if destino.exists():
        return
    with urllib.request.urlopen(url, timeout=60) as resp:
        destino.write_bytes(resp.read())


def renovar_token(token):
    """Tokens de longa duração valem 60 dias; renovar a cada execução mantém o token vivo."""
    try:
        dados = get_json(f"{API}/refresh_access_token", {"grant_type": "ig_refresh_token", "access_token": token})
    except ErroApi as erro:
        # acontece, por exemplo, com token criado há menos de 24 h; segue com o atual
        print(f"Aviso: não deu para renovar o token ({erro})")
        return token
    novo = dados.get("access_token")
    saida = os.environ.get("RUNNER_TEMP")
    if novo and novo != token and saida:
        # o workflow grava o token novo no secret (se houver um PAT configurado)
        Path(saida, "ig_token").write_text(novo)
        print(f"::add-mask::{novo}")
    return novo or token


def main():
    token = os.environ.get("IG_TOKEN", "").strip()
    if not token:
        print("IG_TOKEN não configurado: nada a fazer. Veja a seção Blog no README.")
        return

    token = renovar_token(token)
    itens = []
    url, params = f"{API}/me/media", {"fields": CAMPOS, "limit": POR_PAGINA, "access_token": token}
    try:
        # a API devolve os posts em páginas; segue o link "next" até acabar
        while url and (not LIMITE_POSTS or len(itens) < LIMITE_POSTS):
            pagina = get_json(url, params)
            itens += pagina.get("data", [])
            url, params = pagina.get("paging", {}).get("next"), None
            print(f"{len(itens)} posts lidos...")
    except ErroApi as erro:
        sys.exit(f"Não deu para buscar os posts: {erro}")
    if LIMITE_POSTS:
        itens = itens[:LIMITE_POSTS]

    PASTA.mkdir(parents=True, exist_ok=True)
    usados = {JSON.name}
    posts = []

    for item in itens:
        filhos = item.get("children", {}).get("data") or [item]
        midias = []
        for filho in filhos[:LIMITE_MIDIAS_CARROSSEL]:
            video = filho.get("media_type") == "VIDEO"
            url = filho.get("thumbnail_url") if video else filho.get("media_url")
            if not url:
                continue
            arquivo = f"{filho['id']}.jpg"
            baixar(url, PASTA / arquivo)
            usados.add(arquivo)
            midias.append({"src": f"assets/instagram/{arquivo}", "video": video})
        if not midias:
            continue
        posts.append({
            "id": item["id"],
            "tipo": item.get("media_type"),
            "legenda": item.get("caption", ""),
            # a API manda "+0000"; o Safari só entende "+00:00"
            "data": datetime.strptime(item["timestamp"], "%Y-%m-%dT%H:%M:%S%z").isoformat(),
            "link": item.get("permalink"),
            "midias": midias,
        })

    # apaga imagens de posts que saíram da lista (ou foram apagados no Instagram)
    for arquivo in PASTA.iterdir():
        if arquivo.name not in usados:
            arquivo.unlink()

    antigo = json.loads(JSON.read_text(encoding="utf-8")) if JSON.exists() else {}
    if antigo.get("posts") == posts:
        print("Nenhum post novo.")
        return

    JSON.write_text(json.dumps({
        "perfil": "colmeiaudesc",
        "atualizado": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "posts": posts,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(posts)} posts salvos.")


if __name__ == "__main__":
    main()
