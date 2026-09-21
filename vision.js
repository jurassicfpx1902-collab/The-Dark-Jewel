window.VisionSystem = {

    drawVisionCone(ctx, enemy) {

        ctx.save();

        const gradient = ctx.createRadialGradient(
            enemy.x,
            enemy.y,
            10,
            enemy.x,
            enemy.y,
            enemy.viewDist
        );

        gradient.addColorStop(
            0,
            "rgba(255, 42, 63, 0.35)"
        );

        gradient.addColorStop(
            1,
            "rgba(255, 42, 63, 0)"
        );

        ctx.beginPath();

        ctx.moveTo(enemy.x, enemy.y);

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.viewDist,
            enemy.angle - enemy.fov / 2,
            enemy.angle + enemy.fov / 2
        );

        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
    },

    canSeePlayer(enemy, player, collisionSystem) {

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance > enemy.viewDist) {
            return false;
        }

        const angleToPlayer = Math.atan2(dy, dx);

        let difference =
            angleToPlayer - enemy.angle;

        while (difference > Math.PI) {
            difference -= Math.PI * 2;
        }

        while (difference < -Math.PI) {
            difference += Math.PI * 2;
        }

        if (Math.abs(difference) > enemy.fov / 2) {
            return false;
        }

        if (
            collisionSystem &&
            collisionSystem.hasLineOfSight &&
            !collisionSystem.hasLineOfSight(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            )
        ) {
            return false;
        }

        return true;
    }
};
