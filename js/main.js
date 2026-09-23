"use strict";

const translations = {
  en: {
    eyebrow: "W.B. GLOBAL DEFENSE // SECURE CHANNEL",
    subtitle: "OPERATION // NO DARK",
    start: "START",
    settings: "SETTINGS",
    credits: "CREDITS",
    exit: "EXIT",
    offline: "OFFLINE BUILD",
    language: "LANGUAGE",
    audio: "AUDIO",
    back: "BACK",
    partnershipLabel: "PARTNERSHIP",
    authorLabel: "AUTHOR",
    creatorLabel: "CREATOR",
    author: "O Escritor",
    startMessage: "Mission briefing loaded.",
    exitMessage: "The prototype is ready to close. You can safely leave this page.",
    classification: "CLASSIFIED // MISSION BRIEFING",
    operationTitle: "OPERATION: NO DARK",
    agentLabel: "AGENT:",
    department: "GLOBAL DEFENSE DEPARTMENT / CIA",
    radioInteraction: "RADIO INTERACTION",
    secureChannel: "SECURE CHANNEL",
    radioMessage: "— Buck, recover the files and proceed to the extraction point.",
    continue: "CONTINUE"
  },
  pt: {
    eyebrow: "DEFESA GLOBAL W.B. // CANAL SEGURO",
    subtitle: "OPERAÇÃO // NO DARK",
    start: "INICIAR",
    settings: "CONFIGURAÇÕES",
    credits: "CRÉDITOS",
    exit: "SAIR",
    offline: "VERSÃO OFFLINE",
    language: "IDIOMA",
    audio: "ÁUDIO",
    back: "VOLTAR",
    partnershipLabel: "PARCERIA",
    authorLabel: "AUTOR",
    creatorLabel: "CRIADOR",
    author: "O Escritor",
    startMessage: "Briefing da missão carregado.",
    exitMessage: "O protótipo está pronto para ser fechado. Você pode sair desta página.",
    classification: "CLASSIFICADO // BRIEFING DA MISSÃO",
    operationTitle: "OPERAÇÃO: NO DARK",
    agentLabel: "AGENTE:",
    department: "DEPARTAMENTO DE DEFESA GLOBAL / CIA",
    radioInteraction: "INTERAÇÃO DE RÁDIO",
    secureChannel: "CANAL SEGURO",
    radioMessage: "— Buck, recupere os arquivos e vá para o ponto de extração.",
    continue: "CONTINUAR"
  }
};

const state = {
  language: localStorage.getItem("tdj-language") || "en",
  audio: localStorage.getItem("tdj-audio") !== "off"
};

let audioContext = null;
let audioInterval = null;
let audioStep = 0;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const text = (key) => translations[state.language][key] || translations.en[key] || key;

function ensureAudio() {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioContext = new Ctx();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (audioInterval) return;

  const sequence = [180, 220, 164.81, 174.61, 220, 196, 146.83, 174.61];
  audioInterval = setInterval(() => {
    if (!state.audio || !audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const freq = sequence[audioStep % sequence.length];

    osc.type = "sawtooth";
    osc.frequency.value = freq;
    gain.gain.value = 0.03;
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);
    audioStep += 1;
  }, 380);
}

function applyLanguage() {
  document.documentElement.lang = state.language === "pt" ? "pt-BR" : "en";
  $$('[data-i18n]').forEach((element) => {
    element.textContent = text(element.dataset.i18n);
  });
  $$('[data-language]').forEach((button) => {
    button.classList.toggle("active", button.dataset.language === state.language);
  });
  updateAudioButton();
}

function updateAudioButton() {
  const toggle = $("#audio-toggle");
  const label = $("#audio-state");
  if (!toggle || !label) return;
  toggle.classList.toggle("off", !state.audio);
  toggle.setAttribute("aria-pressed", String(state.audio));
  label.textContent = state.audio ? "ON" : "OFF";
}

