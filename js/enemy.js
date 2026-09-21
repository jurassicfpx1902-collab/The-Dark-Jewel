window.Enemy = {

    x: 400,
    y: 200,

    w: 22,
    h: 22,

    angle: 0,

    viewDist: 235,

    fov: Math.PI * 0.85,

    alert: false,


    waypoints: [

        {
            x: 400,
            y: 200
        },

        {
            x: 700,
            y: 200
        },

        {
            x: 700,
            y: 450
        },

        {
            x: 400,
            y: 450
        }

    ],


    targetIdx: 0,

    speed: 1.2,


    init() {

        this.reset();

    },


    reset() {

        this.x =
            this.waypoints[0].x;

        this.y =
            this.waypoints[0].y;

        this.targetIdx = 0;

        this.alert = false;

    },


    update() {

        const target =
            this.waypoints[
                this.targetIdx
            ];


        const dx =
            target.x - this.x;

        const dy =
            target.y - this.y;


        const dist =
            Math.hypot(dx, dy);


        if (dist < 5) {

            this.targetIdx =
                (
                    this.targetIdx + 1
                ) %
                this.waypoints.length;

        }

        else {

            this.angle =
                Math.atan2(dy, dx);


            this.x +=
                Math.cos(this.angle)
                * this.speed;


            this.y +=
                Math.sin(this.angle)
                * this.speed;

        }

    },


    draw(ctx) {

        /*
         * Campo de visão
         */

        VisionSystem.drawGuardVisionCone(
            ctx,
            this
        );


        /*
         * Corpo do guarda
         */

        ctx.save();


        ctx.fillStyle =
            this.alert
                ? "#ff2a3f"
                : "#cc3333";


        ctx.fillRect(
            this.x - this.w / 2,
            this.y - this.h / 2,
            this.w,
            this.h
        );


        ctx.restore();

    }

};
