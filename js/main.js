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
  enemy: null,
  objective: null,
  walls: [],
  lastTs: 0,
  won: false,
  lost: false
};

function rectsIntersect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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

function drawCharacter(x, y, palette, isEnemy = false) {
  const ctx = gameState.ctx;
  const bodyW = 14;
  const bodyH = 18;
  const headR = 5;

  ctx.fillStyle = isEnemy ? palette.helmet : palette.skin;
  ctx.beginPath();
  ctx.arc(x, y - 9, headR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isEnemy ? palette.armor : palette.armor;
  ctx.fillRect(x - bodyW / 2, y + 1, bodyW, bodyH);

  ctx.fillStyle = isEnemy ? palette.dark : palette.dark;
  ctx.fillRect(x - bodyW / 2 + 2, y + 7, 4, 10);
  ctx.fillRect(x + bodyW / 2 - 6, y + 7, 4, 10);

  ctx.fillStyle = isEnemy ? "#a7b1b8" : "#d8dccf";
  ctx.fillRect(x - 4, y + 1, 8, 5);
  ctx.fillStyle = isEnemy ? "#30393d" : "#1f2a2e";
  ctx.fillRect(x - bodyW / 2, y + 18, 4, 8);
  ctx.fillRect(x + bodyW / 2 - 4, y + 18, 4, 8);
}

function drawObjective() {
  const ctx = gameState.ctx;
  const { x, y } = gameState.objective;
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, 10 + i * 7, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(93, 215, 255, ${0.8 - i * 0.2})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.fillStyle = "#7ce4ff";
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWalls() {
  const ctx = gameState.ctx;
  ctx.fillStyle = "#a7b3b7";
  for (const wall of gameState.walls) {
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(wall.x, wall.y + wall.h - 4, wall.w, 4);
    ctx.fillStyle = "#a7b3b7";
  }
}

function drawMap() {
  const ctx = gameState.ctx;
  const canvas = gameState.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1e2b30";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < canvas.width; x += 26) {
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(x, 0, 1, canvas.height);
  }
  for (let y = 0; y < canvas.height; y += 26) {
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(0, y, canvas.width, 1);
  }

  ctx.fillStyle = "rgba(186,192,195,0.30)";
  ctx.fillRect(30, 30, 700, 360);

  drawWalls();
  drawObjective();

  const p = gameState.player;
  drawCharacter(p.x, p.y, { skin: "#d8c8a4", armor: "#2b364d", dark: "#111c24" }, false);

  const e = gameState.enemy;
  drawCharacter(e.x, e.y, { skin: "#c5ccd1", armor: "#3a4d5d", dark: "#242d35" }, true);

  ctx.fillStyle = "rgba(255, 60, 60, 0.14)";
  ctx.beginPath();
  ctx.moveTo(560, 100);
  ctx.lineTo(760, 0);
  ctx.lineTo(760, 190);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#dfe7e9";
  ctx.font = "12px 'Share Tech Mono', monospace";
  ctx.fillText("OPERATION: NO DARK", 16, 22);
  ctx.fillText("OBJECTIVE", 620, 24);
  ctx.fillText("ALERT", 26, 390);

  if (gameState.lost) {
    ctx.fillStyle = "rgba(10, 16, 20, 0.78)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f3f3f3";
    ctx.font = "bold 30px 'Share Tech Mono', monospace";
    ctx.fillText("DETECTED", 250, 200);
    ctx.font = "16px 'Share Tech Mono', monospace";
    ctx.fillText("PRESS ESC TO RETURN", 240, 244);
  }

  if (gameState.won) {
    ctx.fillStyle = "rgba(12, 30, 17, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#dfeadf";
    ctx.font = "bold 28px 'Share Tech Mono', monospace";
    ctx.fillText("MISSION ACCOMPLISHED", 150, 210);
    ctx.font = "16px 'Share Tech Mono', monospace";
    ctx.fillText("EXTRACTION READY", 260, 246);
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
