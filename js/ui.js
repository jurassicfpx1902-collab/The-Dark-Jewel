window.UISystem = {

    init() {

        this.bindEvents();
        this.bindMobileControls();

    },

    bindEvents() {

        document
            .getElementById("btn-start")
            .addEventListener(
                "click",
                () => {

                    this.showScreen(null);

                    Game.startMission();
                }
            );

        document
            .getElementById("btn-restart")
            .addEventListener(
                "click",
                () => {

                    this.showScreen(null);

                    Game.startMission();
                }
            );

        document
            .getElementById("btn-victory-restart")
            .addEventListener(
                "click",
                () => {

                    this.showScreen(
                        "menu-screen"
                    );
                }
            );

        document
            .getElementById("btn-audio")
            .addEventListener(
                "click",
                (event) => {

                    const enabled =
                        AudioSystem.toggle();

                    event.target.textContent =
                        `ÁUDIO: ${
                            enabled
                                ? "LIGADO"
                                : "DESLIGADO"
                        }`;
                }
            );
    },

    bindMobileControls() {

        const mapButton =
            (id, key) => {

                const button =
                    document.getElementById(id);

                if (!button) {
                    return;
                }

                const press =
                    (event) => {

                        event.preventDefault();

                        Player.keys[key] =
                            true;
                    };

                const release =
                    (event) => {

                        event.preventDefault();

                        Player.keys[key] =
                            false;
                    };

                button.addEventListener(
                    "pointerdown",
                    press
                );

                button.addEventListener(
                    "pointerup",
                    release
                );

                button.addEventListener(
                    "pointercancel",
                    release
                );

                button.addEventListener(
                    "pointerleave",
                    release
                );
            };

        mapButton("btn-up", "w");
        mapButton("btn-down", "s");
        mapButton("btn-left", "a");
        mapButton("btn-right", "d");

        const crouch =
            document.getElementById(
                "btn-crouch"
            );

        crouch.addEventListener(
            "pointerdown",
            (event) => {

                event.preventDefault();

                Player.mobileCrouch =
                    true;
            }
        );

        crouch.addEventListener(
            "pointerup",
            (event) => {

                event.preventDefault();

                Player.mobileCrouch =
                    false;
            }
        );

        crouch.addEventListener(
            "pointercancel",
            () => {

                Player.mobileCrouch =
                    false;
            }
        );
    },

    showScreen(screenId) {

        const screens =
            document.querySelectorAll(
                ".screen"
            );

        screens.forEach(
            screen => {

                screen.classList.remove(
                    "active"
                );
            }
        );

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
        color = "#aeb8c5"
    ) {

        const element =
            document.getElementById(
                "hud-status"
            );

        if (!element) return;

        element.textContent =
            `STATUS: ${text}`;

        element.style.color =
            color;
    },

    updateObjective(text) {

        const element =
            document.getElementById(
                "hud-objective"
            );

        if (element) {
            element.textContent =
                text;
        }
    }
};
