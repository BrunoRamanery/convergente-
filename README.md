# Convergência

Jogo de computador (Windows) do Torneio de Uno. Feito com Electron; atualiza pelo botão Atualizar (direto do GitHub).

## Rodar em modo de desenvolvimento
    npm install
    npm start

## Gerar o instalador
    npm run dist        # cria dist/Convergencia-Setup-<versão>.exe

## Atualizar o jogo (botão Atualizar)
Quem já tem o jogo instalado (versão 1.3.0 ou mais nova) clica em **Atualizar**, no canto de cima da tela. O jogo compara a versão do GitHub com a dele e baixa só os arquivos que mudaram, sem reinstalar.

Para lançar uma atualização assim:
1. Coloque o jogo novo em `app/` (`index.html` e `img/`).
2. Atualize `app/manifest.json`: a `version` nova e a lista de arquivos com o SHA-1 de cada um (o script de montagem já gera).
3. Faça commit e envie para a branch `main`. Pronto: o botão já encontra a versão nova.

## Novo instalador (para quem ainda não tem o jogo)
1. Mude `"version"` no `package.json`.
2. Crie a tag e envie (`git tag v1.3.0 && git push --tags`): o workflow `.github/workflows/release.yml` monta o `.exe` e publica na Release.
3. Quem tem uma versão antiga sem o botão Atualizar (1.2.0) recebe o instalador novo pelo aviso automático ao abrir o jogo.

O repositório precisa ser **público** (BrunoRamanery/convergente-) para a atualização funcionar sem senha.

## Estrutura
- `main.js` — janela do jogo e botão Atualizar.
- `preload.js` — ponte entre o jogo e o aplicativo (só o Atualizar).
- `app/manifest.json` — versão do jogo e lista de arquivos, usada pelo Atualizar.
- `app/index.html` — o jogo (cartas, motor de luta, torneio, telas).
- `app/img/` — imagens das cartas.
- `docs/index.html` — página de download (GitHub Pages).
- `build/icon.*` — ícone.

Atalhos no jogo: F11 tela cheia · F12 ferramentas de desenvolvedor.

## Testes automáticos (rodar antes de cada versão)
    node tests/tour.js app/index.html     # milhares de torneios em todos os formatos e modos
    node tests/voce.js app/index.html     # Modo Você Luta: decisões, matar/poupar, morte do jogador
    node tests/div.js app/index.html      # calibragem da dificuldade Divina
