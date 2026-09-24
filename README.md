# The Dark Jewel

Protótipo de jogo 2D de infiltração e espionagem, com estética pixel art e foco em missões táticas, sabotagem, furtividade e investigação narrativa.

> **Nota de escopo:** este repositório contém um protótipo experimental. A identidade visual, os personagens, as organizações e os acontecimentos são criações próprias do projeto.

## Modelo principal da história

A história acompanha momentos antes da história literária **2001:Eclipse**, contando momentos um pouco antes da obra. O jogo tenta retratar 4 casos que ocorrem antes ou no mesmo momento da operação **2001:Eclipse**.

A primeira acompanha **Buck Kosmatov**, um agente veterano que invade uma instalação da organização secreta **Dark Obsidian**, onde, tentando encontrar informações necessárias para entender o plano da organização, Buck teve que se preocupar em se infiltrar, desviar dos guardas e não ser percebido.

O foco do jogo é se inspirar em infiltrações reais e dar ao jogador uma perspectiva de como um agente se infiltra em locais de grande risco. O objetivo é evitar inimigos e concluir objetivos perfeitamente, onde um erro pode custar toda a missão.

## Estrutura narrativa do protótipo

O protótipo será organizado em quatro casos, cada um com um personagem, uma missão e uma abordagem de infiltração diferentes. Os casos devem funcionar de maneira independente, mas também revelar informações coletáveis que conectam os acontecimentos à operação **2001:Eclipse**.

### Caso 01 — Buck Kosmatov

Buck invade uma instalação da Dark Obsidian para recuperar informações sobre o plano da organização. A missão apresenta os fundamentos de movimentação furtiva, patrulhas, detecção, distração e sabotagem.

### Mecânica de sabotagem

A sabotagem é uma ferramenta de planejamento. O jogador poderá interferir em elementos do cenário para criar oportunidades de infiltração, por exemplo:

- desativar a iluminação de um corredor;
- desligar câmeras temporariamente;
- alterar rotas de patrulha;
- provocar uma distração em uma área específica;
- abrir ou bloquear portas;
- interferir em alarmes e sistemas de segurança.

Cada ação deve ter consequências. Uma sabotagem pode criar uma passagem segura, mas também gerar ruído, deslocar guardas ou aumentar o nível de alerta da instalação.

## Menu do protótipo

- **INICIAR**
- **CONTINUAR** — mostra a missão atual e o tempo de jogo quando houver um salvamento.
- **CONFIGURAÇÕES**
  - Idioma: Português (BR) ou English
  - Áudio: ligado ou desligado
- **COLETÁVEIS** — documentos, gravações e outros elementos essenciais para compreender a história.
- **SAIR**

## Direção do projeto

- Engine planejada: Godot 4 para a versão definitiva.
- Protótipo atual: aplicação 2D jogável para testar menu, interface e sistemas de infiltração.
- Perspectiva: visão superior ou levemente inclinada.
- Arte: pixel art com paleta escura, militar e retrô.
- Atmosfera: tensão, espionagem, vigilância, instalações de alto risco e tecnologia analógica.
- Prioridade: furtividade, leitura do ambiente, planejamento e consequências das ações.

## Estrutura atual

- `index.html`: estrutura da aplicação e pontos de montagem da interface.
- `style.css`: estilos da interface, HUD e controles móveis.
- `main.js`: ponto de entrada.
- `game.js`: ciclo principal, estados e renderização.
- `vision.js`: detecção dos inimigos.
- `js/`: módulos independentes do jogo:
  - `audio.js`: efeitos sonoros;
  - `collision.js`: colisões e linha de visão;
  - `controls.js`: teclado, joystick e botões móveis;
  - `enemy.js`: inimigos e patrulha;
  - `missions.js`: objetivos;
  - `navegacao.js`: busca de caminhos;
  - `mapa.js`: paredes, objetos e desenho do mapa;
  - `player.js`: jogador;
  - `radio.js`: diálogos;
  - `ui.js`: telas e HUD.

## Execução local

Na raiz do repositório, execute:

```bash
python3 -m http.server 8000
```

Depois abra:

```text
http://localhost:8000/Prototype-0.0/
```

A versão atual é um protótipo inicial. A missão de Buck Kosmatov, o sistema completo de sabotagem e os quatro casos serão desenvolvidos progressivamente.
