"use strict";
window.TDJCamera=function(viewW,viewH){return{x:0,y:0,w:viewW,h:viewH,follow(target,worldW,worldH){this.x=Math.max(0,Math.min(worldW-this.w,target.x-this.w/2));this.y=Math.max(0,Math.min(worldH-this.h,target.y-this.h/2));}}};
