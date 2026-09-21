window.MissionSystem = {

    name: "OPERATION // NO DARK",

    id: "MISSION 01",

    location: "Base Dinamarquesa",

    agent: "BUCK",

    hasDocument: false,


    documentArea: {
        x: 720,
        y: 70,
        w: 30,
        h: 30
    },


    extractionArea: {
        x: 30,
        y: 520,
        w: 50,
        h: 50
    },


    init() {

        this.reset();

    },


    reset() {

        this.hasDocument = false;

    },


    update(player) {

        /*
         * Recuperar arquivo
         */

        if (!this.hasDocument) {

            if (
                CollisionSystem.checkWallCollision(
                    player,
                    [this.documentArea]
                )
            ) {

                this.hasDocument = true;


                AudioSystem.playTone(
                    880,
                    "sine",
                    0.15,
                    0.2
                );


                UISystem.updateObjective(
                    "OBJETIVO: VÁ PARA A EXTRAÇÃO"
                );

            }

        }


        /*
         * Extração
         */

        else {

            if (
                CollisionSystem.checkWallCollision(
                    player,
                    [this.extractionArea]
                )
            ) {

                Game.triggerVictory();

            }

        }

    },


    draw(ctx) {

        ctx.save();


        /*
         * Arquivo
         */

        if (!this.hasDocument) {

            ctx.fillStyle = "#ffcc00";

            ctx.fillRect(
                this.documentArea.x,
                this.documentArea.y,
                this.documentArea.w,
                this.documentArea.h
            );

        }


        /*
         * Extração
         */

        ctx.strokeStyle =
            this.hasDocument
                ? "#00ff66"
                : "#555555";


        ctx.lineWidth = 2;


        ctx.strokeRect(
            this.extractionArea.x,
            this.extractionArea.y,
            this.extractionArea.w,
            this.extractionArea.h
        );


        ctx.restore();

    }

};