function showModal(id) {
  const modal = $(`#${id}-modal`);
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = $(`#${id}-modal`);
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function showMission() {
  ensureAudio();
  $("#main-menu").classList.add("hidden");
  $("#mission-screen").classList.remove("hidden");
  $("#mission-screen").setAttribute("aria-hidden", "false");
}

function hideMission() {
  $("#mission-screen").classList.add("hidden");
  $("#mission-screen").setAttribute("aria-hidden", "true");
  $("#main-menu").classList.remove("hidden");
}

function showScene() {
  ensureAudio();
  $("#mission-screen").classList.add("hidden");
  $("#scene-screen").classList.remove("hidden");
  $("#scene-screen").setAttribute("aria-hidden", "false");
  if (!gameState.started) startGame();
}

let gameState = {
  started: false,
  keys: {},
  player: null,
  enemies: [],
  objective: null,
  walls: [],
  lastTs: 0,
  alert: false,
  won: false,
  lost: false
};

function rectsIntersect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function startGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  gameState.started = true;
  gameState.canvas = canvas;
  gameState.ctx = ctx;
  gameState.player = { x: 70, y: 280, r: 12, speed: 2.4 };
  gameState.enemy = {
    x: 560,
    y: 100,
    r: 12,
    speed: 1.3,
    patrol: [
      { x: 580, y: 100 },
      { x: 650, y: 100 },
      { x: 650, y: 300 },
      { x: 520, y: 300 },
      { x: 520, y: 180 },
      { x: 580, y: 150 }
    ],
    targetIndex: 0
  };

  gameState.objective = { x: 690, y: 285, r: 12 };
  gameState.walls = [
    { x: 0, y: 0, w: 760, h: 20 },
    { x: 0, y: 0, w: 20, h: 420 },
    { x: 740, y: 0, w: 20, h: 420 },
    { x: 0, y: 400, w: 760, h: 20 },
    { x: 120, y: 80, w: 120, h: 18 },
    { x: 120, y: 250, w: 120, h: 18 },
    { x: 360, y: 80, w: 120, h: 18 },
    { x: 360, y: 250, w: 120, h: 18 },
    { x: 300, y: 150, w: 18, h: 120 },
    { x: 520, y: 120, w: 18, h: 120 },
    { x: 590, y: 70, w: 80, h: 18 },
    { x: 610, y: 320, w: 90, h: 18 },
    { x: 210, y: 330, w: 100, h: 18 }
  ];

  requestAnimationFrame(gameLoop);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function moveEntity(entity, dx, dy) {
  const nextX = entity.x + dx;
  const nextY = entity.y + dy;
  const test = { x: nextX - entity.r, y: nextY - entity.r, w: entity.r * 2, h: entity.r * 2 };

  for (const wall of gameState.walls) {
    if (rectsIntersect(test, wall)) return false;
  }

  entity.x = clamp(nextX, 18, 742);
  entity.y = clamp(nextY, 18, 382);
  return true;
}

function updatePlayer() {
  if (!gameState.player || gameState.won || gameState.lost) return;
  let dx = 0;
  let dy = 0;

  if (gameState.keys.ArrowLeft || gameState.keys.a) dx -= gameState.player.speed;
  if (gameState.keys.ArrowRight || gameState.keys.d) dx += gameState.player.speed;
  if (gameState.keys.ArrowUp || gameState.keys.w) dy -= gameState.player.speed;
  if (gameState.keys.ArrowDown || gameState.keys.s) dy += gameState.player.speed;

  const len = Math.hypot(dx, dy) || 1;
  if (dx || dy) {
    const nx = dx / len;
    const ny = dy / len;
    moveEntity(gameState.player, nx * gameState.player.speed, ny * gameState.player.speed);
  }

  const dist = Math.hypot(gameState.player.x - gameState.objective.x, gameState.player.y - gameState.objective.y);
  if (dist < 18) {
    gameState.won = true;
    showToast("OBJECTIVE SECURED — EXTRACTION READY");
  }
}

function updateEnemy() {
  if (!gameState.enemy || gameState.won || gameState.lost) return;
  const target = gameState.enemy.patrol[gameState.enemy.targetIndex];
  const dx = target.x - gameState.enemy.x;
  const dy = target.y - gameState.enemy.y;
  const dist = Math.hypot(dx, dy);

  if (dist > 3) {
    const nx = dx / dist;
    const ny = dy / dist;
    const step = gameState.enemy.speed;
    moveEntity(gameState.enemy, nx * step, ny * step);
  } else {
    gameState.enemy.targetIndex = (gameState.enemy.targetIndex + 1) % gameState.enemy.patrol.length;
  }

  const d = Math.hypot(gameState.player.x - gameState.enemy.x, gameState.player.y - gameState.enemy.y);
  if (d < 110) {
    gameState.lost = true;
    showToast("ALERT — DETECTED BY ENEMY");
  }
}

function drawWalls() {
  const ctx = gameState.ctx;
  ctx.fillStyle = "#919397";
  for (const wall of gameState.walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(wall.x, wall.y + wall.h - 4, wall.w, 4);
    ctx.fillStyle = "#919397";
  }
}

function drawMap() {
  const ctx = gameState.ctx;
  ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
  ctx.fillStyle = "#212b2f";
  ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);

  ctx.fillStyle = "rgba(180,190,191,0.12)";
  for (let x = 0; x < gameState.canvas.width; x += 32) {
    ctx.fillRect(x, 0, 1, gameState.canvas.height);
  }
  for (let y = 0; y < gameState.canvas.height; y += 32) {
    ctx.fillRect(0, y, gameState.canvas.width, 1);
  }

  drawWalls();

  ctx.fillStyle = "#5dd7ff";
  ctx.beginPath();
  ctx.arc(gameState.objective.x, gameState.objective.y, 12, 0, Math.PI * 2);
  ctx.fill();

  const player = gameState.player;
  ctx.fillStyle = "#d6c7a6";
  ctx.beginPath();
  ctx.arc(player.x, player.y - 4, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#222f38";
  ctx.fillRect(player.x - 8, player.y + 4, 16, 18);

  const enemy = gameState.enemy;
  ctx.fillStyle = "#7a7f85";
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y - 4, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#252d31";
  ctx.fillRect(enemy.x - 9, enemy.y + 4, 18, 18);
  ctx.fillStyle = "#90bfe8";
  ctx.fillRect(enemy.x - 4, enemy.y + 6, 8, 4);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "12px 'Share Tech Mono', monospace";
  ctx.fillText("OBJECTIVE", 620, 30);
  ctx.fillText("ALERT", 28, 30);

  if (gameState.lost) {
    ctx.fillStyle = "rgba(14, 20, 24, 0.8)";
    ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
    ctx.fillStyle = "#f3f3f3";
    ctx.font = "bold 32px 'Share Tech Mono', monospace";
    ctx.fillText("DETECTED", 255, 210);
    ctx.font = "16px 'Share Tech Mono', monospace";
    ctx.fillText("PRESS ESC TO RETURN", 250, 250);
  }

  if (gameState.won) {
    ctx.fillStyle = "rgba(11, 28, 18, 0.76)";
    ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
    ctx.fillStyle = "#dfeadf";
    ctx.font = "bold 28px 'Share Tech Mono', monospace";
    ctx.fillText("MISSION ACCOMPLISHED", 190, 205);
    ctx.font = "16px 'Share Tech Mono', monospace";
    ctx.fillText("EXTRACTION READY", 285, 245);
  }
}

function gameLoop(ts) {
  if (!gameState.started) return;

  if (!gameState.lastTs) gameState.lastTs = ts;
  const delta = ts - gameState.lastTs;
  gameState.lastTs = ts;

  if (!gameState.won && !gameState.lost) {
    updatePlayer();
    updateEnemy();
  }

  drawMap();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  gameState.keys[event.key] = true;
  gameState.keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
  gameState.keys[event.key] = false;
  gameState.keys[event.key.toLowerCase()] = false;
});

