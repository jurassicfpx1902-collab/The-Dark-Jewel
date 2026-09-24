"use strict";
window.TDJGameOver={show(){const el=document.createElement('section');el.id='gameover';el.className='gameover';el.innerHTML='<div><p>THE DARK JEWEL // ALERT</p><h2>MISSION FAILED</h2><strong>BUCK FOI DETECTADO.</strong><button data-gameover="retry">CONTINUAR</button><button data-gameover="menu">MENU PRINCIPAL</button></div>';document.body.appendChild(el);return el;}};
