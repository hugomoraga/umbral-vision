var Yi=Object.defineProperty;var Xi=(e,t,n)=>t in e?Yi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var je=(e,t,n)=>Xi(e,typeof t!="symbol"?t+"":t,n);function Kt(e,t,n=parseFloat){let a=document.getElementById(e);if(!a)return t;let r=n(a.value);return isNaN(r)?t:r}function rt(e,t=.1){return Math.random()<t?(Math.random()-.5)*2:0}function Xn(e,t,n,a=.1,r=10){return Math.sin((e+t)*.1+n*a)*r}function Qn(e,t,n=1){return Math.sin(e*.05+t*.1)*n*20}function gn(e,t,n,a=.01){let r=Math.sin(e*a+n)*.5,i=Math.cos(t*a+n*.7)*.5;return(r+i)*50}var Zn={sync:{mode:"grid",bpm:"auto",fallbackBpm:128,minBpm:80,maxBpm:180,visualLatencyMs:28},kick:{rangeHz:[35,120],refractoryMs:180,threshold:1.55,minFlux:.006,sensitivity:1,depth:.7,decaySec:1.5,spring:18,damping:4.5,cameraDolly:.03,bloomPulse:.18},bassBody:{attackMs:80,releaseMs:800,scale:.05},midFlow:{attackMs:120,releaseMs:600,twist:.22,waveSpeed:.8,waveAmp:.12},highShimmer:{attackMs:15,releaseMs:180,porosity:.5,microDisplace:.012},volume:{exposure:.2,bloom:.15},dynamics:{autoGain:.6,floor:.04},agc:{autoGain:.6,floor:.03,decay:.996,onsetThreshold:1.6,onsetMinFlux:.0015,refractoryMs:140},feedback:{amount:.25,decay:.92,zoom:.5,rotation:.3,warp:.5,bassZoom:.35,midRotation:.4,kickDecay:.035,highWarp:.25},effects:{fluidFields:{kick:1,body:.7,mid:.9,high:1},organicStructures:{kick:1,body:.8,mid:1,high:1},mathematicalForms:{kick:1,body:.5,mid:.8,high:.8},temporalVeil:{kick:1,body:.6,mid:.9,high:.8}}},Wa="umbral-vision:audio-map",Ze=Jn(Zn),Bt=Ka();function Jn(e){return JSON.parse(JSON.stringify(e))}function yt(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function Yt(e,t){if(!yt(t))return e;for(let[n,a]of Object.entries(t))yt(a)&&yt(e[n])?Yt(e[n],a):a!==void 0&&(e[n]=Array.isArray(a)?a.slice():a);return e}function Ka(){try{if(typeof localStorage>"u")return{};let e=localStorage.getItem(Wa),t=e?JSON.parse(e):{};return yt(t)?t:{}}catch{return{}}}function Ya(){try{if(typeof localStorage>"u")return;localStorage.setItem(Wa,JSON.stringify(Bt))}catch{}}function ea(){return Ze=Jn(Zn),Yt(Ze,Bt),Ze}ea();async function Qi(e=null){let t=null;if(typeof window<"u"&&typeof window.fetch=="function")try{let a=e||new URL("./audio-map.json",import.meta.url).href,r=await window.fetch(a,{cache:"no-cache"});r.ok&&(t=await r.json())}catch{}let n=typeof window<"u"?window.UV_AUDIO_MAP:null;return Bt=Ka(),Ze=Jn(Zn),yt(t)&&Yt(Ze,t),yt(n)&&Yt(Ze,n),Yt(Ze,Bt),Ze}function J(){return Ze}function Nt(e,t){let n=String(e).split("."),a=Bt;for(let r=0;r<n.length-1;r++){let i=n[r];yt(a[i])||(a[i]={}),a=a[i]}return a[n[n.length-1]]=t,Ya(),ea()}function Xa(){return Bt={},Ya(),ea()}typeof window<"u"&&typeof window.fetch=="function"&&Qi();var Ie=null,ge=null,Xt=null,vn=null,Be=null,Ne=null,We=null,Jt=0,en=!1,wn=2048,Zi=.35,Ji=.045,eo=.22,ta=.012,na=.09,to=.035,no=.16,bn=30,sa=32,Re={bass:[20,160],mid:[160,2e3],high:[2e3,12e3]},R={enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0,flux:0,bassBody:0,midFlow:0,highShimmer:0,bassFast:0,midFast:0,highFast:0,bassSlow:0,midSlow:0,highSlow:0,waveRms:0,transient:0,bassOnset:!1,midOnset:!1,highOnset:!1,kick:0,kickFlash:0,kickTrigger:!1,kickStrength:0,kickOnset:!1,kickInterval:0,kickFlux:0,kickEnergy:0,bpm:0,beatPhase:0,tempoConfidence:0,syncMode:"grid"},yn=.12,Vt={bass:.12,mid:.12,high:.12},Qt={bass:.001,mid:.001,high:.001},oe=0,la=new Float32Array(bn),xn=0,xt=0,Ot=0,ca=-10,ua=new Float32Array(sa),En=0,Et=0,it=-10,Zt={bass:-10,mid:-10,high:-10},ma=0,da=0,Mn=-10,zt=0,Ut=0,wt=[],Mt=0,pa=0,ot=0,st=[],fa=null;function aa(e,t,n){let a=Math.max(0,Math.floor(t)),r=Math.min(e.length,Math.max(a+1,Math.ceil(n))),i=0;for(let s=a;s<r;s++)i+=e[s];return i/(r-a)/255}function ao(e,t=44100,n=wn){if(!e||e.length===0)return{bass:0,mid:0,high:0,rms:0};let a=e.length,r=t/n,i=c=>c/r,s=0;for(let c=0;c<a;c++){let d=e[c]/255;s+=d*d}let o=Math.min(1,Math.sqrt(s/a)*1.6),l={bass:[i(Re.bass[0]),i(Re.bass[1])],mid:[i(Re.mid[0]),i(Re.mid[1])],high:[i(Re.high[0]),i(Re.high[1])]};return{bass:aa(e,l.bass[0],l.bass[1]),mid:aa(e,l.mid[0],l.mid[1]),high:aa(e,l.high[0],l.high[1]),rms:o}}function ro(e){if(!e.length)return 0;let t=e.slice().sort((a,r)=>a-r),n=t.length>>1;return t.length%2?t[n]:(t[n-1]+t[n])/2}function io(e,t){return e.length?e.reduce((n,a)=>n+Math.abs(a-t),0)/e.length:0}function Fe(e,t,n,a=Ji,r=eo){let i=t>e?a:r,s=1-Math.exp(-Math.max(0,n)/Math.max(.001,i));return e+(t-e)*s}function Dt(e,t){let n=Number(e);return Number.isFinite(n)&&n>0?n/1e3/3:t}function Je(e,t,n){return Math.min(n,Math.max(t,e))}function oo(e,t,n){let a=Math.pow(.996,Math.max(0,t)*60);yn=Math.max(e,yn*a);let r=Je(Number(n.dynamics?.autoGain??.6),0,1),i=Math.max(.01,Number(n.dynamics?.floor??.04));return Math.max(yn*(1-r*.35),i)}function ra(e,t,n,a){let r=Number(a.agc?.decay??.996),i=Math.pow(r,Math.max(0,n)*60);Vt[e]=Math.max(t,Vt[e]*i);let s=Je(Number(a.agc?.autoGain??a.dynamics?.autoGain??.6),0,1),o=Math.max(.008,Number(a.agc?.floor??a.dynamics?.floor??.03));return Math.max(Vt[e]*(1-s*.35),o)}function Sn(){R.enabled=!1;for(let e of Object.keys(R))e==="syncMode"?R[e]="grid":e==="kickTrigger"||e==="kickOnset"||e==="enabled"||e.endsWith("Onset")?R[e]=!1:R[e]=0;yn=.12,Vt.bass=.12,Vt.mid=.12,Vt.high=.12,Qt.bass=.001,Qt.mid=.001,Qt.high=.001,Jt=0,Ne&&Ne.fill(128),oe=0,xn=0,xt=0,la.fill(0),Ot=0,ca=-10,En=0,Et=0,ua.fill(0),it=-10,Zt.bass=-10,Zt.mid=-10,Zt.high=-10,ma=0,da=0,Mn=-10,zt=0,Ut=0,wt.length=0,Mt=0,pa=0,ot=0,st=[],fa=null,We&&We.fill(0)}function so(e,t){let n=J(),a=Number(n.sync?.minBpm??80),r=Number(n.sync?.maxBpm??180),i=60/r,s=60/a;if(t<i||t>s)return;wt.push(t),wt.length>8&&wt.shift();let o=ro(wt);Mt=o>0?Je(60/o,a,r):0;let l=o>0?io(wt,o)/o:1,c=Je(wt.length/4,0,1);pa=Je((1-l*7)*c,0,1)}function ia(e){let t=e.sync?.bpm;return typeof t=="number"&&Number.isFinite(t)?Je(t,Number(e.sync?.minBpm??80),Number(e.sync?.maxBpm??180)):Mt||Number(e.sync?.fallbackBpm??128)}function oa(e,t,n){let a=Math.max(0,Number(n.sync?.visualLatencyMs??28))/1e3;st.push({at:t+a,strength:Je(e,0,1)}),st.length>8&&st.shift()}function lo(e,t){Mn=t,zt=e,Ut=1,R.kick=e,R.kickFlash=1,R.kickTrigger=!0,R.kickStrength=e}function co(e){if(!st.length)return;let t=[];if(st=st.filter(n=>n.at<=e?(t.push(n),!1):!0),t.length){let n=t.reduce((a,r)=>r.strength>a.strength?r:a);lo(n.strength,e)}}function uo(e){let t=J(),n=ge.context?.sampleRate||44100,a=ge.fftSize||wn,r=ao(Be,n,a);R.syncMode=t.sync?.mode||"grid",R.kickTrigger=!1,R.kickOnset=!1,R.syncMode!==fa&&(st=[],ot=0,fa=R.syncMode);let i=Be.length,s=n/a,o=(I,H)=>[Math.max(1,Math.floor(I/s)),Math.min(i-1,Math.ceil(H/s))],l=o(Re.bass[0],Re.bass[1]),c=o(Re.mid[0],Re.mid[1]),d=o(Re.high[0],Re.high[1]),f=ra("bass",r.bass,e,t),m=ra("mid",r.mid,e,t),h=ra("high",r.high,e,t),u=oo(Math.max(r.bass,r.mid,r.high),e,t),b=(I,H)=>Math.min(1.5,I/H*.7+I/u*.3),y=b(r.bass,f),p=b(r.mid,m),v=b(r.high,h);R.rms=Fe(R.rms,Math.min(1.5,r.rms*2.6),e,to,no),R.bass=Fe(R.bass,y,e),R.mid=Fe(R.mid,p,e),R.high=Fe(R.high,v,e),R.bassFast=Fe(R.bassFast,y,e,ta,na),R.midFast=Fe(R.midFast,p,e,ta,na),R.highFast=Fe(R.highFast,v,e,ta,na),R.bassBody=Fe(R.bassBody,y,e,Dt(t.bassBody?.attackMs,.06),Dt(t.bassBody?.releaseMs,.6)),R.midFlow=Fe(R.midFlow,p,e,Dt(t.midFlow?.attackMs,.08),Dt(t.midFlow?.releaseMs,.5)),R.highShimmer=Fe(R.highShimmer,v,e,Dt(t.highShimmer?.attackMs,.02),Dt(t.highShimmer?.releaseMs,.18)),R.bassSlow=R.bassBody,R.midSlow=R.midFlow,R.highSlow=R.highShimmer;let g=0,E=0;if(Ne&&Ne.length){let I=0;for(let H=0;H<Ne.length;H++){let fe=(Ne[H]-128)/128;I+=fe*fe;let C=Math.abs(fe);C>E&&(E=C)}g=Math.sqrt(I/Ne.length)}let S=Math.max(0,g-Jt);Jt=g,R.waveRms=Fe(R.waveRms,Math.min(1,g*3.5),e,.02,.12),R.transient=Fe(R.transient,Math.min(1,S*18+E*.08),e,.01,.1),R.energy=R.bass*.55+R.mid*.3+R.high*.15,R.level=Math.min(1,R.rms*1.15+R.energy*.22);let w=0,M=0,A=0,L=0,_=0,O=0,U=Number(t.kick?.rangeHz?.[0]??35),$=Number(t.kick?.rangeHz?.[1]??120),T=Math.max(1,Math.floor(U/s)),F=Math.min(i-1,Math.ceil($/s));if(We&&We.length===i)for(let I=0;I<i;I++){let H=Be[I]-We[I];H>0&&(w+=H,I>=T&&I<=F&&(M+=H),I>=l[0]&&I<=l[1]?L+=H:I>=c[0]&&I<=c[1]?_+=H:I>=d[0]&&I<=d[1]&&(O+=H)),We[I]=Be[I]}else{We=new Float32Array(i);for(let I=0;I<i;I++)We[I]=Be[I]}let B=Math.max(1.25,Number(t.agc?.onsetThreshold??1.6)),V=Math.max(5e-4,Number(t.agc?.onsetMinFlux??.0015)),K=Math.max(.06,Number(t.agc?.refractoryMs??140)/1e3),de={bass:L/Math.max(1,l[1]-l[0]+1)/255*5.5,mid:_/Math.max(1,c[1]-c[0]+1)/255*4.2,high:O/Math.max(1,d[1]-d[0]+1)/255*4.8};for(let I of["bass","mid","high"]){let H=de[I],fe=Qt[I],C=H>fe*B&&H>V&&oe-Zt[I]>K;R[`${I}Onset`]=C,C&&(Zt[I]=oe),Qt[I]=fe*.92+H*.08}for(let I=T;I<=F;I++)A+=Be[I];A=A/Math.max(1,F-T+1)/255;let Me=A-da;da=A,w=w/i/255*3.2,M=M/Math.max(1,F-T+1)/255*6.5,la[xn]=w,xn=(xn+1)%bn,xt<bn&&xt++;let Y=0;for(let I=0;I<xt;I++)Y+=la[I];Y=xt>0?Y/xt:0,Ot*=Math.exp(-e/.14),Ot<.001&&(Ot=0),xt===bn&&w>Y*1.55&&w>.012&&oe-ca>.12&&(Ot=1,ca=oe),R.beat=Ot,ua[En]=M,En=(En+1)%sa,Et<sa&&Et++;let te=0;for(let I=0;I<Et;I++)te+=ua[I];te=Et>0?te/Et:0;let ve=Math.max(1.05,Number(t.kick?.threshold??1.55)),he=Math.max(.001,Number(t.kick?.minFlux??.006)),Ye=Mt>0?60/ia(t):0,Xe=Math.max(Math.max(.05,Number(t.kick?.refractoryMs??180)/1e3),Ye*.85),Se=Je(Number(t.kick?.sensitivity??1),.2,4);if(Et>=6&&M>te*ve/Se&&M>he&&A>.04&&Me>.025&&oe-it>Xe){let I=Je(.35+M/Math.max(.001,te*ve)*.45+A*.5,.35,1),H=oe-it;if(it>=0){let fe=60/Number(t.sync?.maxBpm??180),C=60/Number(t.sync?.minBpm??80),k=H;for(;k>0&&k<fe;)k*=2;for(;k>C;)k/=2;H=k,R.kickInterval=H,so(oe,H)}R.kickOnset=!0,it=oe,ma=I,(t.sync?.mode==="kick"||t.sync?.mode==="grid"&&!Mt)&&oa(I,oe,t)}if(t.sync?.mode==="grid"&&(Mt>0||typeof t.sync?.bpm=="number")){let I=60/ia(t);(!ot||ot<oe-I*2)&&(ot=(it>=0?it:oe)+I);let H=0;for(;oe>=ot&&H<2;){let fe=oe-it,C=fe<I*1.45?Math.max(.4,ma*(1-fe/(I*2))):.35;oa(C,ot,t),ot+=I,H++}}let $e=Math.max(.15,Number(t.kick?.decaySec??1.5));zt*=Math.exp(-e/$e),zt<.001&&(zt=0),Ut*=Math.exp(-e/.18),Ut<.001&&(Ut=0),co(oe),R.kick=zt,R.kickFlash=Ut,R.kickFlux=M,R.kickEnergy=A;let ie=ia(t);R.bpm=Mt>0||typeof t.sync?.bpm=="number"?Math.round(ie*10)/10:0,R.tempoConfidence=typeof t.sync?.bpm=="number"?1:pa,R.beatPhase=R.bpm>0&&Mn>=0?(oe-Mn)/(60/R.bpm)%1:0,R.flux=w,R.enabled=!0,oe+=e}async function Qa(){if(en)return!0;if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("getUserMedia no est\xE1 disponible en este navegador");let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});if(vn=e,!Ie||Ie.state==="closed"){let t=window.AudioContext||window.webkitAudioContext;Ie=new t}return Ie.state==="suspended"&&await Ie.resume(),ge=Ie.createAnalyser(),ge.fftSize=wn,ge.smoothingTimeConstant=Zi,Be=new Uint8Array(ge.frequencyBinCount),Ne=new Uint8Array(ge.fftSize||wn),We=null,Jt=0,Xt=Ie.createMediaStreamSource(e),Xt.connect(ge),en=!0,Sn(),!0}function An(e=1/60){if(!en||!ge||!Be){R.enabled&&Sn();return}try{ge.getByteFrequencyData(Be),Ne&&typeof ge.getByteTimeDomainData=="function"&&ge.getByteTimeDomainData(Ne),uo(Math.min(.1,Math.max(.001,e)))}catch{Sn()}}async function Za(){if(en=!1,Xt){try{Xt.disconnect()}catch{}Xt=null}if(ge){try{ge.disconnect()}catch{}ge=null}if(vn){try{vn.getTracks().forEach(e=>e.stop())}catch{}vn=null}if(Ie&&Ie.state!=="closed")try{await Ie.close()}catch{}Ie=null,Be=null,Ne=null,We=null,Jt=0,Sn()}function ee(){return{enabled:en,level:R.level,kick:R.kick,bpm:R.bpm,mode:R.syncMode}}function Ce(){return R}function Ja(){return Be}var et={tunnel:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=ee(),r=Kt("ellipseCount",100,parseInt),i=Kt("ellipseSpacing",10),s=Kt("angleIncrement",.05),o=Kt("ellipseSizeFactor",1),l=s,c=o,d=1;n&&a>.01&&(l=s*(1+a*3),c=o*(1+a*2),d=1+a*4),e.strokeWeight(d),e.colorMode(e.HSB,360,100,100);let f=200,m=a*30,h=40+a*30,u=30+a*40;e.stroke((f+m)%360,h,u),e.background(0,8),e.translate(e.width/2,e.height/2);for(let b=0;b<r;b++){let y=b*i,p=t+b*.1,v=y*c;if(n&&a>.01){let g=Math.sin(p+t*2)*a*30;v+=g}e.ellipse(y*Math.cos(p),y*Math.sin(p),v,v)}t+=l}}},spiral:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=ee();e.background(0,5),e.translate(e.width/2,e.height/2);let r=300,i=Math.min(e.width,e.height)*.45,s=n&&a>.01?1+a*1.5:1;for(let o=0;o<r;o++){let l=o/r*Math.PI*12+t*s,c=o/r*i,d=2+Math.sin(l*3+t)*1.5,f=(220+l*20+t*15)%360,m=25+a*25,h=20+a*35;e.stroke(f,m,h),e.strokeWeight(1+a*2),e.noFill(),e.ellipse(c*Math.cos(l),c*Math.sin(l),d,d)}t+=.02*s}}},mandala:e=>{let t=0,n=12,a=6,r=6,i=Math.PI*2,s=i/r,o=new Float32Array(r),l=new Float32Array(r);for(let c=0;c<r;c++)o[c]=Math.cos(s*c),l[c]=Math.sin(s*c);return{draw:c=>{let d=!!(c&&c.isLite),f=c?.variant==="flower",m=f?d?5:9:d?a:n,{enabled:h,level:u}=ee();e.background(0,8),e.push(),e.translate(e.width/2,e.height/2);let b=h&&u>.01?1+u*1.2:1;t+=(f?.01:.008)*b;let y=new Array(m);for(let p=0;p<m;p++)y[p]=f?6+p*2:8+p*3;for(let p=0;p<m;p++){let v=t*(1+p*(f?.12:.08)),g=f?26+p*30:40+p*35,E=y[p],S=i/E;e.push(),e.rotate(v);for(let w=0;w<E;w++){let M=S*w,A=Math.cos(M),L=Math.sin(M),_=g*A,O=g*L,U=(f?15:20)+Math.sin(v*2+w)*(f?7:10),$=u*15,T=(U+$)/2,F=f?(300+p*16+w*12+t*40)%360:(180+p*15+w*10+t*30)%360,B=(f?42:30)+u*20,V=(f?30:25)+u*30;e.fill(F,B,V),e.stroke(F,B+10,V+10),e.strokeWeight(.5),e.push(),e.translate(_,O),e.rotate(M),e.beginShape();for(let K=0;K<r;K++)e.vertex(T*o[K],T*l[K]);e.endShape(e.CLOSE),e.pop()}e.pop()}e.pop()}}},particles:e=>{let t=[],n=!1;return{draw:()=>{let{enabled:a,level:r}=ee();if(!n){for(let o=0;o<150;o++)t.push({x:Math.random()*e.width,y:Math.random()*e.height,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,size:Math.random()*5+2,hue:Math.random()*360});n=!0}e.background(0,12);let i=a&&r>.01?1+r*2:1;for(let s=0;s<t.length;s++){let o=t[s];o.x+=o.vx*i,o.y+=o.vy*i,(o.x<0||o.x>e.width)&&(o.vx*=-1),(o.y<0||o.y>e.height)&&(o.vy*=-1),o.x=e.constrain(o.x,0,e.width),o.y=e.constrain(o.y,0,e.height);let l=o.size*(1+r*1.5);o.hue=(o.hue+1.5*i)%360;let c=(200+o.hue*.3)%360,d=20+r*15,f=15+r*25;e.fill(c,d,f),e.noStroke(),e.ellipse(o.x,o.y,l,l);for(let m=s+1;m<t.length;m++){let h=t[m],u=e.dist(o.x,o.y,h.x,h.y);if(u<80){let b=e.map(u,0,80,60,0);e.stroke(c,d,f,b),e.strokeWeight(.5),e.line(o.x,o.y,h.x,h.y)}}}}}},waves:e=>{let t=0;return{draw:n=>{let a=n?.variant==="interference",{enabled:r,level:i}=ee();e.background(0,6);let s=r&&i>.01?i:.1;t+=.04*(1+s);let o=a?10:6,l=e.height/2;for(let c=0;c<o;c++){let d=(a?22:40)+c*(a?18:25),f=(a?.028:.015)+c*.008,m=.04+c*.015;e.beginShape(),e.noFill();let h=a?(190+c*11+t*7)%360:(35+c*8+t*5)%360,u=(a?38:25)+i*20,b=(a?30:20)+i*35;e.stroke(h,u,b),e.strokeWeight((a?1:1.5)+i*2);for(let y=0;y<e.width;y+=4){let p=l+Math.sin(y*f+t+c)*d*(1+s)+Math.cos(y*f*.7+t*1.3)*d*.4*s;a&&(p+=Math.sin(y*f*1.7-t*.8+c*1.7)*d*.45,p+=Math.sin(y*.09+t*.6)*10*i),e.vertex(y,p)}e.endShape()}}}},fractal:e=>{let t=0,n=6,a=4,r=4,i=3,s=Math.PI*2;return{draw:o=>{let{enabled:l,level:c}=ee();e.background(0,5),e.push(),e.translate(e.width/2,e.height/2);let d=!!(o&&o.isLite),f=l&&c>.01?1+c*1.5:1;t+=.008*f;let m=d?a:n,h=d?i:r,u=s/m,b=90;function y(p,v,g){if(v===0)return;let E=(190+v*12+t*20)%360,S=30+c*15,w=20+c*25;e.stroke(E,S,w),e.strokeWeight(v*1.5+c*2),e.push(),e.rotate(g),e.line(0,0,0,-p),e.translate(0,-p);for(let M=0;M<m;M++){let A=u*M+t*.4,L=p*.72*(1+c*.25);y(L,v-1,A)}e.pop()}for(let p=0;p<m;p++){let v=u*p;y(b*(1+c*.5),h,v+t)}e.pop()}}},matrix:e=>{let t="01\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3",n=[],a=!1,r=20;return{draw:()=>{let{enabled:i,level:s}=ee();if(!a){for(let l=0;l<50;l++)n.push({x:Math.random()*e.width,y:Math.random()*e.height,speed:Math.random()*5+2,length:Math.floor(Math.random()*20)+5});a=!0}e.background(0,20),e.colorMode(e.HSB,360,100,100);let o=i&&s>.01?1+s*1.5:1;e.textSize(r),e.textAlign(e.CENTER);for(let l of n){l.y+=l.speed*o,l.y>e.height+l.length*r&&(l.y=-l.length*r,l.x=Math.random()*e.width);for(let c=0;c<l.length;c++){let d=l.y-c*r;if(d>0&&d<e.height){let f=e.map(c,0,l.length,80,5),m=140,h=30+s*20,u=15+s*25;e.fill(m,h,u,f);let b=t[Math.floor(Math.random()*t.length)];e.text(b,l.x,d)}}}}}},glitch:e=>{let t=0,n=0;return{draw:()=>{let{enabled:a,level:r}=ee();e.background(0,5),t+=.05;let i=a&&r>.01?r:.1;n=r*30;for(let s=0;s<e.height;s+=3){let o=rt(t+s*.01,.03+r*.08),l=o*n,c=(200+o*20)%360,d=15+r*15,f=10+r*20;e.stroke(c,d,f),e.strokeWeight(.5),e.line(0+l,s,e.width+l,s)}for(let s=0;s<4;s++){let o=t+s*.6,l=e.height/2+Math.sin(o)*80,c=Xn(0,l,o,.15,n*.8),d=(210+s*15)%360,f=20+r*15,m=15+r*25;e.stroke(d,f,m),e.strokeWeight(1.5+r*2),e.noFill(),e.beginShape();for(let h=0;h<e.width;h+=4){let u=l+c+Math.sin(h*.015+o)*25;e.vertex(h,u)}e.endShape()}}}},melt:e=>{let t=0,n=[],a=!1;return{draw:()=>{let{enabled:r,level:i}=ee();if(!a){for(let o=0;o<200;o++)n.push({x:Math.random()*e.width,y:Math.random()*e.height*.3,vx:(Math.random()-.5)*2,vy:Math.random()*2+1,size:Math.random()*8+3,hue:Math.random()*360,melt:0});a=!0}e.background(0,20),t+=.02;let s=r&&i>.01?1+i*2:1;for(let o of n){let l=Qn(o.y,t,i+.3);o.x+=o.vx*s+l*.1,o.y+=o.vy*s,o.y>e.height&&(o.y=-10,o.x=Math.random()*e.width,o.melt=0),o.melt+=.05*s;let c=o.size*(1-o.melt*.1)*(1+i);o.hue=(o.hue+2*s)%360;let d=i*20,f=rt(t+o.x*.01,.08)*d,m=rt(t+o.y*.01,.08)*d*.5,h=(220+o.hue*.2)%360,u=20+i*12,b=15+i*20;e.fill(h,u,b),e.stroke(h,u+5,b+5),e.strokeWeight(.3),e.push(),e.translate(o.x+f,o.y+m),e.rotate(o.melt*.4);let y=Math.sin(o.melt*2)*.2;e.ellipse(0,0,c*(1+y),c*(1+o.melt*.25)),e.pop()}}}},fractalGlitch:e=>{let t=0,n=0;return{draw:()=>{let{enabled:a,level:r}=ee();e.background(0,8),e.translate(e.width/2,e.height/2);let i=a&&r>.01?1+r*1.3:1;t+=.008*i,n+=.04*(1+r);let s=5,o=4,l=130,c=r*15;function d(m,h,u,b=0,y=0){if(h===0||m<8)return;let p=Math.sin(n+h*.3)>.8,v=p?rt(n+h,.15)*c:0,g=gn(b,y,n,.012)*(p?.4:.1),E=(190+h*12+t*10)%360,S=22+r*10,w=16+r*18;e.stroke(E,S,w),e.strokeWeight(h*.7+r*1),e.push(),e.translate(b,y),e.rotate(u+v*.03);let M=g*.03,A=-m+g*.05;e.line(0,0,M,A),e.translate(M,A);let L=Math.PI*2/s;for(let _=0;_<s;_++){let O=L*_+t*.25+v*.01,U=m*.78,$=h-1;$>0&&U>8&&d(U,$,O,0,0)}e.pop()}let f=rt(n,.1)*c*.2;d(l*(1+r*.3),o,t+f*.02)}}},waveGlitch:e=>{let t=0,n=8,a=4,r=3,i=6,s=Math.PI*2,o=[],l=[],c=!1;return{draw:d=>{let f=!!(d&&d.isLite),m=f?a:n,h=f?i:r,{enabled:u,level:b}=ee();if(e.background(0,15),t+=.08,!c){for(let g=0;g<n;g++)o[g]=Math.random()*s,l[g]=Math.random()*s;c=!0}let y=u&&b>.01?b:.1,p=b*40,v=e.height/2;for(let g=0;g<m;g++){let E=(.15+g*.05)*(g%2===0?1:-1),S=40+g*25,w=.015+g*.008,M=.02+g*.01;l[g]+=M*(1+b*.3);let A=(Math.sin(l[g])+1)/2,L=S*.3,_=S*1.5,O=L+A*(_-L);o[g]+=E*(1+b*.5),e.beginShape(),e.noFill();let U=(30+g*6+t*8)%360,$=20+b*15,T=18+b*28;e.stroke(U,$,T),e.strokeWeight(1.2+b*1.5);for(let F=0;F<e.width;F+=h){let B=F*w+o[g]+g*.5,V=v+Math.sin(B)*O*(1+y);V+=Math.sin(t*.3+g*.4)*10*y;let K=rt(t+F*.01+g,.06+b*.04)*p*.7,de=rt(t+F*.015+g*.5,.08)*p*.4,Me=Xn(F,V,t+g,.12,p*.25),Y=Qn(V,t+g*.25,b*.4)*.2;V+=de+Me+Y;let te=F+K;e.vertex(te,V)}e.endShape()}}}},sacredGeometry:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=ee();e.background(0,4),e.translate(e.width/2,e.height/2);let r=n&&a>.01?1+a*1.2:1;t+=.006*r;let i=10,s=60;for(let o=0;o<i;o++){let l=t*(1+o*.05),c=s+o*30,d=6+o*2;e.push(),e.rotate(l);let f=(180+o*8+t*10)%360,m=25+a*12,h=18+a*22;e.stroke(f,m,h),e.strokeWeight(1+o*.1+a*1.5),e.noFill(),e.beginShape();for(let u=0;u<d;u++){let b=Math.PI*2/d*u,y=c*(1+Math.sin(l*2+u)*.1*a);e.vertex(y*Math.cos(b),y*Math.sin(b))}e.endShape(e.CLOSE),e.pop()}}}},biomech:e=>{let t=0,n=[],a=!1,r=null;return{draw:i=>{let s=i?.variant==="coral"||i?.variant==="tendril"?i.variant:"biomech",o=s==="coral",l=s==="tendril",{enabled:c,level:d}=ee();if(!a||r!==s){n.length=0,r=s;let m=o?12:l?6:8;for(let h=0;h<m;h++)n.push({x:e.width/(m+1)*(h+1),y:e.height/2,size:o?28+Math.random()*18:l?62+Math.random()*28:40+Math.random()*30,rotation:Math.random()*Math.PI*2,segments:o?10+Math.floor(Math.random()*7):l?5+Math.floor(Math.random()*3):8+Math.floor(Math.random()*6)});a=!0}e.background(0,6),t+=.02;let f=c&&d>.01?1+d*1.3:1;for(let m of n){m.rotation+=(o?.006:l?.012:.003)*f,e.push(),e.translate(m.x,m.y),e.rotate(m.rotation),l&&e.scale(.55,1.55),o&&e.scale(1.08,1);let h=o?(12+m.x*.05+t*3)%360:l?(285+m.x*.08+t*4)%360:(200+m.x*.1+t*5)%360,u=(o?48:l?35:18)+d*12,b=(o?28:l?24:12)+d*20;e.stroke(h,u,b),e.strokeWeight(1.5+d*2),e.noFill();let y=o?.45:l?.14:.3;e.beginShape();for(let v=0;v<m.segments;v++){let g=Math.PI*2/m.segments*v,E=gn(m.x,m.y,t+v,.05)*y,S=m.size*(1+E)*(1+d*.3);e.vertex(S*Math.cos(g),S*Math.sin(g))}e.endShape(e.CLOSE);let p=o?4:l?2:3;for(let v=0;v<p;v++){let g=m.size*(l?.2+v*.28:.3+v*.2);e.beginShape();for(let E=0;E<m.segments;E++){let S=Math.PI*2/m.segments*E+t*.1,w=gn(m.x,m.y,t+E,.08)*(o?.3:.2),M=g*(1+w);e.vertex(M*Math.cos(S),M*Math.sin(S))}e.endShape(e.CLOSE)}e.pop()}}}},dune:e=>{let t=0,n=4,a=2,r=6,i=Math.PI*2/r,s=new Float32Array(r),o=new Float32Array(r),l=new Float32Array(r),c=new Float32Array(r);for(let d=0;d<r;d++)s[d]=Math.cos(i*d),o[d]=Math.sin(i*d),l[d]=Math.cos(i*d+Math.PI/6),c[d]=Math.sin(i*d+Math.PI/6);return{draw:d=>{let f=!!(d&&d.isLite),m=f?a:n,{enabled:h,level:u}=ee();e.background(0,5),t+=.03;let b=h&&u>.01?u:.1,y=e.height*.6,p=f?4:2;for(let M=0;M<m;M++){let A=30+M*20,L=.01+M*.005,_=.03+M*.01;e.beginShape(),e.noFill();let O=(25+M*3+t*2)%360,U=20+u*15,$=15+u*25;e.stroke(O,U,$),e.strokeWeight(2+u*2);for(let T=0;T<e.width;T+=p){let F=y+Math.sin(T*L+t*_+M)*A*(1+b)+Math.cos(T*L*.6+t*1.2)*A*.3*b;e.vertex(T,F)}e.endShape()}e.push(),e.translate(e.width/2,e.height*.3);let v=80+u*40,g=t*.02;e.push(),e.rotate(g);let E=(30+t*3)%360,S=15+u*10,w=20+u*20;e.stroke(E,S,w),e.strokeWeight(1.5+u*1.5),e.noFill();for(let M=0;M<r;M++){let A=v*s[M],L=v*o[M],_=v*.6*l[M],O=v*.6*c[M];e.line(A,L,_,O)}e.pop(),e.pop()}}},yinYang:e=>{let t=0,n=.03;return{draw:()=>{let{enabled:a,level:r}=ee(),i=a&&r>.01?1+r*.6:1;e.colorMode(e.RGB),e.background(150,150,150),e.colorMode(e.HSB,360,100,100),e.translate(e.width/2,e.height/2),e.rotate(t);let s=Math.min(e.width,e.height)*.62,o=s/2;e.noStroke(),e.fill(0,0,100),e.circle(0,0,s),e.fill(0,0,0),e.arc(0,0,s,s,e.HALF_PI,e.PI+e.HALF_PI,e.PIE),e.fill(0,0,100),e.circle(0,-o/2,o),e.fill(0,0,0),e.circle(0,o/2,o),e.fill(0,0,0),e.circle(0,-o/2,o/4),e.fill(0,0,100),e.circle(0,o/2,o/4);let l=33e-5*i;n+=l;let c=.84*i;n>c&&(n=c),t+=n*i}}}};console.log("Umbral Vision - Efectos cargados:",Object.keys(et));var De=class{constructor(t={}){this.params={},this.time=0,this.elapsed=0,this._resetParams(),t&&this.setParameters(t)}_resetParams(){for(let[t,n]of Object.entries(this.constructor.schema))this.params[t]=n.default}setParameters(t){if(!t)return[];let n=this.constructor.schema,a=[];for(let[r,i]of Object.entries(t)){let s=n[r];if(!s)continue;let o;if(s.type==="boolean")o=!!i;else{if(o=Number(i),!Number.isFinite(o))continue;s.type==="int"&&(o=Math.round(o)),typeof s.min=="number"&&(o=Math.max(s.min,o)),typeof s.max=="number"&&(o=Math.min(s.max,o))}o!==this.params[r]&&(this.params[r]=o,a.push(r))}return a}getParameters(){return{...this.params}}getSchema(){return this.constructor.schema}update(t,n){this.time+=t,this.elapsed+=t}render(t){throw new Error("Effect.render() must be implemented")}onResize(t,n){}initialize(){}dispose(){}};je(De,"schema",{});function er(e,t,n,a){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let i=e.getShaderInfoLog(r);throw e.deleteShader(r),new Error(`[${a}] shader compile error:
${i}
${n}`)}return r}var se=class{constructor(t,n,a,r="program"){this.gl=t,this.name=r,this.disposed=!1;let i=er(t,t.VERTEX_SHADER,n,`${r}:vs`),s=er(t,t.FRAGMENT_SHADER,a,`${r}:fs`),o=t.createProgram();if(t.attachShader(o,i),t.attachShader(o,s),t.linkProgram(o),!t.getProgramParameter(o,t.LINK_STATUS)){let l=t.getProgramInfoLog(o);throw t.deleteProgram(o),t.deleteShader(i),t.deleteShader(s),new Error(`[${r}] program link error:
${l}`)}t.deleteShader(i),t.deleteShader(s),this.program=o,this.uniforms=new Map,this._introspect()}_introspect(){let t=this.gl,n=t.getProgramParameter(this.program,t.ACTIVE_UNIFORMS);for(let a=0;a<n;a++){let r=t.getActiveUniform(this.program,a);if(!r)continue;let i=r.name.replace(/\[0\]$/,"");this.uniforms.set(i,{location:t.getUniformLocation(this.program,r.name),type:r.type,size:r.size})}}use(){return this.gl.useProgram(this.program),this}has(t){return this.uniforms.has(t)}location(t){let n=this.uniforms.get(t);return n?n.location:null}set(t,n){let a=this.uniforms.get(t);if(!a||a.location===null)return this;let r=this.gl;switch(a.type){case r.FLOAT:r.uniform1f(a.location,n);break;case r.FLOAT_VEC2:r.uniform2fv(a.location,n);break;case r.FLOAT_VEC3:r.uniform3fv(a.location,n);break;case r.FLOAT_VEC4:r.uniform4fv(a.location,n);break;case r.INT:case r.BOOL:case r.SAMPLER_2D:case r.SAMPLER_CUBE:r.uniform1i(a.location,n);break;case r.INT_VEC2:r.uniform2iv(a.location,n);break;case r.INT_VEC3:r.uniform3iv(a.location,n);break;case r.INT_VEC4:r.uniform4iv(a.location,n);break;case r.FLOAT_MAT3:r.uniformMatrix3fv(a.location,!1,n);break;case r.FLOAT_MAT4:r.uniformMatrix4fv(a.location,!1,n);break;default:break}return this}dispose(){this.disposed||(this.disposed=!0,this.uniforms.clear(),this.program&&(this.gl.deleteProgram(this.program),this.program=null))}};var tr={rgba8:{internal:"RGBA8",type:"UNSIGNED_BYTE"},rgba16f:{internal:"RGBA16F",type:"HALF_FLOAT"},rgba32f:{internal:"RGBA32F",type:"FLOAT"}};function ke(e,t){let n=tr[t];if(!n)return!1;let a=e[n.internal],r=e[n.type];if(a==null||r==null)return!1;let i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,a,1,1,0,e.RGBA,r,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST);let s=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,s),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0);let o=e.checkFramebufferStatus(e.FRAMEBUFFER);return e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(s),e.deleteTexture(i),o===e.FRAMEBUFFER_COMPLETE}var ue=class{constructor(t,n){this.gl=t,this.format=n.format||"rgba16f",this.filterMode=n.filter||"linear",this.needsDepth=!!n.depth,this.width=0,this.height=0,this.texture=null,this.fbo=null,this.depthBuffer=null,this.disposed=!1,this.resize(Math.max(1,n.width|0),Math.max(1,n.height|0))}resize(t,n){if(this.disposed||(t=Math.max(1,t|0),n=Math.max(1,n|0),t===this.width&&n===this.height))return;this.width=t,this.height=n;let a=this.gl;this.texture||(this.texture=a.createTexture()),this.fbo||(this.fbo=a.createFramebuffer());let r=tr[this.format],i=a[r.internal],s=a[r.type],l=!(this.format==="rgba16f"||this.format==="rgba32f")||!!(a.getExtension("OES_texture_float_linear")||a.getExtension("OES_texture_half_float_linear")),c=this.filterMode==="nearest"||!l?a.NEAREST:a.LINEAR;a.bindTexture(a.TEXTURE_2D,this.texture),a.texImage2D(a.TEXTURE_2D,0,i,t,n,0,a.RGBA,s,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,c),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,c),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindTexture(a.TEXTURE_2D,null),a.bindFramebuffer(a.FRAMEBUFFER,this.fbo),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,this.texture,0),this.needsDepth&&(this.depthBuffer||(this.depthBuffer=a.createRenderbuffer()),a.bindRenderbuffer(a.RENDERBUFFER,this.depthBuffer),a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_COMPONENT24,t,n),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,this.depthBuffer),a.bindRenderbuffer(a.RENDERBUFFER,null)),a.bindFramebuffer(a.FRAMEBUFFER,null)}bind(){let t=this.gl;return t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.viewport(0,0,this.width,this.height),this}dispose(){if(this.disposed)return;this.disposed=!0;let t=this.gl;this.texture&&t.deleteTexture(this.texture),this.fbo&&t.deleteFramebuffer(this.fbo),this.depthBuffer&&t.deleteRenderbuffer(this.depthBuffer),this.texture=null,this.fbo=null,this.depthBuffer=null}};function lt(e){let t=e.createVertexArray(),n=e.createBuffer();return e.bindVertexArray(t),e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),{vao:t,draw(){e.bindVertexArray(t),e.drawArrays(e.TRIANGLE_STRIP,0,4)},dispose(){e.deleteBuffer(n),e.deleteVertexArray(t)}}}function nr(e){let t=e.createVertexArray(),n=e.createBuffer();return e.bindVertexArray(t),e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),{vao:t,drawInstanced(a){e.bindVertexArray(t),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,a)},dispose(){e.deleteBuffer(n),e.deleteVertexArray(t)}}}var pe=`#version 300 es
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
`,ar=`
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
`,tt=`
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
`;var rr=`
vec3 acesFilm(vec3 x) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
`;var ir=`${pe}
${Gt}
${ct}
${ar}
${tt}

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
`,or=`#version 300 es
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
${tt}

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
`,sr=`${pe}

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
`;function mo(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function Tn(e,t,n=new Float32Array(16)){for(let a=0;a<4;a++){let r=t[a*4],i=t[a*4+1],s=t[a*4+2],o=t[a*4+3];n[a*4]=e[0]*r+e[4]*i+e[8]*s+e[12]*o,n[a*4+1]=e[1]*r+e[5]*i+e[9]*s+e[13]*o,n[a*4+2]=e[2]*r+e[6]*i+e[10]*s+e[14]*o,n[a*4+3]=e[3]*r+e[7]*i+e[11]*s+e[15]*o}return n}function Fn(e,t,n,a,r=new Float32Array(16)){let i=1/Math.tan(e/2),s=1/(n-a);return r.fill(0),r[0]=i/t,r[5]=i,r[10]=(a+n)*s,r[11]=-1,r[14]=2*a*n*s,r}function Rn(e,t,n,a=new Float32Array(16)){let r=e[0]-t[0],i=e[1]-t[1],s=e[2]-t[2],o=Math.hypot(r,i,s)||1;r/=o,i/=o,s/=o;let l=n[1]*s-n[2]*i,c=n[2]*r-n[0]*s,d=n[0]*i-n[1]*r;o=Math.hypot(l,c,d)||1,l/=o,c/=o,d/=o;let f=i*d-s*c,m=s*l-r*d,h=r*c-i*l;return a[0]=l,a[1]=f,a[2]=r,a[3]=0,a[4]=c,a[5]=m,a[6]=i,a[7]=0,a[8]=d,a[9]=h,a[10]=s,a[11]=0,a[12]=-(l*e[0]+c*e[1]+d*e[2]),a[13]=-(f*e[0]+m*e[1]+h*e[2]),a[14]=-(r*e[0]+i*e[1]+s*e[2]),a[15]=1,a}function lr(e,t=new Float32Array(16)){let n=Math.cos(e),a=Math.sin(e);return t.set(mo()),t[0]=n,t[2]=-a,t[8]=a,t[10]=n,t}function Pe(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let a=t;return a=Math.imul(a^a>>>15,a|1),a^=a+Math.imul(a^a>>>7,a|61),((a^a>>>14)>>>0)/4294967296}}function ut(e,t){return Number.isFinite(Number(e))?Number(e):t}var Ke=class{constructor(){this.kickPos=0,this.kickVel=0,this.flowPhase=0}update(t,n,a,r,i=1){let s=a.effects?.[r]||{},o=ut(s.kick,1),l=ut(s.mid,1),c=a.kick||{};i>0&&n?.kickTrigger&&(this.kickVel+=ut(n.kickStrength,1)*ut(c.depth,.7)*o*6*i);let d=ut(c.spring,18),f=ut(c.damping,4.5);this.kickVel+=(-d*this.kickPos-f*this.kickVel)*t,this.kickPos+=this.kickVel*t,this.kickPos=Math.max(-1.2,Math.min(1.2,this.kickPos));let m=ut(n?.midFlow,0)*l*i;return this.flowPhase+=t*(.18+m*ut(a.midFlow?.waveSpeed,.8)*1.6),this}};var cr=Math.PI*2,ha={density:{type:"number",default:.9,min:.1,max:1,label:"Densidad",group:"Forma"},speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},amplitude:{type:"number",default:.62,min:0,max:2,label:"Amplitud",group:"Movimiento"},complexity:{type:"number",default:.62,min:0,max:1,label:"Complejidad",group:"Forma"},turbulence:{type:"number",default:.55,min:0,max:1.5,label:"Turbulencia",group:"Movimiento"},hue:{type:"number",default:.56,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.9,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.68,min:.2,max:4,label:"Glow",group:"Apariencia"},particleSize:{type:"number",default:1,min:.4,max:3,label:"Tama\xF1o",group:"Forma"},bloom:{type:"number",default:.85,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.98,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:4,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:1,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},js=Object.freeze(["membrane","torus","ribbon","smoke","swarm"]),fo=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0});function po(e,t,n=1){let a=t*t,r=new Float32Array(a*4),i=new Float32Array(a*4),s=new Float32Array(a*4),o=Pe(n|0||1),l=e|0;for(let c=0;c<t;c++)for(let d=0;d<t;d++){let f=(c*t+d)*4,m=(d+.5+c*.61803398875)%t/t,h=(c+.5)/t*2-1,u=m*cr,b=o(),y=o(),p=o(),v,g,E;if(l===1){let w=h*Math.PI,M=1.05+.1*Math.sin(u*3),A=.42,L=M+A*Math.cos(w+Math.sin(u*2)*.18);v=Math.cos(u)*L,g=A*Math.sin(w)+.08*Math.sin(u*4),E=Math.sin(u)*L}else if(l===2){let w=h*1.25,M=u+w,A=1.22+.16*Math.cos(h*Math.PI*2.2);v=Math.cos(M)*A,g=h*1.65+.16*Math.sin(u*2+h*2.4),E=Math.sin(M)*A}else if(l===3){let M=1.08+(Math.sin(u*3+h*5)*.24+Math.sin(u*7-h*2.2)*.12)+.2*Math.cos(h*Math.PI*1.4);v=Math.cos(u)*M+.16*Math.sin(h*8+u*2),g=h*1.75+.22*Math.sin(u*4+h*3),E=Math.sin(u)*M+.12*Math.cos(h*7-u*1.6)}else if(l===4){let w=Math.floor(m*3),M=u*3+h*.9+w*2.1,A=.92+.34*Math.cos(h*Math.PI*2)+w*.1;v=Math.cos(M)*A+.24*Math.sin(w*2.1+h*3),g=h*1.35+.34*Math.sin(m*cr*5+w)+(w-1)*.35,E=Math.sin(M)*A+.24*Math.cos(w*1.7-h*2.4)}else{let w=Math.sin(u*3+h*2.2)*.2+Math.sin(u*5-h*1.7)*.07,M=1.28+.3*Math.cos(h*Math.PI*.92)+w;v=Math.cos(u)*M+.1*Math.sin(u*4+h*3),g=h*1.95+.2*Math.sin(u*2+h*3.4),E=Math.sin(u)*M}r[f]=v,r[f+1]=g,r[f+2]=E,r[f+3]=(m+h*.08+1)%1;let S=.035;s[f]=v+(o()-.5)*S,s[f+1]=g+(o()-.5)*S,s[f+2]=E+(o()-.5)*S,s[f+3]=o()*.7,i[f]=(b-.5)*.08,i[f+1]=(y-.5)*.08,i[f+2]=(p-.5)*.08,i[f+3]=b}return{home:r,pos:s,vel:i}}var tn=class extends De{constructor(t,n={}){if(super(n),this.renderer=t,this.particleSize=t.quality.particleSize,this.particleCount=this.particleSize*this.particleSize,this.gl=t.gl,this.sceneFormat=ke(this.gl,"rgba16f")?"rgba16f":"rgba8",this.simFormat=ke(this.gl,"rgba32f")?"rgba32f":ke(this.gl,"rgba16f")?"rgba16f":null,this.programs=[],this.state=null,this.homeTexture=null,this.sceneTarget=null,this.sprite=null,this.fullscreen=null,this.viewProj=new Float32Array(16),this.eye=[0,0,4.8],this.lightPos=[2.2,1.8,2.4],this.lastAudio=null,this.motion=new Ke,this.signals={body:0,mid:0,high:0,rms:0,kickPos:0,kickImpulse:0},!this.simFormat)throw new Error("WebGL 2 sin soporte de render a texturas float (se requiere EXT_color_buffer_float)");this._initialize()}_initialize(){let t=this.gl;this.updateProgram=new se(t,`#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,ir,"fluid:update"),this.renderProgram=new se(t,or,sr,"fluid:render"),this.programs.push(this.updateProgram,this.renderProgram),this.sprite=nr(t),this.fullscreen=lt(t),this.sceneTarget=new ue(t,{width:this.renderer.width,height:this.renderer.height,format:this.sceneFormat,filter:"linear"}),this._createHomeAndState()}_createHomeAndState(){let t=this.gl,n=this.particleSize,a=po(this.params.variant|0,n,this.params.seed|0||1);this.homeTexture=this._createTexture(n,a.home);let r=this._createTexture(n,a.pos),i=this._createTexture(n,a.vel),s=this._createTexture(n,null),o=this._createTexture(n,null),l=t.createFramebuffer();this.state={fbo:l,posA:r,velA:i,posB:s,velB:o,read:"a"},t.bindFramebuffer(t.FRAMEBUFFER,l),t.drawBuffers([t.COLOR_ATTACHMENT0,t.COLOR_ATTACHMENT1]),t.bindFramebuffer(t.FRAMEBUFFER,null)}_createTexture(t,n){let a=this.gl,r=a.createTexture(),i=a.FLOAT;return a.bindTexture(a.TEXTURE_2D,r),a.texImage2D(a.TEXTURE_2D,0,this.simFormat==="rgba32f"?a.RGBA32F:a.RGBA16F,t,t,0,a.RGBA,i,n),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindTexture(a.TEXTURE_2D,null),r}initialize(){}setParameters(t){let n=super.setParameters(t);return(n.includes("seed")||n.includes("variant"))&&this.state&&this._rebuildState(),n}_rebuildState(){this._destroyState(),this._createHomeAndState()}_destroyState(){let t=this.gl;this.state&&(t.deleteTexture(this.state.posA),t.deleteTexture(this.state.posB),t.deleteTexture(this.state.velA),t.deleteTexture(this.state.velB),t.deleteFramebuffer(this.state.fbo),this.state=null),this.homeTexture&&(t.deleteTexture(this.homeTexture),this.homeTexture=null)}update(t,n=fo){super.update(t,n),this.lastAudio=n;let a=this.params,r=a.audio>0&&n.enabled?a.audio:0,i=J(),s=i.effects?.fluidFields||{},o=this.motion.update(t,n,i,"fluidFields",r),l=(n.bassBody||0)*r*Number(s.body??1),c=(n.midFlow||0)*r*Number(s.mid??1),d=(n.highShimmer||0)*r*Number(s.high??1),f=(n.rms||0)*r,m=o.kickPos*Number(s.kick??1),h=n.kickTrigger?(n.kickStrength||1)*Number(s.kick??1):0;this.signals={body:l,mid:c,high:d,rms:f,kickPos:m,kickImpulse:h},this._stepSimulation(Math.min(.033,Math.max(0,t)),n);let u=this.time,b=this.renderer.pointer||{x:0,y:0},y=m*Number(i.kick?.cameraDolly??.03)*8,p=l*Number(i.bassBody?.scale??.05)*2,v=4.9-y-p+Math.sin(u*.09)*.35,g=u*.11+o.flowPhase*.12+b.x*.22;this.eye=[Math.sin(g)*v,Math.sin(u*.07)*1.15+b.y*.9+m*.3,Math.cos(g)*v];let E=Rn(this.eye,[0,0,0],[0,1,0]),S=Fn(55*Math.PI/180,this.renderer.width/Math.max(1,this.renderer.height),.1,40);Tn(S,E,this.viewProj),this.lightPos=[Math.sin(u*.23)*2.6,1.7+Math.cos(u*.17)*.9,Math.cos(u*.23)*2.8]}_stepSimulation(t,n){let a=this.gl,r=this.state,i=this.params,s=this.signals,o=r.read==="a"?r.posA:r.posB,l=r.read==="a"?r.velA:r.velB,c=r.read==="a"?r.posB:r.posA,d=r.read==="a"?r.velB:r.velA;a.bindFramebuffer(a.FRAMEBUFFER,r.fbo),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,c,0),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT1,a.TEXTURE_2D,d,0),a.viewport(0,0,this.particleSize,this.particleSize),a.disable(a.BLEND),a.disable(a.DEPTH_TEST),this.updateProgram.use().set("uPos",0).set("uVel",1).set("uHome",2).set("uTime",this.time).set("uDt",t).set("uSpeed",i.speed).set("uAmplitude",i.amplitude).set("uComplexity",i.complexity).set("uTurbulence",i.turbulence).set("uAudioBass",s.body).set("uAudioMid",s.mid).set("uAudioHigh",s.high).set("uAudioRms",s.rms).set("uKick",s.kickPos).set("uKickImpulse",s.kickImpulse).set("uAudioAmount",1),this._bindTexture(o,0),this._bindTexture(l,1),this._bindTexture(this.homeTexture,2),this.fullscreen.draw(),a.bindFramebuffer(a.FRAMEBUFFER,null),r.read=r.read==="a"?"b":"a"}_bindTexture(t,n){let a=this.gl;a.activeTexture(a.TEXTURE0+n),a.bindTexture(a.TEXTURE_2D,t)}render(t){let n=this.gl,a=this.params,r=this.state,i=this.signals,s=r.read==="a"?r.posA:r.posB,o=r.read==="a"?r.velA:r.velB;this.sceneTarget.bind(),n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ONE),n.disable(n.DEPTH_TEST),n.disable(n.CULL_FACE);let l=Math.max(1,Math.floor(this.particleCount*a.density)),c=[this.sceneTarget.width,this.sceneTarget.height];this.renderProgram.use().set("uPos",0).set("uVel",1).set("uHome",2).set("uViewProj",this.viewProj).set("uResolution",c).set("uTime",this.time).set("uPointSize",a.particleSize*1.95).set("uOpacity",.62).set("uGlow",a.glow).set("uHue",a.hue).set("uSaturation",a.saturation).set("uStretch",t.quality.trailLength).set("uLightPos",this.lightPos).set("uLightPower",1.35+i.rms*.8).set("uAudioHigh",i.high).set("uAudioRms",i.rms).set("uKick",i.kickPos).set("uAudioAmount",1),this._bindTexture(s,0),this._bindTexture(o,1),this._bindTexture(this.homeTexture,2),this.sprite.drawInstanced(l),n.disable(n.BLEND),n.bindFramebuffer(n.FRAMEBUFFER,null)}setAudioFeatures(t){this.lastAudio=t}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.3,bloomKnee:.26,exposure:t.exposure,vignette:.55,grain:.028,aberration:.014,time:this.time}}getSceneTarget(){return this.sceneTarget}onResize(t,n){this.sceneTarget&&this.sceneTarget.resize(t,n)}dispose(){for(let t of this.programs)t.dispose();this.programs=[],this.sprite&&this.sprite.dispose(),this.fullscreen&&this.fullscreen.dispose(),this.sceneTarget&&this.sceneTarget.dispose(),this._destroyState(),this.sprite=null,this.fullscreen=null,this.sceneTarget=null}};je(tn,"schema",ha);var Cn=class{constructor(t,n){this.gl=t,this.vao=t.createVertexArray(),this.buffers=[],this.vertexCount=n.positions.length/3,this.indexCount=n.indices.length,t.bindVertexArray(this.vao),this.positionBuffer=this._buffer(t.ARRAY_BUFFER,n.positions,3),this.normalBuffer=this._buffer(t.ARRAY_BUFFER,n.normals,3,1),this.uvBuffer=this._buffer(t.ARRAY_BUFFER,n.uvs,2,2),this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,n.indices,t.STATIC_DRAW),this.buffers.push(this.indexBuffer),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null)}_buffer(t,n,a,r=0){let i=this.gl,s=i.createBuffer();return i.bindBuffer(t,s),i.bufferData(t,n,i.STATIC_DRAW),i.enableVertexAttribArray(r),i.vertexAttribPointer(r,a,i.FLOAT,!1,0,0),this.buffers.push(s),s}draw(){let t=this.gl;t.bindVertexArray(this.vao),t.drawElements(t.TRIANGLES,this.indexCount,t.UNSIGNED_INT,0),t.bindVertexArray(null)}dispose(){let t=this.gl;for(let n of this.buffers)t.deleteBuffer(n);this.buffers=[],t.deleteVertexArray(this.vao),this.vao=null}};var ur=`#version 300 es
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
`,mr=`${pe}
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
${tt}

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
`;var Oe=Math.PI*2;function ga(e,t,n){let a=Math.max(24,e.segmentsU??240),r=Math.max(8,e.segmentsV??56),i=e.twist??0,s=e.seed??1,l=Pe(s)()*Oe,c=a*r,d=new Float32Array(c*3),f=new Float32Array(c*3),m=new Float32Array(c*2),h=new Uint32Array(a*r*6),u=.001,b=[0,1,0];for(let p=0;p<r;p++){let v=p/r,g=v*Oe;for(let E=0;E<a;E++){let S=E/a,w=(p*a+E)*3,M=(p*a+E)*2,A=t(S),L=t(S+u),_=L[0]-A[0],O=L[1]-A[1],U=L[2]-A[2],$=Math.hypot(_,O,U)||1;_/=$,O/=$,U/=$;let T=O*b[2]-U*b[1],F=U*b[0]-_*b[2],B=_*b[1]-O*b[0],V=Math.hypot(T,F,B);V<1e-4&&(T=O*0-U*1,F=U*1-_*0,B=_*0-O*1,V=Math.hypot(T,F,B)||1),T/=V,F/=V,B/=V;let K=O*B-U*F,de=U*T-_*B,Me=_*F-O*T,Y=g+i*S*Oe,te=Math.cos(Y),ve=Math.sin(Y),he=n(S,g,l),Ye=T*te+K*ve,Xe=F*te+de*ve,Se=B*te+Me*ve;d[w]=A[0]+Ye*he,d[w+1]=A[1]+Xe*he,d[w+2]=A[2]+Se*he,f[w]=Ye,f[w+1]=Xe,f[w+2]=Se,m[M]=S,m[M+1]=v}}let y=0;for(let p=0;p<r;p++){let v=(p+1)%r;for(let g=0;g<a;g++){let E=(g+1)%a,S=p*a+g,w=p*a+E,M=v*a+g,A=v*a+E;h[y++]=S,h[y++]=M,h[y++]=w,h[y++]=w,h[y++]=M,h[y++]=A}}return{positions:d,normals:f,uvs:m,indices:h}}function ho(e){let t=Math.max(24,e.segmentsU??240),n=Math.max(12,e.segmentsV??56),a=e.scale??.95,r=e.seed??1,i=Pe(r)()*Oe,s=t*n,o=new Float32Array(s*3),l=new Float32Array(s*3),c=new Float32Array(s*2),d=new Uint32Array(t*(n-1)*6);for(let m=0;m<n;m++){let h=m/(n-1),u=h*Math.PI,b=Math.sin(u),y=Math.cos(u);for(let p=0;p<t;p++){let v=p/t,g=v*Oe,E=1+.16*Math.sin(g*3+i)*Math.sin(u*2)+.1*Math.sin(g*5-u*3+i*.7)+.06*Math.sin(g*8+u*4),S=a*.9*E,w=(m*t+p)*3,M=(m*t+p)*2,A=b*Math.cos(g),L=y,_=b*Math.sin(g);o[w]=A*S,o[w+1]=L*S,o[w+2]=_*S,l[w]=A,l[w+1]=L,l[w+2]=_,c[M]=v,c[M+1]=h}}let f=0;for(let m=0;m<n-1;m++)for(let h=0;h<t;h++){let u=(h+1)%t,b=m*t+h,y=m*t+u,p=(m+1)*t+h,v=(m+1)*t+u;d[f++]=b,d[f++]=p,d[f++]=y,d[f++]=y,d[f++]=p,d[f++]=v}return{positions:o,normals:l,uvs:c,indices:d}}function dr(e={}){let t=e.variant|0,n=e.scale??.95,a=e.tube??.24;return t===1?ho(e):t===2?ga(e,r=>{let i=r*Oe;return[(Math.sin(2*i)+.8*Math.sin(5*i))*n*.72,(Math.cos(3*i)+.5*Math.cos(7*i))*n*.72,Math.sin(4*i)*n*.9]},(r,i,s)=>{let o=r*Oe;return a*1.15*(1+.3*Math.sin(o*9+s)+.18*Math.sin(o*17-i*3))}):t===3?ga(e,r=>{let i=r*Oe;return[Math.sin(i)*n*1.1,(Math.cos(i)*.45+.25*Math.sin(4*i))*n,Math.cos(2*i)*n*.9]},(r,i,s)=>{let o=r*Oe,l=.5+.5*Math.sin(o*24+s);return a*(.72+.42*l+.12*Math.sin(i*4+s))}):ga(e,r=>{let i=r*Oe;return[(Math.sin(i)+2*Math.sin(2*i))*n,(Math.cos(i)-2*Math.cos(2*i))*n,-Math.sin(3*i)*n]},(r,i,s)=>{let o=r*Oe;return a*(1+.22*Math.sin(o*3+i*2+s)+.1*Math.sin(o*5-i*3+s*.7))})}var va={speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},amplitude:{type:"number",default:.26,min:0,max:.9,label:"Deformaci\xF3n",group:"Forma"},frequency:{type:"number",default:1.35,min:.3,max:4,label:"Frecuencia",group:"Forma"},twist:{type:"number",default:0,min:0,max:1,label:"Torsi\xF3n",group:"Forma"},hue:{type:"number",default:.53,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.95,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.95,min:.2,max:4,label:"Glow",group:"Apariencia"},opacity:{type:"number",default:.85,min:.05,max:1,label:"Opacidad",group:"Apariencia"},bloom:{type:"number",default:.85,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.95,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:3,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:3,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},kn=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0,bassBody:0,midFlow:0,highShimmer:0,kick:0,kickTrigger:!1,kickStrength:0}),fr={lite:{u:170,v:42},high:{u:260,v:60},ultra:{u:360,v:84}},nn=class extends De{constructor(t,n={}){super(n),this.renderer=t,this.gl=t.gl,this.sceneFormat=ke(this.gl,"rgba16f")?"rgba16f":"rgba8",this.sceneTarget=new ue(this.gl,{width:t.width,height:t.height,format:this.sceneFormat}),this.program=new se(this.gl,ur,mr,"organic:render"),this.mesh=null,this.model=new Float32Array(16),this.viewProj=new Float32Array(16),this.eye=[0,1.5,7],this.lastAudio=kn,this.motion=new Ke,this._buildMesh()}_buildMesh(){let t=fr[this.renderer.quality.name]||fr.high,n=dr({segmentsU:t.u,segmentsV:t.v,tube:.26,scale:.95,twist:this.params.twist,seed:this.params.seed|0,variant:this.params.variant|0});this.mesh&&this.mesh.dispose(),this.mesh=new Cn(this.gl,n),this.vertexCount=this.mesh.vertexCount,this.triangleCount=this.mesh.indexCount/3}setParameters(t){let n=super.setParameters(t);return this.mesh&&(n.includes("seed")||n.includes("twist")||n.includes("variant"))&&this._buildMesh(),n}setAudioFeatures(t){this.lastAudio=t||kn}update(t,n=kn){super.update(t,n),this.lastAudio=n;let a=this.params,r=this.time,i=J(),s=a.audio>0&&n.enabled?a.audio:0,o=i.effects?.organicStructures||{},l=(n.bassBody||0)*s*Number(o.body??1),c=this.motion.update(t,n,i,"organicStructures",s),d=c.kickPos*Number(o.kick??1),f=this.renderer.pointer||{x:0,y:0},m=d*Number(i.kick?.cameraDolly??.03)*8,h=l*Number(i.bassBody?.scale??.05)*2,u=7.1+Math.sin(r*.085)*.45-m-h,b=r*.09*a.speed+c.flowPhase*.12+f.x*.2;this.eye=[Math.sin(b)*u,1.35+Math.sin(r*.07)*1.1-f.y*.8,Math.cos(b)*u];let y=Rn(this.eye,[0,0,0],[0,1,0]),p=Fn(52*Math.PI/180,this.renderer.width/Math.max(1,this.renderer.height),.1,60);Tn(p,y,this.viewProj);let v=r*.055*a.speed+c.flowPhase*.1+(a.seed|0)*.01;lr(v,this.model)}render(){let t=this.gl,n=this.params,a=this.lastAudio||kn,r=n.audio>0&&a.enabled?n.audio:0,i=J(),s=i.effects?.organicStructures||{},o=this.motion,l=(a.bassBody||0)*r*Number(s.body??1),c=(a.midFlow||0)*r*Number(s.mid??1),d=o.kickPos*Number(s.kick??1);this.sceneTarget.bind(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.SRC_ALPHA,t.ONE),this.program.use().set("uViewProj",this.viewProj).set("uModel",this.model).set("uTime",this.time).set("uAmplitude",n.amplitude).set("uFrequency",n.frequency).set("uSeed",(n.seed|0)%997).set("uHue",n.hue).set("uSaturation",n.saturation).set("uGlow",n.glow).set("uOpacity",n.opacity).set("uCamPos",this.eye).set("uKick",d*r).set("uBody",l).set("uMidFlow",c).set("uHighShimmer",(a.highShimmer||0)*r*Number(s.high??1)*Number(i.highShimmer?.porosity??1)).set("uFlowPhase",o.flowPhase).set("uWaveAmp",Number(i.midFlow?.waveAmp??.12)).set("uTwist",Number(i.midFlow?.twist??.22)*Math.sin(o.flowPhase*.35)).set("uMicroDisplace",Number(i.highShimmer?.microDisplace??.012)).set("uScale",1+d*r*.12+l*Number(i.bassBody?.scale??.05)),this.mesh.draw(),t.disable(t.BLEND),t.bindFramebuffer(t.FRAMEBUFFER,null)}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.3,bloomKnee:.24,exposure:t.exposure,vignette:.5,grain:.022,aberration:.012,time:this.time}}getSceneTarget(){return this.sceneTarget}onResize(t,n){this.sceneTarget&&this.sceneTarget.resize(t,n)}dispose(){this.program&&this.program.dispose(),this.mesh&&this.mesh.dispose(),this.sceneTarget&&this.sceneTarget.dispose(),this.program=null,this.mesh=null,this.sceneTarget=null}};je(nn,"schema",va);var ze=`#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,pr=`${pe}
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
`,hr=`${pe}
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
`,gr=`${pe}
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
`,vr=`${pe}
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
`,br=`${pe}
in vec2 vUv;
uniform sampler2D uSource;
out vec4 outColor;
void main() {
  outColor = texture(uSource, vUv);
}
`,yr=`${pe}
${Gt}
${rr}

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
`;var xr=ze,Er=`${pe}

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
uniform int uVariant;
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

${tt}

mat2 rot2(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
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

  if (uVariant == 1) {
    // Nudo: toro deformado con ondas angulares.
    float a = atan(q.z, q.x);
    float radius = 0.78 + 0.09 * sin(a * 3.0 + uTime * 0.35) + uWarp * 0.05;
    q.y += 0.10 * sin(a * 5.0 - uTime * 0.4);
    return sdTorus(q.xzy, vec2(radius, 0.20));
  }

  if (uVariant == 2) {
    // Ret\xEDcula: celdas repetidas con tama\xF1o modulado.
    vec3 cell = mod(q + 0.5, 1.0) - 0.5;
    float size = 0.20 + 0.035 * sin(uTime * 0.5 + q.x * 2.0);
    return sdBox(cell, vec3(size));
  }

  if (uVariant == 3) {
    // Orbe: esfera con desplazamiento de baja frecuencia.
    float r = 0.95
      + 0.075 * sin(q.x * 4.0 + uTime * 0.3)
      + 0.055 * sin(q.y * 5.0 - uTime * 0.2)
      + 0.045 * sin(q.z * 6.0 + uTime * 0.25);
    return length(q) - r;
  }

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
`;var xa={speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},power:{type:"number",default:7.6,min:3,max:12,label:"Potencia",group:"Forma"},warp:{type:"number",default:.35,min:0,max:1.5,label:"Warp",group:"Forma"},detail:{type:"number",default:.55,min:0,max:1,label:"Detalle",group:"Forma"},hue:{type:"number",default:.58,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.85,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.95,min:.2,max:4,label:"Glow",group:"Apariencia"},bloom:{type:"number",default:.58,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.88,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:3,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:5,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},ba=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0});function ya(e){let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]}function wr(e,t){return[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]]}var an=class extends De{constructor(t,n={}){super(n),this.renderer=t,this.gl=t.gl,this.sceneFormat=ke(this.gl,"rgba16f")?"rgba16f":"rgba8",this.sceneTarget=new ue(this.gl,{width:t.width,height:t.height,format:this.sceneFormat}),this.quad=lt(this.gl),this.program=new se(this.gl,xr,Er,"math:raymarch"),this.lastAudio=ba,this.motion=new Ke,this.signals={body:0,mid:0,high:0,rms:0,kickPos:0,kickFlash:0},this.camera={pos:[0,0,3.4],right:[1,0,0],up:[0,1,0],forward:[0,0,-1]}}setAudioFeatures(t){this.lastAudio=t||ba}update(t,n=ba){super.update(t,n),this.lastAudio=n;let a=this.params,r=this.time,i=this.renderer.pointer||{x:0,y:0},s=a.audio>0&&n.enabled?a.audio:0,o=J(),l=o.effects?.mathematicalForms||{},c=this.motion.update(t,n,o,"mathematicalForms",s),d=(n.bassBody||0)*s*Number(l.body??1),f=(n.midFlow||0)*s*Number(l.mid??1),m=(n.highShimmer||0)*s*Number(l.high??1),h=(n.rms||0)*s,u=c.kickPos*Number(l.kick??1);this.signals={body:d,mid:f,high:m,rms:h,kickPos:u,kickFlash:n.kickFlash||0};let y=3.35-u*Number(o.kick?.cameraDolly??.03)*8-d*.5+Math.sin(r*.1)*.16,p=r*.12*a.speed+c.flowPhase*.16+i.x*.25+(a.seed|0)*.013,v=Math.sin(r*.09)*1.6+i.y*.9+f*.4,g=[Math.cos(p)*y,v,Math.sin(p)*y],E=ya([-g[0],-g[1]*.55,-g[2]]),S=ya(wr(E,[0,1,0])),w=ya(wr(S,E)),M=f*.42+(n.kickFlash||0)*.12,A=Math.cos(M),L=Math.sin(M),_=[S[0]*A+w[0]*L,S[1]*A+w[1]*L,S[2]*A+w[2]*L],O=[w[0]*A-S[0]*L,w[1]*A-S[1]*L,w[2]*A-S[2]*L];this.camera={pos:g,right:_,up:O,forward:E}}getDetail(){let n=this.renderer.quality.name==="lite"?-16:0,a=Math.round(56+this.params.detail*64)+n,r=4+Math.round(this.params.detail*2);return{steps:Math.max(32,Math.min(120,a)),iterations:Math.max(3,Math.min(6,r))}}render(){let t=this.gl,n=this.params,a=this.signals,r=this.getDetail();this.sceneTarget.bind(),t.disable(t.BLEND),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE);let i=this.camera;this.program.use().set("uResolution",[this.sceneTarget.width,this.sceneTarget.height]).set("uTime",this.time).set("uSpeed",n.speed).set("uPower",n.power).set("uWarp",n.warp).set("uHue",n.hue).set("uSaturation",n.saturation).set("uGlow",n.glow).set("uSeed",(n.seed|0)%1e3*.01).set("uVariant",n.variant|0).set("uSteps",r.steps).set("uIterations",r.iterations).set("uCamPos",i.pos).set("uCamRight",i.right).set("uCamUp",i.up).set("uCamForward",i.forward).set("uTanHalfFov",Math.tan(48*Math.PI/360)).set("uAudioBass",a.body).set("uAudioMid",a.mid).set("uAudioHigh",a.high).set("uAudioRms",a.rms).set("uKick",a.kickPos).set("uAudioAmount",1),this.quad.draw(),t.bindFramebuffer(t.FRAMEBUFFER,null)}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.42,bloomKnee:.25,exposure:t.exposure,vignette:.55,grain:.02,aberration:.016,time:this.time}}getSceneTarget(){return this.sceneTarget}onResize(t,n){this.sceneTarget&&this.sceneTarget.resize(t,n)}dispose(){this.program&&this.program.dispose(),this.quad&&this.quad.dispose(),this.sceneTarget&&this.sceneTarget.dispose(),this.program=null,this.quad=null,this.sceneTarget=null}};je(an,"schema",xa);var Mr=ze,Sr=`${pe}
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
uniform int uVariant;

uniform float uAudioBass;
uniform float uAudioMid;
uniform float uAudioHigh;
uniform float uAudioRms;
uniform float uKick;
uniform float uAudioAmount;

out vec4 outColor;

${ct}
${tt}

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

  float ring = 0.0;
  float filaments = 0.0;
  float glowMask = 0.0;

  if (uVariant == 1) {
    // Eco: anillos conc\xE9ntricos amplios.
    ring = 0.5 + 0.5 * sin(r * 30.0 - t * 0.72 + f * 2.0 + uAudioMid * a * 3.0);
    filaments = pow(ring, 14.0) * smoothstep(1.5, 0.05, r);
    filaments *= 0.6 + 0.4 * smoothstep(-0.2, 0.8, f);
    glowMask = exp(-r * 1.8) * (0.10 + uAudioRms * a * 0.22);
  } else if (uVariant == 2) {
    // Smear: estelas direccionales.
    float streak = 0.5 + 0.5 * sin(q.x * 14.0 + f * 4.0 + t * 0.6);
    filaments = pow(streak, 7.0) * smoothstep(1.4, 0.0, r);
    filaments *= 0.45 + 0.55 * (0.5 + 0.5 * sin(q.y * 6.0 - t * 0.4));
    glowMask = exp(-r * 3.4) * (0.06 + uAudioRms * a * 0.18);
  } else if (uVariant == 3) {
    // T\xFAnel: profundidad radial con anillos que se acercan.
    float depth = 0.35 / (r + 0.18);
    ring = 0.5 + 0.5 * sin(depth * 8.0 - t * 1.8 + f * 3.0 + uAudioMid * a * 4.0);
    filaments = pow(ring, 8.0) * smoothstep(1.3, 0.05, r);
    filaments *= 0.5 + 0.5 * smoothstep(-0.4, 0.7, f);
    glowMask = exp(-r * 5.0) * (0.16 + uAudioRms * a * 0.28);
  } else {
    ring = 0.5 + 0.5 * sin(r * 19.0 - t * 1.25 + f * 5.0 + uAudioMid * a * 4.0);
    filaments = pow(ring, 9.0);
    filaments *= 1.0 + uAudioBass * a * 0.9;
    filaments *= smoothstep(1.25, 0.1, r);
    filaments *= 0.4 + 0.6 * smoothstep(-0.4, 0.7, f);
    glowMask = exp(-r * 2.8) * (0.08 + uAudioRms * a * 0.25);
  }

  vec3 hueColor = fluidColor(fract(uHue + r * 0.22 + f * 0.08 + t * 0.004), uSaturation);
  vec3 emission = hueColor * (filaments * uDensity + glowMask * 0.04) * uGlow;
  emission *= 0.7 + uKick * 1.25 + uAudioHigh * a * 0.35;

  // El frame anterior se zoom-ea, rota y distorsiona suavemente.
  float variantZoom = uVariant == 3 ? 1.9 : (uVariant == 2 ? 0.35 : (uVariant == 1 ? 0.7 : 1.0));
  float variantRot = uVariant == 3 ? 1.7 : (uVariant == 2 ? 0.5 : 1.0);
  float zoom = 1.0 - uZoom * 0.0045 * variantZoom - uAudioBass * a * 0.006 - uKick * a * 0.008;
  float angle = uRotation * 0.006 * variantRot + sin(t * 0.07) * 0.0015;
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
`;var wa={speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},decay:{type:"number",default:.93,min:.7,max:.998,label:"Persistencia",group:"Forma"},zoom:{type:"number",default:.55,min:0,max:1,label:"Zoom",group:"Forma"},rotation:{type:"number",default:.45,min:-1,max:1,label:"Rotaci\xF3n",group:"Forma"},warp:{type:"number",default:.55,min:0,max:1.5,label:"Distorsi\xF3n",group:"Forma"},density:{type:"number",default:.3,min:.05,max:1.5,label:"Densidad",group:"Forma"},hue:{type:"number",default:.62,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.9,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.85,min:.2,max:4,label:"Glow",group:"Apariencia"},bloom:{type:"number",default:.7,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.95,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:3,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:9,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},Ea=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0}),rn=class extends De{constructor(t,n={}){super(n),this.renderer=t,this.gl=t.gl;let a=ke(this.gl,"rgba16f")?"rgba16f":"rgba8";this.format=a,this.targets=[new ue(this.gl,{width:t.width,height:t.height,format:a}),new ue(this.gl,{width:t.width,height:t.height,format:a})],this.index=0,this.quad=lt(this.gl),this.program=new se(this.gl,Mr,Sr,"temporal:feedback"),this.lastAudio=Ea,this.motion=new Ke,this.signals={body:0,mid:0,high:0,rms:0,kickPos:0,kickFlash:0},this._clearTargets()}_clearTargets(){let t=this.gl;for(let n of this.targets)n.bind(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);t.bindFramebuffer(t.FRAMEBUFFER,null)}setAudioFeatures(t){this.lastAudio=t||Ea}update(t,n=Ea){super.update(t,n),this.lastAudio=n,this.dt=t;let a=this.params,r=a.audio>0&&n.enabled?a.audio:0,i=J(),s=i.effects?.temporalVeil||{},o=this.motion.update(t,n,i,"temporalVeil",r);this.signals={body:(n.bassBody||0)*r*Number(s.body??1),mid:(n.midFlow||0)*r*Number(s.mid??1),high:(n.highShimmer||0)*r*Number(s.high??1),rms:(n.rms||0)*r,kickPos:o.kickPos*Number(s.kick??1),kickFlash:(n.kickFlash||0)*Number(s.kick??1)}}render(){let t=this.gl,n=this.params,a=this.signals,r=this.targets[this.index],i=this.targets[1-this.index];i.bind(),t.disable(t.BLEND),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),this.program.use().set("uPrev",0).set("uResolution",[i.width,i.height]).set("uTime",this.time).set("uDt",Math.min(.05,this.dt||1/60)).set("uDecay",n.decay).set("uZoom",n.zoom*n.speed*(1+a.body*.7+a.kickPos*.5)).set("uRotation",n.rotation*n.speed*(1+a.mid*.7+a.kickFlash*.2)).set("uWarp",n.warp).set("uDensity",n.density*(1+a.body*.4+a.kickPos*.3)).set("uHue",n.hue).set("uSaturation",n.saturation).set("uGlow",n.glow).set("uSeed",(n.seed|0)%1e3).set("uVariant",n.variant|0).set("uAudioBass",a.body).set("uAudioMid",a.mid).set("uAudioHigh",a.high).set("uAudioRms",a.rms).set("uKick",a.kickPos).set("uAudioAmount",1),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,r.texture),this.quad.draw(),t.bindFramebuffer(t.FRAMEBUFFER,null),this.index=1-this.index}getSceneTarget(){return this.targets[this.index]}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.34,bloomKnee:.24,exposure:t.exposure,vignette:.62,grain:.018,aberration:.008,time:this.time}}onResize(t,n){for(let a of this.targets)a.resize(t,n);this._clearTargets()}dispose(){this.program&&this.program.dispose(),this.quad&&this.quad.dispose();for(let t of this.targets)t.dispose();this.program=null,this.quad=null,this.targets=[]}};je(rn,"schema",wa);function go(e,t,n,a){e.fillStyle="#04060a",e.fillRect(0,0,t,n);let r=t/2,i=n/2,s=Math.min(t,n)*.33,o=e.createRadialGradient(r,i,s*.1,r,i,s*1.7);o.addColorStop(0,"rgba(90, 190, 255, 0.30)"),o.addColorStop(1,"rgba(10, 20, 40, 0)"),e.fillStyle=o,e.fillRect(0,0,t,n),e.globalCompositeOperation="lighter";let l=56;for(let c=0;c<l;c++){let f=c/l*Math.PI*2,m=Math.sin(f*3+a*1.4)*.18+Math.sin(f*5-a)*.06,h=s*(.85+m),u=r+Math.cos(f)*h,b=i+Math.sin(f)*h*.8+Math.sin(f*2+a*1.1)*s*.18,y=190+Math.sin(f+a)*26,p=1.4+(Math.sin(f*4+a*2)*.5+.5)*2.2;e.fillStyle=`hsla(${y}, 90%, 68%, 0.55)`,e.beginPath(),e.arc(u,b,p,0,Math.PI*2),e.fill()}e.globalCompositeOperation="source-over"}function vo(e,t,n,a){e.fillStyle="#04060a",e.fillRect(0,0,t,n);let r=t/2,i=n/2,s=Math.min(t,n)*.115;e.globalCompositeOperation="lighter";for(let o=0;o<3;o++){e.beginPath();for(let l=0;l<=180;l++){let c=l/180*Math.PI*2,d=1+Math.sin(c*6+a*1.3+o)*.08,f=r+(Math.sin(c)+2*Math.sin(2*c))*s*.62*d,m=i+(Math.cos(c)-2*Math.cos(2*c))*s*.62*d;l===0?e.moveTo(f,m):e.lineTo(f,m)}e.strokeStyle=`hsla(${205+o*18}, 85%, ${60+o*8}%, ${.5-o*.12})`,e.lineWidth=1.2+o*.8,e.stroke()}e.globalCompositeOperation="source-over"}function bo(e,t,n,a){e.fillStyle="#05040a",e.fillRect(0,0,t,n);let r=t/2,i=n/2,s=Math.min(t,n)*.42;e.globalCompositeOperation="lighter";for(let l=0;l<64;l++){let c=l/64*Math.PI*2+a*.15,d=.55+.45*Math.abs(Math.sin(c*4+a)),f=s*d*(.75+.25*Math.sin(c*7-a)),m=r+Math.cos(c)*f,h=i+Math.sin(c)*f*.9;e.fillStyle=`hsla(${250+Math.cos(c*3)*30}, 85%, 62%, 0.45)`,e.beginPath(),e.arc(m,h,1.6+d*2,0,Math.PI*2),e.fill()}let o=e.createRadialGradient(r,i,0,r,i,s);o.addColorStop(0,"rgba(140,120,255,0.28)"),o.addColorStop(1,"rgba(20,10,40,0)"),e.fillStyle=o,e.fillRect(0,0,t,n),e.globalCompositeOperation="source-over"}function yo(e,t,n,a){e.fillStyle="#030408",e.fillRect(0,0,t,n);let r=t/2,i=n/2;e.globalCompositeOperation="lighter";for(let s=0;s<12;s++){let o=s/12*Math.min(t,n)*.46;e.beginPath(),e.arc(r,i,o,a*.5+s*.5,a*.5+s*.5+2.2),e.strokeStyle=`hsla(${190+s*9}, 85%, 60%, ${.55-s*.03})`,e.lineWidth=1+s%3*.7,e.stroke()}e.globalCompositeOperation="source-over"}var Ht={fluidFields:{label:"Fluid Fields",family:"fluid",schema:ha,create:(e,t)=>new tn(e,t),preview:go},organicStructures:{label:"Organic Structures",family:"organic",schema:va,create:(e,t)=>new nn(e,t),preview:vo},mathematicalForms:{label:"Mathematical Forms",family:"mathematical",schema:xa,create:(e,t)=>new an(e,t),preview:bo},temporalVeil:{label:"Temporal Veil",family:"temporal",schema:wa,create:(e,t)=>new rn(e,t),preview:yo}};function X(e){return Object.prototype.hasOwnProperty.call(Ht,e)}function Ar(e,t,n){let a=Ht[e];if(!a)throw new Error(`Efecto GPU desconocido: ${e}`);return a.create(t,n)}function Tr({targetFps:e=60,fpsCounter:t,onFrame:n}){let a=0,r=0,i=1e3/e,s=!1;function o(l){if(!s)return;let c=document.visibilityState==="visible",d=c?i:200,f=0;if(r>0&&(f=l-r,t&&t.tick(f)),r=l,c){An(f>0?f/1e3:1/60);try{n({now:l,fpsCounter:t,audio:ee()})}catch(m){console.error("renderLoop frame error:",m)}}a=requestAnimationFrame(o)}return{start(){s||(s=!0,r=0,a=requestAnimationFrame(o))},stop(){s=!1,a&&cancelAnimationFrame(a),a=0},isRunning(){return s}}}function Pn(){let e=new Float32Array(60),t=0,n=0,a=0,r=0;return{tick(i){r=i,a=i>0?1e3/i:0,e[t]=i,t=(t+1)%60,n<60&&n++},getInstant(){return a},getFrameMs(){return r},getAvg(){if(n===0)return 0;let i=0;for(let o=0;o<n;o++)i+=e[o];let s=i/n;return s>0?1e3/s:0},getLow1Percent(){if(n===0)return 0;let i=Array.from(e.subarray(0,n)).sort((l,c)=>c-l),s=Math.max(0,Math.floor(i.length*.01)-1),o=i[s];return o>0?1e3/o:0},reset(){t=0,n=0,a=0,r=0}}}var xo=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,Ln=null;function Ma(){if(Ln)return Ln;let e=navigator.userAgent||"",t=xo.test(e),n="ontouchstart"in window&&window.innerWidth<=1024,a=navigator.hardwareConcurrency||4,r=navigator.deviceMemory||null,i=navigator.connection?.saveData||!1,s=t||n,o;return i?o=!0:typeof r=="number"?o=r<4||a<4:o=a<4||s,Ln={hardwareConcurrency:a,deviceMemory:r,isMobile:s,isLiteRecommended:o,saveData:i,dpr:Math.min(window.devicePixelRatio||1,s?1:1.5)},Ln}function Ue(){try{let e=localStorage.getItem("umbral-vision:lite-mode");if(e==="on")return!0;if(e==="off")return!1}catch{}return Ma().isLiteRecommended}function Fr(e){try{localStorage.setItem("umbral-vision:lite-mode",e?"on":"off")}catch{}try{window.dispatchEvent(new CustomEvent("uv:lite-mode",{detail:{lite:!!e}}))}catch{}}var Rr={lite:{name:"lite",particleSize:128,maxDpr:1,renderScale:.7,minRenderScale:.5,bloomMips:1,bloomQuality:5,simSteps:1,trailLength:1,targetFrameMs:22,minFrameMs:12},high:{name:"high",particleSize:256,maxDpr:1.5,renderScale:.9,minRenderScale:.55,bloomMips:2,bloomQuality:9,simSteps:1,trailLength:1.35,targetFrameMs:19,minFrameMs:11},ultra:{name:"ultra",particleSize:512,maxDpr:2,renderScale:1,minRenderScale:.6,bloomMips:3,bloomQuality:11,simSteps:1,trailLength:1.6,targetFrameMs:15,minFrameMs:8}};function Sa(e){return Rr[e]||Rr.high}function Aa(e){let t=e.renderScale,n=0,a=0;return{get scale(){return t},reset(){t=e.renderScale,n=0,a=0},sample(r){if(!Number.isFinite(r)||r<=0)return!1;r>e.targetFrameMs?(n++,a=0):r<e.minFrameMs?(a++,n=0):(n=0,a=0);let i=t;return n>=45&&t>e.minRenderScale?(i=Math.max(e.minRenderScale,t-.1),n=0):a>=180&&t<1&&(i=Math.min(1,t+.05),a=0),i!==t?(t=i,!0):!1}}}var _n=class{constructor(t={}){this.container=t.container||null,this.quality=Sa(t.quality||"high"),this.adaptive=Aa(this.quality),this.onScaleChange=t.onScaleChange||null,this.pointer={x:0,y:0},this.frameMs=0,this.fps=0,this.cpuMs=0,this.contextLost=!1,this.disposed=!1,this.canvas=t.canvas||document.createElement("canvas"),this.canvas.className="uv-engine-canvas",this.canvas.style.position="absolute",this.canvas.style.inset="0",this.canvas.style.width="100%",this.canvas.style.height="100%",this.canvas.style.display="block",this.canvas.style.pointerEvents="none",this.canvas.style.zIndex="0",this.canvas.setAttribute("aria-hidden","true"),this.container&&this.canvas.parentNode!==this.container&&this.container.appendChild(this.canvas);let n=this.canvas.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!0,desynchronized:!0});if(!n)throw this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas),new Error("WebGL 2 no est\xE1 disponible en este navegador");this.gl=n,this.refreshExtensions(),n.disable(n.DEPTH_TEST),n.disable(n.CULL_FACE),n.clearColor(0,0,0,1),this._onResize=()=>this.resize(),this._onPointer=a=>{this.pointer.x=a.clientX/Math.max(1,window.innerWidth)*2-1,this.pointer.y=-(a.clientY/Math.max(1,window.innerHeight)*2-1)},window.addEventListener("resize",this._onResize),window.addEventListener("pointermove",this._onPointer,{passive:!0}),this._lastFrameTime=0,this.resize()}refreshExtensions(){let t=this.gl;t&&(this.extFloat=t.getExtension("EXT_color_buffer_float"),this.extHalfFloat=t.getExtension("EXT_color_buffer_half_float"),this.extFloatLinear=t.getExtension("OES_texture_float_linear"),t.getExtension("OES_texture_half_float_linear"))}get width(){return this.canvas.width}get height(){return this.canvas.height}get output(){return{width:this.canvas.width,height:this.canvas.height}}get aspect(){return this.canvas.width/Math.max(1,this.canvas.height)}_cssSize(){if(this.container){let t=this.container.getBoundingClientRect();if(t.width>0&&t.height>0)return{width:t.width,height:t.height};if(this.container.clientWidth>0&&this.container.clientHeight>0)return{width:this.container.clientWidth,height:this.container.clientHeight}}return{width:window.innerWidth||1,height:window.innerHeight||1}}resize(){if(this.disposed)return!1;let{width:t,height:n}=this._cssSize(),r=Math.min(window.devicePixelRatio||1,this.quality.maxDpr)*this.adaptive.scale,i=Math.max(2,Math.round(t*r)),s=Math.max(2,Math.round(n*r));return this.cssWidth=t,this.cssHeight=n,i===this.canvas.width&&s===this.canvas.height?!1:(this.canvas.width=i,this.canvas.height=s,this.gl.viewport(0,0,i,s),this.onScaleChange&&this.onScaleChange(i,s),!0)}setQuality(t){let n=Sa(t);return n.name===this.quality.name?!1:(this.quality=n,this.adaptive=Aa(n),this.resize(),!0)}sampleFrame(t){return!Number.isFinite(t)||t<=0?!1:(this.frameMs=this.frameMs===0?t:this.frameMs*.9+t*.1,this.fps=1e3/Math.max(1,this.frameMs),this.adaptive.sample(t)?this.resize():!1)}beginFrame(){let t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),t.clear(t.COLOR_BUFFER_BIT)}getStats(){return{fps:Math.round(this.fps*10)/10,frameMs:Math.round(this.frameMs*100)/100,cpuMs:Math.round(this.cpuMs*100)/100,width:this.canvas.width,height:this.canvas.height,cssWidth:this.cssWidth,cssHeight:this.cssHeight,scale:Math.round(this.adaptive.scale*100)/100,quality:this.quality.name}}dispose(){if(this.disposed)return;this.disposed=!0,window.removeEventListener("resize",this._onResize),window.removeEventListener("pointermove",this._onPointer),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);let t=this.gl.getExtension("WEBGL_lose_context");t&&t.loseContext(),this.gl=null}};var Yl=Object.freeze(["keep","merge","refactor","retire"]),In=Object.freeze({fluidFields:{decision:"keep",family:"fluidFields",variant:"membrane",classic:!1,reason:"T\xE9cnica GPU propia y buena base de variantes."},organicStructures:{decision:"keep",family:"organicStructures",variant:"knot",classic:!1,reason:"Mesh 3D con Fresnel y silueta propia."},mathematicalForms:{decision:"keep",family:"mathematicalForms",variant:"mandelbulb",classic:!1,reason:"Raymarch + SDF con alto techo visual."},temporalVeil:{decision:"refactor",family:"temporalSystems",variant:"veil",classic:!1,reason:"Base del feedback global y de la familia temporal."},tunnel:{decision:"refactor",family:"kineticGeometry",variant:"tunnel",classic:!0,reason:"Concepto de t\xFAnel reutilizable como variante geom\xE9trica."},spiral:{decision:"refactor",family:"kineticGeometry",variant:"spiral",classic:!0,reason:"Espiral cl\xE1sica; variante de geometr\xEDa cin\xE9tica."},mandala:{decision:"refactor",family:"kineticGeometry",variant:"mandala",classic:!0,reason:"Simetr\xEDa radial; variante de geometr\xEDa cin\xE9tica."},particles:{decision:"merge",family:"fluidFields",variant:"swarm",classic:!0,reason:"Se solapa con Fluid Fields; queda como variante y cl\xE1sico."},waves:{decision:"refactor",family:"wavesAndFields",variant:"waves",classic:!0,reason:"Base de la familia de ondas y campos."},fractal:{decision:"refactor",family:"fractalGrowth",variant:"tree",classic:!0,reason:"Recursi\xF3n ramificada; base de crecimiento fractal."},matrix:{decision:"retire",family:"classics",variant:"matrix",classic:!0,reason:"Referencia literal; no es una familia visual."},glitch:{decision:"retire",family:"classics",variant:"glitch",classic:!0,reason:"Su valor es post-proceso/transici\xF3n, no una familia."},melt:{decision:"retire",family:"classics",variant:"melt",classic:!0,reason:"Efecto puntual fuera de la taxonom\xEDa principal."},fractalGlitch:{decision:"merge",family:"fractalGrowth",variant:"glitch",classic:!0,reason:"Duplicaba el fractal con interferencias."},waveGlitch:{decision:"merge",family:"wavesAndFields",variant:"glitch",classic:!0,reason:"Duplicaba las ondas con interferencias."},sacredGeometry:{decision:"merge",family:"kineticGeometry",variant:"sacred",classic:!0,reason:"Casi id\xE9ntico a mandala; variante sagrada."},biomech:{decision:"refactor",family:"organicStructures",variant:"biomech",classic:!0,reason:"Estructura org\xE1nica; variante de Organic Structures."},dune:{decision:"merge",family:"wavesAndFields",variant:"dunes",classic:!0,reason:"Ondas + geometr\xEDa; variante de dunas."},yinYang:{decision:"retire",family:"classics",variant:"yinYang",classic:!0,reason:"S\xEDmbolo \xFAnico, no una familia."}});function W(e,t,n,a=!1){return{label:e,effect:t,structural:n,implemented:a}}var xe=Object.freeze({fluidFields:{id:"fluidFields",label:"Fluid Fields",description:"Tejido de part\xEDculas y membranas vivas.",renderer:"webgl",effect:"fluidFields",defaultVariant:"membrane",variants:{membrane:W("Membrana","fluidFields",{topology:"open-cylinder",folds:3},!0),torus:W("Toro","fluidFields",{topology:"torus",folds:0},!0),ribbon:W("Cinta","fluidFields",{topology:"twisted-ribbon",folds:2},!0),smoke:W("Humo","fluidFields",{topology:"volume",folds:5},!0),swarm:W("Enjambre","fluidFields",{topology:"free-swarm",folds:0},!0)}},organicStructures:{id:"organicStructures",label:"Organic Structures",description:"Membranas topol\xF3gicas transl\xFAcidas y volumen real.",renderer:"webgl",effect:"organicStructures",defaultVariant:"knot",variants:{knot:W("Nudo","organicStructures",{topology:"torus-knot",shell:"translucent"},!0),cell:W("C\xE9lula","organicStructures",{topology:"cell",shell:"membrane"},!0),coral:W("Coral","organicStructures",{topology:"coral",shell:"branched"},!0),biomech:W("Biomech","organicStructures",{topology:"biomech",shell:"segmented"},!0)}},mathematicalForms:{id:"mathematicalForms",label:"Mathematical Forms",description:"Formas matem\xE1ticas volum\xE9tricas por ray marching.",renderer:"webgl",effect:"mathematicalForms",defaultVariant:"mandelbulb",variants:{mandelbulb:W("Mandelbulb","mathematicalForms",{surface:"mandelbulb",symmetry:"radial"},!0),knot:W("Nudo SDF","mathematicalForms",{surface:"torus-knot",symmetry:"none"},!0),lattice:W("Ret\xEDcula","mathematicalForms",{surface:"lattice",symmetry:"cubic"},!0),orb:W("Orbe","mathematicalForms",{surface:"sphere",symmetry:"radial"},!0)}},temporalSystems:{id:"temporalSystems",label:"Temporal Systems",description:"Estelas, acumulaci\xF3n y memoria visual.",renderer:"webgl",effect:"temporalVeil",defaultVariant:"veil",variants:{veil:W("Velo","temporalVeil",{feedback:"warp",emitters:"filaments"},!0),echo:W("Eco","temporalVeil",{feedback:"echo",emitters:"rings"},!0),smear:W("Smear","temporalVeil",{feedback:"directional",emitters:"streaks"},!0),tunnel:W("T\xFAnel temporal","temporalVeil",{feedback:"zoom",emitters:"tunnel"},!0)}},kineticGeometry:{id:"kineticGeometry",label:"Kinetic Geometry",description:"Geometr\xEDa cin\xE9tica: t\xFAneles, espirales y simetr\xEDas radiales.",renderer:"p5",effect:"tunnel",defaultVariant:"tunnel",variants:{tunnel:W("T\xFAnel","tunnel",{symmetry:"radial",motif:"ellipses"},!0),spiral:W("Espiral","spiral",{symmetry:"spiral",motif:"dots"},!0),mandala:W("M\xE1ndala","mandala",{symmetry:"radial",motif:"petals"},!0),sacred:W("Sagrada","sacredGeometry",{symmetry:"radial",motif:"polygons"},!0),flower:W("Flor","mandala",{symmetry:"radial",motif:"flower"},!0)}},wavesAndFields:{id:"wavesAndFields",label:"Waves & Fields",description:"Ondas, dunas e interferencias sobre el plano.",renderer:"p5",effect:"waves",defaultVariant:"waves",variants:{waves:W("Olas","waves",{field:"sine-lines",motif:"layered"},!0),glitch:W("Olas Glitch","waveGlitch",{field:"sine-distorted",motif:"glitch"},!0),dunes:W("Dunas","dune",{field:"dunes",motif:"sand"},!0),interference:W("Interferencia","waves",{field:"interference",motif:"ripples"},!0)}},fractalGrowth:{id:"fractalGrowth",label:"Fractal Growth",description:"Crecimiento recursivo y estructuras ramificadas.",renderer:"p5",effect:"fractal",defaultVariant:"tree",variants:{tree:W("\xC1rbol","fractal",{growth:"recursive-tree",motif:"branches"},!0),glitch:W("\xC1rbol Glitch","fractalGlitch",{growth:"recursive-tree",motif:"glitch"},!0),coral:W("Coral","biomech",{growth:"radial",motif:"coral"},!0),tendril:W("Tendril","biomech",{growth:"radial",motif:"tendrils"},!0)}},classics:{id:"classics",label:"Cl\xE1sicos",description:"Efectos hist\xF3ricos conservados fuera de la taxonom\xEDa principal.",renderer:"p5",effect:"matrix",defaultVariant:"matrix",variants:{matrix:W("Matrix","matrix",{motif:"code-rain"},!0),glitch:W("Glitch","glitch",{motif:"scanlines"},!0),melt:W("Melt","melt",{motif:"dripping"},!0),yinYang:W("Yin Yang","yinYang",{motif:"symbol"},!0)}}}),Eo=Object.freeze(Object.keys(xe));function $t(e){return Object.prototype.hasOwnProperty.call(xe,e)?xe[e]:null}function Ta(e){let t=In[e];if(t)return t.family;for(let n of Object.values(xe)){if(n.effect===e)return n.id;for(let a of Object.values(n.variants))if(a.effect===e)return n.id}return null}function mt(e){if(!e)return null;for(let t of Object.values(xe))if(t.variants?.[e.variant]?.effect===e.effect)return t.id;return Ta(e.effect)}function Ve(e){let t=In[e];return t?t.variant:"default"}function St(e,t){let n=$t(e);if(!n)return null;let a=t&&n.variants[t]?t:n.defaultVariant,r=n.variants[a];return{family:n,variantId:a,entry:r,effect:r.effect||n.effect}}function on({includeClassics:e=!0}={}){return Eo.filter(t=>e||t!=="classics").map(t=>xe[t])}function Cr(){return Object.keys(In).filter(e=>In[e].decision==="retire")}function wo(e,t){let n=$t(e);if(!n)return 0;let r=Object.keys(n.variants).indexOf(t);return r<0?0:r}function Mo(e,t){let n=$t(e);if(!n)return null;let a=Object.keys(n.variants);return a[Math.max(0,Math.min(a.length-1,Number(t)|0))]||n.defaultVariant}function kr(e,t){let n=Ta(e);return n?wo(n,t||Ve(e)):0}function Pr(e,t){let n=Ta(e);return n?Mo(n,t):Ve(e)}var _r=Object.freeze(["dissolve","luma","zoom","wipe","feedback"]),Jl=Object.freeze(["smooth","cubic","expo","linear"]),Ir=Object.freeze({dissolve:"Disolver",luma:"Luz",zoom:"Zoom",wipe:"Barrido",feedback:"Feedback"});function Fa(e,t,n){return Math.min(n,Math.max(t,e))}function Br(e,t){let n=Fa(Number(t)||0,0,1);switch(e){case"linear":return n;case"cubic":return n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2;case"expo":return n===0?0:n===1?1:n<.5?Math.pow(2,20*n-10)/2:(2-Math.pow(2,-20*n+10))/2;case"smooth":default:return n*n*(3-2*n)}}function Nr(e){switch(e){case"luma":return 1;case"zoom":return 2;case"wipe":return 3;case"feedback":return 1;default:return 0}}function Dr(e){switch(e){case"cubic":return"cubic-bezier(0.22, 0.8, 0.25, 1)";case"expo":return"cubic-bezier(0.16, 1, 0.3, 1)";case"linear":return"linear";case"smooth":default:return"ease-in-out"}}function Lr(e){return e?.effect?mt(e):null}function Or(e={}){let t=Number.isFinite(e.seed)?e.seed>>>0:null,n=e.random||(t!=null?Pe(t):Math.random),a=Lr(e.from),r=Lr(e.to),i=!!(a&&r&&a===r),s=e.sameBackend!==!1,o=e.audio||{},l=Fa((Number(o.level)||0)*.45+(Number(o.kickFlash)||0)*.35+(Number(o.bassFast)||0)*.2,0,1),c;s?i?c=["dissolve","zoom","luma"]:c=["zoom","wipe","luma","feedback","dissolve"]:c=["luma","dissolve","wipe"];let d=c.filter(v=>v!==e.lastType),f=d.length?d:c,m=f[Math.min(f.length-1,Math.floor(n()*f.length))],h=i?1500:s?2100:1400,u=i?700:s?1400:600,b=h+n()*u;b*=1-l*.24,b=Math.round(Fa(b,900,3800));let y=m==="zoom"||m==="feedback"?"cubic":m==="wipe"?"expo":"smooth",p=n()*Math.PI*2;return{type:m,durationMs:b,easing:y,direction:[Math.cos(p),Math.sin(p)],seed:Math.floor(n()*2147483647),sameFamily:i,sameBackend:s,energy:Math.round(l*100)/100}}function zr(e){return e==="feedback"||e==="feedback-smear"?{amount:.2,decay:.025,zoom:.4}:e==="zoom"?{amount:.08,decay:.01,zoom:.2}:null}var Ur={1:[1,0,0],2:[.62,.38,0],3:[.5,.3,.2]},Bn=class{constructor(t,n,a={}){this.gl=t,this.quad=n,this.mips=Math.max(1,Math.min(3,a.mips||2)),this.format=a.hdr?"rgba16f":"rgba8",this.bloomQuality=a.bloomQuality||9,this.bright=new se(t,ze,pr,"post:bright"),this.blur=new se(t,ze,hr,"post:blur"),this.copy=new se(t,ze,br,"post:copy"),this.mix=new se(t,ze,gr,"post:mix"),this.feedback=new se(t,ze,vr,"post:feedback"),this.composite=new se(t,ze,yr,"post:composite"),this.levels=[],this.mixTarget=null,this.feedbackTargets=[],this.feedbackIndex=0,this.width=0,this.height=0,this.disposed=!1}resize(t,n){if(t=Math.max(1,t|0),n=Math.max(1,n|0),t===this.width&&n===this.height)return;this.width=t,this.height=n;for(let l of this.levels)l.a.dispose(),l.b.dispose();this.levels=[],this.mixTarget&&this.mixTarget.dispose(),this.mixTarget=new ue(this.gl,{width:t,height:n,format:this.format});for(let l of this.feedbackTargets)l.dispose();let a=Math.max(1,t>>1),r=Math.max(1,n>>1);this.feedbackTargets=[new ue(this.gl,{width:a,height:r,format:this.format}),new ue(this.gl,{width:a,height:r,format:this.format})],this.feedbackIndex=0;let i=this.gl;for(let l of this.feedbackTargets)l.bind(),i.clearColor(0,0,0,1),i.clear(i.COLOR_BUFFER_BIT);i.bindFramebuffer(i.FRAMEBUFFER,null);let s=Math.max(1,t>>1),o=Math.max(1,n>>1);for(let l=0;l<this.mips;l++)this.levels.push({a:new ue(this.gl,{width:s,height:o,format:this.format}),b:new ue(this.gl,{width:s,height:o,format:this.format}),width:s,height:o}),s=Math.max(1,s>>1),o=Math.max(1,o>>1)}render(t,n,a={},r=null,i=1){let s=this.gl;if(this.levels.length===0)return;r&&this.mixTarget&&(this.mixTarget.bind(),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),this.mix.use().set("uSceneA",0).set("uSceneB",1).set("uMix",Math.max(0,Math.min(1,i))).set("uMode",Nr(a.transitionType||"dissolve")).set("uDirection",a.transitionDirection||[1,0]).set("uSeed",Number(a.transitionSeed)||0),this._bindTexture(t.texture,0),this._bindTexture(r.texture,1),this.quad.draw(),t=this.mixTarget);let o=Math.max(0,Math.min(1,Number(a.feedback??0)));if(o>0&&this.feedbackTargets.length===2){let h=this.feedbackTargets[this.feedbackIndex],u=this.feedbackTargets[1-this.feedbackIndex];u.bind(),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT),this.feedback.use().set("uScene",0).set("uPrev",1).set("uResolution",[u.width,u.height]).set("uTime",a.time??0).set("uFeedback",o).set("uDecay",Math.max(.5,Math.min(.999,Number(a.feedbackDecay??.92)))).set("uZoom",Number(a.feedbackZoom??.5)).set("uRotation",Number(a.feedbackRotation??.3)).set("uWarp",Number(a.feedbackWarp??.5)),this._bindTexture(t.texture,0),this._bindTexture(h.texture,1),this.quad.draw(),t=u,this.feedbackIndex=1-this.feedbackIndex}s.disable(s.DEPTH_TEST),s.disable(s.BLEND),s.disable(s.CULL_FACE),this.levels[0].a.bind(),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),this.bright.use().set("uScene",0).set("uThreshold",a.bloomThreshold??.55).set("uKnee",a.bloomKnee??.25).set("uIntensity",1),this._bindTexture(t.texture,0),this.quad.draw();for(let h=0;h<this.levels.length;h++){let u=this.levels[h];if(h>0){let p=this.levels[h-1];u.a.bind(),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),this.copy.use().set("uSource",0),this._bindTexture(p.a.texture,0),this.quad.draw()}let b=1/u.width,y=1/u.height;u.b.bind(),s.clear(s.COLOR_BUFFER_BIT),this.blur.use().set("uSource",0).set("uDirection",[b*1.4,0]).set("uQuality",this.bloomQuality),this._bindTexture(u.a.texture,0),this.quad.draw(),u.a.bind(),s.clear(s.COLOR_BUFFER_BIT),this.blur.use().set("uSource",0).set("uDirection",[0,y*1.4]).set("uQuality",this.bloomQuality),this._bindTexture(u.b.texture,0),this.quad.draw()}s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,n.width,n.height),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT);let c=Ur[this.levels.length]||Ur[1],d=this.levels[0]?.a,f=this.levels[1]?.a||d,m=this.levels[2]?.a||f;this.composite.use().set("uScene",0).set("uBloom0",1).set("uBloom1",2).set("uBloom2",3).set("uBloomWeights",c).set("uBloomStrength",a.bloomStrength??.9).set("uExposure",a.exposure??1).set("uVignette",a.vignette??.55).set("uGrain",a.grain??.035).set("uAberration",a.aberration??.012).set("uTime",a.time??0).set("uResolution",[n.width,n.height]),this._bindTexture(t.texture,0),this._bindTexture(d?.texture??null,1),this._bindTexture(f?.texture??null,2),this._bindTexture(m?.texture??null,3),this.quad.draw()}_bindTexture(t,n){let a=this.gl;a.activeTexture(a.TEXTURE0+n),a.bindTexture(a.TEXTURE_2D,t)}dispose(){if(!this.disposed){this.disposed=!0;for(let t of this.levels)t.a.dispose(),t.b.dispose();this.levels=[],this.mixTarget&&this.mixTarget.dispose(),this.mixTarget=null;for(let t of this.feedbackTargets)t.dispose();this.feedbackTargets=[],this.bright.dispose(),this.blur.dispose(),this.copy.dispose(),this.mix.dispose(),this.feedback.dispose(),this.composite.dispose()}}};var ka=2,So=Object.freeze(["manual","generated","mutated"]),Ra=Object.freeze({mode:"procedural",hue:.56,saturation:.9}),dt=Object.freeze({bloom:.85,exposure:.98,vignette:.55,grain:.028,aberration:.014,feedback:.25,feedbackDecay:.92}),Ao=Object.freeze({enabled:!0,rates:{hue:.01,warp:.015}}),Ca=0;function Ee(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function To(e){return e==null?e:JSON.parse(JSON.stringify(e))}function nt(e,t,n){return Math.min(n,Math.max(t,e))}function Ge(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function ft(){try{let e=globalThis.crypto;if(e&&typeof e.getRandomValues=="function"){let t=new Uint32Array(1);return e.getRandomValues(t),t[0]>>>0}}catch{}return Math.random()*4294967295>>>0}function pt(e="sc"){Ca=(Ca+1)%16777215;let t=Math.random().toString(36).slice(2,7);return`${e}_${Date.now().toString(36)}_${Ca.toString(36)}_${t}`}function Fo(e){let t=Ee(e)?e:{};return{...Ra,...t,hue:nt(Ge(t.hue,Ra.hue),0,1),saturation:nt(Ge(t.saturation,Ra.saturation),0,1)}}function Ro(e){let t=Ee(e)?e:{},n={...dt,...t};return n.bloom=nt(Ge(n.bloom,dt.bloom),0,3),n.exposure=nt(Ge(n.exposure,dt.exposure),.1,3),n.vignette=nt(Ge(n.vignette,dt.vignette),0,1),n.grain=nt(Ge(n.grain,dt.grain),0,.2),n.aberration=nt(Ge(n.aberration,dt.aberration),0,.1),n.feedback=nt(Ge(n.feedback,dt.feedback),0,1),n.feedbackDecay=nt(Ge(n.feedbackDecay,dt.feedbackDecay),.5,.999),n}function Co(e){let t=Ee(e)?e:{},n=Ee(t.rates)?t.rates:{};return{enabled:t.enabled!==!1,rates:{...Ao.rates,...n}}}function ko(e){if(!e||!Ee(e))return null;let t=Ge(e.timeOffset,0);return{timeOffset:Math.max(0,t)}}function D(e={}){let t=String(e.effect||"fluidFields"),n=String(e.variant||Ve(t)),a=Math.max(0,Math.floor(Ge(e.seed??e.params?.seed,1)))>>>0,r=new Date().toISOString(),i=So.includes(e.origin)?e.origin:"manual";return{schemaVersion:ka,id:String(e.id||pt()),name:String(e.name||""),createdAt:e.createdAt||r,updatedAt:e.updatedAt||r,origin:i,parentId:e.parentId?String(e.parentId):null,effect:t,variant:n,seed:a,params:Ee(e.params)?To(e.params):{},palette:Fo(e.palette),post:Ro(e.post),drift:Co(e.drift),moment:ko(e.moment),tags:Array.isArray(e.tags)?e.tags.map(String):[],favorite:!!e.favorite}}function ht(e){if(!Ee(e))throw new Error("Escena inv\xE1lida: se esperaba un objeto");if(e.scene&&Ee(e.scene))return ht(e.scene);if(!e.state&&!e.effect)throw new Error("Escena inv\xE1lida: falta effect");if(e.state&&Ee(e.state))return sn(e.state,{id:e.id,name:e.name,createdAt:e.createdAt});let t=Number(e.schemaVersion??1);if(t>ka)throw new Error(`schemaVersion ${t} no soportada (m\xE1xima ${ka})`);return D(e)}function sn(e={},t={}){let n=e.effect||"fluidFields",a=Ee(e.params)?e.params:{},r=e.variant||Ee(e.scene)&&e.scene.variant||Ve(n),i=e.seed??a.seed??(Ee(e.scene)?e.scene.seed:void 0),s=Ee(e.scene)?e.scene:{};return D({...s,effect:n,variant:r,seed:i,params:a,id:t.id||s.id,name:t.name||s.name,createdAt:t.createdAt||s.createdAt,origin:s.origin||"manual",parentId:s.parentId||null,palette:s.palette,post:s.post,drift:s.drift,moment:s.moment,tags:s.tags,favorite:s.favorite})}function Nn(e){let t=D(e);return{...t.params,seed:t.seed}}function Po(e){let t=globalThis.TextEncoder,n=new t().encode(e),a="",r=32768;for(let l=0;l<n.length;l+=r)a+=String.fromCharCode(...n.subarray(l,l+r));let i=globalThis.btoa,s=globalThis.Buffer;return(typeof i=="function"?i(a):s.from(a,"binary").toString("base64")).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function Lo(e){let t=String(e).replace(/-/g,"+").replace(/_/g,"/"),n=t+"=".repeat((4-t.length%4)%4),a=globalThis.atob,r=globalThis.Buffer,i=typeof a=="function"?a(n):r.from(n,"base64").toString("binary"),s=Uint8Array.from(i,l=>l.charCodeAt(0)),o=globalThis.TextDecoder;return new o().decode(s)}function Vr(e){let t=D(e),n={e:t.effect,r:t.variant,s:t.seed,p:t.params,l:t.palette,o:t.post,d:t.drift,m:t.moment,n:t.name||void 0};return Po(JSON.stringify(n))}function Gr(e){if(!e)return null;try{let t=JSON.parse(Lo(e));return!Ee(t)||!t.e?null:D({effect:t.e,variant:t.r,seed:t.s,params:t.p,palette:t.l,post:t.o,drift:t.d,moment:t.m,name:t.n})}catch{return null}}var Pa="fluidFields";function _o(e){return!Number.isFinite(e)||e<=0?1/60:Math.min(e,.05)}function Io(e){return e&&e!=="auto"?e:Ue()?"lite":"high"}function Bo(e,t=Math.random){return e==="auto"?1500+t()*2500:Math.max(0,Number(e)||0)}function Hr(e={}){let{container:t=null,canvas:n=null,autoStart:a=!0,effectName:r=Pa,params:i={},onStats:s=null}=e,o=Io(e.quality),l=Pn(),c=null,d=null,f=null,m=null,h=null,u=null,b=null,y=null,p=!1,v=0,g=0,E=!1,S=0,w={},M={};function A(){f&&(f.dispose(),f=null),d||(d=lt(c.gl));let C=ke(c.gl,"rgba16f");f=new Bn(c.gl,d,{mips:c.quality.bloomMips,hdr:C,bloomQuality:c.quality.bloomQuality}),f.resize(c.width,c.height)}function L(C,k){let N=Ar(C,c,k||i);return N.initialize(),N.onResize(c.width,c.height),N}function _(C,k){m&&(m.dispose(),m=null),h&&(h.dispose(),h=null),u=null,A(),b=C,m=L(C,k)}function O(C){if(!p)return;if(v=requestAnimationFrame(O),document.visibilityState==="hidden"){g=C;return}let k=g===0?16.67:C-g;g=C,l.tick(k);let N=_o(k/1e3);An(N);let le=Ce(),ce=typeof performance<"u"?performance.now():Date.now();try{U(N,le)}catch(we){console.error("UmbralEngine frame error:",we),T();return}let Z=typeof performance<"u"?performance.now():Date.now();c.cpuMs=Z-ce,c.sampleFrame(k)&&(m.onResize(c.width,c.height),h&&h.onResize(c.width,c.height)),s&&C-S>500&&(S=C,s(Xe()))}function U(C,k=Ce()){let N=1;if(h&&u){u.elapsed+=C;let Wt=Math.min(1,u.elapsed/Math.max(.001,u.duration));N=Br(u.easing||"smooth",Wt),h.setAudioFeatures?.(k),h.update(C,k),h.render(c)}m.setAudioFeatures?.(k),m.update(C,k),m.render(c);let le=h?h.getSceneTarget():null,ce=m.getSceneTarget(),Z=m.getPostParams(),ne=k.enabled?m.params?.audio??1:0,we=J(),kt=Number(we.volume?.exposure??.2),ja=Number(we.volume?.bloom??.15),Qe=Number(we.kick?.bloomPulse??.18),be=we.feedback||{},jt=Wt=>Math.min(1,Math.max(0,Number(Wt)||0)),Ae={exposure:(Z.exposure??1)*(1+(k.rms*kt+k.kickFlash*kt*.6)*ne),bloomStrength:(Z.bloomStrength??1)*(1+(k.high*.3+k.rms*ja+k.kickFlash*Qe)*ne),feedback:jt((Z.feedback??be.amount??.25)+((k.bassFast||0)*Number(be.bassZoom??.35)*.22+(k.kickFlash||0)*.12)*ne),feedbackDecay:Math.min(.999,Math.max(.5,(Z.feedbackDecay??be.decay??.92)-(k.kick||0)*Number(be.kickDecay??.035)*ne)),feedbackZoom:Math.max(0,(Z.feedbackZoom??be.zoom??.5)+(k.bassFast||0)*Number(be.bassZoom??.35)*ne),feedbackRotation:(Z.feedbackRotation??be.rotation??.3)+(k.midFast||0)*Number(be.midRotation??.4)*ne,feedbackWarp:Math.max(0,(Z.feedbackWarp??be.warp??.5)+(k.highFast||0)*Number(be.highWarp??.25)*ne)},Te=zr(u?.type);Te&&(Ae.feedback=jt(Ae.feedback+Te.amount),Ae.feedbackDecay=Math.min(.985,Ae.feedbackDecay+Te.decay),Ae.feedbackZoom=Math.max(0,Ae.feedbackZoom+Te.zoom)),f.render(le||ce,c.output,{...Z,...Ae,...w,transitionType:u?.type||"dissolve",transitionDirection:u?.direction||[1,0],transitionSeed:u?.seed||0,transitionProgress:N},le?ce:null,N),h&&u&&u.elapsed>=u.duration&&(h.dispose(),h=null,u=null)}function $(){E||p||(p=!0,g=0,O(typeof performance<"u"?performance.now():Date.now()))}function T(){p=!1,v&&cancelAnimationFrame(v),v=0}function F(C){return Bo(C)}function B(C){let k={...C||{}};return delete k.variant,delete k.seed,k}function V(C=null){let k=m?m.getParameters():{},N=Pr(b,k.variant??0);return D({...C||y||{},effect:b,variant:N,seed:k.seed??1,params:B(k)})}function K(C,k,N={}){if(!X(C))throw new Error(`Efecto GPU desconocido: ${C}`);if(C===b)return k&&m.setParameters(k),y=N.scene?D({...N.scene,effect:C}):V(),m;b&&m&&(M[b]=m.getParameters());let le=F(N.transitionMs??0),ce=m,Z=b,ne=L(C,{...i,...M[C]||{},...k||{}});return ce&&le>0?(h&&h.dispose(),h=ce,u={from:Z,to:C,elapsed:0,duration:le/1e3,type:N.transitionType||"dissolve",easing:N.transitionEasing||"smooth",direction:N.transitionDirection||[1,0],seed:N.transitionSeed||0}):ce&&(ce.dispose(),u=null,h=null),m=ne,b=C,y=N.scene?D({...N.scene,effect:C}):V(),m}function de(C,k={}){let N=D(C);if(!X(N.effect))throw new Error(`La escena usa un efecto no-GPU: ${N.effect}`);let le=kr(N.effect,N.variant),ce={...Nn(N),variant:le},Z=F(k.transitionMs??0);if(N.effect===b&&m&&Z>0){M[b]=m.getParameters();let ne=m,we=L(N.effect,{...i,...M[N.effect]||{},...ce});return h&&h.dispose(),h=ne,u={from:b,to:N.effect,elapsed:0,duration:Z/1e3,type:k.transitionType||"dissolve",easing:k.transitionEasing||"smooth",direction:k.transitionDirection||[1,0],seed:k.transitionSeed||0},m=we,y=D({...N,effect:N.effect,variant:N.variant,seed:N.seed}),y}return K(N.effect,ce,{...k,scene:N}),y=D({...N,effect:N.effect,variant:N.variant,seed:N.seed}),y}function Me(){return m?V():null}function Y(C){if(!m)return[];let k=m.setParameters(C);return h&&h.setParameters(C),k.length&&(y=V()),k}function te(){return m?m.getParameters():{}}function ve(){return m?m.getSchema():{}}function he(C){if(!c.setQuality(C))return;let k=m?m.getParameters():i;_(b,k)}function Ye(C){Object.assign(w,C||{})}function Xe(){return{...c.getStats(),effect:b,particleSize:m?.particleSize||0,particleCount:m?.particleCount||0,activeParticles:m?.particleCount?Math.floor(m.particleCount*(m.params.density??1)):0,transitioning:!!u,transitionFrom:u?.from||null,transitionType:u?.type||null,transitionProgress:u?Math.round(u.elapsed/u.duration*100)/100:1,renderer:"webgl2"}}function Se(){c&&(c.canvas.style.display="block",$())}function Ct(){c&&(T(),h&&(h.dispose(),h=null),u=null,c.canvas.style.display="none")}function $e(C){C.preventDefault(),T(),c.contextLost=!0,c.canvas.dispatchEvent(new CustomEvent("uv:engine-context-lost"))}function ie(){c.contextLost=!1;let C=b||Pa,k=(N=0)=>{if(!E){c.refreshExtensions?.();try{let le=m?m.getParameters():i;_(C,le),c.resize(),m.onResize(c.width,c.height),$()}catch(le){if(N<3){setTimeout(()=>k(N+1),120);return}console.error("No se pudo restaurar el contexto WebGL:",le),window.dispatchEvent(new CustomEvent("uv:engine-restore-failed",{detail:{error:le}}))}}};typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>k(0)):k(0)}function I(){E||(E=!0,T(),fe(),m&&m.dispose(),m=null,y=null,h&&h.dispose(),h=null,f&&f.dispose(),f=null,d&&d.dispose(),d=null,c&&(c.canvas.removeEventListener("webglcontextlost",$e),c.canvas.removeEventListener("webglcontextrestored",ie),c.dispose()),c=null)}c=new _n({container:t,canvas:n,quality:o,onScaleChange:(C,k)=>{f&&f.resize(C,k),m&&m.onResize(C,k),h&&h.onResize(C,k)}}),c.canvas.addEventListener("webglcontextlost",$e,!1),c.canvas.addEventListener("webglcontextrestored",ie,!1);function H(C){let k=C?.detail?.lite??Ue();he(k?"lite":"high")}window.addEventListener("uv:lite-mode",H);let fe=()=>window.removeEventListener("uv:lite-mode",H);try{_(r||Pa,i)}catch(C){throw f&&f.dispose(),f=null,d&&d.dispose(),d=null,window.removeEventListener("uv:lite-mode",H),c.dispose(),c=null,C}return a&&$(),{get canvas(){return c?.canvas||null},get gl(){return c?.gl||null},get renderer(){return c},get effect(){return m},get currentEffect(){return b},get currentScene(){return y?D(y):null},get transitioning(){return!!u},get running(){return p},get fpsCounter(){return l},start:$,stop:T,show:Se,hide:Ct,renderFrame:U,setEffect:K,setScene:de,getScene:Me,setParameters:Y,getParameters:te,getSchema:ve,setQuality:he,setPostParams:Ye,getStats:Xe,dispose:I}}function _a(e,t){return!(e&&t)}function La(e){e&&(e.parentNode?e.parentNode.removeChild(e):e.remove?.())}function $r(e={}){let t=e.source;if(!t||!t.width||!t.height)return null;let n=e.container||document.body,a=n.ownerDocument||document,r=Math.max(0,Number(e.durationMs)||0),i=e.easing||"ease-in-out",s=e.type||"dissolve",o;try{o=a.createElement("canvas")}catch{return null}o.width=t.width,o.height=t.height,o.className="uv-backend-crossfade",o.setAttribute("aria-hidden","true"),o.style.position="fixed",o.style.inset="0",o.style.width="100%",o.style.height="100%",o.style.zIndex="5",o.style.pointerEvents="none",o.style.opacity="1",o.style.transformOrigin="center",o.style.willChange="opacity, transform, clip-path",o.style.transition=`opacity ${r}ms ${i}, transform ${r}ms ${i}, clip-path ${r}ms ${i}`,s==="wipe"&&(o.style.clipPath="inset(0 0 0 0)");let l;try{l=e.contextFactory?e.contextFactory(o):o.getContext("2d")}catch{l=null}if(!l)return null;try{l.drawImage(t,0,0)}catch{return La(o),null}n.appendChild(o);let c=e.requestFrame||(typeof requestAnimationFrame=="function"?requestAnimationFrame:u=>setTimeout(u,16)),d=e.setTimeoutFn||(typeof setTimeout=="function"?setTimeout:u=>u()),f=!1,m=!1;function h(){m||(m=!0,s==="zoom"?(o.style.transform="scale(1.08)",o.style.opacity="0"):s==="wipe"?o.style.clipPath="inset(0 0 0 100%)":o.style.opacity="0")}return{canvas:o,finish(){f||(f=!0,c(()=>c(h)),d(h,80),d(()=>La(o),r+160))},cancel(){f||(f=!0,La(o))}}}var ln=null,jr=null,At=null,me=null,Le=null,cn=null,G=null,Dn=null,at=null,He=null,zn={isLite:!1},gt=!1,qr=null,Tt=null,No=Ma();function Ia(){zn={...zn,isLite:Ue()}}function Do(){at&&(at.style.display="none"),Le&&Le.stop()}function Wr(){at&&(at.style.display="block")}function Kr(){return document.querySelector("#generator main")||document.body}function Oo(){return G?.canvas&&G.canvas.style.display!=="none"?G.canvas:at&&at.style.display!=="none"?at:G?.canvas||at}function Yr(e){Tt&&(Tt.cancel(),Tt=null);let t=Oo();t&&(Tt=$r({source:t,durationMs:e.transitionMs,easing:Dr(e.transitionEasing),type:e.transitionType,container:document.body}))}function On(){Tt&&(Tt.finish(),Tt=null)}function Xr(e,t={}){if(!me)return{transitionMs:0};if(t.transitionMs===0)return{...t,transitionMs:0};if(t.transitionType&&Number.isFinite(Number(t.transitionMs)))return{...t};let n=X(me),a=X(e),r=Na(),i=D({effect:e,variant:Ve(e)}),s=Or({from:r,to:i,audio:Ce(),lastType:qr,sameBackend:n===a});return qr=s.type,{...s,transitionMs:t.transitionMs==="auto"||t.transitionMs==null?s.durationMs:t.transitionMs,transitionType:t.transitionType||s.type,transitionEasing:t.transitionEasing||s.easing,transitionDirection:t.transitionDirection||s.direction,transitionSeed:t.transitionSeed??s.seed}}function Ba(e,t=null,n={}){if(!Ht[e]){console.warn("Efecto GPU no encontrado:",e);return}if(ln&&Do(),Dn=t||Dn||Kr(),G){let a=G.currentEffect===e,r=G.running;G.setEffect(e,void 0,{transitionMs:a||!r?0:n.transitionMs??1e3,transitionType:n.transitionType,transitionEasing:n.transitionEasing,transitionDirection:n.transitionDirection,transitionSeed:n.transitionSeed}),G.show(),cn=G.fpsCounter}else{try{G=Hr({container:Dn,effectName:e,quality:Ue()?"lite":"auto"})}catch(a){console.error("No se pudo iniciar el motor GPU:",a),G=null,typeof window<"u"&&typeof window.dispatchEvent=="function"&&window.dispatchEvent(new CustomEvent("uv:engine-unavailable",{detail:{effectName:e,error:a}}));return}cn=G.fpsCounter}At=null,me=e,He=G?.getScene?.()||D({effect:e,variant:Ve(e)}),gt&&G&&G.stop()}function zo(e,t=null){if(typeof p5>"u"){console.warn("p5.js no est\xE1 cargado \u2014 el visualizador requiere p5");return}if(et[e]||(console.warn("Efecto no encontrado:",e),e="tunnel"),G&&G.hide(),Wr(),Ia(),!ln){ln=new p5(n=>{n.setup=function(){let a=n.createCanvas(window.innerWidth,window.innerHeight),r=Kr();a&&a.elt&&r&&a.elt.parentNode!==r&&r.appendChild(a.elt),at=a&&a.elt?a.elt:null;let i=No.isMobile?1:1.5;n.pixelDensity(Math.min(window.devicePixelRatio||1,i)),n.colorMode(n.HSB,360,100,100),n.stroke(255),n.noFill()},n.windowResized=function(){n.resizeCanvas(window.innerWidth,window.innerHeight)},Ia(),me=e,He=D({effect:e,variant:Ve(e)}),jr=n,At=et[e](n),cn=Pn(),Le=Tr({targetFps:60,fpsCounter:cn,onFrame:()=>{At&&At.draw&&(zn.variant=He?.variant,At.draw(zn))}}),Le.start(),gt&&Le.stop(),n.draw=function(){}},t||Dn||null);return}Vn(e)}function Un(e="tunnel",t=null){if(X(e)){Ba(e,t);return}zo(e,t)}function Vn(e,t={}){let n=X(e);if(!n&&!et[e]){console.warn("Efecto no encontrado:",e);return}let a=Xr(e,t),r=X(me);if(!!me&&_a(r,n)&&a.transitionMs>0&&Yr(a),n){Ba(e,null,a),On();return}if(!ln){Un(e),On();return}G&&G.hide(),Wr(),Ia();let s=jr||ln;me=e,At=et[e](s),He=D({effect:e,variant:Ve(e)}),Le&&!Le.isRunning()&&!gt&&Le.start(),gt&&G&&G.stop(),On()}function Qr(e,t={}){let n=D(e);if(!X(n.effect)&&!et[n.effect])return console.warn("Efecto no encontrado:",n.effect),null;let a=Xr(n.effect,t),r=X(me),i=X(n.effect);return i?(!!me&&_a(r,i)&&a.transitionMs>0&&Yr(a),Ba(n.effect,null,a),G&&G.setScene(n,a),me=n.effect,At=null,He=n,On(),n):(Vn(n.effect,a),me=n.effect,He=n,n)}function Na(){return me?X(me)&&G?(He=G.getScene(),He):He&&He.effect===me?D(He):D({effect:me,variant:Ve(me)}):null}function Zr(e){return gt=!!e,gt?(G&&G.stop(),Le&&Le.stop()):X(me)&&G?G.show():Le&&Le.start(),gt}function Jr(){return gt}function vt(e){return G?G.setParameters(e):[]}function qt(){return G?G.getParameters():{}}function ei(){return G?G.getSchema():{}}function ti(){return G?G.getStats():null}function ni(){return G}function ai(){return G?G.fpsCounter:cn}var Gn=null,ri=!1,Hn=null;function ii(e,t,n){if(Da(),!t||t.length===0){console.warn("No hay efectos disponibles para transici\xF3n");return}Hn=n,ri=!0;let a=0;Gn=setInterval(()=>{Hn&&(a=(a+1)%t.length,Hn(t[a]))},e)}function Da(){Gn&&(clearInterval(Gn),Gn=null),ri=!1,Hn=null}var Oa=["1","2","3","4","5","6","7","8","9","0","-","="],Uo={tunnel:"T\xFAnel",spiral:"Espiral",mandala:"M\xE1ndala",particles:"Part\xEDculas",waves:"Olas",fractal:"Fractal",matrix:"Matrix",glitch:"Glitch",melt:"Melt",fractalGlitch:"Fractal Glitch",waveGlitch:"Wave Glitch",sacredGeometry:"Geometr\xEDa Sagrada",biomech:"Biomech",dune:"Duna",yinYang:"Yin Yang",fluidFields:"Fluid Fields",organicStructures:"Organic Structures",mathematicalForms:"Mathematical Forms",temporalVeil:"Temporal Veil"};function li(e,t,n,a={}){if(!e||!t)return null;let r={...Uo,...a.labels||{}},i=Object.keys(t),s=Array.isArray(a.order)&&a.order.length>0?a.order.filter(b=>i.includes(b)).concat(i.filter(b=>!a.order.includes(b))):i.sort(),o=Go(),l=new Map,c=new Set(a.classicNames||[]);for(let b of s){let y=document.createElement("button");if(y.className=`thumb${c.has(b)?" is-classic":""}`,y.type="button",y.setAttribute("aria-label",r[b]||b),y.setAttribute("aria-pressed","false"),y.dataset.effectName=b,c.has(b)){let E=document.createElement("span");E.className="thumb-classic-badge",E.textContent="Cl\xE1sico",y.appendChild(E)}let p=Oa[l.size];if(p){let E=document.createElement("span");E.className="thumb-key",E.textContent=p,y.appendChild(E)}let v=document.createElement("span");if(v.className="thumb-label",v.textContent=r[b]||b,y.appendChild(v),!o){let E=document.createElement("canvas");E.width=80,E.height=80,y.appendChild(E)}y.addEventListener("click",()=>n?.(b)),e.appendChild(y);let g=y.querySelector("canvas");if(l.set(b,{btn:y,preview:g}),g){let E=t[b],S=g.getContext("2d");if(S&&E)try{if(typeof E.preview=="function")E.preview(S,g.width,g.height,.6);else{let w=oi(g),M=E(w);for(let A=0;A<4;A++)M.draw()}}catch{}}}let d=null,f=null,m=b=>{h(),f=b;let{preview:y}=l.get(b)||{},p=t[b];if(!y||!p)return;if(typeof p.preview=="function"){let A=y.getContext("2d"),L=0,_=O=>{if(f===b){try{p.preview(A,y.width,y.height,O/1e3)}catch{return}L=requestAnimationFrame(_)}};L=requestAnimationFrame(_),d=()=>{f=null,cancelAnimationFrame(L)};return}let v=oi(y),g=p(v),E=0,S=1e3/5,w=0,M=A=>{if(f===b){if(A-E>=S){E=A;try{g.draw()}catch{return}}w=requestAnimationFrame(M)}};w=requestAnimationFrame(M),d=()=>{f=null,cancelAnimationFrame(w)}},h=()=>{d&&d(),d=null};return{highlight:b=>{if(l.has(b)){for(let[y,{btn:p}]of l)p.setAttribute("aria-pressed",y===b?"true":"false");m(b)}},stopPreview:h,getNames:()=>s,getKey:b=>{let y=s.indexOf(b);return y>=0&&y<Oa.length?Oa[y]:null},destroy:()=>{h(),e.innerHTML=""}}}function oi(e){let t=e.getContext("2d"),n=e.width,a=e.height,r=()=>{},i={mode:"RGB",maxR:255,maxG:255,maxB:255},s={on:!1,r:0,g:0,b:0,a:255};return{width:n,height:a,background:(o,l)=>{let c=typeof l=="number"?l:255;t.fillStyle=`rgba(0, 0, 0, ${c/255})`,t.fillRect(0,0,n,a)},noFill:()=>{s.on=!1,t.fillStyle="transparent"},fill:(o,l,c,d)=>{s.on=!0,s.r=o,s.g=l,s.b=c,s.a=d??255,t.fillStyle=si(i,o,l,c,s.a)},stroke:(o,l,c,d)=>{t.strokeStyle=si(i,o,l,c,d??255)},strokeWeight:o=>{t.lineWidth=o},colorMode:(o,l,c,d)=>{i.mode=o,i.maxR=l??255,i.maxG=c??l??255,i.maxB=d??l??255},translate:(o,l)=>{t.translate(o,l)},push:()=>{t.save()},pop:()=>{t.restore()},rotate:o=>{t.rotate(o)},ellipse:(o,l,c,d)=>{t.beginPath(),t.ellipse(o,l,c/2,d/2,0,0,Math.PI*2),s.on&&t.fill(),t.stroke()},line:(o,l,c,d)=>{t.beginPath(),t.moveTo(o,l),t.lineTo(c,d),t.stroke()},point:(o,l)=>{t.fillRect(o,l,1,1)},rect:(o,l,c,d)=>{t.strokeRect(o,l,c,d),s.on&&t.fillRect(o,l,c,d)},beginShape:r,endShape:r,vertex:(o,l)=>{t.lineTo(o,l)},PI:Math.PI,TWO_PI:Math.PI*2,HALF_PI:Math.PI/2,HSB:"HSB",RGB:"RGB",DEGREES:"degrees",RADIANS:"radians",createCanvas:r}}function si(e,t,n,a,r){let i=(s,o)=>o===255?s:s/o*255;return e.mode==="HSB"?Vo(t,n,a,r):`rgba(${i(t,e.maxR)}, ${i(n,e.maxG)}, ${i(a,e.maxB)}, ${r/255})`}function Vo(e,t,n,a){e=(e%360+360)%360/360,t=Math.min(1,Math.max(0,t/100));let r=Math.min(1,Math.max(0,n/100)),i=Math.floor(e*6),s=e*6-i,o=r*(1-t),l=r*(1-s*t),c=r*(1-(1-s)*t),d,f,m;switch(i%6){case 0:d=r,f=c,m=o;break;case 1:d=l,f=r,m=o;break;case 2:d=o,f=r,m=c;break;case 3:d=o,f=l,m=r;break;case 4:d=c,f=o,m=r;break;case 5:d=r,f=o,m=l;break}return`rgba(${Math.round(d*255)}, ${Math.round(f*255)}, ${Math.round(m*255)}, ${a/255})`}function Go(){try{let e=navigator.deviceMemory;if(typeof e=="number"&&e<4)return!0;let t=navigator.hardwareConcurrency;if(typeof t=="number"&&t<4)return!0;let n=navigator.connection;if(n&&n.saveData)return!0}catch{}return!1}var ci={play:["M8 5.5v13l11-6.5z"],pause:["M8 5v14","M16 5v14"],prev:["M18 6l-9 6 9 6z","M6 6v12"],next:["M6 6l9 6-9 6z","M18 6v12"],mic:["M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z","M6 11a6 6 0 0 0 12 0","M12 17v4","M9 21h6"],camera:["M4 8h3l2-2h6l2 2h3v11H4z","M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"],share:["M12 16V4","M7 9l5-5 5 5","M5 14v5h14v-5"],bookmark:["M6 4h12v17l-6-4-6 4z"],expand:["M4 9V4h5","M20 9V4h-5","M4 15v5h5","M20 15v5h-5"],collapse:["M9 4v5H4","M15 4v5h5","M9 20v-5H4","M15 20v-5h5"],chevron:["M8 10l4 4 4-4"],sliders:["M4 7h10","M18 7h2","M4 12h4","M12 12h8","M4 17h12","M20 17h0","M16 5v4","M10 10v4","M16 15v4"],cube:["M12 3l8 4.5v9L12 21l-8-4.5v-9z","M12 12l8-4.5","M12 12L4 7.5","M12 12v9"],wave:["M3 14c3 0 3-6 6-6s3 8 6 8 3-6 6-6"],circle:["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],dice:["M5 5h14v14H5z","M9 9h.01","M15 9h.01","M12 12h.01","M9 15h.01","M15 15h.01"],reset:["M4 10a8 8 0 1 1 2 7","M4 4v6h6"],close:["M6 6l12 12","M18 6L6 18"],menu:["M4 7h16","M4 12h16","M4 17h16"],grid:["M4 4h6v6H4z","M14 4h6v6h-6z","M4 14h6v6H4z","M14 14h6v6h-6z"],info:["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M12 11v5","M12 8h.01"],moon:["M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"],trash:["M5 7h14","M9 7V5h6v2","M7 7l1 13h8l1-13"],sparkle:["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"],external:["M14 4h6v6","M20 4l-9 9","M11 5H5v14h14v-6"]};function re(e,t=16){let n="http://www.w3.org/2000/svg",a=document.createElementNS(n,"svg");a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("width",String(t)),a.setAttribute("height",String(t)),a.setAttribute("fill","none"),a.setAttribute("stroke","currentColor"),a.setAttribute("stroke-width","1.5"),a.setAttribute("stroke-linecap","round"),a.setAttribute("stroke-linejoin","round"),a.setAttribute("aria-hidden","true"),a.classList.add("uv-icon");let r=ci[e]||ci.circle;for(let i of r){let s=document.createElementNS(n,"path");s.setAttribute("d",i),a.appendChild(s)}return a}var Ho=new Set(["seed"]),ui=["Forma","Movimiento","Apariencia","Comportamiento"],$o={Forma:"cube",Movimiento:"wave",Apariencia:"circle",Comportamiento:"sliders"};function mi(e,{onChange:t=null,emptyText:n=null}={}){if(!e)return{refresh(){},destroy(){}};let a=document.createElement("div");a.className="uv-params-list",a.id="effect-params-list";let r=document.createElement("div");r.className="uv-params-actions";let i=document.createElement("button");i.type="button",i.className="uv-btn uv-btn-quiet",i.append(re("reset",14),document.createTextNode("Reiniciar")),r.appendChild(i),e.append(a,r),e.hidden=!0;let s=null,o={};function l(){t&&t(qt())}function c(u,b,y){let p=document.createElement("div");p.className="uv-param-row";let v=document.createElement("label");v.textContent=b.label||u,v.htmlFor=`uv-param-${u}`;let g=document.createElement("input");g.type="range",g.id=`uv-param-${u}`,g.min=String(b.min??0),g.max=String(b.max??1),g.step=b.type==="int"?"1":"0.01",g.value=String(y),u==="hue"&&(g.dataset.kind="hue");let E=()=>{let w=Number(g.min)||0,M=Number(g.max)||1,A=M===w?0:(Number(g.value)-w)/(M-w)*100;g.style.setProperty("--fill",`${A}%`)};E();let S=document.createElement("span");return S.className="uv-param-value",S.textContent=b.type==="int"?String(y):Number(y).toFixed(2),g.addEventListener("input",()=>{let w=Number(g.value);vt({[u]:w}),S.textContent=b.type==="int"?String(w):w.toFixed(2),E(),l()}),p.append(v,g,S),p}function d(u,b,y){let p=document.createElement("div");p.className="uv-param-row uv-param-toggle";let v=document.createElement("label");v.textContent=b.label||u,v.htmlFor=`uv-param-${u}`;let g=document.createElement("span");g.className="uv-switch";let E=document.createElement("input");E.type="checkbox",E.id=`uv-param-${u}`,E.checked=!!y;let S=document.createElement("span");return S.className="uv-switch-track",g.append(E,S),E.addEventListener("change",()=>{vt({[u]:E.checked}),l()}),p.append(v,g),p}function f(u,b){let y=document.createElement("div");y.className="uv-param-row uv-param-seed";let p=document.createElement("label");p.textContent=u.label||"Seed";let v=document.createElement("span");v.className="uv-seed-value",v.textContent=String(b);let g=document.createElement("button");return g.type="button",g.className="uv-btn uv-btn-icon",g.title="Nueva seed",g.setAttribute("aria-label","Nueva seed"),g.appendChild(re("dice",15)),g.addEventListener("click",()=>{let E=Math.floor(Math.random()*1e5);vt({seed:E}),v.textContent=String(E),l()}),y.append(p,v,g),y}function m(u,b,y){let p=document.createElement("section");p.className="uv-param-group";let v=document.createElement("button");v.type="button",v.className="uv-param-group-head",v.setAttribute("aria-expanded","true"),v.append(re($o[u]||"sliders",14));let g=document.createElement("span");g.textContent=u,v.appendChild(g),v.appendChild(re("chevron",14));let E=document.createElement("div");E.className="uv-param-group-body";for(let[S,w]of b)w.type==="boolean"?E.appendChild(d(S,w,y[S]??w.default)):Ho.has(S)?E.appendChild(f(w,y[S]??w.default)):E.appendChild(c(S,w,y[S]??w.default));return v.addEventListener("click",()=>{let S=v.getAttribute("aria-expanded")!=="false";v.setAttribute("aria-expanded",String(!S)),E.hidden=S}),p.append(v,E),p}function h(){a.innerHTML="",o=ei();let u=qt(),b=Object.entries(o);if(r.hidden=b.length===0,b.length===0){let v=document.createElement("p");v.className="uv-params-empty",v.textContent=n||"Este efecto no expone par\xE1metros en vivo.",a.appendChild(v);return}let y=new Map;for(let[v,g]of b){let E=g.group||"Par\xE1metros";y.has(E)||y.set(E,[]),y.get(E).push([v,g])}let p=[...y.keys()].sort((v,g)=>{let E=ui.indexOf(v),S=ui.indexOf(g);return(E<0?99:E)-(S<0?99:S)});for(let v of p)a.appendChild(m(v,y.get(v),u))}return i.addEventListener("click",()=>{if(!s)return;let u={};for(let[b,y]of Object.entries(o))u[b]=y.default;vt(u),h(),l()}),{refresh(u){if(s=u,!u||!X(u)){e.hidden=!0,a.innerHTML="",o={};return}e.hidden=!1,h()},getEffectName(){return s},destroy(){e.hidden=!0,a.innerHTML=""}}}var qo=[{label:"Kick",path:"kick.depth",min:0,max:1.5,step:.01,digits:2},{label:"Retumbe",path:"kick.decaySec",min:.4,max:2.5,step:.05,digits:2},{label:"Sensibilidad",path:"kick.sensitivity",min:.2,max:3,step:.05,digits:2},{label:"Torsi\xF3n",path:"midFlow.twist",min:0,max:.6,step:.01,digits:2},{label:"Shimmer",path:"highShimmer.porosity",min:0,max:1.5,step:.01,digits:2},{label:"Volumen",path:"volume.exposure",min:0,max:.8,step:.01,digits:2},{label:"Din\xE1mica",path:"dynamics.autoGain",min:0,max:1,step:.01,digits:2}];function jo(e,t){return t.split(".").reduce((n,a)=>n==null?n:n[a],e)}function di(e){if(!e)return{refresh(){}};let t=document.createElement("section");t.className="uv-audio-panel";let n=document.createElement("div");n.className="uv-audio-head",n.append(re("wave",14));let a=document.createElement("span");a.textContent="Audio reactivo",n.appendChild(a);let r=document.createElement("button");r.type="button",r.className="uv-btn uv-btn-icon",r.title="Reiniciar audio",r.setAttribute("aria-label","Reiniciar audio"),r.appendChild(re("reset",14)),r.addEventListener("click",()=>{Xa(),g()}),n.appendChild(r),t.appendChild(n);let i=document.createElement("div");i.className="uv-audio-body",t.appendChild(i);function s(w,M,A,L){let _=document.createElement("div");_.className="uv-param-row uv-audio-row";let O=document.createElement("label");O.textContent=w;let U=document.createElement("select");U.className="uv-select";for(let[$,T]of M){let F=document.createElement("option");F.value=$,F.textContent=T,$===A&&(F.selected=!0),U.appendChild(F)}return U.addEventListener("change",()=>L(U.value)),_.append(O,U),i.appendChild(_),U}function o(w,M){let A=document.createElement("div");A.className="uv-param-row";let L=document.createElement("label");L.textContent=w.label;let _=document.createElement("input");_.type="range",_.min=String(w.min),_.max=String(w.max),_.step=String(w.step),_.value=String(M);let O=document.createElement("span");O.className="uv-param-value",O.textContent=Number(M).toFixed(w.digits);let U=()=>{let $=(Number(_.value)-w.min)/(w.max-w.min)*100;_.style.setProperty("--fill",`${$}%`)};U(),_.addEventListener("input",()=>{let $=Number(_.value);Nt(w.path,$),O.textContent=$.toFixed(w.digits),U()}),A.append(L,_,O),i.appendChild(A)}let l=document.createElement("div");l.className="uv-param-row uv-audio-row";let c=document.createElement("label");c.textContent="BPM";let d=document.createElement("span");d.className="uv-bpm-wrap";let f=document.createElement("input");f.type="number",f.min="60",f.max="200",f.step="1",f.className="uv-number";let m=document.createElement("button");m.type="button",m.className="uv-btn uv-btn-quiet",m.textContent="Auto",d.append(f,m),l.append(c,d),i.appendChild(l);function h(){let w=J().sync?.bpm,M=typeof w!="number";f.value=String(M?J().sync?.fallbackBpm??128:w),f.disabled=M,m.textContent=M?"Auto":"Manual",m.classList.toggle("is-on",M),m.setAttribute("aria-pressed",String(M)),m.title=M?"BPM autom\xE1tico \xB7 click para fijar manual":"BPM manual \xB7 click para volver a autom\xE1tico"}f.addEventListener("change",()=>{let w=Math.max(60,Math.min(200,Number(f.value)||128));Nt("sync.bpm",w),h()}),m.addEventListener("click",()=>{if(typeof J().sync?.bpm=="number")Nt("sync.bpm","auto");else{let M=Ce().bpm||J().sync?.fallbackBpm||128;Nt("sync.bpm",Math.round(M))}h()});let u=document.createElement("div");u.className="uv-audio-status";let b=document.createElement("span");b.className="uv-audio-status-text";let y=document.createElement("span");y.className="uv-phase-track";let p=document.createElement("span");p.className="uv-phase-fill",y.appendChild(p);let v=document.createElement("span");v.className="uv-kick-dot",u.append(v,b,y),t.appendChild(u);function g(){i.replaceChildren(),h();let w=J().sync?.mode||"grid";s("Sincron\xEDa",[["grid","Grilla 4/4"],["kick","Kick real"],["off","Off"]],w,M=>Nt("sync.mode",M)),i.appendChild(l);for(let M of qo)o(M,Number(jo(J(),M.path)??M.min));h()}e.appendChild(t),g();let E=0;function S(){let w=performance.now();if(w-E<120)return;E=w;let M=Ce(),A=M.syncMode==="grid"?"4/4":M.syncMode==="kick"?"kick":"off",L=M.bpm?Math.round(M.bpm):"\u2014",_=Math.round((M.tempoConfidence||0)*100);b.textContent=`${A} \xB7 ${L} BPM \xB7 ${_}%`,p.style.width=`${Math.max(0,Math.min(1,M.beatPhase||0))*100}%`,v.style.transform=`scale(${1+Math.min(1.4,M.kick||0)*.9})`,v.classList.toggle("is-hit",(M.kick||0)>.35)}return{refresh:S,rebuild:g}}var un=42;function fi(e){if(!e)return{start(){},stop(){}};let t=156,n=34,a=Math.min(window.devicePixelRatio||1,2);e.width=Math.round(t*a),e.height=Math.round(n*a),e.style.width=`${t}px`,e.style.height=`${n}px`;let r=e.getContext("2d");if(!r)return{start(){},stop(){}};r.scale(a,a);let i=new Float32Array(un),s=0,o=!1,l=0;function c(f){return f<.3?"187, 140, 255":f<.68?"137, 176, 255":"226, 221, 242"}function d(f){if(!o||(s=requestAnimationFrame(d),f-l<24))return;l=f;let m=Ja(),h=Ce(),u=!!m&&h.enabled,b=t,y=n;r.clearRect(0,0,b,y);let p=1.4,v=(b-p*(un-1))/un,g=y-1;for(let A=0;A<un;A++){let L=A/(un-1),_=Math.pow(L,1.9),O=m?Math.min(m.length-1,Math.floor(_*m.length*.58)+1):0,U=m?m[O]/255:0;u&&(U=Math.pow(U,.78)),i[A]=Math.max(U,i[A]*.9);let $=Math.max(u?1.2:.8,U*(y-4)),T=A*(v+p),F=c(L);if(r.fillStyle=`rgba(${F}, ${u?.78:.22})`,r.fillRect(T,g-$,v,$),u&&i[A]>.04){let B=g-i[A]*(y-4);r.fillStyle=`rgba(${F}, 0.95)`,r.fillRect(T,Math.max(0,B-1),v,1)}}let E=y-4,S=["187, 140, 255","137, 176, 255","226, 221, 242"],w=[h.bass,h.mid,h.high],M=b/3;for(let A=0;A<3;A++){r.fillStyle="rgba(255, 255, 255, 0.08)",r.fillRect(A*M,E,M-2,2);let L=u?Math.min(1,w[A]/1.2):0;r.fillStyle=`rgba(${S[A]}, ${u?.95:.2})`,r.fillRect(A*M,E,Math.max(0,(M-2)*L),2)}}return{start(){o||(o=!0,l=0,s=requestAnimationFrame(d))},stop(){o=!1,s&&cancelAnimationFrame(s),s=0},destroy(){this.stop(),r.clearRect(0,0,t,n)}}}var pi="umbral-vision:presets",Ft={data:[],warned:!1};function Wo(){return`p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}function Ko(e){if(!e||typeof e!="object")return null;let t=e.state&&typeof e.state=="object"?e.state:{},n;try{n=t.scene?ht(t.scene):sn(t,{id:e.id,name:e.name,createdAt:e.createdAt})}catch{return null}let a=e.id||n.id,r=D({...n,id:a,name:e.name||n.name,createdAt:e.createdAt||n.createdAt,updatedAt:n.updatedAt||e.createdAt||new Date().toISOString()});return{...e,id:a,name:e.name||r.name,createdAt:e.createdAt||r.createdAt,state:{...t,effect:t.effect||r.effect,interval:t.interval??null,audioEnabled:!!t.audioEnabled,params:t.params===void 0?null:t.params,scene:r}}}function hi(){return[...qn()].sort((t,n)=>String(n.createdAt).localeCompare(String(t.createdAt)))}function za(e,t){if(!e||!t)return null;let n=String(e).trim();if(!n)return null;let a=qn(),r=t.presetId||Wo(),i=t.scene?ht(t.scene):sn(t,{id:r,name:n}),s=D({...i,id:r,name:n,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}),o={id:r,name:n,state:{effect:t.effect||s.effect,interval:t.interval??null,audioEnabled:!!t.audioEnabled,params:t.params===void 0?null:t.params,scene:s},createdAt:s.createdAt},l=a.findIndex(c=>c.id===r);return l>=0?a[l]=o:a.push(o),Ua(a),o}function $n(e,t,n={}){return t?za(e,{effect:t.effect,interval:n.interval??null,audioEnabled:!!n.audioEnabled,params:Nn(t),scene:t,presetId:t.id}):null}function gi(e){let t=qn(),n=t.findIndex(a=>a.id===e);return n<0?!1:(t.splice(n,1),Ua(t),!0)}function mn(){return qn().map(e=>e.state?.scene).filter(Boolean)}function qn(){let e=[];try{let n=localStorage.getItem(pi);if(n){let a=JSON.parse(n);Array.isArray(a)&&(e=a)}}catch{return Ft.data.slice()}let t=e.map(Ko).filter(Boolean);try{let n=JSON.stringify(e),a=JSON.stringify(t);e.length&&n!==a&&Ua(t)}catch{}return Ft.data=t.slice(),t}function Ua(e){try{localStorage.setItem(pi,JSON.stringify(e)),Ft.data=e.slice(),Ft.warned=!1}catch{Ft.data=e.slice(),Ft.warned||(Ft.warned=!0,typeof window<"u"&&window.dispatchEvent(new CustomEvent("uv:toast",{detail:{text:"Los presets no persistir\xE1n al cerrar esta ventana",duration:3500}})))}}var vi="umbral-vision-pack",bi=1;function yi(e,{name:t="Umbral Vision",includeThumbnails:n=!1}={}){let a=(e||[]).map(r=>{let i=D(r),s={id:i.id,scene:i};return n&&r.thumbnail&&(s.thumbnail=r.thumbnail),s});return{format:vi,version:bi,name:String(t||"Umbral Vision"),createdAt:new Date().toISOString(),count:a.length,scenes:a}}function xi(e){return JSON.stringify(e,null,2)}function Yo(e){let t=typeof e=="string"?JSON.parse(e):e;if(!t||typeof t!="object"||Array.isArray(t))throw new Error("Pack inv\xE1lido: se esperaba un objeto");if(t.format!==vi)throw new Error(`Pack inv\xE1lido: formato "${t.format||"desconocido"}"`);if(Number(t.version)>bi)throw new Error(`Pack con versi\xF3n ${t.version} no soportada`);if(!Array.isArray(t.scenes))throw new Error("Pack inv\xE1lido: falta la lista de escenas");return t}function Ei(e,t=[]){let n=Yo(e),a=new Set(t.map(String)),r=[],i=[],s=[];for(let o of n.scenes)try{let l=o&&o.scene?o.scene:o,c=ht(l),d=c.id||pt("imp");if(a.has(String(d))){i.push(d);continue}let f=D({...c,id:d,thumbnail:void 0});r.push(f),a.add(String(d))}catch(l){s.push({item:o,error:l.message})}return{pack:{name:n.name,version:n.version},added:r.length,skipped:i.length,failed:s.length,scenes:r,skippedIds:i,errors:s}}var Va=[{name:"abyss",hue:.56,saturation:.9},{name:"ember",hue:.05,saturation:.95},{name:"acid",hue:.22,saturation:.85},{name:"ultraviolet",hue:.78,saturation:.95},{name:"ice",hue:.48,saturation:.7},{name:"blood",hue:.98,saturation:.9},{name:"sand",hue:.11,saturation:.65}],Ga=Object.freeze({fluidFields:{variants:["membrane","torus","ribbon"],params:{density:{min:.55,max:1,default:.9,sigma:.09},speed:{min:.6,max:1.8,default:1,sigma:.16},amplitude:{min:.35,max:1.1,default:.62,sigma:.14},complexity:{min:.3,max:1,default:.62,sigma:.13},turbulence:{min:.2,max:1.2,default:.55,sigma:.16},hue:{min:0,max:1,default:.56,sigma:.16},saturation:{min:.45,max:1,default:.9,sigma:.1},glow:{min:.4,max:2,default:.68,sigma:.22},particleSize:{min:.7,max:1.8,default:1,sigma:.18},bloom:{min:.3,max:1.8,default:.85,sigma:.22},exposure:{min:.6,max:1.5,default:.98,sigma:.16},audio:{min:.6,max:1,default:1,sigma:.08}}},organicStructures:{variants:["knot"],params:{speed:{min:.6,max:1.8,default:1,sigma:.16},amplitude:{min:.08,max:.6,default:.26,sigma:.09},frequency:{min:.6,max:3,default:1.35,sigma:.35},twist:{min:0,max:1,default:.2,sigma:.2},hue:{min:0,max:1,default:.53,sigma:.16},saturation:{min:.45,max:1,default:.95,sigma:.08},glow:{min:.4,max:2,default:.95,sigma:.24},opacity:{min:.35,max:1,default:.85,sigma:.12},bloom:{min:.3,max:1.8,default:.85,sigma:.22},exposure:{min:.6,max:1.5,default:.95,sigma:.16},audio:{min:.6,max:1,default:1,sigma:.08}}},mathematicalForms:{variants:["mandelbulb"],params:{speed:{min:.5,max:1.8,default:1,sigma:.16},power:{min:4,max:11,default:7.6,sigma:1.1},warp:{min:0,max:1.2,default:.35,sigma:.2},detail:{min:.25,max:.9,default:.55,sigma:.14},hue:{min:0,max:1,default:.58,sigma:.16},saturation:{min:.4,max:1,default:.85,sigma:.1},glow:{min:.4,max:2,default:.95,sigma:.24},bloom:{min:.2,max:1.6,default:.58,sigma:.2},exposure:{min:.55,max:1.4,default:.88,sigma:.15},audio:{min:.6,max:1,default:1,sigma:.08}}},temporalSystems:{variants:["veil"],params:{speed:{min:.5,max:1.8,default:1,sigma:.16},decay:{min:.82,max:.985,default:.93,sigma:.025},zoom:{min:.2,max:.9,default:.55,sigma:.14},rotation:{min:-.8,max:.8,default:.45,sigma:.2},warp:{min:.1,max:1.2,default:.55,sigma:.18},density:{min:.1,max:.9,default:.3,sigma:.12},hue:{min:0,max:1,default:.62,sigma:.16},saturation:{min:.4,max:1,default:.9,sigma:.1},glow:{min:.4,max:2,default:.85,sigma:.22},bloom:{min:.25,max:1.8,default:.7,sigma:.2},exposure:{min:.6,max:1.5,default:.95,sigma:.15},audio:{min:.6,max:1,default:1,sigma:.08}}}}),Xo={bloom:{min:.25,max:1.8,default:.8,sigma:.2},exposure:{min:.65,max:1.4,default:.98,sigma:.14},vignette:{min:.25,max:.8,default:.55,sigma:.1},grain:{min:.008,max:.06,default:.028,sigma:.01},aberration:{min:.002,max:.035,default:.014,sigma:.006},feedback:{min:.08,max:.55,default:.25,sigma:.08},feedbackDecay:{min:.86,max:.975,default:.92,sigma:.02}};function Rt(e,t,n){return Math.min(n,Math.max(t,e))}function wi(e){let t=0,n=0;for(;t===0;)t=e();for(;n===0;)n=e();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*n)}function Mi(e,t,n=null){let a=Number.isFinite(n)?n:t.default;return e()<.3?t.min+e()*(t.max-t.min):Rt(a+wi(e)*t.sigma,t.min,t.max)}function Qo(e){let t=Va[Math.floor(e()*Va.length)]||Va[0];return{mode:"named",name:t.name,hue:Rt(t.hue+(e()-.5)*.12,0,1),saturation:Rt(t.saturation+(e()-.5)*.18,.25,1)}}function Zo(e){let t={};for(let[n,a]of Object.entries(Xo))t[n]=Mi(e,a);return t}function Ha(e){return e?Object.entries(e.variants).filter(([,t])=>t.implemented!==!1).map(([t])=>t):[]}function Jo(e,t){if(t)return $t(t);let a=on({includeClassics:!1}).filter(r=>Ha(r).length>0);return a[Math.floor(e()*a.length)]||a[0]||null}function jn(e={}){let t=Number.isFinite(e.seed)?e.seed>>>0:ft(),n=e.rng||Pe(t),a=Jo(n,e.familyId);if(!a)throw new Error("No hay familias disponibles para samplear");let r=Ha(a),i=e.variantId&&a.variants[e.variantId]?e.variantId:r[Math.floor(n()*r.length)]||a.defaultVariant,s=St(a.id,i),o=Ga[a.id]||{params:{}},l={};for(let[d,f]of Object.entries(o.params||{}))l[d]=Mi(n,f);let c=D({id:pt("gen"),name:e.name||"",origin:"generated",effect:s.effect,variant:i,seed:t,params:l,palette:Qo(n),post:Zo(n),drift:{enabled:!0,rates:{hue:.004+n()*.02,warp:.004+n()*.025}},tags:[a.id,i]});return Si(c)}function Si(e){let t=D(e),n=Ai(t),a=Ga[n]||{params:{}},r={...t.params};for(let[i,s]of Object.entries(a.params||{}))Number.isFinite(Number(r[i]))?r[i]=Rt(Number(r[i]),s.min,s.max):r[i]=s.default;return Number.isFinite(r.saturation)&&r.saturation<.2&&(r.saturation=.35),Number.isFinite(r.exposure)&&Number.isFinite(r.bloom)&&r.exposure*(1+r.bloom)<.55&&(r.exposure=Math.max(.7,r.exposure),r.bloom=Math.max(.35,r.bloom)),D({...t,params:r})}function Ai(e){return mt(e)||e.tags?.[0]||null}function Wn(e,t={}){let n=D(e),a=Number.isFinite(t.seed)?t.seed>>>0:ft(),r=t.rng||Pe(a),i=Ai(n),s=$t(i),o=Ga[i]||{params:{}},l=Math.max(.05,Math.min(1,Number(t.strength??.35))),c=Object.keys(o.params||{}),d=Array.isArray(t.genes)&&t.genes.length?t.genes.filter(y=>c.includes(y)):[],f=d.length?d:c.filter(()=>r()<.35).slice(0,3),m={...n.params};for(let y of f){let p=o.params[y],v=Number.isFinite(Number(m[y]))?Number(m[y]):p.default;m[y]=Rt(v+wi(r)*p.sigma*l,p.min,p.max)}let h=n.variant;if(t.allowVariantChange&&s){let y=Ha(s).filter(p=>p!==n.variant);y.length&&r()<.25&&(h=y[Math.floor(r()*y.length)])}let u=s?St(s.id,h):null,b={...n.palette,hue:Rt(n.palette.hue+(r()-.5)*.08,0,1),saturation:Rt(n.palette.saturation+(r()-.5)*.1,.25,1)};return Si(D({...n,id:pt("mut"),name:t.name||"",origin:"mutated",parentId:n.id,effect:u?u.effect:n.effect,variant:h,seed:a,params:m,palette:b,tags:[i,h].filter(Boolean)}))}var dn=Object.freeze(["curated","generative","hybrid"]);function Ti(e){return dn.includes(e)}function es({bpm:e,beatPhase:t,beatsPerBar:n=4,phraseBars:a=1}={}){let r=Number(e);if(!Number.isFinite(r)||r<=0)return null;let i=Number.isFinite(Number(t))?Math.min(.999,Math.max(0,Number(t))):0,s=60/r,o=Math.max(1,Number(n)||4)*Math.max(1,Number(a)||1);return(1-i+(o-1))*s}function Fi(e,t=()=>1,n=Math.random){if(!e||e.length===0)return null;let a=0,r=e.map(s=>{let o=Math.max(0,Number(t(s))||0);return a+=o,o});if(a<=0)return e[Math.floor(n()*e.length)];let i=n()*a;for(let s=0;s<e.length;s++)if(i-=r[s],i<=0)return e[s];return e[e.length-1]}function $a(e){return e?.id||null}function Ri(e={}){let t=e.rng||Pe(ft()),n={sampleScene:e.sampler?.sampleScene||jn,mutateScene:e.sampler?.mutateScene||Wn},a=Ti(e.mode)?e.mode:"hybrid",r=(e.scenes||[]).map(u=>D(u)),i=Math.max(0,Number(e.noRepeatWindow??10)),s={curated:Math.max(0,Number(e.weights?.curated??.3)),generated:Math.max(0,Number(e.weights?.generated??.7))},o=[],l=null;function c(u){let b=$a(u);for(o.push(b);o.length>i;)o.shift()}function d(){let u=new Set(o),b=r.filter(y=>!u.has($a(y)));return b.length?b:r}function f(){let u=d();return Fi(u,b=>b.favorite?2.5:1,t)}function m(){let u=d(),b=u.length&&t()<.45?Fi(u,y=>y.favorite?2.5:1,t):l;return b&&t()<.65?n.mutateScene(b,{seed:ft()+Math.floor(t()*1e5)>>>0,allowVariantChange:!0}):n.sampleScene({seed:ft()+Math.floor(t()*1e5)>>>0})}function h(){let u=null;if(a==="curated"?u=f():a==="generative"?u=m():u=r.length>0&&t()<s.curated/Math.max(1e-4,s.curated+s.generated)?f():m(),!u){if(a==="curated")return null;u=n.sampleScene({seed:ft()+Math.floor(t()*1e5)>>>0})}return u=D(u),c(u),l=u,u}return{get mode(){return a},setMode(u){return Ti(u)&&(a=u),a},get scenes(){return r.slice()},setScenes(u){r=(u||[]).map(b=>D(b))},addScene(u){r.push(D(u))},get noRepeatWindow(){return i},setNoRepeatWindow(u){for(i=Math.max(0,Number(u)||0);o.length>i;)o.shift()},get weights(){return{...s}},setWeights(u){s={curated:Math.max(0,Number(u?.curated??s.curated)),generated:Math.max(0,Number(u?.generated??s.generated))}},get history(){return o.slice()},get last(){return l},next:h,nextDelay(u=null){return u?es({bpm:u.bpm,beatPhase:u.beatPhase,beatsPerBar:4,phraseBars:1}):null},getState(){return{mode:a,scenes:r.length,noRepeatWindow:i,weights:{...s},history:o.slice(),lastId:$a(l)}}}}function Ci({playlist:e,onScene:t,intervalMs:n=1e4,getAudio:a=()=>null,setTimeoutFn:r=typeof setTimeout=="function"?setTimeout:null,clearTimeoutFn:i=typeof clearTimeout=="function"?clearTimeout:null}={}){if(!e||typeof t!="function")throw new Error("createSceneScheduler requiere playlist y onScene");let s=0,o=!1,l=Math.max(0,Number(n)||0);function c(f){!o||!r||(s=r(()=>{if(!o)return;let m=e.next();m&&t(m),d()},Math.max(0,f)))}function d(){if(!o)return;let f=a(),m=f?e.nextDelay(f):null,h=m!=null?m*1e3:l;c(h)}return{start(){o||(o=!0,d())},stop(){o=!1,s&&i&&i(s),s=0},setIntervalMs(f){l=Math.max(0,Number(f)||0),o&&(s&&i&&i(s),d())},get intervalMs(){return l},get running(){return o},tickNow(){let f=e.next();return f&&t(f),f}}}var ts={curated:"Curado",generative:"Generativo",hybrid:"H\xEDbrido"};function j(e,t,n){let a=document.createElement(e);return t&&(a.className=t),n!=null&&(a.textContent=n),a}function ki(e,t={}){if(!e)return{refresh(){},destroy(){},setMode(){},get elements(){return{}}};let n=t.isFamilyAvailable||(()=>!0),a=()=>{let T=on({includeClassics:!0}).find(F=>n(F));return T?T.id:"fluidFields"};e.classList.add("uv-scene-controls"),e.replaceChildren();let r=j("div","uv-scene-head");r.append(re("grid",14)),r.append(j("span",null,"Escena"));let i=j("span","uv-badge uv-badge-classic","Cl\xE1sico");i.hidden=!0,r.append(i),e.append(r);let s=j("label","uv-scene-row");s.append(j("span",null,"Modo"));let o=j("select","uv-select");o.id="uv-playback-mode";for(let T of dn){let F=j("option",null,ts[T]||T);F.value=T,o.append(F)}s.append(o),e.append(s);let l=j("label","uv-scene-row");l.append(j("span",null,"Familia"));let c=j("select","uv-select");c.id="uv-family-select";for(let T of on({includeClassics:!0})){let F=n(T),B=j("option",null,F?T.label:`${T.label} (requiere WebGL 2)`);B.value=T.id,B.disabled=!F,c.append(B)}l.append(c),e.append(l);let d=j("label","uv-scene-row");d.append(j("span",null,"Variante"));let f=j("select","uv-select");f.id="uv-variant-select",d.append(f),e.append(d);let m=j("label","uv-scene-row");m.append(j("span",null,"Transici\xF3n"));let h=j("select","uv-select");h.id="uv-transition-type";let u=j("option",null,"Auto");u.value="auto",h.append(u);for(let T of _r){let F=j("option",null,Ir[T]||T);F.value=T,h.append(F)}m.append(h),e.append(m);let b=j("div","uv-scene-actions"),y=j("button","uv-btn","Generar");y.type="button",y.id="uv-generate";let p=j("button","uv-btn","Mutar");p.type="button",p.id="uv-mutate";let v=j("button","uv-btn uv-btn-quiet","Guardar escena");v.type="button",v.id="uv-save-scene",b.append(y,p,v),e.append(b);let g=j("p","uv-scene-status","");g.id="uv-scene-status",e.append(g);let E=j("div","uv-scene-history-head");E.append(j("span",null,"Historial"));let S=j("span","uv-scene-history-count","0");E.append(S),e.append(E);let w=j("div","uv-scene-history");w.id="uv-scene-history",e.append(w);let M={},A=-1;function L(T){let F=xe[T];return F?Object.entries(F.variants).map(([B,V])=>({id:B,...V})):[]}function _(T,F){f.replaceChildren();for(let V of L(T)){let K=j("option",null,V.implemented===!1?`${V.label} (pr\xF3x.)`:V.label);K.value=V.id,V.implemented===!1&&(K.disabled=!0),f.append(K)}let B=xe[T]?.defaultVariant;f.value=L(T).some(V=>V.id===F)?F:B}function O(){let T=c.value,F=f.value,B=St(T,F);return{familyId:T,variantId:F,effect:B?.effect||""}}function U(T){let F=Array.isArray(T)?T:[];if(F.length===A&&F.length>0,A=F.length,S.textContent=String(F.length),w.replaceChildren(),!F.length){w.append(j("p","uv-scene-empty","Todav\xEDa no hay escenas en el historial."));return}for(let B of F.slice(0,12)){let V=j("div","uv-scene-history-row"),K=j("button","uv-scene-history-open");K.type="button",K.dataset.sceneId=B.id;let de=B.scene||{};K.append(j("b",null,de.name||`${de.effect||"escena"} \xB7 ${de.variant||"\u2014"}`));let Me=de.origin==="generated"?"generada":de.origin==="mutated"?"mutada":"guardada";K.append(j("span",null,`${Me} \xB7 ${new Date(B.at||Date.now()).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}`)),K.addEventListener("click",()=>t.onHistorySelect?.(B.id));let Y=j("button","uv-btn uv-btn-icon","");Y.type="button",Y.title="Promover a preset",Y.setAttribute("aria-label","Promover a preset"),Y.append(re("bookmark",14)),Y.addEventListener("click",()=>t.onHistorySave?.(B.id)),V.append(K,Y),w.append(V)}}function $(T={}){M=T||{};let F=M.scene||null;M.mode&&dn.includes(M.mode)&&(o.value=M.mode),h.value=M.transitionType||"auto";let B=M.familyId||(F?mt(F):null)||c.value||"fluidFields";(!xe[B]||!n(xe[B]))&&(B=a()),xe[B]&&(c.value=B),_(B,M.variantId||F?.variant||xe[B]?.defaultVariant);let V=B==="classics";i.hidden=!V,g.textContent=F?`${F.effect} \xB7 ${F.variant} \xB7 seed ${F.seed}`:"Sin escena activa",M.history&&U(M.history)}return o.addEventListener("change",()=>t.onModeChange?.(o.value)),c.addEventListener("change",()=>{_(c.value,xe[c.value]?.defaultVariant),i.hidden=c.value!=="classics",t.onSelect?.(O())}),f.addEventListener("change",()=>t.onSelect?.(O())),h.addEventListener("change",()=>t.onTransitionChange?.(h.value)),y.addEventListener("click",()=>t.onGenerate?.()),p.addEventListener("click",()=>t.onMutate?.()),v.addEventListener("click",()=>t.onSave?.()),$(t.getState?.()||{}),{refresh:$,setMode(T){dn.includes(T)&&(o.value=T)},renderHistory:U,getSelection:O,get elements(){return{root:e,modeSelect:o,familySelect:c,variantSelect:f,transitionSelect:h,generateBtn:y,mutateBtn:p,saveBtn:v,status:g,historyList:w,classicBadge:i}},destroy(){e.replaceChildren(),e.classList.remove("uv-scene-controls")}}}var ns="umbral-vision:scene-history";function as(e){try{if(typeof localStorage>"u")return[];let t=localStorage.getItem(e);if(!t)return[];let n=JSON.parse(t);return Array.isArray(n)?n:[]}catch{return[]}}function rs(e,t){try{return typeof localStorage>"u"?!1:(localStorage.setItem(e,JSON.stringify(t)),!0)}catch{return!1}}function Pi(e={}){let t=Math.max(1,Number(e.limit??30)),n=e.storageKey||ns,a=e.persist!==!1,r=e.thumbnailStore||null,i=[];a&&(i=as(n).map(v=>{try{let g=ht(v.scene||v);return{id:v.id||g.id,scene:g,at:v.at||Date.now(),hasThumbnail:!!v.hasThumbnail}}catch{return null}}).filter(Boolean).slice(0,t));function s(){a&&rs(n,i.map(p=>({id:p.id,scene:p.scene,at:p.at,hasThumbnail:!!p.hasThumbnail})))}function o(){i.length>t&&(i=i.slice(0,t))}function l({withThumbnails:p=!1}={}){return i.map(v=>({id:v.id,scene:D(v.scene),at:v.at,hasThumbnail:!!v.hasThumbnail,thumbnail:p?v.thumbnail||null:void 0}))}function c(p){let v=i.find(g=>g.id===p);return v?{...v,scene:D(v.scene)}:null}function d(p,{thumbnail:v=null,at:g=Date.now()}={}){let E=D(p),S={id:E.id||pt("hist"),scene:E,at:g,hasThumbnail:!!v,thumbnail:v};return i.unshift(S),o(),s(),v&&r&&Promise.resolve(r.put(S.id,v,{sceneId:S.id})).catch(()=>{}),{...S,scene:D(S.scene)}}let f=d;async function m(p){let v=i.find(g=>g.id===p);if(v?.thumbnail)return v.thumbnail;if(!r)return null;try{return await r.get(p)}catch{return null}}function h(p){let v=i.findIndex(g=>g.id===p);return v<0?!1:(i.splice(v,1),s(),r&&Promise.resolve(r.delete(p)).catch(()=>{}),!0)}function u(){i=[],s(),r&&Promise.resolve(r.clear()).catch(()=>{})}function b(p,v){let g=i.find(S=>S.id===p);if(!g)return null;let E=String(v||"").trim();return D({...g.scene,name:E||g.scene.name,updatedAt:new Date().toISOString()})}function y(){return{limit:t,entries:i.length,withThumbnail:i.filter(p=>p.hasThumbnail).length}}return{push:d,capture:f,list:l,get:c,getThumbnail:m,remove:h,clear:u,promote:b,stats:y,get limit(){return t}}}var is="umbral-vision";var _e="thumbnails";function Li(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error||new Error("IndexedDB request failed"))})}function fn(e){return new Promise((t,n)=>{e.oncomplete=()=>t(),e.onerror=()=>n(e.error||new Error("IndexedDB transaction failed")),e.onabort=()=>n(e.error||new Error("IndexedDB transaction aborted"))})}function os(e){return e==null?0:typeof e=="string"?e.length*2:e.size!=null?Number(e.size)||0:e.byteLength!=null&&Number(e.byteLength)||0}function _i(e={}){let t=e.indexedDB!==void 0?e.indexedDB:globalThis.indexedDB||null,n=Math.max(0,Number(e.maxBytes??20*1024*1024)),a=Math.max(1,Number(e.maxEntries??120)),r=new Map,i=null,s=!1,o=!!t;async function l(){if(s)return i;if(s=!0,!t)return null;try{return i=await new Promise((p,v)=>{let g=t.open(is,1);g.onupgradeneeded=()=>{let E=g.result;E.objectStoreNames.contains(_e)||E.createObjectStore(_e,{keyPath:"key"}).createIndex("at","at")},g.onsuccess=()=>p(g.result),g.onerror=()=>v(g.error||new Error("IndexedDB open failed"))}),i}catch{return o=!1,i=null,null}}async function c(){if(!o)return[...r.values()];let p=await l();if(!p)return[...r.values()];try{let v=p.transaction(_e,"readonly"),g=v.objectStore(_e),E=await Li(g.getAll());return await fn(v),Array.isArray(E)?E:[]}catch{return o=!1,[...r.values()]}}async function d(){let p=await c();p.sort((E,S)=>Number(S.at||0)-Number(E.at||0));let v=p.reduce((E,S)=>E+Number(S.size||0),0),g=[];for(let E of p)g.length>=a||v>n&&g.length>0?(v-=Number(E.size||0),await h(E.key)):v>n&&g.length===0?await h(E.key):g.push(E);return g.length}async function f(p,v,g={}){if(!p)return!1;let E=os(v);if(E>n)return!1;let S={key:String(p),data:v,size:E,at:Date.now(),sceneId:g.sceneId||null};if(!o)return r.set(S.key,S),u(),!0;try{let w=await l();if(!w)return r.set(S.key,S),u(),!0;let M=w.transaction(_e,"readwrite");return M.objectStore(_e).put(S),await fn(M),await d(),!0}catch{return o=!1,r.set(S.key,S),u(),!0}}async function m(p){if(!p)return null;if(!o)return r.get(String(p))?.data??null;try{let v=await l();if(!v)return r.get(String(p))?.data??null;let g=v.transaction(_e,"readonly"),E=await Li(g.objectStore(_e).get(String(p)));return await fn(g),E?.data??null}catch{return o=!1,r.get(String(p))?.data??null}}async function h(p){if(!p)return!1;if(r.delete(String(p)),!o)return!0;try{let v=await l();if(!v)return!0;let g=v.transaction(_e,"readwrite");return g.objectStore(_e).delete(String(p)),await fn(g),!0}catch{return!0}}function u(){let p=[...r.values()].sort((g,E)=>g.at-E.at),v=p.reduce((g,E)=>g+E.size,0);for(;p.length>a||v>n&&p.length>0;){let g=p.shift();v-=g.size,r.delete(g.key)}}async function b(){if(r.clear(),!!o)try{let p=await l();if(!p)return;let v=p.transaction(_e,"readwrite");v.objectStore(_e).clear(),await fn(v)}catch{}}async function y(){let p=await c();return{available:o,entries:p.length,bytes:p.reduce((v,g)=>v+Number(g.size||0),0),maxBytes:n,maxEntries:a}}return{put:f,get:m,delete:h,clear:b,prune:d,stats:y,open:l,get available(){return o}}}function ss(){let e=Array.from(document.querySelectorAll("#generator canvas, main canvas, body > canvas")),t=e.find(n=>n.style.display!=="none"&&!n.hidden)||e[0];return!t||typeof t.toBlob!="function"?null:new Promise(n=>{t.toBlob(a=>n(a),"image/png")})}function Ii(){return ss().then(e=>{if(!e)return!1;let t=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),n=URL.createObjectURL(e),a=document.createElement("a");return a.href=n,a.download=`umbral-vision-${t}.png`,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3),!0})}function ls({effect:e,interval:t,audio:n,params:a,scene:r}={}){let i=new URLSearchParams;if(e&&i.set("effect",String(e)),t!=null&&i.set("interval",String(t)),i.set("audio",n?"1":"0"),r){let o=D(r);i.set("s",Vr(o)),i.set("effect",o.effect)}else a&&typeof a=="object"&&Object.keys(a).length>0&&i.set("p",JSON.stringify(a));let s=new URL(window.location.href);return s.search=i.toString(),s.hash="",s.toString()}async function Bi(e){let t=ls(e);try{if(navigator.clipboard&&navigator.clipboard.writeText)return await navigator.clipboard.writeText(t),{ok:!0,url:t,method:"clipboard"}}catch{}return{ok:!1,url:t,method:"fallback"}}function Ni(e){let t=new URLSearchParams(e),n=null;if(t.has("p"))try{let i=JSON.parse(t.get("p"));i&&typeof i=="object"&&!Array.isArray(i)&&(n=i)}catch{}let a=null;return t.has("s")&&(a=Gr(t.get("s"))),{effect:a?.effect||t.get("effect")||null,interval:t.has("interval")&&Number(t.get("interval"))||null,audio:t.get("audio")==="1",params:a?{...a.params,seed:a.seed}:n,scene:a}}var bt=null,qa=null;function cs(){return bt||(bt=document.createElement("div"),bt.id="toast",bt.setAttribute("role","status"),bt.setAttribute("aria-live","polite"),document.body.appendChild(bt),bt)}function Q(e,t=2e3){let n=cs();n.textContent=e,n.classList.add("show"),qa&&clearTimeout(qa),qa=setTimeout(()=>{n.classList.remove("show")},t)}function Di(){window.addEventListener("uv:toast",e=>{Q(e.detail?.text||"",e.detail?.duration??2e3)})}var us=new Set(["INPUT","TEXTAREA","SELECT"]);function Oi(e){let t={" ":()=>e.toggleAuto?.(),f:()=>e.toggleFullscreen?.(),F:()=>e.toggleFullscreen?.(),h:()=>e.togglePanel?.(),H:()=>e.togglePanel?.(),m:()=>e.toggleMic?.(),M:()=>e.toggleMic?.(),p:()=>e.togglePause?.(),P:()=>e.togglePause?.(),"?":()=>e.toggleOnboarding?.(),ArrowLeft:()=>e.prevEffect?.(),ArrowRight:()=>e.nextEffect?.()};for(let a=1;a<=9;a++)t[String(a)]=()=>e.selectByIndex?.(a-1);t[0]=()=>e.selectByIndex?.(9),t["-"]=()=>e.selectByIndex?.(10),t["="]=()=>e.selectByIndex?.(11);let n=a=>{if(a.ctrlKey||a.metaKey||a.altKey)return;let r=a.target;if(r&&us.has(r.tagName)||r&&r.isContentEditable)return;let i=t[a.key];i&&(a.preventDefault(),i())};return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)}var zi="umbral-vision:onboarded";var ms=[{keys:["1","\u2013","9"],text:"Cambiar efecto (atajo num\xE9rico)"},{keys:["\u2190","\u2192"],text:"Efecto anterior / siguiente"},{keys:["Espacio"],text:"Auto-transici\xF3n on/off"},{keys:["F"],text:"Pantalla completa"},{keys:["H"],text:"Ocultar / mostrar interfaz"},{keys:["M"],text:"Activar / desactivar micr\xF3fono"}];function Ui({onFirstFrame:e}){let t=document.getElementById("onboarding");t||(t=fs(),document.body.appendChild(t));let n=null,a=ds(),r=()=>{a||(t.hidden=!1,n=setTimeout(i,6e3))},i=()=>{if(n&&clearTimeout(n),n=null,t.hidden=!0,!a){a=!0;try{localStorage.setItem(zi,"1")}catch{}}};return t.addEventListener("click",s=>{s.target===t&&i()}),t.querySelector(".onboarding-dismiss")?.addEventListener("click",i),document.addEventListener("keydown",s=>{t.hidden||(s.key==="Escape"||s.key==="Enter")&&i()}),a||e(()=>setTimeout(r,800)),{show:()=>{a=!1,r()},dismiss:i}}function ds(){try{return localStorage.getItem(zi)==="1"}catch{return!1}}function fs(){let e=document.createElement("div");e.id="onboarding",e.hidden=!0;let t=document.createElement("div");t.className="onboarding-card";let n=document.createElement("h2");n.textContent="Umbral Vision",t.appendChild(n);let a=document.createElement("p");a.style.cssText="margin: 0; font-size: 0.9rem; opacity: 0.75;",a.textContent="Atajos principales:",t.appendChild(a);let r=document.createElement("ul");r.className="onboarding-tips";for(let s of ms){let o=document.createElement("li");for(let c of s.keys){let d=document.createElement("kbd");d.textContent=c,o.appendChild(d)}let l=document.createElement("span");l.textContent=" "+s.text,o.appendChild(l),r.appendChild(o)}t.appendChild(r);let i=document.createElement("button");return i.className="uv-btn uv-btn-primary onboarding-dismiss",i.textContent="Entendido",t.appendChild(i),e.appendChild(t),e}var Vi=["fluidFields","organicStructures","mathematicalForms","temporalVeil","tunnel","spiral","mandala","particles","waves","fractal","matrix","glitch","melt","fractalGlitch","waveGlitch","sacredGeometry","biomech","dune","yinYang"],ps={fluidFields:"Fluid",organicStructures:"Organic",mathematicalForms:"Fractal",temporalVeil:"Temporal",tunnel:"T\xFAnel",spiral:"Espiral",mandala:"M\xE1ndala",particles:"Part\xEDculas",waves:"Olas",fractal:"\xC1rbol",matrix:"Matrix",glitch:"Glitch",melt:"Melt",fractalGlitch:"\xC1rbol Glitch",waveGlitch:"Olas Glitch",sacredGeometry:"Geometr\xEDa",biomech:"Biomech",dune:"Duna",yinYang:"Yin Yang"},pn={fluidFields:["Fluid Fields","Tejido de part\xEDculas sobre una membrana viva.","Fluid Fields"],organicStructures:["Organic Structures","Membranas topol\xF3gicas transl\xFAcidas.","Organic Structures"],mathematicalForms:["Mathematical Forms","Fractal volum\xE9trico raymarched.","Mathematical Forms"],temporalVeil:["Temporal Veil","Estelas que evolucionan desde su memoria.","Temporal Systems"],tunnel:["T\xFAnel","Elipses conc\xE9ntricas en c\xE1mara infinita.","Cl\xE1sico p5"],spiral:["Espiral","Crom\xE1tica en rotaci\xF3n continua.","Cl\xE1sico p5"],mandala:["M\xE1ndala","Simetr\xEDa radial en capas.","Cl\xE1sico p5"],particles:["Part\xEDculas","Campo de part\xEDculas reactivas.","Cl\xE1sico p5"],waves:["Olas","Ondas de frecuencia sobre el plano.","Cl\xE1sico p5"],fractal:["\xC1rbol fractal","Recursi\xF3n ramificada.","Cl\xE1sico p5"],matrix:["Matrix","Lluvia de caracteres.","Cl\xE1sico p5"],glitch:["Glitch","Ruido, bandas y desplazamiento digital.","Cl\xE1sico p5"],melt:["Melt","Deriva y goteo vertical.","Cl\xE1sico p5"],fractalGlitch:["\xC1rbol Glitch","Fractal con interferencias.","Cl\xE1sico p5"],waveGlitch:["Olas Glitch","Ondas atravesadas por ruido.","Cl\xE1sico p5"],sacredGeometry:["Geometr\xEDa Sagrada","Flor de la vida y patrones.","Cl\xE1sico p5"],biomech:["Biomech","Estructuras org\xE1nicas y mec\xE1nicas.","Cl\xE1sico p5"],dune:["Duna","Dunas suaves en capas.","Cl\xE1sico p5"],yinYang:["Yin Yang","Dualidad en equilibrio.","Cl\xE1sico p5"]},Gi="umbral-vision:transition-interval",Hi="umbral-vision:playback-mode",$i="umbral-vision:transition-type";function hs(){let e={};for(let[t,n]of Object.entries(Ht)){let a=()=>({draw:()=>{}});a.preview=n.preview,a.isEngine=!0,a.label=n.label,e[t]=a}return{...et,...e}}function qi(e){return String(e).padStart(2,"0")}function gs(e){try{return new Date(e).toLocaleDateString("es-AR",{day:"2-digit",month:"short"})}catch{return""}}function vs(){let e=document.getElementById("panel"),t=document.getElementById("uv-dock");if(!e||!t)return null;Di();let n=hs(),a=Vi.filter(x=>n[x]).concat(Object.keys(n).filter(x=>!Vi.includes(x))),r=document.getElementById("thumbnails"),i=Ni(window.location.search),s=n[i.effect]?i.effect:"fluidFields",o="auto";try{o=localStorage.getItem($i)||"auto"}catch{}let l={current:s,interval:i.interval||Number(localStorage.getItem(Gi))||10,transitionType:o,auto:!1,paused:!1};Un(s,document.querySelector("#generator main"));let c=!X(s)||!!ni();c||(l.current="tunnel",Un("tunnel",document.querySelector("#generator main")),Q("WebGL 2 no disponible: usando efectos p5")),i.params&&X(s)&&c&&vt(i.params);let d=(x,P,z)=>{let q=document.getElementById(x);return q?(q.appendChild(re(P,18)),q.setAttribute("aria-label",z),q):null};d("fullscreenBtn","expand","Pantalla completa"),d("uv-panel-btn","grid","Mostrar u ocultar panel"),d("uv-prev","prev","Efecto anterior"),d("uv-next","next","Efecto siguiente"),d("uv-play","pause","Pausar"),d("uv-strip-prev","chevron","Desplazar efectos"),d("uv-strip-next","chevron","Desplazar efectos"),document.getElementById("uv-strip-prev")?.classList.add("uv-flip"),d("lite-mode-btn","moon","Modo lite"),d("uv-save-preset","bookmark","Guardar preset"),d("capture-btn","camera","Descargar PNG"),d("share-btn","share","Compartir URL");let f=document.getElementById("uv-explore-btn");f&&!f.querySelector("svg")&&f.appendChild(re("chevron",14));let m=e.querySelector(".panel-toggle");m&&m.appendChild(re("chevron",14));let h=document.getElementById("micBtn");h&&!h.querySelector("svg")&&h.prepend(re("mic",16));let u=document.getElementById("uv-play"),b=[e,t,document.querySelector(".uv-transport"),document.querySelector(".uv-topbar")].filter(Boolean),y=null,p=!1,v=!1,g=new URLSearchParams(window.location.search).has("uihold");function E(){let x=document.activeElement;return x?/^(INPUT|TEXTAREA|SELECT)$/.test(x.tagName)||x.isContentEditable:!1}function S(){return b.some(x=>x.matches(":hover"))}function w(){y&&clearTimeout(y),!(p||E()||g)&&(y=setTimeout(()=>{if(S()||E()){w();return}M(!0,!0)},4200))}function M(x,P=!1){p=!!x,document.body.classList.toggle("uv-immersive",p);for(let q of b)if(q!==e){try{q.inert=p}catch{}q.setAttribute("aria-hidden",String(p))}Ct();let z=document.getElementById("uv-panel-btn");z&&z.setAttribute("aria-expanded",String(!p)),p?(y&&clearTimeout(y),ie&&(ie.hidden=!0),P&&!v&&(v=!0,Q("Interfaz oculta \xB7 mov\xE9 el mouse o toc\xE1 para volver",2600))):w()}function A(){p?M(!1):w()}for(let x of b)x.addEventListener("pointerenter",()=>{y&&clearTimeout(y)}),x.addEventListener("pointerleave",()=>w());for(let x of["pointermove","pointerdown","wheel","touchstart"])window.addEventListener(x,A,{passive:!0});window.addEventListener("keydown",x=>{x.key==="h"||x.key==="H"||A()},{passive:!0}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&w()});let L=document.getElementById("effect-params-host"),_=document.getElementById("uv-params-fallback"),O=mi(L,{emptyText:"Este efecto no expone par\xE1metros en vivo."}),U=di(document.getElementById("audio-controls")),$=_i(),T=Pi({limit:30,thumbnailStore:$}),F="hybrid";try{F=localStorage.getItem(Hi)||"hybrid"}catch{}let B=Ri({mode:F,scenes:mn(),noRepeatWindow:10,weights:{curated:.3,generated:.7}}),V=Ci({playlist:B,intervalMs:l.interval*1e3,getAudio:()=>Ce(),onScene:x=>{x&&he(x,{record:!0,silent:!0})}}),K=document.createElement("section");K.id="uv-scene-controls-host",K.className="uv-scene-controls-host",L?.parentNode?L.parentNode.insertBefore(K,L):e.querySelector(".panel-body")?.appendChild(K);let de=ki(K,{isFamilyAvailable:x=>x.renderer!=="webgl"||c,getState:()=>({scene:Y(),mode:B.mode,history:T.list(),transitionType:l.transitionType,familyId:Me(Y()),variantId:Y()?.variant}),onTransitionChange:x=>{l.transitionType=x;try{localStorage.setItem($i,x)}catch{}Q(x==="auto"?"Transiciones autom\xE1ticas":`Transici\xF3n: ${x}`)},onSelect:({familyId:x,variantId:P})=>{let z=St(x,P);if(!z)return;if(z.family.renderer==="webgl"&&!c){Q("WebGL 2 no disponible en este navegador");return}let q=Y();he(D({...q||{},effect:z.effect,variant:P}),{transitionMs:"auto"})},onModeChange:x=>{B.setMode(x);try{localStorage.setItem(Hi,x)}catch{}l.auto&&we(),te()},onGenerate:()=>{let x=de.getSelection(),P=jn({familyId:x.familyId,variantId:x.variantId});he(P,{record:!0}),Q("Escena generada")},onMutate:()=>{let x=Y();if(!x)return;let P=Wn(x,{allowVariantChange:!0});he(P,{record:!0}),Q("Escena mutada")},onSave:()=>{let x=Y();if(!x)return;let P=x.name||`${pn[x.effect]?.[0]||x.effect} ${new Date().toLocaleDateString("es-AR")}`,z=(prompt("Nombre de la escena:",P)||"").trim();z&&($n(z,x),T.push({...x,name:z}),ve(),_t(),te(),Q(`Escena \u201C${z}\u201D guardada`))},onHistorySelect:x=>{let P=T.get(x);P&&he(P.scene,{silent:!0})},onHistorySave:x=>{let P=T.get(x);if(!P)return;let z=P.scene.name||`${pn[P.scene.effect]?.[0]||P.scene.effect} ${new Date().toLocaleDateString("es-AR")}`,q=(prompt("Nombre del preset:",z)||"").trim();if(!q)return;let ae=T.promote(x,q);ae&&($n(q,ae),ve(),_t(),Q(`Preset \u201C${q}\u201D guardado`))}});function Me(x){return mt(x)}function Y(){try{return Na()}catch{return null}}function te(){let x=Y();de.refresh({scene:x,mode:B.mode,history:T.list(),transitionType:l.transitionType,familyId:Me(x),variantId:x?.variant})}function ve(){B.setScenes(mn()),te()}function he(x,P={}){if(!x)return null;if(!c&&X(x.effect))return Q("WebGL 2 no disponible en este navegador"),null;let z={};P.transitionMs!=null&&(z.transitionMs=P.transitionMs);let q=P.transitionType||(l.transitionType!=="auto"?l.transitionType:null);q&&(z.transitionType=q);let ae=Qr(x,z);return ae?(l.current=ae.effect,H&&H.highlight(ae.effect),P.record&&T.push(ae),N(),te(),ae):null}let Ye=[...e.querySelectorAll("[data-uv-tab]")],Xe=[...e.querySelectorAll("[data-uv-panel]")];function Se(x){for(let P of Ye){let z=P.dataset.uvTab===x;P.setAttribute("aria-selected",String(z)),P.tabIndex=z?0:-1}for(let P of Xe)P.hidden=P.dataset.uvPanel!==x;x==="presets"&&_t()}Ye.forEach(x=>x.addEventListener("click",()=>Se(x.dataset.uvTab)));function Ct(){let x=p||e.classList.contains("is-hidden");try{e.inert=x}catch{}e.setAttribute("aria-hidden",String(x)),document.body.classList.toggle("uv-panel-open",!x)}function $e(x){e.classList.toggle("is-hidden",!x);let P=document.getElementById("uv-panel-btn");P&&P.setAttribute("aria-expanded",String(x)),Ct()}document.getElementById("uv-panel-btn")?.addEventListener("click",()=>{$e(e.classList.contains("is-hidden"))}),m?.addEventListener("click",()=>$e(!1));let ie=document.getElementById("uv-explore-menu"),I=()=>{if(!ie)return;let x=ie.hidden;ie.hidden=!x,f?.setAttribute("aria-expanded",String(x))};f?.addEventListener("click",x=>{x.stopPropagation(),I()}),document.addEventListener("click",()=>{ie&&!ie.hidden&&(ie.hidden=!0,f?.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",x=>{x.key==="Escape"&&ie&&!ie.hidden&&(ie.hidden=!0,f?.setAttribute("aria-expanded","false"))}),ie?.querySelectorAll("[data-uv-tab-target]").forEach(x=>{x.addEventListener("click",()=>{$e(!0),Se(x.dataset.uvTabTarget),ie.hidden=!0})});let H=r?li(r,n,x=>C(x),{labels:ps,order:a,classicNames:Cr()}):null,fe=document.getElementById("uv-effect-count");fe&&(fe.textContent=String(a.length)),H&&H.highlight(l.current),document.getElementById("uv-strip-prev")?.addEventListener("click",()=>{r?.scrollBy({left:-260,behavior:"smooth"})}),document.getElementById("uv-strip-next")?.addEventListener("click",()=>{r?.scrollBy({left:260,behavior:"smooth"})});function C(x){if(n[x]){if(!c&&X(x)){Q("WebGL 2 no disponible en este navegador");return}Vn(x,l.transitionType!=="auto"?{transitionType:l.transitionType}:void 0),l.current=x,H&&H.highlight(x),N(),te(),l.auto&&we()}}function k(x){let P=a.indexOf(l.current),z=a[(P+x+a.length)%a.length];C(z)}function N(){let x=pn[l.current]||[l.current,"","\u2014"],P=a.indexOf(l.current);ye("uv-effect-index",`${qi(P+1)} / ${qi(a.length)}`),ye("uv-effect-title",x[0]),ye("uv-effect-desc",x[1]),ye("uv-info-family",x[2]),ye("uv-info-renderer",X(l.current)?"WebGL 2":"p5 \xB7 Canvas 2D"),O&&O.refresh(l.current),_&&(_.hidden=X(l.current)),Yn()}document.getElementById("uv-prev")?.addEventListener("click",()=>k(-1)),document.getElementById("uv-next")?.addEventListener("click",()=>k(1));function le(){u&&(u.replaceChildren(re(l.paused?"play":"pause",18)),u.setAttribute("aria-label",l.paused?"Reanudar":"Pausar"),u.classList.toggle("is-paused",l.paused),document.getElementById("uv-live")?.classList.toggle("is-paused",l.paused))}u?.addEventListener("click",()=>{l.paused=Zr(!l.paused),le()});let ce=document.getElementById("autoTransition"),Z=document.getElementById("transitionInterval"),ne=document.getElementById("transitionIntervalValue");Z&&(Z.value=String(l.interval),ne&&(ne.textContent=`${l.interval}s`),Z.addEventListener("input",()=>{l.interval=Number(Z.value),ne&&(ne.textContent=`${l.interval}s`);try{localStorage.setItem(Gi,String(l.interval))}catch{}V.setIntervalMs(l.interval*1e3),l.auto&&we()}));function we(){if(V.setIntervalMs(l.interval*1e3),V.stop(),B.mode==="curated"&&B.getState().scenes===0){ii(l.interval*1e3,a,C);return}V.start()}function kt(x){l.auto=x,ce&&(ce.checked=x),x?we():(V.stop(),Da())}ce?.addEventListener("change",()=>kt(ce.checked)),fi(document.getElementById("audio-spectrum")).start();let Qe={on:!1};function be(){if(!h)return;h.classList.toggle("is-on",Qe.on),h.setAttribute("aria-pressed",String(Qe.on)),h.closest(".uv-audio")?.classList.toggle("is-on",Qe.on);let x=h.querySelector("[data-uv-mic-label]");x&&(x.textContent=Qe.on?"Mic ON":"Audio")}h?.addEventListener("click",async()=>{if(Qe.on)await Za(),Qe.on=!1,be();else try{await Qa(),Qe.on=!0,be(),Q("Micr\xF3fono activo")}catch{h.classList.add("is-error"),setTimeout(()=>h.classList.remove("is-error"),1200),Q("No se pudo acceder al micr\xF3fono")}}),be();function jt(){let x=document.getElementById("lite-mode-btn");if(!x)return;let P=Ue();x.classList.toggle("is-on",P),x.setAttribute("aria-pressed",String(P))}document.getElementById("lite-mode-btn")?.addEventListener("click",()=>{Fr(!Ue()),jt(),Q(`Modo lite ${Ue()?"activo":"desactivado"}`),setTimeout(Yn,700)}),jt();let Ae=document.getElementById("preset-name"),Te=document.getElementById("preset-list");function Wt(){let x=Y();return{effect:l.current,interval:l.interval,audioEnabled:ee().enabled,params:X(l.current)?qt():null,scene:x}}function ji(){let x=`${pn[l.current]?.[0]||l.current} ${new Date().toLocaleDateString("es-AR")}`,P=(Ae?.value||"").trim()||x,z=za(P,Wt());if(!z){Q("No se pudo guardar el preset");return}Ae&&(Ae.value=""),ve(),_t(),Q(`Preset \u201C${z.name}\u201D guardado`)}document.getElementById("preset-save")?.addEventListener("click",ji),document.getElementById("uv-save-preset")?.addEventListener("click",()=>{$e(!0),Se("presets"),Ae?.focus()});let Kn=document.createElement("div");Kn.className="uv-preset-pack";let Pt=document.createElement("button");Pt.type="button",Pt.className="uv-btn uv-btn-quiet",Pt.id="uv-pack-export",Pt.textContent="Exportar pack";let Lt=document.createElement("button");Lt.type="button",Lt.className="uv-btn uv-btn-quiet",Lt.id="uv-pack-import",Lt.textContent="Importar pack";let qe=document.createElement("input");qe.type="file",qe.accept="application/json",qe.hidden=!0,qe.id="uv-pack-file",Kn.append(Pt,Lt,qe),Te?.parentNode&&Te.parentNode.insertBefore(Kn,Te),Pt.addEventListener("click",()=>{let x=mn();if(x.length===0){Q("Todav\xEDa no hay escenas para exportar");return}let P=yi(x,{name:"Umbral Vision"}),z=new Blob([xi(P)],{type:"application/json"}),q=URL.createObjectURL(z),ae=document.createElement("a"),hn=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);ae.href=q,ae.download=`umbral-vision-pack-${hn}.json`,document.body.appendChild(ae),ae.click(),ae.remove(),setTimeout(()=>URL.revokeObjectURL(q),1e3),Q(`Pack exportado (${x.length} escenas)`)}),Lt.addEventListener("click",()=>qe.click()),qe.addEventListener("change",async()=>{let x=qe.files&&qe.files[0];if(x)try{let P=await x.text(),z=Ei(P,mn().map(q=>q.id));z.scenes.forEach((q,ae)=>{$n(q.name||`Importada ${ae+1}`,q)}),ve(),_t(),Q(`Pack: ${z.added} agregadas \xB7 ${z.skipped} omitidas \xB7 ${z.failed} fallidas`)}catch(P){console.error("No se pudo importar el pack:",P),Q("No se pudo importar el pack")}finally{qe.value=""}});function _t(){if(!Te)return;Te.replaceChildren();let x=hi();if(x.length===0){let P=document.createElement("p");P.className="uv-preset-empty",P.textContent="Todav\xEDa no hay presets. Guard\xE1 la configuraci\xF3n actual.",Te.appendChild(P);return}for(let P of x){let z=document.createElement("div");z.className="uv-preset-item";let q=document.createElement("button");q.type="button",q.className="uv-preset-load";let ae=document.createElement("b");ae.textContent=P.name;let hn=document.createElement("span"),Ki=pn[P.state?.effect]?.[0]||P.state?.effect||"\u2014";hn.textContent=`${Ki} \xB7 ${gs(P.createdAt)}`,q.append(ae,hn),q.addEventListener("click",()=>Wi(P));let It=document.createElement("button");It.type="button",It.className="uv-btn uv-btn-icon uv-preset-delete",It.setAttribute("aria-label",`Eliminar ${P.name}`),It.appendChild(re("trash",14)),It.addEventListener("click",()=>{gi(P.id),ve(),_t(),Q("Preset eliminado")}),z.append(q,It),Te.appendChild(z)}}function Wi(x){!x||!x.state||(x.state.scene?he(x.state.scene,{silent:!0}):n[x.state.effect]&&(C(x.state.effect),X(x.state.effect)&&x.state.params&&(vt(x.state.params),O?.refresh(x.state.effect))),x.state.interval&&(l.interval=x.state.interval,Z&&(Z.value=String(l.interval)),ne&&(ne.textContent=`${l.interval}s`)),Q(`Preset \u201C${x.name}\u201D cargado`))}document.getElementById("capture-btn")?.addEventListener("click",async()=>{let x=await Ii();Q(x?"PNG descargado":"No se pudo capturar el frame")}),document.getElementById("share-btn")?.addEventListener("click",async()=>{(await Bi({effect:l.current,interval:l.interval,audio:ee().enabled,params:X(l.current)?qt():null,scene:Y()})).method==="clipboard"?Q("URL copiada"):Q("No se pudo copiar la URL")}),document.getElementById("fullscreenBtn")?.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.()}),document.addEventListener("fullscreenchange",()=>{let x=document.getElementById("fullscreenBtn");x&&(x.replaceChildren(re(document.fullscreenElement?"collapse":"expand",18)),x.setAttribute("aria-label",document.fullscreenElement?"Salir de pantalla completa":"Pantalla completa"))});function ye(x,P){let z=document.getElementById(x);z&&(z.textContent=P)}function Yn(){let x=ti(),P=X(l.current),z=ai(),q=z&&(z.getAvg?.()||z.getInstant?.())||0;ye("uv-fps",`${Math.round(q)} FPS`),ye("uv-backend",P?"GPU":"P5"),ye("uv-info-fps",x?`${x.fps.toFixed(1)}`:Math.round(q).toString()),P&&x?(ye("uv-info-res",`${x.width}\xD7${x.height}`),ye("uv-info-quality",x.quality),ye("uv-info-particles",x.activeParticles>0?x.activeParticles.toLocaleString("es-AR"):"\u2014")):(ye("uv-info-res",`${window.innerWidth}\xD7${window.innerHeight}`),ye("uv-info-quality",Ue()?"lite":"high"),ye("uv-info-particles","\u2014"))}return setInterval(Yn,600),setInterval(()=>U.refresh(),120),Oi({selectByIndex:x=>{a[x]&&C(a[x])},prevEffect:()=>k(-1),nextEffect:()=>k(1),toggleAuto:()=>kt(!l.auto),toggleFullscreen:()=>document.getElementById("fullscreenBtn")?.click(),toggleMic:()=>h?.click(),togglePanel:()=>M(!p),toggleOnboarding:()=>document.getElementById("onboarding")?.removeAttribute("hidden"),togglePause:()=>u?.click()}),window.matchMedia&&window.matchMedia("(max-width: 720px)").matches&&$e(!1),kt(!1),l.paused=Jr(),le(),N(),te(),Se("params"),Ct(),new URLSearchParams(window.location.search).has("nointro")||Ui({onFirstFrame:x=>requestAnimationFrame(()=>requestAnimationFrame(x))}),w(),{selectEffect:C,openTab:Se,setImmersive:M,getState:()=>({...l,immersive:p}),refresh:N}}if(typeof window<"u"&&document.getElementById("uv-dock")&&!window.__UV_NO_AUTO_INIT__){let e=()=>{window.__UV_STUDIO_MOUNTED__||(window.__UV_STUDIO_MOUNTED__=!0,vs())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}export{vs as mountStudioUI};
