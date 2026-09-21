window.VisionSystem = {

    drawGuardVisionCone(ctx, guard) {

        const x = guard.x;
        const y = guard.y;

        const distance =
            guard.viewDist ?? 220;

        const fov =
            guard.fov ?? Math.PI * 0.75;

        const angle =
            guard.angle ?? 0;

        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                4,
                x,
                y,
                distance
            );

        if (guard.alert) {

            gradient.addColorStop(
                0,
                "rgba(210,45,55,0.50)"
            );

            gradient.addColorStop(
                0.6,
                "rgba(170,35,45,0.18)"
            );

            gradient.addColorStop(
                1,
                "rgba(120,20,30,0)"
            );

        } else {

            gradient.addColorStop(
                0,
                "rgba(180,45,50,0.32)"
            );

            gradient.addColorStop(
                0.5,
                "rgba(150,35,40,0.12)"
            );

            gradient.addColorStop(
                1,
                "rgba(100,20,25,0)"
            );
        }

        ctx.save();

        ctx.beginPath();

        ctx.moveTo(x, y);

        ctx.arc(
            x,
            y,
            distance,
            angle - fov / 2,
            angle + fov / 2
        );

        ctx.closePath();

        ctx.fillStyle = gradient;

        ctx.fill();

        ctx.restore();
    },

    isPlayerDetected(player, guard, walls) {

        const gx = guard.x;
        const gy = guard.y;

        const px =
            player.x + player.w / 2;

        const py =
            player.y + player.h / 2;

        const dx = px - gx;
        const dy = py - gy;

        const distance =
            Math.hypot(dx, dy);

        const viewDist =
            guard.viewDist ?? 220;

        if (distance > viewDist) {
            return false;
        }

        /*
         * Agachado:
         * reduz a distância efetiva de detecção.
         */
        if (
            player.isCrouching &&
            distance > viewDist * 0.5
        ) {
            return false;
        }

        const playerAngle =
            Math.atan2(dy, dx);

        const guardAngle =
            guard.angle ?? 0;

        const fov =
            guard.fov ?? Math.PI * 0.75;

        let difference =
            playerAngle - guardAngle;

        while (difference < -Math.PI) {
            difference += Math.PI * 2;
        }

        while (difference > Math.PI) {
            difference -= Math.PI * 2;
        }

        if (
            Math.abs(difference) >
            fov / 2
        ) {
            return false;
        }

        /*
         * Verificação real de linha de visão.
         */
        for (const wall of walls) {

            if (
                CollisionSystem.lineIntersectsRect(
                    { x: gx, y: gy },
                    { x: px, y: py },
                    wall
                )
            ) {
                return false;
            }
        }

        return true;
    }
};
