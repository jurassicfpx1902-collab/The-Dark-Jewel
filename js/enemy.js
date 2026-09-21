window.Enemy = {

    x: 620,
    y: 180,

    w: 22,
    h: 26,

    angle: Math.PI,

    viewDist: 220,

    fov:
        Math.PI * 0.75,

    alert: false,

    speed: 1.0,

    animTimer: 0,
    animFrame: 0,

    waypoints: [

        { x: 620, y: 180 },
        { x: 700, y: 180 },
        { x: 700, y: 500 },
        { x: 620, y: 500 }

    ],

    targetIdx: 0,

    init() {
        this.reset();
    },

    reset() {

        this.x =
            this.waypoints[0].x;

        this.y =
            this.waypoints[0].y;

        this.targetIdx = 1;

        this.alert = false;

        this.animFrame = 0;
    },

    update(walls) {

        const target =
            this.waypoints[
                this.targetIdx
            ];

        const dx =
            target.x - this.x;

        const dy =
            target.y - this.y;

        const distance =
            Math.hypot(dx, dy);

        if (distance < 4) {

            this.targetIdx =
                (this.targetIdx + 1) %
                this.waypoints.length;

            return;
        }

        const angle =
            Math.atan2(dy, dx);

        this.angle = angle;

        const oldX = this.x;
        const oldY = this.y;

        this.x +=
            Math.cos(angle) *
            this.speed;

        this.y +=
            Math.sin(angle) *
            this.speed;

        /*
         * Inimigo agora respeita paredes.
         */
        if (
            CollisionSystem.checkWallCollision(
                {
                    x: this.x - this.w / 2,
                    y: this.y - this.h / 2,
                    w: this.w,
                    h: this.h
                },
                walls
            )
        ) {

            this.x = oldX;
            this.y = oldY;

            this.targetIdx =
                (this.targetIdx + 1) %
                this.waypoints.length;
        }

        this.animTimer += 0.12;

        if (this.animTimer >= 1) {

            this.animFrame =
                (this.animFrame + 1) % 4;

            this.animTimer = 0;
        }
    },

    draw(ctx) {

        VisionSystem.drawGuardVisionCone(
            ctx,
            this
        );

        ctx.save();

        ctx.translate(
            Math.round(this.x),
            Math.round(this.y)
        );

        /*
         * Rotação apenas para o equipamento
         * acompanhar a direção.
         */
        ctx.rotate(this.angle);

        /*
         * Sombra.
         */
        ctx.fillStyle =
            "rgba(0,0,0,0.45)";

        ctx.fillRect(
            -9,
            10,
            18,
            4
        );

        /*
         * Mochila.
         */
        ctx.fillStyle =
            "#15191e";

        ctx.fillRect(
            -11,
            -7,
            5,
            14
        );

        /*
         * Corpo protegido.
         */
        ctx.fillStyle =
            this.alert
                ? "#40272b"
                : "#20252c";

        ctx.fillRect(
            -7,
            -5,
            14,
            15
        );

        /*
         * Proteção dos ombros.
         */
        ctx.fillStyle =
            "#15191e";

        ctx.fillRect(
            -10,
            -4,
            4,
            8
        );

        ctx.fillRect(
            6,
            -4,
            4,
            8
        );

        /*
         * Cabeça completamente coberta.
         */
        ctx.fillStyle =
            "#12161b";

        ctx.fillRect(
            -6,
            -11,
            12,
            8
        );

        /*
         * Visor.
         */
        ctx.fillStyle =
            this.alert
                ? "#d74752"
                : "#596b7c";

        ctx.fillRect(
            4,
            -7,
            3,
            5
        );

        /*
         * Equipamento visual compacto.
         */
        ctx.fillStyle =
            "#0d1013";

        ctx.fillRect(
            5,
            3,
            14,
            3
        );

        /*
         * Pequena animação.
         */
        if (
            this.animFrame % 2 === 1
        ) {

            ctx.fillStyle =
                "#14191f";

            ctx.fillRect(
                -5,
                10,
                4,
                4
            );

            ctx.fillRect(
                2,
                10,
                4,
                4
            );
        }

        ctx.restore();
    }
};
