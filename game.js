window.Game = {

    running: false,

    init() {

        console.log(
            "[GAME] Game.js carregado."
        );

        this.running = true;

        this.startLoop();
    },

    startLoop() {

        const loop = () => {

            if (!this.running) {
                return;
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
};
