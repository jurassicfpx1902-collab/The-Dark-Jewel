"use strict";

const Radio = {
    screen: document.getElementById("radioScreen"),
    text: document.getElementById("radioText"),
    button: document.getElementById("radioContinue"),
    callback: null,

    show(text, callback) {
        this.text.textContent = text;
        this.callback = callback || null;
        this.screen.classList.remove("hidden");
        AudioSystem.radioOpen();
        Game.radioOpen = true;
    },

    close() {
        this.screen.classList.add("hidden");
        AudioSystem.radioClose();
        Game.radioOpen = false;

        if (this.callback) {
            const callback = this.callback;
            this.callback = null;
            callback();
        }
    }
};

Radio.button.addEventListener("click", () => Radio.close());
