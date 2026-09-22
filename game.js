"use strict";

const WORLD={
    width:800,
    height:600
};

const canvas=
    document.getElementById(
        "gameCanvas"
    );

const ctx=
    canvas.getContext("2d");


const Game={

    running:false,

    paused:false,

    radioOpen:false,

    enemies:[],

    init(){

        this.draw();

        requestAnimationFrame(
            ()=>this.loop()
        );
    },

    start(){

        AudioSystem.init();

        AudioSystem.resume();

        AudioSystem.startAmbient();

        Player.reset();

        MissionSystem.reset();

        this.enemies=[

            new Enemy([
                {x:70,y:90},
                {x:145,y:90},
                {x:145,y:130},
                {x:70,y:130}
            ]),

            new Enemy([
                {x:450,y:70},
                {x:530,y:70},
                {x:530,y:125},
                {x:450,y:125}
            ]),

            new Enemy([
                {x:620,y:240},
                {x:700,y:240},
                {x:700,y:270},
                {x:620,y:270}
            ])
        ];

        NavigationSystem.build(
            this.collisionObjects()
        );

        for(
            const enemy of this.enemies
        ){

            enemy.rebuildPath(
                this.collisionObjects()
            );
        }

        this.running=true;

        this.paused=false;

        UI.startGame();

        UI.setStatus(
            "COMUNICAÇÃO"
        );

        Radio.show(
            "Prossiga até encontrar um dos arquivos centrais, depois... Saia daí o mais rápido possível!",
            ()=>{
                UI.setStatus(
                    "INFILTRAÇÃO"
                );

                showMessage(
                    "OPERAÇÃO NO DARK INICIADA"
                );
            }
        );
    },

    pause(){

        if(
            !this.running||
            this.radioOpen
        ){
            return;
        }

        this.paused=!this.paused;

        UI.setStatus(
            this.paused
            ?"PAUSADO"
            :(
                MissionSystem.hasFile
                ?"EXTRAÇÃO"
                :"INFILTRAÇÃO"
            )
        );
    },

    fail(){

        if(!this.running)
            return;

        this.running=false;

        AudioSystem.alert();

        AudioSystem.stopAmbient();

        UI.endGame();

        UI.show(
            UI.gameover
        );
    },

    complete(){

        if(!this.running)
            return;

        this.running=false;

        AudioSystem.stopAmbient();

        UI.endGame();

        Radio.show(
            "Muito bem, aguarde mais ordens.",
            ()=>{
                AudioSystem.victory();

                UI.show(
                    UI.victory
                );
            }
        );
    },

    collisionObjects(){

        return MapSystem.collisionObjects();
    },

    update(){

        if(
            !this.running||
            this.paused||
            this.radioOpen
        ){
            return;
        }

        const objects=
            this.collisionObjects();

        Player.update(objects);

        for(
            const enemy of this.enemies
        ){

            enemy.update(objects);

            if(
                VisionSystem.detects(
                    Player,
                    enemy,
                    MapSystem.walls
                )
            ){

                UI.setStatus(
                    "DETECÇÃO"
                );

                this.fail();

                return;
            }
        }

        MissionSystem.update();
    },

    draw(){

        ctx.clearRect(
            0,
            0,
            WORLD.width,
            WORLD.height
        );

        MapSystem.draw();

        MissionSystem.draw();

        for(
            const enemy of this.enemies
        ){

            enemy.draw();
        }

        Player.draw();

        const vignette=
            ctx.createRadialGradient(
                400,
                300,
                170,
                400,
                300,
                500
            );

        vignette.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        vignette.addColorStop(
            1,
            "rgba(0,0,0,.48)"
        );

        ctx.fillStyle=vignette;

        ctx.fillRect(
            0,
            0,
            800,
            600
        );
    },

    loop(){

        this.update();

        this.draw();

        requestAnimationFrame(
            ()=>this.loop()
        );
    }
};
