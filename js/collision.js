window.Game = {

    canvas: null,
    ctx: null,

    running: false,

    walls: [

        {
            x: 200,
            y: 100,
            w: 20,
            h: 400
        },

        {
            x: 500,
            y: 0,
            w: 20,
            h: 350
        },

        {
            x: 350,
            y: 300,
            w: 300,
            h: 20
        }

    ],


    init() {

        this.canvas =
            document.getElementById("gameCanvas");

        this.ctx =
            this.canvas.getContext("2d");


        Player.init();
        Enemy.init();
        MissionSystem.init();

    },


    startMission() {

        Player.reset();
        Enemy.reset();
        MissionSystem.reset();


        UISystem.updateStatus(
            "OCULTO",
            "#c4d0e0"
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
            0.2
        );

        UISystem.showScreen(
            "victory-screen"
        );

    },


    update() {

        if (!this.running) {
            return;
        }


        Player.update(this.walls);

        Enemy.update();

        MissionSystem.update(Player);


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
                "#ff2a3f"
            );

            this.triggerGameOver();

        }

    },


    draw() {

        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        /*
         * Paredes
         */

        this.ctx.fillStyle = "#162030";

        for (const wall of this.walls) {

            this.ctx.fillRect(
                wall.x,
                wall.y,
                wall.w,
                wall.h
            );

        }


        /*
         * Elementos da missão
         */

        MissionSystem.draw(this.ctx);


        /*
         * Inimigo
         */

        Enemy.draw(this.ctx);


        /*
         * Jogador
         */

        Player.draw(this.ctx);

    },


    loop() {

        if (!Game.running) {
            return;
        }


        Game.update();
        Game.draw();


        requestAnimationFrame(
            Game.loop
        );

    }

};
