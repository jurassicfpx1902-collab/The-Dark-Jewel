window.CollisionSystem = {

    rectsOverlap(a, b) {

        return (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
        );
    },

    checkWallCollision(rect, walls) {

        for (const wall of walls) {

            if (this.rectsOverlap(rect, wall)) {
                return true;
            }

        }

        return false;
    },

    pointInsideRect(point, rect) {

        return (
            point.x >= rect.x &&
            point.x <= rect.x + rect.w &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.h
        );
    },

    orientation(a, b, c) {

        const value =
            (b.y - a.y) * (c.x - b.x) -
            (b.x - a.x) * (c.y - b.y);

        if (Math.abs(value) < 0.00001) {
            return 0;
        }

        return value > 0 ? 1 : 2;
    },

    segmentsIntersect(a, b, c, d) {

        const o1 = this.orientation(a, b, c);
        const o2 = this.orientation(a, b, d);
        const o3 = this.orientation(c, d, a);
        const o4 = this.orientation(c, d, b);

        return (
            o1 !== o2 &&
            o3 !== o4
        );
    },

    lineIntersectsRect(p1, p2, rect) {

        if (
            this.pointInsideRect(p1, rect) ||
            this.pointInsideRect(p2, rect)
        ) {
            return true;
        }

        const topLeft = {
            x: rect.x,
            y: rect.y
        };

        const topRight = {
            x: rect.x + rect.w,
            y: rect.y
        };

        const bottomLeft = {
            x: rect.x,
            y: rect.y + rect.h
        };

        const bottomRight = {
            x: rect.x + rect.w,
            y: rect.y + rect.h
        };

        return (

            this.segmentsIntersect(
                p1,
                p2,
                topLeft,
                topRight
            ) ||

            this.segmentsIntersect(
                p1,
                p2,
                topRight,
                bottomRight
            ) ||

            this.segmentsIntersect(
                p1,
                p2,
                bottomRight,
                bottomLeft
            ) ||

            this.segmentsIntersect(
                p1,
                p2,
                bottomLeft,
                topLeft
            )
        );
    }
};
