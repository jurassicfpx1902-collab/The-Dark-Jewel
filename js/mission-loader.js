"use strict";

(function missionLoader() {
  const style = document.createElement("style");
  style.textContent = `
    .mission-loading { position:fixed; inset:0; z-index:30; display:grid; place-items:center; padding:1rem; color:#b9c7c8; background:#050b10; font-family:'Share Tech Mono','Courier New',monospace; }
    .mission-loading.hidden { display:none; }
    .loading-card { position:relative; width:min(92vw,680px); padding:clamp(2rem,6vw,4rem); border:1px solid rgba(106,143,157,.42); background:linear-gradient(135deg,rgba(10,24,35,.98),rgba(12,12,18,.98)); box-shadow:0 0 50px rgba(10,40,60,.25); overflow:hidden; }
    .loading-card:after { content:''; position:absolute; inset:0; pointer-events:none; opacity:.16; background:repeating-linear-gradient(0deg,transparent 0 3px,#91aab2 4px); animation:glitchScan 3s linear infinite; }
    .loading-kicker { margin:0 0 1.2rem; color:#7c9ba8; font-size:.7rem; letter-spacing:.24em; }
    .loading-card h2 { margin:0; color:#d4d9da; font-size:clamp(1.6rem,6vw,3.4rem); font-weight:400; letter-spacing:.12em; }
    .loading-card h2 em { color:#c44d50; font-style:normal; }
    .loading-objective { margin:1.2rem 0 2rem; color:#aeb7bb; font-size:clamp(.8rem,2.3vw,1rem); letter-spacing:.12em; }
    .loading-lines { display:grid; gap:.45rem; margin-bottom:1.7rem; color:#627f8d; font-size:.68rem; letter-spacing:.14em; }
    .loading-lines span:nth-child(2) { color:#8e5d62; }
    .loading-progress { height:7px; border:1px solid #536d79; background:#0a171e; }
    .loading-progress i { display:block; width:0; height:100%; background:linear-gradient(90deg,#356b89,#c24a4f); animation:missionProgress 1.55s ease-out forwards; }
    .loading-status { display:flex; justify-content:space-between; margin-top:.7rem; color:#75919a; font-size:.68rem; letter-spacing:.16em; }
    @keyframes missionProgress { to { width:100%; } }
    @keyframes glitchScan { 0%,90%,100% { transform:translateY(0); } 92% { transform:translateY(7px); opacity:.28; } 94% { transform:translateY(-3px); } }
    .touch-controls { display:none; position:absolute; left:1rem; bottom:1rem; z-index:8; grid-template-columns:repeat(3,42px); grid-template-rows:repeat(2,42px); gap:4px; }
    .touch-controls button { border:1px solid rgba(180,205,205,.45); color:#dce5df; background:rgba(8,22,27,.78); font:1rem monospace; }
    .touch-controls button[data-key="ArrowUp"] { grid-column:2; } .touch-controls button[data-key="ArrowLeft"] { grid-column:1; grid-row:2; } .touch-controls button[data-key="ArrowDown"] { grid-column:2; grid-row:2; } .touch-controls button[data-key="ArrowRight"] { grid-column:3; grid-row:2; }
    @media (pointer:coarse) { .touch-controls { display:grid; } }
  `;
  document.head.appendChild(style);

  const loading = document.createElement("section");
  loading.className = "mission-loading hidden";
  loading.setAttribute("aria-live", "assertive");
  loading.innerHTML = `<div class="loading-card"><p class="loading-kicker">THE DARK JEWEL // SECURE BOOT</p><h2>MISSION 01 <em>// NO DARK</em></h2><p class="loading-objective">OBJETIVO: RECUPERAR OS ARQUIVOS ESPALHADOS</p><div class="loading-lines"><span>DDG/CIA // ENCRYPTED LINK</span><span>THREAT PROFILE // ACTIVE</span><span>MAP SECTOR // INDUSTRIAL NODE 07</span></div><div class="loading-progress"><i></i></div><div class="loading-status"><span>LOADING MISSION DATA</span><span id="loading-percent">00%</span></div></div>`;
  document.body.appendChild(loading);

  const touch = document.createElement("div");
  touch.className = "touch-controls";
  [["ArrowUp","▲"],["ArrowLeft","◀"],["ArrowDown","▼"],["ArrowRight","▶"]].forEach(([key,label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.key = key;
    button.textContent = label;
    const press = (event) => { event.preventDefault(); window.dispatchEvent(new KeyboardEvent("keydown", { key })); };
    const release = (event) => { event.preventDefault(); window.dispatchEvent(new KeyboardEvent("keyup", { key })); };
    button.addEventListener("pointerdown", press); button.addEventListener("pointerup", release); button.addEventListener("pointercancel", release); button.addEventListener("pointerleave", release);
    touch.appendChild(button);
  });
  document.querySelector("#scene-screen")?.appendChild(touch);

  let loadingActive = false;
  document.addEventListener("click", (event) => {
    const start = event.target.closest('[data-action="start"]');
    if (!start || loadingActive) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    loadingActive = true;
    document.querySelector("#main-menu")?.classList.add("hidden");
    loading.classList.remove("hidden");
    let percent = 0;
    const percentNode = document.querySelector("#loading-percent");
    const timer = setInterval(() => {
      percent = Math.min(100, percent + 10);
      percentNode.textContent = `${String(percent).padStart(2, "0")}%`;
      if (percent >= 100) {
        clearInterval(timer);
        loading.classList.add("hidden");
        document.querySelector("#mission-screen")?.classList.remove("hidden");
        document.querySelector("#mission-screen")?.setAttribute("aria-hidden", "false");
        loadingActive = false;
      }
    }, 155);
  }, true);
})();
