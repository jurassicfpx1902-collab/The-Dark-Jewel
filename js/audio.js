"use strict";

const AudioSystem = {

    ctx:null,

    enabled:true,

    lastStep:0,

    ambient:null,

    init(){

        if(this.ctx)return;

        try{

            this.ctx =
                new(
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }catch(e){

            this.enabled=false;
        }
    },

    resume(){

        if(!this.ctx){
            this.init();
        }

        if(
            this.ctx &&
            this.ctx.state==="suspended"
        ){
            this.ctx.resume();
        }
    },

    tone(
        frequency,
        duration,
        type="sine",
        volume=.03
    ){

        if(!this.enabled)return;

        this.resume();

        if(!this.ctx)return;

        const osc =
            this.ctx.createOscillator();

        const gain =
            this.ctx.createGain();

        osc.type=type;

        osc.frequency.value=frequency;

        gain.gain.setValueAtTime(
            volume,
            this.ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            .001,
            this.ctx.currentTime+duration
        );

        osc.connect(gain);

        gain.connect(
            this.ctx.destination
        );

        osc.start();

        osc.stop(
            this.ctx.currentTime+duration
        );
    },

    radioOpen(){

        this.tone(
            850,.06,"square",.025
        );

        setTimeout(()=>{
            this.tone(
                620,.06,"square",.02
            );
        },70);
    },

    radioClose(){

        this.tone(
            480,.08,"square",.02
        );
    },

    step(crouched=false){

        const now=performance.now();

        const interval =
            crouched
            ?540
            :315;

        if(
            now-this.lastStep<
            interval
        )return;

        this.lastStep=now;

        this.tone(
            crouched?90:125,
            crouched?.045:.065,
            "triangle",
            crouched?.014:.026
        );
    },

    objective(){

        this.tone(
            440,.08,"sine",.025
        );

        setTimeout(()=>{
            this.tone(
                610,.12,"sine",.025
            );
        },90);
    },

    alert(){

        this.tone(
            310,.08,"square",.04
        );

        setTimeout(()=>{
            this.tone(
                190,.13,"square",.035
            );
        },100);
    },

    action(){

        this.tone(
            100,.07,"triangle",.025
        );

        setTimeout(()=>{
            this.tone(
                70,.09,"triangle",.018
            );
        },80);
    },

    victory(){

        this.tone(
            330,.12,"sine",.035
        );

        setTimeout(()=>{
            this.tone(
                495,.12,"sine",.035
            );
        },120);

        setTimeout(()=>{
            this.tone(
                660,.18,"sine",.035
            );
        },240);
    },

    startAmbient(){

        if(
            !this.enabled ||
            !this.ctx ||
            this.ambient
        )return;

        const osc =
            this.ctx.createOscillator();

        const gain =
            this.ctx.createGain();

        osc.type="sine";

        osc.frequency.value=52;

        gain.gain.value=.008;

        osc.connect(gain);

        gain.connect(
            this.ctx.destination
        );

        osc.start();

        this.ambient={
            osc,
            gain
        };
    },

    stopAmbient(){

        if(!this.ambient)return;

        try{
            this.ambient.osc.stop();
        }catch(e){}

        this.ambient=null;
    }
};
