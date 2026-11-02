// 45 Brain ゲーム：clock（開いたときだけ読み込まれる。共通の関数は index.html にある）
BRAIN.def("clock","  <section data-pane=\"clock\" data-v=\"setup\">\n    <div class=\"vw\" data-v=\"setup\">\n      <div class=\"panel\">\n        <h2 data-i=\"clTitle\"></h2>\n        <p class=\"lead\" data-i=\"clLead\"></p>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optKind\"></span><div class=\"chips\" id=\"clKindSel\">\n          <button class=\"chip\" data-val=\"read\" data-i=\"kRead\"></button><button class=\"chip\" data-val=\"set\" data-i=\"kSet\"></button><button class=\"chip\" data-val=\"after\" data-i=\"kAfter\"></button><button class=\"chip\" data-val=\"mix\" data-i=\"kMix\"></button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optLevel\"></span><div class=\"chips\" id=\"clLvSel\">\n          <button class=\"chip\" data-val=\"60\" data-i=\"lvHour\"></button><button class=\"chip\" data-val=\"30\" data-i=\"lvHalf\"></button><button class=\"chip\" data-val=\"5\" data-i=\"lvFive\"></button><button class=\"chip\" data-val=\"1\" data-i=\"lvOne\"></button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"clOptQ\"></span><div class=\"chips\" id=\"clQSel\">\n          <button class=\"chip num\" data-val=\"5\">5</button><button class=\"chip num\" data-val=\"10\">10</button><button class=\"chip num\" data-val=\"20\">20</button></div></div>\n      </div>\n      <div class=\"panel\">\n        <h2 data-i=\"clRec\"></h2>\n        <div class=\"best\"><i class=\"ic\" data-ic=\"trophy\"></i><span id=\"clBestLbl\"></span><b class=\"num\" id=\"clBest\"></b></div>\n      </div>\n    </div>\n    <div class=\"vw\" data-v=\"play\">\n      <div class=\"phead\"><button class=\"btn icon\" id=\"clQuit\" aria-label=\"quit\"><i class=\"ic\" data-ic=\"x\"></i></button><b class=\"num prog\" id=\"clProg\"></b><span class=\"sp\"></span><span class=\"timer num\" id=\"clTime\"></span></div>\n      <div class=\"qtext\" id=\"clQ\"></div>\n      <div class=\"clockbox\"><svg id=\"clSvg\" viewBox=\"0 0 200 200\"></svg></div>\n      <div class=\"banner\" id=\"clFb\"></div>\n      <div class=\"choices\" id=\"clChoices\"></div>\n    </div>\n  </section>",function(){
/* =========================================================
   時計
   ========================================================= */
const CLK={
  s:Object.assign({kind:"read",lv:"5",q:"10"},store.get("b_cl",{})),
  st:null,q:null,timer:0,rf:[],
  save(){ store.set("b_cl",this.s); },
  init(){
    this.pane=$('[data-pane="clock"]');
    this.rf.push(chips($("#clKindSel"),()=>this.s.kind,v=>{this.s.kind=v;this.save()},()=>this.refresh()));
    this.rf.push(chips($("#clLvSel"),()=>this.s.lv,v=>{this.s.lv=v;this.save()},()=>this.refresh()));
    this.rf.push(chips($("#clQSel"),()=>this.s.q,v=>{this.s.q=v;this.save()}));
    $("#clQuit").onclick=()=>this.quit();
    this.face(); this.bindDrag();
    $("#clChoices").addEventListener("click",e=>{ const b=e.target.closest("[data-ch]"); if(b) this.choose(+b.dataset.ch,b); });
    this.refresh();
  },
  key0(){ return `${this.s.kind}-${this.s.lv}`; },
  refresh(){ this.rf.forEach(f=>f()); const b=store.get("b_cl_best",{})[this.key0()];
    const kl={read:"kRead",set:"kSet",after:"kAfter",mix:"kMix"}[this.s.kind], ll={60:"lvHour",30:"lvHalf",5:"lvFive",1:"lvOne"}[this.s.lv];
    $("#clBestLbl").textContent=t("clBestOf",{k:`${t(kl)}・${t(ll)}`}); $("#clBest").textContent=b??"—"; },
  face(){ const svg=$("#clSvg"); let h=`<circle cx="100" cy="100" r="96" fill="var(--panel)" stroke="var(--strong)" stroke-width="4"/>`;
    for(let i=0;i<60;i++){ const a=i*6*Math.PI/180, r1=i%5?88:83, r2=92; h+=`<line x1="${100+r1*Math.sin(a)}" y1="${100-r1*Math.cos(a)}" x2="${100+r2*Math.sin(a)}" y2="${100-r2*Math.cos(a)}" stroke="var(--ink)" stroke-width="${i%5?1:2.4}" stroke-linecap="round"/>`; }
    for(let n=1;n<=12;n++){ const a=n*30*Math.PI/180; h+=`<text x="${100+70*Math.sin(a)}" y="${100-70*Math.cos(a)+6.5}" text-anchor="middle" font-size="19" font-family="Fredoka,sans-serif" font-weight="600" fill="var(--ink)">${n}</text>`; }
    h+=`<line id="hH" x1="100" y1="100" x2="100" y2="52" stroke="var(--g1)" stroke-width="8" stroke-linecap="round"/><line id="hM" x1="100" y1="100" x2="100" y2="24" stroke="var(--g0)" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="var(--strong)"/>`;
    svg.innerHTML=h; },
  hands(total){ total=((total%720)+720)%720; const m=total%60; const am=m*6, ah=total/2;
    const set=(id,a,len)=>{ const r=a*Math.PI/180,l=$(id); l.setAttribute("x2",100+len*Math.sin(r)); l.setAttribute("y2",100-len*Math.cos(r)); };
    set("#hM",am,76); set("#hH",ah,48); },
  bindDrag(){ const svg=$("#clSvg"); let mode0=null,lastM=0;
    const ang=e=>{ const r=svg.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*200-100, y=(e.clientY-r.top)/r.height*200-100; return {a:(Math.atan2(x,-y)*180/Math.PI+360)%360,d:Math.hypot(x,y)}; };
    svg.addEventListener("pointerdown",e=>{ const q=this.q; if(!q||q.kind!=="set"||q.done) return; const p=ang(e);
      const m=q.cur%60, am=m*6, ah=((q.cur%720)/2);
      const diff=(x,y)=>{ const d=Math.abs(x-y)%360; return Math.min(d,360-d); };
      mode0=p.d>60?"m":(diff(p.a,ah)<diff(p.a,am)?"h":"m");
      lastM=m; svg.setPointerCapture(e.pointerId); this.dragMove(p,mode0); e.preventDefault(); });
    svg.addEventListener("pointermove",e=>{ if(!mode0) return; this.dragMove(ang(e),mode0); });
    const end=()=>{ mode0=null; }; svg.addEventListener("pointerup",end); svg.addEventListener("pointercancel",end); },
  dragMove(p,which){ const q=this.q; if(!q) return; const snap=q.step===1?1:5;
    if(which==="m"){ let m=Math.round(p.a/6/snap)*snap%60; const oldM=q.cur%60; let H=Math.floor(q.cur/60);
      if(oldM>=45&&m<15) H++; else if(oldM<15&&m>=45) H--; q.cur=((H*60+m)%720+720)%720; }
    else { const m=q.cur%60; let H=Math.round((p.a-m/2)/30); q.cur=(((H%12)+12)%12)*60+m; }
    this.hands(q.cur); },
  view(v){ this.pane.dataset.v=v; if(mode==="clock") this.dock(); },
  dock(){ if(mode!=="clock") return; if(this.pane.dataset.v==="setup") return setDock(`<button class="btn primary big" data-act="start"><i class="ic" data-ic="play"></i>${esc(t("clStart"))}</button>`);
    const q=this.q; if(!q) return setDock("");
    if(q.done){ const last=this.st.i>=this.st.n; return setDock(`<button class="btn primary big" data-act="next">${esc(t(last?"clSeeRes":"clNext"))}<i class="ic" data-ic="next"></i></button>`); }
    if(q.kind==="set") return setDock(`<button class="btn primary big" data-act="check"><i class="ic" data-ic="check"></i>${esc(t("clAnswer"))}</button>`);
    setDock(""); },
  act(a){ if(a==="start") this.start(); else if(a==="check") this.checkSet(); else if(a==="next"){ if(this.st.i>=this.st.n) this.finish(); else this.next(); } },
  start(){ this.st={i:0,n:+this.s.q,res:[],score:0}; this.view("play"); this.next();
    clearInterval(this.timer); this.timer=setInterval(()=>{ if(this.q&&!this.q.done) $("#clTime").textContent=fmtSec(now()-this.q.t0); },200); },
  rtime(step){ const h=1+rnd(12); const m=step===60?0:rnd(60/step)*step; return [h,m]; },
  norm(h,m){ let tot=((h%12)*60+m)%720; tot=(tot+720)%720; const H=Math.floor(tot/60)||12; return [H,tot%60]; },
  next(){ const st=this.st,step=+this.s.lv; st.i++;
    const kinds=["read","set","after"]; const kind=this.s.kind==="mix"?kinds[rnd(3)]:this.s.kind;
    const [h,m]=this.rtime(step); const q={kind,h,m,step,t0:now(),done:false}; this.q=q;
    $("#clProg").textContent=`${st.i} / ${st.n}`; $("#clFb").innerHTML=""; $("#clChoices").innerHTML=""; $("#clSvg").classList.toggle("drag",kind==="set");
    if(kind==="read"){ this.hands(h*60+m); $("#clQ").innerHTML=esc(t("clReadQ")); q.ans=[h,m]; this.choices(this.opts(h,m,step)); }
    else if(kind==="set"){ q.ans=[h,m]; let c; do{ const r=this.rtime(step===60?60:5); c=(r[0]%12)*60+r[1]; }while(c===(h%12)*60+m); q.cur=c; this.hands(c);
      $("#clQ").innerHTML=t("clSetQ",{t:esc(fmtHM(h,m))})+`<br><small style="color:var(--muted);font-size:12px">${esc(t("clSetHint"))}</small>`; }
    else { const d=step===60?60*(1+rnd(5)):step===30?30*(1+rnd(5)):step===5?5*(1+rnd(18)):1+rnd(89); q.d=d; this.hands(h*60+m);
      q.ans=this.norm(h,m+d); $("#clQ").innerHTML=t("clAfterQ",{d:esc(fmtDelta(d))}); this.choices(this.opts(q.ans[0],q.ans[1],step===60?60:step===30?30:step===5?5:1,true)); }
    this.dock(); },
  opts(h,m,step,after){ const mp=new Map(); const add=(H,M)=>{ const [a,b]=this.norm(H,M); const k=a*60+b; if(!mp.has(k)) mp.set(k,[a,b]); };
    add(h,m); const st=Math.max(step,5); const cand=[[h+1,m],[h-1,m],[h,m+st],[h,m-st],[h,(60-m)%60],[h+1,m-st]];
    if(m%5===0&&m>0&&!after) cand.push([m/5,(h%12)*5]);
    if(step===60) cand.push([h+2,0],[h-2,0],[h+3,0],[12-h,0]);
    shuffle(cand).forEach(c=>{ if(mp.size<4) add(c[0],c[1]); });
    let guard=0; while(mp.size<4&&guard++<50) add(1+rnd(12),step===60?0:rnd(12)*5);
    return shuffle([...mp.values()]); },
  choices(list){ this.q.list=list; $("#clChoices").innerHTML=list.map(([H,M],i)=>`<button class="btn num" data-ch="${i}">${esc(fmtHM(H,M))}</button>`).join(""); },
  choose(i,b){ const q=this.q; if(!q||q.done||!q.list) return; const [H,M]=q.list[i]; const ok=H===q.ans[0]&&M===q.ans[1];
    $$("#clChoices [data-ch]").forEach((x,j)=>{ const [a,c]=q.list[j]; if(a===q.ans[0]&&c===q.ans[1]) x.classList.add("right"); });
    if(!ok) b.classList.add("wrong"); this.judge(ok); },
  checkSet(){ const q=this.q; if(!q||q.done) return; const tgt=(q.ans[0]%12)*60+q.ans[1]; const ok=q.cur%720===tgt; if(!ok) this.hands(tgt); this.judge(ok); },
  judge(ok){ const q=this.q,st=this.st; q.done=true; q.ms=now()-q.t0; $("#clTime").textContent=fmtSec(q.ms);
    st.res.push({ok,ms:q.ms}); st.score+=ok?100+Math.max(0,Math.round(50*(1-q.ms/12000))):0;
    $("#clFb").innerHTML=ok?`<span class="okc">${esc(t("clOk"))}</span>`:`<span class="ngc">${esc(t("clNg",{t:fmtHM(q.ans[0],q.ans[1])}))}</span>`;
    ok?sfx.ok():sfx.ng(); this.dock(); },
  finish(){ const st=this.st,r=st.res,n=r.length,c=r.filter(x=>x.ok).length,avg=r.reduce((a,x)=>a+x.ms,0)/Math.max(1,n);
    clearInterval(this.timer); const bm=store.get("b_cl_best",{}),k=this.key0(); const isBest=c>0&&st.score>(bm[k]||0); if(isBest){ bm[k]=st.score; store.set("b_cl_best",bm); }
    this.q=null; this.view("setup"); this.refresh();
    showResult({title:t("tClock"),big:`${c} / ${n}`,bigLbl:t("clRight"),isBest,stats:[[t("clAvg"),fmtSec(avg)],[t("clScore"),st.score]],retry:()=>this.start()}); },
  quit(){ clearInterval(this.timer); this.q=null; this.view("setup"); this.refresh(); }
};

return CLK;
});
