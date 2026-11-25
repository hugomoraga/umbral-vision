var qi=Object.defineProperty;var Wi=(e,t,n)=>t in e?qi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var je=(e,t,n)=>Wi(e,typeof t!="symbol"?t+"":t,n);function Yt(e,t,n=parseFloat){let a=document.getElementById(e);if(!a)return t;let r=n(a.value);return isNaN(r)?t:r}function rt(e,t=.1){return Math.random()<t?(Math.random()-.5)*2:0}function Yn(e,t,n,a=.1,r=10){return Math.sin((e+t)*.1+n*a)*r}function Xn(e,t,n=1){return Math.sin(e*.05+t*.1)*n*20}function gn(e,t,n,a=.01){let r=Math.sin(e*a+n)*.5,o=Math.cos(t*a+n*.7)*.5;return(r+o)*50}var Qn={sync:{mode:"grid",bpm:"auto",fallbackBpm:128,minBpm:80,maxBpm:180,visualLatencyMs:28},kick:{rangeHz:[35,120],refractoryMs:180,threshold:1.55,minFlux:.006,sensitivity:1,depth:.7,decaySec:1.5,spring:18,damping:4.5,cameraDolly:.03,bloomPulse:.18},bassBody:{attackMs:80,releaseMs:800,scale:.05},midFlow:{attackMs:120,releaseMs:600,twist:.22,waveSpeed:.8,waveAmp:.12},highShimmer:{attackMs:15,releaseMs:180,porosity:.5,microDisplace:.012},volume:{exposure:.2,bloom:.15},dynamics:{autoGain:.6,floor:.04},agc:{autoGain:.6,floor:.03,decay:.996,onsetThreshold:1.6,onsetMinFlux:.0015,refractoryMs:140},feedback:{amount:.25,decay:.92,zoom:.5,rotation:.3,warp:.5,bassZoom:.35,midRotation:.4,kickDecay:.035,highWarp:.25},effects:{fluidFields:{kick:1,body:.7,mid:.9,high:1},organicStructures:{kick:1,body:.8,mid:1,high:1},mathematicalForms:{kick:1,body:.5,mid:.8,high:.8},temporalVeil:{kick:1,body:.6,mid:.9,high:.8}}},ja="umbral-vision:audio-map",Xe=Jn(Qn),It=qa();function Jn(e){return JSON.parse(JSON.stringify(e))}function yt(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function Xt(e,t){if(!yt(t))return e;for(let[n,a]of Object.entries(t))yt(a)&&yt(e[n])?Xt(e[n],a):a!==void 0&&(e[n]=Array.isArray(a)?a.slice():a);return e}function qa(){try{if(typeof localStorage>"u")return{};let e=localStorage.getItem(ja),t=e?JSON.parse(e):{};return yt(t)?t:{}}catch{return{}}}function Wa(){try{if(typeof localStorage>"u")return;localStorage.setItem(ja,JSON.stringify(It))}catch{}}function Zn(){return Xe=Jn(Qn),Xt(Xe,It),Xe}Zn();async function Ki(e=null){let t=null;if(typeof window<"u"&&typeof window.fetch=="function")try{let a=e||new URL("./audio-map.json",import.meta.url).href,r=await window.fetch(a,{cache:"no-cache"});r.ok&&(t=await r.json())}catch{}let n=typeof window<"u"?window.UV_AUDIO_MAP:null;return It=qa(),Xe=Jn(Qn),yt(t)&&Xt(Xe,t),yt(n)&&Xt(Xe,n),Xt(Xe,It),Xe}function Z(){return Xe}function Bt(e,t){let n=String(e).split("."),a=It;for(let r=0;r<n.length-1;r++){let o=n[r];yt(a[o])||(a[o]={}),a=a[o]}return a[n[n.length-1]]=t,Wa(),Zn()}function Ka(){return It={},Wa(),Zn()}typeof window<"u"&&typeof window.fetch=="function"&&Ki();var Ie=null,ge=null,Qt=null,vn=null,Be=null,Ne=null,qe=null,en=0,tn=!1,wn=2048,Yi=.35,Xi=.045,Qi=.22,ea=.012,ta=.09,Ji=.035,Zi=.16,bn=30,oa=32,Ce={bass:[20,160],mid:[160,2e3],high:[2e3,12e3]},R={enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0,flux:0,bassBody:0,midFlow:0,highShimmer:0,bassFast:0,midFast:0,highFast:0,bassSlow:0,midSlow:0,highSlow:0,waveRms:0,transient:0,bassOnset:!1,midOnset:!1,highOnset:!1,kick:0,kickFlash:0,kickTrigger:!1,kickStrength:0,kickOnset:!1,kickInterval:0,kickFlux:0,kickEnergy:0,bpm:0,beatPhase:0,tempoConfidence:0,syncMode:"grid"},yn=.12,Ut={bass:.12,mid:.12,high:.12},Jt={bass:.001,mid:.001,high:.001},oe=0,sa=new Float32Array(bn),xn=0,xt=0,Dt=0,la=-10,ca=new Float32Array(oa),En=0,Et=0,it=-10,Zt={bass:-10,mid:-10,high:-10},ua=0,ma=0,Sn=-10,Ot=0,zt=0,wt=[],St=0,fa=0,ot=0,st=[],da=null;function na(e,t,n){let a=Math.max(0,Math.floor(t)),r=Math.min(e.length,Math.max(a+1,Math.ceil(n))),o=0;for(let s=a;s<r;s++)o+=e[s];return o/(r-a)/255}function eo(e,t=44100,n=wn){if(!e||e.length===0)return{bass:0,mid:0,high:0,rms:0};let a=e.length,r=t/n,o=c=>c/r,s=0;for(let c=0;c<a;c++){let d=e[c]/255;s+=d*d}let i=Math.min(1,Math.sqrt(s/a)*1.6),l={bass:[o(Ce.bass[0]),o(Ce.bass[1])],mid:[o(Ce.mid[0]),o(Ce.mid[1])],high:[o(Ce.high[0]),o(Ce.high[1])]};return{bass:na(e,l.bass[0],l.bass[1]),mid:na(e,l.mid[0],l.mid[1]),high:na(e,l.high[0],l.high[1]),rms:i}}function to(e){if(!e.length)return 0;let t=e.slice().sort((a,r)=>a-r),n=t.length>>1;return t.length%2?t[n]:(t[n-1]+t[n])/2}function no(e,t){return e.length?e.reduce((n,a)=>n+Math.abs(a-t),0)/e.length:0}function Re(e,t,n,a=Xi,r=Qi){let o=t>e?a:r,s=1-Math.exp(-Math.max(0,n)/Math.max(.001,o));return e+(t-e)*s}function Nt(e,t){let n=Number(e);return Number.isFinite(n)&&n>0?n/1e3/3:t}function Qe(e,t,n){return Math.min(n,Math.max(t,e))}function ao(e,t,n){let a=Math.pow(.996,Math.max(0,t)*60);yn=Math.max(e,yn*a);let r=Qe(Number(n.dynamics?.autoGain??.6),0,1),o=Math.max(.01,Number(n.dynamics?.floor??.04));return Math.max(yn*(1-r*.35),o)}function aa(e,t,n,a){let r=Number(a.agc?.decay??.996),o=Math.pow(r,Math.max(0,n)*60);Ut[e]=Math.max(t,Ut[e]*o);let s=Qe(Number(a.agc?.autoGain??a.dynamics?.autoGain??.6),0,1),i=Math.max(.008,Number(a.agc?.floor??a.dynamics?.floor??.03));return Math.max(Ut[e]*(1-s*.35),i)}function Mn(){R.enabled=!1;for(let e of Object.keys(R))e==="syncMode"?R[e]="grid":e==="kickTrigger"||e==="kickOnset"||e==="enabled"||e.endsWith("Onset")?R[e]=!1:R[e]=0;yn=.12,Ut.bass=.12,Ut.mid=.12,Ut.high=.12,Jt.bass=.001,Jt.mid=.001,Jt.high=.001,en=0,Ne&&Ne.fill(128),oe=0,xn=0,xt=0,sa.fill(0),Dt=0,la=-10,En=0,Et=0,ca.fill(0),it=-10,Zt.bass=-10,Zt.mid=-10,Zt.high=-10,ua=0,ma=0,Sn=-10,Ot=0,zt=0,wt.length=0,St=0,fa=0,ot=0,st=[],da=null,qe&&qe.fill(0)}function ro(e,t){let n=Z(),a=Number(n.sync?.minBpm??80),r=Number(n.sync?.maxBpm??180),o=60/r,s=60/a;if(t<o||t>s)return;wt.push(t),wt.length>8&&wt.shift();let i=to(wt);St=i>0?Qe(60/i,a,r):0;let l=i>0?no(wt,i)/i:1,c=Qe(wt.length/4,0,1);fa=Qe((1-l*7)*c,0,1)}function ra(e){let t=e.sync?.bpm;return typeof t=="number"&&Number.isFinite(t)?Qe(t,Number(e.sync?.minBpm??80),Number(e.sync?.maxBpm??180)):St||Number(e.sync?.fallbackBpm??128)}function ia(e,t,n){let a=Math.max(0,Number(n.sync?.visualLatencyMs??28))/1e3;st.push({at:t+a,strength:Qe(e,0,1)}),st.length>8&&st.shift()}function io(e,t){Sn=t,Ot=e,zt=1,R.kick=e,R.kickFlash=1,R.kickTrigger=!0,R.kickStrength=e}function oo(e){if(!st.length)return;let t=[];if(st=st.filter(n=>n.at<=e?(t.push(n),!1):!0),t.length){let n=t.reduce((a,r)=>r.strength>a.strength?r:a);io(n.strength,e)}}function so(e){let t=Z(),n=ge.context?.sampleRate||44100,a=ge.fftSize||wn,r=eo(Be,n,a);R.syncMode=t.sync?.mode||"grid",R.kickTrigger=!1,R.kickOnset=!1,R.syncMode!==da&&(st=[],ot=0,da=R.syncMode);let o=Be.length,s=n/a,i=(_,$)=>[Math.max(1,Math.floor(_/s)),Math.min(o-1,Math.ceil($/s))],l=i(Ce.bass[0],Ce.bass[1]),c=i(Ce.mid[0],Ce.mid[1]),d=i(Ce.high[0],Ce.high[1]),m=aa("bass",r.bass,e,t),f=aa("mid",r.mid,e,t),p=aa("high",r.high,e,t),u=ao(Math.max(r.bass,r.mid,r.high),e,t),x=(_,$)=>Math.min(1.5,_/$*.7+_/u*.3),b=x(r.bass,m),v=x(r.mid,f),h=x(r.high,p);R.rms=Re(R.rms,Math.min(1.5,r.rms*2.6),e,Ji,Zi),R.bass=Re(R.bass,b,e),R.mid=Re(R.mid,v,e),R.high=Re(R.high,h,e),R.bassFast=Re(R.bassFast,b,e,ea,ta),R.midFast=Re(R.midFast,v,e,ea,ta),R.highFast=Re(R.highFast,h,e,ea,ta),R.bassBody=Re(R.bassBody,b,e,Nt(t.bassBody?.attackMs,.06),Nt(t.bassBody?.releaseMs,.6)),R.midFlow=Re(R.midFlow,v,e,Nt(t.midFlow?.attackMs,.08),Nt(t.midFlow?.releaseMs,.5)),R.highShimmer=Re(R.highShimmer,h,e,Nt(t.highShimmer?.attackMs,.02),Nt(t.highShimmer?.releaseMs,.18)),R.bassSlow=R.bassBody,R.midSlow=R.midFlow,R.highSlow=R.highShimmer;let g=0,E=0;if(Ne&&Ne.length){let _=0;for(let $=0;$<Ne.length;$++){let fe=(Ne[$]-128)/128;_+=fe*fe;let F=Math.abs(fe);F>E&&(E=F)}g=Math.sqrt(_/Ne.length)}let M=Math.max(0,g-en);en=g,R.waveRms=Re(R.waveRms,Math.min(1,g*3.5),e,.02,.12),R.transient=Re(R.transient,Math.min(1,M*18+E*.08),e,.01,.1),R.energy=R.bass*.55+R.mid*.3+R.high*.15,R.level=Math.min(1,R.rms*1.15+R.energy*.22);let S=0,w=0,A=0,L=0,I=0,z=0,G=Number(t.kick?.rangeHz?.[0]??35),V=Number(t.kick?.rangeHz?.[1]??120),C=Math.max(1,Math.floor(G/s)),T=Math.min(o-1,Math.ceil(V/s));if(qe&&qe.length===o)for(let _=0;_<o;_++){let $=Be[_]-qe[_];$>0&&(S+=$,_>=C&&_<=T&&(w+=$),_>=l[0]&&_<=l[1]?L+=$:_>=c[0]&&_<=c[1]?I+=$:_>=d[0]&&_<=d[1]&&(z+=$)),qe[_]=Be[_]}else{qe=new Float32Array(o);for(let _=0;_<o;_++)qe[_]=Be[_]}let B=Math.max(1.25,Number(t.agc?.onsetThreshold??1.6)),U=Math.max(5e-4,Number(t.agc?.onsetMinFlux??.0015)),K=Math.max(.06,Number(t.agc?.refractoryMs??140)/1e3),de={bass:L/Math.max(1,l[1]-l[0]+1)/255*5.5,mid:I/Math.max(1,c[1]-c[0]+1)/255*4.2,high:z/Math.max(1,d[1]-d[0]+1)/255*4.8};for(let _ of["bass","mid","high"]){let $=de[_],fe=Jt[_],F=$>fe*B&&$>U&&oe-Zt[_]>K;R[`${_}Onset`]=F,F&&(Zt[_]=oe),Jt[_]=fe*.92+$*.08}for(let _=C;_<=T;_++)A+=Be[_];A=A/Math.max(1,T-C+1)/255;let Me=A-ma;ma=A,S=S/o/255*3.2,w=w/Math.max(1,T-C+1)/255*6.5,sa[xn]=S,xn=(xn+1)%bn,xt<bn&&xt++;let Y=0;for(let _=0;_<xt;_++)Y+=sa[_];Y=xt>0?Y/xt:0,Dt*=Math.exp(-e/.14),Dt<.001&&(Dt=0),xt===bn&&S>Y*1.55&&S>.012&&oe-la>.12&&(Dt=1,la=oe),R.beat=Dt,ca[En]=w,En=(En+1)%oa,Et<oa&&Et++;let te=0;for(let _=0;_<Et;_++)te+=ca[_];te=Et>0?te/Et:0;let ve=Math.max(1.05,Number(t.kick?.threshold??1.55)),he=Math.max(.001,Number(t.kick?.minFlux??.006)),nt=St>0?60/ra(t):0,He=Math.max(Math.max(.05,Number(t.kick?.refractoryMs??180)/1e3),nt*.85),Ae=Qe(Number(t.kick?.sensitivity??1),.2,4);if(Et>=6&&w>te*ve/Ae&&w>he&&A>.04&&Me>.025&&oe-it>He){let _=Qe(.35+w/Math.max(.001,te*ve)*.45+A*.5,.35,1),$=oe-it;if(it>=0){let fe=60/Number(t.sync?.maxBpm??180),F=60/Number(t.sync?.minBpm??80),k=$;for(;k>0&&k<fe;)k*=2;for(;k>F;)k/=2;$=k,R.kickInterval=$,ro(oe,$)}R.kickOnset=!0,it=oe,ua=_,(t.sync?.mode==="kick"||t.sync?.mode==="grid"&&!St)&&ia(_,oe,t)}if(t.sync?.mode==="grid"&&(St>0||typeof t.sync?.bpm=="number")){let _=60/ra(t);(!ot||ot<oe-_*2)&&(ot=(it>=0?it:oe)+_);let $=0;for(;oe>=ot&&$<2;){let fe=oe-it,F=fe<_*1.45?Math.max(.4,ua*(1-fe/(_*2))):.35;ia(F,ot,t),ot+=_,$++}}let Ee=Math.max(.15,Number(t.kick?.decaySec??1.5));Ot*=Math.exp(-e/Ee),Ot<.001&&(Ot=0),zt*=Math.exp(-e/.18),zt<.001&&(zt=0),oo(oe),R.kick=Ot,R.kickFlash=zt,R.kickFlux=w,R.kickEnergy=A;let ie=ra(t);R.bpm=St>0||typeof t.sync?.bpm=="number"?Math.round(ie*10)/10:0,R.tempoConfidence=typeof t.sync?.bpm=="number"?1:fa,R.beatPhase=R.bpm>0&&Sn>=0?(oe-Sn)/(60/R.bpm)%1:0,R.flux=S,R.enabled=!0,oe+=e}async function Ya(){if(tn)return!0;if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("getUserMedia no est\xE1 disponible en este navegador");let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});if(vn=e,!Ie||Ie.state==="closed"){let t=window.AudioContext||window.webkitAudioContext;Ie=new t}return Ie.state==="suspended"&&await Ie.resume(),ge=Ie.createAnalyser(),ge.fftSize=wn,ge.smoothingTimeConstant=Yi,Be=new Uint8Array(ge.frequencyBinCount),Ne=new Uint8Array(ge.fftSize||wn),qe=null,en=0,Qt=Ie.createMediaStreamSource(e),Qt.connect(ge),tn=!0,Mn(),!0}function An(e=1/60){if(!tn||!ge||!Be){R.enabled&&Mn();return}try{ge.getByteFrequencyData(Be),Ne&&typeof ge.getByteTimeDomainData=="function"&&ge.getByteTimeDomainData(Ne),so(Math.min(.1,Math.max(.001,e)))}catch{Mn()}}async function Xa(){if(tn=!1,Qt){try{Qt.disconnect()}catch{}Qt=null}if(ge){try{ge.disconnect()}catch{}ge=null}if(vn){try{vn.getTracks().forEach(e=>e.stop())}catch{}vn=null}if(Ie&&Ie.state!=="closed")try{await Ie.close()}catch{}Ie=null,Be=null,Ne=null,qe=null,en=0,Mn()}function ee(){return{enabled:tn,level:R.level,kick:R.kick,bpm:R.bpm,mode:R.syncMode}}function ke(){return R}function Qa(){return Be}var Je={tunnel:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=ee(),r=Yt("ellipseCount",100,parseInt),o=Yt("ellipseSpacing",10),s=Yt("angleIncrement",.05),i=Yt("ellipseSizeFactor",1),l=s,c=i,d=1;n&&a>.01&&(l=s*(1+a*3),c=i*(1+a*2),d=1+a*4),e.strokeWeight(d),e.colorMode(e.HSB,360,100,100);let m=200,f=a*30,p=40+a*30,u=30+a*40;e.stroke((m+f)%360,p,u),e.background(0,8),e.translate(e.width/2,e.height/2);for(let x=0;x<r;x++){let b=x*o,v=t+x*.1,h=b*c;if(n&&a>.01){let g=Math.sin(v+t*2)*a*30;h+=g}e.ellipse(b*Math.cos(v),b*Math.sin(v),h,h)}t+=l}}},spiral:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=ee();e.background(0,5),e.translate(e.width/2,e.height/2);let r=300,o=Math.min(e.width,e.height)*.45,s=n&&a>.01?1+a*1.5:1;for(let i=0;i<r;i++){let l=i/r*Math.PI*12+t*s,c=i/r*o,d=2+Math.sin(l*3+t)*1.5,m=(220+l*20+t*15)%360,f=25+a*25,p=20+a*35;e.stroke(m,f,p),e.strokeWeight(1+a*2),e.noFill(),e.ellipse(c*Math.cos(l),c*Math.sin(l),d,d)}t+=.02*s}}},mandala:e=>{let t=0,n=12,a=6,r=6,o=Math.PI*2,s=o/r,i=new Float32Array(r),l=new Float32Array(r);for(let c=0;c<r;c++)i[c]=Math.cos(s*c),l[c]=Math.sin(s*c);return{draw:c=>{let m=!!(c&&c.isLite)?a:n,{enabled:f,level:p}=ee();e.background(0,8),e.push(),e.translate(e.width/2,e.height/2);let u=f&&p>.01?1+p*1.2:1;t+=.008*u;let x=new Array(m);for(let b=0;b<m;b++)x[b]=8+b*3;for(let b=0;b<m;b++){let v=t*(1+b*.08),h=40+b*35,g=x[b],E=o/g;e.push(),e.rotate(v);for(let M=0;M<g;M++){let S=E*M,w=Math.cos(S),A=Math.sin(S),L=h*w,I=h*A,z=20+Math.sin(v*2+M)*10,G=p*15,V=(z+G)/2,C=(180+b*15+M*10+t*30)%360,T=30+p*20,B=25+p*30;e.fill(C,T,B),e.stroke(C,T+10,B+10),e.strokeWeight(.5),e.push(),e.translate(L,I),e.rotate(S),e.beginShape();for(let U=0;U<r;U++)e.vertex(V*i[U],V*l[U]);e.endShape(e.CLOSE),e.pop()}e.pop()}e.pop()}}},particles:e=>{let t=[],n=!1;return{draw:()=>{let{enabled:a,level:r}=ee();if(!n){for(let i=0;i<150;i++)t.push({x:Math.random()*e.width,y:Math.random()*e.height,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,size:Math.random()*5+2,hue:Math.random()*360});n=!0}e.background(0,12);let o=a&&r>.01?1+r*2:1;for(let s=0;s<t.length;s++){let i=t[s];i.x+=i.vx*o,i.y+=i.vy*o,(i.x<0||i.x>e.width)&&(i.vx*=-1),(i.y<0||i.y>e.height)&&(i.vy*=-1),i.x=e.constrain(i.x,0,e.width),i.y=e.constrain(i.y,0,e.height);let l=i.size*(1+r*1.5);i.hue=(i.hue+1.5*o)%360;let c=(200+i.hue*.3)%360,d=20+r*15,m=15+r*25;e.fill(c,d,m),e.noStroke(),e.ellipse(i.x,i.y,l,l);for(let f=s+1;f<t.length;f++){let p=t[f],u=e.dist(i.x,i.y,p.x,p.y);if(u<80){let x=e.map(u,0,80,60,0);e.stroke(c,d,m,x),e.strokeWeight(.5),e.line(i.x,i.y,p.x,p.y)}}}}}},waves:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=ee();e.background(0,6);let r=n&&a>.01?a:.1;t+=.04*(1+r);let o=6,s=e.height/2;for(let i=0;i<o;i++){let l=40+i*25,c=.015+i*.008,d=.04+i*.015;e.beginShape(),e.noFill();let m=(35+i*8+t*5)%360,f=25+a*20,p=20+a*35;e.stroke(m,f,p),e.strokeWeight(1.5+a*2);for(let u=0;u<e.width;u+=4){let x=s+Math.sin(u*c+t+i)*l*(1+r)+Math.cos(u*c*.7+t*1.3)*l*.4*r;e.vertex(u,x)}e.endShape()}}}},fractal:e=>{let t=0,n=6,a=4,r=4,o=3,s=Math.PI*2;return{draw:i=>{let{enabled:l,level:c}=ee();e.background(0,5),e.push(),e.translate(e.width/2,e.height/2);let d=!!(i&&i.isLite),m=l&&c>.01?1+c*1.5:1;t+=.008*m;let f=d?a:n,p=d?o:r,u=s/f,x=90;function b(v,h,g){if(h===0)return;let E=(190+h*12+t*20)%360,M=30+c*15,S=20+c*25;e.stroke(E,M,S),e.strokeWeight(h*1.5+c*2),e.push(),e.rotate(g),e.line(0,0,0,-v),e.translate(0,-v);for(let w=0;w<f;w++){let A=u*w+t*.4,L=v*.72*(1+c*.25);b(L,h-1,A)}e.pop()}for(let v=0;v<f;v++){let h=u*v;b(x*(1+c*.5),p,h+t)}e.pop()}}},matrix:e=>{let t="01\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3",n=[],a=!1,r=20;return{draw:()=>{let{enabled:o,level:s}=ee();if(!a){for(let l=0;l<50;l++)n.push({x:Math.random()*e.width,y:Math.random()*e.height,speed:Math.random()*5+2,length:Math.floor(Math.random()*20)+5});a=!0}e.background(0,20),e.colorMode(e.HSB,360,100,100);let i=o&&s>.01?1+s*1.5:1;e.textSize(r),e.textAlign(e.CENTER);for(let l of n){l.y+=l.speed*i,l.y>e.height+l.length*r&&(l.y=-l.length*r,l.x=Math.random()*e.width);for(let c=0;c<l.length;c++){let d=l.y-c*r;if(d>0&&d<e.height){let m=e.map(c,0,l.length,80,5),f=140,p=30+s*20,u=15+s*25;e.fill(f,p,u,m);let x=t[Math.floor(Math.random()*t.length)];e.text(x,l.x,d)}}}}}},glitch:e=>{let t=0,n=0;return{draw:()=>{let{enabled:a,level:r}=ee();e.background(0,5),t+=.05;let o=a&&r>.01?r:.1;n=r*30;for(let s=0;s<e.height;s+=3){let i=rt(t+s*.01,.03+r*.08),l=i*n,c=(200+i*20)%360,d=15+r*15,m=10+r*20;e.stroke(c,d,m),e.strokeWeight(.5),e.line(0+l,s,e.width+l,s)}for(let s=0;s<4;s++){let i=t+s*.6,l=e.height/2+Math.sin(i)*80,c=Yn(0,l,i,.15,n*.8),d=(210+s*15)%360,m=20+r*15,f=15+r*25;e.stroke(d,m,f),e.strokeWeight(1.5+r*2),e.noFill(),e.beginShape();for(let p=0;p<e.width;p+=4){let u=l+c+Math.sin(p*.015+i)*25;e.vertex(p,u)}e.endShape()}}}},melt:e=>{let t=0,n=[],a=!1;return{draw:()=>{let{enabled:r,level:o}=ee();if(!a){for(let i=0;i<200;i++)n.push({x:Math.random()*e.width,y:Math.random()*e.height*.3,vx:(Math.random()-.5)*2,vy:Math.random()*2+1,size:Math.random()*8+3,hue:Math.random()*360,melt:0});a=!0}e.background(0,20),t+=.02;let s=r&&o>.01?1+o*2:1;for(let i of n){let l=Xn(i.y,t,o+.3);i.x+=i.vx*s+l*.1,i.y+=i.vy*s,i.y>e.height&&(i.y=-10,i.x=Math.random()*e.width,i.melt=0),i.melt+=.05*s;let c=i.size*(1-i.melt*.1)*(1+o);i.hue=(i.hue+2*s)%360;let d=o*20,m=rt(t+i.x*.01,.08)*d,f=rt(t+i.y*.01,.08)*d*.5,p=(220+i.hue*.2)%360,u=20+o*12,x=15+o*20;e.fill(p,u,x),e.stroke(p,u+5,x+5),e.strokeWeight(.3),e.push(),e.translate(i.x+m,i.y+f),e.rotate(i.melt*.4);let b=Math.sin(i.melt*2)*.2;e.ellipse(0,0,c*(1+b),c*(1+i.melt*.25)),e.pop()}}}},fractalGlitch:e=>{let t=0,n=0;return{draw:()=>{let{enabled:a,level:r}=ee();e.background(0,8),e.translate(e.width/2,e.height/2);let o=a&&r>.01?1+r*1.3:1;t+=.008*o,n+=.04*(1+r);let s=5,i=4,l=130,c=r*15;function d(f,p,u,x=0,b=0){if(p===0||f<8)return;let v=Math.sin(n+p*.3)>.8,h=v?rt(n+p,.15)*c:0,g=gn(x,b,n,.012)*(v?.4:.1),E=(190+p*12+t*10)%360,M=22+r*10,S=16+r*18;e.stroke(E,M,S),e.strokeWeight(p*.7+r*1),e.push(),e.translate(x,b),e.rotate(u+h*.03);let w=g*.03,A=-f+g*.05;e.line(0,0,w,A),e.translate(w,A);let L=Math.PI*2/s;for(let I=0;I<s;I++){let z=L*I+t*.25+h*.01,G=f*.78,V=p-1;V>0&&G>8&&d(G,V,z,0,0)}e.pop()}let m=rt(n,.1)*c*.2;d(l*(1+r*.3),i,t+m*.02)}}},waveGlitch:e=>{let t=0,n=8,a=4,r=3,o=6,s=Math.PI*2,i=[],l=[],c=!1;return{draw:d=>{let m=!!(d&&d.isLite),f=m?a:n,p=m?o:r,{enabled:u,level:x}=ee();if(e.background(0,15),t+=.08,!c){for(let g=0;g<n;g++)i[g]=Math.random()*s,l[g]=Math.random()*s;c=!0}let b=u&&x>.01?x:.1,v=x*40,h=e.height/2;for(let g=0;g<f;g++){let E=(.15+g*.05)*(g%2===0?1:-1),M=40+g*25,S=.015+g*.008,w=.02+g*.01;l[g]+=w*(1+x*.3);let A=(Math.sin(l[g])+1)/2,L=M*.3,I=M*1.5,z=L+A*(I-L);i[g]+=E*(1+x*.5),e.beginShape(),e.noFill();let G=(30+g*6+t*8)%360,V=20+x*15,C=18+x*28;e.stroke(G,V,C),e.strokeWeight(1.2+x*1.5);for(let T=0;T<e.width;T+=p){let B=T*S+i[g]+g*.5,U=h+Math.sin(B)*z*(1+b);U+=Math.sin(t*.3+g*.4)*10*b;let K=rt(t+T*.01+g,.06+x*.04)*v*.7,de=rt(t+T*.015+g*.5,.08)*v*.4,Me=Yn(T,U,t+g,.12,v*.25),Y=Xn(U,t+g*.25,x*.4)*.2;U+=de+Me+Y;let te=T+K;e.vertex(te,U)}e.endShape()}}}},sacredGeometry:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=ee();e.background(0,4),e.translate(e.width/2,e.height/2);let r=n&&a>.01?1+a*1.2:1;t+=.006*r;let o=10,s=60;for(let i=0;i<o;i++){let l=t*(1+i*.05),c=s+i*30,d=6+i*2;e.push(),e.rotate(l);let m=(180+i*8+t*10)%360,f=25+a*12,p=18+a*22;e.stroke(m,f,p),e.strokeWeight(1+i*.1+a*1.5),e.noFill(),e.beginShape();for(let u=0;u<d;u++){let x=Math.PI*2/d*u,b=c*(1+Math.sin(l*2+u)*.1*a);e.vertex(b*Math.cos(x),b*Math.sin(x))}e.endShape(e.CLOSE),e.pop()}}}},biomech:e=>{let t=0,n=[],a=!1;return{draw:()=>{let{enabled:r,level:o}=ee();if(!a){for(let i=0;i<8;i++)n.push({x:e.width/9*(i+1),y:e.height/2,size:40+Math.random()*30,rotation:Math.random()*Math.PI*2,segments:8+Math.floor(Math.random()*6)});a=!0}e.background(0,6),t+=.02;let s=r&&o>.01?1+o*1.3:1;for(let i of n){i.rotation+=.003*s,e.push(),e.translate(i.x,i.y),e.rotate(i.rotation);let l=(200+i.x*.1+t*5)%360,c=18+o*10,d=12+o*18;e.stroke(l,c,d),e.strokeWeight(1.5+o*2),e.noFill(),e.beginShape();for(let m=0;m<i.segments;m++){let f=Math.PI*2/i.segments*m,p=gn(i.x,i.y,t+m,.05)*.3,u=i.size*(1+p)*(1+o*.3),x=u*Math.cos(f),b=u*Math.sin(f);e.vertex(x,b)}e.endShape(e.CLOSE);for(let m=0;m<3;m++){let f=i.size*(.3+m*.2);e.beginShape();for(let p=0;p<i.segments;p++){let u=Math.PI*2/i.segments*p+t*.1,x=gn(i.x,i.y,t+p,.08)*.2,b=f*(1+x);e.vertex(b*Math.cos(u),b*Math.sin(u))}e.endShape(e.CLOSE)}e.pop()}}}},dune:e=>{let t=0,n=4,a=2,r=6,o=Math.PI*2/r,s=new Float32Array(r),i=new Float32Array(r),l=new Float32Array(r),c=new Float32Array(r);for(let d=0;d<r;d++)s[d]=Math.cos(o*d),i[d]=Math.sin(o*d),l[d]=Math.cos(o*d+Math.PI/6),c[d]=Math.sin(o*d+Math.PI/6);return{draw:d=>{let m=!!(d&&d.isLite),f=m?a:n,{enabled:p,level:u}=ee();e.background(0,5),t+=.03;let x=p&&u>.01?u:.1,b=e.height*.6,v=m?4:2;for(let w=0;w<f;w++){let A=30+w*20,L=.01+w*.005,I=.03+w*.01;e.beginShape(),e.noFill();let z=(25+w*3+t*2)%360,G=20+u*15,V=15+u*25;e.stroke(z,G,V),e.strokeWeight(2+u*2);for(let C=0;C<e.width;C+=v){let T=b+Math.sin(C*L+t*I+w)*A*(1+x)+Math.cos(C*L*.6+t*1.2)*A*.3*x;e.vertex(C,T)}e.endShape()}e.push(),e.translate(e.width/2,e.height*.3);let h=80+u*40,g=t*.02;e.push(),e.rotate(g);let E=(30+t*3)%360,M=15+u*10,S=20+u*20;e.stroke(E,M,S),e.strokeWeight(1.5+u*1.5),e.noFill();for(let w=0;w<r;w++){let A=h*s[w],L=h*i[w],I=h*.6*l[w],z=h*.6*c[w];e.line(A,L,I,z)}e.pop(),e.pop()}}},yinYang:e=>{let t=0,n=.03;return{draw:()=>{let{enabled:a,level:r}=ee(),o=a&&r>.01?1+r*.6:1;e.colorMode(e.RGB),e.background(150,150,150),e.colorMode(e.HSB,360,100,100),e.translate(e.width/2,e.height/2),e.rotate(t);let s=Math.min(e.width,e.height)*.62,i=s/2;e.noStroke(),e.fill(0,0,100),e.circle(0,0,s),e.fill(0,0,0),e.arc(0,0,s,s,e.HALF_PI,e.PI+e.HALF_PI,e.PIE),e.fill(0,0,100),e.circle(0,-i/2,i),e.fill(0,0,0),e.circle(0,i/2,i),e.fill(0,0,0),e.circle(0,-i/2,i/4),e.fill(0,0,100),e.circle(0,i/2,i/4);let l=33e-5*o;n+=l;let c=.84*o;n>c&&(n=c),t+=n*o}}}};console.log("Umbral Vision - Efectos cargados:",Object.keys(Je));var De=class{constructor(t={}){this.params={},this.time=0,this.elapsed=0,this._resetParams(),t&&this.setParameters(t)}_resetParams(){for(let[t,n]of Object.entries(this.constructor.schema))this.params[t]=n.default}setParameters(t){if(!t)return[];let n=this.constructor.schema,a=[];for(let[r,o]of Object.entries(t)){let s=n[r];if(!s)continue;let i;if(s.type==="boolean")i=!!o;else{if(i=Number(o),!Number.isFinite(i))continue;s.type==="int"&&(i=Math.round(i)),typeof s.min=="number"&&(i=Math.max(s.min,i)),typeof s.max=="number"&&(i=Math.min(s.max,i))}i!==this.params[r]&&(this.params[r]=i,a.push(r))}return a}getParameters(){return{...this.params}}getSchema(){return this.constructor.schema}update(t,n){this.time+=t,this.elapsed+=t}render(t){throw new Error("Effect.render() must be implemented")}onResize(t,n){}initialize(){}dispose(){}};je(De,"schema",{});function Ja(e,t,n,a){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let o=e.getShaderInfoLog(r);throw e.deleteShader(r),new Error(`[${a}] shader compile error:
${o}
${n}`)}return r}var se=class{constructor(t,n,a,r="program"){this.gl=t,this.name=r,this.disposed=!1;let o=Ja(t,t.VERTEX_SHADER,n,`${r}:vs`),s=Ja(t,t.FRAGMENT_SHADER,a,`${r}:fs`),i=t.createProgram();if(t.attachShader(i,o),t.attachShader(i,s),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS)){let l=t.getProgramInfoLog(i);throw t.deleteProgram(i),t.deleteShader(o),t.deleteShader(s),new Error(`[${r}] program link error:
${l}`)}t.deleteShader(o),t.deleteShader(s),this.program=i,this.uniforms=new Map,this._introspect()}_introspect(){let t=this.gl,n=t.getProgramParameter(this.program,t.ACTIVE_UNIFORMS);for(let a=0;a<n;a++){let r=t.getActiveUniform(this.program,a);if(!r)continue;let o=r.name.replace(/\[0\]$/,"");this.uniforms.set(o,{location:t.getUniformLocation(this.program,r.name),type:r.type,size:r.size})}}use(){return this.gl.useProgram(this.program),this}has(t){return this.uniforms.has(t)}location(t){let n=this.uniforms.get(t);return n?n.location:null}set(t,n){let a=this.uniforms.get(t);if(!a||a.location===null)return this;let r=this.gl;switch(a.type){case r.FLOAT:r.uniform1f(a.location,n);break;case r.FLOAT_VEC2:r.uniform2fv(a.location,n);break;case r.FLOAT_VEC3:r.uniform3fv(a.location,n);break;case r.FLOAT_VEC4:r.uniform4fv(a.location,n);break;case r.INT:case r.BOOL:case r.SAMPLER_2D:case r.SAMPLER_CUBE:r.uniform1i(a.location,n);break;case r.INT_VEC2:r.uniform2iv(a.location,n);break;case r.INT_VEC3:r.uniform3iv(a.location,n);break;case r.INT_VEC4:r.uniform4iv(a.location,n);break;case r.FLOAT_MAT3:r.uniformMatrix3fv(a.location,!1,n);break;case r.FLOAT_MAT4:r.uniformMatrix4fv(a.location,!1,n);break;default:break}return this}dispose(){this.disposed||(this.disposed=!0,this.uniforms.clear(),this.program&&(this.gl.deleteProgram(this.program),this.program=null))}};var Za={rgba8:{internal:"RGBA8",type:"UNSIGNED_BYTE"},rgba16f:{internal:"RGBA16F",type:"HALF_FLOAT"},rgba32f:{internal:"RGBA32F",type:"FLOAT"}};function Pe(e,t){let n=Za[t];if(!n)return!1;let a=e[n.internal],r=e[n.type];if(a==null||r==null)return!1;let o=e.createTexture();e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,a,1,1,0,e.RGBA,r,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST);let s=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,s),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0);let i=e.checkFramebufferStatus(e.FRAMEBUFFER);return e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(s),e.deleteTexture(o),i===e.FRAMEBUFFER_COMPLETE}var ue=class{constructor(t,n){this.gl=t,this.format=n.format||"rgba16f",this.filterMode=n.filter||"linear",this.needsDepth=!!n.depth,this.width=0,this.height=0,this.texture=null,this.fbo=null,this.depthBuffer=null,this.disposed=!1,this.resize(Math.max(1,n.width|0),Math.max(1,n.height|0))}resize(t,n){if(this.disposed||(t=Math.max(1,t|0),n=Math.max(1,n|0),t===this.width&&n===this.height))return;this.width=t,this.height=n;let a=this.gl;this.texture||(this.texture=a.createTexture()),this.fbo||(this.fbo=a.createFramebuffer());let r=Za[this.format],o=a[r.internal],s=a[r.type],l=!(this.format==="rgba16f"||this.format==="rgba32f")||!!(a.getExtension("OES_texture_float_linear")||a.getExtension("OES_texture_half_float_linear")),c=this.filterMode==="nearest"||!l?a.NEAREST:a.LINEAR;a.bindTexture(a.TEXTURE_2D,this.texture),a.texImage2D(a.TEXTURE_2D,0,o,t,n,0,a.RGBA,s,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,c),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,c),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindTexture(a.TEXTURE_2D,null),a.bindFramebuffer(a.FRAMEBUFFER,this.fbo),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,this.texture,0),this.needsDepth&&(this.depthBuffer||(this.depthBuffer=a.createRenderbuffer()),a.bindRenderbuffer(a.RENDERBUFFER,this.depthBuffer),a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_COMPONENT24,t,n),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,this.depthBuffer),a.bindRenderbuffer(a.RENDERBUFFER,null)),a.bindFramebuffer(a.FRAMEBUFFER,null)}bind(){let t=this.gl;return t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.viewport(0,0,this.width,this.height),this}dispose(){if(this.disposed)return;this.disposed=!0;let t=this.gl;this.texture&&t.deleteTexture(this.texture),this.fbo&&t.deleteFramebuffer(this.fbo),this.depthBuffer&&t.deleteRenderbuffer(this.depthBuffer),this.texture=null,this.fbo=null,this.depthBuffer=null}};function lt(e){let t=e.createVertexArray(),n=e.createBuffer();return e.bindVertexArray(t),e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),{vao:t,draw(){e.bindVertexArray(t),e.drawArrays(e.TRIANGLE_STRIP,0,4)},dispose(){e.deleteBuffer(n),e.deleteVertexArray(t)}}}function er(e){let t=e.createVertexArray(),n=e.createBuffer();return e.bindVertexArray(t),e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),{vao:t,drawInstanced(a){e.bindVertexArray(t),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,a)},dispose(){e.deleteBuffer(n),e.deleteVertexArray(t)}}}var pe=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
`,Gt=`
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}
`,ct=`
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm3(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise(p);
    p = p * 2.02 + vec3(13.7, 7.1, 3.3);
    amplitude *= 0.5;
  }
  return value;
}
`,tr=`
vec3 snoiseVec3(vec3 x) {
  return vec3(
    snoise(x),
    snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
    snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
  );
}

