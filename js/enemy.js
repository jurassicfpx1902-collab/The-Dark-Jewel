"use strict";

window.TDJEnemy = function createEnemy(x, y, patrol) {
  return { x, y, radius: 13, speed: 1.05, patrol, target: 0, armor: "#252d35", helmet: "#68737b" };
};

window.updateEnemy = function updateEnemy(enemy, map) {
  const point = enemy.patrol[enemy.target]; const dx = point.x - enemy.x; const dy = point.y - enemy.y; const distance = Math.hypot(dx, dy);
  if (distance < 3) enemy.target = (enemy.target + 1) % enemy.patrol.length;
  else map.move(enemy, dx / distance * enemy.speed, dy / distance * enemy.speed);
};

window.drawEnemy = function drawEnemy(ctx, enemy, camera) {
  const x = enemy.x - camera.x; const y = enemy.y - camera.y;
  ctx.fillStyle = enemy.helmet; ctx.fillRect(x - 7, y - 16, 14, 9); ctx.fillStyle = enemy.armor; ctx.fillRect(x - 10, y - 7, 20, 23);
  ctx.fillStyle = "#11161a"; ctx.fillRect(x - 11, y - 1, 4, 15); ctx.fillRect(x + 7, y - 1, 4, 15); ctx.fillRect(x - 8, y + 16, 6, 11); ctx.fillRect(x + 2, y + 16, 6, 11);
  ctx.fillStyle = "#9daab1"; ctx.fillRect(x - 5, y - 13, 10, 3); ctx.fillStyle = "#171e23"; ctx.fillRect(x + 9, y + 1, 17, 4);
};
