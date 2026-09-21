window.AudioSystem = {

    enabled: true,
    ctx: null,

    init() {

        try {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (AudioContext) {
                this.ctx = new AudioContext();
            }

        } catch (error) {

            console.warn(
                "[AUDIO] Web Audio indisponível."
            );

        }
    },

    playTone(
        frequency,
        type = "sine",
        duration = 0.1,
        volume = 0.08
    ) {

        if (!this.enabled || !this.ctx) {
            return;
        }

        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }

        const oscillator =
            this.ctx.createOscillator();

        const gain =
            this.ctx.createGain();

        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
            frequency,
            this.ctx.currentTime
        );

        gain.gain.setValueAtTime(
            volume,
            this.ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.00001,
            this.ctx.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(this.ctx.destination);

        oscillator.start();

        oscillator.stop(
            this.ctx.currentTime + duration
        );
    },

    playAlertSound() {

        this.playTone(
            620,
            "sawtooth",
            0.18,
            0.15
        );

    },

    toggle() {

        this.enabled = !this.enabled;

        return this.enabled;
    }
};
