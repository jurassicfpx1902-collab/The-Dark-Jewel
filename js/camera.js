"use strict";

window.TDJCamera = function createCamera(width, height) {
  return { x: 0, y: 0, width, height, follow(target, worldWidth, worldHeight) { this.x = Math.max(0, Math.min(worldWidth - this.width, target.x - this.width / 2)); this.y = Math.max(0, Math.min(worldHeight - this.height, target.y - this.height / 2)); } };
};
