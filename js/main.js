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
    startMessage: "Mission systems are ready for the next prototype milestone.",
    exitMessage: "The prototype is ready to close. You can safely leave this page."
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
    startMessage: "Os sistemas da missão estão prontos para a próxima etapa do protótipo.",
    exitMessage: "O protótipo está pronto para ser fechado. Você pode sair desta página."
  }
};

const state = {
  language: localStorage.getItem("tdj-language") || "en",
  audio: localStorage.getItem("tdj-audio") !== "off"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function text(key) {
  return translations[state.language][key] || translations.en[key] || key;
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
  toggle.classList.toggle("off", !state.audio);
  toggle.setAttribute("aria-pressed", String(state.audio));
  label.textContent = state.audio ? "ON" : "OFF";
}

function showModal(id) {
  const modal = $(`#${id}-modal`);
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = $(`#${id}-modal`);
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

$$('[data-action]').forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "settings") showModal("settings");
    if (action === "credits") showModal("credits");
    if (action === "start") showToast(text("startMessage"));
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

$("#audio-toggle").addEventListener("click", () => {
  state.audio = !state.audio;
  localStorage.setItem("tdj-audio", state.audio ? "on" : "off");
  updateAudioButton();
});

$$(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal.id.replace("-modal", ""));
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    $$(".modal:not(.hidden)").forEach((modal) => closeModal(modal.id.replace("-modal", "")));
  }
});

applyLanguage();
