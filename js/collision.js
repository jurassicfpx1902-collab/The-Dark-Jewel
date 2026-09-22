"use strict";

const CollisionSystem = {

    overlap(a,b){

        return(
            a.x<b.x+b.w &&
            a.x+a.w>b.x &&
            a.y<b.y+b.h &&
            a.y+a.h>b.y
        );
    },

    blocked(rect,objects){

        for(const object of objects){

            if(
                this.overlap(
                    rect,
                    object
                )
            ){
                return true;
            }
        }

        return false;
    },

    move(entity,dx,dy,objects){

        const nextX={
            x:entity.x+dx,
            y:entity.y,
            w:entity.w,
            h:entity.h
        };

        if(
            !this.blocked(
                nextX,
                objects
            )
        ){
            entity.x+=dx;
        }

        const nextY={
            x:entity.x,
            y:entity.y+dy,
            w:entity.w,
            h:entity.h
        };

        if(
            !this.blocked(
                nextY,
                objects
            )
        ){
            entity.y+=dy;
        }
    },

    segmentRect(p1,p2,rect){

        const dx=p2.x-p1.x;
        const dy=p2.y-p1.y;

        let t0=0;
        let t1=1;

        const p=[
            -dx,
            dx,
            -dy,
            dy
        ];

        const q=[
            p1.x-rect.x,
            rect.x+rect.w-p1.x,
            p1.y-rect.y,
            rect.y+rect.h-p1.y
        ];

        for(let i=0;i<4;i++){

            if(p[i]===0){

                if(q[i]<0)return false;

            }else{

                const r=q[i]/p[i];

                if(p[i]<0){

                    if(r>t1)return false;

                    if(r>t0)t0=r;

                }else{

                    if(r<t0)return false;

                    if(r<t1)t1=r;
                }
            }
        }

        return true;
    },

    lineOfSight(a,b,walls){

        for(const wall of walls){

            if(
                this.segmentRect(
                    a,
                    b,
                    wall
                )
            ){
                return false;
            }
        }

        return true;
    }
};
