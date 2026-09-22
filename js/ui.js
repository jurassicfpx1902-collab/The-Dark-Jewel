"use strict";

const UI={

    menu:
        document.getElementById(
            "menuScreen"
        ),

    options:
        document.getElementById(
            "optionsScreen"
        ),

    credits:
        document.getElementById(
            "creditsScreen"
        ),

    gameover:
        document.getElementById(
            "gameOverScreen"
        ),

    victory:
        document.getElementById(
            "victoryScreen"
        ),

    hud:
        document.getElementById(
            "hud"
        ),

    objective:
        document.getElementById(
            "objective"
        ),

    status:
        document.getElementById(
            "status"
        ),

    hideAll(){

        [
            this.menu,
            this.options,
            this.credits,
            this.gameover,
            this.victory
        ].forEach(
            screen=>
                screen.classList.add(
                    "hidden"
                )
        );
    },

    show(screen){

        this.hideAll();

        if(screen){
            screen.classList.remove(
                "hidden"
            );
        }
    },

    setObjective(text){

        this.objective.textContent=text;
    },

    setStatus(text){

        this.status.textContent=text;
    },

    startGame(){

        this.show(null);

        this.hud.style.display="flex";
    },

    endGame(){

        this.hud.style.display="none";
    }
};


let messageTimer=null;

function showMessage(text){

    const element=
        document.getElementById(
            "message"
        );

    element.textContent=text;

    element.style.opacity="1";

    clearTimeout(messageTimer);

    messageTimer=setTimeout(
        ()=>{
            element.style.opacity="0";
        },
        1700
    );
}


/* BOTÕES */

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        ()=>{
            Game.start();
        }
    );

document
    .getElementById("optionsButton")
    .addEventListener(
        "click",
        ()=>{
            UI.show(UI.options);
        }
    );

document
    .getElementById("creditsButton")
    .addEventListener(
        "click",
        ()=>{
            UI.show(UI.credits);
        }
    );

document
    .getElementById("backOptions")
    .addEventListener(
        "click",
        ()=>{
            UI.show(UI.menu);
        }
    );

document
    .getElementById("backCredits")
    .addEventListener(
        "click",
        ()=>{
            UI.show(UI.menu);
        }
    );

document
    .getElementById("audioButton")
    .addEventListener(
        "click",
        ()=>{

            AudioSystem.enabled=
                !AudioSystem.enabled;

            document
                .getElementById(
                    "audioButton"
                )
                .textContent=
                    AudioSystem.enabled
                    ?"ÁUDIO: LIGADO"
                    :"ÁUDIO: DESLIGADO";
        }
    );

document
    .getElementById("restartButton")
    .addEventListener(
        "click",
        ()=>{
            Game.start();
        }
    );

document
    .getElementById("menuButton")
    .addEventListener(
        "click",
        ()=>{
            UI.show(UI.menu);
        }
    );

document
    .getElementById("victoryRestart")
    .addEventListener(
        "click",
        ()=>{
            Game.start();
        }
    );

document
    .getElementById("victoryMenu")
    .addEventListener(
        "click",
        ()=>{
            UI.show(UI.menu);
        }
    );
