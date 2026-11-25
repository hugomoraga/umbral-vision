var bi=Object.defineProperty;var yi=(e,t,n)=>t in e?bi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var Oe=(e,t,n)=>yi(e,typeof t!="symbol"?t+"":t,n);function Vt(e,t,n=parseFloat){let a=document.getElementById(e);if(!a)return t;let r=n(a.value);return isNaN(r)?t:r}function Je(e,t=.1){return Math.random()<t?(Math.random()-.5)*2:0}function Un(e,t,n,a=.1,r=10){return Math.sin((e+t)*.1+n*a)*r}function Gn(e,t,n=1){return Math.sin(e*.05+t*.1)*n*20}function cn(e,t,n,a=.01){let r=Math.sin(e*a+n)*.5,o=Math.cos(t*a+n*.7)*.5;return(r+o)*50}var Vn={sync:{mode:"grid",bpm:"auto",fallbackBpm:128,minBpm:80,maxBpm:180,visualLatencyMs:28},kick:{rangeHz:[35,120],refractoryMs:180,threshold:1.55,minFlux:.006,sensitivity:1,depth:.7,decaySec:1.5,spring:18,damping:4.5,cameraDolly:.03,bloomPulse:.18},bassBody:{attackMs:80,releaseMs:800,scale:.05},midFlow:{attackMs:120,releaseMs:600,twist:.22,waveSpeed:.8,waveAmp:.12},highShimmer:{attackMs:15,releaseMs:180,porosity:.5,microDisplace:.012},volume:{exposure:.2,bloom:.15},dynamics:{autoGain:.6,floor:.04},agc:{autoGain:.6,floor:.03,decay:.996,onsetThreshold:1.6,onsetMinFlux:.0015,refractoryMs:140},feedback:{amount:.25,decay:.92,zoom:.5,rotation:.3,warp:.5,bassZoom:.35,midRotation:.4,kickDecay:.035,highWarp:.25},effects:{fluidFields:{kick:1,body:.7,mid:.9,high:1},organicStructures:{kick:1,body:.8,mid:1,high:1},mathematicalForms:{kick:1,body:.5,mid:.8,high:.8},temporalVeil:{kick:1,body:.6,mid:.9,high:.8}}},Ia="umbral-vision:audio-map",je=Hn(Vn),Mt=Ba();function Hn(e){return JSON.parse(JSON.stringify(e))}function ft(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function Ht(e,t){if(!ft(t))return e;for(let[n,a]of Object.entries(t))ft(a)&&ft(e[n])?Ht(e[n],a):a!==void 0&&(e[n]=Array.isArray(a)?a.slice():a);return e}function Ba(){try{if(typeof localStorage>"u")return{};let e=localStorage.getItem(Ia),t=e?JSON.parse(e):{};return ft(t)?t:{}}catch{return{}}}function Na(){try{if(typeof localStorage>"u")return;localStorage.setItem(Ia,JSON.stringify(Mt))}catch{}}function $n(){return je=Hn(Vn),Ht(je,Mt),je}$n();async function xi(e=null){let t=null;if(typeof window<"u"&&typeof window.fetch=="function")try{let a=e||new URL("./audio-map.json",import.meta.url).href,r=await window.fetch(a,{cache:"no-cache"});r.ok&&(t=await r.json())}catch{}let n=typeof window<"u"?window.UV_AUDIO_MAP:null;return Mt=Ba(),je=Hn(Vn),ft(t)&&Ht(je,t),ft(n)&&Ht(je,n),Ht(je,Mt),je}function J(){return je}function At(e,t){let n=String(e).split("."),a=Mt;for(let r=0;r<n.length-1;r++){let o=n[r];ft(a[o])||(a[o]={}),a=a[o]}return a[n[n.length-1]]=t,Na(),$n()}function Da(){return Mt={},Na(),$n()}typeof window<"u"&&typeof window.fetch=="function"&&xi();var Re=null,he=null,$t=null,un=null,Ce=null,Pe=null,ze=null,Wt=0,Kt=!1,pn=2048,Ei=.35,wi=.045,Si=.22,qn=.012,jn=.09,Mi=.035,Ai=.16,mn=30,Qn=32,we={bass:[20,160],mid:[160,2e3],high:[2e3,12e3]},F={enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0,flux:0,bassBody:0,midFlow:0,highShimmer:0,bassFast:0,midFast:0,highFast:0,bassSlow:0,midSlow:0,highSlow:0,waveRms:0,transient:0,bassOnset:!1,midOnset:!1,highOnset:!1,kick:0,kickFlash:0,kickTrigger:!1,kickStrength:0,kickOnset:!1,kickInterval:0,kickFlux:0,kickEnergy:0,bpm:0,beatPhase:0,tempoConfidence:0,syncMode:"grid"},dn=.12,Pt={bass:.12,mid:.12,high:.12},qt={bass:.001,mid:.001,high:.001},ie=0,Jn=new Float32Array(mn),fn=0,ht=0,Tt=0,Zn=-10,ea=new Float32Array(Qn),hn=0,pt=0,Ze=-10,jt={bass:-10,mid:-10,high:-10},ta=0,na=0,gn=-10,Rt=0,Ct=0,gt=[],vt=0,ra=0,et=0,tt=[],aa=null;function Wn(e,t,n){let a=Math.max(0,Math.floor(t)),r=Math.min(e.length,Math.max(a+1,Math.ceil(n))),o=0;for(let s=a;s<r;s++)o+=e[s];return o/(r-a)/255}function Fi(e,t=44100,n=pn){if(!e||e.length===0)return{bass:0,mid:0,high:0,rms:0};let a=e.length,r=t/n,o=l=>l/r,s=0;for(let l=0;l<a;l++){let f=e[l]/255;s+=f*f}let i=Math.min(1,Math.sqrt(s/a)*1.6),c={bass:[o(we.bass[0]),o(we.bass[1])],mid:[o(we.mid[0]),o(we.mid[1])],high:[o(we.high[0]),o(we.high[1])]};return{bass:Wn(e,c.bass[0],c.bass[1]),mid:Wn(e,c.mid[0],c.mid[1]),high:Wn(e,c.high[0],c.high[1]),rms:i}}function Ti(e){if(!e.length)return 0;let t=e.slice().sort((a,r)=>a-r),n=t.length>>1;return t.length%2?t[n]:(t[n-1]+t[n])/2}function Ri(e,t){return e.length?e.reduce((n,a)=>n+Math.abs(a-t),0)/e.length:0}function Ee(e,t,n,a=wi,r=Si){let o=t>e?a:r,s=1-Math.exp(-Math.max(0,n)/Math.max(.001,o));return e+(t-e)*s}function Ft(e,t){let n=Number(e);return Number.isFinite(n)&&n>0?n/1e3/3:t}function We(e,t,n){return Math.min(n,Math.max(t,e))}function Ci(e,t,n){let a=Math.pow(.996,Math.max(0,t)*60);dn=Math.max(e,dn*a);let r=We(Number(n.dynamics?.autoGain??.6),0,1),o=Math.max(.01,Number(n.dynamics?.floor??.04));return Math.max(dn*(1-r*.35),o)}function Kn(e,t,n,a){let r=Number(a.agc?.decay??.996),o=Math.pow(r,Math.max(0,n)*60);Pt[e]=Math.max(t,Pt[e]*o);let s=We(Number(a.agc?.autoGain??a.dynamics?.autoGain??.6),0,1),i=Math.max(.008,Number(a.agc?.floor??a.dynamics?.floor??.03));return Math.max(Pt[e]*(1-s*.35),i)}function vn(){F.enabled=!1;for(let e of Object.keys(F))e==="syncMode"?F[e]="grid":e==="kickTrigger"||e==="kickOnset"||e==="enabled"||e.endsWith("Onset")?F[e]=!1:F[e]=0;dn=.12,Pt.bass=.12,Pt.mid=.12,Pt.high=.12,qt.bass=.001,qt.mid=.001,qt.high=.001,Wt=0,Pe&&Pe.fill(128),ie=0,fn=0,ht=0,Jn.fill(0),Tt=0,Zn=-10,hn=0,pt=0,ea.fill(0),Ze=-10,jt.bass=-10,jt.mid=-10,jt.high=-10,ta=0,na=0,gn=-10,Rt=0,Ct=0,gt.length=0,vt=0,ra=0,et=0,tt=[],aa=null,ze&&ze.fill(0)}function Pi(e,t){let n=J(),a=Number(n.sync?.minBpm??80),r=Number(n.sync?.maxBpm??180),o=60/r,s=60/a;if(t<o||t>s)return;gt.push(t),gt.length>8&&gt.shift();let i=Ti(gt);vt=i>0?We(60/i,a,r):0;let c=i>0?Ri(gt,i)/i:1,l=We(gt.length/4,0,1);ra=We((1-c*7)*l,0,1)}function Yn(e){let t=e.sync?.bpm;return typeof t=="number"&&Number.isFinite(t)?We(t,Number(e.sync?.minBpm??80),Number(e.sync?.maxBpm??180)):vt||Number(e.sync?.fallbackBpm??128)}function Xn(e,t,n){let a=Math.max(0,Number(n.sync?.visualLatencyMs??28))/1e3;tt.push({at:t+a,strength:We(e,0,1)}),tt.length>8&&tt.shift()}function ki(e,t){gn=t,Rt=e,Ct=1,F.kick=e,F.kickFlash=1,F.kickTrigger=!0,F.kickStrength=e}function Li(e){if(!tt.length)return;let t=[];if(tt=tt.filter(n=>n.at<=e?(t.push(n),!1):!0),t.length){let n=t.reduce((a,r)=>r.strength>a.strength?r:a);ki(n.strength,e)}}function _i(e){let t=J(),n=he.context?.sampleRate||44100,a=he.fftSize||pn,r=Fi(Ce,n,a);F.syncMode=t.sync?.mode||"grid",F.kickTrigger=!1,F.kickOnset=!1,F.syncMode!==aa&&(tt=[],et=0,aa=F.syncMode);let o=Ce.length,s=n/a,i=(k,$)=>[Math.max(1,Math.floor(k/s)),Math.min(o-1,Math.ceil($/s))],c=i(we.bass[0],we.bass[1]),l=i(we.mid[0],we.mid[1]),f=i(we.high[0],we.high[1]),m=Kn("bass",r.bass,e,t),h=Kn("mid",r.mid,e,t),v=Kn("high",r.high,e,t),u=Ci(Math.max(r.bass,r.mid,r.high),e,t),b=(k,$)=>Math.min(1.5,k/$*.7+k/u*.3),g=b(r.bass,m),y=b(r.mid,h),p=b(r.high,v);F.rms=Ee(F.rms,Math.min(1.5,r.rms*2.6),e,Mi,Ai),F.bass=Ee(F.bass,g,e),F.mid=Ee(F.mid,y,e),F.high=Ee(F.high,p,e),F.bassFast=Ee(F.bassFast,g,e,qn,jn),F.midFast=Ee(F.midFast,y,e,qn,jn),F.highFast=Ee(F.highFast,p,e,qn,jn),F.bassBody=Ee(F.bassBody,g,e,Ft(t.bassBody?.attackMs,.06),Ft(t.bassBody?.releaseMs,.6)),F.midFlow=Ee(F.midFlow,y,e,Ft(t.midFlow?.attackMs,.08),Ft(t.midFlow?.releaseMs,.5)),F.highShimmer=Ee(F.highShimmer,p,e,Ft(t.highShimmer?.attackMs,.02),Ft(t.highShimmer?.releaseMs,.18)),F.bassSlow=F.bassBody,F.midSlow=F.midFlow,F.highSlow=F.highShimmer;let d=0,E=0;if(Pe&&Pe.length){let k=0;for(let $=0;$<Pe.length;$++){let Q=(Pe[$]-128)/128;k+=Q*Q;let P=Math.abs(Q);P>E&&(E=P)}d=Math.sqrt(k/Pe.length)}let M=Math.max(0,d-Wt);Wt=d,F.waveRms=Ee(F.waveRms,Math.min(1,d*3.5),e,.02,.12),F.transient=Ee(F.transient,Math.min(1,M*18+E*.08),e,.01,.1),F.energy=F.bass*.55+F.mid*.3+F.high*.15,F.level=Math.min(1,F.rms*1.15+F.energy*.22);let S=0,w=0,A=0,_=0,N=0,R=0,T=Number(t.kick?.rangeHz?.[0]??35),C=Number(t.kick?.rangeHz?.[1]??120),D=Math.max(1,Math.floor(T/s)),B=Math.min(o-1,Math.ceil(C/s));if(ze&&ze.length===o)for(let k=0;k<o;k++){let $=Ce[k]-ze[k];$>0&&(S+=$,k>=D&&k<=B&&(w+=$),k>=c[0]&&k<=c[1]?_+=$:k>=l[0]&&k<=l[1]?N+=$:k>=f[0]&&k<=f[1]&&(R+=$)),ze[k]=Ce[k]}else{ze=new Float32Array(o);for(let k=0;k<o;k++)ze[k]=Ce[k]}let q=Math.max(1.25,Number(t.agc?.onsetThreshold??1.6)),H=Math.max(5e-4,Number(t.agc?.onsetMinFlux??.0015)),K=Math.max(.06,Number(t.agc?.refractoryMs??140)/1e3),Ne={bass:_/Math.max(1,c[1]-c[0]+1)/255*5.5,mid:N/Math.max(1,l[1]-l[0]+1)/255*4.2,high:R/Math.max(1,f[1]-f[0]+1)/255*4.8};for(let k of["bass","mid","high"]){let $=Ne[k],Q=qt[k],P=$>Q*q&&$>H&&ie-jt[k]>K;F[`${k}Onset`]=P,P&&(jt[k]=ie),qt[k]=Q*.92+$*.08}for(let k=D;k<=B;k++)A+=Ce[k];A=A/Math.max(1,B-D+1)/255;let se=A-na;na=A,S=S/o/255*3.2,w=w/Math.max(1,B-D+1)/255*6.5,Jn[fn]=S,fn=(fn+1)%mn,ht<mn&&ht++;let re=0;for(let k=0;k<ht;k++)re+=Jn[k];re=ht>0?re/ht:0,Tt*=Math.exp(-e/.14),Tt<.001&&(Tt=0),ht===mn&&S>re*1.55&&S>.012&&ie-Zn>.12&&(Tt=1,Zn=ie),F.beat=Tt,ea[hn]=w,hn=(hn+1)%Qn,pt<Qn&&pt++;let le=0;for(let k=0;k<pt;k++)le+=ea[k];le=pt>0?le/pt:0;let de=Math.max(1.05,Number(t.kick?.threshold??1.55)),Fe=Math.max(.001,Number(t.kick?.minFlux??.006)),ut=vt>0?60/Yn(t):0,pe=Math.max(Math.max(.05,Number(t.kick?.refractoryMs??180)/1e3),ut*.85),$e=We(Number(t.kick?.sensitivity??1),.2,4);if(pt>=6&&w>le*de/$e&&w>Fe&&A>.04&&se>.025&&ie-Ze>pe){let k=We(.35+w/Math.max(.001,le*de)*.45+A*.5,.35,1),$=ie-Ze;if(Ze>=0){let Q=60/Number(t.sync?.maxBpm??180),P=60/Number(t.sync?.minBpm??80),L=$;for(;L>0&&L<Q;)L*=2;for(;L>P;)L/=2;$=L,F.kickInterval=$,Pi(ie,$)}F.kickOnset=!0,Ze=ie,ta=k,(t.sync?.mode==="kick"||t.sync?.mode==="grid"&&!vt)&&Xn(k,ie,t)}if(t.sync?.mode==="grid"&&(vt>0||typeof t.sync?.bpm=="number")){let k=60/Yn(t);(!et||et<ie-k*2)&&(et=(Ze>=0?Ze:ie)+k);let $=0;for(;ie>=et&&$<2;){let Q=ie-Ze,P=Q<k*1.45?Math.max(.4,ta*(1-Q/(k*2))):.35;Xn(P,et,t),et+=k,$++}}let X=Math.max(.15,Number(t.kick?.decaySec??1.5));Rt*=Math.exp(-e/X),Rt<.001&&(Rt=0),Ct*=Math.exp(-e/.18),Ct<.001&&(Ct=0),Li(ie),F.kick=Rt,F.kickFlash=Ct,F.kickFlux=w,F.kickEnergy=A;let wt=Yn(t);F.bpm=vt>0||typeof t.sync?.bpm=="number"?Math.round(wt*10)/10:0,F.tempoConfidence=typeof t.sync?.bpm=="number"?1:ra,F.beatPhase=F.bpm>0&&gn>=0?(ie-gn)/(60/F.bpm)%1:0,F.flux=S,F.enabled=!0,ie+=e}async function Oa(){if(Kt)return!0;if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("getUserMedia no est\xE1 disponible en este navegador");let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});if(un=e,!Re||Re.state==="closed"){let t=window.AudioContext||window.webkitAudioContext;Re=new t}return Re.state==="suspended"&&await Re.resume(),he=Re.createAnalyser(),he.fftSize=pn,he.smoothingTimeConstant=Ei,Ce=new Uint8Array(he.frequencyBinCount),Pe=new Uint8Array(he.fftSize||pn),ze=null,Wt=0,$t=Re.createMediaStreamSource(e),$t.connect(he),Kt=!0,vn(),!0}function bn(e=1/60){if(!Kt||!he||!Ce){F.enabled&&vn();return}try{he.getByteFrequencyData(Ce),Pe&&typeof he.getByteTimeDomainData=="function"&&he.getByteTimeDomainData(Pe),_i(Math.min(.1,Math.max(.001,e)))}catch{vn()}}async function za(){if(Kt=!1,$t){try{$t.disconnect()}catch{}$t=null}if(he){try{he.disconnect()}catch{}he=null}if(un){try{un.getTracks().forEach(e=>e.stop())}catch{}un=null}if(Re&&Re.state!=="closed")try{await Re.close()}catch{}Re=null,Ce=null,Pe=null,ze=null,Wt=0,vn()}function Z(){return{enabled:Kt,level:F.level,kick:F.kick,bpm:F.bpm,mode:F.syncMode}}function Ue(){return F}function Ua(){return Ce}var Ke={tunnel:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=Z(),r=Vt("ellipseCount",100,parseInt),o=Vt("ellipseSpacing",10),s=Vt("angleIncrement",.05),i=Vt("ellipseSizeFactor",1),c=s,l=i,f=1;n&&a>.01&&(c=s*(1+a*3),l=i*(1+a*2),f=1+a*4),e.strokeWeight(f),e.colorMode(e.HSB,360,100,100);let m=200,h=a*30,v=40+a*30,u=30+a*40;e.stroke((m+h)%360,v,u),e.background(0,8),e.translate(e.width/2,e.height/2);for(let b=0;b<r;b++){let g=b*o,y=t+b*.1,p=g*l;if(n&&a>.01){let d=Math.sin(y+t*2)*a*30;p+=d}e.ellipse(g*Math.cos(y),g*Math.sin(y),p,p)}t+=c}}},spiral:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=Z();e.background(0,5),e.translate(e.width/2,e.height/2);let r=300,o=Math.min(e.width,e.height)*.45,s=n&&a>.01?1+a*1.5:1;for(let i=0;i<r;i++){let c=i/r*Math.PI*12+t*s,l=i/r*o,f=2+Math.sin(c*3+t)*1.5,m=(220+c*20+t*15)%360,h=25+a*25,v=20+a*35;e.stroke(m,h,v),e.strokeWeight(1+a*2),e.noFill(),e.ellipse(l*Math.cos(c),l*Math.sin(c),f,f)}t+=.02*s}}},mandala:e=>{let t=0,n=12,a=6,r=6,o=Math.PI*2,s=o/r,i=new Float32Array(r),c=new Float32Array(r);for(let l=0;l<r;l++)i[l]=Math.cos(s*l),c[l]=Math.sin(s*l);return{draw:l=>{let m=!!(l&&l.isLite)?a:n,{enabled:h,level:v}=Z();e.background(0,8),e.push(),e.translate(e.width/2,e.height/2);let u=h&&v>.01?1+v*1.2:1;t+=.008*u;let b=new Array(m);for(let g=0;g<m;g++)b[g]=8+g*3;for(let g=0;g<m;g++){let y=t*(1+g*.08),p=40+g*35,d=b[g],E=o/d;e.push(),e.rotate(y);for(let M=0;M<d;M++){let S=E*M,w=Math.cos(S),A=Math.sin(S),_=p*w,N=p*A,R=20+Math.sin(y*2+M)*10,T=v*15,C=(R+T)/2,D=(180+g*15+M*10+t*30)%360,B=30+v*20,q=25+v*30;e.fill(D,B,q),e.stroke(D,B+10,q+10),e.strokeWeight(.5),e.push(),e.translate(_,N),e.rotate(S),e.beginShape();for(let H=0;H<r;H++)e.vertex(C*i[H],C*c[H]);e.endShape(e.CLOSE),e.pop()}e.pop()}e.pop()}}},particles:e=>{let t=[],n=!1;return{draw:()=>{let{enabled:a,level:r}=Z();if(!n){for(let i=0;i<150;i++)t.push({x:Math.random()*e.width,y:Math.random()*e.height,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,size:Math.random()*5+2,hue:Math.random()*360});n=!0}e.background(0,12);let o=a&&r>.01?1+r*2:1;for(let s=0;s<t.length;s++){let i=t[s];i.x+=i.vx*o,i.y+=i.vy*o,(i.x<0||i.x>e.width)&&(i.vx*=-1),(i.y<0||i.y>e.height)&&(i.vy*=-1),i.x=e.constrain(i.x,0,e.width),i.y=e.constrain(i.y,0,e.height);let c=i.size*(1+r*1.5);i.hue=(i.hue+1.5*o)%360;let l=(200+i.hue*.3)%360,f=20+r*15,m=15+r*25;e.fill(l,f,m),e.noStroke(),e.ellipse(i.x,i.y,c,c);for(let h=s+1;h<t.length;h++){let v=t[h],u=e.dist(i.x,i.y,v.x,v.y);if(u<80){let b=e.map(u,0,80,60,0);e.stroke(l,f,m,b),e.strokeWeight(.5),e.line(i.x,i.y,v.x,v.y)}}}}}},waves:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=Z();e.background(0,6);let r=n&&a>.01?a:.1;t+=.04*(1+r);let o=6,s=e.height/2;for(let i=0;i<o;i++){let c=40+i*25,l=.015+i*.008,f=.04+i*.015;e.beginShape(),e.noFill();let m=(35+i*8+t*5)%360,h=25+a*20,v=20+a*35;e.stroke(m,h,v),e.strokeWeight(1.5+a*2);for(let u=0;u<e.width;u+=4){let b=s+Math.sin(u*l+t+i)*c*(1+r)+Math.cos(u*l*.7+t*1.3)*c*.4*r;e.vertex(u,b)}e.endShape()}}}},fractal:e=>{let t=0,n=6,a=4,r=4,o=3,s=Math.PI*2;return{draw:i=>{let{enabled:c,level:l}=Z();e.background(0,5),e.push(),e.translate(e.width/2,e.height/2);let f=!!(i&&i.isLite),m=c&&l>.01?1+l*1.5:1;t+=.008*m;let h=f?a:n,v=f?o:r,u=s/h,b=90;function g(y,p,d){if(p===0)return;let E=(190+p*12+t*20)%360,M=30+l*15,S=20+l*25;e.stroke(E,M,S),e.strokeWeight(p*1.5+l*2),e.push(),e.rotate(d),e.line(0,0,0,-y),e.translate(0,-y);for(let w=0;w<h;w++){let A=u*w+t*.4,_=y*.72*(1+l*.25);g(_,p-1,A)}e.pop()}for(let y=0;y<h;y++){let p=u*y;g(b*(1+l*.5),v,p+t)}e.pop()}}},matrix:e=>{let t="01\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3",n=[],a=!1,r=20;return{draw:()=>{let{enabled:o,level:s}=Z();if(!a){for(let c=0;c<50;c++)n.push({x:Math.random()*e.width,y:Math.random()*e.height,speed:Math.random()*5+2,length:Math.floor(Math.random()*20)+5});a=!0}e.background(0,20),e.colorMode(e.HSB,360,100,100);let i=o&&s>.01?1+s*1.5:1;e.textSize(r),e.textAlign(e.CENTER);for(let c of n){c.y+=c.speed*i,c.y>e.height+c.length*r&&(c.y=-c.length*r,c.x=Math.random()*e.width);for(let l=0;l<c.length;l++){let f=c.y-l*r;if(f>0&&f<e.height){let m=e.map(l,0,c.length,80,5),h=140,v=30+s*20,u=15+s*25;e.fill(h,v,u,m);let b=t[Math.floor(Math.random()*t.length)];e.text(b,c.x,f)}}}}}},glitch:e=>{let t=0,n=0;return{draw:()=>{let{enabled:a,level:r}=Z();e.background(0,5),t+=.05;let o=a&&r>.01?r:.1;n=r*30;for(let s=0;s<e.height;s+=3){let i=Je(t+s*.01,.03+r*.08),c=i*n,l=(200+i*20)%360,f=15+r*15,m=10+r*20;e.stroke(l,f,m),e.strokeWeight(.5),e.line(0+c,s,e.width+c,s)}for(let s=0;s<4;s++){let i=t+s*.6,c=e.height/2+Math.sin(i)*80,l=Un(0,c,i,.15,n*.8),f=(210+s*15)%360,m=20+r*15,h=15+r*25;e.stroke(f,m,h),e.strokeWeight(1.5+r*2),e.noFill(),e.beginShape();for(let v=0;v<e.width;v+=4){let u=c+l+Math.sin(v*.015+i)*25;e.vertex(v,u)}e.endShape()}}}},melt:e=>{let t=0,n=[],a=!1;return{draw:()=>{let{enabled:r,level:o}=Z();if(!a){for(let i=0;i<200;i++)n.push({x:Math.random()*e.width,y:Math.random()*e.height*.3,vx:(Math.random()-.5)*2,vy:Math.random()*2+1,size:Math.random()*8+3,hue:Math.random()*360,melt:0});a=!0}e.background(0,20),t+=.02;let s=r&&o>.01?1+o*2:1;for(let i of n){let c=Gn(i.y,t,o+.3);i.x+=i.vx*s+c*.1,i.y+=i.vy*s,i.y>e.height&&(i.y=-10,i.x=Math.random()*e.width,i.melt=0),i.melt+=.05*s;let l=i.size*(1-i.melt*.1)*(1+o);i.hue=(i.hue+2*s)%360;let f=o*20,m=Je(t+i.x*.01,.08)*f,h=Je(t+i.y*.01,.08)*f*.5,v=(220+i.hue*.2)%360,u=20+o*12,b=15+o*20;e.fill(v,u,b),e.stroke(v,u+5,b+5),e.strokeWeight(.3),e.push(),e.translate(i.x+m,i.y+h),e.rotate(i.melt*.4);let g=Math.sin(i.melt*2)*.2;e.ellipse(0,0,l*(1+g),l*(1+i.melt*.25)),e.pop()}}}},fractalGlitch:e=>{let t=0,n=0;return{draw:()=>{let{enabled:a,level:r}=Z();e.background(0,8),e.translate(e.width/2,e.height/2);let o=a&&r>.01?1+r*1.3:1;t+=.008*o,n+=.04*(1+r);let s=5,i=4,c=130,l=r*15;function f(h,v,u,b=0,g=0){if(v===0||h<8)return;let y=Math.sin(n+v*.3)>.8,p=y?Je(n+v,.15)*l:0,d=cn(b,g,n,.012)*(y?.4:.1),E=(190+v*12+t*10)%360,M=22+r*10,S=16+r*18;e.stroke(E,M,S),e.strokeWeight(v*.7+r*1),e.push(),e.translate(b,g),e.rotate(u+p*.03);let w=d*.03,A=-h+d*.05;e.line(0,0,w,A),e.translate(w,A);let _=Math.PI*2/s;for(let N=0;N<s;N++){let R=_*N+t*.25+p*.01,T=h*.78,C=v-1;C>0&&T>8&&f(T,C,R,0,0)}e.pop()}let m=Je(n,.1)*l*.2;f(c*(1+r*.3),i,t+m*.02)}}},waveGlitch:e=>{let t=0,n=8,a=4,r=3,o=6,s=Math.PI*2,i=[],c=[],l=!1;return{draw:f=>{let m=!!(f&&f.isLite),h=m?a:n,v=m?o:r,{enabled:u,level:b}=Z();if(e.background(0,15),t+=.08,!l){for(let d=0;d<n;d++)i[d]=Math.random()*s,c[d]=Math.random()*s;l=!0}let g=u&&b>.01?b:.1,y=b*40,p=e.height/2;for(let d=0;d<h;d++){let E=(.15+d*.05)*(d%2===0?1:-1),M=40+d*25,S=.015+d*.008,w=.02+d*.01;c[d]+=w*(1+b*.3);let A=(Math.sin(c[d])+1)/2,_=M*.3,N=M*1.5,R=_+A*(N-_);i[d]+=E*(1+b*.5),e.beginShape(),e.noFill();let T=(30+d*6+t*8)%360,C=20+b*15,D=18+b*28;e.stroke(T,C,D),e.strokeWeight(1.2+b*1.5);for(let B=0;B<e.width;B+=v){let q=B*S+i[d]+d*.5,H=p+Math.sin(q)*R*(1+g);H+=Math.sin(t*.3+d*.4)*10*g;let K=Je(t+B*.01+d,.06+b*.04)*y*.7,Ne=Je(t+B*.015+d*.5,.08)*y*.4,se=Un(B,H,t+d,.12,y*.25),re=Gn(H,t+d*.25,b*.4)*.2;H+=Ne+se+re;let le=B+K;e.vertex(le,H)}e.endShape()}}}},sacredGeometry:e=>{let t=0;return{draw:()=>{let{enabled:n,level:a}=Z();e.background(0,4),e.translate(e.width/2,e.height/2);let r=n&&a>.01?1+a*1.2:1;t+=.006*r;let o=10,s=60;for(let i=0;i<o;i++){let c=t*(1+i*.05),l=s+i*30,f=6+i*2;e.push(),e.rotate(c);let m=(180+i*8+t*10)%360,h=25+a*12,v=18+a*22;e.stroke(m,h,v),e.strokeWeight(1+i*.1+a*1.5),e.noFill(),e.beginShape();for(let u=0;u<f;u++){let b=Math.PI*2/f*u,g=l*(1+Math.sin(c*2+u)*.1*a);e.vertex(g*Math.cos(b),g*Math.sin(b))}e.endShape(e.CLOSE),e.pop()}}}},biomech:e=>{let t=0,n=[],a=!1;return{draw:()=>{let{enabled:r,level:o}=Z();if(!a){for(let i=0;i<8;i++)n.push({x:e.width/9*(i+1),y:e.height/2,size:40+Math.random()*30,rotation:Math.random()*Math.PI*2,segments:8+Math.floor(Math.random()*6)});a=!0}e.background(0,6),t+=.02;let s=r&&o>.01?1+o*1.3:1;for(let i of n){i.rotation+=.003*s,e.push(),e.translate(i.x,i.y),e.rotate(i.rotation);let c=(200+i.x*.1+t*5)%360,l=18+o*10,f=12+o*18;e.stroke(c,l,f),e.strokeWeight(1.5+o*2),e.noFill(),e.beginShape();for(let m=0;m<i.segments;m++){let h=Math.PI*2/i.segments*m,v=cn(i.x,i.y,t+m,.05)*.3,u=i.size*(1+v)*(1+o*.3),b=u*Math.cos(h),g=u*Math.sin(h);e.vertex(b,g)}e.endShape(e.CLOSE);for(let m=0;m<3;m++){let h=i.size*(.3+m*.2);e.beginShape();for(let v=0;v<i.segments;v++){let u=Math.PI*2/i.segments*v+t*.1,b=cn(i.x,i.y,t+v,.08)*.2,g=h*(1+b);e.vertex(g*Math.cos(u),g*Math.sin(u))}e.endShape(e.CLOSE)}e.pop()}}}},dune:e=>{let t=0,n=4,a=2,r=6,o=Math.PI*2/r,s=new Float32Array(r),i=new Float32Array(r),c=new Float32Array(r),l=new Float32Array(r);for(let f=0;f<r;f++)s[f]=Math.cos(o*f),i[f]=Math.sin(o*f),c[f]=Math.cos(o*f+Math.PI/6),l[f]=Math.sin(o*f+Math.PI/6);return{draw:f=>{let m=!!(f&&f.isLite),h=m?a:n,{enabled:v,level:u}=Z();e.background(0,5),t+=.03;let b=v&&u>.01?u:.1,g=e.height*.6,y=m?4:2;for(let w=0;w<h;w++){let A=30+w*20,_=.01+w*.005,N=.03+w*.01;e.beginShape(),e.noFill();let R=(25+w*3+t*2)%360,T=20+u*15,C=15+u*25;e.stroke(R,T,C),e.strokeWeight(2+u*2);for(let D=0;D<e.width;D+=y){let B=g+Math.sin(D*_+t*N+w)*A*(1+b)+Math.cos(D*_*.6+t*1.2)*A*.3*b;e.vertex(D,B)}e.endShape()}e.push(),e.translate(e.width/2,e.height*.3);let p=80+u*40,d=t*.02;e.push(),e.rotate(d);let E=(30+t*3)%360,M=15+u*10,S=20+u*20;e.stroke(E,M,S),e.strokeWeight(1.5+u*1.5),e.noFill();for(let w=0;w<r;w++){let A=p*s[w],_=p*i[w],N=p*.6*c[w],R=p*.6*l[w];e.line(A,_,N,R)}e.pop(),e.pop()}}},yinYang:e=>{let t=0,n=.03;return{draw:()=>{let{enabled:a,level:r}=Z(),o=a&&r>.01?1+r*.6:1;e.colorMode(e.RGB),e.background(150,150,150),e.colorMode(e.HSB,360,100,100),e.translate(e.width/2,e.height/2),e.rotate(t);let s=Math.min(e.width,e.height)*.62,i=s/2;e.noStroke(),e.fill(0,0,100),e.circle(0,0,s),e.fill(0,0,0),e.arc(0,0,s,s,e.HALF_PI,e.PI+e.HALF_PI,e.PIE),e.fill(0,0,100),e.circle(0,-i/2,i),e.fill(0,0,0),e.circle(0,i/2,i),e.fill(0,0,0),e.circle(0,-i/2,i/4),e.fill(0,0,100),e.circle(0,i/2,i/4);let c=33e-5*o;n+=c;let l=.84*o;n>l&&(n=l),t+=n*o}}}};console.log("Umbral Vision - Efectos cargados:",Object.keys(Ke));var ke=class{constructor(t={}){this.params={},this.time=0,this.elapsed=0,this._resetParams(),t&&this.setParameters(t)}_resetParams(){for(let[t,n]of Object.entries(this.constructor.schema))this.params[t]=n.default}setParameters(t){if(!t)return[];let n=this.constructor.schema,a=[];for(let[r,o]of Object.entries(t)){let s=n[r];if(!s)continue;let i;if(s.type==="boolean")i=!!o;else{if(i=Number(o),!Number.isFinite(i))continue;s.type==="int"&&(i=Math.round(i)),typeof s.min=="number"&&(i=Math.max(s.min,i)),typeof s.max=="number"&&(i=Math.min(s.max,i))}i!==this.params[r]&&(this.params[r]=i,a.push(r))}return a}getParameters(){return{...this.params}}getSchema(){return this.constructor.schema}update(t,n){this.time+=t,this.elapsed+=t}render(t){throw new Error("Effect.render() must be implemented")}onResize(t,n){}initialize(){}dispose(){}};Oe(ke,"schema",{});function Ga(e,t,n,a){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let o=e.getShaderInfoLog(r);throw e.deleteShader(r),new Error(`[${a}] shader compile error:
${o}
${n}`)}return r}var oe=class{constructor(t,n,a,r="program"){this.gl=t,this.name=r,this.disposed=!1;let o=Ga(t,t.VERTEX_SHADER,n,`${r}:vs`),s=Ga(t,t.FRAGMENT_SHADER,a,`${r}:fs`),i=t.createProgram();if(t.attachShader(i,o),t.attachShader(i,s),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS)){let c=t.getProgramInfoLog(i);throw t.deleteProgram(i),t.deleteShader(o),t.deleteShader(s),new Error(`[${r}] program link error:
${c}`)}t.deleteShader(o),t.deleteShader(s),this.program=i,this.uniforms=new Map,this._introspect()}_introspect(){let t=this.gl,n=t.getProgramParameter(this.program,t.ACTIVE_UNIFORMS);for(let a=0;a<n;a++){let r=t.getActiveUniform(this.program,a);if(!r)continue;let o=r.name.replace(/\[0\]$/,"");this.uniforms.set(o,{location:t.getUniformLocation(this.program,r.name),type:r.type,size:r.size})}}use(){return this.gl.useProgram(this.program),this}has(t){return this.uniforms.has(t)}location(t){let n=this.uniforms.get(t);return n?n.location:null}set(t,n){let a=this.uniforms.get(t);if(!a||a.location===null)return this;let r=this.gl;switch(a.type){case r.FLOAT:r.uniform1f(a.location,n);break;case r.FLOAT_VEC2:r.uniform2fv(a.location,n);break;case r.FLOAT_VEC3:r.uniform3fv(a.location,n);break;case r.FLOAT_VEC4:r.uniform4fv(a.location,n);break;case r.INT:case r.BOOL:case r.SAMPLER_2D:case r.SAMPLER_CUBE:r.uniform1i(a.location,n);break;case r.INT_VEC2:r.uniform2iv(a.location,n);break;case r.INT_VEC3:r.uniform3iv(a.location,n);break;case r.INT_VEC4:r.uniform4iv(a.location,n);break;case r.FLOAT_MAT3:r.uniformMatrix3fv(a.location,!1,n);break;case r.FLOAT_MAT4:r.uniformMatrix4fv(a.location,!1,n);break;default:break}return this}dispose(){this.disposed||(this.disposed=!0,this.uniforms.clear(),this.program&&(this.gl.deleteProgram(this.program),this.program=null))}};var Va={rgba8:{internal:"RGBA8",type:"UNSIGNED_BYTE"},rgba16f:{internal:"RGBA16F",type:"HALF_FLOAT"},rgba32f:{internal:"RGBA32F",type:"FLOAT"}};function Se(e,t){let n=Va[t];if(!n)return!1;let a=e[n.internal],r=e[n.type];if(a==null||r==null)return!1;let o=e.createTexture();e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,a,1,1,0,e.RGBA,r,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST);let s=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,s),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0);let i=e.checkFramebufferStatus(e.FRAMEBUFFER);return e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(s),e.deleteTexture(o),i===e.FRAMEBUFFER_COMPLETE}var ce=class{constructor(t,n){this.gl=t,this.format=n.format||"rgba16f",this.filterMode=n.filter||"linear",this.needsDepth=!!n.depth,this.width=0,this.height=0,this.texture=null,this.fbo=null,this.depthBuffer=null,this.disposed=!1,this.resize(Math.max(1,n.width|0),Math.max(1,n.height|0))}resize(t,n){if(this.disposed||(t=Math.max(1,t|0),n=Math.max(1,n|0),t===this.width&&n===this.height))return;this.width=t,this.height=n;let a=this.gl;this.texture||(this.texture=a.createTexture()),this.fbo||(this.fbo=a.createFramebuffer());let r=Va[this.format],o=a[r.internal],s=a[r.type],c=!(this.format==="rgba16f"||this.format==="rgba32f")||!!(a.getExtension("OES_texture_float_linear")||a.getExtension("OES_texture_half_float_linear")),l=this.filterMode==="nearest"||!c?a.NEAREST:a.LINEAR;a.bindTexture(a.TEXTURE_2D,this.texture),a.texImage2D(a.TEXTURE_2D,0,o,t,n,0,a.RGBA,s,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,l),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,l),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindTexture(a.TEXTURE_2D,null),a.bindFramebuffer(a.FRAMEBUFFER,this.fbo),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,this.texture,0),this.needsDepth&&(this.depthBuffer||(this.depthBuffer=a.createRenderbuffer()),a.bindRenderbuffer(a.RENDERBUFFER,this.depthBuffer),a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_COMPONENT24,t,n),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,this.depthBuffer),a.bindRenderbuffer(a.RENDERBUFFER,null)),a.bindFramebuffer(a.FRAMEBUFFER,null)}bind(){let t=this.gl;return t.bindFramebuffer(t.FRAMEBUFFER,this.fbo),t.viewport(0,0,this.width,this.height),this}dispose(){if(this.disposed)return;this.disposed=!0;let t=this.gl;this.texture&&t.deleteTexture(this.texture),this.fbo&&t.deleteFramebuffer(this.fbo),this.depthBuffer&&t.deleteRenderbuffer(this.depthBuffer),this.texture=null,this.fbo=null,this.depthBuffer=null}};function nt(e){let t=e.createVertexArray(),n=e.createBuffer();return e.bindVertexArray(t),e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),{vao:t,draw(){e.bindVertexArray(t),e.drawArrays(e.TRIANGLE_STRIP,0,4)},dispose(){e.deleteBuffer(n),e.deleteVertexArray(t)}}}function Ha(e){let t=e.createVertexArray(),n=e.createBuffer();return e.bindVertexArray(t),e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),{vao:t,drawInstanced(a){e.bindVertexArray(t),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,a)},dispose(){e.deleteBuffer(n),e.deleteVertexArray(t)}}}var me=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
`,Yt=`
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
`,at=`
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
`,$a=`
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
`,Ye=`
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
`;var qa=`
vec3 acesFilm(vec3 x) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
`;var ja=`${me}
${Yt}
${at}
${$a}
${Ye}

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
`,Wa=`#version 300 es
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

