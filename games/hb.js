// 45 Brain ゲーム：hb（開いたときだけ読み込まれる。共通の関数は index.html にある）
BRAIN.def("hb","  <section data-pane=\"hb\" data-v=\"setup\">\n    <div class=\"vw\" data-v=\"setup\">\n      <div class=\"panel\">\n        <h2 data-i=\"hbTitle\"></h2>\n        <p class=\"lead\" id=\"hbRule\"></p>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optPlayers\"></span><div class=\"chips\" id=\"hbPSel\">\n          <button class=\"chip\" data-val=\"1\" data-i=\"p1\"></button><button class=\"chip num\" data-val=\"2\">2</button><button class=\"chip num\" data-val=\"3\">3</button><button class=\"chip num\" data-val=\"4\">4</button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optDigits\"></span><div class=\"chips\" id=\"hbDSel\">\n          <button class=\"chip\" data-val=\"3\"></button><button class=\"chip\" data-val=\"4\"></button></div></div>\n        <div class=\"opt\" id=\"hbNamesWrap\"><span class=\"ol\" data-i=\"namesLbl\"></span><div class=\"names\" id=\"hbNames\"></div></div>\n      </div>\n      <div class=\"panel\">\n        <h2 data-i=\"recTitle\"></h2>\n        <div class=\"best\"><i class=\"ic\" data-ic=\"trophy\"></i><span data-i=\"hbBest\"></span><b class=\"num\" id=\"hbBest\"></b></div>\n      </div>\n    </div>\n    <div class=\"vw\" data-v=\"play\">\n      <div class=\"phead\"><button class=\"btn icon\" id=\"hbQuit\" aria-label=\"quit\"><i class=\"ic\" data-ic=\"x\"></i></button><b id=\"hbHead\" style=\"font-size:15px\"></b></div>\n      <div id=\"hbBody\"></div>\n    </div>\n  </section>",function(){
/* =========================================================
   数当て（ヒット＆ブロー）
   ========================================================= */
const HB={
  s:Object.assign({p:"2",d:"3",names:["","","",""]},store.get("b_hb",{})),
  st:null,rf:[],
  save(){ store.set("b_hb",this.s); },
  init(){
    this.pane=$('[data-pane="hb"]');
    this.rf.push(chips($("#hbPSel"),()=>this.s.p,v=>{this.s.p=v;this.save()},()=>this.renderNames()));
    this.rf.push(chips($("#hbDSel"),()=>this.s.d,v=>{this.s.d=v;this.save()}));
    $("#hbQuit").onclick=()=>this.quit();
    $("#hbBody").addEventListener("click",e=>{ const m=e.target.closest("[data-memo]"); if(m) return this.memo(+m.dataset.memo); const ey=e.target.closest("[data-eye]"); if(ey){ this.st.show=!this.st.show; this.render(); } });
    this.refresh();
  },
  pname(i){ return (this.s.names[i]||"").trim()||t("playerN",{n:i+1}); },
  renderNames(){ const P=+this.s.p; $("#hbNamesWrap").hidden=P<2;
    $("#hbNames").innerHTML=[...Array(Math.max(P,1)).keys()].map(i=>`<input data-ni="${i}" maxlength="10" placeholder="${esc(t("playerN",{n:i+1}))}" value="${esc(this.s.names[i]||"")}">`).join("");
    $$("#hbNames input").forEach(inp=>inp.addEventListener("input",()=>{ this.s.names[+inp.dataset.ni]=inp.value; this.save(); })); },
  refresh(){ this.rf.forEach(f=>f()); $("#hbRule").innerHTML=t("hbRule"); $$("#hbDSel [data-val]").forEach(b=>b.textContent=t("digitsN",{n:b.dataset.val}));
    this.renderNames(); const b=store.get("b_hb_best",{})[this.s.d]; $("#hbBest").textContent=b?`${b}${t("tries")}`:"—"; },
  view(v){ this.pane.dataset.v=v; if(mode==="hb") this.dock(); },
  randSecret(d){ return shuffle([..."0123456789"]).slice(0,d).join(""); },
  start(){ const P=+this.s.p,D=+this.s.d;
    this.st={P,D,phase:P===1?"play":"pass",cur:0,input:"",show:false,res:null,
      pl:[...Array(Math.max(P,1)).keys()].map(i=>({name:this.pname(i),secret:P===1?this.randSecret(D):"",hist:[],memo:Array(10).fill(0)}))};
    this.view("play"); this.render(); },
  target(a){ const st=this.st; return st.P===1?0:(a+1)%st.P; },
  render(){ const st=this.st,B=$("#hbBody"); if(!st) return; const P=st.P,D=st.D;
    const boxes=(s,hide)=>`<div class="digits">${[...Array(D).keys()].map(i=>`<b class="num${i===s.length?" on":""}">${s[i]!=null?(hide?"●":s[i]):""}</b>`).join("")}</div>`;
    if(st.phase==="pass"){ const p=st.pl[st.cur]; $("#hbHead").textContent=t("tHb");
      B.innerHTML=`<div class="hbcard"><h3>${esc(t("hbPass",{name:p.name}))}</h3><p>${esc(t("hbPassSub"))}</p><p style="font-size:44px;margin:10px 0 0">🤫</p></div>`; }
    else if(st.phase==="secret"){ const p=st.pl[st.cur]; $("#hbHead").textContent=t("hbSetTitle",{name:p.name});
      B.innerHTML=`<div class="hbcard">${boxes(st.input,!st.show)}<button class="btn" data-eye style="margin-top:8px"><i class="ic" data-ic="${st.show?"eyeoff":"eye"}"></i>${esc(t(st.show?"hide":"show"))}</button></div>`; }
    else if(st.phase==="allset"){ $("#hbHead").textContent=t("tHb");
      B.innerHTML=`<div class="hbcard"><h3>${esc(t("hbAllSet"))}</h3><p>${esc(t("hbStartFrom",{name:st.pl[0].name}))}</p></div>`; }
    else if(st.phase==="play"||st.phase==="result"){ const a=st.cur,p=st.pl[a];
      $("#hbHead").textContent=P===1?t("hbVsSolo"):t("hbVs",{a:p.name,b:st.pl[this.target(a)].name});
      const hist=p.hist.map((h,i)=>`<div class="hrow${i===p.hist.length-1&&st.phase==="result"?" last":""}"><span class="n num">${i+1}</span><span class="g num">${h.g}</span><span class="r">${sbHTML(h.h,h.b,D)}</span></div>`).join("");
      const res=st.phase==="result"&&st.res?`<div class="hbres pop">${t("hbHB",{h:st.res.h,b:st.res.b})}</div>`:"";
      B.innerHTML=`<div class="hbcard" style="padding:8px 12px">${P>1?`<p style="margin:0">${esc(t("hbTurn",{name:p.name}))}</p>`:""}${st.phase==="result"?res:boxes(st.input,false)}</div>`
        +`<div class="memo"><h4>${esc(t("memo"))}</h4><div class="mrow">${p.memo.map((m,i)=>`<button class="num${m===1?" x":m===2?" o":""}" data-memo="${i}">${i}</button>`).join("")}</div></div>`
        +`<p class="legend">${t("hbLegend")}</p>`+(p.hist.length?`<div class="hist"><h4>${esc(t("hbHist"))}</h4>${hist}</div>`:""); }
    else if(st.phase==="win"){ const p=st.pl[st.cur]; $("#hbHead").textContent=t("tHb");
      B.innerHTML=`<div class="hbcard"><p style="font-size:44px;margin:0">🎉</p><h3>${esc(P===1?t("hbSolo",{n:p.hist.length}):t("hbWin",{name:p.name}))}</h3>${P>1?`<p>${esc(t("hbWinSub",{n:p.hist.length}))}</p>`:""}
        <div class="cmph">${esc(t("secrets"))}</div><div class="secrets">${P===1?`<span><b class="num">${st.pl[0].secret}</b></span>`:st.pl.map(x=>`<span>${esc(x.name)}<b class="num">${x.secret}</b></span>`).join("")}</div></div>`
        +`<div class="hist"><h4>${esc(t("hbHist"))}</h4>${p.hist.map((h,i)=>`<div class="hrow"><span class="n num">${i+1}</span><span class="g num">${h.g}</span><span class="r">${sbHTML(h.h,h.b,D)}</span></div>`).join("")}</div>`; }
    paintIcons(B); this.dock(); },
  dock(){ if(mode!=="hb") return; if(this.pane.dataset.v==="setup") return setDock(`<button class="btn primary big" data-act="start"><i class="ic" data-ic="play"></i>${esc(t("start"))}</button>`);
    const st=this.st; if(!st) return; const used=new Set(st.input.split(""));
    if(st.phase==="pass") setDock(`<button class="btn primary big" data-act="ready">${esc(t("ready"))}</button>`);
    else if(st.phase==="secret") setDock(kpHTML(t("decide"),st.input.length<st.D,used),true);
    else if(st.phase==="allset") setDock(`<button class="btn primary big" data-act="begin"><i class="ic" data-ic="play"></i>${esc(t("begin"))}</button>`);
    else if(st.phase==="play") setDock(kpHTML(t("answer"),st.input.length<st.D,used),true);
    else if(st.phase==="result") setDock(`<button class="btn primary big" data-act="pass">${esc(st.P===1?t("next"):t("hbNext",{name:st.pl[(st.cur+1)%st.P].name}))}<i class="ic" data-ic="next"></i></button>`);
    else if(st.phase==="win") setDock(`<div class="row2"><button class="btn" data-act="setup">${esc(t("close"))}</button><button class="btn primary" data-act="again"><i class="ic" data-ic="repeat"></i>${esc(t("retry"))}</button></div>`,true); },
  act(a){ const st=this.st;
    if(a==="start") return this.start();
    if(!st) return;
    if(a==="ready"){ st.phase="secret"; st.input=""; st.show=false; }
    else if(a==="begin"){ st.phase="play"; st.cur=0; st.input=""; }
    else if(a==="pass"){ st.cur=(st.cur+1)%st.P; st.phase="play"; st.input=""; st.res=null; }
    else if(a==="again") return this.start();
    else if(a==="setup") return this.quit();
    this.render(); },
  key(k){ const st=this.st; if(!st||this.pane.dataset.v!=="play"||!(st.phase==="secret"||st.phase==="play")) return;
    if(k==="del"){ st.input=st.input.slice(0,-1); }
    else if(k==="ok"){ if(st.input.length<st.D) return; return st.phase==="secret"?this.setSecret():this.guess(); }
    else { if(st.input.length>=st.D||st.input.includes(k)) return; st.input+=k; }
    sfx.tap(); this.render(); },
  setSecret(){ const st=this.st; st.pl[st.cur].secret=st.input; st.input=""; sfx.ok();
    if(st.cur+1<st.P){ st.cur++; st.phase="pass"; } else { st.phase="allset"; st.cur=0; } this.render(); },
  guess(){ const st=this.st,p=st.pl[st.cur],g=st.input; if(p.hist.some(h=>h.g===g)){ toast(t("hbGuessNo")); return; }
    const sec=st.pl[this.target(st.cur)].secret; let h=0,b=0; for(let i=0;i<g.length;i++){ if(g[i]===sec[i]) h++; else if(sec.includes(g[i])) b++; }
    p.hist.push({g,h,b}); st.input=""; st.res={h,b};
    if(h===st.D){ st.phase="win"; sfx.win(); if(st.P===1){ const bm=store.get("b_hb_best",{}); if(!bm[st.D]||p.hist.length<bm[st.D]){ bm[st.D]=p.hist.length; store.set("b_hb_best",bm); toast(t("newBest")); } } }
    else { (h||b)?sfx.hit():sfx.tap(); st.phase=st.P===1?"play":"result"; if(st.P===1) toast(`${g} → ${h}S ${b}B`); }
    this.render(); },
  memo(i){ const st=this.st; if(!st) return; const p=st.pl[st.cur]; p.memo[i]=(p.memo[i]+1)%3; sfx.tap(); this.render(); },
  quit(){ this.st=null; this.view("setup"); this.refresh(); }
};

function sbHTML(h,b,D){ const dots=(n,c)=>[...Array(D).keys()].map(i=>`<i class="${i<n?c:""}"></i>`).join(""); return `<span class="sb"><em class="s">S</em>${dots(h,"s")}<em class="b">B</em>${dots(b,"b")}</span>`; }

return HB;
});
