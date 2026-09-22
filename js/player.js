"use strict";

const Player={

    x:55,
    y:515,

    w:20,
    h:20,

    speed:2.0,

    angle:0,

    crouched:false,

    moving:false,

    animationTime:0,

    frame:0,

    center(){

        return{
            x:this.x+this.w/2,
            y:this.y+this.h/2
        };
    },

    reset(){

        this.x=55;
        this.y=515;

        this.angle=0;

        this.crouched=false;

        this.animationTime=0;
        this.frame=0;
    },

    update(objects){

        let dx=0;
        let dy=0;

        if(keys["w"]||keys["arrowup"])dy-=1;
        if(keys["s"]||keys["arrowdown"])dy+=1;
        if(keys["a"]||keys["arrowleft"])dx-=1;
        if(keys["d"]||keys["arrowright"])dx+=1;

        dx+=Joystick.x;
        dy+=Joystick.y;

        const length=Math.hypot(dx,dy);

        this.moving=length>.12;

        if(length>1){

            dx/=length;
            dy/=length;
        }

        this.crouched=
            keys["c"]||
            keys["shift"]||
            MobileControls.crouch;

        const speed=
            this.crouched
            ?this.speed*.52
            :this.speed;

        if(this.moving){

            CollisionSystem.move(
                this,
                dx*speed,
                dy*speed,
                objects
            );

            this.angle=Math.atan2(dy,dx);

            this.animationTime+=
                this.crouched?.07:.13;

            if(this.animationTime>1){

                this.animationTime=0;

                this.frame=
                    (this.frame+1)%4;
            }

            AudioSystem.step(
                this.crouched
            );

        }else{

            this.frame=0;
        }

        this.x=Math.max(
            31,
            Math.min(749,this.x)
        );

        this.y=Math.max(
            31,
            Math.min(549,this.y)
        );
    },

    direction(){

        let angle=this.angle;

        while(angle<0)
            angle+=Math.PI*2;

        if(
            angle<Math.PI*.25||
            angle>Math.PI*1.75
        )return"right";

        if(angle<Math.PI*.75)
            return"down";

        if(angle<Math.PI*1.25)
            return"left";

        return"up";
    },

    draw(){

        const p=this.center();

        const direction=this.direction();

        const swing=
            this.moving
            ?Math.sin(
                this.frame*Math.PI/2
            )
            :0;

        ctx.save();

        ctx.translate(p.x,p.y);

        const bob=
            this.moving
            ?Math.abs(swing)*.8
            :0;

        ctx.translate(0,bob);

        this.drawBody(
            direction,
            swing,
            false
        );

        ctx.restore();
    },

    drawBody(direction,swing,enemy){

        const skin=
            enemy
            ?"#1b2228"
            :"#cba88e";

        const hair=
            enemy
            ?"#141a1f"
            :"#c9b687";

        const uniform=
            enemy
            ?"#171e24"
            :"#182027";

        const gear=
            enemy
            ?"#28323a"
            :"#25313a";

        ctx.fillStyle="rgba(0,0,0,.35)";

        ctx.fillRect(-9,9,18,4);

        if(direction==="up"){

            ctx.fillStyle=gear;
            ctx.fillRect(-8,-2,16,15);

            ctx.fillStyle=
                enemy?"#222b32":"#2d3941";

            ctx.fillRect(-6,-1,12,10);

            ctx.fillStyle=uniform;

            ctx.fillRect(-10,-1,4,10);
            ctx.fillRect(6,-1,4,10);

            ctx.fillStyle=skin;

            if(!enemy){

                ctx.fillRect(-5,-11,10,8);

                ctx.fillStyle=hair;

                ctx.fillRect(-5,-12,10,4);

            }else{

                ctx.fillStyle="#222a30";

                ctx.fillRect(-6,-12,12,9);
            }

        }else{

            ctx.fillStyle=uniform;

            ctx.fillRect(-7,-3,14,15);

            ctx.fillStyle=gear;

            ctx.fillRect(-10,-2,4,8);
            ctx.fillRect(6,-2,4,8);

            ctx.fillStyle=uniform;

            ctx.fillRect(-10,2+swing*2,4,9);
            ctx.fillRect(6,2-swing*2,4,9);

            ctx.fillRect(-6,9+swing*2,5,9);
            ctx.fillRect(1,9-swing*2,5,9);

            if(enemy){

                ctx.fillStyle="#20282f";

                ctx.fillRect(-6,-13,12,10);

                ctx.fillStyle="#56636c";

                ctx.fillRect(-5,-10,10,3);

            }else{

                ctx.fillStyle=skin;

                ctx.fillRect(-5,-12,10,9);

                ctx.fillStyle=hair;

                ctx.fillRect(-5,-13,10,4);
                ctx.fillRect(-6,-11,2,5);

                if(direction==="down"){

                    ctx.fillStyle="#6e91b5";

                    ctx.fillRect(-4,-8,2,2);
                    ctx.fillRect(2,-8,2,2);
                }
            }
        }

        if(
            direction==="right"||
            direction==="left"
        ){

            ctx.fillStyle=gear;

            ctx.fillRect(
                direction==="right"?-8:5,
                -1,
                4,
                12
            );

            ctx.fillStyle=
                enemy
                ?"#303b43"
                :"#33414a";

            ctx.fillRect(
                direction==="right"?8:-15,
                2+swing,
                7,
                3
            );
        }
    },

    action(enemies){

        const p=this.center();

        for(const enemy of enemies){

            if(enemy.eliminated)
                continue;

            const e=enemy.center();

            const distance=
                Math.hypot(
                    e.x-p.x,
                    e.y-p.y
                );

            if(distance>38)
                continue;

            const angleToBuck=
                Math.atan2(
                    p.y-e.y,
                    p.x-e.x
                );

            let difference=
                angleToBuck-
                (enemy.angle+Math.PI);

            while(difference>Math.PI)
                difference-=Math.PI*2;

            while(difference<-Math.PI)
                difference+=Math.PI*2;

            if(
                Math.abs(difference)<
                Math.PI*.65
            ){

                enemy.eliminated=true;

                AudioSystem.action();

                showMessage(
                    "ALVO NEUTRALIZADO"
                );

                return;
            }
        }

        showMessage(
            "POSIÇÃO INADEQUADA"
        );
    }
};