${Yt}
${at}
${Ye}

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
`,Ka=`${me}

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
`;function Ii(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function yn(e,t,n=new Float32Array(16)){for(let a=0;a<4;a++){let r=t[a*4],o=t[a*4+1],s=t[a*4+2],i=t[a*4+3];n[a*4]=e[0]*r+e[4]*o+e[8]*s+e[12]*i,n[a*4+1]=e[1]*r+e[5]*o+e[9]*s+e[13]*i,n[a*4+2]=e[2]*r+e[6]*o+e[10]*s+e[14]*i,n[a*4+3]=e[3]*r+e[7]*o+e[11]*s+e[15]*i}return n}function xn(e,t,n,a,r=new Float32Array(16)){let o=1/Math.tan(e/2),s=1/(n-a);return r.fill(0),r[0]=o/t,r[5]=o,r[10]=(a+n)*s,r[11]=-1,r[14]=2*a*n*s,r}function En(e,t,n,a=new Float32Array(16)){let r=e[0]-t[0],o=e[1]-t[1],s=e[2]-t[2],i=Math.hypot(r,o,s)||1;r/=i,o/=i,s/=i;let c=n[1]*s-n[2]*o,l=n[2]*r-n[0]*s,f=n[0]*o-n[1]*r;i=Math.hypot(c,l,f)||1,c/=i,l/=i,f/=i;let m=o*f-s*l,h=s*c-r*f,v=r*l-o*c;return a[0]=c,a[1]=m,a[2]=r,a[3]=0,a[4]=l,a[5]=h,a[6]=o,a[7]=0,a[8]=f,a[9]=v,a[10]=s,a[11]=0,a[12]=-(c*e[0]+l*e[1]+f*e[2]),a[13]=-(m*e[0]+h*e[1]+v*e[2]),a[14]=-(r*e[0]+o*e[1]+s*e[2]),a[15]=1,a}function Ya(e,t=new Float32Array(16)){let n=Math.cos(e),a=Math.sin(e);return t.set(Ii()),t[0]=n,t[2]=-a,t[8]=a,t[10]=n,t}function Xe(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let a=t;return a=Math.imul(a^a>>>15,a|1),a^=a+Math.imul(a^a>>>7,a|61),((a^a>>>14)>>>0)/4294967296}}function rt(e,t){return Number.isFinite(Number(e))?Number(e):t}var Ge=class{constructor(){this.kickPos=0,this.kickVel=0,this.flowPhase=0}update(t,n,a,r,o=1){let s=a.effects?.[r]||{},i=rt(s.kick,1),c=rt(s.mid,1),l=a.kick||{};o>0&&n?.kickTrigger&&(this.kickVel+=rt(n.kickStrength,1)*rt(l.depth,.7)*i*6*o);let f=rt(l.spring,18),m=rt(l.damping,4.5);this.kickVel+=(-f*this.kickPos-m*this.kickVel)*t,this.kickPos+=this.kickVel*t,this.kickPos=Math.max(-1.2,Math.min(1.2,this.kickPos));let h=rt(n?.midFlow,0)*c*o;return this.flowPhase+=t*(.18+h*rt(a.midFlow?.waveSpeed,.8)*1.6),this}};var Bi=Math.PI*2,ia={density:{type:"number",default:.9,min:.1,max:1,label:"Densidad",group:"Forma"},speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},amplitude:{type:"number",default:.62,min:0,max:2,label:"Amplitud",group:"Movimiento"},complexity:{type:"number",default:.62,min:0,max:1,label:"Complejidad",group:"Forma"},turbulence:{type:"number",default:.55,min:0,max:1.5,label:"Turbulencia",group:"Movimiento"},hue:{type:"number",default:.56,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.9,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.68,min:.2,max:4,label:"Glow",group:"Apariencia"},particleSize:{type:"number",default:1,min:.4,max:3,label:"Tama\xF1o",group:"Forma"},bloom:{type:"number",default:.85,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.98,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:4,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:1,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},fs=Object.freeze(["membrane","torus","ribbon","smoke","swarm"]),Ni=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0});function Di(e,t,n=1){let a=t*t,r=new Float32Array(a*4),o=new Float32Array(a*4),s=new Float32Array(a*4),i=Xe(n|0||1),c=e|0;for(let l=0;l<t;l++)for(let f=0;f<t;f++){let m=(l*t+f)*4,h=(f+.5+l*.61803398875)%t/t,v=(l+.5)/t*2-1,u=h*Bi,b=i(),g=i(),y=i(),p,d,E;if(c===1){let S=v*Math.PI,w=1.05+.1*Math.sin(u*3),A=.42,_=w+A*Math.cos(S+Math.sin(u*2)*.18);p=Math.cos(u)*_,d=A*Math.sin(S)+.08*Math.sin(u*4),E=Math.sin(u)*_}else if(c===2){let S=v*1.25,w=u+S,A=1.22+.16*Math.cos(v*Math.PI*2.2);p=Math.cos(w)*A,d=v*1.65+.16*Math.sin(u*2+v*2.4),E=Math.sin(w)*A}else{let S=Math.sin(u*3+v*2.2)*.2+Math.sin(u*5-v*1.7)*.07,w=1.28+.3*Math.cos(v*Math.PI*.92)+S;p=Math.cos(u)*w+.1*Math.sin(u*4+v*3),d=v*1.95+.2*Math.sin(u*2+v*3.4),E=Math.sin(u)*w}r[m]=p,r[m+1]=d,r[m+2]=E,r[m+3]=(h+v*.08+1)%1;let M=.035;s[m]=p+(i()-.5)*M,s[m+1]=d+(i()-.5)*M,s[m+2]=E+(i()-.5)*M,s[m+3]=i()*.7,o[m]=(b-.5)*.08,o[m+1]=(g-.5)*.08,o[m+2]=(y-.5)*.08,o[m+3]=b}return{home:r,pos:s,vel:o}}var Xt=class extends ke{constructor(t,n={}){if(super(n),this.renderer=t,this.particleSize=t.quality.particleSize,this.particleCount=this.particleSize*this.particleSize,this.gl=t.gl,this.sceneFormat=Se(this.gl,"rgba16f")?"rgba16f":"rgba8",this.simFormat=Se(this.gl,"rgba32f")?"rgba32f":Se(this.gl,"rgba16f")?"rgba16f":null,this.programs=[],this.state=null,this.homeTexture=null,this.sceneTarget=null,this.sprite=null,this.fullscreen=null,this.viewProj=new Float32Array(16),this.eye=[0,0,4.8],this.lightPos=[2.2,1.8,2.4],this.lastAudio=null,this.motion=new Ge,this.signals={body:0,mid:0,high:0,rms:0,kickPos:0,kickImpulse:0},!this.simFormat)throw new Error("WebGL 2 sin soporte de render a texturas float (se requiere EXT_color_buffer_float)");this._initialize()}_initialize(){let t=this.gl;this.updateProgram=new oe(t,`#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,ja,"fluid:update"),this.renderProgram=new oe(t,Wa,Ka,"fluid:render"),this.programs.push(this.updateProgram,this.renderProgram),this.sprite=Ha(t),this.fullscreen=nt(t),this.sceneTarget=new ce(t,{width:this.renderer.width,height:this.renderer.height,format:this.sceneFormat,filter:"linear"}),this._createHomeAndState()}_createHomeAndState(){let t=this.gl,n=this.particleSize,a=Di(this.params.variant|0,n,this.params.seed|0||1);this.homeTexture=this._createTexture(n,a.home);let r=this._createTexture(n,a.pos),o=this._createTexture(n,a.vel),s=this._createTexture(n,null),i=this._createTexture(n,null),c=t.createFramebuffer();this.state={fbo:c,posA:r,velA:o,posB:s,velB:i,read:"a"},t.bindFramebuffer(t.FRAMEBUFFER,c),t.drawBuffers([t.COLOR_ATTACHMENT0,t.COLOR_ATTACHMENT1]),t.bindFramebuffer(t.FRAMEBUFFER,null)}_createTexture(t,n){let a=this.gl,r=a.createTexture(),o=a.FLOAT;return a.bindTexture(a.TEXTURE_2D,r),a.texImage2D(a.TEXTURE_2D,0,this.simFormat==="rgba32f"?a.RGBA32F:a.RGBA16F,t,t,0,a.RGBA,o,n),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindTexture(a.TEXTURE_2D,null),r}initialize(){}setParameters(t){let n=super.setParameters(t);return(n.includes("seed")||n.includes("variant"))&&this.state&&this._rebuildState(),n}_rebuildState(){this._destroyState(),this._createHomeAndState()}_destroyState(){let t=this.gl;this.state&&(t.deleteTexture(this.state.posA),t.deleteTexture(this.state.posB),t.deleteTexture(this.state.velA),t.deleteTexture(this.state.velB),t.deleteFramebuffer(this.state.fbo),this.state=null),this.homeTexture&&(t.deleteTexture(this.homeTexture),this.homeTexture=null)}update(t,n=Ni){super.update(t,n),this.lastAudio=n;let a=this.params,r=a.audio>0&&n.enabled?a.audio:0,o=J(),s=o.effects?.fluidFields||{},i=this.motion.update(t,n,o,"fluidFields",r),c=(n.bassBody||0)*r*Number(s.body??1),l=(n.midFlow||0)*r*Number(s.mid??1),f=(n.highShimmer||0)*r*Number(s.high??1),m=(n.rms||0)*r,h=i.kickPos*Number(s.kick??1),v=n.kickTrigger?(n.kickStrength||1)*Number(s.kick??1):0;this.signals={body:c,mid:l,high:f,rms:m,kickPos:h,kickImpulse:v},this._stepSimulation(Math.min(.033,Math.max(0,t)),n);let u=this.time,b=this.renderer.pointer||{x:0,y:0},g=h*Number(o.kick?.cameraDolly??.03)*8,y=c*Number(o.bassBody?.scale??.05)*2,p=4.9-g-y+Math.sin(u*.09)*.35,d=u*.11+i.flowPhase*.12+b.x*.22;this.eye=[Math.sin(d)*p,Math.sin(u*.07)*1.15+b.y*.9+h*.3,Math.cos(d)*p];let E=En(this.eye,[0,0,0],[0,1,0]),M=xn(55*Math.PI/180,this.renderer.width/Math.max(1,this.renderer.height),.1,40);yn(M,E,this.viewProj),this.lightPos=[Math.sin(u*.23)*2.6,1.7+Math.cos(u*.17)*.9,Math.cos(u*.23)*2.8]}_stepSimulation(t,n){let a=this.gl,r=this.state,o=this.params,s=this.signals,i=r.read==="a"?r.posA:r.posB,c=r.read==="a"?r.velA:r.velB,l=r.read==="a"?r.posB:r.posA,f=r.read==="a"?r.velB:r.velA;a.bindFramebuffer(a.FRAMEBUFFER,r.fbo),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,l,0),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT1,a.TEXTURE_2D,f,0),a.viewport(0,0,this.particleSize,this.particleSize),a.disable(a.BLEND),a.disable(a.DEPTH_TEST),this.updateProgram.use().set("uPos",0).set("uVel",1).set("uHome",2).set("uTime",this.time).set("uDt",t).set("uSpeed",o.speed).set("uAmplitude",o.amplitude).set("uComplexity",o.complexity).set("uTurbulence",o.turbulence).set("uAudioBass",s.body).set("uAudioMid",s.mid).set("uAudioHigh",s.high).set("uAudioRms",s.rms).set("uKick",s.kickPos).set("uKickImpulse",s.kickImpulse).set("uAudioAmount",1),this._bindTexture(i,0),this._bindTexture(c,1),this._bindTexture(this.homeTexture,2),this.fullscreen.draw(),a.bindFramebuffer(a.FRAMEBUFFER,null),r.read=r.read==="a"?"b":"a"}_bindTexture(t,n){let a=this.gl;a.activeTexture(a.TEXTURE0+n),a.bindTexture(a.TEXTURE_2D,t)}render(t){let n=this.gl,a=this.params,r=this.state,o=this.signals,s=r.read==="a"?r.posA:r.posB,i=r.read==="a"?r.velA:r.velB;this.sceneTarget.bind(),n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ONE),n.disable(n.DEPTH_TEST),n.disable(n.CULL_FACE);let c=Math.max(1,Math.floor(this.particleCount*a.density)),l=[this.sceneTarget.width,this.sceneTarget.height];this.renderProgram.use().set("uPos",0).set("uVel",1).set("uHome",2).set("uViewProj",this.viewProj).set("uResolution",l).set("uTime",this.time).set("uPointSize",a.particleSize*1.95).set("uOpacity",.62).set("uGlow",a.glow).set("uHue",a.hue).set("uSaturation",a.saturation).set("uStretch",t.quality.trailLength).set("uLightPos",this.lightPos).set("uLightPower",1.35+o.rms*.8).set("uAudioHigh",o.high).set("uAudioRms",o.rms).set("uKick",o.kickPos).set("uAudioAmount",1),this._bindTexture(s,0),this._bindTexture(i,1),this._bindTexture(this.homeTexture,2),this.sprite.drawInstanced(c),n.disable(n.BLEND),n.bindFramebuffer(n.FRAMEBUFFER,null)}setAudioFeatures(t){this.lastAudio=t}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.3,bloomKnee:.26,exposure:t.exposure,vignette:.55,grain:.028,aberration:.014,time:this.time}}getSceneTarget(){return this.sceneTarget}onResize(t,n){this.sceneTarget&&this.sceneTarget.resize(t,n)}dispose(){for(let t of this.programs)t.dispose();this.programs=[],this.sprite&&this.sprite.dispose(),this.fullscreen&&this.fullscreen.dispose(),this.sceneTarget&&this.sceneTarget.dispose(),this._destroyState(),this.sprite=null,this.fullscreen=null,this.sceneTarget=null}};Oe(Xt,"schema",ia);var wn=class{constructor(t,n){this.gl=t,this.vao=t.createVertexArray(),this.buffers=[],this.vertexCount=n.positions.length/3,this.indexCount=n.indices.length,t.bindVertexArray(this.vao),this.positionBuffer=this._buffer(t.ARRAY_BUFFER,n.positions,3),this.normalBuffer=this._buffer(t.ARRAY_BUFFER,n.normals,3,1),this.uvBuffer=this._buffer(t.ARRAY_BUFFER,n.uvs,2,2),this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,n.indices,t.STATIC_DRAW),this.buffers.push(this.indexBuffer),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null)}_buffer(t,n,a,r=0){let o=this.gl,s=o.createBuffer();return o.bindBuffer(t,s),o.bufferData(t,n,o.STATIC_DRAW),o.enableVertexAttribArray(r),o.vertexAttribPointer(r,a,o.FLOAT,!1,0,0),this.buffers.push(s),s}draw(){let t=this.gl;t.bindVertexArray(this.vao),t.drawElements(t.TRIANGLES,this.indexCount,t.UNSIGNED_INT,0),t.bindVertexArray(null)}dispose(){let t=this.gl;for(let n of this.buffers)t.deleteBuffer(n);this.buffers=[],t.deleteVertexArray(this.vao),this.vao=null}};var Xa=`#version 300 es
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

