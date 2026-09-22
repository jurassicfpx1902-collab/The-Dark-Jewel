"use strict";

const MissionSystem={

    file:{
        x:270,
        y:45,
        w:30,
        h:28
    },

    extraction:{
        x:700,
        y:505,
        w:48,
        h:48
    },

    hasFile:false,

    reset(){

        this.hasFile=false;

        UI.setObjective(
            "OBJETIVO: ENCONTRAR O ARQUIVO CENTRAL"
        );

        UI.setStatus(
            "INFILTRAÇÃO"
        );
    },

    update(){

        if(!this.hasFile){

            if(
                CollisionSystem.overlap(
                    Player,
                    this.file
                )
            ){

                this.hasFile=true;

                AudioSystem.objective();

                UI.setObjective(
                    "OBJETIVO: IR ATÉ O PONTO DE EXTRAÇÃO"
                );

                UI.setStatus(
                    "ARQUIVO RECUPERADO"
                );

                showMessage(
                    "ARQUIVO CENTRAL RECUPERADO"
                );

                Radio.show(
                    "Muito bem Buck, agora vá até o ponto de extração.",
                    ()=>{
                        UI.setStatus(
                            "EXTRAÇÃO"
                        );
                    }
                );
            }

        }else{

            if(
                CollisionSystem.overlap(
                    Player,
                    this.extraction
                )
            ){

                Game.complete();
            }
        }
    },

    draw(){

        if(!this.hasFile){

            ctx.fillStyle="#273b4a";

            ctx.fillRect(
                this.file.x,
                this.file.y,
                this.file.w,
                this.file.h
            );

            ctx.strokeStyle="#70b5ff";

            ctx.strokeRect(
                this.file.x,
                this.file.y,
                this.file.w,
                this.file.h
            );

            ctx.fillStyle="#8bcaff";

            ctx.fillRect(
                this.file.x+9,
                this.file.y+7,
                12,
                12
            );
        }

        ctx.strokeStyle=
            this.hasFile
            ?"#63b4ff"
            :"#48535a";

        ctx.lineWidth=2;

        ctx.strokeRect(
            this.extraction.x,
            this.extraction.y,
            this.extraction.w,
            this.extraction.h
        );

        ctx.lineWidth=1;

        if(this.hasFile){

            ctx.fillStyle="#67b8ff";

            ctx.fillRect(
                this.extraction.x+17,
                this.extraction.y+6,
                14,
                3
            );
        }
    }
};
