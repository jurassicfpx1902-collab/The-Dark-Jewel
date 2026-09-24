"use strict";

window.TDJMap = function createMap(width, height) {
  const walls = [
    { x: 0, y: 0, w: width, h: 22 }, { x: 0, y: 0, w: 22, h: height }, { x: width - 22, y: 0, w: 22, h: height }, { x: 0, y: height - 22, w: width, h: 22 },
    { x: 110, y: 78, w: 170, h: 18 }, { x: 110, y: 270, w: 170, h: 18 }, { x: 350, y: 78, w: 150, h: 18 }, { x: 350, y: 270, w: 150, h: 18 },
    { x: 295, y: 135, w: 18, h: 150 }, { x: 525, y: 112, w: 18, h: 150 }, { x: 590, y: 65, w: 92, h: 18 }, { x: 605, y: 325, w: 100, h: 18 }, { x: 210, y: 335, w: 110, h: 18 }
  ];
  const intersects = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  return {
    walls,
    objective: { x: 690, y: 285, radius: 13 },
    move(entity, dx, dy) {
      const test = { x: entity.x + dx - entity.radius, y: entity.y + dy - entity.radius, w: entity.radius * 2, h: entity.radius * 2 };
      if (walls.some((wall) => intersects(test, wall))) return false;
      entity.x = Math.max(entity.radius + 2, Math.min(width - entity.radius - 2, entity.x + dx)); entity.y = Math.max(entity.radius + 2, Math.min(height - entity.radius - 2, entity.y + dy)); return true;
    }
  };
};
