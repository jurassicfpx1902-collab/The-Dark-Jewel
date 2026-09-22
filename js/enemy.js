"use strict";

class Enemy{

    constructor(waypoints){

        this.waypoints=waypoints;

        this.x=waypoints[0].x;
        this.y=waypoints[0].y;

        this.w=20;
        this.h=20;

        this.targetIndex=1;

        this.speed=.28;

        this.angle=0;

        this.viewDist=155;

        this.fov=Math.PI*.58;

        this.animationTime=0;
        this.frame=0;

        this.eliminated=false;

        this.path=[];
        this.pathIndex=0;

        this.repathTimer=0;

        this.motionPhase=
            Math.random()*Math.PI*2;
    }

    center(){

        return{
            x:this.x+this.w/2,
            y:this.y+this.h/2
        };
    }

    getTarget(){

        return this.waypoints[
            this.targetIndex
        ];
    }

    rebuildPath(objects){

        NavigationSystem.build(objects);

        this.path=
            NavigationSystem.findPath(
                this.center(),
                this.getTarget()
            );

        this.pathIndex=0;

        if(!this.path.length){
            this.repathTimer=40;
        }
    }

    update(objects){

        if(this.eliminated)
            return;

        this.repathTimer--;

        const target=this.getTarget();

        const center=this.center();

        const distanceToTarget=
            Math.hypot(
                target.x-center.x,
                target.y-center.y
            );

        if(distanceToTarget<14){

            this.targetIndex=
                (
                    this.targetIndex+1
                )%
                this.waypoints.length;

            this.path=[];
            this.pathIndex=0;
            this.repathTimer=0;

            return;
        }

        if(
            !this.path.length||
            this.pathIndex>=this.path.length||
            this.repathTimer<=0
        ){

            this.rebuildPath(objects);

            this.repathTimer=75;
        }

        const node=
            this.path[
                this.pathIndex
            ];

        if(!node)
            return;

        const dx=node.x-center.x;
        const dy=node.y-center.y;

        const distance=
            Math.hypot(dx,dy);

        if(distance<5){

            this.pathIndex++;

            return;
        }

        const nx=dx/distance;
        const ny=dy/distance;

        const sideX=-ny;
        const sideY=nx;

        const drift=
            Math.sin(
                performance.now()*.0025+
                this.motionPhase
            )*.035;

        const finalX=
            nx+sideX*drift;

        const finalY=
            ny+sideY*drift;

        const oldX=this.x;
        const oldY=this.y;

        CollisionSystem.move(
            this,
            finalX*this.speed,
            finalY*this.speed,
            objects
        );

        const movedX=this.x-oldX;
        const movedY=this.y-oldY;

        const moved=
            Math.hypot(
                movedX,
                movedY
            );

        if(moved>.01){

            this.angle=
                Math.atan2(
                    movedY,
                    movedX
                );

            this.animationTime+=.115;

            if(this.animationTime>=1){

                this.animationTime=0;

                this.frame=
                    (this.frame+1)%4;
            }

        }else{

            this.repathTimer=0;
        }
    }

    direction(){

        let angle=this.angle;

        while(angle<0)
            angle+=Math.PI*2;

        if(
            angle<Math.PI*.25||
            angle>Math.PI*1.75
        ){
            return"right";
        }

        if(angle<Math.PI*.75)
            return"down";

        if(angle<Math.PI*1.25)
            return"left";

        return"up";
    }

    drawVision(){

        const p=this.center();

        ctx.save();

        ctx.translate(
            p.x,
            p.y
        );

        ctx.rotate(
            this.angle
        );

        ctx.beginPath();

        ctx.moveTo(0,0);

        ctx.arc(
            0,
            0,
            this.viewDist,
            -this.fov/2,
            this.fov/2
        );

        ctx.closePath();

        const gradient=
            ctx.createRadialGradient(
                0,
                0,
                8,
                0,
                0,
                this.viewDist
            );

        gradient.addColorStop(
            0,
            "rgba(220,45,58,.17)"
        );

        gradient.addColorStop(
            .55,
            "rgba(220,45,58,.065)"
        );

        gradient.addColorStop(
            1,
            "rgba(220,45,58,0)"
        );

        ctx.fillStyle=gradient;

        ctx.fill();

        ctx.restore();
    }

    draw(){

        if(this.eliminated){

            ctx.fillStyle="#30373b";

            ctx.fillRect(
                this.x-4,
                this.y+7,
                29,
                7
            );

            return;
        }

        this.drawVision();

        const p=this.center();

        const direction=this.direction();

        const swing=
            Math.sin(
                this.frame*Math.PI/2
            )*.75;

        const bob=
            Math.abs(swing)*.7;

        ctx.save();

        ctx.translate(
            p.x,
            p.y+bob
        );

        Player.drawBody(
            direction,
            swing,
            true
        );

        ctx.restore();
    }
}
