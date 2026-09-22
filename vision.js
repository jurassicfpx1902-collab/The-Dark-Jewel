"use strict";

const VisionSystem={

    detects(player,enemy,walls){

        if(enemy.eliminated)
            return false;

        const p=player.center();
        const e=enemy.center();

        const dx=p.x-e.x;
        const dy=p.y-e.y;

        const distance=Math.hypot(dx,dy);

        const effectiveDistance=
            player.crouched
            ?enemy.viewDist*.58
            :enemy.viewDist;

        if(distance>effectiveDistance)
            return false;

        const angleToPlayer=
            Math.atan2(dy,dx);

        let difference=
            angleToPlayer-
            enemy.angle;

        while(difference>Math.PI)
            difference-=Math.PI*2;

        while(difference<-Math.PI)
            difference+=Math.PI*2;

        if(
            Math.abs(difference)>
            enemy.fov/2
        ){
            return false;
        }

        return CollisionSystem.lineOfSight(
            e,
            p,
            walls
        );
    }
};