${at}

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
`,Qa=`${me}
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

${at}
${Ye}

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
`;var kt=Math.PI*2;function Ja(e={}){let t=Math.max(24,e.segmentsU??240),n=Math.max(8,e.segmentsV??56),a=e.tube??.24,r=e.scale??.95,o=e.twist??0,s=e.seed??1,c=Xe(s)()*kt,l=p=>{let d=p*kt;return[(Math.sin(d)+2*Math.sin(2*d))*r,(Math.cos(d)-2*Math.cos(2*d))*r,-Math.sin(3*d)*r]},f=t*n,m=new Float32Array(f*3),h=new Float32Array(f*3),v=new Float32Array(f*2),u=new Uint32Array(t*n*6),b=.001,g=[0,1,0];for(let p=0;p<n;p++){let d=p/n,E=d*kt;for(let M=0;M<t;M++){let S=M/t,w=(p*t+M)*3,A=(p*t+M)*2,_=l(S),N=l(S+b),R=N[0]-_[0],T=N[1]-_[1],C=N[2]-_[2],D=Math.hypot(R,T,C)||1;R/=D,T/=D,C/=D;let B=T*g[2]-C*g[1],q=C*g[0]-R*g[2],H=R*g[1]-T*g[0],K=Math.hypot(B,q,H);K<1e-4&&(B=T*0-C*1,q=C*1-R*0,H=R*0-T*1,K=Math.hypot(B,q,H)||1),B/=K,q/=K,H/=K;let Ne=T*H-C*q,se=C*B-R*H,re=R*q-T*B,le=E+o*S*kt,de=Math.cos(le),Fe=Math.sin(le),ut=1+.22*Math.sin(S*kt*3+E*2+c)+.1*Math.sin(S*kt*5-E*3+c*.7),pe=a*ut,$e=B*de+Ne*Fe,Te=q*de+se*Fe,X=H*de+re*Fe;m[w]=_[0]+$e*pe,m[w+1]=_[1]+Te*pe,m[w+2]=_[2]+X*pe,h[w]=$e,h[w+1]=Te,h[w+2]=X,v[A]=S,v[A+1]=d}}let y=0;for(let p=0;p<n;p++){let d=(p+1)%n;for(let E=0;E<t;E++){let M=(E+1)%t,S=p*t+E,w=p*t+M,A=d*t+E,_=d*t+M;u[y++]=S,u[y++]=A,u[y++]=w,u[y++]=w,u[y++]=A,u[y++]=_}}return{positions:m,normals:h,uvs:v,indices:u}}var oa={speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},amplitude:{type:"number",default:.26,min:0,max:.9,label:"Deformaci\xF3n",group:"Forma"},frequency:{type:"number",default:1.35,min:.3,max:4,label:"Frecuencia",group:"Forma"},twist:{type:"number",default:0,min:0,max:1,label:"Torsi\xF3n",group:"Forma"},hue:{type:"number",default:.53,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.95,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.95,min:.2,max:4,label:"Glow",group:"Apariencia"},opacity:{type:"number",default:.85,min:.05,max:1,label:"Opacidad",group:"Apariencia"},bloom:{type:"number",default:.85,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.95,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:3,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:3,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},Sn=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0,bassBody:0,midFlow:0,highShimmer:0,kick:0,kickTrigger:!1,kickStrength:0}),Za={lite:{u:170,v:42},high:{u:260,v:60},ultra:{u:360,v:84}},Qt=class extends ke{constructor(t,n={}){super(n),this.renderer=t,this.gl=t.gl,this.sceneFormat=Se(this.gl,"rgba16f")?"rgba16f":"rgba8",this.sceneTarget=new ce(this.gl,{width:t.width,height:t.height,format:this.sceneFormat}),this.program=new oe(this.gl,Xa,Qa,"organic:render"),this.mesh=null,this.model=new Float32Array(16),this.viewProj=new Float32Array(16),this.eye=[0,1.5,7],this.lastAudio=Sn,this.motion=new Ge,this._buildMesh()}_buildMesh(){let t=Za[this.renderer.quality.name]||Za.high,n=Ja({segmentsU:t.u,segmentsV:t.v,tube:.26,scale:.95,twist:this.params.twist,seed:this.params.seed|0});this.mesh&&this.mesh.dispose(),this.mesh=new wn(this.gl,n),this.vertexCount=this.mesh.vertexCount,this.triangleCount=this.mesh.indexCount/3}setParameters(t){let n=super.setParameters(t);return this.mesh&&(n.includes("seed")||n.includes("twist"))&&this._buildMesh(),n}setAudioFeatures(t){this.lastAudio=t||Sn}update(t,n=Sn){super.update(t,n),this.lastAudio=n;let a=this.params,r=this.time,o=J(),s=a.audio>0&&n.enabled?a.audio:0,i=o.effects?.organicStructures||{},c=(n.bassBody||0)*s*Number(i.body??1),l=this.motion.update(t,n,o,"organicStructures",s),f=l.kickPos*Number(i.kick??1),m=this.renderer.pointer||{x:0,y:0},h=f*Number(o.kick?.cameraDolly??.03)*8,v=c*Number(o.bassBody?.scale??.05)*2,u=7.1+Math.sin(r*.085)*.45-h-v,b=r*.09*a.speed+l.flowPhase*.12+m.x*.2;this.eye=[Math.sin(b)*u,1.35+Math.sin(r*.07)*1.1-m.y*.8,Math.cos(b)*u];let g=En(this.eye,[0,0,0],[0,1,0]),y=xn(52*Math.PI/180,this.renderer.width/Math.max(1,this.renderer.height),.1,60);yn(y,g,this.viewProj);let p=r*.055*a.speed+l.flowPhase*.1+(a.seed|0)*.01;Ya(p,this.model)}render(){let t=this.gl,n=this.params,a=this.lastAudio||Sn,r=n.audio>0&&a.enabled?n.audio:0,o=J(),s=o.effects?.organicStructures||{},i=this.motion,c=(a.bassBody||0)*r*Number(s.body??1),l=(a.midFlow||0)*r*Number(s.mid??1),f=i.kickPos*Number(s.kick??1);this.sceneTarget.bind(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.SRC_ALPHA,t.ONE),this.program.use().set("uViewProj",this.viewProj).set("uModel",this.model).set("uTime",this.time).set("uAmplitude",n.amplitude).set("uFrequency",n.frequency).set("uSeed",(n.seed|0)%997).set("uHue",n.hue).set("uSaturation",n.saturation).set("uGlow",n.glow).set("uOpacity",n.opacity).set("uCamPos",this.eye).set("uKick",f*r).set("uBody",c).set("uMidFlow",l).set("uHighShimmer",(a.highShimmer||0)*r*Number(s.high??1)*Number(o.highShimmer?.porosity??1)).set("uFlowPhase",i.flowPhase).set("uWaveAmp",Number(o.midFlow?.waveAmp??.12)).set("uTwist",Number(o.midFlow?.twist??.22)*Math.sin(i.flowPhase*.35)).set("uMicroDisplace",Number(o.highShimmer?.microDisplace??.012)).set("uScale",1+f*r*.12+c*Number(o.bassBody?.scale??.05)),this.mesh.draw(),t.disable(t.BLEND),t.bindFramebuffer(t.FRAMEBUFFER,null)}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.3,bloomKnee:.24,exposure:t.exposure,vignette:.5,grain:.022,aberration:.012,time:this.time}}getSceneTarget(){return this.sceneTarget}onResize(t,n){this.sceneTarget&&this.sceneTarget.resize(t,n)}dispose(){this.program&&this.program.dispose(),this.mesh&&this.mesh.dispose(),this.sceneTarget&&this.sceneTarget.dispose(),this.program=null,this.mesh=null,this.sceneTarget=null}};Oe(Qt,"schema",oa);var Le=`#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,er=`${me}
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
`,tr=`${me}
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
`,nr=`${me}
in vec2 vUv;
uniform sampler2D uSceneA;
uniform sampler2D uSceneB;
uniform float uMix;
uniform int uMode;
out vec4 outColor;

float lumaOf(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec3 a = texture(uSceneA, vUv).rgb;
  vec3 b = texture(uSceneB, vUv).rgb;
  float m = clamp(uMix, 0.0, 1.0);
  if (uMode == 1) {
    // Mezcla ponderada por luminancia: evita el doble expuesto plano.
    float la = lumaOf(a);
    float lb = lumaOf(b);
    m = clamp(m + (lb - la) * 0.12, 0.0, 1.0);
  }
  m = smoothstep(0.0, 1.0, m);
  outColor = vec4(mix(a, b, m), 1.0);
}
`,ar=`${me}
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
`,rr=`${me}
in vec2 vUv;
uniform sampler2D uSource;
out vec4 outColor;
void main() {
  outColor = texture(uSource, vUv);
}
`,ir=`${me}
${Yt}
${qa}

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
`;var or=Le,sr=`${me}

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

${Ye}

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
`;var ca={speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},power:{type:"number",default:7.6,min:3,max:12,label:"Potencia",group:"Forma"},warp:{type:"number",default:.35,min:0,max:1.5,label:"Warp",group:"Forma"},detail:{type:"number",default:.55,min:0,max:1,label:"Detalle",group:"Forma"},hue:{type:"number",default:.58,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.85,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.95,min:.2,max:4,label:"Glow",group:"Apariencia"},bloom:{type:"number",default:.58,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.88,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:3,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:5,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},sa=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0});function la(e){let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]}function lr(e,t){return[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]]}var Jt=class extends ke{constructor(t,n={}){super(n),this.renderer=t,this.gl=t.gl,this.sceneFormat=Se(this.gl,"rgba16f")?"rgba16f":"rgba8",this.sceneTarget=new ce(this.gl,{width:t.width,height:t.height,format:this.sceneFormat}),this.quad=nt(this.gl),this.program=new oe(this.gl,or,sr,"math:raymarch"),this.lastAudio=sa,this.motion=new Ge,this.signals={body:0,mid:0,high:0,rms:0,kickPos:0,kickFlash:0},this.camera={pos:[0,0,3.4],right:[1,0,0],up:[0,1,0],forward:[0,0,-1]}}setAudioFeatures(t){this.lastAudio=t||sa}update(t,n=sa){super.update(t,n),this.lastAudio=n;let a=this.params,r=this.time,o=this.renderer.pointer||{x:0,y:0},s=a.audio>0&&n.enabled?a.audio:0,i=J(),c=i.effects?.mathematicalForms||{},l=this.motion.update(t,n,i,"mathematicalForms",s),f=(n.bassBody||0)*s*Number(c.body??1),m=(n.midFlow||0)*s*Number(c.mid??1),h=(n.highShimmer||0)*s*Number(c.high??1),v=(n.rms||0)*s,u=l.kickPos*Number(c.kick??1);this.signals={body:f,mid:m,high:h,rms:v,kickPos:u,kickFlash:n.kickFlash||0};let g=3.35-u*Number(i.kick?.cameraDolly??.03)*8-f*.5+Math.sin(r*.1)*.16,y=r*.12*a.speed+l.flowPhase*.16+o.x*.25+(a.seed|0)*.013,p=Math.sin(r*.09)*1.6+o.y*.9+m*.4,d=[Math.cos(y)*g,p,Math.sin(y)*g],E=la([-d[0],-d[1]*.55,-d[2]]),M=la(lr(E,[0,1,0])),S=la(lr(M,E)),w=m*.42+(n.kickFlash||0)*.12,A=Math.cos(w),_=Math.sin(w),N=[M[0]*A+S[0]*_,M[1]*A+S[1]*_,M[2]*A+S[2]*_],R=[S[0]*A-M[0]*_,S[1]*A-M[1]*_,S[2]*A-M[2]*_];this.camera={pos:d,right:N,up:R,forward:E}}getDetail(){let n=this.renderer.quality.name==="lite"?-16:0,a=Math.round(56+this.params.detail*64)+n,r=4+Math.round(this.params.detail*2);return{steps:Math.max(32,Math.min(120,a)),iterations:Math.max(3,Math.min(6,r))}}render(){let t=this.gl,n=this.params,a=this.signals,r=this.getDetail();this.sceneTarget.bind(),t.disable(t.BLEND),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE);let o=this.camera;this.program.use().set("uResolution",[this.sceneTarget.width,this.sceneTarget.height]).set("uTime",this.time).set("uSpeed",n.speed).set("uPower",n.power).set("uWarp",n.warp).set("uHue",n.hue).set("uSaturation",n.saturation).set("uGlow",n.glow).set("uSeed",(n.seed|0)%1e3*.01).set("uSteps",r.steps).set("uIterations",r.iterations).set("uCamPos",o.pos).set("uCamRight",o.right).set("uCamUp",o.up).set("uCamForward",o.forward).set("uTanHalfFov",Math.tan(48*Math.PI/360)).set("uAudioBass",a.body).set("uAudioMid",a.mid).set("uAudioHigh",a.high).set("uAudioRms",a.rms).set("uKick",a.kickPos).set("uAudioAmount",1),this.quad.draw(),t.bindFramebuffer(t.FRAMEBUFFER,null)}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.42,bloomKnee:.25,exposure:t.exposure,vignette:.55,grain:.02,aberration:.016,time:this.time}}getSceneTarget(){return this.sceneTarget}onResize(t,n){this.sceneTarget&&this.sceneTarget.resize(t,n)}dispose(){this.program&&this.program.dispose(),this.quad&&this.quad.dispose(),this.sceneTarget&&this.sceneTarget.dispose(),this.program=null,this.quad=null,this.sceneTarget=null}};Oe(Jt,"schema",ca);var cr=Le,ur=`${me}
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