// Divergence-free field from a 3D noise potential (finite differences).
vec3 curlNoise(vec3 p) {
  const float e = 0.08;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 px0 = snoiseVec3(p - dx);
  vec3 px1 = snoiseVec3(p + dx);
  vec3 py0 = snoiseVec3(p - dy);
  vec3 py1 = snoiseVec3(p + dy);
  vec3 pz0 = snoiseVec3(p - dz);
  vec3 pz1 = snoiseVec3(p + dz);

  vec3 curl = vec3(
    (py1.z - py0.z) - (pz1.y - pz0.y),
    (pz1.x - pz0.x) - (px1.z - px0.z),
    (px1.y - px0.y) - (py1.x - py0.x)
  );
  return curl / (2.0 * e);
}

// Cheaper layered flow used at lower quality: one curl + analytic swirl.
vec3 organicFlow(vec3 p, float time, float complexity) {
  vec3 flow = curlNoise(p + vec3(0.0, time * 0.10, time * 0.06));
  flow += 0.45 * curlNoise(p * 2.1 + vec3(time * 0.13, -time * 0.07, time * 0.05));
  // Global vortex around Y keeps the tissue coherent.
  flow += cross(normalize(p + vec3(0.001)), vec3(0.0, 1.0, 0.0)) * (0.25 + complexity * 0.4);
  return flow;
}
`,Ze=`
// IQ cosine palette.
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318530718 * (c * t + d));
}

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 umbralPalette(float t, float hue, float saturation) {
  vec3 a = vec3(0.30, 0.28, 0.32);
  vec3 b = vec3(0.65, 0.58, 0.55) * saturation;
  vec3 c = vec3(1.0, 0.92, 0.80);
  vec3 d = vec3(hue, hue + 0.18, hue + 0.44);
  vec3 col = palette(t, a, b, c, d);
  return mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, 0.75 + saturation * 0.25);
}

// Paleta cohesiva para tejidos: un tono base + acento arm\xF3nico.
vec3 fluidColor(float hue, float saturation) {
  float h = fract(hue);
  vec3 base = hsv2rgb(vec3(h, saturation * 0.92, 0.62));
  vec3 accent = hsv2rgb(vec3(fract(h + 0.085), saturation, 1.0));
  vec3 deep = hsv2rgb(vec3(fract(h + 0.90), saturation * 0.75, 0.38));
  return mix(mix(deep, base, 0.55), accent, 0.42);
}
`;var nr=`
vec3 acesFilm(vec3 x) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
`;var ar=`${pe}
${Gt}
${ct}
${tr}
${Ze}

uniform sampler2D uPos;
uniform sampler2D uVel;
uniform sampler2D uHome;

uniform float uTime;
uniform float uDt;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uComplexity;
uniform float uTurbulence;

uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uKick;
uniform float uKickImpulse;
uniform float uAudioAmount;

layout(location = 0) out vec4 outPos;
layout(location = 1) out vec4 outVel;

