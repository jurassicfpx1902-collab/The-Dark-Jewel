"use strict";

const keys = {};

const Joystick = {
    x: 0,
    y: 0,
    active: false,
    touchId: null,
    pointer: null
};

const MobileControls = {
    crouch: false,
    action: false,
    pause: false
};

window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    keys[key] = true;

    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " ", "shift", "c"].includes(key)) {
        event.preventDefault();
    }
});

window.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    keys[key] = false;
});

window.addEventListener("blur", () => {
    Object.keys(keys).forEach((key) => {
        keys[key] = false;
    });

    Joystick.x = 0;
    Joystick.y = 0;
    Joystick.active = false;
    MobileControls.crouch = false;
    MobileControls.action = false;
});

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function setupVirtualJoystick() {
    const joystick = document.getElementById("joystick");
    const stick = document.getElementById("stick");

    if (!joystick || !stick) return;

    const updateStick = (clientX, clientY) => {
        const rect = joystick.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const radius = rect.width * 0.34;
        const length = Math.hypot(dx, dy) || 1;
        const limited = Math.min(length, radius);
        const nx = (dx / length) * limited;
        const ny = (dy / length) * limited;

        const x = nx / radius;
        const y = ny / radius;

        Joystick.x = x;
        Joystick.y = y;
        Joystick.active = true;

        stick.style.left = `${38 + nx}px`;
        stick.style.top = `${38 + ny}px`;
    };

    const resetStick = () => {
        Joystick.x = 0;
        Joystick.y = 0;
        Joystick.active = false;
        stick.style.left = "38px";
        stick.style.top = "38px";
    };

    joystick.addEventListener("pointerdown", (event) => {
        joystick.setPointerCapture(event.pointerId);
        updateStick(event.clientX, event.clientY);
    });

    joystick.addEventListener("pointermove", (event) => {
        if (event.pressure === 0) return;
        updateStick(event.clientX, event.clientY);
    });

    joystick.addEventListener("pointerup", resetStick);
    joystick.addEventListener("pointerleave", resetStick);
    joystick.addEventListener("pointercancel", resetStick);
}

function setupMobileButtons() {
    const actionButton = document.getElementById("actionButton");
    const crouchButton = document.getElementById("crouchButton");
    const pauseButton = document.getElementById("pauseButton");

    if (actionButton) {
        actionButton.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            MobileControls.action = true;

            if (typeof Game !== "undefined" && Game.running && !Game.paused && !Game.radioOpen) {
                Player.action(Game.enemies);
            }
        });

        actionButton.addEventListener("pointerup", () => {
            MobileControls.action = false;
        });

        actionButton.addEventListener("pointerleave", () => {
            MobileControls.action = false;
        });
    }

    if (crouchButton) {
        crouchButton.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            MobileControls.crouch = true;
        });

        crouchButton.addEventListener("pointerup", () => {
            MobileControls.crouch = false;
        });

        crouchButton.addEventListener("pointerleave", () => {
            MobileControls.crouch = false;
        });
    }

    if (pauseButton) {
        pauseButton.addEventListener("click", () => {
            if (typeof Game !== "undefined") {
                Game.pause();
            }
        });
    }
}

setupVirtualJoystick();
setupMobileButtons();
