"use strict";

window.TDJMission = (() => {
  let canvas; let ctx; let map; let camera; let player; let enemies; let keys = {}; let running = false; let won = false;
  function init() {
    canvas = document.querySelector("#gameCanvas"); if (!canvas || running) return;
    ctx = canvas.getContext("2d"); map = TDJMap(canvas.width, canvas.height); camera = TDJCamera(canvas.width, canvas.height); player = TDJPlayer(68, 215);
    enemies = [TDJEnemy(590, 125, [{ x: 590, y: 125 }, { x: 690, y: 125 }, { x: 690, y: 220 }, { x: 590, y: 220 }]), TDJEnemy(405, 215, [{ x: 405, y: 215 }, { x: 480, y: 215 }, { x: 480, y: 350 }, { x: 405, y: 350 }]), TDJEnemy(170, 145, [{ x: 170, y: 145 }, { x: 250, y: 145 }, { x: 250, y: 230 }, { x: 170, y: 230 }])];
    running = true; requestAnimationFrame(loop);
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "#202a2e"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < canvas.width; x += 28) { ctx.fillStyle = "rgba(255,255,255,.045)"; ctx.fillRect(x, 0, 1, canvas.height); }
    for (let y = 0; y < canvas.height; y += 28) { ctx.fillStyle = "rgba(255,255,255,.04)"; ctx.fillRect(0, y, canvas.width, 1); }
    map.walls.forEach((wall) => { ctx.fillStyle = "#a6b0b3"; ctx.fillRect(wall.x - camera.x, wall.y - camera.y, wall.w, wall.h); ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.fillRect(wall.x - camera.x, wall.y + wall.h - 4 - camera.y, wall.w, 4); });
    const o = map.objective; ctx.strokeStyle = "#55d8ff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(o.x, o.y, 16, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(o.x, o.y, 7, 0, Math.PI * 2); ctx.fillStyle = "#8ce8ff"; ctx.fill();
    drawPlayer(ctx, player, camera); enemies.forEach((enemy) => drawEnemy(ctx, enemy, camera));
    ctx.fillStyle = "#dbe6e6"; ctx.font = "12px 'Share Tech Mono', monospace"; ctx.fillText("MISSION 01 // NO DARK", 34, 45); ctx.fillStyle = "#c65a5e"; ctx.fillText("INFILTRATION ZONE", 570, 45);
    if (won) { ctx.fillStyle = "rgba(3,15,13,.78)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "#e2eee4"; ctx.font = "bold 24px 'Share Tech Mono', monospace"; ctx.fillText("OBJECTIVE SECURED", 255, 205); }
  }
  function loop() { if (!running) return; if (!won) { updatePlayer(player, keys, map); enemies.forEach((enemy) => updateEnemy(enemy, map)); if (Math.hypot(player.x - map.objective.x, player.y - map.objective.y) < 24) won = true; } camera.follow(player, canvas.width, canvas.height); draw(); requestAnimationFrame(loop); }
  window.addEventListener("keydown", (event) => { keys[event.key] = true; keys[event.key.toLowerCase()] = true; }); window.addEventListener("keyup", (event) => { keys[event.key] = false; keys[event.key.toLowerCase()] = false; });
  return { init };
})();
