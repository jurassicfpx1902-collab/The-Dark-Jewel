"use strict";

const MapSystem = {
    walls: [
        {x:0,y:0,w:800,h:30},{x:0,y:570,w:800,h:30},
        {x:0,y:0,w:30,h:600},{x:770,y:0,w:30,h:600},
        {x:170,y:30,w:25,h:120},{x:170,y:150,w:150,h:25},
        {x:320,y:30,w:25,h:85},{x:395,y:30,w:25,h:125},
        {x:395,y:235,w:25,h:160},{x:420,y:155,w:155,h:25},
        {x:575,y:30,w:25,h:150},{x:600,y:180,w:120,h:25},
        {x:575,y:400,w:25,h:170},{x:150,y:395,w:245,h:25},
        {x:150,y:420,w:25,h:100},{x:420,y:440,w:155,h:25},
        {x:680,y:300,w:90,h:20},{x:30,y:280,w:95,h:20}
    ],
    objects: [
        {type:"table",x:75,y:80,w:65,h:30},{type:"table",x:455,y:75,w:70,h:30},
        {type:"table",x:635,y:250,w:70,h:30},{type:"crate",x:90,y:180,w:32,h:32},
        {type:"crate",x:125,y:180,w:32,h:32},{type:"crate",x:650,y:330,w:32,h:32},
        {type:"computer",x:250,y:70,w:28,h:20},{type:"computer",x:480,y:210,w:28,h:20},
        {type:"chair",x:105,y:120,w:15,h:15},{type:"chair",x:490,y:115,w:15,h:15},
        {type:"chair",x:670,y:290,w:15,h:15},{type:"terminal",x:710,y:225,w:18,h:42},
        {type:"terminal",x:730,y:475,w:18,h:42}
    ],
    collisionObjects() {
        return [...this.walls, ...this.objects.filter(o => o.type === "crate" || o.type === "table").map(({x,y,w,h}) => ({x,y,w,h}))];
    },
    draw() {
        ctx.fillStyle="#252a2d"; ctx.fillRect(0,0,800,600);
        for (let y=30;y<570;y+=42) for (let x=30;x<770;x+=42) {
            ctx.fillStyle=`rgba(255,255,255,${(((x/42+y/42)%3)*3)/1000})`;
            ctx.fillRect(x+1,y+1,40,40);
        }
        ctx.strokeStyle="rgba(210,215,218,.07)";
        for (let x=30;x<770;x+=42) { ctx.beginPath(); ctx.moveTo(x,30); ctx.lineTo(x,570); ctx.stroke(); }
        for (let y=30;y<570;y+=42) { ctx.beginPath(); ctx.moveTo(30,y); ctx.lineTo(770,y); ctx.stroke(); }
        for (const wall of this.walls) {
            ctx.fillStyle="#d0d5d8"; ctx.fillRect(wall.x,wall.y,wall.w,wall.h);
            ctx.fillStyle="rgba(0,0,0,.14)"; ctx.fillRect(wall.x,wall.y+wall.h-5,wall.w,5);
            ctx.strokeStyle="#8b9499"; ctx.strokeRect(wall.x,wall.y,wall.w,wall.h);
        }
        for (const object of this.objects) this.drawObject(object);
        ctx.fillStyle="rgba(190,200,205,.28)"; ctx.font="10px Arial";
        ctx.fillText("01 // SALA DO ARQUIVO",48,52); ctx.fillText("02 // SAÍDA",625,52);
    },
    drawObject(object) {
        if (object.type === "table") {
            ctx.fillStyle="#4b555b"; ctx.fillRect(object.x,object.y,object.w,object.h);
            ctx.fillStyle="#69747a"; ctx.fillRect(object.x+4,object.y+4,object.w-8,5); return;
        }
        if (object.type === "crate") {
            ctx.fillStyle="#414a4f"; ctx.fillRect(object.x,object.y,object.w,object.h);
            ctx.strokeStyle="#667178"; ctx.strokeRect(object.x,object.y,object.w,object.h);
            ctx.beginPath(); ctx.moveTo(object.x,object.y); ctx.lineTo(object.x+object.w,object.y+object.h);
            ctx.moveTo(object.x+object.w,object.y); ctx.lineTo(object.x,object.y+object.h); ctx.stroke(); return;
        }
        if (object.type === "computer") {
            ctx.fillStyle="#202a30"; ctx.fillRect(object.x,object.y,object.w,object.h);
            ctx.fillStyle="#426d91"; ctx.fillRect(object.x+4,object.y+3,object.w-8,9); return;
        }
        if (object.type === "chair") { ctx.strokeStyle="#59636a"; ctx.strokeRect(object.x,object.y,object.w,object.h); return; }
        if (object.type === "terminal") {
            ctx.fillStyle="#1b242a"; ctx.fillRect(object.x,object.y,object.w,object.h);
            ctx.fillStyle="#356f94"; ctx.fillRect(object.x+4,object.y+6,object.w-8,12);
        }
    }
};
