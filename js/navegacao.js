"use strict";

const NavigationSystem = {
    cellSize: 20,
    width: 40,
    height: 30,
    blockedGrid: [],

    build(objects) {
        this.blockedGrid = Array.from(
            { length: this.height },
            () => Array(this.width).fill(false)
        );

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = {
                    x: x * this.cellSize,
                    y: y * this.cellSize,
                    w: this.cellSize,
                    h: this.cellSize
                };

                this.blockedGrid[y][x] = CollisionSystem.blocked(cell, objects);
            }
        }
    },

    cellFromPoint(point) {
        return {
            x: Math.max(0, Math.min(this.width - 1, Math.floor(point.x / this.cellSize))),
            y: Math.max(0, Math.min(this.height - 1, Math.floor(point.y / this.cellSize)))
        };
    },

    cellKey(x, y) {
        return `${x},${y}`;
    },

    walkable(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height && !this.blockedGrid[y][x];
    },

    neighbors(node) {
        const result = [];
        const directions = [
            [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
            [1, 1, 1.414], [-1, 1, 1.414], [1, -1, 1.414], [-1, -1, 1.414]
        ];

        for (const [dx, dy, cost] of directions) {
            const x = node.x + dx;
            const y = node.y + dy;
            if (!this.walkable(x, y)) continue;

            if (dx !== 0 && dy !== 0 && (!this.walkable(node.x + dx, node.y) || !this.walkable(node.x, node.y + dy))) {
                continue;
            }

            result.push({ x, y, cost });
        }

        return result;
    },

    heuristic(a, b) {
        return Math.hypot(b.x - a.x, b.y - a.y);
    },

    findPath(startPoint, endPoint) {
        const start = this.cellFromPoint(startPoint);
        const end = this.cellFromPoint(endPoint);

        if (!this.walkable(start.x, start.y) || !this.walkable(end.x, end.y)) return [];

        const open = [{ x: start.x, y: start.y, g: 0, f: this.heuristic(start, end), parent: null }];
        const closed = new Set();
        const best = new Map([[this.cellKey(start.x, start.y), 0]]);

        for (let safety = 0; open.length && safety < 1200; safety++) {
            let index = 0;
            for (let i = 1; i < open.length; i++) {
                if (open[i].f < open[index].f) index = i;
            }

            const current = open.splice(index, 1)[0];
            const currentKey = this.cellKey(current.x, current.y);
            if (closed.has(currentKey)) continue;
            closed.add(currentKey);

            if (current.x === end.x && current.y === end.y) {
                const path = [];
                for (let node = current; node; node = node.parent) {
                    path.push({
                        x: node.x * this.cellSize + this.cellSize / 2,
                        y: node.y * this.cellSize + this.cellSize / 2
                    });
                }
                path.reverse();
                if (path.length > 1) path.shift();
                return path;
            }

            for (const neighbor of this.neighbors(current)) {
                const key = this.cellKey(neighbor.x, neighbor.y);
                if (closed.has(key)) continue;

                const g = current.g + neighbor.cost;
                if (best.has(key) && g >= best.get(key)) continue;
                best.set(key, g);
                open.push({
                    x: neighbor.x,
                    y: neighbor.y,
                    g,
                    f: g + this.heuristic(neighbor, end),
                    parent: current
                });
            }
        }

        return [];
    }
};
