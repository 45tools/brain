// 45 Brain ゲーム：count（開いたときだけ読み込まれる。共通の関数は index.html にある）
BRAIN.def("count","  <section data-pane=\"count\" data-v=\"setup\">\n    <div class=\"vw\" data-v=\"setup\">\n      <div class=\"panel\">\n        <h2 data-i=\"cntTitle\"></h2>\n        <p class=\"lead\" data-i=\"cntLead\"></p>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optSize\"></span>\n          <div class=\"stepper\"><button class=\"btn icon\" id=\"cntMinus\" aria-label=\"-\">−</button><b class=\"num\" id=\"cntN\"></b><button class=\"btn icon\" id=\"cntPlus\" aria-label=\"+\">＋</button></div></div>\n        <div class=\"opt\"><span class=\"ol\"></span><div class=\"chips\" id=\"cntSizes\"></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optStyle\"></span><div class=\"chips\" id=\"cntStyle\">\n          <button class=\"chip\" data-val=\"color\" data-i=\"stColor\"></button><button class=\"chip\" data-val=\"kanji\" data-i=\"stKanji\"></button></div></div>\n        <div id=\"cntKanjiBox\" hidden>\n          <div class=\"opt\"><span class=\"ol\" data-i=\"optKanji\"></span><div class=\"chips\" id=\"cntKPre\"></div></div>\n          <div class=\"opt\"><span class=\"ol\"></span><label class=\"kin\"><span data-i=\"kCount\"></span><input id=\"cntKA\" autocomplete=\"off\"></label><label class=\"kin\"><span data-i=\"kOther\"></span><input id=\"cntKB\" autocomplete=\"off\"></label></div>\n        </div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optLayout\"></span><div class=\"chips\" id=\"cntLayout\">\n          <button class=\"chip\" data-val=\"order\" data-i=\"lyOrder\"></button><button class=\"chip\" data-val=\"random\" data-i=\"lyRandom\"></button><button class=\"chip\" data-val=\"mix\" data-i=\"lyMix\"></button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optTarget\"></span><div class=\"chips\" id=\"cntTarget\">\n          <button class=\"chip\" data-val=\"fill\" data-i=\"tgFill\"></button><button class=\"chip\" data-val=\"empty\" data-i=\"tgEmpty\"></button><button class=\"chip\" data-val=\"mix\" data-i=\"tgMix\"></button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optQ\"></span><div class=\"chips\" id=\"cntQ\">\n          <button class=\"chip num\" data-val=\"5\">5</button><button class=\"chip num\" data-val=\"10\">10</button><button class=\"chip num\" data-val=\"20\">20</button></div></div>\n        <label class=\"opt sw\"><span data-i=\"optReview\" style=\"font-size:14px\"></span><input type=\"checkbox\" id=\"cntRev\"></label>\n        <label class=\"opt sw\"><span data-i=\"optMark\" style=\"font-size:14px\"></span><input type=\"checkbox\" id=\"cntMark\"></label>\n      </div>\n      <div class=\"panel\">\n        <h2 data-i=\"recTitle\"></h2>\n        <div class=\"best\"><i class=\"ic\" data-ic=\"trophy\"></i><span id=\"cntBestLbl\"></span><b class=\"num\" id=\"cntBest\"></b></div>\n        <div class=\"cmph\" data-i=\"cmpAll\"></div>\n        <div id=\"cntStats\"></div>\n        <p class=\"note\" id=\"cntNote\"></p>\n      </div>\n    </div>\n    <div class=\"vw\" data-v=\"play\">\n      <div class=\"phead\"><button class=\"btn icon\" id=\"cntQuit\" aria-label=\"quit\"><i class=\"ic\" data-ic=\"x\"></i></button><b class=\"num prog\" id=\"cntProg\"></b><span class=\"sp\"></span><span class=\"timer num\" id=\"cntTime\"></span></div>\n      <div class=\"prompt\" id=\"cntPrompt\"></div>\n      <div class=\"cgrid\" id=\"cntGrid\"></div>\n      <div class=\"banner\" id=\"cntBanner\"></div>\n    </div>\n  </section>",function(){
/* =========================================================
   マス数え
   ========================================================= */
const CNT={
  s:Object.assign({n:10,layout:"order",target:"fill",q:10,mark:true,review:false,style:"color",kA:"手",kB:"毛"},store.get("b_cnt",{})),
  st:null,q:null,timer:0,rf:[],
  save(){ store.set("b_cnt",this.s); },
  init(){
    this.pane=$('[data-pane="count"]');
    $("#cntSizes").innerHTML=[5,6,8,10,12,15].map(n=>`<button class="chip num" data-val="${n}">${n}×${n}</button>`).join("");
    this.rf.push(chips($("#cntSizes"),()=>this.s.n,v=>{this.s.n=+v;this.save()},()=>this.refresh()));
    $("#cntKPre").innerHTML=KPRE.map(p=>`<button class="chip kchip" data-val="${p}">${p[0]}<small>/</small>${p[1]}</button>`).join("");
    this.rf.push(chips($("#cntStyle"),()=>this.s.style,v=>{this.s.style=v;this.save()},()=>this.refresh()));
    this.rf.push(chips($("#cntKPre"),()=>this.s.kA+this.s.kB,v=>{const a=Array.from(v);this.s.kA=a[0];this.s.kB=a[1];this.save()},()=>this.refresh()));
    const kin=(id,key)=>{ const el=$(id); el.addEventListener("change",()=>{ const c=Array.from(el.value.trim())[0]; if(c){ this.s[key]=c; this.save(); } this.refresh(); }); };
    kin("#cntKA","kA"); kin("#cntKB","kB");
    this.rf.push(chips($("#cntLayout"),()=>this.s.layout,v=>{this.s.layout=v;this.save()}));
    this.rf.push(chips($("#cntTarget"),()=>this.s.target,v=>{this.s.target=v;this.save()}));
    this.rf.push(chips($("#cntQ"),()=>this.s.q,v=>{this.s.q=+v;this.save()}));
    $("#cntMinus").onclick=()=>this.setN(this.s.n-1); $("#cntPlus").onclick=()=>this.setN(this.s.n+1);
    $("#cntMark").onchange=e=>{ this.s.mark=e.target.checked; this.save(); };
    $("#cntRev").onchange=e=>{ this.s.review=e.target.checked; this.save(); this.refresh(); };
    $("#cntQuit").onclick=()=>this.quit();
    $("#cntGrid").addEventListener("pointerdown",e=>{ const c=e.target.closest("[data-c]"); const q=this.q;
      if(!c||!q||q.phase==="judged"||!this.s.mark) return; const i=+c.dataset.c;
      if(q.marks.has(i)){ q.marks.delete(i); c.classList.remove("mk"); } else { q.marks.add(i); c.classList.add("mk"); } tone(760,.04,"triangle",.05); });
    this.refresh();
  },
  bestKey(){ return this.s.n+(this.s.style==="kanji"?"k":""); },
  sizeLbl(){ return `${this.s.n}×${this.s.n}`+(this.s.style==="kanji"?`・${this.s.kA}/${this.s.kB}`:""); },
  setN(n){ this.s.n=Math.max(3,Math.min(20,n)); this.save(); this.refresh(); },
  refresh(){
    this.rf.forEach(f=>f()); $("#cntN").textContent=`${this.s.n}×${this.s.n}`; $("#cntMark").checked=this.s.mark; $("#cntRev").checked=this.s.review; ["#cntStats","#cntNote"].forEach(x=>$(x).hidden=!this.s.review); $(".cmph",$("#cntStats").parentNode).hidden=!this.s.review;
    const kj=this.s.style==="kanji"; $("#cntKanjiBox").hidden=!kj;
    if(document.activeElement!==$("#cntKA")) $("#cntKA").value=this.s.kA; if(document.activeElement!==$("#cntKB")) $("#cntKB").value=this.s.kB;
    const tb=$$("#cntTarget [data-val]"); if(kj){ tb[0].textContent=`「${this.s.kA}」`; tb[1].textContent=`「${this.s.kB}」`; } else { tb[0].innerHTML=t("tgFill"); tb[1].innerHTML=t("tgEmpty"); }
    const best=store.get("b_cnt_best",{})[this.bestKey()]; $("#cntBestLbl").textContent=t("bestOf",{k:this.sizeLbl()}); $("#cntBest").textContent=best??"—";
    const S=store.get("b_cnt_stats",{rv:[0,0],dr:[0,0]}); $("#cntStats").innerHTML=cmpHTML(S.rv,S.dr);
    const n=$("#cntNote"); const m=cmpNote(S.rv,S.dr); n.textContent=m.text; n.classList.toggle("good",m.good);
  },
  view(v){ this.pane.dataset.v=v; if(mode==="count") this.dock(); },
  dock(){ if(this.pane.dataset.v==="setup") return setDock(`<button class="btn primary big" data-act="start"><i class="ic" data-ic="play"></i>${esc(t("start"))}</button>`); this.playDock(); },
  playDock(){ const q=this.q; if(!q||mode!=="count") return;
    if(q.phase==="answer"||q.phase==="review"){
      setDock(`<div class="ansrow"><span class="lbl">${esc(t(q.phase==="review"?"reviewing":"yourAns"))}</span><b class="ansbox num">${q.input||"&nbsp;"}</b></div>`+kpHTML(t(q.phase==="review"?"confirm":"answer"),!q.input),true);
    } else if(q.phase==="confirm"){
      setDock(`<div class="ask">${t("askReview",{n:esc(q.input)})}</div><div class="row2"><button class="btn" data-act="review"><i class="ic" data-ic="eye"></i>${esc(t("doReview"))}</button><button class="btn primary" data-act="submit">${esc(t("submitNow"))}</button></div>`,true);
    } else {
      const last=this.st.i>=this.s.q; setDock(`<button class="btn primary big" data-act="next">${esc(t(last?"seeResult":"next"))}<i class="ic" data-ic="next"></i></button>`);
    }
  },
  act(a){
    if(a==="start") this.start();
    else if(a==="review"){ this.q.reviewed=true; this.q.phase="review"; this.banner(); this.playDock(); }
    else if(a==="submit") this.judge();
    else if(a==="next"){ if(this.st.i>=this.s.q) this.finish(); else this.next(); }
  },
  key(k){ const q=this.q; if(!q||this.pane.dataset.v!=="play"||!(q.phase==="answer"||q.phase==="review")) return;
    if(k==="del") q.input=q.input.slice(0,-1);
    else if(k==="ok"){ if(!q.input) return; if(q.phase==="answer"){ q.firstAns=q.input; if(!this.s.review){ this.judge(); return; } q.phase="confirm"; this.playDock(); return; } this.judge(); return; }
    else { if(q.input.length>=3) return; q.input=(q.input==="0"?"":q.input)+k; }
    sfx.tap(); this.playDock();
  },
  start(){ if(this.s.style==="kanji"&&this.s.kA===this.s.kB){ toast(t("kSame")); return; } this.st={i:0,res:[],score:0}; this.view("play"); this.next(); },
  next(){
    const n=this.s.n,T=n*n;
    const layout=this.s.layout==="mix"?(Math.random()<.5?"order":"random"):this.s.layout;
    const target=this.s.target==="mix"?(Math.random()<.5?"fill":"empty"):this.s.target;
    const lo=Math.max(1,Math.round(T*.1)),hi=Math.max(lo,Math.min(T-1,Math.round(T*.9))); const k=lo+rnd(hi-lo+1);
    const filled=new Array(T).fill(false);
    if(layout==="order"){ for(let i=0;i<k;i++) filled[i]=true; } else { shuffle([...Array(T).keys()]).slice(0,k).forEach(i=>filled[i]=true); }
    this.st.i++;
    const kj=this.s.style==="kanji"; this.q={n,filled,target,kj,A:this.s.kA,B:this.s.kB,ans:target==="fill"?k:T-k,input:"",firstAns:"",reviewed:false,phase:"answer",t0:now(),marks:new Set()};
    $("#cntProg").textContent=`${this.st.i} / ${this.s.q}`;
    $("#cntPrompt").innerHTML=kj?t("qChar",{c:`<b class="kc">${esc(target==="fill"?this.s.kA:this.s.kB)}</b>`}):t(target==="fill"?"qFill":"qEmpty",{sw:`<span class="sw0 ${target==="fill"?"f":"e"}"></span>`});
    this.grid(false); this.banner(); this.playDock();
    clearInterval(this.timer); const el=$("#cntTime"); this.timer=setInterval(()=>{ if(this.q&&this.q.phase!=="judged") el.textContent=fmtSec(now()-this.q.t0); },200); el.textContent=fmtSec(0);
  },
  grid(reveal){ const q=this.q,g=$("#cntGrid"); g.style.setProperty("--n",q.n); g.classList.toggle("kj",!!q.kj); let h="",j=0;
    for(let i=0;i<q.n*q.n;i++){ const f=q.filled[i],isT=(q.target==="fill")===f; let cls=f?"f":""; const ch=q.kj?esc(f?q.A:q.B):""; let inner=ch;
      if(reveal){ if(isT){ cls+=` t g${Math.floor(j/10)%2}${j%10===9?" ten":""}`; inner=q.kj?`<em>${j+1}</em>${ch}`:j+1; j++; } else cls+=" dim"; }
      else if(q.marks.has(i)) cls+=" mk";
      h+=`<i class="${cls}" data-c="${i}">${inner}</i>`; }
    g.innerHTML=h; g.classList.toggle("rev",!!reveal); },
  banner(){ const q=this.q,b=$("#cntBanner");
    if(q.phase==="review"){ b.innerHTML=esc(t("reviewHint")); return; }
    if(q.phase!=="judged"){ b.innerHTML=""; return; }
    let h=q.ok?`<span class="okc">${esc(t("judgeOk",{n:q.ans}))}</span>`:`<span class="ngc">${esc(t("judgeNg",{n:q.ans,a:q.input}))}</span>`;
    if(q.fixed) h+=` <span class="gold">${esc(t("fixed"))}</span>`;
    h+=`<small>${esc(fmtSec(q.ms))}　${esc(t("groupHint"))}</small>`; b.innerHTML=h; },
  judge(){ const q=this.q; if(!q||q.phase==="judged") return; q.ms=now()-q.t0; q.phase="judged"; clearInterval(this.timer); $("#cntTime").textContent=fmtSec(q.ms);
    q.ok=parseInt(q.input,10)===q.ans; q.fixed=q.ok&&q.reviewed&&q.firstAns!==q.input;
    const T=q.n*q.n, bonus=q.ok?Math.max(0,Math.round(50*(1-q.ms/(T*600)))):0; this.st.score+=q.ok?100+bonus:0;
    this.st.res.push({ok:q.ok,ms:q.ms,rv:q.reviewed,fixed:q.fixed,ans:q.ans,a:q.input});
    const S=store.get("b_cnt_stats",{rv:[0,0],dr:[0,0]}); const key=q.reviewed?"rv":"dr"; S[key][0]++; if(q.ok) S[key][1]++; store.set("b_cnt_stats",S);
    q.ok?sfx.ok():sfx.ng(); this.grid(true); this.banner(); this.playDock(); },
  finish(){ const r=this.st.res,n=r.length,c=r.filter(x=>x.ok).length,avg=r.reduce((a,x)=>a+x.ms,0)/Math.max(1,n);
    const bm=store.get("b_cnt_best",{}),bk=this.bestKey(); const isBest=c>0&&this.st.score>(bm[bk]||0); if(isBest){ bm[bk]=this.st.score; store.set("b_cnt_best",bm); }
    const rv=r.filter(x=>x.rv),dr=r.filter(x=>!x.rv); const S=store.get("b_cnt_stats",{rv:[0,0],dr:[0,0]});
    const fx=r.filter(x=>x.fixed).length; const note=cmpNote(S.rv,S.dr);
    const extra=!this.s.review?"":`<div class="cmph">${esc(t("cmpThis"))}</div>${cmpHTML([rv.length,rv.filter(x=>x.ok).length],[dr.length,dr.filter(x=>x.ok).length])}`
      +(fx?`<p class="note good">${esc(t("fixed"))} ×${fx}</p>`:"")
      +`<div class="cmph">${esc(t("cmpAll"))}</div>${cmpHTML(S.rv,S.dr)}<p class="note${note.good?" good":""}">${esc(note.text)}</p>`;
    this.q=null; this.view("setup"); this.refresh();
    showResult({title:`${t("tCount")} ${this.sizeLbl()}`,big:pct(c,n)+"%",bigLbl:t("accuracy"),isBest,
      stats:[[t("correct"),`${c}/${n}`],[t("avgTime"),fmtSec(avg)],[t("score"),this.st.score]],extra,retry:()=>this.start()}); },
  quit(){ clearInterval(this.timer); this.q=null; this.view("setup"); this.refresh(); }
};
const KPRE=["手毛","末未","士土","入人","犬太","玉王","千干","己已","鳥烏","ぬめ","シツ","ソン"];
function cmpHTML(rv,dr){ const row=(lbl,[n,c],cls)=>`<div class="cmp"><span>${esc(lbl)}</span><div class="barbg"><i class="${cls}" style="width:${pct(c,n)}%"></i></div><b class="num">${n?pct(c,n)+"%":"—"}</b><small>${esc(t("nq",{n}))}</small></div>`;
  return row(t("withReview"),rv,"a")+row(t("noReview"),dr,"b"); }
function cmpNote(rv,dr){ if(rv[0]>=3&&dr[0]>=3){ const d=pct(rv[1],rv[0])-pct(dr[1],dr[0]); if(d>0) return {text:t("reviewWins",{d}),good:true}; } return {text:t("reviewTip"),good:false}; }

return CNT;
});
