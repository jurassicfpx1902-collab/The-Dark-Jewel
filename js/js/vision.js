window.UISystem = {

    init() {

        this.bindEvents();

    },


    bindEvents() {

        document
            .getElementById("btn-start")
            .onclick = () => {

                this.showScreen(null);

                Game.startMission();

            };


        document
            .getElementById("btn-restart")
            .onclick = () => {

                this.showScreen(null);

                Game.startMission();

            };


        document
            .getElementById("btn-victory-restart")
            .onclick = () => {

                this.showScreen("menu-screen");

            };


        document
            .getElementById("btn-audio")
            .onclick = (event) => {

                const state =
                    AudioSystem.toggle();

                event.target.innerText =
                    `ÁUDIO: ${
                        state
                            ? "LIGADO"
                            : "DESLIGADO"
                    }`;

            };


        this.bindMobileControls();

    },


    bindMobileControls() {

        const mapBtn = (id, key) => {

            const element =
                document.getElementById(id);

            if (!element) {
                return;
            }


            element.addEventListener(
                "pointerdown",
                (event) => {

                    event.preventDefault();

                    Player.keys[key] = true;

                }
            );


            element.addEventListener(
                "pointerup",
                (event) => {

                    event.preventDefault();

                    Player.keys[key] = false;

                }
            );


            element.addEventListener(
                "pointerleave",
                (event) => {

                    event.preventDefault();

                    Player.keys[key] = false;

                }
            );

        };


        mapBtn("btn-up", "w");
        mapBtn("btn-down", "s");
        mapBtn("btn-left", "a");
        mapBtn("btn-right", "d");
        mapBtn("btn-crouch", "c");

    },


    showScreen(screenId) {

        const screens =
            document.querySelectorAll(
                ".screen"
            );


        screens.forEach(screen => {

            screen.classList.remove(
                "active"
            );

        });


        if (screenId) {

            const screen =
                document.getElementById(
                    screenId
                );

            if (screen) {

                screen.classList.add(
                    "active"
                );

            }

        }

    },


    updateStatus(
        text,
        color = "#c4d0e0"
    ) {

        const element =
            document.getElementById(
                "hud-status"
            );


        if (element) {

            element.innerText =
                `STATUS: ${text}`;

            element.style.color =
                color;

        }

    },


    updateObjective(text) {

        const element =
            document.getElementById(
                "hud-objective"
            );


        if (element) {

            element.innerText = text;

        }

    }

};
