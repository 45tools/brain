// 45 Brain ゲーム：add（開いたときだけ読み込まれる。共通の関数は index.html にある）
BRAIN.def("add","  <section data-pane=\"add\" data-v=\"setup\">\n    <div class=\"vw\" data-v=\"setup\">\n      <div class=\"panel\">\n        <h2 data-i=\"addTitle\"></h2>\n        <p class=\"lead\" data-i=\"addLead\"></p>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optGoal\"></span><div class=\"chips\" id=\"addGoalSel\">\n          <button class=\"chip num\" data-val=\"10\">10</button><button class=\"chip num\" data-val=\"20\">20</button><button class=\"chip num\" data-val=\"50\">50</button>\n          <button class=\"chip num\" data-val=\"100\">100</button><button class=\"chip num\" data-val=\"1000\">1000</button><button class=\"chip\" data-val=\"rnd\" data-i=\"gRnd\"></button>\n          <button class=\"chip\" data-val=\"custom\"><span data-i=\"gCustom\"></span><input type=\"number\" id=\"addCustom\" inputmode=\"numeric\" min=\"5\" max=\"9999\" aria-label=\"custom\"></button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optAddMode\"></span><div class=\"chips\" id=\"addModeSel\">\n          <button class=\"chip\" data-val=\"10\" data-i=\"q10\"></button><button class=\"chip\" data-val=\"20\" data-i=\"q20\"></button><button class=\"chip\" data-val=\"t60\" data-i=\"m60\"></button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optPic\"></span><div class=\"chips\" id=\"addPicSel\"></div></div>\n        <p class=\"lead\" style=\"margin-top:8px\" data-i=\"picNote\"></p>\n      </div>\n      <div class=\"panel\">\n        <h2 data-i=\"recTitle\"></h2>\n        <div class=\"best\"><i class=\"ic\" data-ic=\"trophy\"></i><span id=\"addBestLbl\"></span><b class=\"num\" id=\"addBest\"></b></div>\n      </div>\n    </div>\n    <div class=\"vw\" data-v=\"play\">\n      <div class=\"phead\"><button class=\"btn icon\" id=\"addQuit\" aria-label=\"quit\"><i class=\"ic\" data-ic=\"x\"></i></button><b class=\"num prog\" id=\"addProg\"></b><span class=\"sp\"></span><span class=\"timer num\" id=\"addTime\"></span></div>\n      <div class=\"card\" id=\"addCard\"></div>\n    </div>\n  </section>",function(){
/* ===== たし算の絵 ===== */
const ITEMS={ // [名前, 単位, 英語の複数形]
 marble:{ja:["ビー玉","個"],en:["marble","","marbles"],zt:["彈珠","顆"],zs:["弹珠","颗"]},
 earth:{ja:["地球","個"],en:["Earth","","Earths"],zt:["地球","個"],zs:["地球","个"]},
 ball:{ja:["サッカーボール","個"],en:["soccer ball","","soccer balls"],zt:["足球","顆"],zs:["足球","个"]},
 chick:{ja:["ひよこ","羽"],en:["chick","","chicks"],zt:["小雞","隻"],zs:["小鸡","只"]},
 pig:{ja:["ぶた","匹"],en:["pig","","pigs"],zt:["豬","隻"],zs:["猪","只"]},
 hotdog:{ja:["ホットドッグ","本"],en:["hot dog","","hot dogs"],zt:["熱狗","根"],zs:["热狗","根"]}
};
function itemName(k){ const it=ITEMS[k]; const v=lang==="ja"?it.ja:lang==="en"?it.en:lang==="zh-Hant"?it.zt:it.zs; return [v[0],v[1]||"",v[2]||v[0]]; }
const PIC=(()=>{ const P={};
  P.marble='<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="url(#gMarble)"/><path d="M8 23c5-7 12-7 15-3s9 2 10-3" stroke="#fff" stroke-opacity=".6" stroke-width="3.2" fill="none" stroke-linecap="round"/><ellipse cx="13.5" cy="12.5" rx="5" ry="2.8" fill="#fff" opacity=".85" transform="rotate(-35 13.5 12.5)"/></svg>';
  P.earth='<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#2F8BFF"/><path d="M8.5 13.5c3-3.5 8.5-3.5 9.5-.5s-2 5 1 7.5-1 6.5-4.5 5.5-4-4.5-6.5-4.5-2.6-5.4.5-8z" fill="#34C46A"/><path d="M24.5 22c3.5-1 7.8 1.2 7.6 4.6s-3.4 6.2-6.4 5.2-3.2-3.4-3.2-5.4.4-3.6 2-4.4z" fill="#34C46A"/><path d="M22 7.5c2.2-1.2 5.5-.4 5.6 1.8s-3.2 2.4-4.4 1.4-2.4-2.2-1.2-3.2z" fill="#34C46A"/><circle cx="20" cy="20" r="17" fill="none" stroke="#1B5FC4" stroke-width="1.5"/><ellipse cx="13" cy="10.5" rx="4.5" ry="2.2" fill="#fff" opacity=".55" transform="rotate(-35 13 10.5)"/></svg>';
  const pent=(cx,cy,r,rot)=>[0,1,2,3,4].map(k=>{const a=(rot-90+72*k)*Math.PI/180;return (cx+r*Math.cos(a)).toFixed(1)+","+(cy+r*Math.sin(a)).toFixed(1)}).join(" ");
  let ball='<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#fff"/><g clip-path="url(#cBall)">';
  ball+=`<polygon points="${pent(20,20,6,0)}" fill="#26283A"/>`;
  for(let k=0;k<5;k++){ const a=(-90+36+72*k)*Math.PI/180; ball+=`<polygon points="${pent(20+16.5*Math.cos(a),20+16.5*Math.sin(a),5.5,180+72*k)}" fill="#26283A"/>`;
    const b=(-90+72*k)*Math.PI/180; ball+=`<line x1="${(20+6*Math.cos(b)).toFixed(1)}" y1="${(20+6*Math.sin(b)).toFixed(1)}" x2="${(20+12*Math.cos(b)).toFixed(1)}" y2="${(20+12*Math.sin(b)).toFixed(1)}" stroke="#26283A" stroke-width="1.4"/>`; }
  ball+='</g><circle cx="20" cy="20" r="17" fill="none" stroke="#26283A" stroke-width="1.6"/></svg>'; P.ball=ball;
  P.chick='<svg viewBox="0 0 40 40"><path d="M15 34l-1.5 3M24 34l1.5 3" stroke="#FF8A1F" stroke-width="2.2" stroke-linecap="round"/><path d="M17.5 7.5c.5-3 3-3.5 3.5-1 1-2 3.5-1 2.5 1.5" fill="#FFD43B"/><ellipse cx="20" cy="22" rx="14" ry="13" fill="#FFD43B"/><path d="M10.5 23c2.5 5.5 8 6 10 1.5" fill="none" stroke="#EAB300" stroke-width="2.2" stroke-linecap="round"/><circle cx="25" cy="17" r="2.2" fill="#2A2438"/><circle cx="25.7" cy="16.3" r=".7" fill="#fff"/><path d="M30.5 19.5l6 2.2-6 2.4z" fill="#FF8A1F"/><ellipse cx="27.5" cy="23" rx="2.6" ry="1.6" fill="#FF9DB0" opacity=".8"/></svg>';
  P.pig='<svg viewBox="0 0 40 40"><path d="M6 13.5L8.5 3.5 16 9z" fill="#F57FA4"/><path d="M34 13.5L31.5 3.5 24 9z" fill="#F57FA4"/><circle cx="20" cy="21.5" r="15" fill="#FFAFC8"/><circle cx="14" cy="18" r="2.1" fill="#2A2438"/><circle cx="26" cy="18" r="2.1" fill="#2A2438"/><ellipse cx="20" cy="26" rx="6.6" ry="4.8" fill="#F57FA4"/><ellipse cx="17.6" cy="26" rx="1.3" ry="2" fill="#B83F6B"/><ellipse cx="22.4" cy="26" rx="1.3" ry="2" fill="#B83F6B"/><ellipse cx="9.5" cy="24" rx="2.4" ry="1.5" fill="#FF8AB0" opacity=".7"/><ellipse cx="30.5" cy="24" rx="2.4" ry="1.5" fill="#FF8AB0" opacity=".7"/></svg>';
  P.hotdog='<svg viewBox="0 0 40 40"><rect x="5" y="11" width="30" height="13" rx="6.5" fill="#D9933F"/><rect x="2" y="15" width="36" height="9.5" rx="4.75" fill="#C9432C"/><path d="M6 19.5l3.5-2.5 3.5 2.5 3.5-2.5 3.5 2.5 3.5-2.5 3.5 2.5 3.5-2.5 3.5 2.5" fill="none" stroke="#FFD43B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="5" y="21" width="30" height="12" rx="6" fill="#F2B866"/><path d="M10 26.5h20" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/></svg>';
  return P; })();

/* =========================================================
   たし算
   ========================================================= */
const ADD={
  s:Object.assign({goal:"10",custom:30,mode:"10",pic:"rnd"},store.get("b_add",{})),
  st:null,q:null,timer:0,rf:[],
  save(){ store.set("b_add",this.s); },
  init(){
    this.pane=$('[data-pane="add"]');
    const inp=$("#addCustom"); inp.value=this.s.custom;
    this.rf.push(chips($("#addGoalSel"),()=>this.s.goal,v=>{ this.s.goal=v; this.save(); if(v==="custom") setTimeout(()=>inp.focus(),0); },()=>this.refresh()));
    inp.addEventListener("change",()=>{ let v=parseInt(inp.value,10); if(!(v>=5)) v=5; if(v>9999) v=9999; inp.value=v; this.s.custom=v; this.s.goal="custom"; this.save(); this.refresh(); });
    this.rf.push(chips($("#addModeSel"),()=>this.s.mode,v=>{this.s.mode=v;this.save()},()=>this.refresh()));
    this.rf.push(chips($("#addPicSel"),()=>this.s.pic,v=>{this.s.pic=v;this.save()}));
    $("#addQuit").onclick=()=>this.quit();
    this.refresh();
  },
  bestKey(){ return `${this.s.goal==="custom"?this.s.custom:this.s.goal}-${this.s.mode}`; },
  goalLbl(){ return this.s.goal==="rnd"?t("gRnd"):String(this.s.goal==="custom"?this.s.custom:this.s.goal); },
  modeLbl(){ return this.s.mode==="t60"?t("m60"):t("q"+this.s.mode); },
  picChips(){ $("#addPicSel").innerHTML=`<button class="chip" data-val="none">${esc(t("picNone"))}</button><button class="chip" data-val="rnd">${esc(t("picRnd"))}</button>`
      +Object.keys(ITEMS).map(k=>`<button class="chip picchip" data-val="${k}"><span class="pi">${PIC[k]}</span>${esc(itemName(k)[0])}</button>`).join(""); },
  refresh(){ this.picChips(); this.rf.forEach(f=>f()); const b=store.get("b_add_best",{})[this.bestKey()];
    $("#addBestLbl").textContent=t("bestOf",{k:`${t("goal")} ${this.goalLbl()}・${this.modeLbl()}`}); $("#addBest").textContent=b??"—"; },
  view(v){ this.pane.dataset.v=v; if(mode==="add") this.dock(); },
  dock(){ if(this.pane.dataset.v==="setup") return setDock(`<button class="btn primary big" data-act="start"><i class="ic" data-ic="play"></i>${esc(t("start"))}</button>`);
    const q=this.q; setDock(kpHTML(t("answer"),!q||!q.input||q.locked),true); },
  act(a){ if(a==="start") this.start(); },
  key(k){ const q=this.q; if(!q||q.locked||this.pane.dataset.v!=="play") return;
    if(k==="del") q.input=q.input.slice(0,-1);
    else if(k==="ok"){ if(q.input) this.judge(); return; }
    else { if(q.input.length>=4) return; q.input=(q.input==="0"?"":q.input)+k; }
    sfx.tap(); $("#addIn").innerHTML=q.input||"&nbsp;"; this.fillPics(); this.dock(); },
  fillPics(){ const q=this.q; if(!q||!q.pics) return; const n=Math.min(parseInt(q.input,10)||0,q.T-q.a);
    $$("#addCard .sl[data-s]").forEach(el=>{ const i=+el.dataset.s; if(i<q.a) return;
      if(i<q.a+n){ if(!el.classList.contains("add")){ el.className="sl add"; el.innerHTML=PIC[q.item]; } }
      else if(!el.classList.contains("emp")){ el.className="sl emp"; el.innerHTML=""; } }); },
  picsHTML(T,a,item){ let h=""; for(let r=0;r<Math.ceil(T/10);r++){ h+='<div class="prow">'; for(let g=0;g<2;g++){ h+='<div class="pgrp">';
      for(let j=0;j<5;j++){ const i=r*10+g*5+j; h+=i>=T?'<i class="sl none"></i>':`<i class="sl ${i<a?"got":"emp"}" data-s="${i}">${i<a?PIC[item]:""}</i>`; } h+='</div>'; } h+='</div>'; } return h; },
  pickGoal(){ return this.s.goal==="rnd"?[10,20,50,100][rnd(4)]:this.s.goal==="custom"?this.s.custom:+this.s.goal; },
  start(){ const timed=this.s.mode==="t60"; this.st={i:0,n:timed?Infinity:+this.s.mode,res:[],score:0,timed,t0:now(),prevA:-1}; this.view("play"); this.next();
    clearInterval(this.timer); this.timer=setInterval(()=>this.tick(),200); this.tick(); },
  tick(){ const st=this.st; if(!st) return; const el=$("#addTime");
    if(st.timed){ const left=Math.max(0,60000-(now()-st.t0)); el.textContent=Math.ceil(left/1000)+t("sec"); if(left<=0){ clearInterval(this.timer); this.finish(true); } }
    else if(this.q) el.textContent=fmtSec(now()-this.q.t0); },
  next(){ const st=this.st; const T=this.pickGoal(); st.used=st.used||{}; const u=st.used[T]=st.used[T]||new Set(); if(u.size>=T-1) u.clear(); let a; do{ a=1+rnd(T-1); }while(u.has(a)||(a===st.prevA&&T>3)); u.add(a); st.prevA=a; st.i++;
    const keys=Object.keys(ITEMS); const item=this.s.pic==="none"?null:this.s.pic==="rnd"?keys[rnd(keys.length)]:(ITEMS[this.s.pic]?this.s.pic:keys[0]);
    const pics=!!item&&T<=50;
    this.q={T,a,ans:T-a,input:"",t0:now(),locked:false,item,pics};
    $("#addProg").textContent=st.timed?`${st.res.filter(x=>x.ok).length} ${t("correct")}`:`${st.i} / ${st.n}`;
    const card=$("#addCard"); card.classList.remove("okf","ngf");
    if(!item){
      card.innerHTML=`<div class="goal"><span>${esc(t("goal"))}</span><b class="num">${T}</b></div>
        <div class="eq num"><b>${a}</b><span>＋</span><b class="ansbox" id="addIn">&nbsp;</b><span>＝</span><b>${T}</b></div><div class="fb" id="addFb"></div>`;
    } else {
      const [nm,u,nms]=itemName(item); const uu=lang==="en"?"":u; const ic=x=>pics?"":`<span class="pi">${PIC[item]}</span>`;
      card.innerHTML=`<div class="pgoal"><span class="pi">${PIC[item]}</span><span>${esc(t("picGoal",{name:nm,names:nms,n:T,u}))}</span></div>
        <div class="pask">${esc(t("picAsk",{u}))}</div>
        ${pics?`<div class="pics">${this.picsHTML(T,a,item)}</div>`:""}
        <div class="eq pic num">${ic()}<b>${a}</b><small>${esc(uu)}</small><span>＋</span><b class="ansbox" id="addIn">&nbsp;</b><small>${esc(uu)}</small><span>＝</span>${ic()}<b>${T}</b><small>${esc(uu)}</small></div>
        <div class="fb" id="addFb"></div>`;
    }
    this.dock(); },
  async judge(){ const q=this.q,st=this.st; q.locked=true; const ms=now()-q.t0; const ok=parseInt(q.input,10)===q.ans;
    const ref=String(q.T).length*2500; const pts=ok?100+Math.max(0,Math.round(50*(1-ms/ref))):0; st.score+=pts;
    st.res.push({ok,ms,T:q.T,a:q.a,ans:q.ans,in:q.input});
    const card=$("#addCard"); card.classList.add(ok?"okf":"ngf"); $("#addFb").innerHTML=ok?`<span style="color:var(--ok)">${esc(t("addOk"))}</span>`:`<span style="color:var(--danger)">${esc(t("addNg",{n:q.ans}))}</span>`;
    if(q.pics){ $$("#addCard .sl[data-s]").forEach(el=>{ const i=+el.dataset.s; if(i<q.a) return; if(i<q.a+q.ans){ if(!el.classList.contains("add")){ el.className=ok?"sl add":"sl ghost"; el.innerHTML=PIC[q.item]; } } else { el.className="sl emp"; el.innerHTML=""; } }); }
    ok?sfx.ok():sfx.ng(); this.dock(); const myq=q;
    await wait(ok?(q.pics?750:450):(q.pics?1800:1300)); if(this.q!==myq||!this.st) return;
    if(!st.timed&&st.i>=st.n){ clearInterval(this.timer); this.finish(false); } else this.next(); },
  finish(timeUp){ const st=this.st; if(!st) return; this.st=null; const r=st.res,n=r.length,c=r.filter(x=>x.ok).length,avg=r.reduce((a,x)=>a+x.ms,0)/Math.max(1,n);
    const score=st.timed?c*100-(n-c)*30:st.score; const sc=Math.max(0,score);
    const bm=store.get("b_add_best",{}),key=this.bestKey(); const isBest=c>0&&sc>(bm[key]||0); if(isBest){ bm[key]=sc; store.set("b_add_best",bm); }
    const wrong=r.filter(x=>!x.ok); const extra=(timeUp?`<p class="note">${esc(t("timeUp"))}</p>`:"")+(wrong.length?`<div class="cmph">${esc(t("mistakes"))}</div><ul class="mlist">${wrong.map(x=>`<li class="num" style="font-size:18px">${x.a} + <b style="color:var(--accent)">${x.ans}</b> = ${x.T}　<small style="color:var(--danger);font-family:inherit">${x.in?esc(t("yourWas",{a:x.in})):""}</small></li>`).join("")}</ul>`:"");
    this.q=null; this.view("setup"); this.refresh();
    showResult({title:`${t("tAdd")}　${t("goal")} ${this.goalLbl()}・${this.modeLbl()}`,big:st.timed?String(c):pct(c,n)+"%",bigLbl:st.timed?t("correct"):t("accuracy"),isBest,
      stats:[[t("correct"),`${c}/${n}`],[t("avgTime"),fmtSec(avg)],[t("score"),sc]],extra,retry:()=>this.start()}); },
  quit(){ clearInterval(this.timer); this.st=null; this.q=null; this.view("setup"); this.refresh(); }
};

return ADD;
});
