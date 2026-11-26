// 45 Brain ゲーム：pair 神経衰弱（開いたときだけ読み込まれる。共通の関数は index.html にある）
// ・ひとり（ためした回数の少なさ）／コンピューター（3段階）／2〜4人
// ・絵柄：どうぶつ・たべもの・国旗・数とドット（ちがう絵でペア）・自分の写真
// ・さいしょに見る（3秒）・いれかわり（3回まちがえるごとに2枚が入れかわる）・れんぞくペア
BRAIN.def("pair",`<section data-pane="pair" data-v="setup">
  <div class="vw" data-v="setup">
    <div class="panel">
      <h2 data-i="prTitle"></h2>
      <p class="lead" data-i="prLead"></p>
      <div class="opt"><span class="ol" data-i="prOptWho"></span><div class="chips" id="prWhoSel">
        <button class="chip" data-val="1" data-i="prSolo"></button><button class="chip" data-val="cpu" data-i="prCpu"></button><button class="chip" data-val="2" data-i="prP2"></button><button class="chip" data-val="3" data-i="prP3"></button><button class="chip" data-val="4" data-i="prP4"></button></div></div>
      <div class="opt" id="prCpuOpt"><span class="ol" data-i="prOptCpu"></span><div class="chips" id="prCpuSel">
        <button class="chip" data-val="1" data-i="prCpu1"></button><button class="chip" data-val="2" data-i="prCpu2"></button><button class="chip" data-val="3" data-i="prCpu3"></button></div></div>
      <div class="opt"><span class="ol" data-i="prOptN"></span><div class="chips" id="prNSel">
        <button class="chip num" data-val="8">8</button><button class="chip num" data-val="12">12</button><button class="chip num" data-val="16">16</button><button class="chip num" data-val="20">20</button></div></div>
      <div class="opt"><span class="ol" data-i="prOptSet"></span><div class="chips" id="prSetSel">
        <button class="chip" data-val="animal" data-i="prSetAnimal"></button><button class="chip" data-val="food" data-i="prSetFood"></button><button class="chip" data-val="flag" data-i="prSetFlag"></button><button class="chip" data-val="dots" data-i="prSetDots"></button><button class="chip" data-val="photo" data-i="prSetPhoto"></button></div></div>
      <div class="opt"><span class="ol" data-i="prOptPeek"></span><div class="chips" id="prPeekSel">
        <button class="chip" data-val="0" data-i="off"></button><button class="chip" data-val="3" data-i="prPeek3"></button></div></div>
      <div class="opt"><span class="ol" data-i="prOptSwap"></span><div class="chips" id="prSwapSel">
        <button class="chip" data-val="0" data-i="off"></button><button class="chip" data-val="1" data-i="on"></button></div></div>
    </div>
    <div class="panel" id="prPhotoPanel">
      <h2 data-i="prPhotoTitle"></h2>
      <p class="lead" data-i="prPhotoLead"></p>
      <div class="prph" id="prPhotos"></div>
      <p class="lead" id="prPhotoCnt" style="margin-top:8px"></p>
      <label class="btn line prAdd"><input type="file" accept="image/*" multiple id="prFile"><i class="ic" data-ic="spark"></i><span data-i="prPhotoAdd"></span></label>
    </div>
    <div class="panel">
      <h2 data-i="prRec"></h2>
      <div class="best"><i class="ic" data-ic="trophy"></i><span id="prBestLbl"></span><b class="num" id="prBest"></b></div>
    </div>
  </div>
  <div class="vw" data-v="play">
    <div class="phead"><button class="btn icon" id="prQuit" aria-label="quit"><i class="ic" data-ic="x"></i></button><b class="num prog" id="prProg"></b><span class="sp"></span><span class="timer num" id="prTime"></span></div>
    <div class="prpl" id="prPl"></div>
    <div class="banner prfb" id="prFb"></div>
    <div class="prgrid" id="prGrid"></div>
  </div>
</section>`,function(){
const AN=["🐶","🐱","🐰","🐻","🐼","🦊","🐸","🐵","🐧","🐤","🐷","🐮","🦁","🐯"];
const FD=["🍎","🍌","🍇","🍓","🍒","🍑","🍉","🍋","🍞","🍩","🍙","🍰","🥕","🌽"];
const FL="ae ar at au be br ca ch cl cn co cu cz de dk eg es fi fr gb gh gr id ie in it jm jp ke kr ma mx my ng nl no np nz pe ph pl pt ru sa se sg th tr tw ua us vn za".split(" ");
const PCOL=["--c-count","--c-clock","--c-add","--c-hb"];
const MAXPH=10;
const emo=e=>`<em>${e}</em>`;
// 数のドット（10のわく：上の段から5こずつ）
function dots(k){ let h=""; for(let i=0;i<k;i++){ const r=k<=5?0:Math.floor(i/5), c=k<=5?i:i%5, n=k<=5?k:(r?k-5:5); const x=50+(c-(n-1)/2)*18, y=k<=5?50:36+r*28; h+=`<circle cx="${x}" cy="${y}" r="7.5"/>`; }
  return `<svg class="dots" viewBox="0 0 100 100">${h}</svg>`; }

const PR={
  s:Object.assign({who:"1",cpu:"2",n:"12",set:"animal",peek:"0",swap:"0"},store.get("b_pr",{})),
  photos:store.get("b_pr_photos",[]),
  st:null,rf:[],timer:0,
  save(){ store.set("b_pr",this.s); },
  init(){
    this.pane=$('[data-pane="pair"]');
    [["#prWhoSel","who"],["#prCpuSel","cpu"],["#prNSel","n"],["#prSetSel","set"],["#prPeekSel","peek"],["#prSwapSel","swap"]]
      .forEach(([sel,k])=>this.rf.push(chips($(sel),()=>this.s[k],v=>{this.s[k]=v;this.save()},()=>this.refresh())));
    $("#prQuit").onclick=()=>this.quit();
    $("#prGrid").addEventListener("click",e=>{ const b=e.target.closest("[data-c]"); if(b) this.tap(+b.dataset.c); });
    $("#prFile").addEventListener("change",e=>{ this.addPhotos([...e.target.files]); e.target.value=""; });
    $("#prPhotos").addEventListener("click",e=>{ const b=e.target.closest("[data-del]"); if(!b) return; this.photos.splice(+b.dataset.del,1); this.savePhotos(); this.paintPhotos(); });
    this.refresh();
  },
  key0(){ return `${this.s.n}-${this.s.set==="dots"?"dots":"pic"}`; },
  refresh(){ this.rf.forEach(f=>f()); const s=this.s;
    $("#prCpuOpt").hidden=s.who!=="cpu"; $("#prPhotoPanel").hidden=s.set!=="photo"; this.paintPhotos();
    if(s.who==="1"){ const b=store.get("b_pr_best",{})[this.key0()]; $("#prBestLbl").textContent=t("prBestOf",{n:s.n}); $("#prBest").textContent=b?t("prTimes",{n:b}):"—"; }
    else if(s.who==="cpu"){ const w=store.get("b_pr_win",{})[s.cpu]||0; $("#prBestLbl").textContent=t("prWinsOf",{lv:t("prCpu"+s.cpu)}); $("#prBest").textContent=t("prTimes",{n:w}); }
    else { $("#prBestLbl").textContent=t("prNoRec"); $("#prBest").textContent=""; } },
  /* 写真：その端末の中だけ（160pxの正方形に縮めて保存） */
  savePhotos(){ try{ localStorage.setItem("b_pr_photos",JSON.stringify(this.photos)); return true; }catch(e){ return false; } },
  paintPhotos(){ const need=+this.s.n/2;
    $("#prPhotos").innerHTML=this.photos.map((p,i)=>`<span class="ph"><img src="${p}" alt=""><button class="phx" data-del="${i}" aria-label="delete"><i class="ic" data-ic="x"></i></button></span>`).join("");
    paintIcons($("#prPhotos"));
    $("#prPhotoCnt").textContent=t("prPhotoCnt",{n:this.photos.length,need}); },
  async addPhotos(files){ for(const f of files){ if(this.photos.length>=MAXPH){ toast(t("prPhotoMax",{n:MAXPH})); break; }
      try{ const d=await this.shrink(f); this.photos.push(d); if(!this.savePhotos()){ this.photos.pop(); toast(t("prPhotoFull")); break; } }catch(e){ toast(t("prPhotoNg")); } }
    this.paintPhotos(); },
  shrink(f){ return new Promise((res,rej)=>{ const u=URL.createObjectURL(f), im=new Image();
    im.onload=()=>{ const S=160, s=Math.min(im.naturalWidth,im.naturalHeight); const c=document.createElement("canvas"); c.width=c.height=S;
      c.getContext("2d").drawImage(im,(im.naturalWidth-s)/2,(im.naturalHeight-s)/2,s,s,0,0,S,S); URL.revokeObjectURL(u); res(c.toDataURL("image/jpeg",.72)); };
    im.onerror=()=>{ URL.revokeObjectURL(u); rej(); }; im.src=u; }); },
  faces(set,P){ const same=a=>a.map(h=>({a:h,b:h}));
    if(set==="food") return same(shuffle([...FD]).slice(0,P).map(emo));
    if(set==="flag") return same(shuffle([...FL]).slice(0,P).map(c=>`<img class="fl" src="flags/${c}.svg" alt="">`));
    if(set==="dots") return shuffle([1,2,3,4,5,6,7,8,9,10]).slice(0,P).map(k=>({a:`<b class="num">${k}</b>`,b:dots(k)}));
    if(set==="photo"){ const ph=shuffle([...this.photos]).slice(0,P).map(p=>`<img class="pp" src="${p}" alt="">`);
      if(ph.length<P) toast(t("prPhotoFill",{n:P-ph.length}));
      return same(ph.concat(shuffle([...AN]).slice(0,P-ph.length).map(emo))); }
    return same(shuffle([...AN]).slice(0,P).map(emo)); },
  view(v){ this.pane.dataset.v=v; if(mode==="pair") this.dock(); },
  dock(){ if(mode!=="pair") return; if(this.pane.dataset.v==="setup") return setDock(`<button class="btn primary big" data-act="start"><i class="ic" data-ic="play"></i>${esc(t("prStart"))}</button>`); setDock(""); },
  act(a){ if(a==="start") this.start(); },
  async start(){ const n=+this.s.n, P=n/2, s=this.s;
    const cards=[]; this.faces(s.set,P).forEach((f,i)=>{ cards.push({p:i,h:f.a}); cards.push({p:i,h:f.b}); });
    shuffle(cards).forEach(c=>{ c.up=false; c.done=false; });
    const players=s.who==="1"?[{n:t("prYou")}]:s.who==="cpu"?[{n:t("prYou")},{n:t("prCpuName"),cpu:true}]:[...Array(+s.who)].map((_,i)=>({n:t("prPlayer",{n:i+1})}));
    players.forEach(p=>p.sc=0);
    const st=this.st={cards,players,cur:0,open:[],moves:0,miss:0,combo:0,maxCombo:0,left:P,busy:false,t0:now(),mem:new Set(),done:false};
    const cols=n===20?5:4; const g=$("#prGrid"); g.style.setProperty("--cols",cols); g.style.setProperty("--rows",n/cols);
    g.innerHTML=cards.map((c,i)=>`<button class="prc" data-c="${i}" aria-label="card ${i+1}"><span class="bk"></span><span class="fr">${c.h}</span></button>`).join("");
    this.view("play"); this.prog(); this.paintPl(); this.fb("");
    clearInterval(this.timer); $("#prTime").textContent=fmtSec(0);
    if(+s.peek){ st.busy=true; cards.forEach((c,i)=>{ c.up=true; this.upd(i); st.mem.add(i); });
      for(let k=+s.peek;k>0;k--){ this.fb(t("prPeekNow",{n:k})); await wait(1000); if(st!==this.st) return; }
      cards.forEach((c,i)=>{ c.up=false; this.upd(i); }); this.fb(""); await wait(350); if(st!==this.st) return; st.busy=false; }
    st.t0=now(); this.timer=setInterval(()=>{ if(this.st===st&&!st.done) $("#prTime").textContent=fmtSec(now()-st.t0); },200);
    if(players.length>1) this.fb(t("prTurn",{p:players[0].n})); },
  upd(i){ const c=this.st.cards[i], b=$(`#prGrid [data-c="${i}"]`); if(!b) return;
    b.classList.toggle("up",c.up||c.done); b.classList.toggle("done",c.done);
    if(c.done&&this.st.players.length>1) b.style.setProperty("--pc",`var(${PCOL[c.who]})`); },
  prog(){ $("#prProg").textContent=t("prMoves",{n:this.st.moves}); },
  paintPl(){ const st=this.st, P=st.cards.length/2;
    if(st.players.length===1){ $("#prPl").innerHTML=`<span class="pp1">${esc(t("prFound",{n:P-st.left,all:P}))}</span>`; return; }
    $("#prPl").innerHTML=st.players.map((p,i)=>`<span class="pl${i===st.cur?" on":""}" style="--pc:var(${PCOL[i]})"><i class="kdot"></i>${esc(p.n)}<b class="num">${p.sc}</b></span>`).join(""); },
  fb(msg,cls){ $("#prFb").innerHTML=msg?`<span class="${cls||""}">${esc(msg)}</span>`:""; },
  tap(i){ const st=this.st; if(!st||st.busy||st.done) return; if(st.players[st.cur].cpu) return; this.flip(i); },
  flip(i){ const st=this.st, c=st.cards[i]; if(!c||c.up||c.done||st.open.length>=2) return false;
    c.up=true; this.upd(i); sfx.tap(); st.open.push(i); st.mem.add(i);
    if(st.open.length===2) this.check(); return true; },
  async check(){ const st=this.st; st.busy=true; st.moves++; this.prog();
    const [a,b]=st.open, A=st.cards[a], B=st.cards[b], multi=st.players.length>1;
    if(A.p===B.p){ await wait(380); if(st!==this.st) return;
      A.done=B.done=true; A.who=B.who=st.cur; st.players[st.cur].sc++; st.left--; st.combo++; st.maxCombo=Math.max(st.maxCombo,st.combo);
      this.upd(a); this.upd(b); st.open=[]; sfx.ok(); this.paintPl();
      this.fb(st.combo>=2?t("prCombo",{n:st.combo}):multi?t("prAgain",{p:st.players[st.cur].n}):t("prMatch"),"okc");
      if(!st.left){ st.done=true; await wait(800); if(st!==this.st) return; return this.finish(); } }
    else { await wait(950); if(st!==this.st) return;
      A.up=B.up=false; this.upd(a); this.upd(b); sfx.back(); st.open=[]; st.combo=0; st.miss++;
      if(multi){ st.cur=(st.cur+1)%st.players.length; this.paintPl(); this.fb(t("prTurn",{p:st.players[st.cur].n})); } else this.fb("");
      if(this.s.swap==="1"&&st.miss%3===0){ await this.swap(); if(st!==this.st) return; } }
    st.busy=false;
    if(st.players[st.cur].cpu) this.cpuTurn(); },
  // いれかわり：伏せてあるカードのうち2枚が入れかわる（見たことのあるカードを優先）
  async swap(){ const st=this.st; const down=st.cards.map((c,i)=>i).filter(i=>!st.cards[i].done&&!st.cards[i].up); if(down.length<3) return;
    const seen=shuffle(down.filter(i=>st.mem.has(i))); const pick=seen.length>=2?seen.slice(0,2):shuffle(down).slice(0,2); const [x,y]=pick;
    [st.cards[x],st.cards[y]]=[st.cards[y],st.cards[x]];
    const bx=$(`#prGrid [data-c="${x}"]`), by=$(`#prGrid [data-c="${y}"]`);
    $(".fr",bx).innerHTML=st.cards[x].h; $(".fr",by).innerHTML=st.cards[y].h;
    st.mem.delete(x); st.mem.delete(y);
    [bx,by].forEach(b=>{ b.classList.remove("sw"); void b.offsetWidth; b.classList.add("sw"); });
    sfx.flash(); this.fb(t("prSwapped"),"swc"); await wait(900); },
  // コンピューター：見たカードをおぼえている（つよいほど忘れにくい）
  async cpuTurn(){ const st=this.st, keep=[0,.3,.65,.93][+this.s.cpu]; st.busy=true;
    await wait(750); if(st!==this.st) return;
    const down=st.cards.map((c,i)=>i).filter(i=>!st.cards[i].done&&!st.cards[i].up);
    const known=down.filter(i=>st.mem.has(i)&&Math.random()<keep);
    const byP={}; known.forEach(i=>(byP[st.cards[i].p]=byP[st.cards[i].p]||[]).push(i));
    const pairK=Object.values(byP).find(a=>a.length>=2);
    const pickUnknown=ex=>{ const rest=down.filter(i=>i!==ex), unk=rest.filter(i=>!st.mem.has(i)), pool=unk.length?unk:rest; return pool[rnd(pool.length)]; };
    const first=pairK?pairK[0]:pickUnknown(-1);
    this.flip(first); await wait(700); if(st!==this.st) return;
    let second=pairK?pairK[1]:known.find(i=>i!==first&&st.cards[i].p===st.cards[first].p);
    if(second==null) second=pickUnknown(first);
    this.flip(second); },
  finish(){ const st=this.st, ms=now()-st.t0, P=st.cards.length/2, pl=st.players; clearInterval(this.timer);
    let o;
    if(pl.length===1){ const bm=store.get("b_pr_best",{}), k=this.key0(); const isBest=!bm[k]||st.moves<bm[k]; if(isBest){ bm[k]=st.moves; store.set("b_pr_best",bm); }
      o={big:String(st.moves),bigLbl:t("prMovesLbl"),isBest,stats:[[t("prTimeLbl"),fmtSec(ms)],[t("prMaxCombo"),st.maxCombo],[t("prAcc"),pct(P,st.moves)+"%"]]}; }
    else { const max=Math.max(...pl.map(p=>p.sc)), win=pl.filter(p=>p.sc===max);
      const big=win.length>1?t("prDraw"):t("prWin",{p:win[0].n});
      if(this.s.who==="cpu"&&win.length===1&&!win[0].cpu){ const w=store.get("b_pr_win",{}); w[this.s.cpu]=(w[this.s.cpu]||0)+1; store.set("b_pr_win",w); sfx.win(); }
      o={big,bigLbl:t("prMovesAll",{n:st.moves}),isBest:false,stats:pl.map(p=>[p.n,p.sc])}; }
    this.st=null; this.view("setup"); this.refresh();
    showResult(Object.assign({title:t("tPair"),retry:()=>this.start()},o)); },
  quit(){ clearInterval(this.timer); this.st=null; this.view("setup"); this.refresh(); }
};

return PR;
});
