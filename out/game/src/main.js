import * as THREE from 'three';
import { Input } from './input.js';
import { World } from './world.js';
import { Player } from './player.js';
import { Weapon } from './weapon.js';
import { Bots } from './targets.js';
import { HUD } from './hud.js';

const clock=new THREE.Clock(), scene=new THREE.Scene(); scene.background=new THREE.Color(0x0b1116); scene.fog=new THREE.Fog(0x0b1116,28,100);
const camera=new THREE.PerspectiveCamera(74,innerWidth/innerHeight,.05,140); camera.rotation.order='YXZ';
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; document.querySelector('#game').append(renderer.domElement);
const input=new Input(renderer.domElement), world=new World(scene), player=new Player(camera,world,input), weapon=new Weapon(camera,scene,world,input,player), bots=new Bots(scene,world,player,weapon), hud=new HUD();
let mode='menu', round=1, score=0, money=800, time=105, buyOpen=false, last=performance.now();
const overlay=document.querySelector('#overlay'), title=document.querySelector('#overlay-title'), copy=document.querySelector('#overlay-copy'), play=document.querySelector('#play');
function start(){ mode='play'; overlay.hidden=true; input.lock(); resetRound(); }
function resetRound(){time=105; player.reset(); weapon.reset(); bots.reset(round); hud.setMessage('ROUND '+round+'  |  BUY PHASE  |  B: BUY');}
function end(win){mode='end'; input.unlock(); title.textContent=win?'ROUND WON':'ROUND LOST'; copy.textContent=win?'Site secured. Press play for next round.':'Team eliminated. Press play to retry.'; play.textContent='NEXT ROUND'; overlay.hidden=false; if(win){score++;money+=3000;}else money=Math.max(0,money-400);}
play.onclick=start;
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
function fixed(dt){if(mode!=='play')return; if(input.pressed('KeyB')){buyOpen=!buyOpen;hud.buy(buyOpen,money,weapon);} if(buyOpen){if(input.pressed('Digit1')&&money>=2700){money-=2700;weapon.select('VANGUARD');}if(input.pressed('Digit2')&&money>=1600){money-=1600;weapon.select('RIPTIDE');}if(input.pressed('Digit3')&&money>=300){money-=300;weapon.grenade=true;}return;} time-=dt; player.step(dt); weapon.step(dt); bots.step(dt); if(input.pressed('KeyE'))bots.objective(); if(time<=0||bots.alive===0)end(bots.alive===0); if(player.health<=0)end(false); hud.update(player,weapon,time,round,score,money,bots.alive);}
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;fixed(dt);renderer.render(scene,camera);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&mode==='play'){mode='menu';input.unlock();overlay.hidden=false;title.textContent='PAUSED';copy.textContent='Click to resume tactical insertion.';play.textContent='RESUME';}});
export {scene};
steady();
function steady(){world.decorate();}
window.__fps={scene,player,weapon,bots};

// ponytail: single scene loop ceiling; split modules only where state ownership matters.
