window.Game = {

    canvas: null,
    ctx: null,

    running: false,

    walls: [

        /* Bordas */

        {
            x: 30,
            y: 30,
            w: 740,
            h: 20
        },

        {
            x: 30,
            y: 550,
            w: 740,
            h: 20
        },

        {
            x: 30,
            y: 30,
            w: 20,
            h: 540
        },

        {
            x: 750,
            y: 30,
            w: 20,
            h: 540
        },

        /* Sala esquerda */

        {
            x: 200,
            y: 50,
            w: 20,
            h: 360
        },

        {
            x: 200,
            y: 410,
            w: 180,
            h: 20
        },

        /* Divisão central */

        {
            x: 480,
            y: 220,
            w: 20,
            h: 210
        },

        {
            x: 480,
            y: 220,
            w: 160,
            h: 20
        },

        /* Obstáculos */

        {
            x: 260,
            y: 100,
            w: 32,
            h: 32,
            obstacle: true
        },

        {
            x: 292,
            y: 100,
            w: 32,
            h: 32,
            obstacle: true
        }
    ],

    lights: [

        {
            x: 130,
            y: 75,
            radius: 90
        },

        {
            x: 390,
            y: 180,
            radius: 80
        },

        {
            x: 610,
            y: 100,
            radius: 95
        },

        {
            x: 680,
            y: 450,
            radius: 85
        }

    ],

    init() {

        this.canvas =
            document.getElementById(
                "gameCanvas"
            );

        this.ctx =
            this.canvas.getContext(
                "2d"
            );

        Player.init();
        Enemy.init();
        MissionSystem.init();

        console.log(
            "[GAME] Sistema inicializado."
        );
    },

    startMission() {

        Player.reset();
        Enemy.reset();
        MissionSystem.reset();

        UISystem.updateStatus(
            "OCULTO",
            "#aeb8c5"
        );

        UISystem.updateObjective(
            "OBJETIVO: RECUPERAR ARQUIVO"
        );

        this.running = true;

        this.loop();
    },

    triggerGameOver() {

        this.running = false;

        AudioSystem.playAlertSound();

        UISystem.showScreen(
            "gameover-screen"
        );
    },

    triggerVictory() {

        this.running = false;

        AudioSystem.playTone(
            523.25,
            "sine",
            0.3,
            0.12
        );

        UISystem.showScreen(
            "victory-screen"
        );
    },

    update() {

        if (!this.running) {
            return;
        }

        Player.update(
            this.walls
        );

        Enemy.update(
            this.walls
        );

        MissionSystem.update(
            Player
        );

        const detected =
            VisionSystem.isPlayerDetected(
                Player,
                Enemy,
                this.walls
            );

        if (detected) {

            Enemy.alert = true;

            UISystem.updateStatus(
                "ALERTA",
                "#d74752"
            );

            this.triggerGameOver();
        }
    },

    drawFloor() {

        const ctx =
            this.ctx;

        /*
         * Piso principal.
         */
        ctx.fillStyle =
            "#292d32";

        ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        /*
         * Placas do piso.
         */
        const tile =
            40;

        ctx.strokeStyle =
            "#33383e";

        ctx.lineWidth =
            1;

        for (
            let x = 0;
            x < this.canvas.width;
            x += tile
        ) {

            for (
                let y = 0;
                y < this.canvas.height;
                y += tile
            ) {

                ctx.strokeRect(
                    x,
                    y,
                    tile,
                    tile
                );
            }
        }
    },

    drawLights() {

        const ctx =
            this.ctx;

        for (const light of this.lights) {

            const gradient =
                ctx.createRadialGradient(
                    light.x,
                    light.y,
                    0,
                    light.x,
                    light.y,
                    light.radius
                );

            gradient.addColorStop(
                0,
                "rgba(210,220,230,0.12)"
            );

            gradient.addColorStop(
                0.55,
                "rgba(170,180,190,0.04)"
            );

            gradient.addColorStop(
                1,
                "rgba(0,0,0,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.fillRect(
                light.x - light.radius,
                light.y - light.radius,
                light.radius * 2,
                light.radius * 2
            );

            /*
             * Pequena lâmpada.
             */
            ctx.fillStyle =
                "#b8c0c8";

            ctx.fillRect(
                light.x - 12,
                light.y - 2,
                24,
                4
            );
        }
    },

    drawWalls() {

        const ctx =
            this.ctx;

        for (const wall of this.walls) {

            if (wall.obstacle) {

                ctx.fillStyle =
                    "#3b4148";

                ctx.fillRect(
                    wall.x,
                    wall.y,
                    wall.w,
                    wall.h
                );

                ctx.strokeStyle =
                    "#1b1f24";

                ctx.strokeRect(
                    wall.x,
                    wall.y,
                    wall.w,
                    wall.h
                );

                continue;
            }

            /*
             * Sombra.
             */
            ctx.fillStyle =
                "#111419";

            ctx.fillRect(
                wall.x + 4,
                wall.y + 4,
                wall.w,
                wall.h
            );

            /*
             * Parede clara.
             */
            ctx.fillStyle =
                "#c3c8cf";

            ctx.fillRect(
                wall.x,
                wall.y,
                wall.w,
                wall.h
            );

            /*
             * Parte inferior.
             */
            ctx.fillStyle =
                "#8d949d";

            ctx.fillRect(
                wall.x,
                wall.y + wall.h - 4,
                wall.w,
                4
            );

            ctx.strokeStyle =
                "#4a5058";

            ctx.strokeRect(
                wall.x,
                wall.y,
                wall.w,
                wall.h
            );
        }
    },

    draw() {

        const ctx =
            this.ctx;

        ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.drawFloor();

        this.drawLights();

        this.drawWalls();

        MissionSystem.draw(
            ctx
        );

        Enemy.draw(
            ctx
        );

        Player.draw(
            ctx
        );
    },

    loop() {

        if (!this.running) {
            return;
        }

        this.update();

        this.draw();

        requestAnimationFrame(
            () => this.loop()
        );
    }
};