$$('[data-action]').forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "settings") showModal("settings");
    if (action === "credits") showModal("credits");
    if (action === "start") showMission();
    if (action === "mission-back") hideMission();
    if (action === "mission-continue") showScene();
    if (action === "exit") showToast(text("exitMessage"));
  });
});

$$('[data-close]').forEach((button) => {
  button.addEventListener("click", () => closeModal(button.dataset.close));
});

$$('[data-language]').forEach((button) => {
  button.addEventListener("click", () => {
    state.language = button.dataset.language;
    localStorage.setItem("tdj-language", state.language);
    applyLanguage();
  });
});

const audioToggle = $("#audio-toggle");
if (audioToggle) {
  audioToggle.addEventListener("click", () => {
    state.audio = !state.audio;
    localStorage.setItem("tdj-audio", state.audio ? "on" : "off");
    updateAudioButton();
    if (state.audio) ensureAudio();
  });
}

$$(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal.id.replace("-modal", ""));
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    $$(".modal:not(.hidden)").forEach((modal) => closeModal(modal.id.replace("-modal", "")));
    if (!$("#mission-screen").classList.contains("hidden")) hideMission();
    if (!$("#scene-screen").classList.contains("hidden")) {
      $("#scene-screen").classList.add("hidden");
      $("#mission-screen").classList.remove("hidden");
    }
  }
});

applyLanguage();