void main() {
  ivec2 texel = ivec2(gl_FragCoord.xy);
  vec4 posData = texelFetch(uPos, texel, 0);
  vec4 velData = texelFetch(uVel, texel, 0);
  vec4 homeData = texelFetch(uHome, texel, 0);

  vec3 pos = posData.xyz;
  vec3 vel = velData.xyz;
  float life = posData.w;
  float seed = velData.w;

  float bass = uAudioBass * uAudioAmount;
  float mid = uAudioMid * uAudioAmount;
  float high = uAudioHigh * uAudioAmount;

  float t = uTime;

  // La superficie respira / se deforma: mantiene el tejido coherente.
  vec3 home = homeData.xyz;
  vec3 breathe = vec3(
    snoise(home * 1.15 + vec3(t * 0.14, 0.0, 0.0)),
    snoise(home * 1.30 + vec3(0.0, t * 0.11, 0.0)),
    snoise(home * 1.05 + vec3(0.0, 0.0, t * 0.12))
  );
  home += breathe * (0.10 + uAmplitude * 0.22 + bass * 0.22);
  float pulse = 1.0 + 0.035 * sin(t * 0.35 + homeData.w * 6.2831) + bass * 0.09;
  home.xz *= pulse;

  // Dominio deformado: el flujo se calcula sobre un espacio que respira.
  vec3 warp = vec3(
    snoise(home * 1.7 + t * 0.08),
    snoise(home * 1.9 - t * 0.06),
    snoise(home * 1.5 + t * 0.07)
  ) * (0.18 + mid * 0.25);
  vec3 flowPos = (pos + warp) * (0.55 + uComplexity * 0.75);

  vec3 flow = organicFlow(flowPos + vec3(0.0, t * 0.05, 0.0), t, uComplexity);
  flow *= uAmplitude * (0.85 + uTurbulence * 0.9) * (1.0 + mid * 1.4);
  flow += curlNoise(pos * 4.2 + t * 0.21) * high * 0.35;

  vec3 delta = home - pos;
  float dist = length(delta);
  float spring = 2.4 + uComplexity * 1.8;

  vec3 accel = flow * 3.2 + delta * spring;
  // Beat: impulso radial que atraviesa la membrana.
  accel += normalize(pos + vec3(0.0001)) * (uKickImpulse * 4.5 + uKick * 0.65);

  vel = vel * 0.94 + accel * uDt;

  float vlen = length(vel);
  if (vlen > 6.0) vel *= 6.0 / vlen;

  float speedMul = uSpeed * (1.0 + bass * 0.45);
  pos += vel * uDt * speedMul;

  life += uDt * (0.05 + seed * 0.025 + high * 0.03);

  // Respawn en la superficie: vida c\xEDclica sin saltos visibles (fade in/out).
  if (life >= 1.0 || dist > 3.5 || any(greaterThan(abs(pos), vec3(9.0)))) {
    vec3 rnd = hash33(home * 37.1 + seed * 19.7 + t * 0.001);
    pos = home + (rnd - 0.5) * (0.04 + 0.05 * hash11(seed + t));
    vel = (rnd - 0.5) * 0.22;
    life = 0.0;
  }

  outPos = vec4(pos, life);
  outVel = vec4(vel, seed);
}
`,rr=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;

layout(location = 0) in vec2 aCorner;

uniform sampler2D uPos;
uniform sampler2D uVel;
uniform sampler2D uHome;
uniform mat4 uViewProj;
uniform vec2 uResolution;

uniform float uTime;
uniform float uPointSize;
uniform float uOpacity;
uniform float uGlow;
uniform float uHue;
uniform float uSaturation;
uniform float uStretch;
uniform vec3 uLightPos;
uniform float uLightPower;

uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uKick;
uniform float uKickImpulse;
uniform float uAudioAmount;

out vec2 vLocal;
out vec3 vColor;
out float vAlpha;

${Gt}
${ct}
${Ze}

void main() {
  int id = gl_InstanceID;
  int width = textureSize(uPos, 0).x;
  ivec2 texel = ivec2(id % width, id / width);

  vec4 posData = texelFetch(uPos, texel, 0);
  vec4 velData = texelFetch(uVel, texel, 0);
  vec4 homeData = texelFetch(uHome, texel, 0);

  vec3 pos = posData.xyz;
  vec3 vel = velData.xyz;
  float life = posData.w;
  float param = homeData.w;

  vec4 clipPos = uViewProj * vec4(pos, 1.0);
  if (clipPos.w <= 0.05) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vLocal = vec2(0.0);
    vColor = vec3(0.0);
    vAlpha = 0.0;
    return;
  }

  float high = uAudioHigh * uAudioAmount;
  float rms = uAudioRms * uAudioAmount;
  float kick = uKick * uAudioAmount;

  vec4 prevClip = uViewProj * vec4(pos - vel * 0.055, 1.0);
  vec2 ndc = clipPos.xy / clipPos.w;
  vec2 prevNdc = prevClip.w > 0.0 ? prevClip.xy / prevClip.w : ndc;
  vec2 motion = ndc - prevNdc;
  float motionLen = length(motion);

  // Tangente de la membrana (alrededor de Y): da direcci\xF3n de fibra incluso
  // cuando la velocidad instant\xE1nea es baja.
  vec3 tangent = normalize(vec3(-homeData.z, 0.0, homeData.x) + vec3(0.0001));
  vec4 tangentClip = uViewProj * vec4(pos + tangent * 0.12, 1.0);
  vec2 tangentNdc = tangentClip.w > 0.0 ? tangentClip.xy / tangentClip.w : ndc;
  vec2 tangentDir = normalize(tangentNdc - ndc + vec2(0.00001));

  vec2 motionDir = motionLen > 1e-5 ? motion / motionLen : tangentDir;
  vec2 dir = normalize(mix(tangentDir, motionDir, 0.7) + vec2(0.00001));
  vec2 perp = vec2(-dir.y, dir.x);

  // M\xE1scara de tejido: bandas coherentes en la superficie, no ruido uniforme.
  float band = snoise(homeData.xyz * 1.15 + vec3(0.0, uTime * 0.04, 0.0));
  float fine = snoise(homeData.xyz * 3.1 - vec3(uTime * 0.05, 0.0, 0.0));
  float tissue = smoothstep(-0.25, 0.55, band) * (0.62 + 0.38 * smoothstep(-0.45, 0.5, fine));

  float depth = max(clipPos.w, 0.25);
  float speed = length(vel);

  float sizePx = uPointSize * (5.0 / depth) * (0.60 + param * 0.75);
  sizePx *= (0.75 + 0.55 * tissue) * (1.0 + high * 0.45 + rms * 0.3 + kick * 0.2);
  sizePx = max(sizePx, 0.9);

  float stretch = 1.0 + uStretch * (0.12 + 0.30 * tissue) + min(motionLen, 0.30) * uStretch * 12.0;
  vec2 offsetPx = (perp * aCorner.x + dir * aCorner.y * stretch) * sizePx;
  vec2 offsetNdc = offsetPx / uResolution * 2.0;

  clipPos.xy += offsetNdc * clipPos.w;
  gl_Position = clipPos;

  vLocal = aCorner * vec2(1.0, 1.0 / max(stretch, 0.001));

  float hueT = fract(uHue + param * 0.055 + depth * 0.012 + speed * 0.012 + uTime * 0.003);
  vColor = fluidColor(hueT, uSaturation);
  vColor = mix(vColor, vec3(0.85, 0.92, 1.0), 0.06 + high * 0.12);
  float depthLight = 1.0 - smoothstep(2.8, 7.6, depth);
  vColor *= 0.36 + 0.64 * depthLight;

  // Luz viajera: ilumina la membrana seg\xFAn posici\xF3n, no solo profundidad.
  float lightDist = length(pos - uLightPos);
  float light = uLightPower / (0.55 + lightDist * lightDist * 0.75);
  vColor *= 0.62 + clamp(light, 0.0, 1.8) * 0.9;
  vColor *= 1.0 + kick * 0.55 + rms * 0.15;

  float fadeIn = smoothstep(0.0, 0.06, life);
  float fadeOut = 1.0 - smoothstep(0.74, 1.0, life);
  float depthFade = smoothstep(0.0, 0.9, depth) * (1.0 - smoothstep(8.0, 13.0, depth));
  vAlpha = fadeIn * fadeOut * depthFade * uOpacity * (0.32 + 0.68 * tissue) * (0.7 + rms * 0.5);
}
`,ir=`${pe}

in vec2 vLocal;
in vec3 vColor;
in float vAlpha;

uniform float uGlow;

out vec4 outColor;

void main() {
  float r2 = dot(vLocal, vLocal);
  // Sprite el\xEDptico con n\xFAcleo brillante y halo suave.
  float core = exp(-r2 * 5.2);
  float halo = exp(-r2 * 1.15) * 0.55;
  float alpha = (core * 1.15 + halo) * vAlpha;
  if (alpha < 0.002) discard;
  outColor = vec4(vColor * alpha * uGlow, 1.0);
}
`;function lo(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function Tn(e,t,n=new Float32Array(16)){for(let a=0;a<4;a++){let r=t[a*4],o=t[a*4+1],s=t[a*4+2],i=t[a*4+3];n[a*4]=e[0]*r+e[4]*o+e[8]*s+e[12]*i,n[a*4+1]=e[1]*r+e[5]*o+e[9]*s+e[13]*i,n[a*4+2]=e[2]*r+e[6]*o+e[10]*s+e[14]*i,n[a*4+3]=e[3]*r+e[7]*o+e[11]*s+e[15]*i}return n}function Fn(e,t,n,a,r=new Float32Array(16)){let o=1/Math.tan(e/2),s=1/(n-a);return r.fill(0),r[0]=o/t,r[5]=o,r[10]=(a+n)*s,r[11]=-1,r[14]=2*a*n*s,r}function Rn(e,t,n,a=new Float32Array(16)){let r=e[0]-t[0],o=e[1]-t[1],s=e[2]-t[2],i=Math.hypot(r,o,s)||1;r/=i,o/=i,s/=i;let l=n[1]*s-n[2]*o,c=n[2]*r-n[0]*s,d=n[0]*o-n[1]*r;i=Math.hypot(l,c,d)||1,l/=i,c/=i,d/=i;let m=o*d-s*c,f=s*l-r*d,p=r*c-o*l;return a[0]=l,a[1]=m,a[2]=r,a[3]=0,a[4]=c,a[5]=f,a[6]=o,a[7]=0,a[8]=d,a[9]=p,a[10]=s,a[11]=0,a[12]=-(l*e[0]+c*e[1]+d*e[2]),a[13]=-(m*e[0]+f*e[1]+p*e[2]),a[14]=-(r*e[0]+o*e[1]+s*e[2]),a[15]=1,a}function or(e,t=new Float32Array(16)){let n=Math.cos(e),a=Math.sin(e);return t.set(lo()),t[0]=n,t[2]=-a,t[8]=a,t[10]=n,t}function Oe(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let a=t;return a=Math.imul(a^a>>>15,a|1),a^=a+Math.imul(a^a>>>7,a|61),((a^a>>>14)>>>0)/4294967296}}function ut(e,t){return Number.isFinite(Number(e))?Number(e):t}var We=class{constructor(){this.kickPos=0,this.kickVel=0,this.flowPhase=0}update(t,n,a,r,o=1){let s=a.effects?.[r]||{},i=ut(s.kick,1),l=ut(s.mid,1),c=a.kick||{};o>0&&n?.kickTrigger&&(this.kickVel+=ut(n.kickStrength,1)*ut(c.depth,.7)*i*6*o);let d=ut(c.spring,18),m=ut(c.damping,4.5);this.kickVel+=(-d*this.kickPos-m*this.kickVel)*t,this.kickPos+=this.kickVel*t,this.kickPos=Math.max(-1.2,Math.min(1.2,this.kickPos));let f=ut(n?.midFlow,0)*l*o;return this.flowPhase+=t*(.18+f*ut(a.midFlow?.waveSpeed,.8)*1.6),this}};var co=Math.PI*2,pa={density:{type:"number",default:.9,min:.1,max:1,label:"Densidad",group:"Forma"},speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},amplitude:{type:"number",default:.62,min:0,max:2,label:"Amplitud",group:"Movimiento"},complexity:{type:"number",default:.62,min:0,max:1,label:"Complejidad",group:"Forma"},turbulence:{type:"number",default:.55,min:0,max:1.5,label:"Turbulencia",group:"Movimiento"},hue:{type:"number",default:.56,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.9,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.68,min:.2,max:4,label:"Glow",group:"Apariencia"},particleSize:{type:"number",default:1,min:.4,max:3,label:"Tama\xF1o",group:"Forma"},bloom:{type:"number",default:.85,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.98,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:4,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:1,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},Hs=Object.freeze(["membrane","torus","ribbon","smoke","swarm"]),uo=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0});function mo(e,t,n=1){let a=t*t,r=new Float32Array(a*4),o=new Float32Array(a*4),s=new Float32Array(a*4),i=Oe(n|0||1),l=e|0;for(let c=0;c<t;c++)for(let d=0;d<t;d++){let m=(c*t+d)*4,f=(d+.5+c*.61803398875)%t/t,p=(c+.5)/t*2-1,u=f*co,x=i(),b=i(),v=i(),h,g,E;if(l===1){let S=p*Math.PI,w=1.05+.1*Math.sin(u*3),A=.42,L=w+A*Math.cos(S+Math.sin(u*2)*.18);h=Math.cos(u)*L,g=A*Math.sin(S)+.08*Math.sin(u*4),E=Math.sin(u)*L}else if(l===2){let S=p*1.25,w=u+S,A=1.22+.16*Math.cos(p*Math.PI*2.2);h=Math.cos(w)*A,g=p*1.65+.16*Math.sin(u*2+p*2.4),E=Math.sin(w)*A}else{let S=Math.sin(u*3+p*2.2)*.2+Math.sin(u*5-p*1.7)*.07,w=1.28+.3*Math.cos(p*Math.PI*.92)+S;h=Math.cos(u)*w+.1*Math.sin(u*4+p*3),g=p*1.95+.2*Math.sin(u*2+p*3.4),E=Math.sin(u)*w}r[m]=h,r[m+1]=g,r[m+2]=E,r[m+3]=(f+p*.08+1)%1;let M=.035;s[m]=h+(i()-.5)*M,s[m+1]=g+(i()-.5)*M,s[m+2]=E+(i()-.5)*M,s[m+3]=i()*.7,o[m]=(x-.5)*.08,o[m+1]=(b-.5)*.08,o[m+2]=(v-.5)*.08,o[m+3]=x}return{home:r,pos:s,vel:o}}var nn=class extends De{constructor(t,n={}){if(super(n),this.renderer=t,this.particleSize=t.quality.particleSize,this.particleCount=this.particleSize*this.particleSize,this.gl=t.gl,this.sceneFormat=Pe(this.gl,"rgba16f")?"rgba16f":"rgba8",this.simFormat=Pe(this.gl,"rgba32f")?"rgba32f":Pe(this.gl,"rgba16f")?"rgba16f":null,this.programs=[],this.state=null,this.homeTexture=null,this.sceneTarget=null,this.sprite=null,this.fullscreen=null,this.viewProj=new Float32Array(16),this.eye=[0,0,4.8],this.lightPos=[2.2,1.8,2.4],this.lastAudio=null,this.motion=new We,this.signals={body:0,mid:0,high:0,rms:0,kickPos:0,kickImpulse:0},!this.simFormat)throw new Error("WebGL 2 sin soporte de render a texturas float (se requiere EXT_color_buffer_float)");this._initialize()}_initialize(){let t=this.gl;this.updateProgram=new se(t,`#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,ar,"fluid:update"),this.renderProgram=new se(t,rr,ir,"fluid:render"),this.programs.push(this.updateProgram,this.renderProgram),this.sprite=er(t),this.fullscreen=lt(t),this.sceneTarget=new ue(t,{width:this.renderer.width,height:this.renderer.height,format:this.sceneFormat,filter:"linear"}),this._createHomeAndState()}_createHomeAndState(){let t=this.gl,n=this.particleSize,a=mo(this.params.variant|0,n,this.params.seed|0||1);this.homeTexture=this._createTexture(n,a.home);let r=this._createTexture(n,a.pos),o=this._createTexture(n,a.vel),s=this._createTexture(n,null),i=this._createTexture(n,null),l=t.createFramebuffer();this.state={fbo:l,posA:r,velA:o,posB:s,velB:i,read:"a"},t.bindFramebuffer(t.FRAMEBUFFER,l),t.drawBuffers([t.COLOR_ATTACHMENT0,t.COLOR_ATTACHMENT1]),t.bindFramebuffer(t.FRAMEBUFFER,null)}_createTexture(t,n){let a=this.gl,r=a.createTexture(),o=a.FLOAT;return a.bindTexture(a.TEXTURE_2D,r),a.texImage2D(a.TEXTURE_2D,0,this.simFormat==="rgba32f"?a.RGBA32F:a.RGBA16F,t,t,0,a.RGBA,o,n),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindTexture(a.TEXTURE_2D,null),r}initialize(){}setParameters(t){let n=super.setParameters(t);return(n.includes("seed")||n.includes("variant"))&&this.state&&this._rebuildState(),n}_rebuildState(){this._destroyState(),this._createHomeAndState()}_destroyState(){let t=this.gl;this.state&&(t.deleteTexture(this.state.posA),t.deleteTexture(this.state.posB),t.deleteTexture(this.state.velA),t.deleteTexture(this.state.velB),t.deleteFramebuffer(this.state.fbo),this.state=null),this.homeTexture&&(t.deleteTexture(this.homeTexture),this.homeTexture=null)}update(t,n=uo){super.update(t,n),this.lastAudio=n;let a=this.params,r=a.audio>0&&n.enabled?a.audio:0,o=Z(),s=o.effects?.fluidFields||{},i=this.motion.update(t,n,o,"fluidFields",r),l=(n.bassBody||0)*r*Number(s.body??1),c=(n.midFlow||0)*r*Number(s.mid??1),d=(n.highShimmer||0)*r*Number(s.high??1),m=(n.rms||0)*r,f=i.kickPos*Number(s.kick??1),p=n.kickTrigger?(n.kickStrength||1)*Number(s.kick??1):0;this.signals={body:l,mid:c,high:d,rms:m,kickPos:f,kickImpulse:p},this._stepSimulation(Math.min(.033,Math.max(0,t)),n);let u=this.time,x=this.renderer.pointer||{x:0,y:0},b=f*Number(o.kick?.cameraDolly??.03)*8,v=l*Number(o.bassBody?.scale??.05)*2,h=4.9-b-v+Math.sin(u*.09)*.35,g=u*.11+i.flowPhase*.12+x.x*.22;this.eye=[Math.sin(g)*h,Math.sin(u*.07)*1.15+x.y*.9+f*.3,Math.cos(g)*h];let E=Rn(this.eye,[0,0,0],[0,1,0]),M=Fn(55*Math.PI/180,this.renderer.width/Math.max(1,this.renderer.height),.1,40);Tn(M,E,this.viewProj),this.lightPos=[Math.sin(u*.23)*2.6,1.7+Math.cos(u*.17)*.9,Math.cos(u*.23)*2.8]}_stepSimulation(t,n){let a=this.gl,r=this.state,o=this.params,s=this.signals,i=r.read==="a"?r.posA:r.posB,l=r.read==="a"?r.velA:r.velB,c=r.read==="a"?r.posB:r.posA,d=r.read==="a"?r.velB:r.velA;a.bindFramebuffer(a.FRAMEBUFFER,r.fbo),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,c,0),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT1,a.TEXTURE_2D,d,0),a.viewport(0,0,this.particleSize,this.particleSize),a.disable(a.BLEND),a.disable(a.DEPTH_TEST),this.updateProgram.use().set("uPos",0).set("uVel",1).set("uHome",2).set("uTime",this.time).set("uDt",t).set("uSpeed",o.speed).set("uAmplitude",o.amplitude).set("uComplexity",o.complexity).set("uTurbulence",o.turbulence).set("uAudioBass",s.body).set("uAudioMid",s.mid).set("uAudioHigh",s.high).set("uAudioRms",s.rms).set("uKick",s.kickPos).set("uKickImpulse",s.kickImpulse).set("uAudioAmount",1),this._bindTexture(i,0),this._bindTexture(l,1),this._bindTexture(this.homeTexture,2),this.fullscreen.draw(),a.bindFramebuffer(a.FRAMEBUFFER,null),r.read=r.read==="a"?"b":"a"}_bindTexture(t,n){let a=this.gl;a.activeTexture(a.TEXTURE0+n),a.bindTexture(a.TEXTURE_2D,t)}render(t){let n=this.gl,a=this.params,r=this.state,o=this.signals,s=r.read==="a"?r.posA:r.posB,i=r.read==="a"?r.velA:r.velB;this.sceneTarget.bind(),n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ONE),n.disable(n.DEPTH_TEST),n.disable(n.CULL_FACE);let l=Math.max(1,Math.floor(this.particleCount*a.density)),c=[this.sceneTarget.width,this.sceneTarget.height];this.renderProgram.use().set("uPos",0).set("uVel",1).set("uHome",2).set("uViewProj",this.viewProj).set("uResolution",c).set("uTime",this.time).set("uPointSize",a.particleSize*1.95).set("uOpacity",.62).set("uGlow",a.glow).set("uHue",a.hue).set("uSaturation",a.saturation).set("uStretch",t.quality.trailLength).set("uLightPos",this.lightPos).set("uLightPower",1.35+o.rms*.8).set("uAudioHigh",o.high).set("uAudioRms",o.rms).set("uKick",o.kickPos).set("uAudioAmount",1),this._bindTexture(s,0),this._bindTexture(i,1),this._bindTexture(this.homeTexture,2),this.sprite.drawInstanced(l),n.disable(n.BLEND),n.bindFramebuffer(n.FRAMEBUFFER,null)}setAudioFeatures(t){this.lastAudio=t}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.3,bloomKnee:.26,exposure:t.exposure,vignette:.55,grain:.028,aberration:.014,time:this.time}}getSceneTarget(){return this.sceneTarget}onResize(t,n){this.sceneTarget&&this.sceneTarget.resize(t,n)}dispose(){for(let t of this.programs)t.dispose();this.programs=[],this.sprite&&this.sprite.dispose(),this.fullscreen&&this.fullscreen.dispose(),this.sceneTarget&&this.sceneTarget.dispose(),this._destroyState(),this.sprite=null,this.fullscreen=null,this.sceneTarget=null}};je(nn,"schema",pa);var Cn=class{constructor(t,n){this.gl=t,this.vao=t.createVertexArray(),this.buffers=[],this.vertexCount=n.positions.length/3,this.indexCount=n.indices.length,t.bindVertexArray(this.vao),this.positionBuffer=this._buffer(t.ARRAY_BUFFER,n.positions,3),this.normalBuffer=this._buffer(t.ARRAY_BUFFER,n.normals,3,1),this.uvBuffer=this._buffer(t.ARRAY_BUFFER,n.uvs,2,2),this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,n.indices,t.STATIC_DRAW),this.buffers.push(this.indexBuffer),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null)}_buffer(t,n,a,r=0){let o=this.gl,s=o.createBuffer();return o.bindBuffer(t,s),o.bufferData(t,n,o.STATIC_DRAW),o.enableVertexAttribArray(r),o.vertexAttribPointer(r,a,o.FLOAT,!1,0,0),this.buffers.push(s),s}draw(){let t=this.gl;t.bindVertexArray(this.vao),t.drawElements(t.TRIANGLES,this.indexCount,t.UNSIGNED_INT,0),t.bindVertexArray(null)}dispose(){let t=this.gl;for(let n of this.buffers)t.deleteBuffer(n);this.buffers=[],t.deleteVertexArray(this.vao),this.vao=null}};var sr=`#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUv;

uniform mat4 uViewProj;
uniform mat4 uModel;
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uSeed;
uniform float uScale;

uniform float uKick;
uniform float uBody;
uniform float uMidFlow;
uniform float uHighShimmer;
uniform float uFlowPhase;
uniform float uWaveAmp;
uniform float uTwist;
uniform float uMicroDisplace;

out vec3 vWorld;
out vec3 vNormal;
out vec2 vUv;
out float vDisp;

${ct}

void main() {
  vec3 p = aPosition;

  // Base org\xE1nica + respiraci\xF3n de graves + empuje del kick.
  float n = fbm3(p * uFrequency + vec3(0.0, uTime * 0.18, uSeed), 3);
  float n2 = snoise(p * 3.1 - vec3(uTime * 0.24, 0.0, uSeed * 0.5));
  float body = uBody * 0.11;
  float kickDisp = uKick * 0.22;
  p += aNormal * (n * uAmplitude + n2 * uAmplitude * 0.38 + body + kickDisp);

  // Onda de kick que recorre la estructura.
  float kickWave = sin(aUv.x * 9.4248 - uFlowPhase * 1.4 + uSeed) * uKick * 0.10;
  p += aNormal * kickWave;

  // Medios: ondulaci\xF3n lateral + torsi\xF3n viajera.
  vec3 lateral = normalize(cross(aNormal, normalize(vec3(0.0, 1.0, 0.0))) + vec3(0.0001));
  float flowWave = sin(aUv.x * 18.0 - uFlowPhase + uSeed + uTwist) * uWaveAmp * (0.35 + uMidFlow * 0.9);
  p += lateral * flowWave;
  p += lateral * sin(aUv.y * 6.2831 + uFlowPhase * 0.7) * uMidFlow * 0.045;

  // Agudos: micro-desplazamiento coherente, sin jitter.
  float shimmer = sin(aUv.x * 150.0 + aUv.y * 62.0 - uTime * 6.0) * uHighShimmer * uMicroDisplace;
  p += aNormal * shimmer;

  vec4 world = uModel * vec4(p * uScale, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(uModel) * aNormal);
  vUv = aUv;
  vDisp = n * uAmplitude + body + kickDisp;
  gl_Position = uViewProj * world;
}
`,lr=`${pe}
in vec3 vWorld;
in vec3 vNormal;
in vec2 vUv;
in float vDisp;

uniform float uTime;
uniform float uHue;
uniform float uSaturation;
uniform float uGlow;
uniform float uOpacity;
uniform vec3 uCamPos;

uniform float uKick;
uniform float uBody;
uniform float uMidFlow;
uniform float uHighShimmer;

${ct}
${Ze}

out vec4 outColor;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - vWorld);
  float fresnel = pow(1.0 - clamp(abs(dot(N, V)), 0.0, 1.0), 2.4);

  // Tejido base.
  float vein = 0.5 + 0.5 * sin(vUv.x * 150.0 + vUv.y * 18.8495
              + snoise(vWorld * 2.2 + uTime * 0.22) * 4.5);
  float micro = 0.5 + 0.5 * snoise(vWorld * 5.5 - vec3(uTime * 0.30));
  float bands = smoothstep(0.62, 0.96, vein) * 0.9 + micro * 0.28;

  // Porosidad y shimmer de agudos.
  float grain = snoise(vWorld * 8.5 + vec3(0.0, uTime * 0.18, 0.0));
  float pores = smoothstep(0.42, 0.95, grain) * uHighShimmer;
  float sparkle = pow(max(0.0, snoise(vWorld * 24.0 - uTime * 1.4)), 5.0) * uHighShimmer;

  vec3 lightDir = normalize(vec3(sin(uTime * 0.21) * 1.3, 0.9, cos(uTime * 0.19) * 1.2));
  float diffuse = clamp(dot(N, lightDir), 0.0, 1.0);
  float backLight = clamp(dot(-N, lightDir), 0.0, 1.0) * 0.6;

  float hueT = fract(uHue + vUv.x * 0.045 + vDisp * 0.09 + vUv.y * 0.03 + uTime * 0.002);
  vec3 color = fluidColor(hueT, uSaturation);
  color = mix(color, vec3(0.78, 0.89, 1.0), fresnel * 0.22 + sparkle * 0.35);

  float bright = 0.12 + diffuse * 0.62 + backLight * 0.30 + fresnel * 1.25
               + bands * 0.62
               + uKick * 0.55 + uBody * 0.35
               + pores * 0.55 + sparkle * 0.65;
  color *= bright * uGlow;

  float alpha = uOpacity * (0.08 + fresnel * 0.46 + bands * 0.30 + pores * 0.20);
  outColor = vec4(color, clamp(alpha, 0.0, 0.95));
}
`;var Vt=Math.PI*2;function cr(e={}){let t=Math.max(24,e.segmentsU??240),n=Math.max(8,e.segmentsV??56),a=e.tube??.24,r=e.scale??.95,o=e.twist??0,s=e.seed??1,l=Oe(s)()*Vt,c=h=>{let g=h*Vt;return[(Math.sin(g)+2*Math.sin(2*g))*r,(Math.cos(g)-2*Math.cos(2*g))*r,-Math.sin(3*g)*r]},d=t*n,m=new Float32Array(d*3),f=new Float32Array(d*3),p=new Float32Array(d*2),u=new Uint32Array(t*n*6),x=.001,b=[0,1,0];for(let h=0;h<n;h++){let g=h/n,E=g*Vt;for(let M=0;M<t;M++){let S=M/t,w=(h*t+M)*3,A=(h*t+M)*2,L=c(S),I=c(S+x),z=I[0]-L[0],G=I[1]-L[1],V=I[2]-L[2],C=Math.hypot(z,G,V)||1;z/=C,G/=C,V/=C;let T=G*b[2]-V*b[1],B=V*b[0]-z*b[2],U=z*b[1]-G*b[0],K=Math.hypot(T,B,U);K<1e-4&&(T=G*0-V*1,B=V*1-z*0,U=z*0-G*1,K=Math.hypot(T,B,U)||1),T/=K,B/=K,U/=K;let de=G*U-V*B,Me=V*T-z*U,Y=z*B-G*T,te=E+o*S*Vt,ve=Math.cos(te),he=Math.sin(te),nt=1+.22*Math.sin(S*Vt*3+E*2+l)+.1*Math.sin(S*Vt*5-E*3+l*.7),He=a*nt,Ae=T*ve+de*he,at=B*ve+Me*he,Ee=U*ve+Y*he;m[w]=L[0]+Ae*He,m[w+1]=L[1]+at*He,m[w+2]=L[2]+Ee*He,f[w]=Ae,f[w+1]=at,f[w+2]=Ee,p[A]=S,p[A+1]=g}}let v=0;for(let h=0;h<n;h++){let g=(h+1)%n;for(let E=0;E<t;E++){let M=(E+1)%t,S=h*t+E,w=h*t+M,A=g*t+E,L=g*t+M;u[v++]=S,u[v++]=A,u[v++]=w,u[v++]=w,u[v++]=A,u[v++]=L}}return{positions:m,normals:f,uvs:p,indices:u}}var ha={speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},amplitude:{type:"number",default:.26,min:0,max:.9,label:"Deformaci\xF3n",group:"Forma"},frequency:{type:"number",default:1.35,min:.3,max:4,label:"Frecuencia",group:"Forma"},twist:{type:"number",default:0,min:0,max:1,label:"Torsi\xF3n",group:"Forma"},hue:{type:"number",default:.53,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.95,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.95,min:.2,max:4,label:"Glow",group:"Apariencia"},opacity:{type:"number",default:.85,min:.05,max:1,label:"Opacidad",group:"Apariencia"},bloom:{type:"number",default:.85,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.95,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:3,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:3,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},kn=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0,bassBody:0,midFlow:0,highShimmer:0,kick:0,kickTrigger:!1,kickStrength:0}),ur={lite:{u:170,v:42},high:{u:260,v:60},ultra:{u:360,v:84}},an=class extends De{constructor(t,n={}){super(n),this.renderer=t,this.gl=t.gl,this.sceneFormat=Pe(this.gl,"rgba16f")?"rgba16f":"rgba8",this.sceneTarget=new ue(this.gl,{width:t.width,height:t.height,format:this.sceneFormat}),this.program=new se(this.gl,sr,lr,"organic:render"),this.mesh=null,this.model=new Float32Array(16),this.viewProj=new Float32Array(16),this.eye=[0,1.5,7],this.lastAudio=kn,this.motion=new We,this._buildMesh()}_buildMesh(){let t=ur[this.renderer.quality.name]||ur.high,n=cr({segmentsU:t.u,segmentsV:t.v,tube:.26,scale:.95,twist:this.params.twist,seed:this.params.seed|0});this.mesh&&this.mesh.dispose(),this.mesh=new Cn(this.gl,n),this.vertexCount=this.mesh.vertexCount,this.triangleCount=this.mesh.indexCount/3}setParameters(t){let n=super.setParameters(t);return this.mesh&&(n.includes("seed")||n.includes("twist"))&&this._buildMesh(),n}setAudioFeatures(t){this.lastAudio=t||kn}update(t,n=kn){super.update(t,n),this.lastAudio=n;let a=this.params,r=this.time,o=Z(),s=a.audio>0&&n.enabled?a.audio:0,i=o.effects?.organicStructures||{},l=(n.bassBody||0)*s*Number(i.body??1),c=this.motion.update(t,n,o,"organicStructures",s),d=c.kickPos*Number(i.kick??1),m=this.renderer.pointer||{x:0,y:0},f=d*Number(o.kick?.cameraDolly??.03)*8,p=l*Number(o.bassBody?.scale??.05)*2,u=7.1+Math.sin(r*.085)*.45-f-p,x=r*.09*a.speed+c.flowPhase*.12+m.x*.2;this.eye=[Math.sin(x)*u,1.35+Math.sin(r*.07)*1.1-m.y*.8,Math.cos(x)*u];let b=Rn(this.eye,[0,0,0],[0,1,0]),v=Fn(52*Math.PI/180,this.renderer.width/Math.max(1,this.renderer.height),.1,60);Tn(v,b,this.viewProj);let h=r*.055*a.speed+c.flowPhase*.1+(a.seed|0)*.01;or(h,this.model)}render(){let t=this.gl,n=this.params,a=this.lastAudio||kn,r=n.audio>0&&a.enabled?n.audio:0,o=Z(),s=o.effects?.organicStructures||{},i=this.motion,l=(a.bassBody||0)*r*Number(s.body??1),c=(a.midFlow||0)*r*Number(s.mid??1),d=i.kickPos*Number(s.kick??1);this.sceneTarget.bind(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.SRC_ALPHA,t.ONE),this.program.use().set("uViewProj",this.viewProj).set("uModel",this.model).set("uTime",this.time).set("uAmplitude",n.amplitude).set("uFrequency",n.frequency).set("uSeed",(n.seed|0)%997).set("uHue",n.hue).set("uSaturation",n.saturation).set("uGlow",n.glow).set("uOpacity",n.opacity).set("uCamPos",this.eye).set("uKick",d*r).set("uBody",l).set("uMidFlow",c).set("uHighShimmer",(a.highShimmer||0)*r*Number(s.high??1)*Number(o.highShimmer?.porosity??1)).set("uFlowPhase",i.flowPhase).set("uWaveAmp",Number(o.midFlow?.waveAmp??.12)).set("uTwist",Number(o.midFlow?.twist??.22)*Math.sin(i.flowPhase*.35)).set("uMicroDisplace",Number(o.highShimmer?.microDisplace??.012)).set("uScale",1+d*r*.12+l*Number(o.bassBody?.scale??.05)),this.mesh.draw(),t.disable(t.BLEND),t.bindFramebuffer(t.FRAMEBUFFER,null)}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.3,bloomKnee:.24,exposure:t.exposure,vignette:.5,grain:.022,aberration:.012,time:this.time}}getSceneTarget(){return this.sceneTarget}onResize(t,n){this.sceneTarget&&this.sceneTarget.resize(t,n)}dispose(){this.program&&this.program.dispose(),this.mesh&&this.mesh.dispose(),this.sceneTarget&&this.sceneTarget.dispose(),this.program=null,this.mesh=null,this.sceneTarget=null}};je(an,"schema",ha);var ze=`#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,mr=`${pe}
in vec2 vUv;
uniform sampler2D uScene;
uniform float uThreshold;
uniform float uKnee;
uniform float uIntensity;
out vec4 outColor;

void main() {
  vec3 c = texture(uScene, vUv).rgb;
  float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float soft = clamp(luma - uThreshold + uKnee, 0.0, 2.0 * uKnee);
  soft = soft * soft / (4.0 * uKnee + 0.0001);
  float contrib = max(soft, luma - uThreshold) / max(luma, 0.0001);
  outColor = vec4(c * contrib * uIntensity, 1.0);
}
`,dr=`${pe}
in vec2 vUv;
uniform sampler2D uSource;
uniform vec2 uDirection;
uniform int uQuality;
out vec4 outColor;

void main() {
  // 9-tap gaussian separado, con pesos sim\xE9tricos.
  float weights[5] = float[5](0.2270270270, 0.1945945946, 0.1216216216, 0.0540540541, 0.0162162162);
  vec3 sum = texture(uSource, vUv).rgb * weights[0];
  for (int i = 1; i < 5; i++) {
    if (i > uQuality) break;
    vec2 off = uDirection * float(i);
    sum += texture(uSource, vUv + off).rgb * weights[i];
    sum += texture(uSource, vUv - off).rgb * weights[i];
  }
  outColor = vec4(sum, 1.0);
}
`,fr=`${pe}
${Gt}
in vec2 vUv;
uniform sampler2D uSceneA;
uniform sampler2D uSceneB;
uniform float uMix;
uniform int uMode;
uniform vec2 uDirection;
uniform float uSeed;
out vec4 outColor;

float lumaOf(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec2 uvA = vUv;
  vec2 uvB = vUv;
  vec3 a;
  vec3 b;
  float m = clamp(uMix, 0.0, 1.0);

  if (uMode == 2) {
    // Zoom-through: A se acerca mientras B aterriza desde un zoom mayor.
    vec2 c = vUv - 0.5;
    float za = 1.0 + 0.22 * m;
    float zb = 1.22 - 0.22 * m;
    uvA = clamp(0.5 + c / za, vec2(0.0), vec2(1.0));
    uvB = clamp(0.5 + c / zb, vec2(0.0), vec2(1.0));
    a = texture(uSceneA, uvA).rgb;
    b = texture(uSceneB, uvB).rgb;
    m = smoothstep(0.0, 1.0, m);
  } else {
    a = texture(uSceneA, uvA).rgb;
    b = texture(uSceneB, uvB).rgb;
  }

  if (uMode == 1) {
    // Mezcla ponderada por luminancia: evita el doble expuesto plano.
    float la = lumaOf(a);
    float lb = lumaOf(b);
    m = clamp(m + (lb - la) * 0.12, 0.0, 1.0);
    m = smoothstep(0.0, 1.0, m);
  } else if (uMode == 3) {
    // Barrido direccional con borde suave y ruido para que no parezca un corte.
    vec2 dir = normalize(uDirection + vec2(0.0001));
    float edge = dot(vUv - 0.5, dir) + 0.5;
    float noise = (hash12(vUv * vec2(17.0, 13.0) + uSeed) - 0.5) * 0.06;
    float p = mix(-0.15, 1.15, m);
    m = 1.0 - smoothstep(p - 0.12, p + 0.12, edge + noise);
  } else if (uMode == 0) {
    m = smoothstep(0.0, 1.0, m);
  }

  outColor = vec4(mix(a, b, clamp(m, 0.0, 1.0)), 1.0);
}
`,pr=`${pe}
in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uPrev;
uniform vec2 uResolution;
uniform float uTime;
uniform float uFeedback;
uniform float uDecay;
uniform float uZoom;
uniform float uRotation;
uniform float uWarp;
out vec4 outColor;

mat2 rot2(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 c = vUv - 0.5;
  float angle = uRotation * 0.006 + sin(uTime * 0.07) * 0.0015;
  float zoom = 1.0 - uZoom * 0.0045;
  vec2 warped = 0.5 + rot2(angle) * (c * zoom);
  // Warp barato (sin simplex): el feedback corre en media resoluci\xF3n y no
  // necesita ruido de alta frecuencia para dar la sensaci\xF3n de arrastre.
  warped += uWarp * 0.0012 * vec2(
    sin(vUv.y * 8.0 + uTime * 0.7),
    cos(vUv.x * 7.0 - uTime * 0.6)
  );

  vec3 prev = texture(uPrev, warped).rgb * uDecay;
  vec3 scene = texture(uScene, vUv).rgb;
  vec3 color = prev + scene * uFeedback;

  // Techo suave para evitar acumulaci\xF3n infinita y lavado.
  color = color / (1.0 + color * 0.55);
  color = min(color, vec3(2.2));
  outColor = vec4(color, 1.0);
}
`,hr=`${pe}
in vec2 vUv;
uniform sampler2D uSource;
out vec4 outColor;
void main() {
  outColor = texture(uSource, vUv);
}
`,gr=`${pe}
${Gt}
${nr}

in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uBloom0;
uniform sampler2D uBloom1;
uniform sampler2D uBloom2;
uniform vec3 uBloomWeights;
uniform float uBloomStrength;
uniform float uExposure;
uniform float uVignette;
uniform float uGrain;
uniform float uAberration;
uniform float uTime;
uniform vec2 uResolution;
out vec4 outColor;

void main() {
  vec2 dir = vUv - 0.5;
  float ab = uAberration * dot(dir, dir);

  vec3 col;
  col.r = texture(uScene, vUv + dir * ab).r;
  col.g = texture(uScene, vUv).g;
  col.b = texture(uScene, vUv - dir * ab).b;

  vec3 bloom =
    texture(uBloom0, vUv).rgb * uBloomWeights.x +
    texture(uBloom1, vUv).rgb * uBloomWeights.y +
    texture(uBloom2, vUv).rgb * uBloomWeights.z;

  // Atm\xF3sfera: gradiente profundo detr\xE1s del tejido.
  float radial = length(dir);
  vec3 atmosphere = mix(vec3(0.016, 0.026, 0.055), vec3(0.002, 0.004, 0.010), smoothstep(0.0, 0.75, radial));
  col += atmosphere;
  col += bloom * uBloomStrength;
  col *= uExposure;
  col = acesFilm(col);
  col = pow(max(col, vec3(0.0)), vec3(1.0 / 2.2));

  float vig = smoothstep(1.05, 0.25, length(dir) * 1.35);
  col *= mix(1.0, vig, uVignette);

  float grain = hash12(vUv * uResolution + vec2(uTime * 37.0, uTime * 53.0)) - 0.5;
  col += grain * uGrain;

  outColor = vec4(col, 1.0);
}
`;var vr=ze,br=`${pe}

in vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uPower;
uniform float uWarp;
uniform float uHue;
uniform float uSaturation;
uniform float uGlow;
uniform float uKick;
uniform float uSeed;
uniform int uSteps;
uniform int uIterations;

uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamForward;
uniform float uTanHalfFov;

uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uAudioAmount;

out vec4 outColor;

${Ze}

mat2 rot2(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float mandelbulb(vec3 p) {
  vec3 z = p;
  float dr = 1.0;
  float r = 0.0;
  float power = uPower + uAudioBass * uAudioAmount * 1.8 + uKick * 0.7;

  for (int i = 0; i < 8; i++) {
    if (i >= uIterations) break;
    r = length(z);
    if (r > 2.0) break;

    float theta = acos(clamp(z.z / r, -1.0, 1.0));
    float phi = atan(z.y, z.x);

    dr = pow(r, power - 1.0) * power * dr + 1.0;
    float zr = pow(r, power);
    theta *= power;
    phi *= power;

    z = zr * vec3(
      sin(theta) * cos(phi),
      sin(theta) * sin(phi),
      cos(theta)
    ) + p;
  }

  return 0.5 * log(max(r, 0.0001)) * r / max(dr, 0.0001);
}

float map(vec3 p) {
  vec3 q = p;

  // Simetr\xEDa rotacional + domain warp temporal.
  q.xz = rot2(uTime * 0.05 * uSpeed + uSeed) * q.xz;
  q.xy = rot2(sin(uTime * 0.07) * 0.18) * q.xy;
  q += (uWarp + uAudioMid * uAudioAmount * 0.9 + uAudioHigh * uAudioAmount * 0.45 + uKick * 0.04) * 0.10 * vec3(
    sin(q.y * 2.1 + uTime * 0.31),
    sin(q.z * 2.3 - uTime * 0.27),
    sin(q.x * 2.5 + uTime * 0.23)
  );

  return mandelbulb(q * 1.05) * 0.9;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0016, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / max(1.0, uResolution.y);

  vec3 ro = uCamPos;
  vec3 rd = normalize(
    uCamForward +
    uCamRight * uv.x * uTanHalfFov +
    uCamUp * uv.y * uTanHalfFov
  );

  float travel = 0.0;
  float dist = 1.0;
  int marched = 0;
  vec3 glow = vec3(0.0);
  vec3 glowColor = fluidColor(fract(uHue + 0.11), uSaturation);

  for (int i = 0; i < 128; i++) {
    if (i >= uSteps) break;
    vec3 p = ro + rd * travel;
    marched = i;
    dist = map(p);
    if (dist < 0.0015) break;

    // Aura volum\xE9trica: acumula luz alrededor de la superficie.
    float halo = exp(-dist * 5.5);
    glow += halo * 0.0022 * glowColor * (1.0 + uAudioHigh * uAudioAmount * 0.9);

    travel += dist * 0.92;
    if (travel > 12.0) break;
  }

  vec3 color;
  if (dist < 0.002 && travel < 12.0) {
    vec3 p = ro + rd * travel;
    vec3 n = calcNormal(p);

    vec3 lightDir = normalize(vec3(0.55, 0.9, 0.45));
    float diffuse = clamp(dot(n, lightDir), 0.0, 1.0);
    float rim = pow(1.0 - clamp(abs(dot(n, -rd)), 0.0, 1.0), 2.3);
    float pulse = 0.5 + 0.5 * sin(travel * 18.0 - uTime * 2.0 + uKick * 4.0);
    float spec = pow(clamp(dot(normalize(lightDir - rd), n), 0.0, 1.0), 42.0);

    // Oclusi\xF3n aproximada: cavidades profundas tardan m\xE1s en marchar.
    float ao = clamp(1.0 - float(marched) / float(uSteps), 0.0, 1.0);
    ao = 0.30 + 0.70 * ao;

    float hueT = fract(uHue + travel * 0.030 + n.y * 0.07 + uTime * 0.002);
    vec3 base = fluidColor(hueT, uSaturation);
    vec3 accent = fluidColor(fract(uHue + 0.10), min(1.0, uSaturation + 0.05));
    base = mix(base, accent, pow(rim, 1.4) * 0.55);

    color = base * (0.055 + diffuse * diffuse * 1.25 + rim * 1.7 + pulse * 0.12) * ao;
    color += vec3(0.72, 0.86, 1.0) * spec * 0.55;
    color += glow * 1.25;
    color *= 1.0 + uKick * 0.7 + uAudioRms * uAudioAmount * 0.4;
  } else {
    // Fondo: casi negro, con el aura volum\xE9trica del fractal.
    color = vec3(0.0015, 0.003, 0.008) + glow * 1.05;
  }

  color *= uGlow;
  outColor = vec4(color, 1.0);
}
`;var ba={speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},power:{type:"number",default:7.6,min:3,max:12,label:"Potencia",group:"Forma"},warp:{type:"number",default:.35,min:0,max:1.5,label:"Warp",group:"Forma"},detail:{type:"number",default:.55,min:0,max:1,label:"Detalle",group:"Forma"},hue:{type:"number",default:.58,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.85,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.95,min:.2,max:4,label:"Glow",group:"Apariencia"},bloom:{type:"number",default:.58,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.88,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:3,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:5,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},ga=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0});function va(e){let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]}function yr(e,t){return[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]]}var rn=class extends De{constructor(t,n={}){super(n),this.renderer=t,this.gl=t.gl,this.sceneFormat=Pe(this.gl,"rgba16f")?"rgba16f":"rgba8",this.sceneTarget=new ue(this.gl,{width:t.width,height:t.height,format:this.sceneFormat}),this.quad=lt(this.gl),this.program=new se(this.gl,vr,br,"math:raymarch"),this.lastAudio=ga,this.motion=new We,this.signals={body:0,mid:0,high:0,rms:0,kickPos:0,kickFlash:0},this.camera={pos:[0,0,3.4],right:[1,0,0],up:[0,1,0],forward:[0,0,-1]}}setAudioFeatures(t){this.lastAudio=t||ga}update(t,n=ga){super.update(t,n),this.lastAudio=n;let a=this.params,r=this.time,o=this.renderer.pointer||{x:0,y:0},s=a.audio>0&&n.enabled?a.audio:0,i=Z(),l=i.effects?.mathematicalForms||{},c=this.motion.update(t,n,i,"mathematicalForms",s),d=(n.bassBody||0)*s*Number(l.body??1),m=(n.midFlow||0)*s*Number(l.mid??1),f=(n.highShimmer||0)*s*Number(l.high??1),p=(n.rms||0)*s,u=c.kickPos*Number(l.kick??1);this.signals={body:d,mid:m,high:f,rms:p,kickPos:u,kickFlash:n.kickFlash||0};let b=3.35-u*Number(i.kick?.cameraDolly??.03)*8-d*.5+Math.sin(r*.1)*.16,v=r*.12*a.speed+c.flowPhase*.16+o.x*.25+(a.seed|0)*.013,h=Math.sin(r*.09)*1.6+o.y*.9+m*.4,g=[Math.cos(v)*b,h,Math.sin(v)*b],E=va([-g[0],-g[1]*.55,-g[2]]),M=va(yr(E,[0,1,0])),S=va(yr(M,E)),w=m*.42+(n.kickFlash||0)*.12,A=Math.cos(w),L=Math.sin(w),I=[M[0]*A+S[0]*L,M[1]*A+S[1]*L,M[2]*A+S[2]*L],z=[S[0]*A-M[0]*L,S[1]*A-M[1]*L,S[2]*A-M[2]*L];this.camera={pos:g,right:I,up:z,forward:E}}getDetail(){let n=this.renderer.quality.name==="lite"?-16:0,a=Math.round(56+this.params.detail*64)+n,r=4+Math.round(this.params.detail*2);return{steps:Math.max(32,Math.min(120,a)),iterations:Math.max(3,Math.min(6,r))}}render(){let t=this.gl,n=this.params,a=this.signals,r=this.getDetail();this.sceneTarget.bind(),t.disable(t.BLEND),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE);let o=this.camera;this.program.use().set("uResolution",[this.sceneTarget.width,this.sceneTarget.height]).set("uTime",this.time).set("uSpeed",n.speed).set("uPower",n.power).set("uWarp",n.warp).set("uHue",n.hue).set("uSaturation",n.saturation).set("uGlow",n.glow).set("uSeed",(n.seed|0)%1e3*.01).set("uSteps",r.steps).set("uIterations",r.iterations).set("uCamPos",o.pos).set("uCamRight",o.right).set("uCamUp",o.up).set("uCamForward",o.forward).set("uTanHalfFov",Math.tan(48*Math.PI/360)).set("uAudioBass",a.body).set("uAudioMid",a.mid).set("uAudioHigh",a.high).set("uAudioRms",a.rms).set("uKick",a.kickPos).set("uAudioAmount",1),this.quad.draw(),t.bindFramebuffer(t.FRAMEBUFFER,null)}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.42,bloomKnee:.25,exposure:t.exposure,vignette:.55,grain:.02,aberration:.016,time:this.time}}getSceneTarget(){return this.sceneTarget}onResize(t,n){this.sceneTarget&&this.sceneTarget.resize(t,n)}dispose(){this.program&&this.program.dispose(),this.quad&&this.quad.dispose(),this.sceneTarget&&this.sceneTarget.dispose(),this.program=null,this.quad=null,this.sceneTarget=null}};je(rn,"schema",ba);var xr=ze,Er=`${pe}
in vec2 vUv;

uniform sampler2D uPrev;
uniform vec2 uResolution;
uniform float uTime;
uniform float uDt;
uniform float uDecay;
uniform float uZoom;
uniform float uRotation;
uniform float uWarp;
uniform float uDensity;
uniform float uHue;
uniform float uSaturation;
uniform float uGlow;
uniform float uSeed;

uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uKick;
uniform float uAudioAmount;

out vec4 outColor;

${ct}
${Ze}

mat2 rot2(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 c = vUv - 0.5;
  float t = uTime;
  float a = uAudioAmount;

  vec3 previous = texture(uPrev, vUv).rgb;

  // Campo procedural: filamentos radiales deformados por ruido.
  vec2 q = c * (2.0 + uZoom * 0.6);
  q = rot2(t * 0.035 + uRotation * 0.4 + uSeed) * q;
  float f = fbm3(vec3(q * 1.7, t * 0.06), 4) + snoise(vec3(q * 4.0, t * 0.11)) * 0.35;
  q += uWarp * 0.09 * vec2(sin(q.y * 4.0 + t * 0.5), cos(q.x * 4.0 - t * 0.4));
  float r = length(q);

  float ring = 0.5 + 0.5 * sin(r * 19.0 - t * 1.25 + f * 5.0 + uAudioMid * a * 4.0);
  float filaments = pow(ring, 9.0);
  filaments *= 1.0 + uAudioBass * a * 0.9;
  filaments *= smoothstep(1.25, 0.1, r);
  filaments *= 0.4 + 0.6 * smoothstep(-0.4, 0.7, f);

  float glowMask = exp(-r * 2.8) * (0.08 + uAudioRms * a * 0.25);
  vec3 hueColor = fluidColor(fract(uHue + r * 0.22 + f * 0.08 + t * 0.004), uSaturation);
  vec3 emission = hueColor * (filaments * uDensity + glowMask * 0.04) * uGlow;
  emission *= 0.7 + uKick * 1.25 + uAudioHigh * a * 0.35;

  // El frame anterior se zoom-ea, rota y distorsiona suavemente.
  float zoom = 1.0 - uZoom * 0.0045 - uAudioBass * a * 0.006 - uKick * a * 0.008;
  float angle = uRotation * 0.006 + sin(t * 0.07) * 0.0015;
  vec2 warped = 0.5 + rot2(angle) * (c * zoom);
  warped += uWarp * 0.0012 * vec2(
    snoise(vec3(vUv * 3.0, t * 0.13)),
    snoise(vec3(vUv * 3.0 + 11.3, t * 0.11))
  );
  float aberration = 0.0009 + uAudioHigh * a * 0.0016;
  vec3 prev;
  prev.r = texture(uPrev, warped + c * aberration).r;
  prev.g = texture(uPrev, warped).g;
  prev.b = texture(uPrev, warped - c * aberration).b;

  vec3 color = prev * uDecay + emission;
  // Techo suave para evitar acumulaci\xF3n infinita.
  color = color / (1.0 + color * 0.55);
  color = min(color, vec3(2.2));

  outColor = vec4(color, 1.0);
}
`;var xa={speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},decay:{type:"number",default:.93,min:.7,max:.998,label:"Persistencia",group:"Forma"},zoom:{type:"number",default:.55,min:0,max:1,label:"Zoom",group:"Forma"},rotation:{type:"number",default:.45,min:-1,max:1,label:"Rotaci\xF3n",group:"Forma"},warp:{type:"number",default:.55,min:0,max:1.5,label:"Distorsi\xF3n",group:"Forma"},density:{type:"number",default:.3,min:.05,max:1.5,label:"Densidad",group:"Forma"},hue:{type:"number",default:.62,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.9,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.85,min:.2,max:4,label:"Glow",group:"Apariencia"},bloom:{type:"number",default:.7,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.95,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:3,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:9,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},ya=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0}),on=class extends De{constructor(t,n={}){super(n),this.renderer=t,this.gl=t.gl;let a=Pe(this.gl,"rgba16f")?"rgba16f":"rgba8";this.format=a,this.targets=[new ue(this.gl,{width:t.width,height:t.height,format:a}),new ue(this.gl,{width:t.width,height:t.height,format:a})],this.index=0,this.quad=lt(this.gl),this.program=new se(this.gl,xr,Er,"temporal:feedback"),this.lastAudio=ya,this.motion=new We,this.signals={body:0,mid:0,high:0,rms:0,kickPos:0,kickFlash:0},this._clearTargets()}_clearTargets(){let t=this.gl;for(let n of this.targets)n.bind(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);t.bindFramebuffer(t.FRAMEBUFFER,null)}setAudioFeatures(t){this.lastAudio=t||ya}update(t,n=ya){super.update(t,n),this.lastAudio=n,this.dt=t;let a=this.params,r=a.audio>0&&n.enabled?a.audio:0,o=Z(),s=o.effects?.temporalVeil||{},i=this.motion.update(t,n,o,"temporalVeil",r);this.signals={body:(n.bassBody||0)*r*Number(s.body??1),mid:(n.midFlow||0)*r*Number(s.mid??1),high:(n.highShimmer||0)*r*Number(s.high??1),rms:(n.rms||0)*r,kickPos:i.kickPos*Number(s.kick??1),kickFlash:(n.kickFlash||0)*Number(s.kick??1)}}render(){let t=this.gl,n=this.params,a=this.signals,r=this.targets[this.index],o=this.targets[1-this.index];o.bind(),t.disable(t.BLEND),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),this.program.use().set("uPrev",0).set("uResolution",[o.width,o.height]).set("uTime",this.time).set("uDt",Math.min(.05,this.dt||1/60)).set("uDecay",n.decay).set("uZoom",n.zoom*n.speed*(1+a.body*.7+a.kickPos*.5)).set("uRotation",n.rotation*n.speed*(1+a.mid*.7+a.kickFlash*.2)).set("uWarp",n.warp).set("uDensity",n.density*(1+a.body*.4+a.kickPos*.3)).set("uHue",n.hue).set("uSaturation",n.saturation).set("uGlow",n.glow).set("uSeed",(n.seed|0)%1e3).set("uAudioBass",a.body).set("uAudioMid",a.mid).set("uAudioHigh",a.high).set("uAudioRms",a.rms).set("uKick",a.kickPos).set("uAudioAmount",1),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,r.texture),this.quad.draw(),t.bindFramebuffer(t.FRAMEBUFFER,null),this.index=1-this.index}getSceneTarget(){return this.targets[this.index]}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.34,bloomKnee:.24,exposure:t.exposure,vignette:.62,grain:.018,aberration:.008,time:this.time}}onResize(t,n){for(let a of this.targets)a.resize(t,n);this._clearTargets()}dispose(){this.program&&this.program.dispose(),this.quad&&this.quad.dispose();for(let t of this.targets)t.dispose();this.program=null,this.quad=null,this.targets=[]}};je(on,"schema",xa);function fo(e,t,n,a){e.fillStyle="#04060a",e.fillRect(0,0,t,n);let r=t/2,o=n/2,s=Math.min(t,n)*.33,i=e.createRadialGradient(r,o,s*.1,r,o,s*1.7);i.addColorStop(0,"rgba(90, 190, 255, 0.30)"),i.addColorStop(1,"rgba(10, 20, 40, 0)"),e.fillStyle=i,e.fillRect(0,0,t,n),e.globalCompositeOperation="lighter";let l=56;for(let c=0;c<l;c++){let m=c/l*Math.PI*2,f=Math.sin(m*3+a*1.4)*.18+Math.sin(m*5-a)*.06,p=s*(.85+f),u=r+Math.cos(m)*p,x=o+Math.sin(m)*p*.8+Math.sin(m*2+a*1.1)*s*.18,b=190+Math.sin(m+a)*26,v=1.4+(Math.sin(m*4+a*2)*.5+.5)*2.2;e.fillStyle=`hsla(${b}, 90%, 68%, 0.55)`,e.beginPath(),e.arc(u,x,v,0,Math.PI*2),e.fill()}e.globalCompositeOperation="source-over"}function po(e,t,n,a){e.fillStyle="#04060a",e.fillRect(0,0,t,n);let r=t/2,o=n/2,s=Math.min(t,n)*.115;e.globalCompositeOperation="lighter";for(let i=0;i<3;i++){e.beginPath();for(let l=0;l<=180;l++){let c=l/180*Math.PI*2,d=1+Math.sin(c*6+a*1.3+i)*.08,m=r+(Math.sin(c)+2*Math.sin(2*c))*s*.62*d,f=o+(Math.cos(c)-2*Math.cos(2*c))*s*.62*d;l===0?e.moveTo(m,f):e.lineTo(m,f)}e.strokeStyle=`hsla(${205+i*18}, 85%, ${60+i*8}%, ${.5-i*.12})`,e.lineWidth=1.2+i*.8,e.stroke()}e.globalCompositeOperation="source-over"}function ho(e,t,n,a){e.fillStyle="#05040a",e.fillRect(0,0,t,n);let r=t/2,o=n/2,s=Math.min(t,n)*.42;e.globalCompositeOperation="lighter";for(let l=0;l<64;l++){let c=l/64*Math.PI*2+a*.15,d=.55+.45*Math.abs(Math.sin(c*4+a)),m=s*d*(.75+.25*Math.sin(c*7-a)),f=r+Math.cos(c)*m,p=o+Math.sin(c)*m*.9;e.fillStyle=`hsla(${250+Math.cos(c*3)*30}, 85%, 62%, 0.45)`,e.beginPath(),e.arc(f,p,1.6+d*2,0,Math.PI*2),e.fill()}let i=e.createRadialGradient(r,o,0,r,o,s);i.addColorStop(0,"rgba(140,120,255,0.28)"),i.addColorStop(1,"rgba(20,10,40,0)"),e.fillStyle=i,e.fillRect(0,0,t,n),e.globalCompositeOperation="source-over"}function go(e,t,n,a){e.fillStyle="#030408",e.fillRect(0,0,t,n);let r=t/2,o=n/2;e.globalCompositeOperation="lighter";for(let s=0;s<12;s++){let i=s/12*Math.min(t,n)*.46;e.beginPath(),e.arc(r,o,i,a*.5+s*.5,a*.5+s*.5+2.2),e.strokeStyle=`hsla(${190+s*9}, 85%, 60%, ${.55-s*.03})`,e.lineWidth=1+s%3*.7,e.stroke()}e.globalCompositeOperation="source-over"}var Ht={fluidFields:{label:"Fluid Fields",family:"fluid",schema:pa,create:(e,t)=>new nn(e,t),preview:fo},organicStructures:{label:"Organic Structures",family:"organic",schema:ha,create:(e,t)=>new an(e,t),preview:po},mathematicalForms:{label:"Mathematical Forms",family:"mathematical",schema:ba,create:(e,t)=>new rn(e,t),preview:ho},temporalVeil:{label:"Temporal Veil",family:"temporal",schema:xa,create:(e,t)=>new on(e,t),preview:go}};function X(e){return Object.prototype.hasOwnProperty.call(Ht,e)}function wr(e,t,n){let a=Ht[e];if(!a)throw new Error(`Efecto GPU desconocido: ${e}`);return a.create(t,n)}function Sr({targetFps:e=60,fpsCounter:t,onFrame:n}){let a=0,r=0,o=1e3/e,s=!1;function i(l){if(!s)return;let c=document.visibilityState==="visible",d=c?o:200,m=0;if(r>0&&(m=l-r,t&&t.tick(m)),r=l,c){An(m>0?m/1e3:1/60);try{n({now:l,fpsCounter:t,audio:ee()})}catch(f){console.error("renderLoop frame error:",f)}}a=requestAnimationFrame(i)}return{start(){s||(s=!0,r=0,a=requestAnimationFrame(i))},stop(){s=!1,a&&cancelAnimationFrame(a),a=0},isRunning(){return s}}}function Pn(){let e=new Float32Array(60),t=0,n=0,a=0,r=0;return{tick(o){r=o,a=o>0?1e3/o:0,e[t]=o,t=(t+1)%60,n<60&&n++},getInstant(){return a},getFrameMs(){return r},getAvg(){if(n===0)return 0;let o=0;for(let i=0;i<n;i++)o+=e[i];let s=o/n;return s>0?1e3/s:0},getLow1Percent(){if(n===0)return 0;let o=Array.from(e.subarray(0,n)).sort((l,c)=>c-l),s=Math.max(0,Math.floor(o.length*.01)-1),i=o[s];return i>0?1e3/i:0},reset(){t=0,n=0,a=0,r=0}}}var vo=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,Ln=null;function Ea(){if(Ln)return Ln;let e=navigator.userAgent||"",t=vo.test(e),n="ontouchstart"in window&&window.innerWidth<=1024,a=navigator.hardwareConcurrency||4,r=navigator.deviceMemory||null,o=navigator.connection?.saveData||!1,s=t||n,i;return o?i=!0:typeof r=="number"?i=r<4||a<4:i=a<4||s,Ln={hardwareConcurrency:a,deviceMemory:r,isMobile:s,isLiteRecommended:i,saveData:o,dpr:Math.min(window.devicePixelRatio||1,s?1:1.5)},Ln}function Ue(){try{let e=localStorage.getItem("umbral-vision:lite-mode");if(e==="on")return!0;if(e==="off")return!1}catch{}return Ea().isLiteRecommended}function Mr(e){try{localStorage.setItem("umbral-vision:lite-mode",e?"on":"off")}catch{}try{window.dispatchEvent(new CustomEvent("uv:lite-mode",{detail:{lite:!!e}}))}catch{}}var Ar={lite:{name:"lite",particleSize:128,maxDpr:1,renderScale:.7,minRenderScale:.5,bloomMips:1,bloomQuality:5,simSteps:1,trailLength:1,targetFrameMs:22,minFrameMs:12},high:{name:"high",particleSize:256,maxDpr:1.5,renderScale:.9,minRenderScale:.55,bloomMips:2,bloomQuality:9,simSteps:1,trailLength:1.35,targetFrameMs:19,minFrameMs:11},ultra:{name:"ultra",particleSize:512,maxDpr:2,renderScale:1,minRenderScale:.6,bloomMips:3,bloomQuality:11,simSteps:1,trailLength:1.6,targetFrameMs:15,minFrameMs:8}};function wa(e){return Ar[e]||Ar.high}function Sa(e){let t=e.renderScale,n=0,a=0;return{get scale(){return t},reset(){t=e.renderScale,n=0,a=0},sample(r){if(!Number.isFinite(r)||r<=0)return!1;r>e.targetFrameMs?(n++,a=0):r<e.minFrameMs?(a++,n=0):(n=0,a=0);let o=t;return n>=45&&t>e.minRenderScale?(o=Math.max(e.minRenderScale,t-.1),n=0):a>=180&&t<1&&(o=Math.min(1,t+.05),a=0),o!==t?(t=o,!0):!1}}}var _n=class{constructor(t={}){this.container=t.container||null,this.quality=wa(t.quality||"high"),this.adaptive=Sa(this.quality),this.onScaleChange=t.onScaleChange||null,this.pointer={x:0,y:0},this.frameMs=0,this.fps=0,this.cpuMs=0,this.contextLost=!1,this.disposed=!1,this.canvas=t.canvas||document.createElement("canvas"),this.canvas.className="uv-engine-canvas",this.canvas.style.position="absolute",this.canvas.style.inset="0",this.canvas.style.width="100%",this.canvas.style.height="100%",this.canvas.style.display="block",this.canvas.style.pointerEvents="none",this.canvas.style.zIndex="0",this.canvas.setAttribute("aria-hidden","true"),this.container&&this.canvas.parentNode!==this.container&&this.container.appendChild(this.canvas);let n=this.canvas.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!0,desynchronized:!0});if(!n)throw this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas),new Error("WebGL 2 no est\xE1 disponible en este navegador");this.gl=n,this.refreshExtensions(),n.disable(n.DEPTH_TEST),n.disable(n.CULL_FACE),n.clearColor(0,0,0,1),this._onResize=()=>this.resize(),this._onPointer=a=>{this.pointer.x=a.clientX/Math.max(1,window.innerWidth)*2-1,this.pointer.y=-(a.clientY/Math.max(1,window.innerHeight)*2-1)},window.addEventListener("resize",this._onResize),window.addEventListener("pointermove",this._onPointer,{passive:!0}),this._lastFrameTime=0,this.resize()}refreshExtensions(){let t=this.gl;t&&(this.extFloat=t.getExtension("EXT_color_buffer_float"),this.extHalfFloat=t.getExtension("EXT_color_buffer_half_float"),this.extFloatLinear=t.getExtension("OES_texture_float_linear"),t.getExtension("OES_texture_half_float_linear"))}get width(){return this.canvas.width}get height(){return this.canvas.height}get output(){return{width:this.canvas.width,height:this.canvas.height}}get aspect(){return this.canvas.width/Math.max(1,this.canvas.height)}_cssSize(){if(this.container){let t=this.container.getBoundingClientRect();if(t.width>0&&t.height>0)return{width:t.width,height:t.height};if(this.container.clientWidth>0&&this.container.clientHeight>0)return{width:this.container.clientWidth,height:this.container.clientHeight}}return{width:window.innerWidth||1,height:window.innerHeight||1}}resize(){if(this.disposed)return!1;let{width:t,height:n}=this._cssSize(),r=Math.min(window.devicePixelRatio||1,this.quality.maxDpr)*this.adaptive.scale,o=Math.max(2,Math.round(t*r)),s=Math.max(2,Math.round(n*r));return this.cssWidth=t,this.cssHeight=n,o===this.canvas.width&&s===this.canvas.height?!1:(this.canvas.width=o,this.canvas.height=s,this.gl.viewport(0,0,o,s),this.onScaleChange&&this.onScaleChange(o,s),!0)}setQuality(t){let n=wa(t);return n.name===this.quality.name?!1:(this.quality=n,this.adaptive=Sa(n),this.resize(),!0)}sampleFrame(t){return!Number.isFinite(t)||t<=0?!1:(this.frameMs=this.frameMs===0?t:this.frameMs*.9+t*.1,this.fps=1e3/Math.max(1,this.frameMs),this.adaptive.sample(t)?this.resize():!1)}beginFrame(){let t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),t.clear(t.COLOR_BUFFER_BIT)}getStats(){return{fps:Math.round(this.fps*10)/10,frameMs:Math.round(this.frameMs*100)/100,cpuMs:Math.round(this.cpuMs*100)/100,width:this.canvas.width,height:this.canvas.height,cssWidth:this.cssWidth,cssHeight:this.cssHeight,scale:Math.round(this.adaptive.scale*100)/100,quality:this.quality.name}}dispose(){if(this.disposed)return;this.disposed=!0,window.removeEventListener("resize",this._onResize),window.removeEventListener("pointermove",this._onPointer),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);let t=this.gl.getExtension("WEBGL_lose_context");t&&t.loseContext(),this.gl=null}};var ql=Object.freeze(["keep","merge","refactor","retire"]),In=Object.freeze({fluidFields:{decision:"keep",family:"fluidFields",variant:"membrane",classic:!1,reason:"T\xE9cnica GPU propia y buena base de variantes."},organicStructures:{decision:"keep",family:"organicStructures",variant:"knot",classic:!1,reason:"Mesh 3D con Fresnel y silueta propia."},mathematicalForms:{decision:"keep",family:"mathematicalForms",variant:"mandelbulb",classic:!1,reason:"Raymarch + SDF con alto techo visual."},temporalVeil:{decision:"refactor",family:"temporalSystems",variant:"veil",classic:!1,reason:"Base del feedback global y de la familia temporal."},tunnel:{decision:"refactor",family:"kineticGeometry",variant:"tunnel",classic:!0,reason:"Concepto de t\xFAnel reutilizable como variante geom\xE9trica."},spiral:{decision:"refactor",family:"kineticGeometry",variant:"spiral",classic:!0,reason:"Espiral cl\xE1sica; variante de geometr\xEDa cin\xE9tica."},mandala:{decision:"refactor",family:"kineticGeometry",variant:"mandala",classic:!0,reason:"Simetr\xEDa radial; variante de geometr\xEDa cin\xE9tica."},particles:{decision:"merge",family:"fluidFields",variant:"swarm",classic:!0,reason:"Se solapa con Fluid Fields; queda como variante y cl\xE1sico."},waves:{decision:"refactor",family:"wavesAndFields",variant:"waves",classic:!0,reason:"Base de la familia de ondas y campos."},fractal:{decision:"refactor",family:"fractalGrowth",variant:"tree",classic:!0,reason:"Recursi\xF3n ramificada; base de crecimiento fractal."},matrix:{decision:"retire",family:"classics",variant:"matrix",classic:!0,reason:"Referencia literal; no es una familia visual."},glitch:{decision:"retire",family:"classics",variant:"glitch",classic:!0,reason:"Su valor es post-proceso/transici\xF3n, no una familia."},melt:{decision:"retire",family:"classics",variant:"melt",classic:!0,reason:"Efecto puntual fuera de la taxonom\xEDa principal."},fractalGlitch:{decision:"merge",family:"fractalGrowth",variant:"glitch",classic:!0,reason:"Duplicaba el fractal con interferencias."},waveGlitch:{decision:"merge",family:"wavesAndFields",variant:"glitch",classic:!0,reason:"Duplicaba las ondas con interferencias."},sacredGeometry:{decision:"merge",family:"kineticGeometry",variant:"sacred",classic:!0,reason:"Casi id\xE9ntico a mandala; variante sagrada."},biomech:{decision:"refactor",family:"organicStructures",variant:"biomech",classic:!0,reason:"Estructura org\xE1nica; variante de Organic Structures."},dune:{decision:"merge",family:"wavesAndFields",variant:"dunes",classic:!0,reason:"Ondas + geometr\xEDa; variante de dunas."},yinYang:{decision:"retire",family:"classics",variant:"yinYang",classic:!0,reason:"S\xEDmbolo \xFAnico, no una familia."}});function W(e,t,n,a=!1){return{label:e,effect:t,structural:n,implemented:a}}var Se=Object.freeze({fluidFields:{id:"fluidFields",label:"Fluid Fields",description:"Tejido de part\xEDculas y membranas vivas.",renderer:"webgl",effect:"fluidFields",defaultVariant:"membrane",variants:{membrane:W("Membrana","fluidFields",{topology:"open-cylinder",folds:3},!0),torus:W("Toro","fluidFields",{topology:"torus",folds:0},!0),ribbon:W("Cinta","fluidFields",{topology:"twisted-ribbon",folds:2},!0),smoke:W("Humo","fluidFields",{topology:"volume",folds:5}),swarm:W("Enjambre","fluidFields",{topology:"free-swarm",folds:0})}},organicStructures:{id:"organicStructures",label:"Organic Structures",description:"Membranas topol\xF3gicas transl\xFAcidas y volumen real.",renderer:"webgl",effect:"organicStructures",defaultVariant:"knot",variants:{knot:W("Nudo","organicStructures",{topology:"torus-knot",shell:"translucent"},!0),cell:W("C\xE9lula","organicStructures",{topology:"cell",shell:"membrane"}),coral:W("Coral","organicStructures",{topology:"coral",shell:"branched"}),biomech:W("Biomech","organicStructures",{topology:"biomech",shell:"segmented"})}},mathematicalForms:{id:"mathematicalForms",label:"Mathematical Forms",description:"Formas matem\xE1ticas volum\xE9tricas por ray marching.",renderer:"webgl",effect:"mathematicalForms",defaultVariant:"mandelbulb",variants:{mandelbulb:W("Mandelbulb","mathematicalForms",{surface:"mandelbulb",symmetry:"radial"},!0),knot:W("Nudo SDF","mathematicalForms",{surface:"torus-knot",symmetry:"none"}),lattice:W("Ret\xEDcula","mathematicalForms",{surface:"lattice",symmetry:"cubic"}),orb:W("Orbe","mathematicalForms",{surface:"sphere",symmetry:"radial"})}},temporalSystems:{id:"temporalSystems",label:"Temporal Systems",description:"Estelas, acumulaci\xF3n y memoria visual.",renderer:"webgl",effect:"temporalVeil",defaultVariant:"veil",variants:{veil:W("Velo","temporalVeil",{feedback:"warp",emitters:"filaments"},!0),echo:W("Eco","temporalVeil",{feedback:"echo",emitters:"rings"}),smear:W("Smear","temporalVeil",{feedback:"directional",emitters:"streaks"}),tunnel:W("T\xFAnel temporal","temporalVeil",{feedback:"zoom",emitters:"tunnel"})}},kineticGeometry:{id:"kineticGeometry",label:"Kinetic Geometry",description:"Geometr\xEDa cin\xE9tica: t\xFAneles, espirales y simetr\xEDas radiales.",renderer:"p5",effect:"tunnel",defaultVariant:"tunnel",variants:{tunnel:W("T\xFAnel","tunnel",{symmetry:"radial",motif:"ellipses"},!0),spiral:W("Espiral","spiral",{symmetry:"spiral",motif:"dots"},!0),mandala:W("M\xE1ndala","mandala",{symmetry:"radial",motif:"petals"},!0),sacred:W("Sagrada","sacredGeometry",{symmetry:"radial",motif:"polygons"},!0),flower:W("Flor","mandala",{symmetry:"radial",motif:"flower"})}},wavesAndFields:{id:"wavesAndFields",label:"Waves & Fields",description:"Ondas, dunas e interferencias sobre el plano.",renderer:"p5",effect:"waves",defaultVariant:"waves",variants:{waves:W("Olas","waves",{field:"sine-lines",motif:"layered"},!0),glitch:W("Olas Glitch","waveGlitch",{field:"sine-distorted",motif:"glitch"},!0),dunes:W("Dunas","dune",{field:"dunes",motif:"sand"},!0),interference:W("Interferencia","waves",{field:"interference",motif:"ripples"})}},fractalGrowth:{id:"fractalGrowth",label:"Fractal Growth",description:"Crecimiento recursivo y estructuras ramificadas.",renderer:"p5",effect:"fractal",defaultVariant:"tree",variants:{tree:W("\xC1rbol","fractal",{growth:"recursive-tree",motif:"branches"},!0),glitch:W("\xC1rbol Glitch","fractalGlitch",{growth:"recursive-tree",motif:"glitch"},!0),coral:W("Coral","biomech",{growth:"radial",motif:"coral"}),tendril:W("Tendril","biomech",{growth:"radial",motif:"tendrils"})}},classics:{id:"classics",label:"Cl\xE1sicos",description:"Efectos hist\xF3ricos conservados fuera de la taxonom\xEDa principal.",renderer:"p5",effect:"matrix",defaultVariant:"matrix",variants:{matrix:W("Matrix","matrix",{motif:"code-rain"},!0),glitch:W("Glitch","glitch",{motif:"scanlines"},!0),melt:W("Melt","melt",{motif:"dripping"},!0),yinYang:W("Yin Yang","yinYang",{motif:"symbol"},!0)}}}),bo=Object.freeze(Object.keys(Se));function $t(e){return Object.prototype.hasOwnProperty.call(Se,e)?Se[e]:null}function mt(e){let t=In[e];if(t)return t.family;for(let n of Object.values(Se)){if(n.effect===e)return n.id;for(let a of Object.values(n.variants))if(a.effect===e)return n.id}return null}function Ge(e){let t=In[e];return t?t.variant:"default"}function Mt(e,t){let n=$t(e);if(!n)return null;let a=t&&n.variants[t]?t:n.defaultVariant,r=n.variants[a];return{family:n,variantId:a,entry:r,effect:r.effect||n.effect}}function jt({includeClassics:e=!0}={}){return bo.filter(t=>e||t!=="classics").map(t=>Se[t])}function Tr(){return Object.keys(In).filter(e=>In[e].decision==="retire")}function yo(e,t){let n=$t(e);if(!n)return 0;let r=Object.keys(n.variants).indexOf(t);return r<0?0:r}function xo(e,t){let n=$t(e);if(!n)return null;let a=Object.keys(n.variants);return a[Math.max(0,Math.min(a.length-1,Number(t)|0))]||n.defaultVariant}function Fr(e,t){let n=mt(e);return n?yo(n,t||Ge(e)):0}function Rr(e,t){let n=mt(e);return n?xo(n,t):Ge(e)}var kr=Object.freeze(["dissolve","luma","zoom","wipe","feedback"]),Xl=Object.freeze(["smooth","cubic","expo","linear"]),Pr=Object.freeze({dissolve:"Disolver",luma:"Luz",zoom:"Zoom",wipe:"Barrido",feedback:"Feedback"});function Ma(e,t,n){return Math.min(n,Math.max(t,e))}function Lr(e,t){let n=Ma(Number(t)||0,0,1);switch(e){case"linear":return n;case"cubic":return n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2;case"expo":return n===0?0:n===1?1:n<.5?Math.pow(2,20*n-10)/2:(2-Math.pow(2,-20*n+10))/2;case"smooth":default:return n*n*(3-2*n)}}function _r(e){switch(e){case"luma":return 1;case"zoom":return 2;case"wipe":return 3;case"feedback":return 1;default:return 0}}function Ir(e){switch(e){case"cubic":return"cubic-bezier(0.22, 0.8, 0.25, 1)";case"expo":return"cubic-bezier(0.16, 1, 0.3, 1)";case"linear":return"linear";case"smooth":default:return"ease-in-out"}}function Cr(e){return e?.effect?mt(e.effect):null}function Br(e={}){let t=Number.isFinite(e.seed)?e.seed>>>0:null,n=e.random||(t!=null?Oe(t):Math.random),a=Cr(e.from),r=Cr(e.to),o=!!(a&&r&&a===r),s=e.sameBackend!==!1,i=e.audio||{},l=Ma((Number(i.level)||0)*.45+(Number(i.kickFlash)||0)*.35+(Number(i.bassFast)||0)*.2,0,1),c;s?o?c=["dissolve","zoom","luma"]:c=["zoom","wipe","luma","feedback","dissolve"]:c=["luma","dissolve","wipe"];let d=c.filter(h=>h!==e.lastType),m=d.length?d:c,f=m[Math.min(m.length-1,Math.floor(n()*m.length))],p=o?1500:s?2100:1400,u=o?700:s?1400:600,x=p+n()*u;x*=1-l*.24,x=Math.round(Ma(x,900,3800));let b=f==="zoom"||f==="feedback"?"cubic":f==="wipe"?"expo":"smooth",v=n()*Math.PI*2;return{type:f,durationMs:x,easing:b,direction:[Math.cos(v),Math.sin(v)],seed:Math.floor(n()*2147483647),sameFamily:o,sameBackend:s,energy:Math.round(l*100)/100}}function Nr(e){return e==="feedback"||e==="feedback-smear"?{amount:.2,decay:.025,zoom:.4}:e==="zoom"?{amount:.08,decay:.01,zoom:.2}:null}var Dr={1:[1,0,0],2:[.62,.38,0],3:[.5,.3,.2]},Bn=class{constructor(t,n,a={}){this.gl=t,this.quad=n,this.mips=Math.max(1,Math.min(3,a.mips||2)),this.format=a.hdr?"rgba16f":"rgba8",this.bloomQuality=a.bloomQuality||9,this.bright=new se(t,ze,mr,"post:bright"),this.blur=new se(t,ze,dr,"post:blur"),this.copy=new se(t,ze,hr,"post:copy"),this.mix=new se(t,ze,fr,"post:mix"),this.feedback=new se(t,ze,pr,"post:feedback"),this.composite=new se(t,ze,gr,"post:composite"),this.levels=[],this.mixTarget=null,this.feedbackTargets=[],this.feedbackIndex=0,this.width=0,this.height=0,this.disposed=!1}resize(t,n){if(t=Math.max(1,t|0),n=Math.max(1,n|0),t===this.width&&n===this.height)return;this.width=t,this.height=n;for(let l of this.levels)l.a.dispose(),l.b.dispose();this.levels=[],this.mixTarget&&this.mixTarget.dispose(),this.mixTarget=new ue(this.gl,{width:t,height:n,format:this.format});for(let l of this.feedbackTargets)l.dispose();let a=Math.max(1,t>>1),r=Math.max(1,n>>1);this.feedbackTargets=[new ue(this.gl,{width:a,height:r,format:this.format}),new ue(this.gl,{width:a,height:r,format:this.format})],this.feedbackIndex=0;let o=this.gl;for(let l of this.feedbackTargets)l.bind(),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT);o.bindFramebuffer(o.FRAMEBUFFER,null);let s=Math.max(1,t>>1),i=Math.max(1,n>>1);for(let l=0;l<this.mips;l++)this.levels.push({a:new ue(this.gl,{width:s,height:i,format:this.format}),b:new ue(this.gl,{width:s,height:i,format:this.format}),width:s,height:i}),s=Math.max(1,s>>1),i=Math.max(1,i>>1)}render(t,n,a={},r=null,o=1){let s=this.gl;if(this.levels.length===0)return;r&&this.mixTarget&&(this.mixTarget.bind(),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),this.mix.use().set("uSceneA",0).set("uSceneB",1).set("uMix",Math.max(0,Math.min(1,o))).set("uMode",_r(a.transitionType||"dissolve")).set("uDirection",a.transitionDirection||[1,0]).set("uSeed",Number(a.transitionSeed)||0),this._bindTexture(t.texture,0),this._bindTexture(r.texture,1),this.quad.draw(),t=this.mixTarget);let i=Math.max(0,Math.min(1,Number(a.feedback??0)));if(i>0&&this.feedbackTargets.length===2){let p=this.feedbackTargets[this.feedbackIndex],u=this.feedbackTargets[1-this.feedbackIndex];u.bind(),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT),this.feedback.use().set("uScene",0).set("uPrev",1).set("uResolution",[u.width,u.height]).set("uTime",a.time??0).set("uFeedback",i).set("uDecay",Math.max(.5,Math.min(.999,Number(a.feedbackDecay??.92)))).set("uZoom",Number(a.feedbackZoom??.5)).set("uRotation",Number(a.feedbackRotation??.3)).set("uWarp",Number(a.feedbackWarp??.5)),this._bindTexture(t.texture,0),this._bindTexture(p.texture,1),this.quad.draw(),t=u,this.feedbackIndex=1-this.feedbackIndex}s.disable(s.DEPTH_TEST),s.disable(s.BLEND),s.disable(s.CULL_FACE),this.levels[0].a.bind(),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),this.bright.use().set("uScene",0).set("uThreshold",a.bloomThreshold??.55).set("uKnee",a.bloomKnee??.25).set("uIntensity",1),this._bindTexture(t.texture,0),this.quad.draw();for(let p=0;p<this.levels.length;p++){let u=this.levels[p];if(p>0){let v=this.levels[p-1];u.a.bind(),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),this.copy.use().set("uSource",0),this._bindTexture(v.a.texture,0),this.quad.draw()}let x=1/u.width,b=1/u.height;u.b.bind(),s.clear(s.COLOR_BUFFER_BIT),this.blur.use().set("uSource",0).set("uDirection",[x*1.4,0]).set("uQuality",this.bloomQuality),this._bindTexture(u.a.texture,0),this.quad.draw(),u.a.bind(),s.clear(s.COLOR_BUFFER_BIT),this.blur.use().set("uSource",0).set("uDirection",[0,b*1.4]).set("uQuality",this.bloomQuality),this._bindTexture(u.b.texture,0),this.quad.draw()}s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,n.width,n.height),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT);let c=Dr[this.levels.length]||Dr[1],d=this.levels[0]?.a,m=this.levels[1]?.a||d,f=this.levels[2]?.a||m;this.composite.use().set("uScene",0).set("uBloom0",1).set("uBloom1",2).set("uBloom2",3).set("uBloomWeights",c).set("uBloomStrength",a.bloomStrength??.9).set("uExposure",a.exposure??1).set("uVignette",a.vignette??.55).set("uGrain",a.grain??.035).set("uAberration",a.aberration??.012).set("uTime",a.time??0).set("uResolution",[n.width,n.height]),this._bindTexture(t.texture,0),this._bindTexture(d?.texture??null,1),this._bindTexture(m?.texture??null,2),this._bindTexture(f?.texture??null,3),this.quad.draw()}_bindTexture(t,n){let a=this.gl;a.activeTexture(a.TEXTURE0+n),a.bindTexture(a.TEXTURE_2D,t)}dispose(){if(!this.disposed){this.disposed=!0;for(let t of this.levels)t.a.dispose(),t.b.dispose();this.levels=[],this.mixTarget&&this.mixTarget.dispose(),this.mixTarget=null;for(let t of this.feedbackTargets)t.dispose();this.feedbackTargets=[],this.bright.dispose(),this.blur.dispose(),this.copy.dispose(),this.mix.dispose(),this.feedback.dispose(),this.composite.dispose()}}};var Fa=2,Eo=Object.freeze(["manual","generated","mutated"]),Aa=Object.freeze({mode:"procedural",hue:.56,saturation:.9}),dt=Object.freeze({bloom:.85,exposure:.98,vignette:.55,grain:.028,aberration:.014,feedback:.25,feedbackDecay:.92}),wo=Object.freeze({enabled:!0,rates:{hue:.01,warp:.015}}),Ta=0;function xe(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function So(e){return e==null?e:JSON.parse(JSON.stringify(e))}function et(e,t,n){return Math.min(n,Math.max(t,e))}function Ve(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function ft(){try{let e=globalThis.crypto;if(e&&typeof e.getRandomValues=="function"){let t=new Uint32Array(1);return e.getRandomValues(t),t[0]>>>0}}catch{}return Math.random()*4294967295>>>0}function pt(e="sc"){Ta=(Ta+1)%16777215;let t=Math.random().toString(36).slice(2,7);return`${e}_${Date.now().toString(36)}_${Ta.toString(36)}_${t}`}function Mo(e){let t=xe(e)?e:{};return{...Aa,...t,hue:et(Ve(t.hue,Aa.hue),0,1),saturation:et(Ve(t.saturation,Aa.saturation),0,1)}}function Ao(e){let t=xe(e)?e:{},n={...dt,...t};return n.bloom=et(Ve(n.bloom,dt.bloom),0,3),n.exposure=et(Ve(n.exposure,dt.exposure),.1,3),n.vignette=et(Ve(n.vignette,dt.vignette),0,1),n.grain=et(Ve(n.grain,dt.grain),0,.2),n.aberration=et(Ve(n.aberration,dt.aberration),0,.1),n.feedback=et(Ve(n.feedback,dt.feedback),0,1),n.feedbackDecay=et(Ve(n.feedbackDecay,dt.feedbackDecay),.5,.999),n}function To(e){let t=xe(e)?e:{},n=xe(t.rates)?t.rates:{};return{enabled:t.enabled!==!1,rates:{...wo.rates,...n}}}function Fo(e){if(!e||!xe(e))return null;let t=Ve(e.timeOffset,0);return{timeOffset:Math.max(0,t)}}function D(e={}){let t=String(e.effect||"fluidFields"),n=String(e.variant||Ge(t)),a=Math.max(0,Math.floor(Ve(e.seed??e.params?.seed,1)))>>>0,r=new Date().toISOString(),o=Eo.includes(e.origin)?e.origin:"manual";return{schemaVersion:Fa,id:String(e.id||pt()),name:String(e.name||""),createdAt:e.createdAt||r,updatedAt:e.updatedAt||r,origin:o,parentId:e.parentId?String(e.parentId):null,effect:t,variant:n,seed:a,params:xe(e.params)?So(e.params):{},palette:Mo(e.palette),post:Ao(e.post),drift:To(e.drift),moment:Fo(e.moment),tags:Array.isArray(e.tags)?e.tags.map(String):[],favorite:!!e.favorite}}function ht(e){if(!xe(e))throw new Error("Escena inv\xE1lida: se esperaba un objeto");if(e.scene&&xe(e.scene))return ht(e.scene);if(!e.state&&!e.effect)throw new Error("Escena inv\xE1lida: falta effect");if(e.state&&xe(e.state))return sn(e.state,{id:e.id,name:e.name,createdAt:e.createdAt});let t=Number(e.schemaVersion??1);if(t>Fa)throw new Error(`schemaVersion ${t} no soportada (m\xE1xima ${Fa})`);return D(e)}function sn(e={},t={}){let n=e.effect||"fluidFields",a=xe(e.params)?e.params:{},r=e.variant||xe(e.scene)&&e.scene.variant||Ge(n),o=e.seed??a.seed??(xe(e.scene)?e.scene.seed:void 0),s=xe(e.scene)?e.scene:{};return D({...s,effect:n,variant:r,seed:o,params:a,id:t.id||s.id,name:t.name||s.name,createdAt:t.createdAt||s.createdAt,origin:s.origin||"manual",parentId:s.parentId||null,palette:s.palette,post:s.post,drift:s.drift,moment:s.moment,tags:s.tags,favorite:s.favorite})}function Nn(e){let t=D(e);return{...t.params,seed:t.seed}}function Ro(e){let t=globalThis.TextEncoder,n=new t().encode(e),a="",r=32768;for(let l=0;l<n.length;l+=r)a+=String.fromCharCode(...n.subarray(l,l+r));let o=globalThis.btoa,s=globalThis.Buffer;return(typeof o=="function"?o(a):s.from(a,"binary").toString("base64")).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function Co(e){let t=String(e).replace(/-/g,"+").replace(/_/g,"/"),n=t+"=".repeat((4-t.length%4)%4),a=globalThis.atob,r=globalThis.Buffer,o=typeof a=="function"?a(n):r.from(n,"base64").toString("binary"),s=Uint8Array.from(o,l=>l.charCodeAt(0)),i=globalThis.TextDecoder;return new i().decode(s)}function Or(e){let t=D(e),n={e:t.effect,r:t.variant,s:t.seed,p:t.params,l:t.palette,o:t.post,d:t.drift,m:t.moment,n:t.name||void 0};return Ro(JSON.stringify(n))}function zr(e){if(!e)return null;try{let t=JSON.parse(Co(e));return!xe(t)||!t.e?null:D({effect:t.e,variant:t.r,seed:t.s,params:t.p,palette:t.l,post:t.o,drift:t.d,moment:t.m,name:t.n})}catch{return null}}var Ra="fluidFields";function ko(e){return!Number.isFinite(e)||e<=0?1/60:Math.min(e,.05)}function Po(e){return e&&e!=="auto"?e:Ue()?"lite":"high"}function Lo(e,t=Math.random){return e==="auto"?1500+t()*2500:Math.max(0,Number(e)||0)}function Ur(e={}){let{container:t=null,canvas:n=null,autoStart:a=!0,effectName:r=Ra,params:o={},onStats:s=null}=e,i=Po(e.quality),l=Pn(),c=null,d=null,m=null,f=null,p=null,u=null,x=null,b=null,v=!1,h=0,g=0,E=!1,M=0,S={},w={};function A(){m&&(m.dispose(),m=null),d||(d=lt(c.gl));let F=Pe(c.gl,"rgba16f");m=new Bn(c.gl,d,{mips:c.quality.bloomMips,hdr:F,bloomQuality:c.quality.bloomQuality}),m.resize(c.width,c.height)}function L(F,k){let N=wr(F,c,k||o);return N.initialize(),N.onResize(c.width,c.height),N}function I(F,k){f&&(f.dispose(),f=null),p&&(p.dispose(),p=null),u=null,A(),x=F,f=L(F,k)}function z(F){if(!v)return;if(h=requestAnimationFrame(z),document.visibilityState==="hidden"){g=F;return}let k=g===0?16.67:F-g;g=F,l.tick(k);let N=ko(k/1e3);An(N);let le=ke(),ce=typeof performance<"u"?performance.now():Date.now();try{G(N,le)}catch(we){console.error("UmbralEngine frame error:",we),C();return}let J=typeof performance<"u"?performance.now():Date.now();c.cpuMs=J-ce,c.sampleFrame(k)&&(f.onResize(c.width,c.height),p&&p.onResize(c.width,c.height)),s&&F-M>500&&(M=F,s(He()))}function G(F,k=ke()){let N=1;if(p&&u){u.elapsed+=F;let Kt=Math.min(1,u.elapsed/Math.max(.001,u.duration));N=Lr(u.easing||"smooth",Kt),p.setAudioFeatures?.(k),p.update(F,k),p.render(c)}f.setAudioFeatures?.(k),f.update(F,k),f.render(c);let le=p?p.getSceneTarget():null,ce=f.getSceneTarget(),J=f.getPostParams(),ne=k.enabled?f.params?.audio??1:0,we=Z(),Ct=Number(we.volume?.exposure??.2),$a=Number(we.volume?.bloom??.15),Ye=Number(we.kick?.bloomPulse??.18),be=we.feedback||{},Wt=Kt=>Math.min(1,Math.max(0,Number(Kt)||0)),Te={exposure:(J.exposure??1)*(1+(k.rms*Ct+k.kickFlash*Ct*.6)*ne),bloomStrength:(J.bloomStrength??1)*(1+(k.high*.3+k.rms*$a+k.kickFlash*Ye)*ne),feedback:Wt((J.feedback??be.amount??.25)+((k.bassFast||0)*Number(be.bassZoom??.35)*.22+(k.kickFlash||0)*.12)*ne),feedbackDecay:Math.min(.999,Math.max(.5,(J.feedbackDecay??be.decay??.92)-(k.kick||0)*Number(be.kickDecay??.035)*ne)),feedbackZoom:Math.max(0,(J.feedbackZoom??be.zoom??.5)+(k.bassFast||0)*Number(be.bassZoom??.35)*ne),feedbackRotation:(J.feedbackRotation??be.rotation??.3)+(k.midFast||0)*Number(be.midRotation??.4)*ne,feedbackWarp:Math.max(0,(J.feedbackWarp??be.warp??.5)+(k.highFast||0)*Number(be.highWarp??.25)*ne)},Fe=Nr(u?.type);Fe&&(Te.feedback=Wt(Te.feedback+Fe.amount),Te.feedbackDecay=Math.min(.985,Te.feedbackDecay+Fe.decay),Te.feedbackZoom=Math.max(0,Te.feedbackZoom+Fe.zoom)),m.render(le||ce,c.output,{...J,...Te,...S,transitionType:u?.type||"dissolve",transitionDirection:u?.direction||[1,0],transitionSeed:u?.seed||0,transitionProgress:N},le?ce:null,N),p&&u&&u.elapsed>=u.duration&&(p.dispose(),p=null,u=null)}function V(){E||v||(v=!0,g=0,z(typeof performance<"u"?performance.now():Date.now()))}function C(){v=!1,h&&cancelAnimationFrame(h),h=0}function T(F){return Lo(F)}function B(F){let k={...F||{}};return delete k.variant,delete k.seed,k}function U(F=null){let k=f?f.getParameters():{},N=Rr(x,k.variant??0);return D({...F||b||{},effect:x,variant:N,seed:k.seed??1,params:B(k)})}function K(F,k,N={}){if(!X(F))throw new Error(`Efecto GPU desconocido: ${F}`);if(F===x)return k&&f.setParameters(k),b=N.scene?D({...N.scene,effect:F}):U(),f;x&&f&&(w[x]=f.getParameters());let le=T(N.transitionMs??0),ce=f,J=x,ne=L(F,{...o,...w[F]||{},...k||{}});return ce&&le>0?(p&&p.dispose(),p=ce,u={from:J,to:F,elapsed:0,duration:le/1e3,type:N.transitionType||"dissolve",easing:N.transitionEasing||"smooth",direction:N.transitionDirection||[1,0],seed:N.transitionSeed||0}):ce&&(ce.dispose(),u=null,p=null),f=ne,x=F,b=N.scene?D({...N.scene,effect:F}):U(),f}function de(F,k={}){let N=D(F);if(!X(N.effect))throw new Error(`La escena usa un efecto no-GPU: ${N.effect}`);let le=Fr(N.effect,N.variant),ce={...Nn(N),variant:le},J=T(k.transitionMs??0);if(N.effect===x&&f&&J>0){w[x]=f.getParameters();let ne=f,we=L(N.effect,{...o,...w[N.effect]||{},...ce});return p&&p.dispose(),p=ne,u={from:x,to:N.effect,elapsed:0,duration:J/1e3,type:k.transitionType||"dissolve",easing:k.transitionEasing||"smooth",direction:k.transitionDirection||[1,0],seed:k.transitionSeed||0},f=we,b=D({...N,effect:N.effect,variant:N.variant,seed:N.seed}),b}return K(N.effect,ce,{...k,scene:N}),b=D({...N,effect:N.effect,variant:N.variant,seed:N.seed}),b}function Me(){return f?U():null}function Y(F){if(!f)return[];let k=f.setParameters(F);return p&&p.setParameters(F),k.length&&(b=U()),k}function te(){return f?f.getParameters():{}}function ve(){return f?f.getSchema():{}}function he(F){if(!c.setQuality(F))return;let k=f?f.getParameters():o;I(x,k)}function nt(F){Object.assign(S,F||{})}function He(){return{...c.getStats(),effect:x,particleSize:f?.particleSize||0,particleCount:f?.particleCount||0,activeParticles:f?.particleCount?Math.floor(f.particleCount*(f.params.density??1)):0,transitioning:!!u,transitionFrom:u?.from||null,transitionType:u?.type||null,transitionProgress:u?Math.round(u.elapsed/u.duration*100)/100:1,renderer:"webgl2"}}function Ae(){c&&(c.canvas.style.display="block",V())}function at(){c&&(C(),p&&(p.dispose(),p=null),u=null,c.canvas.style.display="none")}function Ee(F){F.preventDefault(),C(),c.contextLost=!0,c.canvas.dispatchEvent(new CustomEvent("uv:engine-context-lost"))}function ie(){c.contextLost=!1;let F=x||Ra,k=(N=0)=>{if(!E){c.refreshExtensions?.();try{let le=f?f.getParameters():o;I(F,le),c.resize(),f.onResize(c.width,c.height),V()}catch(le){if(N<3){setTimeout(()=>k(N+1),120);return}console.error("No se pudo restaurar el contexto WebGL:",le),window.dispatchEvent(new CustomEvent("uv:engine-restore-failed",{detail:{error:le}}))}}};typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>k(0)):k(0)}function _(){E||(E=!0,C(),fe(),f&&f.dispose(),f=null,b=null,p&&p.dispose(),p=null,m&&m.dispose(),m=null,d&&d.dispose(),d=null,c&&(c.canvas.removeEventListener("webglcontextlost",Ee),c.canvas.removeEventListener("webglcontextrestored",ie),c.dispose()),c=null)}c=new _n({container:t,canvas:n,quality:i,onScaleChange:(F,k)=>{m&&m.resize(F,k),f&&f.onResize(F,k),p&&p.onResize(F,k)}}),c.canvas.addEventListener("webglcontextlost",Ee,!1),c.canvas.addEventListener("webglcontextrestored",ie,!1);function $(F){let k=F?.detail?.lite??Ue();he(k?"lite":"high")}window.addEventListener("uv:lite-mode",$);let fe=()=>window.removeEventListener("uv:lite-mode",$);try{I(r||Ra,o)}catch(F){throw m&&m.dispose(),m=null,d&&d.dispose(),d=null,window.removeEventListener("uv:lite-mode",$),c.dispose(),c=null,F}return a&&V(),{get canvas(){return c?.canvas||null},get gl(){return c?.gl||null},get renderer(){return c},get effect(){return f},get currentEffect(){return x},get currentScene(){return b?D(b):null},get transitioning(){return!!u},get running(){return v},get fpsCounter(){return l},start:V,stop:C,show:Ae,hide:at,renderFrame:G,setEffect:K,setScene:de,getScene:Me,setParameters:Y,getParameters:te,getSchema:ve,setQuality:he,setPostParams:nt,getStats:He,dispose:_}}function ka(e,t){return!(e&&t)}function Ca(e){e&&(e.parentNode?e.parentNode.removeChild(e):e.remove?.())}function Gr(e={}){let t=e.source;if(!t||!t.width||!t.height)return null;let n=e.container||document.body,a=n.ownerDocument||document,r=Math.max(0,Number(e.durationMs)||0),o=e.easing||"ease-in-out",s=e.type||"dissolve",i;try{i=a.createElement("canvas")}catch{return null}i.width=t.width,i.height=t.height,i.className="uv-backend-crossfade",i.setAttribute("aria-hidden","true"),i.style.position="fixed",i.style.inset="0",i.style.width="100%",i.style.height="100%",i.style.zIndex="5",i.style.pointerEvents="none",i.style.opacity="1",i.style.transformOrigin="center",i.style.willChange="opacity, transform, clip-path",i.style.transition=`opacity ${r}ms ${o}, transform ${r}ms ${o}, clip-path ${r}ms ${o}`,s==="wipe"&&(i.style.clipPath="inset(0 0 0 0)");let l;try{l=e.contextFactory?e.contextFactory(i):i.getContext("2d")}catch{l=null}if(!l)return null;try{l.drawImage(t,0,0)}catch{return Ca(i),null}n.appendChild(i);let c=e.requestFrame||(typeof requestAnimationFrame=="function"?requestAnimationFrame:f=>setTimeout(f,16)),d=e.setTimeoutFn||(typeof setTimeout=="function"?setTimeout:f=>f()),m=!1;return{canvas:i,finish(){m||(m=!0,c(()=>c(()=>{s==="zoom"?(i.style.transform="scale(1.08)",i.style.opacity="0"):s==="wipe"?i.style.clipPath="inset(0 0 0 100%)":i.style.opacity="0"})),d(()=>Ca(i),r+120))},cancel(){m||(m=!0,Ca(i))}}}var ln=null,Hr=null,At=null,me=null,Le=null,cn=null,H=null,Dn=null,tt=null,Ke=null,Pa={isLite:!1},gt=!1,Vr=null,Tt=null,_o=Ea();function La(){Pa={...Pa,isLite:Ue()}}function Io(){tt&&(tt.style.display="none"),Le&&Le.stop()}function $r(){tt&&(tt.style.display="block")}function jr(){return document.querySelector("#generator main")||document.body}function Bo(){return H?.canvas&&H.canvas.style.display!=="none"?H.canvas:tt&&tt.style.display!=="none"?tt:H?.canvas||tt}function qr(e){Tt&&(Tt.cancel(),Tt=null);let t=Bo();t&&(Tt=Gr({source:t,durationMs:e.transitionMs,easing:Ir(e.transitionEasing),type:e.transitionType,container:document.body}))}function On(){Tt&&(Tt.finish(),Tt=null)}function Wr(e,t={}){if(!me)return{transitionMs:0};if(t.transitionMs===0)return{...t,transitionMs:0};if(t.transitionType&&Number.isFinite(Number(t.transitionMs)))return{...t};let n=X(me),a=X(e),r=Ia(),o=D({effect:e,variant:Ge(e)}),s=Br({from:r,to:o,audio:ke(),lastType:Vr,sameBackend:n===a});return Vr=s.type,{...s,transitionMs:t.transitionMs==="auto"||t.transitionMs==null?s.durationMs:t.transitionMs,transitionType:t.transitionType||s.type,transitionEasing:t.transitionEasing||s.easing,transitionDirection:t.transitionDirection||s.direction,transitionSeed:t.transitionSeed??s.seed}}function _a(e,t=null,n={}){if(!Ht[e]){console.warn("Efecto GPU no encontrado:",e);return}if(ln&&Io(),Dn=t||Dn||jr(),H){let a=H.currentEffect===e,r=H.running;H.setEffect(e,void 0,{transitionMs:a||!r?0:n.transitionMs??1e3,transitionType:n.transitionType,transitionEasing:n.transitionEasing,transitionDirection:n.transitionDirection,transitionSeed:n.transitionSeed}),H.show(),cn=H.fpsCounter}else{try{H=Ur({container:Dn,effectName:e,quality:Ue()?"lite":"auto"})}catch(a){console.error("No se pudo iniciar el motor GPU:",a),H=null,typeof window<"u"&&typeof window.dispatchEvent=="function"&&window.dispatchEvent(new CustomEvent("uv:engine-unavailable",{detail:{effectName:e,error:a}}));return}cn=H.fpsCounter}At=null,me=e,Ke=H?.getScene?.()||D({effect:e,variant:Ge(e)}),gt&&H&&H.stop()}function No(e,t=null){if(typeof p5>"u"){console.warn("p5.js no est\xE1 cargado \u2014 el visualizador requiere p5");return}if(Je[e]||(console.warn("Efecto no encontrado:",e),e="tunnel"),H&&H.hide(),$r(),La(),!ln){ln=new p5(n=>{n.setup=function(){let a=n.createCanvas(window.innerWidth,window.innerHeight),r=jr();a&&a.elt&&r&&a.elt.parentNode!==r&&r.appendChild(a.elt),tt=a&&a.elt?a.elt:null;let o=_o.isMobile?1:1.5;n.pixelDensity(Math.min(window.devicePixelRatio||1,o)),n.colorMode(n.HSB,360,100,100),n.stroke(255),n.noFill()},n.windowResized=function(){n.resizeCanvas(window.innerWidth,window.innerHeight)},La(),me=e,Ke=D({effect:e,variant:Ge(e)}),Hr=n,At=Je[e](n),cn=Pn(),Le=Sr({targetFps:60,fpsCounter:cn,onFrame:()=>{At&&At.draw&&At.draw(Pa)}}),Le.start(),gt&&Le.stop(),n.draw=function(){}},t||Dn||null);return}Un(e)}function zn(e="tunnel",t=null){if(X(e)){_a(e,t);return}No(e,t)}function Un(e,t={}){let n=X(e);if(!n&&!Je[e]){console.warn("Efecto no encontrado:",e);return}let a=Wr(e,t),r=X(me);if(!!me&&ka(r,n)&&a.transitionMs>0&&qr(a),n){_a(e,null,a),On();return}if(!ln){zn(e),On();return}H&&H.hide(),$r(),La();let s=Hr||ln;me=e,At=Je[e](s),Ke=D({effect:e,variant:Ge(e)}),Le&&!Le.isRunning()&&!gt&&Le.start(),gt&&H&&H.stop(),On()}function Kr(e,t={}){let n=D(e);if(!X(n.effect)&&!Je[n.effect])return console.warn("Efecto no encontrado:",n.effect),null;let a=Wr(n.effect,t),r=X(me),o=X(n.effect);return o?(!!me&&ka(r,o)&&a.transitionMs>0&&qr(a),_a(n.effect,null,a),H&&H.setScene(n,a),me=n.effect,At=null,Ke=n,On(),n):(Un(n.effect,a),me=n.effect,Ke=n,n)}function Ia(){return me?X(me)&&H?(Ke=H.getScene(),Ke):Ke&&Ke.effect===me?D(Ke):D({effect:me,variant:Ge(me)}):null}function Yr(e){return gt=!!e,gt?(H&&H.stop(),Le&&Le.stop()):X(me)&&H?H.show():Le&&Le.start(),gt}function Xr(){return gt}function vt(e){return H?H.setParameters(e):[]}function qt(){return H?H.getParameters():{}}function Qr(){return H?H.getSchema():{}}function Jr(){return H?H.getStats():null}function Zr(){return H}function ei(){return H?H.fpsCounter:cn}var Gn=null,ti=!1,Vn=null;function ni(e,t,n){if(Ba(),!t||t.length===0){console.warn("No hay efectos disponibles para transici\xF3n");return}Vn=n,ti=!0;let a=0;Gn=setInterval(()=>{Vn&&(a=(a+1)%t.length,Vn(t[a]))},e)}function Ba(){Gn&&(clearInterval(Gn),Gn=null),ti=!1,Vn=null}var Na=["1","2","3","4","5","6","7","8","9","0","-","="],Do={tunnel:"T\xFAnel",spiral:"Espiral",mandala:"M\xE1ndala",particles:"Part\xEDculas",waves:"Olas",fractal:"Fractal",matrix:"Matrix",glitch:"Glitch",melt:"Melt",fractalGlitch:"Fractal Glitch",waveGlitch:"Wave Glitch",sacredGeometry:"Geometr\xEDa Sagrada",biomech:"Biomech",dune:"Duna",yinYang:"Yin Yang",fluidFields:"Fluid Fields",organicStructures:"Organic Structures",mathematicalForms:"Mathematical Forms",temporalVeil:"Temporal Veil"};function ii(e,t,n,a={}){if(!e||!t)return null;let r={...Do,...a.labels||{}},o=Object.keys(t),s=Array.isArray(a.order)&&a.order.length>0?a.order.filter(x=>o.includes(x)).concat(o.filter(x=>!a.order.includes(x))):o.sort(),i=zo(),l=new Map,c=new Set(a.classicNames||[]);for(let x of s){let b=document.createElement("button");if(b.className=`thumb${c.has(x)?" is-classic":""}`,b.type="button",b.setAttribute("aria-label",r[x]||x),b.setAttribute("aria-pressed","false"),b.dataset.effectName=x,c.has(x)){let E=document.createElement("span");E.className="thumb-classic-badge",E.textContent="Cl\xE1sico",b.appendChild(E)}let v=Na[l.size];if(v){let E=document.createElement("span");E.className="thumb-key",E.textContent=v,b.appendChild(E)}let h=document.createElement("span");if(h.className="thumb-label",h.textContent=r[x]||x,b.appendChild(h),!i){let E=document.createElement("canvas");E.width=80,E.height=80,b.appendChild(E)}b.addEventListener("click",()=>n?.(x)),e.appendChild(b);let g=b.querySelector("canvas");if(l.set(x,{btn:b,preview:g}),g){let E=t[x],M=g.getContext("2d");if(M&&E)try{if(typeof E.preview=="function")E.preview(M,g.width,g.height,.6);else{let S=ai(g),w=E(S);for(let A=0;A<4;A++)w.draw()}}catch{}}}let d=null,m=null,f=x=>{p(),m=x;let{preview:b}=l.get(x)||{},v=t[x];if(!b||!v)return;if(typeof v.preview=="function"){let A=b.getContext("2d"),L=0,I=z=>{if(m===x){try{v.preview(A,b.width,b.height,z/1e3)}catch{return}L=requestAnimationFrame(I)}};L=requestAnimationFrame(I),d=()=>{m=null,cancelAnimationFrame(L)};return}let h=ai(b),g=v(h),E=0,M=1e3/5,S=0,w=A=>{if(m===x){if(A-E>=M){E=A;try{g.draw()}catch{return}}S=requestAnimationFrame(w)}};S=requestAnimationFrame(w),d=()=>{m=null,cancelAnimationFrame(S)}},p=()=>{d&&d(),d=null};return{highlight:x=>{if(l.has(x)){for(let[b,{btn:v}]of l)v.setAttribute("aria-pressed",b===x?"true":"false");f(x)}},stopPreview:p,getNames:()=>s,getKey:x=>{let b=s.indexOf(x);return b>=0&&b<Na.length?Na[b]:null},destroy:()=>{p(),e.innerHTML=""}}}function ai(e){let t=e.getContext("2d"),n=e.width,a=e.height,r=()=>{},o={mode:"RGB",maxR:255,maxG:255,maxB:255},s={on:!1,r:0,g:0,b:0,a:255};return{width:n,height:a,background:(i,l)=>{let c=typeof l=="number"?l:255;t.fillStyle=`rgba(0, 0, 0, ${c/255})`,t.fillRect(0,0,n,a)},noFill:()=>{s.on=!1,t.fillStyle="transparent"},fill:(i,l,c,d)=>{s.on=!0,s.r=i,s.g=l,s.b=c,s.a=d??255,t.fillStyle=ri(o,i,l,c,s.a)},stroke:(i,l,c,d)=>{t.strokeStyle=ri(o,i,l,c,d??255)},strokeWeight:i=>{t.lineWidth=i},colorMode:(i,l,c,d)=>{o.mode=i,o.maxR=l??255,o.maxG=c??l??255,o.maxB=d??l??255},translate:(i,l)=>{t.translate(i,l)},push:()=>{t.save()},pop:()=>{t.restore()},rotate:i=>{t.rotate(i)},ellipse:(i,l,c,d)=>{t.beginPath(),t.ellipse(i,l,c/2,d/2,0,0,Math.PI*2),s.on&&t.fill(),t.stroke()},line:(i,l,c,d)=>{t.beginPath(),t.moveTo(i,l),t.lineTo(c,d),t.stroke()},point:(i,l)=>{t.fillRect(i,l,1,1)},rect:(i,l,c,d)=>{t.strokeRect(i,l,c,d),s.on&&t.fillRect(i,l,c,d)},beginShape:r,endShape:r,vertex:(i,l)=>{t.lineTo(i,l)},PI:Math.PI,TWO_PI:Math.PI*2,HALF_PI:Math.PI/2,HSB:"HSB",RGB:"RGB",DEGREES:"degrees",RADIANS:"radians",createCanvas:r}}function ri(e,t,n,a,r){let o=(s,i)=>i===255?s:s/i*255;return e.mode==="HSB"?Oo(t,n,a,r):`rgba(${o(t,e.maxR)}, ${o(n,e.maxG)}, ${o(a,e.maxB)}, ${r/255})`}function Oo(e,t,n,a){e=(e%360+360)%360/360,t=Math.min(1,Math.max(0,t/100));let r=Math.min(1,Math.max(0,n/100)),o=Math.floor(e*6),s=e*6-o,i=r*(1-t),l=r*(1-s*t),c=r*(1-(1-s)*t),d,m,f;switch(o%6){case 0:d=r,m=c,f=i;break;case 1:d=l,m=r,f=i;break;case 2:d=i,m=r,f=c;break;case 3:d=i,m=l,f=r;break;case 4:d=c,m=i,f=r;break;case 5:d=r,m=i,f=l;break}return`rgba(${Math.round(d*255)}, ${Math.round(m*255)}, ${Math.round(f*255)}, ${a/255})`}function zo(){try{let e=navigator.deviceMemory;if(typeof e=="number"&&e<4)return!0;let t=navigator.hardwareConcurrency;if(typeof t=="number"&&t<4)return!0;let n=navigator.connection;if(n&&n.saveData)return!0}catch{}return!1}var oi={play:["M8 5.5v13l11-6.5z"],pause:["M8 5v14","M16 5v14"],prev:["M18 6l-9 6 9 6z","M6 6v12"],next:["M6 6l9 6-9 6z","M18 6v12"],mic:["M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z","M6 11a6 6 0 0 0 12 0","M12 17v4","M9 21h6"],camera:["M4 8h3l2-2h6l2 2h3v11H4z","M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"],share:["M12 16V4","M7 9l5-5 5 5","M5 14v5h14v-5"],bookmark:["M6 4h12v17l-6-4-6 4z"],expand:["M4 9V4h5","M20 9V4h-5","M4 15v5h5","M20 15v5h-5"],collapse:["M9 4v5H4","M15 4v5h5","M9 20v-5H4","M15 20v-5h5"],chevron:["M8 10l4 4 4-4"],sliders:["M4 7h10","M18 7h2","M4 12h4","M12 12h8","M4 17h12","M20 17h0","M16 5v4","M10 10v4","M16 15v4"],cube:["M12 3l8 4.5v9L12 21l-8-4.5v-9z","M12 12l8-4.5","M12 12L4 7.5","M12 12v9"],wave:["M3 14c3 0 3-6 6-6s3 8 6 8 3-6 6-6"],circle:["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],dice:["M5 5h14v14H5z","M9 9h.01","M15 9h.01","M12 12h.01","M9 15h.01","M15 15h.01"],reset:["M4 10a8 8 0 1 1 2 7","M4 4v6h6"],close:["M6 6l12 12","M18 6L6 18"],menu:["M4 7h16","M4 12h16","M4 17h16"],grid:["M4 4h6v6H4z","M14 4h6v6h-6z","M4 14h6v6H4z","M14 14h6v6h-6z"],info:["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M12 11v5","M12 8h.01"],moon:["M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"],trash:["M5 7h14","M9 7V5h6v2","M7 7l1 13h8l1-13"],sparkle:["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"],external:["M14 4h6v6","M20 4l-9 9","M11 5H5v14h14v-6"]};function re(e,t=16){let n="http://www.w3.org/2000/svg",a=document.createElementNS(n,"svg");a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("width",String(t)),a.setAttribute("height",String(t)),a.setAttribute("fill","none"),a.setAttribute("stroke","currentColor"),a.setAttribute("stroke-width","1.5"),a.setAttribute("stroke-linecap","round"),a.setAttribute("stroke-linejoin","round"),a.setAttribute("aria-hidden","true"),a.classList.add("uv-icon");let r=oi[e]||oi.circle;for(let o of r){let s=document.createElementNS(n,"path");s.setAttribute("d",o),a.appendChild(s)}return a}var Uo=new Set(["seed"]),si=["Forma","Movimiento","Apariencia","Comportamiento"],Go={Forma:"cube",Movimiento:"wave",Apariencia:"circle",Comportamiento:"sliders"};function li(e,{onChange:t=null,emptyText:n=null}={}){if(!e)return{refresh(){},destroy(){}};let a=document.createElement("div");a.className="uv-params-list",a.id="effect-params-list";let r=document.createElement("div");r.className="uv-params-actions";let o=document.createElement("button");o.type="button",o.className="uv-btn uv-btn-quiet",o.append(re("reset",14),document.createTextNode("Reiniciar")),r.appendChild(o),e.append(a,r),e.hidden=!0;let s=null,i={};function l(){t&&t(qt())}function c(u,x,b){let v=document.createElement("div");v.className="uv-param-row";let h=document.createElement("label");h.textContent=x.label||u,h.htmlFor=`uv-param-${u}`;let g=document.createElement("input");g.type="range",g.id=`uv-param-${u}`,g.min=String(x.min??0),g.max=String(x.max??1),g.step=x.type==="int"?"1":"0.01",g.value=String(b),u==="hue"&&(g.dataset.kind="hue");let E=()=>{let S=Number(g.min)||0,w=Number(g.max)||1,A=w===S?0:(Number(g.value)-S)/(w-S)*100;g.style.setProperty("--fill",`${A}%`)};E();let M=document.createElement("span");return M.className="uv-param-value",M.textContent=x.type==="int"?String(b):Number(b).toFixed(2),g.addEventListener("input",()=>{let S=Number(g.value);vt({[u]:S}),M.textContent=x.type==="int"?String(S):S.toFixed(2),E(),l()}),v.append(h,g,M),v}function d(u,x,b){let v=document.createElement("div");v.className="uv-param-row uv-param-toggle";let h=document.createElement("label");h.textContent=x.label||u,h.htmlFor=`uv-param-${u}`;let g=document.createElement("span");g.className="uv-switch";let E=document.createElement("input");E.type="checkbox",E.id=`uv-param-${u}`,E.checked=!!b;let M=document.createElement("span");return M.className="uv-switch-track",g.append(E,M),E.addEventListener("change",()=>{vt({[u]:E.checked}),l()}),v.append(h,g),v}function m(u,x){let b=document.createElement("div");b.className="uv-param-row uv-param-seed";let v=document.createElement("label");v.textContent=u.label||"Seed";let h=document.createElement("span");h.className="uv-seed-value",h.textContent=String(x);let g=document.createElement("button");return g.type="button",g.className="uv-btn uv-btn-icon",g.title="Nueva seed",g.setAttribute("aria-label","Nueva seed"),g.appendChild(re("dice",15)),g.addEventListener("click",()=>{let E=Math.floor(Math.random()*1e5);vt({seed:E}),h.textContent=String(E),l()}),b.append(v,h,g),b}function f(u,x,b){let v=document.createElement("section");v.className="uv-param-group";let h=document.createElement("button");h.type="button",h.className="uv-param-group-head",h.setAttribute("aria-expanded","true"),h.append(re(Go[u]||"sliders",14));let g=document.createElement("span");g.textContent=u,h.appendChild(g),h.appendChild(re("chevron",14));let E=document.createElement("div");E.className="uv-param-group-body";for(let[M,S]of x)S.type==="boolean"?E.appendChild(d(M,S,b[M]??S.default)):Uo.has(M)?E.appendChild(m(S,b[M]??S.default)):E.appendChild(c(M,S,b[M]??S.default));return h.addEventListener("click",()=>{let M=h.getAttribute("aria-expanded")!=="false";h.setAttribute("aria-expanded",String(!M)),E.hidden=M}),v.append(h,E),v}function p(){a.innerHTML="",i=Qr();let u=qt(),x=Object.entries(i);if(r.hidden=x.length===0,x.length===0){let h=document.createElement("p");h.className="uv-params-empty",h.textContent=n||"Este efecto no expone par\xE1metros en vivo.",a.appendChild(h);return}let b=new Map;for(let[h,g]of x){let E=g.group||"Par\xE1metros";b.has(E)||b.set(E,[]),b.get(E).push([h,g])}let v=[...b.keys()].sort((h,g)=>{let E=si.indexOf(h),M=si.indexOf(g);return(E<0?99:E)-(M<0?99:M)});for(let h of v)a.appendChild(f(h,b.get(h),u))}return o.addEventListener("click",()=>{if(!s)return;let u={};for(let[x,b]of Object.entries(i))u[x]=b.default;vt(u),p(),l()}),{refresh(u){if(s=u,!u||!X(u)){e.hidden=!0,a.innerHTML="",i={};return}e.hidden=!1,p()},getEffectName(){return s},destroy(){e.hidden=!0,a.innerHTML=""}}}var Vo=[{label:"Kick",path:"kick.depth",min:0,max:1.5,step:.01,digits:2},{label:"Retumbe",path:"kick.decaySec",min:.4,max:2.5,step:.05,digits:2},{label:"Sensibilidad",path:"kick.sensitivity",min:.2,max:3,step:.05,digits:2},{label:"Torsi\xF3n",path:"midFlow.twist",min:0,max:.6,step:.01,digits:2},{label:"Shimmer",path:"highShimmer.porosity",min:0,max:1.5,step:.01,digits:2},{label:"Volumen",path:"volume.exposure",min:0,max:.8,step:.01,digits:2},{label:"Din\xE1mica",path:"dynamics.autoGain",min:0,max:1,step:.01,digits:2}];function Ho(e,t){return t.split(".").reduce((n,a)=>n==null?n:n[a],e)}function ci(e){if(!e)return{refresh(){}};let t=document.createElement("section");t.className="uv-audio-panel";let n=document.createElement("div");n.className="uv-audio-head",n.append(re("wave",14));let a=document.createElement("span");a.textContent="Audio reactivo",n.appendChild(a);let r=document.createElement("button");r.type="button",r.className="uv-btn uv-btn-icon",r.title="Reiniciar audio",r.setAttribute("aria-label","Reiniciar audio"),r.appendChild(re("reset",14)),r.addEventListener("click",()=>{Ka(),g()}),n.appendChild(r),t.appendChild(n);let o=document.createElement("div");o.className="uv-audio-body",t.appendChild(o);function s(S,w,A,L){let I=document.createElement("div");I.className="uv-param-row uv-audio-row";let z=document.createElement("label");z.textContent=S;let G=document.createElement("select");G.className="uv-select";for(let[V,C]of w){let T=document.createElement("option");T.value=V,T.textContent=C,V===A&&(T.selected=!0),G.appendChild(T)}return G.addEventListener("change",()=>L(G.value)),I.append(z,G),o.appendChild(I),G}function i(S,w){let A=document.createElement("div");A.className="uv-param-row";let L=document.createElement("label");L.textContent=S.label;let I=document.createElement("input");I.type="range",I.min=String(S.min),I.max=String(S.max),I.step=String(S.step),I.value=String(w);let z=document.createElement("span");z.className="uv-param-value",z.textContent=Number(w).toFixed(S.digits);let G=()=>{let V=(Number(I.value)-S.min)/(S.max-S.min)*100;I.style.setProperty("--fill",`${V}%`)};G(),I.addEventListener("input",()=>{let V=Number(I.value);Bt(S.path,V),z.textContent=V.toFixed(S.digits),G()}),A.append(L,I,z),o.appendChild(A)}let l=document.createElement("div");l.className="uv-param-row uv-audio-row";let c=document.createElement("label");c.textContent="BPM";let d=document.createElement("span");d.className="uv-bpm-wrap";let m=document.createElement("input");m.type="number",m.min="60",m.max="200",m.step="1",m.className="uv-number";let f=document.createElement("button");f.type="button",f.className="uv-btn uv-btn-quiet",f.textContent="Auto",d.append(m,f),l.append(c,d),o.appendChild(l);function p(){let S=Z().sync?.bpm,w=typeof S!="number";m.value=String(w?Z().sync?.fallbackBpm??128:S),m.disabled=w,f.textContent=w?"Auto":"Manual",f.classList.toggle("is-on",w),f.setAttribute("aria-pressed",String(w)),f.title=w?"BPM autom\xE1tico \xB7 click para fijar manual":"BPM manual \xB7 click para volver a autom\xE1tico"}m.addEventListener("change",()=>{let S=Math.max(60,Math.min(200,Number(m.value)||128));Bt("sync.bpm",S),p()}),f.addEventListener("click",()=>{if(typeof Z().sync?.bpm=="number")Bt("sync.bpm","auto");else{let w=ke().bpm||Z().sync?.fallbackBpm||128;Bt("sync.bpm",Math.round(w))}p()});let u=document.createElement("div");u.className="uv-audio-status";let x=document.createElement("span");x.className="uv-audio-status-text";let b=document.createElement("span");b.className="uv-phase-track";let v=document.createElement("span");v.className="uv-phase-fill",b.appendChild(v);let h=document.createElement("span");h.className="uv-kick-dot",u.append(h,x,b),t.appendChild(u);function g(){o.replaceChildren(),p();let S=Z().sync?.mode||"grid";s("Sincron\xEDa",[["grid","Grilla 4/4"],["kick","Kick real"],["off","Off"]],S,w=>Bt("sync.mode",w)),o.appendChild(l);for(let w of Vo)i(w,Number(Ho(Z(),w.path)??w.min));p()}e.appendChild(t),g();let E=0;function M(){let S=performance.now();if(S-E<120)return;E=S;let w=ke(),A=w.syncMode==="grid"?"4/4":w.syncMode==="kick"?"kick":"off",L=w.bpm?Math.round(w.bpm):"\u2014",I=Math.round((w.tempoConfidence||0)*100);x.textContent=`${A} \xB7 ${L} BPM \xB7 ${I}%`,v.style.width=`${Math.max(0,Math.min(1,w.beatPhase||0))*100}%`,h.style.transform=`scale(${1+Math.min(1.4,w.kick||0)*.9})`,h.classList.toggle("is-hit",(w.kick||0)>.35)}return{refresh:M,rebuild:g}}var un=42;function ui(e){if(!e)return{start(){},stop(){}};let t=156,n=34,a=Math.min(window.devicePixelRatio||1,2);e.width=Math.round(t*a),e.height=Math.round(n*a),e.style.width=`${t}px`,e.style.height=`${n}px`;let r=e.getContext("2d");if(!r)return{start(){},stop(){}};r.scale(a,a);let o=new Float32Array(un),s=0,i=!1,l=0;function c(m){return m<.3?"187, 140, 255":m<.68?"137, 176, 255":"226, 221, 242"}function d(m){if(!i||(s=requestAnimationFrame(d),m-l<24))return;l=m;let f=Qa(),p=ke(),u=!!f&&p.enabled,x=t,b=n;r.clearRect(0,0,x,b);let v=1.4,h=(x-v*(un-1))/un,g=b-1;for(let A=0;A<un;A++){let L=A/(un-1),I=Math.pow(L,1.9),z=f?Math.min(f.length-1,Math.floor(I*f.length*.58)+1):0,G=f?f[z]/255:0;u&&(G=Math.pow(G,.78)),o[A]=Math.max(G,o[A]*.9);let V=Math.max(u?1.2:.8,G*(b-4)),C=A*(h+v),T=c(L);if(r.fillStyle=`rgba(${T}, ${u?.78:.22})`,r.fillRect(C,g-V,h,V),u&&o[A]>.04){let B=g-o[A]*(b-4);r.fillStyle=`rgba(${T}, 0.95)`,r.fillRect(C,Math.max(0,B-1),h,1)}}let E=b-4,M=["187, 140, 255","137, 176, 255","226, 221, 242"],S=[p.bass,p.mid,p.high],w=x/3;for(let A=0;A<3;A++){r.fillStyle="rgba(255, 255, 255, 0.08)",r.fillRect(A*w,E,w-2,2);let L=u?Math.min(1,S[A]/1.2):0;r.fillStyle=`rgba(${M[A]}, ${u?.95:.2})`,r.fillRect(A*w,E,Math.max(0,(w-2)*L),2)}}return{start(){i||(i=!0,l=0,s=requestAnimationFrame(d))},stop(){i=!1,s&&cancelAnimationFrame(s),s=0},destroy(){this.stop(),r.clearRect(0,0,t,n)}}}var mi="umbral-vision:presets",Ft={data:[],warned:!1};function $o(){return`p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}function jo(e){if(!e||typeof e!="object")return null;let t=e.state&&typeof e.state=="object"?e.state:{},n;try{n=t.scene?ht(t.scene):sn(t,{id:e.id,name:e.name,createdAt:e.createdAt})}catch{return null}let a=e.id||n.id,r=D({...n,id:a,name:e.name||n.name,createdAt:e.createdAt||n.createdAt,updatedAt:n.updatedAt||e.createdAt||new Date().toISOString()});return{...e,id:a,name:e.name||r.name,createdAt:e.createdAt||r.createdAt,state:{...t,effect:t.effect||r.effect,interval:t.interval??null,audioEnabled:!!t.audioEnabled,params:t.params===void 0?null:t.params,scene:r}}}function di(){return[...$n()].sort((t,n)=>String(n.createdAt).localeCompare(String(t.createdAt)))}function Da(e,t){if(!e||!t)return null;let n=String(e).trim();if(!n)return null;let a=$n(),r=t.presetId||$o(),o=t.scene?ht(t.scene):sn(t,{id:r,name:n}),s=D({...o,id:r,name:n,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}),i={id:r,name:n,state:{effect:t.effect||s.effect,interval:t.interval??null,audioEnabled:!!t.audioEnabled,params:t.params===void 0?null:t.params,scene:s},createdAt:s.createdAt},l=a.findIndex(c=>c.id===r);return l>=0?a[l]=i:a.push(i),Oa(a),i}function Hn(e,t,n={}){return t?Da(e,{effect:t.effect,interval:n.interval??null,audioEnabled:!!n.audioEnabled,params:Nn(t),scene:t,presetId:t.id}):null}function fi(e){let t=$n(),n=t.findIndex(a=>a.id===e);return n<0?!1:(t.splice(n,1),Oa(t),!0)}function mn(){return $n().map(e=>e.state?.scene).filter(Boolean)}function $n(){let e=[];try{let n=localStorage.getItem(mi);if(n){let a=JSON.parse(n);Array.isArray(a)&&(e=a)}}catch{return Ft.data.slice()}let t=e.map(jo).filter(Boolean);try{let n=JSON.stringify(e),a=JSON.stringify(t);e.length&&n!==a&&Oa(t)}catch{}return Ft.data=t.slice(),t}function Oa(e){try{localStorage.setItem(mi,JSON.stringify(e)),Ft.data=e.slice(),Ft.warned=!1}catch{Ft.data=e.slice(),Ft.warned||(Ft.warned=!0,typeof window<"u"&&window.dispatchEvent(new CustomEvent("uv:toast",{detail:{text:"Los presets no persistir\xE1n al cerrar esta ventana",duration:3500}})))}}var pi="umbral-vision-pack",hi=1;function gi(e,{name:t="Umbral Vision",includeThumbnails:n=!1}={}){let a=(e||[]).map(r=>{let o=D(r),s={id:o.id,scene:o};return n&&r.thumbnail&&(s.thumbnail=r.thumbnail),s});return{format:pi,version:hi,name:String(t||"Umbral Vision"),createdAt:new Date().toISOString(),count:a.length,scenes:a}}function vi(e){return JSON.stringify(e,null,2)}function qo(e){let t=typeof e=="string"?JSON.parse(e):e;if(!t||typeof t!="object"||Array.isArray(t))throw new Error("Pack inv\xE1lido: se esperaba un objeto");if(t.format!==pi)throw new Error(`Pack inv\xE1lido: formato "${t.format||"desconocido"}"`);if(Number(t.version)>hi)throw new Error(`Pack con versi\xF3n ${t.version} no soportada`);if(!Array.isArray(t.scenes))throw new Error("Pack inv\xE1lido: falta la lista de escenas");return t}function bi(e,t=[]){let n=qo(e),a=new Set(t.map(String)),r=[],o=[],s=[];for(let i of n.scenes)try{let l=i&&i.scene?i.scene:i,c=ht(l),d=c.id||pt("imp");if(a.has(String(d))){o.push(d);continue}let m=D({...c,id:d,thumbnail:void 0});r.push(m),a.add(String(d))}catch(l){s.push({item:i,error:l.message})}return{pack:{name:n.name,version:n.version},added:r.length,skipped:o.length,failed:s.length,scenes:r,skippedIds:o,errors:s}}var za=[{name:"abyss",hue:.56,saturation:.9},{name:"ember",hue:.05,saturation:.95},{name:"acid",hue:.22,saturation:.85},{name:"ultraviolet",hue:.78,saturation:.95},{name:"ice",hue:.48,saturation:.7},{name:"blood",hue:.98,saturation:.9},{name:"sand",hue:.11,saturation:.65}],Ua=Object.freeze({fluidFields:{variants:["membrane","torus","ribbon"],params:{density:{min:.55,max:1,default:.9,sigma:.09},speed:{min:.6,max:1.8,default:1,sigma:.16},amplitude:{min:.35,max:1.1,default:.62,sigma:.14},complexity:{min:.3,max:1,default:.62,sigma:.13},turbulence:{min:.2,max:1.2,default:.55,sigma:.16},hue:{min:0,max:1,default:.56,sigma:.16},saturation:{min:.45,max:1,default:.9,sigma:.1},glow:{min:.4,max:2,default:.68,sigma:.22},particleSize:{min:.7,max:1.8,default:1,sigma:.18},bloom:{min:.3,max:1.8,default:.85,sigma:.22},exposure:{min:.6,max:1.5,default:.98,sigma:.16},audio:{min:.6,max:1,default:1,sigma:.08}}},organicStructures:{variants:["knot"],params:{speed:{min:.6,max:1.8,default:1,sigma:.16},amplitude:{min:.08,max:.6,default:.26,sigma:.09},frequency:{min:.6,max:3,default:1.35,sigma:.35},twist:{min:0,max:1,default:.2,sigma:.2},hue:{min:0,max:1,default:.53,sigma:.16},saturation:{min:.45,max:1,default:.95,sigma:.08},glow:{min:.4,max:2,default:.95,sigma:.24},opacity:{min:.35,max:1,default:.85,sigma:.12},bloom:{min:.3,max:1.8,default:.85,sigma:.22},exposure:{min:.6,max:1.5,default:.95,sigma:.16},audio:{min:.6,max:1,default:1,sigma:.08}}},mathematicalForms:{variants:["mandelbulb"],params:{speed:{min:.5,max:1.8,default:1,sigma:.16},power:{min:4,max:11,default:7.6,sigma:1.1},warp:{min:0,max:1.2,default:.35,sigma:.2},detail:{min:.25,max:.9,default:.55,sigma:.14},hue:{min:0,max:1,default:.58,sigma:.16},saturation:{min:.4,max:1,default:.85,sigma:.1},glow:{min:.4,max:2,default:.95,sigma:.24},bloom:{min:.2,max:1.6,default:.58,sigma:.2},exposure:{min:.55,max:1.4,default:.88,sigma:.15},audio:{min:.6,max:1,default:1,sigma:.08}}},temporalSystems:{variants:["veil"],params:{speed:{min:.5,max:1.8,default:1,sigma:.16},decay:{min:.82,max:.985,default:.93,sigma:.025},zoom:{min:.2,max:.9,default:.55,sigma:.14},rotation:{min:-.8,max:.8,default:.45,sigma:.2},warp:{min:.1,max:1.2,default:.55,sigma:.18},density:{min:.1,max:.9,default:.3,sigma:.12},hue:{min:0,max:1,default:.62,sigma:.16},saturation:{min:.4,max:1,default:.9,sigma:.1},glow:{min:.4,max:2,default:.85,sigma:.22},bloom:{min:.25,max:1.8,default:.7,sigma:.2},exposure:{min:.6,max:1.5,default:.95,sigma:.15},audio:{min:.6,max:1,default:1,sigma:.08}}}}),Wo={bloom:{min:.25,max:1.8,default:.8,sigma:.2},exposure:{min:.65,max:1.4,default:.98,sigma:.14},vignette:{min:.25,max:.8,default:.55,sigma:.1},grain:{min:.008,max:.06,default:.028,sigma:.01},aberration:{min:.002,max:.035,default:.014,sigma:.006},feedback:{min:.08,max:.55,default:.25,sigma:.08},feedbackDecay:{min:.86,max:.975,default:.92,sigma:.02}};function Rt(e,t,n){return Math.min(n,Math.max(t,e))}function yi(e){let t=0,n=0;for(;t===0;)t=e();for(;n===0;)n=e();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*n)}function xi(e,t,n=null){let a=Number.isFinite(n)?n:t.default;return e()<.3?t.min+e()*(t.max-t.min):Rt(a+yi(e)*t.sigma,t.min,t.max)}function Ko(e){let t=za[Math.floor(e()*za.length)]||za[0];return{mode:"named",name:t.name,hue:Rt(t.hue+(e()-.5)*.12,0,1),saturation:Rt(t.saturation+(e()-.5)*.18,.25,1)}}function Yo(e){let t={};for(let[n,a]of Object.entries(Wo))t[n]=xi(e,a);return t}function Ga(e){return e?Object.entries(e.variants).filter(([,t])=>t.implemented!==!1).map(([t])=>t):[]}function Xo(e,t){if(t)return $t(t);let a=jt({includeClassics:!1}).filter(r=>Ga(r).length>0);return a[Math.floor(e()*a.length)]||a[0]||null}function jn(e={}){let t=Number.isFinite(e.seed)?e.seed>>>0:ft(),n=e.rng||Oe(t),a=Xo(n,e.familyId);if(!a)throw new Error("No hay familias disponibles para samplear");let r=Ga(a),o=e.variantId&&a.variants[e.variantId]?e.variantId:r[Math.floor(n()*r.length)]||a.defaultVariant,s=Mt(a.id,o),i=Ua[a.id]||{params:{}},l={};for(let[d,m]of Object.entries(i.params||{}))l[d]=xi(n,m);let c=D({id:pt("gen"),name:e.name||"",origin:"generated",effect:s.effect,variant:o,seed:t,params:l,palette:Ko(n),post:Yo(n),drift:{enabled:!0,rates:{hue:.004+n()*.02,warp:.004+n()*.025}},tags:[a.id,o]});return Ei(c)}function Ei(e){let t=D(e),n=wi(t),a=Ua[n]||{params:{}},r={...t.params};for(let[o,s]of Object.entries(a.params||{}))Number.isFinite(Number(r[o]))?r[o]=Rt(Number(r[o]),s.min,s.max):r[o]=s.default;return Number.isFinite(r.saturation)&&r.saturation<.2&&(r.saturation=.35),Number.isFinite(r.exposure)&&Number.isFinite(r.bloom)&&r.exposure*(1+r.bloom)<.55&&(r.exposure=Math.max(.7,r.exposure),r.bloom=Math.max(.35,r.bloom)),D({...t,params:r})}function wi(e){let t=jt({includeClassics:!1}).find(n=>n.id===e.familyId||n.effect===e.effect||Object.values(n.variants).some(a=>a.effect===e.effect));return t?t.id:e.tags?.[0]||null}function qn(e,t={}){let n=D(e),a=Number.isFinite(t.seed)?t.seed>>>0:ft(),r=t.rng||Oe(a),o=wi(n),s=$t(o),i=Ua[o]||{params:{}},l=Math.max(.05,Math.min(1,Number(t.strength??.35))),c=Object.keys(i.params||{}),d=Array.isArray(t.genes)&&t.genes.length?t.genes.filter(b=>c.includes(b)):[],m=d.length?d:c.filter(()=>r()<.35).slice(0,3),f={...n.params};for(let b of m){let v=i.params[b],h=Number.isFinite(Number(f[b]))?Number(f[b]):v.default;f[b]=Rt(h+yi(r)*v.sigma*l,v.min,v.max)}let p=n.variant;if(t.allowVariantChange&&s){let b=Ga(s).filter(v=>v!==n.variant);b.length&&r()<.25&&(p=b[Math.floor(r()*b.length)])}let u=s?Mt(s.id,p):null,x={...n.palette,hue:Rt(n.palette.hue+(r()-.5)*.08,0,1),saturation:Rt(n.palette.saturation+(r()-.5)*.1,.25,1)};return Ei(D({...n,id:pt("mut"),name:t.name||"",origin:"mutated",parentId:n.id,effect:u?u.effect:n.effect,variant:p,seed:a,params:f,palette:x,tags:[o,p].filter(Boolean)}))}var dn=Object.freeze(["curated","generative","hybrid"]);function Si(e){return dn.includes(e)}function Qo({bpm:e,beatPhase:t,beatsPerBar:n=4,phraseBars:a=1}={}){let r=Number(e);if(!Number.isFinite(r)||r<=0)return null;let o=Number.isFinite(Number(t))?Math.min(.999,Math.max(0,Number(t))):0,s=60/r,i=Math.max(1,Number(n)||4)*Math.max(1,Number(a)||1);return(1-o+(i-1))*s}function Mi(e,t=()=>1,n=Math.random){if(!e||e.length===0)return null;let a=0,r=e.map(s=>{let i=Math.max(0,Number(t(s))||0);return a+=i,i});if(a<=0)return e[Math.floor(n()*e.length)];let o=n()*a;for(let s=0;s<e.length;s++)if(o-=r[s],o<=0)return e[s];return e[e.length-1]}function Va(e){return e?.id||null}function Ai(e={}){let t=e.rng||Oe(ft()),n={sampleScene:e.sampler?.sampleScene||jn,mutateScene:e.sampler?.mutateScene||qn},a=Si(e.mode)?e.mode:"hybrid",r=(e.scenes||[]).map(u=>D(u)),o=Math.max(0,Number(e.noRepeatWindow??10)),s={curated:Math.max(0,Number(e.weights?.curated??.3)),generated:Math.max(0,Number(e.weights?.generated??.7))},i=[],l=null;function c(u){let x=Va(u);for(i.push(x);i.length>o;)i.shift()}function d(){let u=new Set(i),x=r.filter(b=>!u.has(Va(b)));return x.length?x:r}function m(){let u=d();return Mi(u,x=>x.favorite?2.5:1,t)}function f(){let u=d(),x=u.length&&t()<.45?Mi(u,b=>b.favorite?2.5:1,t):l;return x&&t()<.65?n.mutateScene(x,{seed:ft()+Math.floor(t()*1e5)>>>0,allowVariantChange:!0}):n.sampleScene({seed:ft()+Math.floor(t()*1e5)>>>0})}function p(){let u=null;if(a==="curated"?u=m():a==="generative"?u=f():u=r.length>0&&t()<s.curated/Math.max(1e-4,s.curated+s.generated)?m():f(),!u){if(a==="curated")return null;u=n.sampleScene({seed:ft()+Math.floor(t()*1e5)>>>0})}return u=D(u),c(u),l=u,u}return{get mode(){return a},setMode(u){return Si(u)&&(a=u),a},get scenes(){return r.slice()},setScenes(u){r=(u||[]).map(x=>D(x))},addScene(u){r.push(D(u))},get noRepeatWindow(){return o},setNoRepeatWindow(u){for(o=Math.max(0,Number(u)||0);i.length>o;)i.shift()},get weights(){return{...s}},setWeights(u){s={curated:Math.max(0,Number(u?.curated??s.curated)),generated:Math.max(0,Number(u?.generated??s.generated))}},get history(){return i.slice()},get last(){return l},next:p,nextDelay(u=null){return u?Qo({bpm:u.bpm,beatPhase:u.beatPhase,beatsPerBar:4,phraseBars:1}):null},getState(){return{mode:a,scenes:r.length,noRepeatWindow:o,weights:{...s},history:i.slice(),lastId:Va(l)}}}}function Ti({playlist:e,onScene:t,intervalMs:n=1e4,getAudio:a=()=>null,setTimeoutFn:r=typeof setTimeout=="function"?setTimeout:null,clearTimeoutFn:o=typeof clearTimeout=="function"?clearTimeout:null}={}){if(!e||typeof t!="function")throw new Error("createSceneScheduler requiere playlist y onScene");let s=0,i=!1,l=Math.max(0,Number(n)||0);function c(m){!i||!r||(s=r(()=>{if(!i)return;let f=e.next();f&&t(f),d()},Math.max(0,m)))}function d(){if(!i)return;let m=a(),f=m?e.nextDelay(m):null,p=f!=null?f*1e3:l;c(p)}return{start(){i||(i=!0,d())},stop(){i=!1,s&&o&&o(s),s=0},setIntervalMs(m){l=Math.max(0,Number(m)||0),i&&(s&&o&&o(s),d())},get intervalMs(){return l},get running(){return i},tickNow(){let m=e.next();return m&&t(m),m}}}var Jo={curated:"Curado",generative:"Generativo",hybrid:"H\xEDbrido"};function q(e,t,n){let a=document.createElement(e);return t&&(a.className=t),n!=null&&(a.textContent=n),a}function Fi(e,t={}){if(!e)return{refresh(){},destroy(){},setMode(){},get elements(){return{}}};let n=t.isFamilyAvailable||(()=>!0),a=()=>{let C=jt({includeClassics:!0}).find(T=>n(T));return C?C.id:"fluidFields"};e.classList.add("uv-scene-controls"),e.replaceChildren();let r=q("div","uv-scene-head");r.append(re("grid",14)),r.append(q("span",null,"Escena"));let o=q("span","uv-badge uv-badge-classic","Cl\xE1sico");o.hidden=!0,r.append(o),e.append(r);let s=q("label","uv-scene-row");s.append(q("span",null,"Modo"));let i=q("select","uv-select");i.id="uv-playback-mode";for(let C of dn){let T=q("option",null,Jo[C]||C);T.value=C,i.append(T)}s.append(i),e.append(s);let l=q("label","uv-scene-row");l.append(q("span",null,"Familia"));let c=q("select","uv-select");c.id="uv-family-select";for(let C of jt({includeClassics:!0})){let T=n(C),B=q("option",null,T?C.label:`${C.label} (requiere WebGL 2)`);B.value=C.id,B.disabled=!T,c.append(B)}l.append(c),e.append(l);let d=q("label","uv-scene-row");d.append(q("span",null,"Variante"));let m=q("select","uv-select");m.id="uv-variant-select",d.append(m),e.append(d);let f=q("label","uv-scene-row");f.append(q("span",null,"Transici\xF3n"));let p=q("select","uv-select");p.id="uv-transition-type";let u=q("option",null,"Auto");u.value="auto",p.append(u);for(let C of kr){let T=q("option",null,Pr[C]||C);T.value=C,p.append(T)}f.append(p),e.append(f);let x=q("div","uv-scene-actions"),b=q("button","uv-btn","Generar");b.type="button",b.id="uv-generate";let v=q("button","uv-btn","Mutar");v.type="button",v.id="uv-mutate";let h=q("button","uv-btn uv-btn-quiet","Guardar escena");h.type="button",h.id="uv-save-scene",x.append(b,v,h),e.append(x);let g=q("p","uv-scene-status","");g.id="uv-scene-status",e.append(g);let E=q("div","uv-scene-history-head");E.append(q("span",null,"Historial"));let M=q("span","uv-scene-history-count","0");E.append(M),e.append(E);let S=q("div","uv-scene-history");S.id="uv-scene-history",e.append(S);let w={},A=-1;function L(C){let T=Se[C];return T?Object.entries(T.variants).map(([B,U])=>({id:B,...U})):[]}function I(C,T){m.replaceChildren();for(let U of L(C)){let K=q("option",null,U.implemented===!1?`${U.label} (pr\xF3x.)`:U.label);K.value=U.id,U.implemented===!1&&(K.disabled=!0),m.append(K)}let B=Se[C]?.defaultVariant;m.value=L(C).some(U=>U.id===T)?T:B}function z(){let C=c.value,T=m.value,B=Mt(C,T);return{familyId:C,variantId:T,effect:B?.effect||""}}function G(C){let T=Array.isArray(C)?C:[];if(T.length===A&&T.length>0,A=T.length,M.textContent=String(T.length),S.replaceChildren(),!T.length){S.append(q("p","uv-scene-empty","Todav\xEDa no hay escenas en el historial."));return}for(let B of T.slice(0,12)){let U=q("div","uv-scene-history-row"),K=q("button","uv-scene-history-open");K.type="button",K.dataset.sceneId=B.id;let de=B.scene||{};K.append(q("b",null,de.name||`${de.effect||"escena"} \xB7 ${de.variant||"\u2014"}`));let Me=de.origin==="generated"?"generada":de.origin==="mutated"?"mutada":"guardada";K.append(q("span",null,`${Me} \xB7 ${new Date(B.at||Date.now()).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}`)),K.addEventListener("click",()=>t.onHistorySelect?.(B.id));let Y=q("button","uv-btn uv-btn-icon","");Y.type="button",Y.title="Promover a preset",Y.setAttribute("aria-label","Promover a preset"),Y.append(re("bookmark",14)),Y.addEventListener("click",()=>t.onHistorySave?.(B.id)),U.append(K,Y),S.append(U)}}function V(C={}){w=C||{};let T=w.scene||null;w.mode&&dn.includes(w.mode)&&(i.value=w.mode),p.value=w.transitionType||"auto";let B=w.familyId||(T?mt(T.effect):null)||c.value||"fluidFields";(!Se[B]||!n(Se[B]))&&(B=a()),Se[B]&&(c.value=B),I(B,w.variantId||T?.variant||Se[B]?.defaultVariant);let U=B==="classics";o.hidden=!U,g.textContent=T?`${T.effect} \xB7 ${T.variant} \xB7 seed ${T.seed}`:"Sin escena activa",w.history&&G(w.history)}return i.addEventListener("change",()=>t.onModeChange?.(i.value)),c.addEventListener("change",()=>{I(c.value,Se[c.value]?.defaultVariant),o.hidden=c.value!=="classics",t.onSelect?.(z())}),m.addEventListener("change",()=>t.onSelect?.(z())),p.addEventListener("change",()=>t.onTransitionChange?.(p.value)),b.addEventListener("click",()=>t.onGenerate?.()),v.addEventListener("click",()=>t.onMutate?.()),h.addEventListener("click",()=>t.onSave?.()),V(t.getState?.()||{}),{refresh:V,setMode(C){dn.includes(C)&&(i.value=C)},renderHistory:G,getSelection:z,get elements(){return{root:e,modeSelect:i,familySelect:c,variantSelect:m,transitionSelect:p,generateBtn:b,mutateBtn:v,saveBtn:h,status:g,historyList:S,classicBadge:o}},destroy(){e.replaceChildren(),e.classList.remove("uv-scene-controls")}}}var Zo="umbral-vision:scene-history";function es(e){try{if(typeof localStorage>"u")return[];let t=localStorage.getItem(e);if(!t)return[];let n=JSON.parse(t);return Array.isArray(n)?n:[]}catch{return[]}}function ts(e,t){try{return typeof localStorage>"u"?!1:(localStorage.setItem(e,JSON.stringify(t)),!0)}catch{return!1}}function Ri(e={}){let t=Math.max(1,Number(e.limit??30)),n=e.storageKey||Zo,a=e.persist!==!1,r=e.thumbnailStore||null,o=[];a&&(o=es(n).map(h=>{try{let g=ht(h.scene||h);return{id:h.id||g.id,scene:g,at:h.at||Date.now(),hasThumbnail:!!h.hasThumbnail}}catch{return null}}).filter(Boolean).slice(0,t));function s(){a&&ts(n,o.map(v=>({id:v.id,scene:v.scene,at:v.at,hasThumbnail:!!v.hasThumbnail})))}function i(){o.length>t&&(o=o.slice(0,t))}function l({withThumbnails:v=!1}={}){return o.map(h=>({id:h.id,scene:D(h.scene),at:h.at,hasThumbnail:!!h.hasThumbnail,thumbnail:v?h.thumbnail||null:void 0}))}function c(v){let h=o.find(g=>g.id===v);return h?{...h,scene:D(h.scene)}:null}function d(v,{thumbnail:h=null,at:g=Date.now()}={}){let E=D(v),M={id:E.id||pt("hist"),scene:E,at:g,hasThumbnail:!!h,thumbnail:h};return o.unshift(M),i(),s(),h&&r&&Promise.resolve(r.put(M.id,h,{sceneId:M.id})).catch(()=>{}),{...M,scene:D(M.scene)}}let m=d;async function f(v){let h=o.find(g=>g.id===v);if(h?.thumbnail)return h.thumbnail;if(!r)return null;try{return await r.get(v)}catch{return null}}function p(v){let h=o.findIndex(g=>g.id===v);return h<0?!1:(o.splice(h,1),s(),r&&Promise.resolve(r.delete(v)).catch(()=>{}),!0)}function u(){o=[],s(),r&&Promise.resolve(r.clear()).catch(()=>{})}function x(v,h){let g=o.find(M=>M.id===v);if(!g)return null;let E=String(h||"").trim();return D({...g.scene,name:E||g.scene.name,updatedAt:new Date().toISOString()})}function b(){return{limit:t,entries:o.length,withThumbnail:o.filter(v=>v.hasThumbnail).length}}return{push:d,capture:m,list:l,get:c,getThumbnail:f,remove:p,clear:u,promote:x,stats:b,get limit(){return t}}}var ns="umbral-vision";var _e="thumbnails";function Ci(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error||new Error("IndexedDB request failed"))})}function fn(e){return new Promise((t,n)=>{e.oncomplete=()=>t(),e.onerror=()=>n(e.error||new Error("IndexedDB transaction failed")),e.onabort=()=>n(e.error||new Error("IndexedDB transaction aborted"))})}function as(e){return e==null?0:typeof e=="string"?e.length*2:e.size!=null?Number(e.size)||0:e.byteLength!=null&&Number(e.byteLength)||0}function ki(e={}){let t=e.indexedDB!==void 0?e.indexedDB:globalThis.indexedDB||null,n=Math.max(0,Number(e.maxBytes??20*1024*1024)),a=Math.max(1,Number(e.maxEntries??120)),r=new Map,o=null,s=!1,i=!!t;async function l(){if(s)return o;if(s=!0,!t)return null;try{return o=await new Promise((v,h)=>{let g=t.open(ns,1);g.onupgradeneeded=()=>{let E=g.result;E.objectStoreNames.contains(_e)||E.createObjectStore(_e,{keyPath:"key"}).createIndex("at","at")},g.onsuccess=()=>v(g.result),g.onerror=()=>h(g.error||new Error("IndexedDB open failed"))}),o}catch{return i=!1,o=null,null}}async function c(){if(!i)return[...r.values()];let v=await l();if(!v)return[...r.values()];try{let h=v.transaction(_e,"readonly"),g=h.objectStore(_e),E=await Ci(g.getAll());return await fn(h),Array.isArray(E)?E:[]}catch{return i=!1,[...r.values()]}}async function d(){let v=await c();v.sort((E,M)=>Number(M.at||0)-Number(E.at||0));let h=v.reduce((E,M)=>E+Number(M.size||0),0),g=[];for(let E of v)g.length>=a||h>n&&g.length>0?(h-=Number(E.size||0),await p(E.key)):h>n&&g.length===0?await p(E.key):g.push(E);return g.length}async function m(v,h,g={}){if(!v)return!1;let E=as(h);if(E>n)return!1;let M={key:String(v),data:h,size:E,at:Date.now(),sceneId:g.sceneId||null};if(!i)return r.set(M.key,M),u(),!0;try{let S=await l();if(!S)return r.set(M.key,M),u(),!0;let w=S.transaction(_e,"readwrite");return w.objectStore(_e).put(M),await fn(w),await d(),!0}catch{return i=!1,r.set(M.key,M),u(),!0}}async function f(v){if(!v)return null;if(!i)return r.get(String(v))?.data??null;try{let h=await l();if(!h)return r.get(String(v))?.data??null;let g=h.transaction(_e,"readonly"),E=await Ci(g.objectStore(_e).get(String(v)));return await fn(g),E?.data??null}catch{return i=!1,r.get(String(v))?.data??null}}async function p(v){if(!v)return!1;if(r.delete(String(v)),!i)return!0;try{let h=await l();if(!h)return!0;let g=h.transaction(_e,"readwrite");return g.objectStore(_e).delete(String(v)),await fn(g),!0}catch{return!0}}function u(){let v=[...r.values()].sort((g,E)=>g.at-E.at),h=v.reduce((g,E)=>g+E.size,0);for(;v.length>a||h>n&&v.length>0;){let g=v.shift();h-=g.size,r.delete(g.key)}}async function x(){if(r.clear(),!!i)try{let v=await l();if(!v)return;let h=v.transaction(_e,"readwrite");h.objectStore(_e).clear(),await fn(h)}catch{}}async function b(){let v=await c();return{available:i,entries:v.length,bytes:v.reduce((h,g)=>h+Number(g.size||0),0),maxBytes:n,maxEntries:a}}return{put:m,get:f,delete:p,clear:x,prune:d,stats:b,open:l,get available(){return i}}}function rs(){let e=Array.from(document.querySelectorAll("#generator canvas, main canvas, body > canvas")),t=e.find(n=>n.style.display!=="none"&&!n.hidden)||e[0];return!t||typeof t.toBlob!="function"?null:new Promise(n=>{t.toBlob(a=>n(a),"image/png")})}function Pi(){return rs().then(e=>{if(!e)return!1;let t=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),n=URL.createObjectURL(e),a=document.createElement("a");return a.href=n,a.download=`umbral-vision-${t}.png`,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3),!0})}function is({effect:e,interval:t,audio:n,params:a,scene:r}={}){let o=new URLSearchParams;if(e&&o.set("effect",String(e)),t!=null&&o.set("interval",String(t)),o.set("audio",n?"1":"0"),r){let i=D(r);o.set("s",Or(i)),o.set("effect",i.effect)}else a&&typeof a=="object"&&Object.keys(a).length>0&&o.set("p",JSON.stringify(a));let s=new URL(window.location.href);return s.search=o.toString(),s.hash="",s.toString()}async function Li(e){let t=is(e);try{if(navigator.clipboard&&navigator.clipboard.writeText)return await navigator.clipboard.writeText(t),{ok:!0,url:t,method:"clipboard"}}catch{}return{ok:!1,url:t,method:"fallback"}}function _i(e){let t=new URLSearchParams(e),n=null;if(t.has("p"))try{let o=JSON.parse(t.get("p"));o&&typeof o=="object"&&!Array.isArray(o)&&(n=o)}catch{}let a=null;return t.has("s")&&(a=zr(t.get("s"))),{effect:a?.effect||t.get("effect")||null,interval:t.has("interval")&&Number(t.get("interval"))||null,audio:t.get("audio")==="1",params:a?{...a.params,seed:a.seed}:n,scene:a}}var bt=null,Ha=null;function os(){return bt||(bt=document.createElement("div"),bt.id="toast",bt.setAttribute("role","status"),bt.setAttribute("aria-live","polite"),document.body.appendChild(bt),bt)}function Q(e,t=2e3){let n=os();n.textContent=e,n.classList.add("show"),Ha&&clearTimeout(Ha),Ha=setTimeout(()=>{n.classList.remove("show")},t)}function Ii(){window.addEventListener("uv:toast",e=>{Q(e.detail?.text||"",e.detail?.duration??2e3)})}var ss=new Set(["INPUT","TEXTAREA","SELECT"]);function Bi(e){let t={" ":()=>e.toggleAuto?.(),f:()=>e.toggleFullscreen?.(),F:()=>e.toggleFullscreen?.(),h:()=>e.togglePanel?.(),H:()=>e.togglePanel?.(),m:()=>e.toggleMic?.(),M:()=>e.toggleMic?.(),p:()=>e.togglePause?.(),P:()=>e.togglePause?.(),"?":()=>e.toggleOnboarding?.(),ArrowLeft:()=>e.prevEffect?.(),ArrowRight:()=>e.nextEffect?.()};for(let a=1;a<=9;a++)t[String(a)]=()=>e.selectByIndex?.(a-1);t[0]=()=>e.selectByIndex?.(9),t["-"]=()=>e.selectByIndex?.(10),t["="]=()=>e.selectByIndex?.(11);let n=a=>{if(a.ctrlKey||a.metaKey||a.altKey)return;let r=a.target;if(r&&ss.has(r.tagName)||r&&r.isContentEditable)return;let o=t[a.key];o&&(a.preventDefault(),o())};return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)}var Ni="umbral-vision:onboarded";var ls=[{keys:["1","\u2013","9"],text:"Cambiar efecto (atajo num\xE9rico)"},{keys:["\u2190","\u2192"],text:"Efecto anterior / siguiente"},{keys:["Espacio"],text:"Auto-transici\xF3n on/off"},{keys:["F"],text:"Pantalla completa"},{keys:["H"],text:"Ocultar / mostrar interfaz"},{keys:["M"],text:"Activar / desactivar micr\xF3fono"}];function Di({onFirstFrame:e}){let t=document.getElementById("onboarding");t||(t=us(),document.body.appendChild(t));let n=null,a=cs(),r=()=>{a||(t.hidden=!1,n=setTimeout(o,6e3))},o=()=>{if(n&&clearTimeout(n),n=null,t.hidden=!0,!a){a=!0;try{localStorage.setItem(Ni,"1")}catch{}}};return t.addEventListener("click",s=>{s.target===t&&o()}),t.querySelector(".onboarding-dismiss")?.addEventListener("click",o),document.addEventListener("keydown",s=>{t.hidden||(s.key==="Escape"||s.key==="Enter")&&o()}),a||e(()=>setTimeout(r,800)),{show:()=>{a=!1,r()},dismiss:o}}function cs(){try{return localStorage.getItem(Ni)==="1"}catch{return!1}}function us(){let e=document.createElement("div");e.id="onboarding",e.hidden=!0;let t=document.createElement("div");t.className="onboarding-card";let n=document.createElement("h2");n.textContent="Umbral Vision",t.appendChild(n);let a=document.createElement("p");a.style.cssText="margin: 0; font-size: 0.9rem; opacity: 0.75;",a.textContent="Atajos principales:",t.appendChild(a);let r=document.createElement("ul");r.className="onboarding-tips";for(let s of ls){let i=document.createElement("li");for(let c of s.keys){let d=document.createElement("kbd");d.textContent=c,i.appendChild(d)}let l=document.createElement("span");l.textContent=" "+s.text,i.appendChild(l),r.appendChild(i)}t.appendChild(r);let o=document.createElement("button");return o.className="uv-btn uv-btn-primary onboarding-dismiss",o.textContent="Entendido",t.appendChild(o),e.appendChild(t),e}var Oi=["fluidFields","organicStructures","mathematicalForms","temporalVeil","tunnel","spiral","mandala","particles","waves","fractal","matrix","glitch","melt","fractalGlitch","waveGlitch","sacredGeometry","biomech","dune","yinYang"],ms={fluidFields:"Fluid",organicStructures:"Organic",mathematicalForms:"Fractal",temporalVeil:"Temporal",tunnel:"T\xFAnel",spiral:"Espiral",mandala:"M\xE1ndala",particles:"Part\xEDculas",waves:"Olas",fractal:"\xC1rbol",matrix:"Matrix",glitch:"Glitch",melt:"Melt",fractalGlitch:"\xC1rbol Glitch",waveGlitch:"Olas Glitch",sacredGeometry:"Geometr\xEDa",biomech:"Biomech",dune:"Duna",yinYang:"Yin Yang"},pn={fluidFields:["Fluid Fields","Tejido de part\xEDculas sobre una membrana viva.","Fluid Fields"],organicStructures:["Organic Structures","Membranas topol\xF3gicas transl\xFAcidas.","Organic Structures"],mathematicalForms:["Mathematical Forms","Fractal volum\xE9trico raymarched.","Mathematical Forms"],temporalVeil:["Temporal Veil","Estelas que evolucionan desde su memoria.","Temporal Systems"],tunnel:["T\xFAnel","Elipses conc\xE9ntricas en c\xE1mara infinita.","Cl\xE1sico p5"],spiral:["Espiral","Crom\xE1tica en rotaci\xF3n continua.","Cl\xE1sico p5"],mandala:["M\xE1ndala","Simetr\xEDa radial en capas.","Cl\xE1sico p5"],particles:["Part\xEDculas","Campo de part\xEDculas reactivas.","Cl\xE1sico p5"],waves:["Olas","Ondas de frecuencia sobre el plano.","Cl\xE1sico p5"],fractal:["\xC1rbol fractal","Recursi\xF3n ramificada.","Cl\xE1sico p5"],matrix:["Matrix","Lluvia de caracteres.","Cl\xE1sico p5"],glitch:["Glitch","Ruido, bandas y desplazamiento digital.","Cl\xE1sico p5"],melt:["Melt","Deriva y goteo vertical.","Cl\xE1sico p5"],fractalGlitch:["\xC1rbol Glitch","Fractal con interferencias.","Cl\xE1sico p5"],waveGlitch:["Olas Glitch","Ondas atravesadas por ruido.","Cl\xE1sico p5"],sacredGeometry:["Geometr\xEDa Sagrada","Flor de la vida y patrones.","Cl\xE1sico p5"],biomech:["Biomech","Estructuras org\xE1nicas y mec\xE1nicas.","Cl\xE1sico p5"],dune:["Duna","Dunas suaves en capas.","Cl\xE1sico p5"],yinYang:["Yin Yang","Dualidad en equilibrio.","Cl\xE1sico p5"]},zi="umbral-vision:transition-interval",Ui="umbral-vision:playback-mode",Gi="umbral-vision:transition-type";function ds(){let e={};for(let[t,n]of Object.entries(Ht)){let a=()=>({draw:()=>{}});a.preview=n.preview,a.isEngine=!0,a.label=n.label,e[t]=a}return{...Je,...e}}function Vi(e){return String(e).padStart(2,"0")}function fs(e){try{return new Date(e).toLocaleDateString("es-AR",{day:"2-digit",month:"short"})}catch{return""}}function ps(){let e=document.getElementById("panel"),t=document.getElementById("uv-dock");if(!e||!t)return null;Ii();let n=ds(),a=Oi.filter(y=>n[y]).concat(Object.keys(n).filter(y=>!Oi.includes(y))),r=document.getElementById("thumbnails"),o=_i(window.location.search),s=n[o.effect]?o.effect:"fluidFields",i="auto";try{i=localStorage.getItem(Gi)||"auto"}catch{}let l={current:s,interval:o.interval||Number(localStorage.getItem(zi))||10,transitionType:i,auto:!1,paused:!1};zn(s,document.querySelector("#generator main"));let c=!X(s)||!!Zr();c||(l.current="tunnel",zn("tunnel",document.querySelector("#generator main")),Q("WebGL 2 no disponible: usando efectos p5")),o.params&&X(s)&&c&&vt(o.params);let d=(y,P,O)=>{let j=document.getElementById(y);return j?(j.appendChild(re(P,18)),j.setAttribute("aria-label",O),j):null};d("fullscreenBtn","expand","Pantalla completa"),d("uv-panel-btn","grid","Mostrar u ocultar panel"),d("uv-prev","prev","Efecto anterior"),d("uv-next","next","Efecto siguiente"),d("uv-play","pause","Pausar"),d("uv-strip-prev","chevron","Desplazar efectos"),d("uv-strip-next","chevron","Desplazar efectos"),document.getElementById("uv-strip-prev")?.classList.add("uv-flip"),d("lite-mode-btn","moon","Modo lite"),d("uv-save-preset","bookmark","Guardar preset"),d("capture-btn","camera","Descargar PNG"),d("share-btn","share","Compartir URL");let m=document.getElementById("uv-explore-btn");m&&!m.querySelector("svg")&&m.appendChild(re("chevron",14));let f=e.querySelector(".panel-toggle");f&&f.appendChild(re("chevron",14));let p=document.getElementById("micBtn");p&&!p.querySelector("svg")&&p.prepend(re("mic",16));let u=document.getElementById("uv-play"),x=[e,t,document.querySelector(".uv-transport"),document.querySelector(".uv-topbar")].filter(Boolean),b=null,v=!1,h=!1,g=new URLSearchParams(window.location.search).has("uihold");function E(){let y=document.activeElement;return y?/^(INPUT|TEXTAREA|SELECT)$/.test(y.tagName)||y.isContentEditable:!1}function M(){return x.some(y=>y.matches(":hover"))}function S(){b&&clearTimeout(b),!(v||E()||g)&&(b=setTimeout(()=>{if(M()||E()){S();return}w(!0,!0)},4200))}function w(y,P=!1){v=!!y,document.body.classList.toggle("uv-immersive",v);for(let j of x)if(j!==e){try{j.inert=v}catch{}j.setAttribute("aria-hidden",String(v))}at();let O=document.getElementById("uv-panel-btn");O&&O.setAttribute("aria-expanded",String(!v)),v?(b&&clearTimeout(b),ie&&(ie.hidden=!0),P&&!h&&(h=!0,Q("Interfaz oculta \xB7 mov\xE9 el mouse o toc\xE1 para volver",2600))):S()}function A(){v?w(!1):S()}for(let y of x)y.addEventListener("pointerenter",()=>{b&&clearTimeout(b)}),y.addEventListener("pointerleave",()=>S());for(let y of["pointermove","pointerdown","wheel","touchstart"])window.addEventListener(y,A,{passive:!0});window.addEventListener("keydown",y=>{y.key==="h"||y.key==="H"||A()},{passive:!0}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&S()});let L=document.getElementById("effect-params-host"),I=document.getElementById("uv-params-fallback"),z=li(L,{emptyText:"Este efecto no expone par\xE1metros en vivo."}),G=ci(document.getElementById("audio-controls")),V=ki(),C=Ri({limit:30,thumbnailStore:V}),T="hybrid";try{T=localStorage.getItem(Ui)||"hybrid"}catch{}let B=Ai({mode:T,scenes:mn(),noRepeatWindow:10,weights:{curated:.3,generated:.7}}),U=Ti({playlist:B,intervalMs:l.interval*1e3,getAudio:()=>ke(),onScene:y=>{y&&he(y,{record:!0,silent:!0})}}),K=document.createElement("section");K.id="uv-scene-controls-host",K.className="uv-scene-controls-host",L?.parentNode?L.parentNode.insertBefore(K,L):e.querySelector(".panel-body")?.appendChild(K);let de=Fi(K,{isFamilyAvailable:y=>y.renderer!=="webgl"||c,getState:()=>({scene:Y(),mode:B.mode,history:C.list(),transitionType:l.transitionType,familyId:Me(Y()),variantId:Y()?.variant}),onTransitionChange:y=>{l.transitionType=y;try{localStorage.setItem(Gi,y)}catch{}Q(y==="auto"?"Transiciones autom\xE1ticas":`Transici\xF3n: ${y}`)},onSelect:({familyId:y,variantId:P})=>{let O=Mt(y,P);if(O){if(O.family.renderer==="webgl"&&!c){Q("WebGL 2 no disponible en este navegador");return}if(O.family.renderer==="webgl"){let j=Y();he(D({...j||{},effect:O.effect,variant:P}),{transitionMs:"auto"})}else F(O.effect),te()}},onModeChange:y=>{B.setMode(y);try{localStorage.setItem(Ui,y)}catch{}l.auto&&we(),te()},onGenerate:()=>{let y=de.getSelection(),P=jn({familyId:y.familyId,variantId:y.variantId});he(P,{record:!0}),Q("Escena generada")},onMutate:()=>{let y=Y();if(!y)return;let P=qn(y,{allowVariantChange:!0});he(P,{record:!0}),Q("Escena mutada")},onSave:()=>{let y=Y();if(!y)return;let P=y.name||`${pn[y.effect]?.[0]||y.effect} ${new Date().toLocaleDateString("es-AR")}`,O=(prompt("Nombre de la escena:",P)||"").trim();O&&(Hn(O,y),C.push({...y,name:O}),ve(),Lt(),te(),Q(`Escena \u201C${O}\u201D guardada`))},onHistorySelect:y=>{let P=C.get(y);P&&he(P.scene,{silent:!0})},onHistorySave:y=>{let P=C.get(y);if(!P)return;let O=P.scene.name||`${pn[P.scene.effect]?.[0]||P.scene.effect} ${new Date().toLocaleDateString("es-AR")}`,j=(prompt("Nombre del preset:",O)||"").trim();if(!j)return;let ae=C.promote(y,j);ae&&(Hn(j,ae),ve(),Lt(),Q(`Preset \u201C${j}\u201D guardado`))}});function Me(y){return y?mt(y.effect):null}function Y(){try{return Ia()}catch{return null}}function te(){let y=Y();de.refresh({scene:y,mode:B.mode,history:C.list(),transitionType:l.transitionType,familyId:Me(y),variantId:y?.variant})}function ve(){B.setScenes(mn()),te()}function he(y,P={}){if(!y)return null;if(!c&&X(y.effect))return Q("WebGL 2 no disponible en este navegador"),null;let O={};P.transitionMs!=null&&(O.transitionMs=P.transitionMs);let j=P.transitionType||(l.transitionType!=="auto"?l.transitionType:null);j&&(O.transitionType=j);let ae=Kr(y,O);return ae?(l.current=ae.effect,$&&$.highlight(ae.effect),P.record&&C.push(ae),N(),te(),ae):null}let nt=[...e.querySelectorAll("[data-uv-tab]")],He=[...e.querySelectorAll("[data-uv-panel]")];function Ae(y){for(let P of nt){let O=P.dataset.uvTab===y;P.setAttribute("aria-selected",String(O)),P.tabIndex=O?0:-1}for(let P of He)P.hidden=P.dataset.uvPanel!==y;y==="presets"&&Lt()}nt.forEach(y=>y.addEventListener("click",()=>Ae(y.dataset.uvTab)));function at(){let y=v||e.classList.contains("is-hidden");try{e.inert=y}catch{}e.setAttribute("aria-hidden",String(y))}function Ee(y){e.classList.toggle("is-hidden",!y);let P=document.getElementById("uv-panel-btn");P&&P.setAttribute("aria-expanded",String(y)),at()}document.getElementById("uv-panel-btn")?.addEventListener("click",()=>{Ee(e.classList.contains("is-hidden"))}),f?.addEventListener("click",()=>Ee(!1));let ie=document.getElementById("uv-explore-menu"),_=()=>{if(!ie)return;let y=ie.hidden;ie.hidden=!y,m?.setAttribute("aria-expanded",String(y))};m?.addEventListener("click",y=>{y.stopPropagation(),_()}),document.addEventListener("click",()=>{ie&&!ie.hidden&&(ie.hidden=!0,m?.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",y=>{y.key==="Escape"&&ie&&!ie.hidden&&(ie.hidden=!0,m?.setAttribute("aria-expanded","false"))}),ie?.querySelectorAll("[data-uv-tab-target]").forEach(y=>{y.addEventListener("click",()=>{Ee(!0),Ae(y.dataset.uvTabTarget),ie.hidden=!0})});let $=r?ii(r,n,y=>F(y),{labels:ms,order:a,classicNames:Tr()}):null,fe=document.getElementById("uv-effect-count");fe&&(fe.textContent=String(a.length)),$&&$.highlight(l.current),document.getElementById("uv-strip-prev")?.addEventListener("click",()=>{r?.scrollBy({left:-260,behavior:"smooth"})}),document.getElementById("uv-strip-next")?.addEventListener("click",()=>{r?.scrollBy({left:260,behavior:"smooth"})});function F(y){if(n[y]){if(!c&&X(y)){Q("WebGL 2 no disponible en este navegador");return}Un(y,l.transitionType!=="auto"?{transitionType:l.transitionType}:void 0),l.current=y,$&&$.highlight(y),N(),te(),l.auto&&we()}}function k(y){let P=a.indexOf(l.current),O=a[(P+y+a.length)%a.length];F(O)}function N(){let y=pn[l.current]||[l.current,"","\u2014"],P=a.indexOf(l.current);ye("uv-effect-index",`${Vi(P+1)} / ${Vi(a.length)}`),ye("uv-effect-title",y[0]),ye("uv-effect-desc",y[1]),ye("uv-info-family",y[2]),ye("uv-info-renderer",X(l.current)?"WebGL 2":"p5 \xB7 Canvas 2D"),z&&z.refresh(l.current),I&&(I.hidden=X(l.current)),Kn()}document.getElementById("uv-prev")?.addEventListener("click",()=>k(-1)),document.getElementById("uv-next")?.addEventListener("click",()=>k(1));function le(){u&&(u.replaceChildren(re(l.paused?"play":"pause",18)),u.setAttribute("aria-label",l.paused?"Reanudar":"Pausar"),u.classList.toggle("is-paused",l.paused),document.getElementById("uv-live")?.classList.toggle("is-paused",l.paused))}u?.addEventListener("click",()=>{l.paused=Yr(!l.paused),le()});let ce=document.getElementById("autoTransition"),J=document.getElementById("transitionInterval"),ne=document.getElementById("transitionIntervalValue");J&&(J.value=String(l.interval),ne&&(ne.textContent=`${l.interval}s`),J.addEventListener("input",()=>{l.interval=Number(J.value),ne&&(ne.textContent=`${l.interval}s`);try{localStorage.setItem(zi,String(l.interval))}catch{}U.setIntervalMs(l.interval*1e3),l.auto&&we()}));function we(){if(U.setIntervalMs(l.interval*1e3),U.stop(),B.mode==="curated"&&B.getState().scenes===0){ni(l.interval*1e3,a,F);return}U.start()}function Ct(y){l.auto=y,ce&&(ce.checked=y),y?we():(U.stop(),Ba())}ce?.addEventListener("change",()=>Ct(ce.checked)),ui(document.getElementById("audio-spectrum")).start();let Ye={on:!1};function be(){if(!p)return;p.classList.toggle("is-on",Ye.on),p.setAttribute("aria-pressed",String(Ye.on)),p.closest(".uv-audio")?.classList.toggle("is-on",Ye.on);let y=p.querySelector("[data-uv-mic-label]");y&&(y.textContent=Ye.on?"Mic ON":"Audio")}p?.addEventListener("click",async()=>{if(Ye.on)await Xa(),Ye.on=!1,be();else try{await Ya(),Ye.on=!0,be(),Q("Micr\xF3fono activo")}catch{p.classList.add("is-error"),setTimeout(()=>p.classList.remove("is-error"),1200),Q("No se pudo acceder al micr\xF3fono")}}),be();function Wt(){let y=document.getElementById("lite-mode-btn");if(!y)return;let P=Ue();y.classList.toggle("is-on",P),y.setAttribute("aria-pressed",String(P))}document.getElementById("lite-mode-btn")?.addEventListener("click",()=>{Mr(!Ue()),Wt(),Q(`Modo lite ${Ue()?"activo":"desactivado"}`),setTimeout(Kn,700)}),Wt();let Te=document.getElementById("preset-name"),Fe=document.getElementById("preset-list");function Kt(){let y=Y();return{effect:l.current,interval:l.interval,audioEnabled:ee().enabled,params:X(l.current)?qt():null,scene:y}}function Hi(){let y=`${pn[l.current]?.[0]||l.current} ${new Date().toLocaleDateString("es-AR")}`,P=(Te?.value||"").trim()||y,O=Da(P,Kt());if(!O){Q("No se pudo guardar el preset");return}Te&&(Te.value=""),ve(),Lt(),Q(`Preset \u201C${O.name}\u201D guardado`)}document.getElementById("preset-save")?.addEventListener("click",Hi),document.getElementById("uv-save-preset")?.addEventListener("click",()=>{Ee(!0),Ae("presets"),Te?.focus()});let Wn=document.createElement("div");Wn.className="uv-preset-pack";let kt=document.createElement("button");kt.type="button",kt.className="uv-btn uv-btn-quiet",kt.id="uv-pack-export",kt.textContent="Exportar pack";let Pt=document.createElement("button");Pt.type="button",Pt.className="uv-btn uv-btn-quiet",Pt.id="uv-pack-import",Pt.textContent="Importar pack";let $e=document.createElement("input");$e.type="file",$e.accept="application/json",$e.hidden=!0,$e.id="uv-pack-file",Wn.append(kt,Pt,$e),Fe?.parentNode&&Fe.parentNode.insertBefore(Wn,Fe),kt.addEventListener("click",()=>{let y=mn();if(y.length===0){Q("Todav\xEDa no hay escenas para exportar");return}let P=gi(y,{name:"Umbral Vision"}),O=new Blob([vi(P)],{type:"application/json"}),j=URL.createObjectURL(O),ae=document.createElement("a"),hn=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);ae.href=j,ae.download=`umbral-vision-pack-${hn}.json`,document.body.appendChild(ae),ae.click(),ae.remove(),setTimeout(()=>URL.revokeObjectURL(j),1e3),Q(`Pack exportado (${y.length} escenas)`)}),Pt.addEventListener("click",()=>$e.click()),$e.addEventListener("change",async()=>{let y=$e.files&&$e.files[0];if(y)try{let P=await y.text(),O=bi(P,mn().map(j=>j.id));O.scenes.forEach((j,ae)=>{Hn(j.name||`Importada ${ae+1}`,j)}),ve(),Lt(),Q(`Pack: ${O.added} agregadas \xB7 ${O.skipped} omitidas \xB7 ${O.failed} fallidas`)}catch(P){console.error("No se pudo importar el pack:",P),Q("No se pudo importar el pack")}finally{$e.value=""}});function Lt(){if(!Fe)return;Fe.replaceChildren();let y=di();if(y.length===0){let P=document.createElement("p");P.className="uv-preset-empty",P.textContent="Todav\xEDa no hay presets. Guard\xE1 la configuraci\xF3n actual.",Fe.appendChild(P);return}for(let P of y){let O=document.createElement("div");O.className="uv-preset-item";let j=document.createElement("button");j.type="button",j.className="uv-preset-load";let ae=document.createElement("b");ae.textContent=P.name;let hn=document.createElement("span"),ji=pn[P.state?.effect]?.[0]||P.state?.effect||"\u2014";hn.textContent=`${ji} \xB7 ${fs(P.createdAt)}`,j.append(ae,hn),j.addEventListener("click",()=>$i(P));let _t=document.createElement("button");_t.type="button",_t.className="uv-btn uv-btn-icon uv-preset-delete",_t.setAttribute("aria-label",`Eliminar ${P.name}`),_t.appendChild(re("trash",14)),_t.addEventListener("click",()=>{fi(P.id),ve(),Lt(),Q("Preset eliminado")}),O.append(j,_t),Fe.appendChild(O)}}function $i(y){!y||!y.state||(y.state.scene?he(y.state.scene,{silent:!0}):n[y.state.effect]&&(F(y.state.effect),X(y.state.effect)&&y.state.params&&(vt(y.state.params),z?.refresh(y.state.effect))),y.state.interval&&(l.interval=y.state.interval,J&&(J.value=String(l.interval)),ne&&(ne.textContent=`${l.interval}s`)),Q(`Preset \u201C${y.name}\u201D cargado`))}document.getElementById("capture-btn")?.addEventListener("click",async()=>{let y=await Pi();Q(y?"PNG descargado":"No se pudo capturar el frame")}),document.getElementById("share-btn")?.addEventListener("click",async()=>{(await Li({effect:l.current,interval:l.interval,audio:ee().enabled,params:X(l.current)?qt():null,scene:Y()})).method==="clipboard"?Q("URL copiada"):Q("No se pudo copiar la URL")}),document.getElementById("fullscreenBtn")?.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.()}),document.addEventListener("fullscreenchange",()=>{let y=document.getElementById("fullscreenBtn");y&&(y.replaceChildren(re(document.fullscreenElement?"collapse":"expand",18)),y.setAttribute("aria-label",document.fullscreenElement?"Salir de pantalla completa":"Pantalla completa"))});function ye(y,P){let O=document.getElementById(y);O&&(O.textContent=P)}function Kn(){let y=Jr(),P=X(l.current),O=ei(),j=O&&(O.getAvg?.()||O.getInstant?.())||0;ye("uv-fps",`${Math.round(j)} FPS`),ye("uv-backend",P?"GPU":"P5"),ye("uv-info-fps",y?`${y.fps.toFixed(1)}`:Math.round(j).toString()),P&&y?(ye("uv-info-res",`${y.width}\xD7${y.height}`),ye("uv-info-quality",y.quality),ye("uv-info-particles",y.activeParticles>0?y.activeParticles.toLocaleString("es-AR"):"\u2014")):(ye("uv-info-res",`${window.innerWidth}\xD7${window.innerHeight}`),ye("uv-info-quality",Ue()?"lite":"high"),ye("uv-info-particles","\u2014"))}return setInterval(Kn,600),setInterval(()=>G.refresh(),120),Bi({selectByIndex:y=>{a[y]&&F(a[y])},prevEffect:()=>k(-1),nextEffect:()=>k(1),toggleAuto:()=>Ct(!l.auto),toggleFullscreen:()=>document.getElementById("fullscreenBtn")?.click(),toggleMic:()=>p?.click(),togglePanel:()=>w(!v),toggleOnboarding:()=>document.getElementById("onboarding")?.removeAttribute("hidden"),togglePause:()=>u?.click()}),window.matchMedia&&window.matchMedia("(max-width: 720px)").matches&&Ee(!1),Ct(!1),l.paused=Xr(),le(),N(),te(),Ae("params"),new URLSearchParams(window.location.search).has("nointro")||Di({onFirstFrame:y=>requestAnimationFrame(()=>requestAnimationFrame(y))}),S(),{selectEffect:F,openTab:Ae,setImmersive:w,getState:()=>({...l,immersive:v}),refresh:N}}if(typeof window<"u"&&document.getElementById("uv-dock")&&!window.__UV_NO_AUTO_INIT__){let e=()=>{window.__UV_STUDIO_MOUNTED__||(window.__UV_STUDIO_MOUNTED__=!0,ps())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}export{ps as mountStudioUI};
