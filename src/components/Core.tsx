import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export default function Core({compact=false}:{compact?:boolean}){
 const host=useRef<HTMLDivElement>(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{const node=host.current;if(!node)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{setFailed(true);return;}
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),mobile=window.matchMedia('(max-width: 768px)').matches;
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobile?1.2:1.6));renderer.setClearColor(0x05070a,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.4;node.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,70);camera.position.set(.1,.65,7.8);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();
 const metal=new THREE.MeshStandardMaterial({color:0x7c93a9,metalness:1,roughness:.23});
 const dark=new THREE.MeshStandardMaterial({color:0x18222d,metalness:1,roughness:.28});
 const blue=new THREE.MeshStandardMaterial({color:0x086eff,emissive:0x006aff,emissiveIntensity:3,metalness:.4,roughness:.16});
 const amber=new THREE.MeshStandardMaterial({color:0xffd89b,emissive:0xff8c26,emissiveIntensity:1.6});
 const core=new THREE.Group();core.rotation.set(.2,-.35,-.45);scene.add(core);
 const rings:THREE.Group[]=[];
 function ring(radius:number,axis:number){const g=new THREE.Group();g.rotation.x=axis;const rim=new THREE.Mesh(new THREE.TorusGeometry(radius,.085,12,112),metal);g.add(rim);const rim2=new THREE.Mesh(new THREE.TorusGeometry(radius-.115,.028,8,100),blue);g.add(rim2);
  for(let i=0;i<28;i++){const a=i/28*Math.PI*2;const segment=new THREE.Mesh(new THREE.BoxGeometry(.21,.15,.22),i%7===0?metal:dark);segment.position.set(Math.cos(a)*radius,Math.sin(a)*radius,0);segment.rotation.z=a+Math.PI/2;g.add(segment);if(i%4===0){const light=new THREE.Mesh(new THREE.BoxGeometry(.075,.026,.235),i%8===0?amber:blue);light.position.copy(segment.position);light.rotation.copy(segment.rotation);g.add(light);}}
 core.add(g);rings.push(g);return g;}
 ring(1.85,.9);ring(1.53,-.7).rotation.y=.65;ring(1.15,.28).rotation.y=1.3;
 const inner=new THREE.Group();core.add(inner);
 const crystal=new THREE.Mesh(new THREE.IcosahedronGeometry(.58,0),new THREE.MeshPhysicalMaterial({color:0x2e9fff,metalness:.7,roughness:.1,emissive:0x0057c9,emissiveIntensity:1.1,clearcoat:1}));inner.add(crystal);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(.66,0)),new THREE.LineBasicMaterial({color:0xa6e2ff,transparent:true,opacity:.8}));inner.add(edge);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const fin=new THREE.Mesh(new THREE.BoxGeometry(.075,.43,.19),metal);fin.position.set(Math.cos(a)*.94,Math.sin(a)*.94,0);fin.rotation.z=a-Math.PI/2;inner.add(fin);}
 const orbit=new THREE.Mesh(new THREE.TorusGeometry(2.36,.012,6,144),blue);orbit.rotation.set(1.27,0,-.1);core.add(orbit);
 const track=new THREE.Mesh(new THREE.TorusGeometry(2.42,.009,6,144),metal);track.rotation.copy(orbit.rotation);core.add(track);
 const point=new THREE.PointLight(0x147bff,32,9);point.position.set(0,0,1.4);scene.add(point);scene.add(new THREE.AmbientLight(0x6ba7ed,.6));const area=new THREE.DirectionalLight(0xe2efff,3.5);area.position.set(-2,4,4);scene.add(area);const back=new THREE.DirectionalLight(0x2c72ef,2);back.position.set(3,-2,-3);scene.add(back);
 const particles=new Float32Array((mobile?90:240)*3);for(let i=0;i<particles.length;i+=3){particles[i]=Math.sin(i*17.12)*12;particles[i+1]=Math.cos(i*1.77)*8;particles[i+2]=Math.sin(i*3.17)*9-6;}
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(particles,3));const stars=new THREE.Points(pg,new THREE.PointsMaterial({size:.018,color:0x7ea9d6,transparent:true,opacity:.7}));scene.add(stars);
 const grid=new THREE.GridHelper(18,24,0x193654,0x0c1c2e);grid.position.y=-2.6;scene.add(grid);
 const pointer={x:0,y:0};const move=(e:PointerEvent)=>{const r=node.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*.22;pointer.y=((e.clientY-r.top)/r.height-.5)*.18;};node.addEventListener('pointermove',move);
 const resize=()=>{const w=node.clientWidth,h=node.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=compact?8.9:mobile?9.2:7.8;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(node);resize();
 let frame=0,visible=true,disposed=false,last=0;const start=performance.now();function render(now:number){if(disposed)return;frame=requestAnimationFrame(render);if(!visible||document.hidden||now-last<(reduced.matches?500:mobile?32:16))return;last=now;const t=reduced.matches||document.documentElement.dataset.reduceMotion==='true'?0:(now-start)/1000;core.rotation.y=-.35+t*.075+pointer.x;core.rotation.x=.2+pointer.y+Math.min(window.scrollY/5000,.2);rings[0].rotation.z=t*.12;rings[1].rotation.z=-t*.18;rings[2].rotation.z=t*.1;inner.rotation.y=t*.24;inner.rotation.z=t*.12;stars.rotation.y=t*.007;renderer.render(scene,camera);}frame=requestAnimationFrame(render);
 const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});io.observe(node);
 return()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();node.removeEventListener('pointermove',move);scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points||o instanceof THREE.LineSegments){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});env.dispose();pmrem.dispose();renderer.dispose();node.replaceChildren();};
 },[compact]);
 return <div ref={host} className={'neural-canvas '+(compact?'compact':'')} role="img" aria-label="Animated metallic neural reactor with rotating blue-lit mechanical rings">{failed&&<div className="webgl-fallback"><span>BLORP_</span><p>3D preview unavailable on this device.</p></div>}</div>;
}
