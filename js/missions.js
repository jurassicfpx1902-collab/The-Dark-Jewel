window.VisionSystem = {

    drawGuardVisionCone(ctx, guard) {

        ctx.save();


        const x = guard.x;
        const y = guard.y;


        const viewDist =
            guard.viewDist ??
            guard.vision ??
            235;


        const fov =
            guard.fov ??
            (Math.PI * 0.9);


        const angle =
            guard.angle ??
            guard.directionAngle ??
            0;


        const isAlert =
            guard.alert ||
            guard.state === "alert";


        /*
         * Gradiente
         */

        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                8,
                x,
                y,
                viewDist
            );


        if (isAlert) {

            gradient.addColorStop(
                0,
                "rgba(255, 0, 0, 0.6)"
            );

            gradient.addColorStop(
                0.5,
                "rgba(255, 0, 0, 0.25)"
            );

            gradient.addColorStop(
                1,
                "rgba(255, 0, 0, 0)"
            );

        }

        else {

            gradient.addColorStop(
                0,
                "rgba(255, 42, 63, 0.32)"
            );

            gradient.addColorStop(
                0.45,
                "rgba(255, 42, 63, 0.14)"
            );

            gradient.addColorStop(
                0.75,
                "rgba(255, 42, 63, 0.055)"
            );

            gradient.addColorStop(
                1,
                "rgba(255, 42, 63, 0)"
            );

        }


        /*
         * Cone
         */

        ctx.beginPath();

        ctx.moveTo(x, y);

        ctx.arc(
            x,
            y,
            viewDist,
            angle - fov / 2,
            angle + fov / 2
        );

        ctx.closePath();


        ctx.fillStyle = gradient;

        ctx.fill();


        ctx.restore();

    },


    isPlayerDetected(
        player,
        guard,
        walls
    ) {

        const gx = guard.x;
        const gy = guard.y;


        const px =
            player.x +
            player.w / 2;


        const py =
            player.y +
            player.h / 2;


        const dx =
            px - gx;


        const dy =
            py - gy;


        const dist =
            Math.hypot(dx, dy);


        const viewDist =
            guard.viewDist ??
            guard.vision ??
            235;


        /*
         * Fora do alcance
         */

        if (
            dist > viewDist
        ) {
            return false;
        }


        /*
         * Agachado
         */

        if (
            player.isCrouching &&
            dist > viewDist * 0.5
        ) {

            return false;

        }


        /*
         * Ângulo
         */

        const angleToPlayer =
            Math.atan2(dy, dx);


        const guardAngle =
            guard.angle ??
            guard.directionAngle ??
            0;


        const fov =
            guard.fov ??
            (Math.PI * 0.9);


        let diff =
            angleToPlayer -
            guardAngle;


        while (
            diff < -Math.PI
        ) {

            diff +=
                Math.PI * 2;

        }


        while (
            diff > Math.PI
        ) {

            diff -=
                Math.PI * 2;

        }


        if (
            Math.abs(diff) >
            fov / 2
        ) {

            return false;

        }


        /*
         * Linha de visão
         */

        for (
            const wall of walls
        ) {

            if (
                CollisionSystem.lineIntersectsRect(
                    {
                        x: gx,
                        y: gy
                    },
                    {
                        x: px,
                        y: py
                    },
                    wall
                )
            ) {

                return false;

            }

        }


        return true;

    }

};
