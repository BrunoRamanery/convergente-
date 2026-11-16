# Convergência

Jogo de computador (Windows) do Torneio de Uno. Feito com Electron; atualiza sozinho pelo GitHub Releases.

## Rodar em modo de desenvolvimento
    npm install
    npm start

## Gerar o instalador
    npm run dist        # cria dist/Convergencia-Setup-<versão>.exe

## Lançar uma atualização
1. Mude `"version"` no `package.json` (ex.: 1.0.0 → 1.1.0).
2. Gere o instalador (`npm run dist`) ou deixe o GitHub fazer: crie a tag `v1.1.0` e envie (`git push --tags`); o workflow `.github/workflows/release.yml` monta e publica.
3. Na Release do GitHub precisam estar: o `.exe`, o `.exe.blockmap` e o `latest.yml`.
4. Quem já tem o jogo instalado recebe o aviso "Nova versão do Convergência" ao abrir.

O repositório precisa ser **público** (BrunoRamanery/convergente-) para a atualização funcionar sem senha.

## Estrutura
- `main.js` — janela do jogo e atualização automática.
- `app/index.html` — o jogo (cartas, motor de luta, torneio, telas).
- `app/img/` — imagens das cartas.
- `docs/index.html` — página de download (GitHub Pages).
- `build/icon.*` — ícone.

Atalhos no jogo: F11 tela cheia · F12 ferramentas de desenvolvedor.

## Testes automáticos (rodar antes de cada versão)
    node tests/tour.js app/index.html     # milhares de torneios em todos os formatos e modos
    node tests/voce.js app/index.html     # Modo Você Luta: decisões, matar/poupar, morte do jogador
    node tests/div.js app/index.html      # calibragem da dificuldade Divina
