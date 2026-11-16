export class Input{constructor(el){this.keys=new Set;this.once=new Set;this.buttons=false;this.yaw=0;this.pitch=0;addEventListener('keydown',e=>{this.keys.add(e.code);this.once.add(e.code)});addEventListener('keyup',e=>this.keys.delete(e.code));el.addEventListener('mousedown',e=>{if(e.button===0)this.buttons=true});addEventListener('mouseup',e=>{if(e.button===0)this.buttons=false});addEventListener('mousemove',e=>{if(document.pointerLockElement===el){this.yaw-=e.movementX*.0022;this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch-e.movementY*.0022))}});this.el=el}down(k){return this.keys.has(k)}pressed(k){if(!this.once.has(k))return false;this.once.delete(k);return true}lock(){this.el.requestPointerLock()}unlock(){document.exitPointerLock?.()}}

export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// ponytail: browser events remain one input source; no action-map layer until controls need rebinding.
