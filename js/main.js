"use strict";

const translations = {
  en: {
    eyebrow: "W.B. GLOBAL DEFENSE // SECURE CHANNEL", subtitle: "OPERATION // NO DARK", start: "START", settings: "SETTINGS", credits: "CREDITS", exit: "EXIT", offline: "OFFLINE BUILD", language: "LANGUAGE", audio: "AUDIO", back: "BACK", partnershipLabel: "PARTNERSHIP", authorLabel: "AUTHOR", creatorLabel: "CREATOR", author: "O Escritor", startMessage: "Mission briefing loaded.", exitMessage: "The prototype is ready to close. You can safely leave this page.", classification: "CLASSIFIED // MISSION BRIEFING", operationTitle: "OPERATION: NO DARK", agentLabel: "AGENT:", department: "GLOBAL DEFENSE DEPARTMENT / CIA", radioInteraction: "RADIO INTERACTION", secureChannel: "SECURE CHANNEL", radioMessage: "— Buck, recover the files and proceed to the extraction point.", continue: "CONTINUE"
  },
  pt: {
    eyebrow: "DEFESA GLOBAL W.B. // CANAL SEGURO", subtitle: "OPERAÇÃO // NO DARK", start: "INICIAR", settings: "CONFIGURAÇÕES", credits: "CRÉDITOS", exit: "SAIR", offline: "VERSÃO OFFLINE", language: "IDIOMA", audio: "ÁUDIO", back: "VOLTAR", partnershipLabel: "PARCERIA", authorLabel: "AUTOR", creatorLabel: "CRIADOR", author: "O Escritor", startMessage: "Briefing da missão carregado.", exitMessage: "O protótipo está pronto para ser fechado. Você pode sair desta página.", classification: "CLASSIFICADO // BRIEFING DA MISSÃO", operationTitle: "OPERAÇÃO: NO DARK", agentLabel: "AGENTE:", department: "DEPARTAMENTO DE DEFESA GLOBAL / CIA", radioInteraction: "INTERAÇÃO DE RÁDIO", secureChannel: "CANAL SEGURO", radioMessage: "— Buck, recupere os arquivos e vá para o ponto de extração.", continue: "CONTINUAR"
  }
};

const state = { language: localStorage.getItem("tdj-language") || "en", audio: localStorage.getItem("tdj-audio") !== "off" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const text = (key) => translations[state.language][key] || translations.en[key] || key;

function applyLanguage() {
  document.documentElement.lang = state.language === "pt" ? "pt-BR" : "en";
  $$('[data-i18n]').forEach((element) => { element.textContent = text(element.dataset.i18n); });
  $$('[data-language]').forEach((button) => button.classList.toggle("active", button.dataset.language === state.language));
  updateAudioButton();
}
function updateAudioButton() { const toggle = $("#audio-toggle"); toggle.classList.toggle("off", !state.audio); toggle.setAttribute("aria-pressed", String(state.audio)); $("#audio-state").textContent = state.audio ? "ON" : "OFF"; }
function showModal(id) { const modal = $(`#${id}-modal`); modal.classList.remove("hidden"); modal.setAttribute("aria-hidden", "false"); }
function closeModal(id) { const modal = $(`#${id}-modal`); modal.classList.add("hidden"); modal.setAttribute("aria-hidden", "true"); }
function showMission() { $("#main-menu").classList.add("hidden"); $("#mission-screen").classList.remove("hidden"); $("#mission-screen").setAttribute("aria-hidden", "false"); }
function hideMission() { $("#mission-screen").classList.add("hidden"); $("#mission-screen").setAttribute("aria-hidden", "true"); $("#main-menu").classList.remove("hidden"); }
let toastTimer;
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("visible"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200); }

$$('[data-action]').forEach((button) => button.addEventListener("click", () => {
  const action = button.dataset.action;
  if (action === "settings") showModal("settings");
  if (action === "credits") showModal("credits");
  if (action === "start") showMission();
  if (action === "mission-back") hideMission();
  if (action === "mission-continue") showToast(text("startMessage"));
  if (action === "exit") showToast(text("exitMessage"));
}));
$$('[data-close]').forEach((button) => button.addEventListener("click", () => closeModal(button.dataset.close)));
$$('[data-language]').forEach((button) => button.addEventListener("click", () => { state.language = button.dataset.language; localStorage.setItem("tdj-language", state.language); applyLanguage(); }));
$("#audio-toggle").addEventListener("click", () => { state.audio = !state.audio; localStorage.setItem("tdj-audio", state.audio ? "on" : "off"); updateAudioButton(); });
$$(".modal").forEach((modal) => modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(modal.id.replace("-modal", "")); }));
window.addEventListener("keydown", (event) => { if (event.key === "Escape") { $$(".modal:not(.hidden)").forEach((modal) => closeModal(modal.id.replace("-modal", ""))); if (!$("#mission-screen").classList.contains("hidden")) hideMission(); } });
applyLanguage();