${at}
${Ye}

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
`;var ma={speed:{type:"number",default:1,min:.1,max:3,label:"Velocidad",group:"Movimiento"},decay:{type:"number",default:.93,min:.7,max:.998,label:"Persistencia",group:"Forma"},zoom:{type:"number",default:.55,min:0,max:1,label:"Zoom",group:"Forma"},rotation:{type:"number",default:.45,min:-1,max:1,label:"Rotaci\xF3n",group:"Forma"},warp:{type:"number",default:.55,min:0,max:1.5,label:"Distorsi\xF3n",group:"Forma"},density:{type:"number",default:.3,min:.05,max:1.5,label:"Densidad",group:"Forma"},hue:{type:"number",default:.62,min:0,max:1,label:"Tono",group:"Apariencia"},saturation:{type:"number",default:.9,min:0,max:1,label:"Saturaci\xF3n",group:"Apariencia"},glow:{type:"number",default:.85,min:.2,max:4,label:"Glow",group:"Apariencia"},bloom:{type:"number",default:.7,min:0,max:3,label:"Bloom",group:"Apariencia"},exposure:{type:"number",default:.95,min:.2,max:3,label:"Exposici\xF3n",group:"Apariencia"},audio:{type:"number",default:1,min:0,max:1,label:"Audio",group:"Comportamiento"},variant:{type:"int",default:0,min:0,max:3,label:"Variante",group:"Comportamiento"},seed:{type:"int",default:9,min:0,max:2147483647,label:"Seed",group:"Comportamiento"}},ua=Object.freeze({enabled:!1,level:0,rms:0,bass:0,mid:0,high:0,beat:0,energy:0}),Zt=class extends ke{constructor(t,n={}){super(n),this.renderer=t,this.gl=t.gl;let a=Se(this.gl,"rgba16f")?"rgba16f":"rgba8";this.format=a,this.targets=[new ce(this.gl,{width:t.width,height:t.height,format:a}),new ce(this.gl,{width:t.width,height:t.height,format:a})],this.index=0,this.quad=nt(this.gl),this.program=new oe(this.gl,cr,ur,"temporal:feedback"),this.lastAudio=ua,this.motion=new Ge,this.signals={body:0,mid:0,high:0,rms:0,kickPos:0,kickFlash:0},this._clearTargets()}_clearTargets(){let t=this.gl;for(let n of this.targets)n.bind(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);t.bindFramebuffer(t.FRAMEBUFFER,null)}setAudioFeatures(t){this.lastAudio=t||ua}update(t,n=ua){super.update(t,n),this.lastAudio=n,this.dt=t;let a=this.params,r=a.audio>0&&n.enabled?a.audio:0,o=J(),s=o.effects?.temporalVeil||{},i=this.motion.update(t,n,o,"temporalVeil",r);this.signals={body:(n.bassBody||0)*r*Number(s.body??1),mid:(n.midFlow||0)*r*Number(s.mid??1),high:(n.highShimmer||0)*r*Number(s.high??1),rms:(n.rms||0)*r,kickPos:i.kickPos*Number(s.kick??1),kickFlash:(n.kickFlash||0)*Number(s.kick??1)}}render(){let t=this.gl,n=this.params,a=this.signals,r=this.targets[this.index],o=this.targets[1-this.index];o.bind(),t.disable(t.BLEND),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),this.program.use().set("uPrev",0).set("uResolution",[o.width,o.height]).set("uTime",this.time).set("uDt",Math.min(.05,this.dt||1/60)).set("uDecay",n.decay).set("uZoom",n.zoom*n.speed*(1+a.body*.7+a.kickPos*.5)).set("uRotation",n.rotation*n.speed*(1+a.mid*.7+a.kickFlash*.2)).set("uWarp",n.warp).set("uDensity",n.density*(1+a.body*.4+a.kickPos*.3)).set("uHue",n.hue).set("uSaturation",n.saturation).set("uGlow",n.glow).set("uSeed",(n.seed|0)%1e3).set("uAudioBass",a.body).set("uAudioMid",a.mid).set("uAudioHigh",a.high).set("uAudioRms",a.rms).set("uKick",a.kickPos).set("uAudioAmount",1),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,r.texture),this.quad.draw(),t.bindFramebuffer(t.FRAMEBUFFER,null),this.index=1-this.index}getSceneTarget(){return this.targets[this.index]}getPostParams(){let t=this.params;return{bloomStrength:t.bloom,bloomThreshold:.34,bloomKnee:.24,exposure:t.exposure,vignette:.62,grain:.018,aberration:.008,time:this.time}}onResize(t,n){for(let a of this.targets)a.resize(t,n);this._clearTargets()}dispose(){this.program&&this.program.dispose(),this.quad&&this.quad.dispose();for(let t of this.targets)t.dispose();this.program=null,this.quad=null,this.targets=[]}};Oe(Zt,"schema",ma);function Oi(e,t,n,a){e.fillStyle="#04060a",e.fillRect(0,0,t,n);let r=t/2,o=n/2,s=Math.min(t,n)*.33,i=e.createRadialGradient(r,o,s*.1,r,o,s*1.7);i.addColorStop(0,"rgba(90, 190, 255, 0.30)"),i.addColorStop(1,"rgba(10, 20, 40, 0)"),e.fillStyle=i,e.fillRect(0,0,t,n),e.globalCompositeOperation="lighter";let c=56;for(let l=0;l<c;l++){let m=l/c*Math.PI*2,h=Math.sin(m*3+a*1.4)*.18+Math.sin(m*5-a)*.06,v=s*(.85+h),u=r+Math.cos(m)*v,b=o+Math.sin(m)*v*.8+Math.sin(m*2+a*1.1)*s*.18,g=190+Math.sin(m+a)*26,y=1.4+(Math.sin(m*4+a*2)*.5+.5)*2.2;e.fillStyle=`hsla(${g}, 90%, 68%, 0.55)`,e.beginPath(),e.arc(u,b,y,0,Math.PI*2),e.fill()}e.globalCompositeOperation="source-over"}function zi(e,t,n,a){e.fillStyle="#04060a",e.fillRect(0,0,t,n);let r=t/2,o=n/2,s=Math.min(t,n)*.115;e.globalCompositeOperation="lighter";for(let i=0;i<3;i++){e.beginPath();for(let c=0;c<=180;c++){let l=c/180*Math.PI*2,f=1+Math.sin(l*6+a*1.3+i)*.08,m=r+(Math.sin(l)+2*Math.sin(2*l))*s*.62*f,h=o+(Math.cos(l)-2*Math.cos(2*l))*s*.62*f;c===0?e.moveTo(m,h):e.lineTo(m,h)}e.strokeStyle=`hsla(${205+i*18}, 85%, ${60+i*8}%, ${.5-i*.12})`,e.lineWidth=1.2+i*.8,e.stroke()}e.globalCompositeOperation="source-over"}function Ui(e,t,n,a){e.fillStyle="#05040a",e.fillRect(0,0,t,n);let r=t/2,o=n/2,s=Math.min(t,n)*.42;e.globalCompositeOperation="lighter";for(let c=0;c<64;c++){let l=c/64*Math.PI*2+a*.15,f=.55+.45*Math.abs(Math.sin(l*4+a)),m=s*f*(.75+.25*Math.sin(l*7-a)),h=r+Math.cos(l)*m,v=o+Math.sin(l)*m*.9;e.fillStyle=`hsla(${250+Math.cos(l*3)*30}, 85%, 62%, 0.45)`,e.beginPath(),e.arc(h,v,1.6+f*2,0,Math.PI*2),e.fill()}let i=e.createRadialGradient(r,o,0,r,o,s);i.addColorStop(0,"rgba(140,120,255,0.28)"),i.addColorStop(1,"rgba(20,10,40,0)"),e.fillStyle=i,e.fillRect(0,0,t,n),e.globalCompositeOperation="source-over"}function Gi(e,t,n,a){e.fillStyle="#030408",e.fillRect(0,0,t,n);let r=t/2,o=n/2;e.globalCompositeOperation="lighter";for(let s=0;s<12;s++){let i=s/12*Math.min(t,n)*.46;e.beginPath(),e.arc(r,o,i,a*.5+s*.5,a*.5+s*.5+2.2),e.strokeStyle=`hsla(${190+s*9}, 85%, 60%, ${.55-s*.03})`,e.lineWidth=1+s%3*.7,e.stroke()}e.globalCompositeOperation="source-over"}var Lt={fluidFields:{label:"Fluid Fields",family:"fluid",schema:ia,create:(e,t)=>new Xt(e,t),preview:Oi},organicStructures:{label:"Organic Structures",family:"organic",schema:oa,create:(e,t)=>new Qt(e,t),preview:zi},mathematicalForms:{label:"Mathematical Forms",family:"mathematical",schema:ca,create:(e,t)=>new Jt(e,t),preview:Ui},temporalVeil:{label:"Temporal Veil",family:"temporal",schema:ma,create:(e,t)=>new Zt(e,t),preview:Gi}};function Y(e){return Object.prototype.hasOwnProperty.call(Lt,e)}function mr(e,t,n){let a=Lt[e];if(!a)throw new Error(`Efecto GPU desconocido: ${e}`);return a.create(t,n)}function dr({targetFps:e=60,fpsCounter:t,onFrame:n}){let a=0,r=0,o=1e3/e,s=!1;function i(c){if(!s)return;let l=document.visibilityState==="visible",f=l?o:200,m=0;if(r>0&&(m=c-r,t&&t.tick(m)),r=c,l){bn(m>0?m/1e3:1/60);try{n({now:c,fpsCounter:t,audio:Z()})}catch(h){console.error("renderLoop frame error:",h)}}a=requestAnimationFrame(i)}return{start(){s||(s=!0,r=0,a=requestAnimationFrame(i))},stop(){s=!1,a&&cancelAnimationFrame(a),a=0},isRunning(){return s}}}function Mn(){let e=new Float32Array(60),t=0,n=0,a=0,r=0;return{tick(o){r=o,a=o>0?1e3/o:0,e[t]=o,t=(t+1)%60,n<60&&n++},getInstant(){return a},getFrameMs(){return r},getAvg(){if(n===0)return 0;let o=0;for(let i=0;i<n;i++)o+=e[i];let s=o/n;return s>0?1e3/s:0},getLow1Percent(){if(n===0)return 0;let o=Array.from(e.subarray(0,n)).sort((c,l)=>l-c),s=Math.max(0,Math.floor(o.length*.01)-1),i=o[s];return i>0?1e3/i:0},reset(){t=0,n=0,a=0,r=0}}}var Vi=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,An=null;function da(){if(An)return An;let e=navigator.userAgent||"",t=Vi.test(e),n="ontouchstart"in window&&window.innerWidth<=1024,a=navigator.hardwareConcurrency||4,r=navigator.deviceMemory||null,o=navigator.connection?.saveData||!1,s=t||n,i;return o?i=!0:typeof r=="number"?i=r<4||a<4:i=a<4||s,An={hardwareConcurrency:a,deviceMemory:r,isMobile:s,isLiteRecommended:i,saveData:o,dpr:Math.min(window.devicePixelRatio||1,s?1:1.5)},An}function _e(){try{let e=localStorage.getItem("umbral-vision:lite-mode");if(e==="on")return!0;if(e==="off")return!1}catch{}return da().isLiteRecommended}function fr(e){try{localStorage.setItem("umbral-vision:lite-mode",e?"on":"off")}catch{}try{window.dispatchEvent(new CustomEvent("uv:lite-mode",{detail:{lite:!!e}}))}catch{}}var hr={lite:{name:"lite",particleSize:128,maxDpr:1,renderScale:.7,minRenderScale:.5,bloomMips:1,bloomQuality:5,simSteps:1,trailLength:1,targetFrameMs:22,minFrameMs:12},high:{name:"high",particleSize:256,maxDpr:1.5,renderScale:.9,minRenderScale:.55,bloomMips:2,bloomQuality:9,simSteps:1,trailLength:1.35,targetFrameMs:19,minFrameMs:11},ultra:{name:"ultra",particleSize:512,maxDpr:2,renderScale:1,minRenderScale:.6,bloomMips:3,bloomQuality:11,simSteps:1,trailLength:1.6,targetFrameMs:15,minFrameMs:8}};function fa(e){return hr[e]||hr.high}function ha(e){let t=e.renderScale,n=0,a=0;return{get scale(){return t},reset(){t=e.renderScale,n=0,a=0},sample(r){if(!Number.isFinite(r)||r<=0)return!1;r>e.targetFrameMs?(n++,a=0):r<e.minFrameMs?(a++,n=0):(n=0,a=0);let o=t;return n>=45&&t>e.minRenderScale?(o=Math.max(e.minRenderScale,t-.1),n=0):a>=180&&t<1&&(o=Math.min(1,t+.05),a=0),o!==t?(t=o,!0):!1}}}var Fn=class{constructor(t={}){this.container=t.container||null,this.quality=fa(t.quality||"high"),this.adaptive=ha(this.quality),this.onScaleChange=t.onScaleChange||null,this.pointer={x:0,y:0},this.frameMs=0,this.fps=0,this.cpuMs=0,this.contextLost=!1,this.disposed=!1,this.canvas=t.canvas||document.createElement("canvas"),this.canvas.className="uv-engine-canvas",this.canvas.style.position="absolute",this.canvas.style.inset="0",this.canvas.style.width="100%",this.canvas.style.height="100%",this.canvas.style.display="block",this.canvas.style.pointerEvents="none",this.canvas.style.zIndex="0",this.canvas.setAttribute("aria-hidden","true"),this.container&&this.canvas.parentNode!==this.container&&this.container.appendChild(this.canvas);let n=this.canvas.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!0,desynchronized:!0});if(!n)throw this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas),new Error("WebGL 2 no est\xE1 disponible en este navegador");this.gl=n,this.refreshExtensions(),n.disable(n.DEPTH_TEST),n.disable(n.CULL_FACE),n.clearColor(0,0,0,1),this._onResize=()=>this.resize(),this._onPointer=a=>{this.pointer.x=a.clientX/Math.max(1,window.innerWidth)*2-1,this.pointer.y=-(a.clientY/Math.max(1,window.innerHeight)*2-1)},window.addEventListener("resize",this._onResize),window.addEventListener("pointermove",this._onPointer,{passive:!0}),this._lastFrameTime=0,this.resize()}refreshExtensions(){let t=this.gl;t&&(this.extFloat=t.getExtension("EXT_color_buffer_float"),this.extHalfFloat=t.getExtension("EXT_color_buffer_half_float"),this.extFloatLinear=t.getExtension("OES_texture_float_linear"),t.getExtension("OES_texture_half_float_linear"))}get width(){return this.canvas.width}get height(){return this.canvas.height}get output(){return{width:this.canvas.width,height:this.canvas.height}}get aspect(){return this.canvas.width/Math.max(1,this.canvas.height)}_cssSize(){if(this.container){let t=this.container.getBoundingClientRect();if(t.width>0&&t.height>0)return{width:t.width,height:t.height};if(this.container.clientWidth>0&&this.container.clientHeight>0)return{width:this.container.clientWidth,height:this.container.clientHeight}}return{width:window.innerWidth||1,height:window.innerHeight||1}}resize(){if(this.disposed)return!1;let{width:t,height:n}=this._cssSize(),r=Math.min(window.devicePixelRatio||1,this.quality.maxDpr)*this.adaptive.scale,o=Math.max(2,Math.round(t*r)),s=Math.max(2,Math.round(n*r));return this.cssWidth=t,this.cssHeight=n,o===this.canvas.width&&s===this.canvas.height?!1:(this.canvas.width=o,this.canvas.height=s,this.gl.viewport(0,0,o,s),this.onScaleChange&&this.onScaleChange(o,s),!0)}setQuality(t){let n=fa(t);return n.name===this.quality.name?!1:(this.quality=n,this.adaptive=ha(n),this.resize(),!0)}sampleFrame(t){return!Number.isFinite(t)||t<=0?!1:(this.frameMs=this.frameMs===0?t:this.frameMs*.9+t*.1,this.fps=1e3/Math.max(1,this.frameMs),this.adaptive.sample(t)?this.resize():!1)}beginFrame(){let t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),t.clear(t.COLOR_BUFFER_BIT)}getStats(){return{fps:Math.round(this.fps*10)/10,frameMs:Math.round(this.frameMs*100)/100,cpuMs:Math.round(this.cpuMs*100)/100,width:this.canvas.width,height:this.canvas.height,cssWidth:this.cssWidth,cssHeight:this.cssHeight,scale:Math.round(this.adaptive.scale*100)/100,quality:this.quality.name}}dispose(){if(this.disposed)return;this.disposed=!0,window.removeEventListener("resize",this._onResize),window.removeEventListener("pointermove",this._onPointer),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);let t=this.gl.getExtension("WEBGL_lose_context");t&&t.loseContext(),this.gl=null}};var pr={1:[1,0,0],2:[.62,.38,0],3:[.5,.3,.2]},Tn=class{constructor(t,n,a={}){this.gl=t,this.quad=n,this.mips=Math.max(1,Math.min(3,a.mips||2)),this.format=a.hdr?"rgba16f":"rgba8",this.bloomQuality=a.bloomQuality||9,this.bright=new oe(t,Le,er,"post:bright"),this.blur=new oe(t,Le,tr,"post:blur"),this.copy=new oe(t,Le,rr,"post:copy"),this.mix=new oe(t,Le,nr,"post:mix"),this.feedback=new oe(t,Le,ar,"post:feedback"),this.composite=new oe(t,Le,ir,"post:composite"),this.levels=[],this.mixTarget=null,this.feedbackTargets=[],this.feedbackIndex=0,this.width=0,this.height=0,this.disposed=!1}resize(t,n){if(t=Math.max(1,t|0),n=Math.max(1,n|0),t===this.width&&n===this.height)return;this.width=t,this.height=n;for(let c of this.levels)c.a.dispose(),c.b.dispose();this.levels=[],this.mixTarget&&this.mixTarget.dispose(),this.mixTarget=new ce(this.gl,{width:t,height:n,format:this.format});for(let c of this.feedbackTargets)c.dispose();let a=Math.max(1,t>>1),r=Math.max(1,n>>1);this.feedbackTargets=[new ce(this.gl,{width:a,height:r,format:this.format}),new ce(this.gl,{width:a,height:r,format:this.format})],this.feedbackIndex=0;let o=this.gl;for(let c of this.feedbackTargets)c.bind(),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT);o.bindFramebuffer(o.FRAMEBUFFER,null);let s=Math.max(1,t>>1),i=Math.max(1,n>>1);for(let c=0;c<this.mips;c++)this.levels.push({a:new ce(this.gl,{width:s,height:i,format:this.format}),b:new ce(this.gl,{width:s,height:i,format:this.format}),width:s,height:i}),s=Math.max(1,s>>1),i=Math.max(1,i>>1)}render(t,n,a={},r=null,o=1){let s=this.gl;if(this.levels.length===0)return;r&&this.mixTarget&&(this.mixTarget.bind(),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),this.mix.use().set("uSceneA",0).set("uSceneB",1).set("uMix",Math.max(0,Math.min(1,o))).set("uMode",a.transitionType==="luma"?1:0),this._bindTexture(t.texture,0),this._bindTexture(r.texture,1),this.quad.draw(),t=this.mixTarget);let i=Math.max(0,Math.min(1,Number(a.feedback??0)));if(i>0&&this.feedbackTargets.length===2){let v=this.feedbackTargets[this.feedbackIndex],u=this.feedbackTargets[1-this.feedbackIndex];u.bind(),s.clearColor(0,0,0,0),s.clear(s.COLOR_BUFFER_BIT),this.feedback.use().set("uScene",0).set("uPrev",1).set("uResolution",[u.width,u.height]).set("uTime",a.time??0).set("uFeedback",i).set("uDecay",Math.max(.5,Math.min(.999,Number(a.feedbackDecay??.92)))).set("uZoom",Number(a.feedbackZoom??.5)).set("uRotation",Number(a.feedbackRotation??.3)).set("uWarp",Number(a.feedbackWarp??.5)),this._bindTexture(t.texture,0),this._bindTexture(v.texture,1),this.quad.draw(),t=u,this.feedbackIndex=1-this.feedbackIndex}s.disable(s.DEPTH_TEST),s.disable(s.BLEND),s.disable(s.CULL_FACE),this.levels[0].a.bind(),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),this.bright.use().set("uScene",0).set("uThreshold",a.bloomThreshold??.55).set("uKnee",a.bloomKnee??.25).set("uIntensity",1),this._bindTexture(t.texture,0),this.quad.draw();for(let v=0;v<this.levels.length;v++){let u=this.levels[v];if(v>0){let y=this.levels[v-1];u.a.bind(),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),this.copy.use().set("uSource",0),this._bindTexture(y.a.texture,0),this.quad.draw()}let b=1/u.width,g=1/u.height;u.b.bind(),s.clear(s.COLOR_BUFFER_BIT),this.blur.use().set("uSource",0).set("uDirection",[b*1.4,0]).set("uQuality",this.bloomQuality),this._bindTexture(u.a.texture,0),this.quad.draw(),u.a.bind(),s.clear(s.COLOR_BUFFER_BIT),this.blur.use().set("uSource",0).set("uDirection",[0,g*1.4]).set("uQuality",this.bloomQuality),this._bindTexture(u.b.texture,0),this.quad.draw()}s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,n.width,n.height),s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT);let l=pr[this.levels.length]||pr[1],f=this.levels[0]?.a,m=this.levels[1]?.a||f,h=this.levels[2]?.a||m;this.composite.use().set("uScene",0).set("uBloom0",1).set("uBloom1",2).set("uBloom2",3).set("uBloomWeights",l).set("uBloomStrength",a.bloomStrength??.9).set("uExposure",a.exposure??1).set("uVignette",a.vignette??.55).set("uGrain",a.grain??.035).set("uAberration",a.aberration??.012).set("uTime",a.time??0).set("uResolution",[n.width,n.height]),this._bindTexture(t.texture,0),this._bindTexture(f?.texture??null,1),this._bindTexture(m?.texture??null,2),this._bindTexture(h?.texture??null,3),this.quad.draw()}_bindTexture(t,n){let a=this.gl;a.activeTexture(a.TEXTURE0+n),a.bindTexture(a.TEXTURE_2D,t)}dispose(){if(!this.disposed){this.disposed=!0;for(let t of this.levels)t.a.dispose(),t.b.dispose();this.levels=[],this.mixTarget&&this.mixTarget.dispose(),this.mixTarget=null;for(let t of this.feedbackTargets)t.dispose();this.feedbackTargets=[],this.bright.dispose(),this.blur.dispose(),this.copy.dispose(),this.mix.dispose(),this.feedback.dispose(),this.composite.dispose()}}};var xl=Object.freeze(["keep","merge","refactor","retire"]),Rn=Object.freeze({fluidFields:{decision:"keep",family:"fluidFields",variant:"membrane",classic:!1,reason:"T\xE9cnica GPU propia y buena base de variantes."},organicStructures:{decision:"keep",family:"organicStructures",variant:"knot",classic:!1,reason:"Mesh 3D con Fresnel y silueta propia."},mathematicalForms:{decision:"keep",family:"mathematicalForms",variant:"mandelbulb",classic:!1,reason:"Raymarch + SDF con alto techo visual."},temporalVeil:{decision:"refactor",family:"temporalSystems",variant:"veil",classic:!1,reason:"Base del feedback global y de la familia temporal."},tunnel:{decision:"refactor",family:"kineticGeometry",variant:"tunnel",classic:!0,reason:"Concepto de t\xFAnel reutilizable como variante geom\xE9trica."},spiral:{decision:"refactor",family:"kineticGeometry",variant:"spiral",classic:!0,reason:"Espiral cl\xE1sica; variante de geometr\xEDa cin\xE9tica."},mandala:{decision:"refactor",family:"kineticGeometry",variant:"mandala",classic:!0,reason:"Simetr\xEDa radial; variante de geometr\xEDa cin\xE9tica."},particles:{decision:"merge",family:"fluidFields",variant:"swarm",classic:!0,reason:"Se solapa con Fluid Fields; queda como variante y cl\xE1sico."},waves:{decision:"refactor",family:"wavesAndFields",variant:"waves",classic:!0,reason:"Base de la familia de ondas y campos."},fractal:{decision:"refactor",family:"fractalGrowth",variant:"tree",classic:!0,reason:"Recursi\xF3n ramificada; base de crecimiento fractal."},matrix:{decision:"retire",family:"classics",variant:"matrix",classic:!0,reason:"Referencia literal; no es una familia visual."},glitch:{decision:"retire",family:"classics",variant:"glitch",classic:!0,reason:"Su valor es post-proceso/transici\xF3n, no una familia."},melt:{decision:"retire",family:"classics",variant:"melt",classic:!0,reason:"Efecto puntual fuera de la taxonom\xEDa principal."},fractalGlitch:{decision:"merge",family:"fractalGrowth",variant:"glitch",classic:!0,reason:"Duplicaba el fractal con interferencias."},waveGlitch:{decision:"merge",family:"wavesAndFields",variant:"glitch",classic:!0,reason:"Duplicaba las ondas con interferencias."},sacredGeometry:{decision:"merge",family:"kineticGeometry",variant:"sacred",classic:!0,reason:"Casi id\xE9ntico a mandala; variante sagrada."},biomech:{decision:"refactor",family:"organicStructures",variant:"biomech",classic:!0,reason:"Estructura org\xE1nica; variante de Organic Structures."},dune:{decision:"merge",family:"wavesAndFields",variant:"dunes",classic:!0,reason:"Ondas + geometr\xEDa; variante de dunas."},yinYang:{decision:"retire",family:"classics",variant:"yinYang",classic:!0,reason:"S\xEDmbolo \xFAnico, no una familia."}});function V(e,t,n,a=!1){return{label:e,effect:t,structural:n,implemented:a}}var ye=Object.freeze({fluidFields:{id:"fluidFields",label:"Fluid Fields",description:"Tejido de part\xEDculas y membranas vivas.",renderer:"webgl",effect:"fluidFields",defaultVariant:"membrane",variants:{membrane:V("Membrana","fluidFields",{topology:"open-cylinder",folds:3},!0),torus:V("Toro","fluidFields",{topology:"torus",folds:0},!0),ribbon:V("Cinta","fluidFields",{topology:"twisted-ribbon",folds:2},!0),smoke:V("Humo","fluidFields",{topology:"volume",folds:5}),swarm:V("Enjambre","fluidFields",{topology:"free-swarm",folds:0})}},organicStructures:{id:"organicStructures",label:"Organic Structures",description:"Membranas topol\xF3gicas transl\xFAcidas y volumen real.",renderer:"webgl",effect:"organicStructures",defaultVariant:"knot",variants:{knot:V("Nudo","organicStructures",{topology:"torus-knot",shell:"translucent"},!0),cell:V("C\xE9lula","organicStructures",{topology:"cell",shell:"membrane"}),coral:V("Coral","organicStructures",{topology:"coral",shell:"branched"}),biomech:V("Biomech","organicStructures",{topology:"biomech",shell:"segmented"})}},mathematicalForms:{id:"mathematicalForms",label:"Mathematical Forms",description:"Formas matem\xE1ticas volum\xE9tricas por ray marching.",renderer:"webgl",effect:"mathematicalForms",defaultVariant:"mandelbulb",variants:{mandelbulb:V("Mandelbulb","mathematicalForms",{surface:"mandelbulb",symmetry:"radial"},!0),knot:V("Nudo SDF","mathematicalForms",{surface:"torus-knot",symmetry:"none"}),lattice:V("Ret\xEDcula","mathematicalForms",{surface:"lattice",symmetry:"cubic"}),orb:V("Orbe","mathematicalForms",{surface:"sphere",symmetry:"radial"})}},temporalSystems:{id:"temporalSystems",label:"Temporal Systems",description:"Estelas, acumulaci\xF3n y memoria visual.",renderer:"webgl",effect:"temporalVeil",defaultVariant:"veil",variants:{veil:V("Velo","temporalVeil",{feedback:"warp",emitters:"filaments"},!0),echo:V("Eco","temporalVeil",{feedback:"echo",emitters:"rings"}),smear:V("Smear","temporalVeil",{feedback:"directional",emitters:"streaks"}),tunnel:V("T\xFAnel temporal","temporalVeil",{feedback:"zoom",emitters:"tunnel"})}},kineticGeometry:{id:"kineticGeometry",label:"Kinetic Geometry",description:"Geometr\xEDa cin\xE9tica: t\xFAneles, espirales y simetr\xEDas radiales.",renderer:"p5",effect:"tunnel",defaultVariant:"tunnel",variants:{tunnel:V("T\xFAnel","tunnel",{symmetry:"radial",motif:"ellipses"},!0),spiral:V("Espiral","spiral",{symmetry:"spiral",motif:"dots"},!0),mandala:V("M\xE1ndala","mandala",{symmetry:"radial",motif:"petals"},!0),sacred:V("Sagrada","sacredGeometry",{symmetry:"radial",motif:"polygons"},!0),flower:V("Flor","mandala",{symmetry:"radial",motif:"flower"})}},wavesAndFields:{id:"wavesAndFields",label:"Waves & Fields",description:"Ondas, dunas e interferencias sobre el plano.",renderer:"p5",effect:"waves",defaultVariant:"waves",variants:{waves:V("Olas","waves",{field:"sine-lines",motif:"layered"},!0),glitch:V("Olas Glitch","waveGlitch",{field:"sine-distorted",motif:"glitch"},!0),dunes:V("Dunas","dune",{field:"dunes",motif:"sand"},!0),interference:V("Interferencia","waves",{field:"interference",motif:"ripples"})}},fractalGrowth:{id:"fractalGrowth",label:"Fractal Growth",description:"Crecimiento recursivo y estructuras ramificadas.",renderer:"p5",effect:"fractal",defaultVariant:"tree",variants:{tree:V("\xC1rbol","fractal",{growth:"recursive-tree",motif:"branches"},!0),glitch:V("\xC1rbol Glitch","fractalGlitch",{growth:"recursive-tree",motif:"glitch"},!0),coral:V("Coral","biomech",{growth:"radial",motif:"coral"}),tendril:V("Tendril","biomech",{growth:"radial",motif:"tendrils"})}},classics:{id:"classics",label:"Cl\xE1sicos",description:"Efectos hist\xF3ricos conservados fuera de la taxonom\xEDa principal.",renderer:"p5",effect:"matrix",defaultVariant:"matrix",variants:{matrix:V("Matrix","matrix",{motif:"code-rain"},!0),glitch:V("Glitch","glitch",{motif:"scanlines"},!0),melt:V("Melt","melt",{motif:"dripping"},!0),yinYang:V("Yin Yang","yinYang",{motif:"symbol"},!0)}}}),Hi=Object.freeze(Object.keys(ye));function _t(e){return Object.prototype.hasOwnProperty.call(ye,e)?ye[e]:null}function It(e){let t=Rn[e];if(t)return t.family;for(let n of Object.values(ye)){if(n.effect===e)return n.id;for(let a of Object.values(n.variants))if(a.effect===e)return n.id}return null}function Ve(e){let t=Rn[e];return t?t.variant:"default"}function bt(e,t){let n=_t(e);if(!n)return null;let a=t&&n.variants[t]?t:n.defaultVariant,r=n.variants[a];return{family:n,variantId:a,entry:r,effect:r.effect||n.effect}}function Bt({includeClassics:e=!0}={}){return Hi.filter(t=>e||t!=="classics").map(t=>ye[t])}function gr(){return Object.keys(Rn).filter(e=>Rn[e].decision==="retire")}function $i(e,t){let n=_t(e);if(!n)return 0;let r=Object.keys(n.variants).indexOf(t);return r<0?0:r}function qi(e,t){let n=_t(e);if(!n)return null;let a=Object.keys(n.variants);return a[Math.max(0,Math.min(a.length-1,Number(t)|0))]||n.defaultVariant}function vr(e,t){let n=It(e);return n?$i(n,t||Ve(e)):0}function br(e,t){let n=It(e);return n?qi(n,t):Ve(e)}var va=2,ji=Object.freeze(["manual","generated","mutated"]),pa=Object.freeze({mode:"procedural",hue:.56,saturation:.9}),it=Object.freeze({bloom:.85,exposure:.98,vignette:.55,grain:.028,aberration:.014,feedback:.25,feedbackDecay:.92}),Wi=Object.freeze({enabled:!0,rates:{hue:.01,warp:.015}}),ga=0;function ve(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function Ki(e){return e==null?e:JSON.parse(JSON.stringify(e))}function Qe(e,t,n){return Math.min(n,Math.max(t,e))}function Ie(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function ot(){try{let e=globalThis.crypto;if(e&&typeof e.getRandomValues=="function"){let t=new Uint32Array(1);return e.getRandomValues(t),t[0]>>>0}}catch{}return Math.random()*4294967295>>>0}function Nt(e="sc"){ga=(ga+1)%16777215;let t=Math.random().toString(36).slice(2,7);return`${e}_${Date.now().toString(36)}_${ga.toString(36)}_${t}`}function Yi(e){let t=ve(e)?e:{};return{...pa,...t,hue:Qe(Ie(t.hue,pa.hue),0,1),saturation:Qe(Ie(t.saturation,pa.saturation),0,1)}}function Xi(e){let t=ve(e)?e:{},n={...it,...t};return n.bloom=Qe(Ie(n.bloom,it.bloom),0,3),n.exposure=Qe(Ie(n.exposure,it.exposure),.1,3),n.vignette=Qe(Ie(n.vignette,it.vignette),0,1),n.grain=Qe(Ie(n.grain,it.grain),0,.2),n.aberration=Qe(Ie(n.aberration,it.aberration),0,.1),n.feedback=Qe(Ie(n.feedback,it.feedback),0,1),n.feedbackDecay=Qe(Ie(n.feedbackDecay,it.feedbackDecay),.5,.999),n}function Qi(e){let t=ve(e)?e:{},n=ve(t.rates)?t.rates:{};return{enabled:t.enabled!==!1,rates:{...Wi.rates,...n}}}function Ji(e){if(!e||!ve(e))return null;let t=Ie(e.timeOffset,0);return{timeOffset:Math.max(0,t)}}function O(e={}){let t=String(e.effect||"fluidFields"),n=String(e.variant||Ve(t)),a=Math.max(0,Math.floor(Ie(e.seed??e.params?.seed,1)))>>>0,r=new Date().toISOString(),o=ji.includes(e.origin)?e.origin:"manual";return{schemaVersion:va,id:String(e.id||Nt()),name:String(e.name||""),createdAt:e.createdAt||r,updatedAt:e.updatedAt||r,origin:o,parentId:e.parentId?String(e.parentId):null,effect:t,variant:n,seed:a,params:ve(e.params)?Ki(e.params):{},palette:Yi(e.palette),post:Xi(e.post),drift:Qi(e.drift),moment:Ji(e.moment),tags:Array.isArray(e.tags)?e.tags.map(String):[],favorite:!!e.favorite}}function Dt(e){if(!ve(e))throw new Error("Escena inv\xE1lida: se esperaba un objeto");if(e.scene&&ve(e.scene))return Dt(e.scene);if(!e.state&&!e.effect)throw new Error("Escena inv\xE1lida: falta effect");if(e.state&&ve(e.state))return en(e.state,{id:e.id,name:e.name,createdAt:e.createdAt});let t=Number(e.schemaVersion??1);if(t>va)throw new Error(`schemaVersion ${t} no soportada (m\xE1xima ${va})`);return O(e)}function en(e={},t={}){let n=e.effect||"fluidFields",a=ve(e.params)?e.params:{},r=e.variant||ve(e.scene)&&e.scene.variant||Ve(n),o=e.seed??a.seed??(ve(e.scene)?e.scene.seed:void 0),s=ve(e.scene)?e.scene:{};return O({...s,effect:n,variant:r,seed:o,params:a,id:t.id||s.id,name:t.name||s.name,createdAt:t.createdAt||s.createdAt,origin:s.origin||"manual",parentId:s.parentId||null,palette:s.palette,post:s.post,drift:s.drift,moment:s.moment,tags:s.tags,favorite:s.favorite})}function Cn(e){let t=O(e);return{...t.params,seed:t.seed}}function Zi(e){let t=globalThis.TextEncoder,n=new t().encode(e),a="",r=32768;for(let c=0;c<n.length;c+=r)a+=String.fromCharCode(...n.subarray(c,c+r));let o=globalThis.btoa,s=globalThis.Buffer;return(typeof o=="function"?o(a):s.from(a,"binary").toString("base64")).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function eo(e){let t=String(e).replace(/-/g,"+").replace(/_/g,"/"),n=t+"=".repeat((4-t.length%4)%4),a=globalThis.atob,r=globalThis.Buffer,o=typeof a=="function"?a(n):r.from(n,"base64").toString("binary"),s=Uint8Array.from(o,c=>c.charCodeAt(0)),i=globalThis.TextDecoder;return new i().decode(s)}function yr(e){let t=O(e),n={e:t.effect,r:t.variant,s:t.seed,p:t.params,l:t.palette,o:t.post,d:t.drift,m:t.moment,n:t.name||void 0};return Zi(JSON.stringify(n))}function xr(e){if(!e)return null;try{let t=JSON.parse(eo(e));return!ve(t)||!t.e?null:O({effect:t.e,variant:t.r,seed:t.s,params:t.p,palette:t.l,post:t.o,drift:t.d,moment:t.m,name:t.n})}catch{return null}}var ba="fluidFields";function to(e){return!Number.isFinite(e)||e<=0?1/60:Math.min(e,.05)}function no(e){return e&&e!=="auto"?e:_e()?"lite":"high"}function ao(e,t=Math.random){return e==="auto"?1500+t()*2500:Math.max(0,Number(e)||0)}function Er(e={}){let{container:t=null,canvas:n=null,autoStart:a=!0,effectName:r=ba,params:o={},onStats:s=null}=e,i=no(e.quality),c=Mn(),l=null,f=null,m=null,h=null,v=null,u=null,b=null,g=null,y=!1,p=0,d=0,E=!1,M=0,S={},w={};function A(){m&&(m.dispose(),m=null),f||(f=nt(l.gl));let P=Se(l.gl,"rgba16f");m=new Tn(l.gl,f,{mips:l.quality.bloomMips,hdr:P,bloomQuality:l.quality.bloomQuality}),m.resize(l.width,l.height)}function _(P,L){let U=mr(P,l,L||o);return U.initialize(),U.onResize(l.width,l.height),U}function N(P,L){h&&(h.dispose(),h=null),v&&(v.dispose(),v=null),u=null,A(),b=P,h=_(P,L)}function R(P){if(!y)return;if(p=requestAnimationFrame(R),document.visibilityState==="hidden"){d=P;return}let L=d===0?16.67:P-d;d=P,c.tick(L);let U=to(L/1e3);bn(U);let te=Ue(),ue=typeof performance<"u"?performance.now():Date.now();try{T(U,te)}catch(De){console.error("UmbralEngine frame error:",De),D();return}let ne=typeof performance<"u"?performance.now():Date.now();l.cpuMs=ne-ue,l.sampleFrame(L)&&(h.onResize(l.width,l.height),v&&v.onResize(l.width,l.height)),s&&P-M>500&&(M=P,s(pe()))}function T(P,L=Ue()){let U=1;if(v&&u){u.elapsed+=P;let dt=Math.min(1,u.elapsed/Math.max(.001,u.duration));U=dt*dt*(3-2*dt),v.setAudioFeatures?.(L),v.update(P,L),v.render(l)}h.setAudioFeatures?.(L),h.update(P,L),h.render(l);let te=v?v.getSceneTarget():null,ue=h.getSceneTarget(),ne=h.getPostParams(),fe=L.enabled?h.params?.audio??1:0,De=J(),On=Number(De.volume?.exposure??.2),qe=Number(De.volume?.bloom??.15),zt=Number(De.kick?.bloomPulse??.18),be=De.feedback||{},mt=dt=>Math.min(1,Math.max(0,Number(dt)||0)),xe={exposure:(ne.exposure??1)*(1+(L.rms*On+L.kickFlash*On*.6)*fe),bloomStrength:(ne.bloomStrength??1)*(1+(L.high*.3+L.rms*qe+L.kickFlash*zt)*fe),feedback:mt((ne.feedback??be.amount??.25)+((L.bassFast||0)*Number(be.bassZoom??.35)*.22+(L.kickFlash||0)*.12)*fe),feedbackDecay:Math.min(.999,Math.max(.5,(ne.feedbackDecay??be.decay??.92)-(L.kick||0)*Number(be.kickDecay??.035)*fe)),feedbackZoom:Math.max(0,(ne.feedbackZoom??be.zoom??.5)+(L.bassFast||0)*Number(be.bassZoom??.35)*fe),feedbackRotation:(ne.feedbackRotation??be.rotation??.3)+(L.midFast||0)*Number(be.midRotation??.4)*fe,feedbackWarp:Math.max(0,(ne.feedbackWarp??be.warp??.5)+(L.highFast||0)*Number(be.highWarp??.25)*fe)};u?.type==="feedback-smear"&&(xe.feedback=mt(xe.feedback+.18),xe.feedbackDecay=Math.min(.985,xe.feedbackDecay+.025),xe.feedbackZoom=Math.max(0,xe.feedbackZoom+.35)),m.render(te||ue,l.output,{...ne,...xe,...S,transitionType:u?.type||"dissolve",transitionProgress:U},te?ue:null,U),v&&u&&u.elapsed>=u.duration&&(v.dispose(),v=null,u=null)}function C(){E||y||(y=!0,d=0,R(typeof performance<"u"?performance.now():Date.now()))}function D(){y=!1,p&&cancelAnimationFrame(p),p=0}function B(P){return ao(P)}function q(P){let L={...P||{}};return delete L.variant,delete L.seed,L}function H(P=null){let L=h?h.getParameters():{},U=br(b,L.variant??0);return O({...P||g||{},effect:b,variant:U,seed:L.seed??1,params:q(L)})}function K(P,L,U={}){if(!Y(P))throw new Error(`Efecto GPU desconocido: ${P}`);if(P===b)return L&&h.setParameters(L),g=U.scene?O({...U.scene,effect:P}):H(),h;b&&h&&(w[b]=h.getParameters());let te=B(U.transitionMs??0),ue=h,ne=b,fe=_(P,{...o,...w[P]||{},...L||{}});return ue&&te>0?(v&&v.dispose(),v=ue,u={from:ne,to:P,elapsed:0,duration:te/1e3,type:U.transitionType||"dissolve"}):ue&&(ue.dispose(),u=null,v=null),h=fe,b=P,g=U.scene?O({...U.scene,effect:P}):H(),h}function Ne(P,L={}){let U=O(P);if(!Y(U.effect))throw new Error(`La escena usa un efecto no-GPU: ${U.effect}`);let te=vr(U.effect,U.variant);return K(U.effect,{...Cn(U),variant:te},{...L,scene:U}),g=O({...U,effect:U.effect,variant:U.variant,seed:U.seed}),g}function se(){return h?H():null}function re(P){if(!h)return[];let L=h.setParameters(P);return v&&v.setParameters(P),L.length&&(g=H()),L}function le(){return h?h.getParameters():{}}function de(){return h?h.getSchema():{}}function Fe(P){if(!l.setQuality(P))return;let L=h?h.getParameters():o;N(b,L)}function ut(P){Object.assign(S,P||{})}function pe(){return{...l.getStats(),effect:b,particleSize:h?.particleSize||0,particleCount:h?.particleCount||0,activeParticles:h?.particleCount?Math.floor(h.particleCount*(h.params.density??1)):0,transitioning:!!u,transitionFrom:u?.from||null,transitionProgress:u?Math.round(u.elapsed/u.duration*100)/100:1,renderer:"webgl2"}}function $e(){l&&(l.canvas.style.display="block",C())}function Te(){l&&(D(),v&&(v.dispose(),v=null),u=null,l.canvas.style.display="none")}function X(P){P.preventDefault(),D(),l.contextLost=!0,l.canvas.dispatchEvent(new CustomEvent("uv:engine-context-lost"))}function wt(){l.contextLost=!1;let P=b||ba,L=(U=0)=>{if(!E){l.refreshExtensions?.();try{let te=h?h.getParameters():o;N(P,te),l.resize(),h.onResize(l.width,l.height),C()}catch(te){if(U<3){setTimeout(()=>L(U+1),120);return}console.error("No se pudo restaurar el contexto WebGL:",te),window.dispatchEvent(new CustomEvent("uv:engine-restore-failed",{detail:{error:te}}))}}};typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>L(0)):L(0)}function k(){E||(E=!0,D(),Q(),h&&h.dispose(),h=null,g=null,v&&v.dispose(),v=null,m&&m.dispose(),m=null,f&&f.dispose(),f=null,l&&(l.canvas.removeEventListener("webglcontextlost",X),l.canvas.removeEventListener("webglcontextrestored",wt),l.dispose()),l=null)}l=new Fn({container:t,canvas:n,quality:i,onScaleChange:(P,L)=>{m&&m.resize(P,L),h&&h.onResize(P,L),v&&v.onResize(P,L)}}),l.canvas.addEventListener("webglcontextlost",X,!1),l.canvas.addEventListener("webglcontextrestored",wt,!1);function $(P){let L=P?.detail?.lite??_e();Fe(L?"lite":"high")}window.addEventListener("uv:lite-mode",$);let Q=()=>window.removeEventListener("uv:lite-mode",$);try{N(r||ba,o)}catch(P){throw m&&m.dispose(),m=null,f&&f.dispose(),f=null,window.removeEventListener("uv:lite-mode",$),l.dispose(),l=null,P}return a&&C(),{get canvas(){return l?.canvas||null},get gl(){return l?.gl||null},get renderer(){return l},get effect(){return h},get currentEffect(){return b},get currentScene(){return g?O(g):null},get transitioning(){return!!u},get running(){return y},get fpsCounter(){return c},start:C,stop:D,show:$e,hide:Te,renderFrame:T,setEffect:K,setScene:Ne,getScene:se,setParameters:re,getParameters:le,getSchema:de,setQuality:Fe,setPostParams:ut,getStats:pe,dispose:k}}var tn=null,wr=null,yt=null,Be=null,Me=null,nn=null,G=null,Pn=null,an=null,He=null,ya={isLite:!1},st=!1,ro=da();function xa(){ya={...ya,isLite:_e()}}function io(){an&&(an.style.display="none"),Me&&Me.stop()}function Sr(){an&&(an.style.display="block")}function Mr(){return document.querySelector("#generator main")||document.body}function Ea(e,t=null,n={}){if(!Lt[e]){console.warn("Efecto GPU no encontrado:",e);return}if(tn&&io(),Pn=t||Pn||Mr(),G){let a=G.currentEffect===e,r=G.running;G.setEffect(e,void 0,{transitionMs:a||!r?0:n.transitionMs??1e3}),G.show(),nn=G.fpsCounter}else{try{G=Er({container:Pn,effectName:e,quality:_e()?"lite":"auto"})}catch(a){console.error("No se pudo iniciar el motor GPU:",a),G=null,typeof window<"u"&&typeof window.dispatchEvent=="function"&&window.dispatchEvent(new CustomEvent("uv:engine-unavailable",{detail:{effectName:e,error:a}}));return}nn=G.fpsCounter}yt=null,Be=e,He=G?.getScene?.()||O({effect:e,variant:Ve(e)}),st&&G&&G.stop()}function oo(e,t=null){if(typeof p5>"u"){console.warn("p5.js no est\xE1 cargado \u2014 el visualizador requiere p5");return}if(Ke[e]||(console.warn("Efecto no encontrado:",e),e="tunnel"),G&&G.hide(),Sr(),xa(),!tn){tn=new p5(n=>{n.setup=function(){let a=n.createCanvas(window.innerWidth,window.innerHeight),r=Mr();a&&a.elt&&r&&a.elt.parentNode!==r&&r.appendChild(a.elt),an=a&&a.elt?a.elt:null;let o=ro.isMobile?1:1.5;n.pixelDensity(Math.min(window.devicePixelRatio||1,o)),n.colorMode(n.HSB,360,100,100),n.stroke(255),n.noFill()},n.windowResized=function(){n.resizeCanvas(window.innerWidth,window.innerHeight)},xa(),Be=e,He=O({effect:e,variant:Ve(e)}),wr=n,yt=Ke[e](n),nn=Mn(),Me=dr({targetFps:60,fpsCounter:nn,onFrame:()=>{yt&&yt.draw&&yt.draw(ya)}}),Me.start(),st&&Me.stop(),n.draw=function(){}},t||Pn||null);return}Ln(e)}function kn(e="tunnel",t=null){if(Y(e)){Ea(e,t);return}oo(e,t)}function Ln(e){if(Y(e)){Ea(e,null,{transitionMs:"auto",transitionType:"dissolve"});return}if(!Ke[e]){console.warn("Efecto no encontrado:",e);return}if(!tn){kn(e);return}G&&G.hide(),Sr(),xa();let t=wr||tn;Be=e,yt=Ke[e](t),He=O({effect:e,variant:Ve(e)}),Me&&!Me.isRunning()&&!st&&Me.start(),st&&G&&G.stop()}function Ar(e,t={}){let n=O(e);return Y(n.effect)?(Ea(n.effect,null,{transitionMs:t.transitionMs??0,transitionType:t.transitionType}),G&&G.setScene(n,t),Be=n.effect,yt=null,He=n,n):Ke[n.effect]?(Ln(n.effect),Be=n.effect,He=n,n):(console.warn("Efecto no encontrado:",n.effect),null)}function Fr(){return Be?Y(Be)&&G?(He=G.getScene(),He):He&&He.effect===Be?O(He):O({effect:Be,variant:Ve(Be)}):null}function Tr(e){return st=!!e,st?(G&&G.stop(),Me&&Me.stop()):Y(Be)&&G?G.show():Me&&Me.start(),st}function Rr(){return st}function lt(e){return G?G.setParameters(e):[]}function Ot(){return G?G.getParameters():{}}function Cr(){return G?G.getSchema():{}}function Pr(){return G?G.getStats():null}function kr(){return G}function Lr(){return G?G.fpsCounter:nn}var _n=null,_r=!1,In=null;function Ir(e,t,n){if(wa(),!t||t.length===0){console.warn("No hay efectos disponibles para transici\xF3n");return}In=n,_r=!0;let a=0;_n=setInterval(()=>{In&&(a=(a+1)%t.length,In(t[a]))},e)}function wa(){_n&&(clearInterval(_n),_n=null),_r=!1,In=null}var Sa=["1","2","3","4","5","6","7","8","9","0","-","="],so={tunnel:"T\xFAnel",spiral:"Espiral",mandala:"M\xE1ndala",particles:"Part\xEDculas",waves:"Olas",fractal:"Fractal",matrix:"Matrix",glitch:"Glitch",melt:"Melt",fractalGlitch:"Fractal Glitch",waveGlitch:"Wave Glitch",sacredGeometry:"Geometr\xEDa Sagrada",biomech:"Biomech",dune:"Duna",yinYang:"Yin Yang",fluidFields:"Fluid Fields",organicStructures:"Organic Structures",mathematicalForms:"Mathematical Forms",temporalVeil:"Temporal Veil"};function Dr(e,t,n,a={}){if(!e||!t)return null;let r={...so,...a.labels||{}},o=Object.keys(t),s=Array.isArray(a.order)&&a.order.length>0?a.order.filter(b=>o.includes(b)).concat(o.filter(b=>!a.order.includes(b))):o.sort(),i=co(),c=new Map,l=new Set(a.classicNames||[]);for(let b of s){let g=document.createElement("button");if(g.className=`thumb${l.has(b)?" is-classic":""}`,g.type="button",g.setAttribute("aria-label",r[b]||b),g.setAttribute("aria-pressed","false"),g.dataset.effectName=b,l.has(b)){let E=document.createElement("span");E.className="thumb-classic-badge",E.textContent="Cl\xE1sico",g.appendChild(E)}let y=Sa[c.size];if(y){let E=document.createElement("span");E.className="thumb-key",E.textContent=y,g.appendChild(E)}let p=document.createElement("span");if(p.className="thumb-label",p.textContent=r[b]||b,g.appendChild(p),!i){let E=document.createElement("canvas");E.width=80,E.height=80,g.appendChild(E)}g.addEventListener("click",()=>n?.(b)),e.appendChild(g);let d=g.querySelector("canvas");if(c.set(b,{btn:g,preview:d}),d){let E=t[b],M=d.getContext("2d");if(M&&E)try{if(typeof E.preview=="function")E.preview(M,d.width,d.height,.6);else{let S=Br(d),w=E(S);for(let A=0;A<4;A++)w.draw()}}catch{}}}let f=null,m=null,h=b=>{v(),m=b;let{preview:g}=c.get(b)||{},y=t[b];if(!g||!y)return;if(typeof y.preview=="function"){let A=g.getContext("2d"),_=0,N=R=>{if(m===b){try{y.preview(A,g.width,g.height,R/1e3)}catch{return}_=requestAnimationFrame(N)}};_=requestAnimationFrame(N),f=()=>{m=null,cancelAnimationFrame(_)};return}let p=Br(g),d=y(p),E=0,M=1e3/5,S=0,w=A=>{if(m===b){if(A-E>=M){E=A;try{d.draw()}catch{return}}S=requestAnimationFrame(w)}};S=requestAnimationFrame(w),f=()=>{m=null,cancelAnimationFrame(S)}},v=()=>{f&&f(),f=null};return{highlight:b=>{if(c.has(b)){for(let[g,{btn:y}]of c)y.setAttribute("aria-pressed",g===b?"true":"false");h(b)}},stopPreview:v,getNames:()=>s,getKey:b=>{let g=s.indexOf(b);return g>=0&&g<Sa.length?Sa[g]:null},destroy:()=>{v(),e.innerHTML=""}}}function Br(e){let t=e.getContext("2d"),n=e.width,a=e.height,r=()=>{},o={mode:"RGB",maxR:255,maxG:255,maxB:255},s={on:!1,r:0,g:0,b:0,a:255};return{width:n,height:a,background:(i,c)=>{let l=typeof c=="number"?c:255;t.fillStyle=`rgba(0, 0, 0, ${l/255})`,t.fillRect(0,0,n,a)},noFill:()=>{s.on=!1,t.fillStyle="transparent"},fill:(i,c,l,f)=>{s.on=!0,s.r=i,s.g=c,s.b=l,s.a=f??255,t.fillStyle=Nr(o,i,c,l,s.a)},stroke:(i,c,l,f)=>{t.strokeStyle=Nr(o,i,c,l,f??255)},strokeWeight:i=>{t.lineWidth=i},colorMode:(i,c,l,f)=>{o.mode=i,o.maxR=c??255,o.maxG=l??c??255,o.maxB=f??c??255},translate:(i,c)=>{t.translate(i,c)},push:()=>{t.save()},pop:()=>{t.restore()},rotate:i=>{t.rotate(i)},ellipse:(i,c,l,f)=>{t.beginPath(),t.ellipse(i,c,l/2,f/2,0,0,Math.PI*2),s.on&&t.fill(),t.stroke()},line:(i,c,l,f)=>{t.beginPath(),t.moveTo(i,c),t.lineTo(l,f),t.stroke()},point:(i,c)=>{t.fillRect(i,c,1,1)},rect:(i,c,l,f)=>{t.strokeRect(i,c,l,f),s.on&&t.fillRect(i,c,l,f)},beginShape:r,endShape:r,vertex:(i,c)=>{t.lineTo(i,c)},PI:Math.PI,TWO_PI:Math.PI*2,HALF_PI:Math.PI/2,HSB:"HSB",RGB:"RGB",DEGREES:"degrees",RADIANS:"radians",createCanvas:r}}function Nr(e,t,n,a,r){let o=(s,i)=>i===255?s:s/i*255;return e.mode==="HSB"?lo(t,n,a,r):`rgba(${o(t,e.maxR)}, ${o(n,e.maxG)}, ${o(a,e.maxB)}, ${r/255})`}function lo(e,t,n,a){e=(e%360+360)%360/360,t=Math.min(1,Math.max(0,t/100));let r=Math.min(1,Math.max(0,n/100)),o=Math.floor(e*6),s=e*6-o,i=r*(1-t),c=r*(1-s*t),l=r*(1-(1-s)*t),f,m,h;switch(o%6){case 0:f=r,m=l,h=i;break;case 1:f=c,m=r,h=i;break;case 2:f=i,m=r,h=l;break;case 3:f=i,m=c,h=r;break;case 4:f=l,m=i,h=r;break;case 5:f=r,m=i,h=c;break}return`rgba(${Math.round(f*255)}, ${Math.round(m*255)}, ${Math.round(h*255)}, ${a/255})`}function co(){try{let e=navigator.deviceMemory;if(typeof e=="number"&&e<4)return!0;let t=navigator.hardwareConcurrency;if(typeof t=="number"&&t<4)return!0;let n=navigator.connection;if(n&&n.saveData)return!0}catch{}return!1}var Or={play:["M8 5.5v13l11-6.5z"],pause:["M8 5v14","M16 5v14"],prev:["M18 6l-9 6 9 6z","M6 6v12"],next:["M6 6l9 6-9 6z","M18 6v12"],mic:["M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z","M6 11a6 6 0 0 0 12 0","M12 17v4","M9 21h6"],camera:["M4 8h3l2-2h6l2 2h3v11H4z","M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"],share:["M12 16V4","M7 9l5-5 5 5","M5 14v5h14v-5"],bookmark:["M6 4h12v17l-6-4-6 4z"],expand:["M4 9V4h5","M20 9V4h-5","M4 15v5h5","M20 15v5h-5"],collapse:["M9 4v5H4","M15 4v5h5","M9 20v-5H4","M15 20v-5h5"],chevron:["M8 10l4 4 4-4"],sliders:["M4 7h10","M18 7h2","M4 12h4","M12 12h8","M4 17h12","M20 17h0","M16 5v4","M10 10v4","M16 15v4"],cube:["M12 3l8 4.5v9L12 21l-8-4.5v-9z","M12 12l8-4.5","M12 12L4 7.5","M12 12v9"],wave:["M3 14c3 0 3-6 6-6s3 8 6 8 3-6 6-6"],circle:["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],dice:["M5 5h14v14H5z","M9 9h.01","M15 9h.01","M12 12h.01","M9 15h.01","M15 15h.01"],reset:["M4 10a8 8 0 1 1 2 7","M4 4v6h6"],close:["M6 6l12 12","M18 6L6 18"],menu:["M4 7h16","M4 12h16","M4 17h16"],grid:["M4 4h6v6H4z","M14 4h6v6h-6z","M4 14h6v6H4z","M14 14h6v6h-6z"],info:["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M12 11v5","M12 8h.01"],moon:["M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"],trash:["M5 7h14","M9 7V5h6v2","M7 7l1 13h8l1-13"],sparkle:["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"],external:["M14 4h6v6","M20 4l-9 9","M11 5H5v14h14v-6"]};function ae(e,t=16){let n="http://www.w3.org/2000/svg",a=document.createElementNS(n,"svg");a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("width",String(t)),a.setAttribute("height",String(t)),a.setAttribute("fill","none"),a.setAttribute("stroke","currentColor"),a.setAttribute("stroke-width","1.5"),a.setAttribute("stroke-linecap","round"),a.setAttribute("stroke-linejoin","round"),a.setAttribute("aria-hidden","true"),a.classList.add("uv-icon");let r=Or[e]||Or.circle;for(let o of r){let s=document.createElementNS(n,"path");s.setAttribute("d",o),a.appendChild(s)}return a}var uo=new Set(["seed"]),zr=["Forma","Movimiento","Apariencia","Comportamiento"],mo={Forma:"cube",Movimiento:"wave",Apariencia:"circle",Comportamiento:"sliders"};function Ur(e,{onChange:t=null,emptyText:n=null}={}){if(!e)return{refresh(){},destroy(){}};let a=document.createElement("div");a.className="uv-params-list",a.id="effect-params-list";let r=document.createElement("div");r.className="uv-params-actions";let o=document.createElement("button");o.type="button",o.className="uv-btn uv-btn-quiet",o.append(ae("reset",14),document.createTextNode("Reiniciar")),r.appendChild(o),e.append(a,r),e.hidden=!0;let s=null,i={};function c(){t&&t(Ot())}function l(u,b,g){let y=document.createElement("div");y.className="uv-param-row";let p=document.createElement("label");p.textContent=b.label||u,p.htmlFor=`uv-param-${u}`;let d=document.createElement("input");d.type="range",d.id=`uv-param-${u}`,d.min=String(b.min??0),d.max=String(b.max??1),d.step=b.type==="int"?"1":"0.01",d.value=String(g),u==="hue"&&(d.dataset.kind="hue");let E=()=>{let S=Number(d.min)||0,w=Number(d.max)||1,A=w===S?0:(Number(d.value)-S)/(w-S)*100;d.style.setProperty("--fill",`${A}%`)};E();let M=document.createElement("span");return M.className="uv-param-value",M.textContent=b.type==="int"?String(g):Number(g).toFixed(2),d.addEventListener("input",()=>{let S=Number(d.value);lt({[u]:S}),M.textContent=b.type==="int"?String(S):S.toFixed(2),E(),c()}),y.append(p,d,M),y}function f(u,b,g){let y=document.createElement("div");y.className="uv-param-row uv-param-toggle";let p=document.createElement("label");p.textContent=b.label||u,p.htmlFor=`uv-param-${u}`;let d=document.createElement("span");d.className="uv-switch";let E=document.createElement("input");E.type="checkbox",E.id=`uv-param-${u}`,E.checked=!!g;let M=document.createElement("span");return M.className="uv-switch-track",d.append(E,M),E.addEventListener("change",()=>{lt({[u]:E.checked}),c()}),y.append(p,d),y}function m(u,b){let g=document.createElement("div");g.className="uv-param-row uv-param-seed";let y=document.createElement("label");y.textContent=u.label||"Seed";let p=document.createElement("span");p.className="uv-seed-value",p.textContent=String(b);let d=document.createElement("button");return d.type="button",d.className="uv-btn uv-btn-icon",d.title="Nueva seed",d.setAttribute("aria-label","Nueva seed"),d.appendChild(ae("dice",15)),d.addEventListener("click",()=>{let E=Math.floor(Math.random()*1e5);lt({seed:E}),p.textContent=String(E),c()}),g.append(y,p,d),g}function h(u,b,g){let y=document.createElement("section");y.className="uv-param-group";let p=document.createElement("button");p.type="button",p.className="uv-param-group-head",p.setAttribute("aria-expanded","true"),p.append(ae(mo[u]||"sliders",14));let d=document.createElement("span");d.textContent=u,p.appendChild(d),p.appendChild(ae("chevron",14));let E=document.createElement("div");E.className="uv-param-group-body";for(let[M,S]of b)S.type==="boolean"?E.appendChild(f(M,S,g[M]??S.default)):uo.has(M)?E.appendChild(m(S,g[M]??S.default)):E.appendChild(l(M,S,g[M]??S.default));return p.addEventListener("click",()=>{let M=p.getAttribute("aria-expanded")!=="false";p.setAttribute("aria-expanded",String(!M)),E.hidden=M}),y.append(p,E),y}function v(){a.innerHTML="",i=Cr();let u=Ot(),b=Object.entries(i);if(r.hidden=b.length===0,b.length===0){let p=document.createElement("p");p.className="uv-params-empty",p.textContent=n||"Este efecto no expone par\xE1metros en vivo.",a.appendChild(p);return}let g=new Map;for(let[p,d]of b){let E=d.group||"Par\xE1metros";g.has(E)||g.set(E,[]),g.get(E).push([p,d])}let y=[...g.keys()].sort((p,d)=>{let E=zr.indexOf(p),M=zr.indexOf(d);return(E<0?99:E)-(M<0?99:M)});for(let p of y)a.appendChild(h(p,g.get(p),u))}return o.addEventListener("click",()=>{if(!s)return;let u={};for(let[b,g]of Object.entries(i))u[b]=g.default;lt(u),v(),c()}),{refresh(u){if(s=u,!u||!Y(u)){e.hidden=!0,a.innerHTML="",i={};return}e.hidden=!1,v()},getEffectName(){return s},destroy(){e.hidden=!0,a.innerHTML=""}}}var fo=[{label:"Kick",path:"kick.depth",min:0,max:1.5,step:.01,digits:2},{label:"Retumbe",path:"kick.decaySec",min:.4,max:2.5,step:.05,digits:2},{label:"Sensibilidad",path:"kick.sensitivity",min:.2,max:3,step:.05,digits:2},{label:"Torsi\xF3n",path:"midFlow.twist",min:0,max:.6,step:.01,digits:2},{label:"Shimmer",path:"highShimmer.porosity",min:0,max:1.5,step:.01,digits:2},{label:"Volumen",path:"volume.exposure",min:0,max:.8,step:.01,digits:2},{label:"Din\xE1mica",path:"dynamics.autoGain",min:0,max:1,step:.01,digits:2}];function ho(e,t){return t.split(".").reduce((n,a)=>n==null?n:n[a],e)}function Gr(e){if(!e)return{refresh(){}};let t=document.createElement("section");t.className="uv-audio-panel";let n=document.createElement("div");n.className="uv-audio-head",n.append(ae("wave",14));let a=document.createElement("span");a.textContent="Audio reactivo",n.appendChild(a);let r=document.createElement("button");r.type="button",r.className="uv-btn uv-btn-icon",r.title="Reiniciar audio",r.setAttribute("aria-label","Reiniciar audio"),r.appendChild(ae("reset",14)),r.addEventListener("click",()=>{Da(),d()}),n.appendChild(r),t.appendChild(n);let o=document.createElement("div");o.className="uv-audio-body",t.appendChild(o);function s(S,w,A,_){let N=document.createElement("div");N.className="uv-param-row uv-audio-row";let R=document.createElement("label");R.textContent=S;let T=document.createElement("select");T.className="uv-select";for(let[C,D]of w){let B=document.createElement("option");B.value=C,B.textContent=D,C===A&&(B.selected=!0),T.appendChild(B)}return T.addEventListener("change",()=>_(T.value)),N.append(R,T),o.appendChild(N),T}function i(S,w){let A=document.createElement("div");A.className="uv-param-row";let _=document.createElement("label");_.textContent=S.label;let N=document.createElement("input");N.type="range",N.min=String(S.min),N.max=String(S.max),N.step=String(S.step),N.value=String(w);let R=document.createElement("span");R.className="uv-param-value",R.textContent=Number(w).toFixed(S.digits);let T=()=>{let C=(Number(N.value)-S.min)/(S.max-S.min)*100;N.style.setProperty("--fill",`${C}%`)};T(),N.addEventListener("input",()=>{let C=Number(N.value);At(S.path,C),R.textContent=C.toFixed(S.digits),T()}),A.append(_,N,R),o.appendChild(A)}let c=document.createElement("div");c.className="uv-param-row uv-audio-row";let l=document.createElement("label");l.textContent="BPM";let f=document.createElement("span");f.className="uv-bpm-wrap";let m=document.createElement("input");m.type="number",m.min="60",m.max="200",m.step="1",m.className="uv-number";let h=document.createElement("button");h.type="button",h.className="uv-btn uv-btn-quiet",h.textContent="Auto",f.append(m,h),c.append(l,f),o.appendChild(c);function v(){let S=J().sync?.bpm,w=typeof S!="number";m.value=String(w?J().sync?.fallbackBpm??128:S),m.disabled=w,h.textContent=w?"Auto":"Manual",h.classList.toggle("is-on",w),h.setAttribute("aria-pressed",String(w)),h.title=w?"BPM autom\xE1tico \xB7 click para fijar manual":"BPM manual \xB7 click para volver a autom\xE1tico"}m.addEventListener("change",()=>{let S=Math.max(60,Math.min(200,Number(m.value)||128));At("sync.bpm",S),v()}),h.addEventListener("click",()=>{if(typeof J().sync?.bpm=="number")At("sync.bpm","auto");else{let w=Ue().bpm||J().sync?.fallbackBpm||128;At("sync.bpm",Math.round(w))}v()});let u=document.createElement("div");u.className="uv-audio-status";let b=document.createElement("span");b.className="uv-audio-status-text";let g=document.createElement("span");g.className="uv-phase-track";let y=document.createElement("span");y.className="uv-phase-fill",g.appendChild(y);let p=document.createElement("span");p.className="uv-kick-dot",u.append(p,b,g),t.appendChild(u);function d(){o.replaceChildren(),v();let S=J().sync?.mode||"grid";s("Sincron\xEDa",[["grid","Grilla 4/4"],["kick","Kick real"],["off","Off"]],S,w=>At("sync.mode",w)),o.appendChild(c);for(let w of fo)i(w,Number(ho(J(),w.path)??w.min));v()}e.appendChild(t),d();let E=0;function M(){let S=performance.now();if(S-E<120)return;E=S;let w=Ue(),A=w.syncMode==="grid"?"4/4":w.syncMode==="kick"?"kick":"off",_=w.bpm?Math.round(w.bpm):"\u2014",N=Math.round((w.tempoConfidence||0)*100);b.textContent=`${A} \xB7 ${_} BPM \xB7 ${N}%`,y.style.width=`${Math.max(0,Math.min(1,w.beatPhase||0))*100}%`,p.style.transform=`scale(${1+Math.min(1.4,w.kick||0)*.9})`,p.classList.toggle("is-hit",(w.kick||0)>.35)}return{refresh:M,rebuild:d}}var rn=42;function Vr(e){if(!e)return{start(){},stop(){}};let t=156,n=34,a=Math.min(window.devicePixelRatio||1,2);e.width=Math.round(t*a),e.height=Math.round(n*a),e.style.width=`${t}px`,e.style.height=`${n}px`;let r=e.getContext("2d");if(!r)return{start(){},stop(){}};r.scale(a,a);let o=new Float32Array(rn),s=0,i=!1,c=0;function l(m){return m<.3?"187, 140, 255":m<.68?"137, 176, 255":"226, 221, 242"}function f(m){if(!i||(s=requestAnimationFrame(f),m-c<24))return;c=m;let h=Ua(),v=Ue(),u=!!h&&v.enabled,b=t,g=n;r.clearRect(0,0,b,g);let y=1.4,p=(b-y*(rn-1))/rn,d=g-1;for(let A=0;A<rn;A++){let _=A/(rn-1),N=Math.pow(_,1.9),R=h?Math.min(h.length-1,Math.floor(N*h.length*.58)+1):0,T=h?h[R]/255:0;u&&(T=Math.pow(T,.78)),o[A]=Math.max(T,o[A]*.9);let C=Math.max(u?1.2:.8,T*(g-4)),D=A*(p+y),B=l(_);if(r.fillStyle=`rgba(${B}, ${u?.78:.22})`,r.fillRect(D,d-C,p,C),u&&o[A]>.04){let q=d-o[A]*(g-4);r.fillStyle=`rgba(${B}, 0.95)`,r.fillRect(D,Math.max(0,q-1),p,1)}}let E=g-4,M=["187, 140, 255","137, 176, 255","226, 221, 242"],S=[v.bass,v.mid,v.high],w=b/3;for(let A=0;A<3;A++){r.fillStyle="rgba(255, 255, 255, 0.08)",r.fillRect(A*w,E,w-2,2);let _=u?Math.min(1,S[A]/1.2):0;r.fillStyle=`rgba(${M[A]}, ${u?.95:.2})`,r.fillRect(A*w,E,Math.max(0,(w-2)*_),2)}}return{start(){i||(i=!0,c=0,s=requestAnimationFrame(f))},stop(){i=!1,s&&cancelAnimationFrame(s),s=0},destroy(){this.stop(),r.clearRect(0,0,t,n)}}}var Hr="umbral-vision:presets",xt={data:[],warned:!1};function po(){return`p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}function go(e){if(!e||typeof e!="object")return null;let t=e.state&&typeof e.state=="object"?e.state:{},n;try{n=t.scene?Dt(t.scene):en(t,{id:e.id,name:e.name,createdAt:e.createdAt})}catch{return null}let a=e.id||n.id,r=O({...n,id:a,name:e.name||n.name,createdAt:e.createdAt||n.createdAt,updatedAt:n.updatedAt||e.createdAt||new Date().toISOString()});return{...e,id:a,name:e.name||r.name,createdAt:e.createdAt||r.createdAt,state:{...t,effect:t.effect||r.effect,interval:t.interval??null,audioEnabled:!!t.audioEnabled,params:t.params===void 0?null:t.params,scene:r}}}function $r(){return[...Bn()].sort((t,n)=>String(n.createdAt).localeCompare(String(t.createdAt)))}function Ma(e,t){if(!e||!t)return null;let n=String(e).trim();if(!n)return null;let a=Bn(),r=t.presetId||po(),o=t.scene?Dt(t.scene):en(t,{id:r,name:n}),s=O({...o,id:r,name:n,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}),i={id:r,name:n,state:{effect:t.effect||s.effect,interval:t.interval??null,audioEnabled:!!t.audioEnabled,params:t.params===void 0?null:t.params,scene:s},createdAt:s.createdAt},c=a.findIndex(l=>l.id===r);return c>=0?a[c]=i:a.push(i),Ta(a),i}function Aa(e,t,n={}){return t?Ma(e,{effect:t.effect,interval:n.interval??null,audioEnabled:!!n.audioEnabled,params:Cn(t),scene:t,presetId:t.id}):null}function qr(e){let t=Bn(),n=t.findIndex(a=>a.id===e);return n<0?!1:(t.splice(n,1),Ta(t),!0)}function Fa(){return Bn().map(e=>e.state?.scene).filter(Boolean)}function Bn(){let e=[];try{let n=localStorage.getItem(Hr);if(n){let a=JSON.parse(n);Array.isArray(a)&&(e=a)}}catch{return xt.data.slice()}let t=e.map(go).filter(Boolean);try{let n=JSON.stringify(e),a=JSON.stringify(t);e.length&&n!==a&&Ta(t)}catch{}return xt.data=t.slice(),t}function Ta(e){try{localStorage.setItem(Hr,JSON.stringify(e)),xt.data=e.slice(),xt.warned=!1}catch{xt.data=e.slice(),xt.warned||(xt.warned=!0,typeof window<"u"&&window.dispatchEvent(new CustomEvent("uv:toast",{detail:{text:"Los presets no persistir\xE1n al cerrar esta ventana",duration:3500}})))}}var Ra=[{name:"abyss",hue:.56,saturation:.9},{name:"ember",hue:.05,saturation:.95},{name:"acid",hue:.22,saturation:.85},{name:"ultraviolet",hue:.78,saturation:.95},{name:"ice",hue:.48,saturation:.7},{name:"blood",hue:.98,saturation:.9},{name:"sand",hue:.11,saturation:.65}],Ca=Object.freeze({fluidFields:{variants:["membrane","torus","ribbon"],params:{density:{min:.55,max:1,default:.9,sigma:.09},speed:{min:.6,max:1.8,default:1,sigma:.16},amplitude:{min:.35,max:1.1,default:.62,sigma:.14},complexity:{min:.3,max:1,default:.62,sigma:.13},turbulence:{min:.2,max:1.2,default:.55,sigma:.16},hue:{min:0,max:1,default:.56,sigma:.16},saturation:{min:.45,max:1,default:.9,sigma:.1},glow:{min:.4,max:2,default:.68,sigma:.22},particleSize:{min:.7,max:1.8,default:1,sigma:.18},bloom:{min:.3,max:1.8,default:.85,sigma:.22},exposure:{min:.6,max:1.5,default:.98,sigma:.16},audio:{min:.6,max:1,default:1,sigma:.08}}},organicStructures:{variants:["knot"],params:{speed:{min:.6,max:1.8,default:1,sigma:.16},amplitude:{min:.08,max:.6,default:.26,sigma:.09},frequency:{min:.6,max:3,default:1.35,sigma:.35},twist:{min:0,max:1,default:.2,sigma:.2},hue:{min:0,max:1,default:.53,sigma:.16},saturation:{min:.45,max:1,default:.95,sigma:.08},glow:{min:.4,max:2,default:.95,sigma:.24},opacity:{min:.35,max:1,default:.85,sigma:.12},bloom:{min:.3,max:1.8,default:.85,sigma:.22},exposure:{min:.6,max:1.5,default:.95,sigma:.16},audio:{min:.6,max:1,default:1,sigma:.08}}},mathematicalForms:{variants:["mandelbulb"],params:{speed:{min:.5,max:1.8,default:1,sigma:.16},power:{min:4,max:11,default:7.6,sigma:1.1},warp:{min:0,max:1.2,default:.35,sigma:.2},detail:{min:.25,max:.9,default:.55,sigma:.14},hue:{min:0,max:1,default:.58,sigma:.16},saturation:{min:.4,max:1,default:.85,sigma:.1},glow:{min:.4,max:2,default:.95,sigma:.24},bloom:{min:.2,max:1.6,default:.58,sigma:.2},exposure:{min:.55,max:1.4,default:.88,sigma:.15},audio:{min:.6,max:1,default:1,sigma:.08}}},temporalSystems:{variants:["veil"],params:{speed:{min:.5,max:1.8,default:1,sigma:.16},decay:{min:.82,max:.985,default:.93,sigma:.025},zoom:{min:.2,max:.9,default:.55,sigma:.14},rotation:{min:-.8,max:.8,default:.45,sigma:.2},warp:{min:.1,max:1.2,default:.55,sigma:.18},density:{min:.1,max:.9,default:.3,sigma:.12},hue:{min:0,max:1,default:.62,sigma:.16},saturation:{min:.4,max:1,default:.9,sigma:.1},glow:{min:.4,max:2,default:.85,sigma:.22},bloom:{min:.25,max:1.8,default:.7,sigma:.2},exposure:{min:.6,max:1.5,default:.95,sigma:.15},audio:{min:.6,max:1,default:1,sigma:.08}}}}),vo={bloom:{min:.25,max:1.8,default:.8,sigma:.2},exposure:{min:.65,max:1.4,default:.98,sigma:.14},vignette:{min:.25,max:.8,default:.55,sigma:.1},grain:{min:.008,max:.06,default:.028,sigma:.01},aberration:{min:.002,max:.035,default:.014,sigma:.006},feedback:{min:.08,max:.55,default:.25,sigma:.08},feedbackDecay:{min:.86,max:.975,default:.92,sigma:.02}};function Et(e,t,n){return Math.min(n,Math.max(t,e))}function jr(e){let t=0,n=0;for(;t===0;)t=e();for(;n===0;)n=e();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*n)}function Wr(e,t,n=null){let a=Number.isFinite(n)?n:t.default;return e()<.3?t.min+e()*(t.max-t.min):Et(a+jr(e)*t.sigma,t.min,t.max)}function bo(e){let t=Ra[Math.floor(e()*Ra.length)]||Ra[0];return{mode:"named",name:t.name,hue:Et(t.hue+(e()-.5)*.12,0,1),saturation:Et(t.saturation+(e()-.5)*.18,.25,1)}}function yo(e){let t={};for(let[n,a]of Object.entries(vo))t[n]=Wr(e,a);return t}function Pa(e){return e?Object.entries(e.variants).filter(([,t])=>t.implemented!==!1).map(([t])=>t):[]}function xo(e,t){if(t)return _t(t);let a=Bt({includeClassics:!1}).filter(r=>Pa(r).length>0);return a[Math.floor(e()*a.length)]||a[0]||null}function Nn(e={}){let t=Number.isFinite(e.seed)?e.seed>>>0:ot(),n=e.rng||Xe(t),a=xo(n,e.familyId);if(!a)throw new Error("No hay familias disponibles para samplear");let r=Pa(a),o=e.variantId&&a.variants[e.variantId]?e.variantId:r[Math.floor(n()*r.length)]||a.defaultVariant,s=bt(a.id,o),i=Ca[a.id]||{params:{}},c={};for(let[f,m]of Object.entries(i.params||{}))c[f]=Wr(n,m);let l=O({id:Nt("gen"),name:e.name||"",origin:"generated",effect:s.effect,variant:o,seed:t,params:c,palette:bo(n),post:yo(n),drift:{enabled:!0,rates:{hue:.004+n()*.02,warp:.004+n()*.025}},tags:[a.id,o]});return Kr(l)}function Kr(e){let t=O(e),n=Yr(t),a=Ca[n]||{params:{}},r={...t.params};for(let[o,s]of Object.entries(a.params||{}))Number.isFinite(Number(r[o]))?r[o]=Et(Number(r[o]),s.min,s.max):r[o]=s.default;return Number.isFinite(r.saturation)&&r.saturation<.2&&(r.saturation=.35),Number.isFinite(r.exposure)&&Number.isFinite(r.bloom)&&r.exposure*(1+r.bloom)<.55&&(r.exposure=Math.max(.7,r.exposure),r.bloom=Math.max(.35,r.bloom)),O({...t,params:r})}function Yr(e){let t=Bt({includeClassics:!1}).find(n=>n.id===e.familyId||n.effect===e.effect||Object.values(n.variants).some(a=>a.effect===e.effect));return t?t.id:e.tags?.[0]||null}function Dn(e,t={}){let n=O(e),a=Number.isFinite(t.seed)?t.seed>>>0:ot(),r=t.rng||Xe(a),o=Yr(n),s=_t(o),i=Ca[o]||{params:{}},c=Math.max(.05,Math.min(1,Number(t.strength??.35))),l=Object.keys(i.params||{}),f=Array.isArray(t.genes)&&t.genes.length?t.genes.filter(g=>l.includes(g)):[],m=f.length?f:l.filter(()=>r()<.35).slice(0,3),h={...n.params};for(let g of m){let y=i.params[g],p=Number.isFinite(Number(h[g]))?Number(h[g]):y.default;h[g]=Et(p+jr(r)*y.sigma*c,y.min,y.max)}let v=n.variant;if(t.allowVariantChange&&s){let g=Pa(s).filter(y=>y!==n.variant);g.length&&r()<.25&&(v=g[Math.floor(r()*g.length)])}let u=s?bt(s.id,v):null,b={...n.palette,hue:Et(n.palette.hue+(r()-.5)*.08,0,1),saturation:Et(n.palette.saturation+(r()-.5)*.1,.25,1)};return Kr(O({...n,id:Nt("mut"),name:t.name||"",origin:"mutated",parentId:n.id,effect:u?u.effect:n.effect,variant:v,seed:a,params:h,palette:b,tags:[o,v].filter(Boolean)}))}var on=Object.freeze(["curated","generative","hybrid"]);function Xr(e){return on.includes(e)}function Eo({bpm:e,beatPhase:t,beatsPerBar:n=4,phraseBars:a=1}={}){let r=Number(e);if(!Number.isFinite(r)||r<=0)return null;let o=Number.isFinite(Number(t))?Math.min(.999,Math.max(0,Number(t))):0,s=60/r,i=Math.max(1,Number(n)||4)*Math.max(1,Number(a)||1);return(1-o+(i-1))*s}function Qr(e,t=()=>1,n=Math.random){if(!e||e.length===0)return null;let a=0,r=e.map(s=>{let i=Math.max(0,Number(t(s))||0);return a+=i,i});if(a<=0)return e[Math.floor(n()*e.length)];let o=n()*a;for(let s=0;s<e.length;s++)if(o-=r[s],o<=0)return e[s];return e[e.length-1]}function ka(e){return e?.id||null}function Jr(e={}){let t=e.rng||Xe(ot()),n={sampleScene:e.sampler?.sampleScene||Nn,mutateScene:e.sampler?.mutateScene||Dn},a=Xr(e.mode)?e.mode:"hybrid",r=(e.scenes||[]).map(u=>O(u)),o=Math.max(0,Number(e.noRepeatWindow??10)),s={curated:Math.max(0,Number(e.weights?.curated??.3)),generated:Math.max(0,Number(e.weights?.generated??.7))},i=[],c=null;function l(u){let b=ka(u);for(i.push(b);i.length>o;)i.shift()}function f(){let u=new Set(i),b=r.filter(g=>!u.has(ka(g)));return b.length?b:r}function m(){let u=f();return Qr(u,b=>b.favorite?2.5:1,t)}function h(){let u=f(),b=u.length&&t()<.45?Qr(u,g=>g.favorite?2.5:1,t):c;return b&&t()<.65?n.mutateScene(b,{seed:ot()+Math.floor(t()*1e5)>>>0,allowVariantChange:!0}):n.sampleScene({seed:ot()+Math.floor(t()*1e5)>>>0})}function v(){let u=null;if(a==="curated"?u=m():a==="generative"?u=h():u=r.length>0&&t()<s.curated/Math.max(1e-4,s.curated+s.generated)?m():h(),!u){if(a==="curated")return null;u=n.sampleScene({seed:ot()+Math.floor(t()*1e5)>>>0})}return u=O(u),l(u),c=u,u}return{get mode(){return a},setMode(u){return Xr(u)&&(a=u),a},get scenes(){return r.slice()},setScenes(u){r=(u||[]).map(b=>O(b))},addScene(u){r.push(O(u))},get noRepeatWindow(){return o},setNoRepeatWindow(u){for(o=Math.max(0,Number(u)||0);i.length>o;)i.shift()},get weights(){return{...s}},setWeights(u){s={curated:Math.max(0,Number(u?.curated??s.curated)),generated:Math.max(0,Number(u?.generated??s.generated))}},get history(){return i.slice()},get last(){return c},next:v,nextDelay(u=null){return u?Eo({bpm:u.bpm,beatPhase:u.beatPhase,beatsPerBar:4,phraseBars:1}):null},getState(){return{mode:a,scenes:r.length,noRepeatWindow:o,weights:{...s},history:i.slice(),lastId:ka(c)}}}}function Zr({playlist:e,onScene:t,intervalMs:n=1e4,getAudio:a=()=>null,setTimeoutFn:r=typeof setTimeout=="function"?setTimeout:null,clearTimeoutFn:o=typeof clearTimeout=="function"?clearTimeout:null}={}){if(!e||typeof t!="function")throw new Error("createSceneScheduler requiere playlist y onScene");let s=0,i=!1,c=Math.max(0,Number(n)||0);function l(m){!i||!r||(s=r(()=>{if(!i)return;let h=e.next();h&&t(h),f()},Math.max(0,m)))}function f(){if(!i)return;let m=a(),h=m?e.nextDelay(m):null,v=h!=null?h*1e3:c;l(v)}return{start(){i||(i=!0,f())},stop(){i=!1,s&&o&&o(s),s=0},setIntervalMs(m){c=Math.max(0,Number(m)||0),i&&(s&&o&&o(s),f())},get intervalMs(){return c},get running(){return i},tickNow(){let m=e.next();return m&&t(m),m}}}var wo={curated:"Curado",generative:"Generativo",hybrid:"H\xEDbrido"};function j(e,t,n){let a=document.createElement(e);return t&&(a.className=t),n!=null&&(a.textContent=n),a}function ei(e,t={}){if(!e)return{refresh(){},destroy(){},setMode(){},get elements(){return{}}};let n=t.isFamilyAvailable||(()=>!0),a=()=>{let R=Bt({includeClassics:!0}).find(T=>n(T));return R?R.id:"fluidFields"};e.classList.add("uv-scene-controls"),e.replaceChildren();let r=j("div","uv-scene-head");r.append(ae("grid",14)),r.append(j("span",null,"Escena"));let o=j("span","uv-badge uv-badge-classic","Cl\xE1sico");o.hidden=!0,r.append(o),e.append(r);let s=j("label","uv-scene-row");s.append(j("span",null,"Modo"));let i=j("select","uv-select");i.id="uv-playback-mode";for(let R of on){let T=j("option",null,wo[R]||R);T.value=R,i.append(T)}s.append(i),e.append(s);let c=j("label","uv-scene-row");c.append(j("span",null,"Familia"));let l=j("select","uv-select");l.id="uv-family-select";for(let R of Bt({includeClassics:!0})){let T=n(R),C=j("option",null,T?R.label:`${R.label} (requiere WebGL 2)`);C.value=R.id,C.disabled=!T,l.append(C)}c.append(l),e.append(c);let f=j("label","uv-scene-row");f.append(j("span",null,"Variante"));let m=j("select","uv-select");m.id="uv-variant-select",f.append(m),e.append(f);let h=j("div","uv-scene-actions"),v=j("button","uv-btn","Generar");v.type="button",v.id="uv-generate";let u=j("button","uv-btn","Mutar");u.type="button",u.id="uv-mutate";let b=j("button","uv-btn uv-btn-quiet","Guardar escena");b.type="button",b.id="uv-save-scene",h.append(v,u,b),e.append(h);let g=j("p","uv-scene-status","");g.id="uv-scene-status",e.append(g);let y=j("div","uv-scene-history-head");y.append(j("span",null,"Historial"));let p=j("span","uv-scene-history-count","0");y.append(p),e.append(y);let d=j("div","uv-scene-history");d.id="uv-scene-history",e.append(d);let E={},M=-1;function S(R){let T=ye[R];return T?Object.entries(T.variants).map(([C,D])=>({id:C,...D})):[]}function w(R,T){m.replaceChildren();for(let D of S(R)){let B=j("option",null,D.implemented===!1?`${D.label} (pr\xF3x.)`:D.label);B.value=D.id,D.implemented===!1&&(B.disabled=!0),m.append(B)}let C=ye[R]?.defaultVariant;m.value=S(R).some(D=>D.id===T)?T:C}function A(){let R=l.value,T=m.value,C=bt(R,T);return{familyId:R,variantId:T,effect:C?.effect||""}}function _(R){let T=Array.isArray(R)?R:[];if(T.length===M&&T.length>0,M=T.length,p.textContent=String(T.length),d.replaceChildren(),!T.length){d.append(j("p","uv-scene-empty","Todav\xEDa no hay escenas en el historial."));return}for(let C of T.slice(0,12)){let D=j("div","uv-scene-history-row"),B=j("button","uv-scene-history-open");B.type="button",B.dataset.sceneId=C.id;let q=C.scene||{};B.append(j("b",null,q.name||`${q.effect||"escena"} \xB7 ${q.variant||"\u2014"}`));let H=q.origin==="generated"?"generada":q.origin==="mutated"?"mutada":"guardada";B.append(j("span",null,`${H} \xB7 ${new Date(C.at||Date.now()).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}`)),B.addEventListener("click",()=>t.onHistorySelect?.(C.id));let K=j("button","uv-btn uv-btn-icon","");K.type="button",K.title="Promover a preset",K.setAttribute("aria-label","Promover a preset"),K.append(ae("bookmark",14)),K.addEventListener("click",()=>t.onHistorySave?.(C.id)),D.append(B,K),d.append(D)}}function N(R={}){E=R||{};let T=E.scene||null;E.mode&&on.includes(E.mode)&&(i.value=E.mode);let C=E.familyId||(T?It(T.effect):null)||l.value||"fluidFields";(!ye[C]||!n(ye[C]))&&(C=a()),ye[C]&&(l.value=C),w(C,E.variantId||T?.variant||ye[C]?.defaultVariant);let D=C==="classics";o.hidden=!D,g.textContent=T?`${T.effect} \xB7 ${T.variant} \xB7 seed ${T.seed}`:"Sin escena activa",E.history&&_(E.history)}return i.addEventListener("change",()=>t.onModeChange?.(i.value)),l.addEventListener("change",()=>{w(l.value,ye[l.value]?.defaultVariant),o.hidden=l.value!=="classics",t.onSelect?.(A())}),m.addEventListener("change",()=>t.onSelect?.(A())),v.addEventListener("click",()=>t.onGenerate?.()),u.addEventListener("click",()=>t.onMutate?.()),b.addEventListener("click",()=>t.onSave?.()),N(t.getState?.()||{}),{refresh:N,setMode(R){on.includes(R)&&(i.value=R)},renderHistory:_,getSelection:A,get elements(){return{root:e,modeSelect:i,familySelect:l,variantSelect:m,generateBtn:v,mutateBtn:u,saveBtn:b,status:g,historyList:d,classicBadge:o}},destroy(){e.replaceChildren(),e.classList.remove("uv-scene-controls")}}}var So="umbral-vision:scene-history";function Mo(e){try{if(typeof localStorage>"u")return[];let t=localStorage.getItem(e);if(!t)return[];let n=JSON.parse(t);return Array.isArray(n)?n:[]}catch{return[]}}function Ao(e,t){try{return typeof localStorage>"u"?!1:(localStorage.setItem(e,JSON.stringify(t)),!0)}catch{return!1}}function ti(e={}){let t=Math.max(1,Number(e.limit??30)),n=e.storageKey||So,a=e.persist!==!1,r=e.thumbnailStore||null,o=[];a&&(o=Mo(n).map(p=>{try{let d=Dt(p.scene||p);return{id:p.id||d.id,scene:d,at:p.at||Date.now(),hasThumbnail:!!p.hasThumbnail}}catch{return null}}).filter(Boolean).slice(0,t));function s(){a&&Ao(n,o.map(y=>({id:y.id,scene:y.scene,at:y.at,hasThumbnail:!!y.hasThumbnail})))}function i(){o.length>t&&(o=o.slice(0,t))}function c({withThumbnails:y=!1}={}){return o.map(p=>({id:p.id,scene:O(p.scene),at:p.at,hasThumbnail:!!p.hasThumbnail,thumbnail:y?p.thumbnail||null:void 0}))}function l(y){let p=o.find(d=>d.id===y);return p?{...p,scene:O(p.scene)}:null}function f(y,{thumbnail:p=null,at:d=Date.now()}={}){let E=O(y),M={id:E.id||Nt("hist"),scene:E,at:d,hasThumbnail:!!p,thumbnail:p};return o.unshift(M),i(),s(),p&&r&&Promise.resolve(r.put(M.id,p,{sceneId:M.id})).catch(()=>{}),{...M,scene:O(M.scene)}}let m=f;async function h(y){let p=o.find(d=>d.id===y);if(p?.thumbnail)return p.thumbnail;if(!r)return null;try{return await r.get(y)}catch{return null}}function v(y){let p=o.findIndex(d=>d.id===y);return p<0?!1:(o.splice(p,1),s(),r&&Promise.resolve(r.delete(y)).catch(()=>{}),!0)}function u(){o=[],s(),r&&Promise.resolve(r.clear()).catch(()=>{})}function b(y,p){let d=o.find(M=>M.id===y);if(!d)return null;let E=String(p||"").trim();return O({...d.scene,name:E||d.scene.name,updatedAt:new Date().toISOString()})}function g(){return{limit:t,entries:o.length,withThumbnail:o.filter(y=>y.hasThumbnail).length}}return{push:f,capture:m,list:c,get:l,getThumbnail:h,remove:v,clear:u,promote:b,stats:g,get limit(){return t}}}var Fo="umbral-vision";var Ae="thumbnails";function ni(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error||new Error("IndexedDB request failed"))})}function sn(e){return new Promise((t,n)=>{e.oncomplete=()=>t(),e.onerror=()=>n(e.error||new Error("IndexedDB transaction failed")),e.onabort=()=>n(e.error||new Error("IndexedDB transaction aborted"))})}function To(e){return e==null?0:typeof e=="string"?e.length*2:e.size!=null?Number(e.size)||0:e.byteLength!=null&&Number(e.byteLength)||0}function ai(e={}){let t=e.indexedDB!==void 0?e.indexedDB:globalThis.indexedDB||null,n=Math.max(0,Number(e.maxBytes??20*1024*1024)),a=Math.max(1,Number(e.maxEntries??120)),r=new Map,o=null,s=!1,i=!!t;async function c(){if(s)return o;if(s=!0,!t)return null;try{return o=await new Promise((y,p)=>{let d=t.open(Fo,1);d.onupgradeneeded=()=>{let E=d.result;E.objectStoreNames.contains(Ae)||E.createObjectStore(Ae,{keyPath:"key"}).createIndex("at","at")},d.onsuccess=()=>y(d.result),d.onerror=()=>p(d.error||new Error("IndexedDB open failed"))}),o}catch{return i=!1,o=null,null}}async function l(){if(!i)return[...r.values()];let y=await c();if(!y)return[...r.values()];try{let p=y.transaction(Ae,"readonly"),d=p.objectStore(Ae),E=await ni(d.getAll());return await sn(p),Array.isArray(E)?E:[]}catch{return i=!1,[...r.values()]}}async function f(){let y=await l();y.sort((E,M)=>Number(M.at||0)-Number(E.at||0));let p=y.reduce((E,M)=>E+Number(M.size||0),0),d=[];for(let E of y)d.length>=a||p>n&&d.length>0?(p-=Number(E.size||0),await v(E.key)):p>n&&d.length===0?await v(E.key):d.push(E);return d.length}async function m(y,p,d={}){if(!y)return!1;let E=To(p);if(E>n)return!1;let M={key:String(y),data:p,size:E,at:Date.now(),sceneId:d.sceneId||null};if(!i)return r.set(M.key,M),u(),!0;try{let S=await c();if(!S)return r.set(M.key,M),u(),!0;let w=S.transaction(Ae,"readwrite");return w.objectStore(Ae).put(M),await sn(w),await f(),!0}catch{return i=!1,r.set(M.key,M),u(),!0}}async function h(y){if(!y)return null;if(!i)return r.get(String(y))?.data??null;try{let p=await c();if(!p)return r.get(String(y))?.data??null;let d=p.transaction(Ae,"readonly"),E=await ni(d.objectStore(Ae).get(String(y)));return await sn(d),E?.data??null}catch{return i=!1,r.get(String(y))?.data??null}}async function v(y){if(!y)return!1;if(r.delete(String(y)),!i)return!0;try{let p=await c();if(!p)return!0;let d=p.transaction(Ae,"readwrite");return d.objectStore(Ae).delete(String(y)),await sn(d),!0}catch{return!0}}function u(){let y=[...r.values()].sort((d,E)=>d.at-E.at),p=y.reduce((d,E)=>d+E.size,0);for(;y.length>a||p>n&&y.length>0;){let d=y.shift();p-=d.size,r.delete(d.key)}}async function b(){if(r.clear(),!!i)try{let y=await c();if(!y)return;let p=y.transaction(Ae,"readwrite");p.objectStore(Ae).clear(),await sn(p)}catch{}}async function g(){let y=await l();return{available:i,entries:y.length,bytes:y.reduce((p,d)=>p+Number(d.size||0),0),maxBytes:n,maxEntries:a}}return{put:m,get:h,delete:v,clear:b,prune:f,stats:g,open:c,get available(){return i}}}function Ro(){let e=Array.from(document.querySelectorAll("#generator canvas, main canvas, body > canvas")),t=e.find(n=>n.style.display!=="none"&&!n.hidden)||e[0];return!t||typeof t.toBlob!="function"?null:new Promise(n=>{t.toBlob(a=>n(a),"image/png")})}function ri(){return Ro().then(e=>{if(!e)return!1;let t=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19),n=URL.createObjectURL(e),a=document.createElement("a");return a.href=n,a.download=`umbral-vision-${t}.png`,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3),!0})}function Co({effect:e,interval:t,audio:n,params:a,scene:r}={}){let o=new URLSearchParams;if(e&&o.set("effect",String(e)),t!=null&&o.set("interval",String(t)),o.set("audio",n?"1":"0"),r){let i=O(r);o.set("s",yr(i)),o.set("effect",i.effect)}else a&&typeof a=="object"&&Object.keys(a).length>0&&o.set("p",JSON.stringify(a));let s=new URL(window.location.href);return s.search=o.toString(),s.hash="",s.toString()}async function ii(e){let t=Co(e);try{if(navigator.clipboard&&navigator.clipboard.writeText)return await navigator.clipboard.writeText(t),{ok:!0,url:t,method:"clipboard"}}catch{}return{ok:!1,url:t,method:"fallback"}}function oi(e){let t=new URLSearchParams(e),n=null;if(t.has("p"))try{let o=JSON.parse(t.get("p"));o&&typeof o=="object"&&!Array.isArray(o)&&(n=o)}catch{}let a=null;return t.has("s")&&(a=xr(t.get("s"))),{effect:a?.effect||t.get("effect")||null,interval:t.has("interval")&&Number(t.get("interval"))||null,audio:t.get("audio")==="1",params:a?{...a.params,seed:a.seed}:n,scene:a}}var ct=null,La=null;function Po(){return ct||(ct=document.createElement("div"),ct.id="toast",ct.setAttribute("role","status"),ct.setAttribute("aria-live","polite"),document.body.appendChild(ct),ct)}function ee(e,t=2e3){let n=Po();n.textContent=e,n.classList.add("show"),La&&clearTimeout(La),La=setTimeout(()=>{n.classList.remove("show")},t)}function si(){window.addEventListener("uv:toast",e=>{ee(e.detail?.text||"",e.detail?.duration??2e3)})}var ko=new Set(["INPUT","TEXTAREA","SELECT"]);function li(e){let t={" ":()=>e.toggleAuto?.(),f:()=>e.toggleFullscreen?.(),F:()=>e.toggleFullscreen?.(),h:()=>e.togglePanel?.(),H:()=>e.togglePanel?.(),m:()=>e.toggleMic?.(),M:()=>e.toggleMic?.(),p:()=>e.togglePause?.(),P:()=>e.togglePause?.(),"?":()=>e.toggleOnboarding?.(),ArrowLeft:()=>e.prevEffect?.(),ArrowRight:()=>e.nextEffect?.()};for(let a=1;a<=9;a++)t[String(a)]=()=>e.selectByIndex?.(a-1);t[0]=()=>e.selectByIndex?.(9),t["-"]=()=>e.selectByIndex?.(10),t["="]=()=>e.selectByIndex?.(11);let n=a=>{if(a.ctrlKey||a.metaKey||a.altKey)return;let r=a.target;if(r&&ko.has(r.tagName)||r&&r.isContentEditable)return;let o=t[a.key];o&&(a.preventDefault(),o())};return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)}var ci="umbral-vision:onboarded";var Lo=[{keys:["1","\u2013","9"],text:"Cambiar efecto (atajo num\xE9rico)"},{keys:["\u2190","\u2192"],text:"Efecto anterior / siguiente"},{keys:["Espacio"],text:"Auto-transici\xF3n on/off"},{keys:["F"],text:"Pantalla completa"},{keys:["H"],text:"Ocultar / mostrar interfaz"},{keys:["M"],text:"Activar / desactivar micr\xF3fono"}];function ui({onFirstFrame:e}){let t=document.getElementById("onboarding");t||(t=Io(),document.body.appendChild(t));let n=null,a=_o(),r=()=>{a||(t.hidden=!1,n=setTimeout(o,6e3))},o=()=>{if(n&&clearTimeout(n),n=null,t.hidden=!0,!a){a=!0;try{localStorage.setItem(ci,"1")}catch{}}};return t.addEventListener("click",s=>{s.target===t&&o()}),t.querySelector(".onboarding-dismiss")?.addEventListener("click",o),document.addEventListener("keydown",s=>{t.hidden||(s.key==="Escape"||s.key==="Enter")&&o()}),a||e(()=>setTimeout(r,800)),{show:()=>{a=!1,r()},dismiss:o}}function _o(){try{return localStorage.getItem(ci)==="1"}catch{return!1}}function Io(){let e=document.createElement("div");e.id="onboarding",e.hidden=!0;let t=document.createElement("div");t.className="onboarding-card";let n=document.createElement("h2");n.textContent="Umbral Vision",t.appendChild(n);let a=document.createElement("p");a.style.cssText="margin: 0; font-size: 0.9rem; opacity: 0.75;",a.textContent="Atajos principales:",t.appendChild(a);let r=document.createElement("ul");r.className="onboarding-tips";for(let s of Lo){let i=document.createElement("li");for(let l of s.keys){let f=document.createElement("kbd");f.textContent=l,i.appendChild(f)}let c=document.createElement("span");c.textContent=" "+s.text,i.appendChild(c),r.appendChild(i)}t.appendChild(r);let o=document.createElement("button");return o.className="uv-btn uv-btn-primary onboarding-dismiss",o.textContent="Entendido",t.appendChild(o),e.appendChild(t),e}var mi=["fluidFields","organicStructures","mathematicalForms","temporalVeil","tunnel","spiral","mandala","particles","waves","fractal","matrix","glitch","melt","fractalGlitch","waveGlitch","sacredGeometry","biomech","dune","yinYang"],Bo={fluidFields:"Fluid",organicStructures:"Organic",mathematicalForms:"Fractal",temporalVeil:"Temporal",tunnel:"T\xFAnel",spiral:"Espiral",mandala:"M\xE1ndala",particles:"Part\xEDculas",waves:"Olas",fractal:"\xC1rbol",matrix:"Matrix",glitch:"Glitch",melt:"Melt",fractalGlitch:"\xC1rbol Glitch",waveGlitch:"Olas Glitch",sacredGeometry:"Geometr\xEDa",biomech:"Biomech",dune:"Duna",yinYang:"Yin Yang"},ln={fluidFields:["Fluid Fields","Tejido de part\xEDculas sobre una membrana viva.","Fluid Fields"],organicStructures:["Organic Structures","Membranas topol\xF3gicas transl\xFAcidas.","Organic Structures"],mathematicalForms:["Mathematical Forms","Fractal volum\xE9trico raymarched.","Mathematical Forms"],temporalVeil:["Temporal Veil","Estelas que evolucionan desde su memoria.","Temporal Systems"],tunnel:["T\xFAnel","Elipses conc\xE9ntricas en c\xE1mara infinita.","Cl\xE1sico p5"],spiral:["Espiral","Crom\xE1tica en rotaci\xF3n continua.","Cl\xE1sico p5"],mandala:["M\xE1ndala","Simetr\xEDa radial en capas.","Cl\xE1sico p5"],particles:["Part\xEDculas","Campo de part\xEDculas reactivas.","Cl\xE1sico p5"],waves:["Olas","Ondas de frecuencia sobre el plano.","Cl\xE1sico p5"],fractal:["\xC1rbol fractal","Recursi\xF3n ramificada.","Cl\xE1sico p5"],matrix:["Matrix","Lluvia de caracteres.","Cl\xE1sico p5"],glitch:["Glitch","Ruido, bandas y desplazamiento digital.","Cl\xE1sico p5"],melt:["Melt","Deriva y goteo vertical.","Cl\xE1sico p5"],fractalGlitch:["\xC1rbol Glitch","Fractal con interferencias.","Cl\xE1sico p5"],waveGlitch:["Olas Glitch","Ondas atravesadas por ruido.","Cl\xE1sico p5"],sacredGeometry:["Geometr\xEDa Sagrada","Flor de la vida y patrones.","Cl\xE1sico p5"],biomech:["Biomech","Estructuras org\xE1nicas y mec\xE1nicas.","Cl\xE1sico p5"],dune:["Duna","Dunas suaves en capas.","Cl\xE1sico p5"],yinYang:["Yin Yang","Dualidad en equilibrio.","Cl\xE1sico p5"]},di="umbral-vision:transition-interval",fi="umbral-vision:playback-mode";function No(){let e={};for(let[t,n]of Object.entries(Lt)){let a=()=>({draw:()=>{}});a.preview=n.preview,a.isEngine=!0,a.label=n.label,e[t]=a}return{...Ke,...e}}function hi(e){return String(e).padStart(2,"0")}function Do(e){try{return new Date(e).toLocaleDateString("es-AR",{day:"2-digit",month:"short"})}catch{return""}}function Oo(){let e=document.getElementById("panel"),t=document.getElementById("uv-dock");if(!e||!t)return null;si();let n=No(),a=mi.filter(x=>n[x]).concat(Object.keys(n).filter(x=>!mi.includes(x))),r=document.getElementById("thumbnails"),o=oi(window.location.search),s=n[o.effect]?o.effect:"fluidFields",i={current:s,interval:o.interval||Number(localStorage.getItem(di))||10,auto:!1,paused:!1};kn(s,document.querySelector("#generator main"));let c=!Y(s)||!!kr();c||(i.current="tunnel",kn("tunnel",document.querySelector("#generator main")),ee("WebGL 2 no disponible: usando efectos p5")),o.params&&Y(s)&&c&&lt(o.params);let l=(x,I,z)=>{let W=document.getElementById(x);return W?(W.appendChild(ae(I,18)),W.setAttribute("aria-label",z),W):null};l("fullscreenBtn","expand","Pantalla completa"),l("uv-panel-btn","grid","Mostrar u ocultar panel"),l("uv-prev","prev","Efecto anterior"),l("uv-next","next","Efecto siguiente"),l("uv-play","pause","Pausar"),l("uv-strip-prev","chevron","Desplazar efectos"),l("uv-strip-next","chevron","Desplazar efectos"),document.getElementById("uv-strip-prev")?.classList.add("uv-flip"),l("lite-mode-btn","moon","Modo lite"),l("uv-save-preset","bookmark","Guardar preset"),l("capture-btn","camera","Descargar PNG"),l("share-btn","share","Compartir URL");let f=document.getElementById("uv-explore-btn");f&&!f.querySelector("svg")&&f.appendChild(ae("chevron",14));let m=e.querySelector(".panel-toggle");m&&m.appendChild(ae("chevron",14));let h=document.getElementById("micBtn");h&&!h.querySelector("svg")&&h.prepend(ae("mic",16));let v=document.getElementById("uv-play"),u=[e,t,document.querySelector(".uv-transport"),document.querySelector(".uv-topbar")].filter(Boolean),b=null,g=!1,y=!1,p=new URLSearchParams(window.location.search).has("uihold");function d(){let x=document.activeElement;return x?/^(INPUT|TEXTAREA|SELECT)$/.test(x.tagName)||x.isContentEditable:!1}function E(){return u.some(x=>x.matches(":hover"))}function M(){b&&clearTimeout(b),!(g||d()||p)&&(b=setTimeout(()=>{if(E()||d()){M();return}S(!0,!0)},4200))}function S(x,I=!1){g=!!x,document.body.classList.toggle("uv-immersive",g);for(let W of u)if(W!==e){try{W.inert=g}catch{}W.setAttribute("aria-hidden",String(g))}$e();let z=document.getElementById("uv-panel-btn");z&&z.setAttribute("aria-expanded",String(!g)),g?(b&&clearTimeout(b),X&&(X.hidden=!0),I&&!y&&(y=!0,ee("Interfaz oculta \xB7 mov\xE9 el mouse o toc\xE1 para volver",2600))):M()}function w(){g?S(!1):M()}for(let x of u)x.addEventListener("pointerenter",()=>{b&&clearTimeout(b)}),x.addEventListener("pointerleave",()=>M());for(let x of["pointermove","pointerdown","wheel","touchstart"])window.addEventListener(x,w,{passive:!0});window.addEventListener("keydown",x=>{x.key==="h"||x.key==="H"||w()},{passive:!0}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&M()});let A=document.getElementById("effect-params-host"),_=document.getElementById("uv-params-fallback"),N=Ur(A,{emptyText:"Este efecto no expone par\xE1metros en vivo."}),R=Gr(document.getElementById("audio-controls")),T=ai(),C=ti({limit:30,thumbnailStore:T}),D="hybrid";try{D=localStorage.getItem(fi)||"hybrid"}catch{}let B=Jr({mode:D,scenes:Fa(),noRepeatWindow:10,weights:{curated:.3,generated:.7}}),q=Zr({playlist:B,intervalMs:i.interval*1e3,getAudio:()=>Ue(),onScene:x=>{x&&de(x,{record:!0,silent:!0})}}),H=document.createElement("section");H.id="uv-scene-controls-host",H.className="uv-scene-controls-host",A?.parentNode?A.parentNode.insertBefore(H,A):e.querySelector(".panel-body")?.appendChild(H);let K=ei(H,{isFamilyAvailable:x=>x.renderer!=="webgl"||c,getState:()=>({scene:se(),mode:B.mode,history:C.list(),familyId:Ne(se()),variantId:se()?.variant}),onSelect:({familyId:x,variantId:I})=>{let z=bt(x,I);if(z){if(z.family.renderer==="webgl"&&!c){ee("WebGL 2 no disponible en este navegador");return}if(z.family.renderer==="webgl"){let W=se();de(O({...W||{},effect:z.effect,variant:I}),{transitionMs:"auto"})}else Q(z.effect),re()}},onModeChange:x=>{B.setMode(x);try{localStorage.setItem(fi,x)}catch{}i.auto&&fe(),re()},onGenerate:()=>{let x=K.getSelection(),I=Nn({familyId:x.familyId,variantId:x.variantId});de(I,{record:!0}),ee("Escena generada")},onMutate:()=>{let x=se();if(!x)return;let I=Dn(x,{allowVariantChange:!0});de(I,{record:!0}),ee("Escena mutada")},onSave:()=>{let x=se();if(!x)return;let I=x.name||`${ln[x.effect]?.[0]||x.effect} ${new Date().toLocaleDateString("es-AR")}`,z=(prompt("Nombre de la escena:",I)||"").trim();z&&(Aa(z,x),C.push({...x,name:z}),le(),Ut(),re(),ee(`Escena \u201C${z}\u201D guardada`))},onHistorySelect:x=>{let I=C.get(x);I&&de(I.scene,{silent:!0})},onHistorySave:x=>{let I=C.get(x);if(!I)return;let z=I.scene.name||`${ln[I.scene.effect]?.[0]||I.scene.effect} ${new Date().toLocaleDateString("es-AR")}`,W=(prompt("Nombre del preset:",z)||"").trim();if(!W)return;let Gt=C.promote(x,W);Gt&&(Aa(W,Gt),le(),Ut(),ee(`Preset \u201C${W}\u201D guardado`))}});function Ne(x){return x?It(x.effect):null}function se(){try{return Fr()}catch{return null}}function re(){let x=se();K.refresh({scene:x,mode:B.mode,history:C.list(),familyId:Ne(x),variantId:x?.variant})}function le(){B.setScenes(Fa()),re()}function de(x,I={}){if(!x)return null;if(!c&&Y(x.effect))return ee("WebGL 2 no disponible en este navegador"),null;let z=Ar(x,{transitionMs:I.transitionMs??"auto",transitionType:"dissolve"});return z?(i.current=z.effect,k&&k.highlight(z.effect),I.record&&C.push(z),L(),re(),z):null}let Fe=[...e.querySelectorAll("[data-uv-tab]")],ut=[...e.querySelectorAll("[data-uv-panel]")];function pe(x){for(let I of Fe){let z=I.dataset.uvTab===x;I.setAttribute("aria-selected",String(z)),I.tabIndex=z?0:-1}for(let I of ut)I.hidden=I.dataset.uvPanel!==x;x==="presets"&&Ut()}Fe.forEach(x=>x.addEventListener("click",()=>pe(x.dataset.uvTab)));function $e(){let x=g||e.classList.contains("is-hidden");try{e.inert=x}catch{}e.setAttribute("aria-hidden",String(x))}function Te(x){e.classList.toggle("is-hidden",!x);let I=document.getElementById("uv-panel-btn");I&&I.setAttribute("aria-expanded",String(x)),$e()}document.getElementById("uv-panel-btn")?.addEventListener("click",()=>{Te(e.classList.contains("is-hidden"))}),m?.addEventListener("click",()=>Te(!1));let X=document.getElementById("uv-explore-menu"),wt=()=>{if(!X)return;let x=X.hidden;X.hidden=!x,f?.setAttribute("aria-expanded",String(x))};f?.addEventListener("click",x=>{x.stopPropagation(),wt()}),document.addEventListener("click",()=>{X&&!X.hidden&&(X.hidden=!0,f?.setAttribute("aria-expanded","false"))}),document.addEventListener("keydown",x=>{x.key==="Escape"&&X&&!X.hidden&&(X.hidden=!0,f?.setAttribute("aria-expanded","false"))}),X?.querySelectorAll("[data-uv-tab-target]").forEach(x=>{x.addEventListener("click",()=>{Te(!0),pe(x.dataset.uvTabTarget),X.hidden=!0})});let k=r?Dr(r,n,x=>Q(x),{labels:Bo,order:a,classicNames:gr()}):null,$=document.getElementById("uv-effect-count");$&&($.textContent=String(a.length)),k&&k.highlight(i.current),document.getElementById("uv-strip-prev")?.addEventListener("click",()=>{r?.scrollBy({left:-260,behavior:"smooth"})}),document.getElementById("uv-strip-next")?.addEventListener("click",()=>{r?.scrollBy({left:260,behavior:"smooth"})});function Q(x){if(n[x]){if(!c&&Y(x)){ee("WebGL 2 no disponible en este navegador");return}Ln(x),i.current=x,k&&k.highlight(x),L(),re(),i.auto&&fe()}}function P(x){let I=a.indexOf(i.current),z=a[(I+x+a.length)%a.length];Q(z)}function L(){let x=ln[i.current]||[i.current,"","\u2014"],I=a.indexOf(i.current);ge("uv-effect-index",`${hi(I+1)} / ${hi(a.length)}`),ge("uv-effect-title",x[0]),ge("uv-effect-desc",x[1]),ge("uv-info-family",x[2]),ge("uv-info-renderer",Y(i.current)?"WebGL 2":"p5 \xB7 Canvas 2D"),N&&N.refresh(i.current),_&&(_.hidden=Y(i.current)),zn()}document.getElementById("uv-prev")?.addEventListener("click",()=>P(-1)),document.getElementById("uv-next")?.addEventListener("click",()=>P(1));function U(){v&&(v.replaceChildren(ae(i.paused?"play":"pause",18)),v.setAttribute("aria-label",i.paused?"Reanudar":"Pausar"),v.classList.toggle("is-paused",i.paused),document.getElementById("uv-live")?.classList.toggle("is-paused",i.paused))}v?.addEventListener("click",()=>{i.paused=Tr(!i.paused),U()});let te=document.getElementById("autoTransition"),ue=document.getElementById("transitionInterval"),ne=document.getElementById("transitionIntervalValue");ue&&(ue.value=String(i.interval),ne&&(ne.textContent=`${i.interval}s`),ue.addEventListener("input",()=>{i.interval=Number(ue.value),ne&&(ne.textContent=`${i.interval}s`);try{localStorage.setItem(di,String(i.interval))}catch{}q.setIntervalMs(i.interval*1e3),i.auto&&fe()}));function fe(){if(q.setIntervalMs(i.interval*1e3),q.stop(),B.mode==="curated"&&B.getState().scenes===0){Ir(i.interval*1e3,a,Q);return}q.start()}function De(x){i.auto=x,te&&(te.checked=x),x?fe():(q.stop(),wa())}te?.addEventListener("change",()=>De(te.checked)),Vr(document.getElementById("audio-spectrum")).start();let qe={on:!1};function zt(){if(!h)return;h.classList.toggle("is-on",qe.on),h.setAttribute("aria-pressed",String(qe.on)),h.closest(".uv-audio")?.classList.toggle("is-on",qe.on);let x=h.querySelector("[data-uv-mic-label]");x&&(x.textContent=qe.on?"Mic ON":"Audio")}h?.addEventListener("click",async()=>{if(qe.on)await za(),qe.on=!1,zt();else try{await Oa(),qe.on=!0,zt(),ee("Micr\xF3fono activo")}catch{h.classList.add("is-error"),setTimeout(()=>h.classList.remove("is-error"),1200),ee("No se pudo acceder al micr\xF3fono")}}),zt();function be(){let x=document.getElementById("lite-mode-btn");if(!x)return;let I=_e();x.classList.toggle("is-on",I),x.setAttribute("aria-pressed",String(I))}document.getElementById("lite-mode-btn")?.addEventListener("click",()=>{fr(!_e()),be(),ee(`Modo lite ${_e()?"activo":"desactivado"}`),setTimeout(zn,700)}),be();let mt=document.getElementById("preset-name"),xe=document.getElementById("preset-list");function dt(){let x=se();return{effect:i.current,interval:i.interval,audioEnabled:Z().enabled,params:Y(i.current)?Ot():null,scene:x}}function pi(){let x=`${ln[i.current]?.[0]||i.current} ${new Date().toLocaleDateString("es-AR")}`,I=(mt?.value||"").trim()||x,z=Ma(I,dt());if(!z){ee("No se pudo guardar el preset");return}mt&&(mt.value=""),le(),Ut(),ee(`Preset \u201C${z.name}\u201D guardado`)}document.getElementById("preset-save")?.addEventListener("click",pi),document.getElementById("uv-save-preset")?.addEventListener("click",()=>{Te(!0),pe("presets"),mt?.focus()});function Ut(){if(!xe)return;xe.replaceChildren();let x=$r();if(x.length===0){let I=document.createElement("p");I.className="uv-preset-empty",I.textContent="Todav\xEDa no hay presets. Guard\xE1 la configuraci\xF3n actual.",xe.appendChild(I);return}for(let I of x){let z=document.createElement("div");z.className="uv-preset-item";let W=document.createElement("button");W.type="button",W.className="uv-preset-load";let Gt=document.createElement("b");Gt.textContent=I.name;let _a=document.createElement("span"),vi=ln[I.state?.effect]?.[0]||I.state?.effect||"\u2014";_a.textContent=`${vi} \xB7 ${Do(I.createdAt)}`,W.append(Gt,_a),W.addEventListener("click",()=>gi(I));let St=document.createElement("button");St.type="button",St.className="uv-btn uv-btn-icon uv-preset-delete",St.setAttribute("aria-label",`Eliminar ${I.name}`),St.appendChild(ae("trash",14)),St.addEventListener("click",()=>{qr(I.id),le(),Ut(),ee("Preset eliminado")}),z.append(W,St),xe.appendChild(z)}}function gi(x){!x||!x.state||(x.state.scene?de(x.state.scene,{silent:!0}):n[x.state.effect]&&(Q(x.state.effect),Y(x.state.effect)&&x.state.params&&(lt(x.state.params),N?.refresh(x.state.effect))),x.state.interval&&(i.interval=x.state.interval,ue&&(ue.value=String(i.interval)),ne&&(ne.textContent=`${i.interval}s`)),ee(`Preset \u201C${x.name}\u201D cargado`))}document.getElementById("capture-btn")?.addEventListener("click",async()=>{let x=await ri();ee(x?"PNG descargado":"No se pudo capturar el frame")}),document.getElementById("share-btn")?.addEventListener("click",async()=>{(await ii({effect:i.current,interval:i.interval,audio:Z().enabled,params:Y(i.current)?Ot():null,scene:se()})).method==="clipboard"?ee("URL copiada"):ee("No se pudo copiar la URL")}),document.getElementById("fullscreenBtn")?.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.()}),document.addEventListener("fullscreenchange",()=>{let x=document.getElementById("fullscreenBtn");x&&(x.replaceChildren(ae(document.fullscreenElement?"collapse":"expand",18)),x.setAttribute("aria-label",document.fullscreenElement?"Salir de pantalla completa":"Pantalla completa"))});function ge(x,I){let z=document.getElementById(x);z&&(z.textContent=I)}function zn(){let x=Pr(),I=Y(i.current),z=Lr(),W=z&&(z.getAvg?.()||z.getInstant?.())||0;ge("uv-fps",`${Math.round(W)} FPS`),ge("uv-backend",I?"GPU":"P5"),ge("uv-info-fps",x?`${x.fps.toFixed(1)}`:Math.round(W).toString()),I&&x?(ge("uv-info-res",`${x.width}\xD7${x.height}`),ge("uv-info-quality",x.quality),ge("uv-info-particles",x.activeParticles>0?x.activeParticles.toLocaleString("es-AR"):"\u2014")):(ge("uv-info-res",`${window.innerWidth}\xD7${window.innerHeight}`),ge("uv-info-quality",_e()?"lite":"high"),ge("uv-info-particles","\u2014"))}return setInterval(zn,600),setInterval(()=>R.refresh(),120),li({selectByIndex:x=>{a[x]&&Q(a[x])},prevEffect:()=>P(-1),nextEffect:()=>P(1),toggleAuto:()=>De(!i.auto),toggleFullscreen:()=>document.getElementById("fullscreenBtn")?.click(),toggleMic:()=>h?.click(),togglePanel:()=>S(!g),toggleOnboarding:()=>document.getElementById("onboarding")?.removeAttribute("hidden"),togglePause:()=>v?.click()}),window.matchMedia&&window.matchMedia("(max-width: 720px)").matches&&Te(!1),De(!1),i.paused=Rr(),U(),L(),re(),pe("params"),new URLSearchParams(window.location.search).has("nointro")||ui({onFirstFrame:x=>requestAnimationFrame(()=>requestAnimationFrame(x))}),M(),{selectEffect:Q,openTab:pe,setImmersive:S,getState:()=>({...i,immersive:g}),refresh:L}}if(typeof window<"u"&&document.getElementById("uv-dock")&&!window.__UV_NO_AUTO_INIT__){let e=()=>{window.__UV_STUDIO_MOUNTED__||(window.__UV_STUDIO_MOUNTED__=!0,Oo())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}export{Oo as mountStudioUI};
