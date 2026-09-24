"use strict";

window.TDJPlayer = function createPlayer(x, y) {
  return { x, y, radius: 12, speed: 2.5, color: "#2b364d", hair: "#d8c8a4" };
};

window.updatePlayer = function updatePlayer(player, keys, map) {
  let x = 0; let y = 0;
  if (keys.ArrowLeft || keys.a) x -= 1;
  if (keys.ArrowRight || keys.d) x += 1;
  if (keys.ArrowUp || keys.w) y -= 1;
  if (keys.ArrowDown || keys.s) y += 1;
  const length = Math.hypot(x, y) || 1;
  if (x || y) map.move(player, x / length * player.speed, y / length * player.speed);
};

window.drawPlayer = function drawPlayer(ctx, player, camera) {
  const x = player.x - camera.x; const y = player.y - camera.y;
  ctx.fillStyle = player.hair; ctx.beginPath(); ctx.arc(x, y - 10, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = player.color; ctx.fillRect(x - 8, y - 2, 16, 20);
  ctx.fillStyle = "#111c24"; ctx.fillRect(x - 8, y + 18, 5, 9); ctx.fillRect(x + 3, y + 18, 5, 9);
  ctx.fillStyle = "#d8dccf"; ctx.fillRect(x - 4, y - 1, 8, 5);
  ctx.fillStyle = "#0b1218"; ctx.fillRect(x + 8, y + 3, 13, 3);
};
