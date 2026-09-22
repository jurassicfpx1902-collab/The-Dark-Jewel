# The Dark Jewel

Protótipo 2D de infiltração em JavaScript sem framework.

## Estrutura

- `index.html`: estrutura da aplicação e pontos de montagem da interface.
- `style.css`: estilos da interface, HUD e controles móveis.
- `main.js`: ponto de entrada.
- `game.js`: ciclo principal, estados e renderização.
- `vision.js`: detecção dos inimigos.
- `js/`: módulos independentes do jogo:
  - `audio.js`: efeitos sonoros.
  - `collision.js`: colisões e linha de visão.
  - `controls.js`: teclado, joystick e botões móveis.
  - `enemy.js`: inimigos e patrulha.
  - `missions.js`: objetivos.
  - `navegacao.js`: busca de caminhos.
  - `mapa.js`: paredes, objetos e desenho do mapa.
  - `player.js`: jogador.
  - `radio.js`: diálogos.
  - `ui.js`: telas e HUD.

## Execução

Abra `index.html` por um servidor local ou publique o repositório com GitHub Pages. A ordem dos scripts no HTML é importante porque os módulos usam globais compartilhadas.

As pastas antigas `js/js`, `js/js/js` e `js/css` não fazem parte da versão canônica; os arquivos usados pela aplicação ficam somente na raiz e em `js/`.
