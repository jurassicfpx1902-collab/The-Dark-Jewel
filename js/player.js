window.Player = {

    x: 80,
    y: 500,

    w: 20,
    h: 24,

    speed: 2.2,

    direction: "down",

    isCrouching: false,

    animTimer: 0,
    animFrame: 0,

    mobileCrouch: false,

    keys: {},

    init() {

        this.reset();

        window.addEventListener(
            "keydown",
            (event) => {

                this.keys[
                    event.key.toLowerCase()
                ] = true;

            }
        );

        window.addEventListener(
            "keyup",
            (event) => {

                this.keys[
                    event.key.toLowerCase()
                ] = false;

            }
        );
    },

    reset() {

        this.x = 80;
        this.y = 500;

        this.direction = "up";

        this.isCrouching = false;

        this.animTimer = 0;
        this.animFrame = 0;
    },

    update(walls) {

        let vx = 0;
        let vy = 0;

        if (
            this.keys["w"] ||
            this.keys["arrowup"]
        ) {
            vy -= 1;
        }

        if (
            this.keys["s"] ||
            this.keys["arrowdown"]
        ) {
            vy += 1;
        }

        if (
            this.keys["a"] ||
            this.keys["arrowleft"]
        ) {
            vx -= 1;
        }

        if (
            this.keys["d"] ||
            this.keys["arrowright"]
        ) {
            vx += 1;
        }

        this.isCrouching =
            !!(
                this.keys["c"] ||
                this.keys["shift"] ||
                this.mobileCrouch
            );

        const moving =
            vx !== 0 ||
            vy !== 0;

        if (moving) {

            if (Math.abs(vx) > Math.abs(vy)) {

                this.direction =
                    vx > 0
                        ? "right"
                        : "left";

            } else {

                this.direction =
                    vy > 0
                        ? "down"
                        : "up";
            }

            this.animTimer += 0.15;

            if (this.animTimer >= 1) {

                this.animFrame =
                    (this.animFrame + 1) % 4;

                this.animTimer = 0;
            }

        } else {

            this.animFrame = 0;
        }

        const currentSpeed =
            this.isCrouching
                ? this.speed * 0.5
                : this.speed;

        if (
            vx !== 0 &&
            vy !== 0
        ) {

            vx *= 0.7071;
            vy *= 0.7071;
        }

        /*
         * Movimento horizontal
         */
        this.x += vx * currentSpeed;

        if (
            CollisionSystem.checkWallCollision(
                this,
                walls
            )
        ) {
            this.x -= vx * currentSpeed;
        }

        /*
         * Movimento vertical
         */
        this.y += vy * currentSpeed;

        if (
            CollisionSystem.checkWallCollision(
                this,
                walls
            )
        ) {
            this.y -= vy * currentSpeed;
        }

        /*
         * Limites do mapa
         */
        this.x = Math.max(
            0,
            Math.min(
                800 - this.w,
                this.x
            )
        );

        this.y = Math.max(
            0,
            Math.min(
                600 - this.h,
                this.y
            )
        );
    },

    draw(ctx) {

        ctx.save();

        const centerX =
            this.x + this.w / 2;

        const centerY =
            this.y + this.h / 2;

        ctx.translate(
            Math.round(centerX),
            Math.round(centerY)
        );

        /*
         * Pequena sombra.
         */
        ctx.fillStyle =
            "rgba(0,0,0,0.35)";

        ctx.fillRect(
            -8,
            9,
            16,
            4
        );

        /*
         * Mochila.
         */
        ctx.fillStyle =
            "#252c34";

        if (
            this.direction === "down"
        ) {

            ctx.fillRect(
                -9,
                -5,
                18,
                10
            );

        } else {

            ctx.fillRect(
                -10,
                -7,
                6,
                14
            );
        }

        /*
         * Corpo.
         */
        ctx.fillStyle =
            this.isCrouching
                ? "#202a35"
                : "#29333f";

        ctx.fillRect(
            -7,
            -4,
            14,
            14
        );

        /*
         * Pequenos detalhes do traje.
         */
        ctx.fillStyle =
            "#11171d";

        ctx.fillRect(
            -5,
            1,
            10,
            3
        );

        /*
         * Cabeça.
         */
        ctx.fillStyle =
            "#c5a27f";

        ctx.fillRect(
            -5,
            -10,
            10,
            8
        );

        /*
         * Cabelo loiro discreto.
         */
        ctx.fillStyle =
            "#b78c5e";

        if (
            this.direction === "up"
        ) {

            ctx.fillRect(
                -5,
                -11,
                10,
                4
            );

        } else {

            ctx.fillRect(
                -5,
                -11,
                10,
                3
            );
        }

        /*
         * Elemento visual da mão.
         * Pequeno e sem função nesta versão.
         */
        ctx.fillStyle =
            "#111316";

        if (
            this.direction === "right"
        ) {

            ctx.fillRect(
                5,
                1,
                9,
                3
            );

        } else if (
            this.direction === "left"
        ) {

            ctx.fillRect(
                -14,
                1,
                9,
                3
            );

        } else {

            ctx.fillRect(
                4,
                2,
                7,
                3
            );
        }

        /*
         * Pequena animação das pernas.
         */
        if (
            this.animFrame % 2 === 1
        ) {

            ctx.fillStyle =
                "#161c23";

            ctx.fillRect(
                -6,
                9,
                4,
                4
            );

            ctx.fillRect(
                2,
                8,
                4,
                4
            );
        }

        ctx.restore();
    }
};
