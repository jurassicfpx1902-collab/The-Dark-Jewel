window.CollisionSystem = {

    checkWallCollision(
        rect,
        walls
    ) {

        for (
            const wall of walls
        ) {

            if (

                rect.x <
                wall.x + wall.w &&

                rect.x + rect.w >
                wall.x &&

                rect.y <
                wall.y + wall.h &&

                rect.y + rect.h >
                wall.y

            ) {

                return true;

            }

        }


        return false;

    },


    lineIntersectsRect(
        p1,
        p2,
        rect
    ) {

        const minX =
            Math.min(
                p1.x,
                p2.x
            );


        const maxX =
            Math.max(
                p1.x,
                p2.x
            );


        const minY =
            Math.min(
                p1.y,
                p2.y
            );


        const maxY =
            Math.max(
                p1.y,
                p2.y
            );


        if (

            maxX < rect.x ||
            minX > rect.x + rect.w ||

            maxY < rect.y ||
            minY > rect.y + rect.h

        ) {

            return false;

        }


        return true;

    }

};
