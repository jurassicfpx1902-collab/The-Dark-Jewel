window.MissionSystem = {

    name:
        "OPERATION // NO DARK",

    id:
        "MISSION 01",

    location:
        "BASE DINAMARQUESA",

    agent:
        "BUCK",

    hasDocument:
        false,

    documentArea: {
        x: 420,
        y: 300,
        w: 28,
        h: 28
    },

    extractionArea: {
        x: 700,
        y: 500,
        w: 45,
        h: 45
    },

    init() {
        this.reset();
    },

    reset() {

        this.hasDocument =
            false;
    },

    update(player) {

        if (!this.hasDocument) {

            if (
                CollisionSystem.rectsOverlap(
                    player,
                    this.documentArea
                )
            ) {

                this.hasDocument =
                    true;

                AudioSystem.playTone(
                    880,
                    "sine",
                    0.15,
                    0.12
                );

                UISystem.updateObjective(
                    "OBJETIVO: VÁ PARA A EXTRAÇÃO"
                );
            }

        } else {

            if (
                CollisionSystem.rectsOverlap(
                    player,
                    this.extractionArea
                )
            ) {

                Game.triggerVictory();
            }
        }
    },

    draw(ctx) {

        /*
         * OBJETIVO
         */
        if (!this.hasDocument) {

            const cx =
                this.documentArea.x + 14;

            const cy =
                this.documentArea.y + 14;

            ctx.save();

            ctx.shadowColor =
                "#5b9bd5";

            ctx.shadowBlur = 10;

            ctx.fillStyle =
                "#5b9bd5";

            ctx.beginPath();

            ctx.moveTo(
                cx,
                cy - 11
            );

            ctx.lineTo(
                cx + 9,
                cy
            );

            ctx.lineTo(
                cx,
                cy + 11
            );

            ctx.lineTo(
                cx - 9,
                cy
            );

            ctx.closePath();

            ctx.fill();

            ctx.shadowBlur = 0;

            ctx.fillStyle =
                "#e1e8ef";

            ctx.fillRect(
                cx - 2,
                cy - 2,
                4,
                4
            );

            ctx.restore();
        }

        /*
         * EXTRAÇÃO
         */
        const ext =
            this.extractionArea;

        ctx.fillStyle =
            this.hasDocument
                ? "rgba(110,180,135,0.14)"
                : "rgba(80,90,100,0.08)";

        ctx.fillRect(
            ext.x,
            ext.y,
            ext.w,
            ext.h
        );

        ctx.strokeStyle =
            this.hasDocument
                ? "#72b88a"
                : "#59616b";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            ext.x,
            ext.y,
            ext.w,
            ext.h
        );

        /*
         * Símbolo de saída.
         */
        ctx.fillStyle =
            this.hasDocument
                ? "#72b88a"
                : "#59616b";

        ctx.beginPath();

        ctx.moveTo(
            ext.x + 13,
            ext.y + 11
        );

        ctx.lineTo(
            ext.x + 30,
            ext.y + 22
        );

        ctx.lineTo(
            ext.x + 13,
            ext.y + 33
        );

        ctx.fill();
    }
};
