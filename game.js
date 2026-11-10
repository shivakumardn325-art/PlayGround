import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const canvas=document.querySelector('#world');
const scene=new THREE.Scene();scene.background=new THREE.Color('#c9e6d9');scene.fog=new THREE.Fog('#c9e6d9',24,52);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);camera.position.set(0,12,16);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
scene.add(new THREE.HemisphereLight('#f5ffe7','#799b85',1.65));const sun=new THREE.DirectionalLight('#fff0cb',2.35);sun.position.set(-7,15,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;scene.add(sun);
const mat=(color,rough=.9)=>new THREE.MeshStandardMaterial({color,roughness:rough});
const mats={grass:mat('#9fc58f'),darkgrass:mat('#8eb486'),path:mat('#e5d6b7'),cream:mat('#f3e7cf'),roof:mat('#c87c65'),wood:mat('#a87954'),leaf:mat('#719d72'),leaf2:mat('#91b57c'),flower:mat('#eac878'),pink:mat('#e9a1a0'),blue:mat('#9dcbd0'),water:mat('#75b8b2',.3),white:mat('#fff5df'),skin:mat('#e9b995'),hair:mat('#594739'),shirt:mat('#da927f'),pants:mat('#617e75'),cat:mat('#e9d8b8'),orange:mat('#edaa55')};
function mesh(geo,material,x,y,z,parent=scene){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(x,y,z,sx,sy,sz,material,parent=scene){return mesh(new THREE.BoxGeometry(sx,sy,sz),material,x,y,z,parent)}
function ball(x,y,z,r,material,parent=scene){return mesh(new THREE.SphereGeometry(r,12,9),material,x,y,z,parent)}
function cylinder(x,y,z,rt,rb,h,material,parent=scene,segments=10){return mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material,x,y,z,parent)}
// soft green island and winding footpaths
const ground=mesh(new THREE.PlaneGeometry(60,60),mats.grass,0,-.2,0);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;
function path(x,z,w,d,rotation=0){const p=box(x,-.06,z,w,.08,d,mats.path);p.rotation.y=rotation;return p}path(0,3.8,2.1,14,-.27);path(-1,-2.4,11,1.7,-.11);path(4.5,2.3,1.7,10,-.28);path(-4,-7,7,.95,.1);
// tiny cottage
box(-6,.95,-6,5.6,2.2,4.4,mats.cream);const roof=mesh(new THREE.ConeGeometry(4.5,2.4,4),mats.roof,-6,3,-6);roof.rotation.y=Math.PI/4;roof.scale.set(1,.72,.72);
box(-6,.8,-3.76,1.15,1.6,.12,mats.wood);box(-7.85,1.35,-3.75,.8,.75,.13,mats.blue);box(-4.2,1.35,-3.75,.8,.75,.13,mats.blue);box(-6,2.1,-3.75,.1,2.4,.15,mats.cream);
// porch, fence and garden beds
box(-6,.12,-3.2,3.3,.22,1.2,mats.wood);for(let i=0;i<8;i++){const x=-10+i*.57;box(x,.42,-9,.1,.8,.12,mats.cream);box(x,.75,-9,.12,.09,.16,mats.wood)}box(-8,.63,-9,4.5,.12,.15,mats.wood);box(-10,.63,-5.7,.12,.13,6,mats.wood);
// flowers and plant bed
function flower(x,z,petal=mats.pink,scale=1){cylinder(x,.24*scale,z,.035,.045,.45*scale,mats.leaf2);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ball(x+Math.cos(a)*.11*scale,.45*scale,z+Math.sin(a)*.11*scale,.09*scale,petal)}ball(x,.46*scale,z,.065*scale,mats.flower)}
box(3,.09,-5,4,.18,2.2,mat('#80674c'));box(3,.2,-5,3.8,.12,2,mat('#93aa68'));for(let i=0;i<18;i++)flower(1.45+(i%6)*.62,-5.72+Math.floor(i/6)*.67,i%3===0?mats.pink:i%3===1?mats.white:mats.flower,.8+Math.random()*.2);
// citrus tree + pickable orange
cylinder(-10,1.5,-1.7,.18,.3,3,mats.wood);for(const [x,y,z,r] of [[-10,3,-1.7,1.4],[-10.9,2.6,-1.5,.9],[-9.2,2.7,-1.9,.95]])ball(x,y,z,r,mats.leaf);const oranges=[];for(const [x,y,z] of [[-9.2,2.6,-1.5],[-10.7,2.3,-1.1],[-9.7,3.5,-2.1],[-10.2,2.9,-2.6]])oranges.push(ball(x,y,z,.17,mats.orange));
// pond and stepping stones
const pond=mesh(new THREE.CylinderGeometry(3.2,3.2,.18,32),mats.water,8,-.01,-5);pond.scale.set(1,.8,.78);for(let i=0;i<4;i++){const s=mesh(new THREE.CylinderGeometry(.42,.48,.16,8),mat('#c8c3a2'),5.1+i*.7,.02,-3.7-i*.2);s.rotation.y=.2*i}
// broadleaf trees, shrubs, tiny garden details
function tree(x,z,s=1){cylinder(x,.9*s,z,.17*s,.29*s,1.8*s,mats.wood);ball(x,.9+1.55*s,z,.95*s,mats.leaf);ball(x-.55*s,1.1+1.45*s,z+.1,.66*s,mats.leaf2);ball(x+.55*s,1.15+1.4*s,z-.15,.68*s,mats.leaf2)}
for(const p of [[-13,4,1.2],[-12,-5,1.1],[12,-1,1.35],[13,7,1.25],[-3,10,1.2],[-2,-10,1.05],[11,-10,.9]])tree(...p);
function bush(x,z){for(let i=0;i<3;i++)ball(x+(i-1)*.34,.4,z,.47,mats.leaf2)}bush(-13,1);bush(2,2);bush(10,1);bush(-12,1);
// benches and lamp posts
for(const [x,z] of [[-1,-1],[6,4]]){box(x,.52,z,1.7,.15,.48,mats.wood);for(const dx of [-.65,.65]){box(x+dx,.28,z,.12,.5,.12,mats.wood);box(x+dx,.96,z-.18,.12,.65,.12,mats.wood)}}
function lamp(x,z){cylinder(x,1.35,z,.05,.07,2.7,mat('#6a7767'));ball(x,2.75,z,.2,mats.flower);box(x,2.5,z,.43,.12,.43,mats.white)}lamp(-2,4);lamp(5,6);
// little fence around pond, reeds and lily pads
for(let i=0;i<7;i++){const a=i*.45;cylinder(9.8+Math.cos(a)*3.1,.38,-5+Math.sin(a)*2.5,.045,.05,.75,mats.wood)}
// Character Mina, assembled from friendly low-poly pieces
const player=new THREE.Group();scene.add(player);const avatar=new THREE.Group();player.add(avatar);
const body=mesh(new THREE.CapsuleGeometry(.36,.48,4,8),mats.shirt,0,.92,0,avatar);body.castShadow=true;
const head=ball(0,1.72,0,.36,mats.skin,avatar);const haircap=ball(0,1.91,-.06,.38,mats.hair,avatar);haircap.scale.set(1,.78,1);ball(-.29,1.68,-.06,.17,mats.hair,avatar);
for(const x of [-.13,.13]){ball(x,1.75,.31,.035,mat('#483c34'),avatar)}
const legs=[];for(const x of [-.2,.2]){const l=mesh(new THREE.CapsuleGeometry(.13,.5,3,7),mats.pants,x,.34,0,avatar);legs.push(l)}
// small scarf and hair flower
ball(.28,1.96,.14,.12,mats.flower,avatar);ball(.34,2.02,.12,.055,mats.pink,avatar);
player.position.set(0,0,5.5);
// Cat by the pond bench
const cat=new THREE.Group();scene.add(cat);cat.position.set(6.6,0,1.3);ball(0,.27,0,.42,mats.cat,cat).scale.set(1.35,.72,.75);ball(.28,.5,.05,.3,mats.cat,cat);for(const x of [.1,.45]){const e=mesh(new THREE.ConeGeometry(.13,.3,5),mats.cat,x,.75,.02,cat);e.rotation.z=-.12}for(const x of [.18,.38])ball(x,.53,.31,.035,mat('#786b5d'),cat);const tail=mesh(new THREE.TorusGeometry(.35,.07,6,12,Math.PI*1.35),mats.cat,-.49,.4,-.08,cat);tail.rotation.y=1.2;
// targets, quest state, and markers
const tasks=[{id:'orange',label:'Pick a sun-warmed orange',tag:'GATHER',pos:new THREE.Vector3(-9.7,0,-1.8),done:false,verb:'Pick an orange',toast:'A little sunshine for later. +5 shells'}, {id:'flowers',label:'Water the flower garden',tag:'TEND',pos:new THREE.Vector3(3,0,-5),done:false,verb:'Water the flowers',toast:'The tulips look brighter already. +5 shells'}, {id:'cat',label:'Say hello to Miso',tag:'CONNECT',pos:new THREE.Vector3(6.6,0,1.3),done:false,verb:'Pet Miso',toast:'Miso purrs like a tiny engine. +5 shells'}];
const markers=[];for(const t of tasks){const g=new THREE.Group();scene.add(g);g.position.set(t.pos.x,.05,t.pos.z);const ring=mesh(new THREE.TorusGeometry(.46,.045,7,24),mat('#fff2c7'),0,.07,0,g);ring.rotation.x=Math.PI/2;const gem=mesh(new THREE.OctahedronGeometry(.2),mat('#fff6d8'),0,.58,0,g);markers.push({group:g,gem,ring});}
let shells=12;let toastTimer;const toastEl=document.querySelector('#toast');function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2500)}
const list=document.querySelector('#quest-list');function renderTasks(){list.innerHTML=tasks.map(t=>`<div class="quest-row ${t.done?'done':''}"><span class="quest-check">✓</span><span class="quest-label">${t.label}</span><span class="quest-tag">${t.done?'DONE':t.tag}</span></div>`).join('');document.querySelector('#reward-count').textContent=tasks.filter(t=>t.done).length*5;document.querySelector('#journal-done').textContent=`${tasks.filter(t=>t.done).length} / 3`;document.querySelector('#shell-total').textContent=shells}
renderTasks();
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase()))e.preventDefault();if(e.key.toLowerCase()==='e'||e.key===' '){e.preventDefault();interact()}});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let stick={x:0,y:0};const joy=document.querySelector('#joystick'),knob=document.querySelector('#stick-knob');let joyOn=false;function moveStick(e){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=r.width*.34,d=Math.hypot(dx,dy);if(d>max){dx*=max/d;dy*=max/d}stick.x=dx/max;stick.y=dy/max;knob.style.transform=`translate(${dx}px,${dy}px)`}joy.addEventListener('pointerdown',e=>{joyOn=true;joy.setPointerCapture(e.pointerId);moveStick(e)});joy.addEventListener('pointermove',e=>{if(joyOn)moveStick(e)});function resetJoy(){joyOn=false;stick.x=stick.y=0;knob.style.transform='translate(0,0)'}joy.addEventListener('pointerup',resetJoy);joy.addEventListener('pointercancel',resetJoy);document.querySelector('#action-button').addEventListener('pointerdown',e=>{e.preventDefault();interact()});
let near=null;const prompt=document.querySelector('#prompt');const promptText=document.querySelector('#prompt-text');function interact(){if(!near){toast('Take a little wander and see what you find.');return}if(near.done){toast('You’ve already taken care of this little thing.');return}near.done=true;shells+=5;if(near.id==='orange'){oranges[0].visible=false;const fruit=ball(0,1.2,.48,.17,mats.orange,player);fruit.name='heldOrange'}if(near.id==='flowers'){for(const f of scene.children){} }if(near.id==='cat'){cat.rotation.y=.3;cat.position.y=.05}renderTasks();toast(near.toast);if(tasks.every(t=>t.done)){setTimeout(()=>{document.querySelector('#level-up').classList.add('show');toast('Day one, beautifully done! You found your own rhythm.');},700)}updatePrompt()}
function updatePrompt(){near=null;let best=2.35;for(const t of tasks){if(t.done)continue;const d=Math.hypot(player.position.x-t.pos.x,player.position.z-t.pos.z);if(d<best){best=d;near=t}}if(near){promptText.textContent=near.verb;prompt.style.display='flex';const p=new THREE.Vector3(player.position.x,2.4,player.position.z);p.project(camera);prompt.style.left=((p.x*.5+.5)*innerWidth)+'px';prompt.style.top=((-p.y*.5+.5)*innerHeight)+'px'}else prompt.style.display='none'}
// UI overlays
for(const [id,overlay,close] of [['map-button','map-overlay','map-close'],['journal-button','journal-overlay','journal-close']]){document.getElementById(id).addEventListener('click',()=>document.getElementById(overlay).classList.add('open'));document.getElementById(close).addEventListener('click',()=>document.getElementById(overlay).classList.remove('open'))}
document.querySelector('#quest-toggle').addEventListener('click',()=>document.querySelector('.quest-card').classList.toggle('collapsed'));
document.querySelector('#sound-btn').addEventListener('click',e=>{e.currentTarget.classList.toggle('muted');toast(e.currentTarget.classList.contains('muted')?'Quiet moments, then.':'Birdsong is back.');e.currentTarget.textContent=e.currentTarget.classList.contains('muted')?'♩':'♫'});
// animated movement + follow camera
const clock=new THREE.Clock();const desired=new THREE.Vector3();let walkTime=0;function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;let mx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+stick.x;let mz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+stick.y;const len=Math.hypot(mx,mz);if(len>1){mx/=len;mz/=len}const moving=Math.hypot(mx,mz)>.08;if(moving){const speed=3.35;player.position.x+=mx*speed*dt;player.position.z+=mz*speed*dt;player.position.x=THREE.MathUtils.clamp(player.position.x,-14,14);player.position.z=THREE.MathUtils.clamp(player.position.z,-12,12);player.rotation.y=Math.atan2(mx,mz);walkTime+=dt*10;legs[0].rotation.x=Math.sin(walkTime)*.52;legs[1].rotation.x=-Math.sin(walkTime)*.52;body.position.y=.92+Math.abs(Math.sin(walkTime*2))*.045;head.position.y=1.72+Math.abs(Math.sin(walkTime*2))*.035}else{legs.forEach(l=>l.rotation.x*=.8);body.position.y=THREE.MathUtils.lerp(body.position.y,.92,dt*4);head.position.y=THREE.MathUtils.lerp(head.position.y,1.72,dt*4)}
for(let i=0;i<markers.length;i++){const m=markers[i],task=tasks[i];m.group.visible=!task.done;m.gem.position.y=.59+Math.sin(t*2.6+i)*.11;m.gem.rotation.y=t*.8;m.ring.material.color.set(tasks[i].id==='cat'?'#f8e4ba':'#fff2c7')}
cat.position.y=.035+Math.sin(t*2.3)*.035;if(!tasks[2].done)cat.rotation.y=Math.sin(t*.6)*.06;
desired.set(player.position.x+7,10.5,player.position.z+13.5);camera.position.lerp(desired,1-Math.exp(-dt*2.7));camera.lookAt(player.position.x,0,player.position.z-.2);updatePrompt();renderer.render(scene,camera)}frame();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
setTimeout(()=>document.querySelector('#loading').classList.add('hidden'),900);
