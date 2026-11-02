// 45 Brain ゲーム：flash（開いたときだけ読み込まれる。共通の関数は index.html にある）
BRAIN.def("flash","  <section data-pane=\"flash\" data-v=\"setup\">\n    <div class=\"vw\" data-v=\"setup\">\n      <div class=\"panel\">\n        <h2 data-i=\"flTitle\"></h2>\n        <p class=\"lead\" id=\"flLeadP\"></p>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optFlMode\"></span><div class=\"chips\" id=\"flModeSel\">\n          <button class=\"chip\" data-val=\"pos\" data-i=\"flmPos\"></button><button class=\"chip\" data-val=\"seq\" data-i=\"flmSeq\"></button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optStartG\"></span><div class=\"chips\" id=\"flGSel\">\n          <button class=\"chip num\" data-val=\"3\">3×3</button><button class=\"chip num\" data-val=\"4\">4×4</button><button class=\"chip num\" data-val=\"5\">5×5</button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optSpeed\"></span><div class=\"chips\" id=\"flSpSel\">\n          <button class=\"chip\" data-val=\"slow\" data-i=\"spSlow\"></button><button class=\"chip\" data-val=\"normal\" data-i=\"spNormal\"></button><button class=\"chip\" data-val=\"fast\" data-i=\"spFast\"></button></div></div>\n        <div class=\"opt\"><span class=\"ol\" data-i=\"optFlags\"></span><div class=\"chips\" id=\"flFlagSel\">\n          <button class=\"chip\" data-val=\"1\" data-i=\"flagsOn\"></button><button class=\"chip\" data-val=\"0\" data-i=\"flagsOff\"></button></div></div>\n      </div>\n      <div class=\"panel\">\n        <h2 data-i=\"recTitle\"></h2>\n        <div class=\"best\"><i class=\"ic\" data-ic=\"trophy\"></i><span data-i=\"bestLv\"></span><b class=\"num\" id=\"flBestLv\"></b><span style=\"margin-left:12px\" data-i=\"best\"></span><b class=\"num\" id=\"flBest\"></b></div>\n      </div>\n    </div>\n    <div class=\"vw\" data-v=\"play\">\n      <div class=\"fhead\"><button class=\"btn icon\" id=\"flQuit\" aria-label=\"quit\"><i class=\"ic\" data-ic=\"x\"></i></button><b class=\"num lv\" id=\"flLv\"></b><span class=\"hearts\" id=\"flLives\"></span><span class=\"sp\" style=\"flex:1\"></span><b class=\"num\" style=\"font-size:22px\" id=\"flScore\"></b></div>\n      <div class=\"fmsg\" id=\"flMsg\"></div>\n      <div class=\"bonus\" id=\"flBonus\"></div>\n      <div class=\"fgrid\" id=\"flGrid\"></div>\n    </div>\n  </section>",function(){
/* ===== 国旗（flag-icons, MIT） [コード, 日本語, English, 繁體, 简体] ===== */
const COUNTRIES=[
["jp","日本","Japan","日本","日本"],["us","アメリカ","the United States","美國","美国"],["gb","イギリス","the United Kingdom","英國","英国"],["fr","フランス","France","法國","法国"],
["de","ドイツ","Germany","德國","德国"],["it","イタリア","Italy","義大利","意大利"],["es","スペイン","Spain","西班牙","西班牙"],["ca","カナダ","Canada","加拿大","加拿大"],
["br","ブラジル","Brazil","巴西","巴西"],["ar","アルゼンチン","Argentina","阿根廷","阿根廷"],["mx","メキシコ","Mexico","墨西哥","墨西哥"],["au","オーストラリア","Australia","澳洲","澳大利亚"],
["nz","ニュージーランド","New Zealand","紐西蘭","新西兰"],["cn","中国","China","中國","中国"],["kr","韓国","South Korea","韓國","韩国"],["tw","台湾","Taiwan","臺灣","台湾"],
["in","インド","India","印度","印度"],["th","タイ","Thailand","泰國","泰国"],["vn","ベトナム","Vietnam","越南","越南"],["ph","フィリピン","the Philippines","菲律賓","菲律宾"],
["id","インドネシア","Indonesia","印尼","印度尼西亚"],["my","マレーシア","Malaysia","馬來西亞","马来西亚"],["sg","シンガポール","Singapore","新加坡","新加坡"],["ru","ロシア","Russia","俄羅斯","俄罗斯"],
["ua","ウクライナ","Ukraine","烏克蘭","乌克兰"],["tr","トルコ","Türkiye","土耳其","土耳其"],["eg","エジプト","Egypt","埃及","埃及"],["za","南アフリカ","South Africa","南非","南非"],
["ng","ナイジェリア","Nigeria","奈及利亞","尼日利亚"],["ke","ケニア","Kenya","肯亞","肯尼亚"],["sa","サウジアラビア","Saudi Arabia","沙烏地阿拉伯","沙特阿拉伯"],["ae","アラブ首長国連邦","the United Arab Emirates","阿拉伯聯合大公國","阿联酋"],
["se","スウェーデン","Sweden","瑞典","瑞典"],["no","ノルウェー","Norway","挪威","挪威"],["fi","フィンランド","Finland","芬蘭","芬兰"],["dk","デンマーク","Denmark","丹麥","丹麦"],
["nl","オランダ","the Netherlands","荷蘭","荷兰"],["be","ベルギー","Belgium","比利時","比利时"],["ch","スイス","Switzerland","瑞士","瑞士"],["at","オーストリア","Austria","奧地利","奥地利"],
["pt","ポルトガル","Portugal","葡萄牙","葡萄牙"],["gr","ギリシャ","Greece","希臘","希腊"],["pl","ポーランド","Poland","波蘭","波兰"],["ie","アイルランド","Ireland","愛爾蘭","爱尔兰"],
["cl","チリ","Chile","智利","智利"],["co","コロンビア","Colombia","哥倫比亞","哥伦比亚"],["pe","ペルー","Peru","秘魯","秘鲁"],["ma","モロッコ","Morocco","摩洛哥","摩洛哥"],
["gh","ガーナ","Ghana","迦納","加纳"],["cz","チェコ","Czechia","捷克","捷克"],["jm","ジャマイカ","Jamaica","牙買加","牙买加"],["cu","キューバ","Cuba","古巴","古巴"],["np","ネパール","Nepal","尼泊爾","尼泊尔"]
];
const cName=c=>{ const r=COUNTRIES.find(x=>x[0]===c); if(!r) return ""; return lang==="ja"?r[1]:lang==="en"?r[2].replace(/^the /,"The "):lang==="zh-Hant"?r[3]:r[4]; };
const cEn=c=>{ const r=COUNTRIES.find(x=>x[0]===c); return r?r[2].replace(/^the /,"The "):""; };

/* =========================================================
   瞬間記憶（国旗）
   ========================================================= */
const FL={
  s:Object.assign({g:"3",sp:"normal",flags:"1",mode:"pos"},store.get("b_fl",{})),
  st:null,r:null,rf:[],
  save(){ store.set("b_fl",this.s); },
  init(){
    this.pane=$('[data-pane="flash"]');
    this.rf.push(chips($("#flModeSel"),()=>this.s.mode,v=>{this.s.mode=v;this.save()},()=>this.refresh()));
    this.rf.push(chips($("#flGSel"),()=>this.s.g,v=>{this.s.g=v;this.save()}));
    this.rf.push(chips($("#flSpSel"),()=>this.s.sp,v=>{this.s.sp=v;this.save()}));
    this.rf.push(chips($("#flFlagSel"),()=>this.s.flags,v=>{this.s.flags=v;this.save()}));
    $("#flQuit").onclick=()=>this.quit();
    $("#flGrid").addEventListener("click",e=>{ const b=e.target.closest("[data-c]"); if(b) this.tap(+b.dataset.c,b); });
    this.refresh();
  },
  bkey(){ return this.s.mode==="seq"?"b_fl_best_seq":"b_fl_best"; },
  refresh(){ this.rf.forEach(f=>f()); $("#flLeadP").innerHTML=t(this.s.mode==="seq"?"flLeadSeq":"flLead");
    const b=store.get(this.bkey(),{lv:0,score:0}); $("#flBestLv").textContent=b.lv||"—"; $("#flBest").textContent=b.score||"—"; },
  view(v){ this.pane.dataset.v=v; if(mode==="flash") this.dock(); },
  dock(){ if(this.pane.dataset.v==="setup") return setDock(`<button class="btn primary big" data-act="start"><i class="ic" data-ic="play"></i>${esc(t("start"))}</button>`);
    const r=this.r; if(r&&r.phase==="done") setDock(`<button class="btn primary big" data-act="nextlv">${esc(t("nextLv"))}<i class="ic" data-ic="next"></i></button>`);
    else if(r&&r.phase==="retry") setDock(`<button class="btn primary big" data-act="retrylv"><i class="ic" data-ic="repeat"></i>${esc(t("flRetry"))}</button>`); else setDock(""); },
  act(a){ if(a==="start") this.start(); else if(a==="nextlv"){ this.st.L++; this.round(); } else if(a==="retrylv") this.round(); },
  start(){ this.st={L:1,lives:3,score:0,id:Math.random(),mode:this.s.mode}; this.view("play"); this.round(); },
  head(){ const st=this.st; $("#flLv").textContent=`${t("level")} ${st.L}`; $("#flScore").textContent=st.score;
    $("#flLives").innerHTML=[0,1,2].map(i=>`<i class="ic${i<st.lives?"":" lost"}">${ico("heartf")}</i>`).join(""); },
  msg(s){ $("#flMsg").innerHTML=s; },
  async round(){ if(this.st.mode==="seq") return this.roundSeq(); const st=this.st,id=st.id; const k0=2+st.L; let g=Math.max(+this.s.g,Math.ceil(Math.sqrt(k0/.4))); g=Math.min(g,7); const k=Math.min(k0,g*g-2);
    const cells=shuffle([...Array(g*g).keys()]).slice(0,k); const codes=shuffle(COUNTRIES.map(c=>c[0])).slice(0,k); const flag={}; cells.forEach((c,i)=>flag[c]=codes[i]);
    this.r={g,k,cells,set:new Set(cells),flag,found:new Set(),miss:0,phase:"ready"};
    const grid=$("#flGrid"); grid.style.setProperty("--n",g); grid.innerHTML=[...Array(g*g).keys()].map(i=>`<button data-c="${i}" aria-label="${i+1}"></button>`).join("");
    if(this.s.flags==="1") await Promise.all(codes.map(c=>new Promise(res=>{ const im=new Image(); im.onload=im.onerror=res; im.src=`flags/${c}.svg`; })));
    $("#flBonus").innerHTML=""; this.head(); this.dock(); this.msg(esc(t("flReady"))); await wait(800); if(!this.alive(id)) return;
    this.r.phase="show"; this.msg(esc(t("flLook"))); sfx.flash();
    cells.forEach(c=>{ const b=grid.children[c]; b.classList.add("lit"); if(this.s.flags==="1") b.innerHTML=`<img src="flags/${flag[c]}.svg" alt="">`; });
    const base={slow:1300,normal:800,fast:450}[this.s.sp]||800; await wait(base*(1+.06*k)); if(!this.alive(id)) return;
    cells.forEach(c=>{ const b=grid.children[c]; b.classList.remove("lit"); b.innerHTML=""; });
    this.r.phase="input"; this.msg(esc(t("flTap",{n:k}))); },
  alive(id){ return this.st&&this.st.id===id&&this.pane.dataset.v==="play"; },
  async roundSeq(){ const st=this.st,id=st.id; const k0=2+st.L; let g=Math.max(+this.s.g,Math.ceil(Math.sqrt(k0+3))); g=Math.min(g,7); const k=Math.min(k0,g*g-1);
    const cells=shuffle([...Array(g*g).keys()]).slice(0,k); const codes=shuffle(COUNTRIES.map(c=>c[0])).slice(0,k); const flag={}; cells.forEach((c,i)=>flag[c]=codes[i]);
    this.r={seq:true,g,k,cells,set:new Set(cells),flag,pos:0,found:new Set(),miss:0,phase:"ready"};
    const grid=$("#flGrid"); grid.style.setProperty("--n",g); grid.innerHTML=[...Array(g*g).keys()].map(i=>`<button data-c="${i}" aria-label="${i+1}"></button>`).join("");
    if(this.s.flags==="1") await Promise.all(codes.map(c=>new Promise(res=>{ const im=new Image(); im.onload=im.onerror=res; im.src=`flags/${c}.svg`; })));
    $("#flBonus").innerHTML=""; this.head(); this.dock(); this.msg(esc(t("flReady"))); await wait(800); if(!this.alive(id)) return;
    this.r.phase="show"; this.msg(esc(t("flLook")));
    const on={slow:1000,normal:650,fast:400}[this.s.sp]||650, gap={slow:300,normal:220,fast:150}[this.s.sp]||220;
    for(let j=0;j<k;j++){ const c=cells[j],b=grid.children[c]; b.classList.add("lit"); if(this.s.flags==="1") b.innerHTML=`<img src="flags/${flag[c]}.svg" alt="">`;
      tone(523*Math.pow(2,j/12*2),.12,"sine",.12); await wait(on); if(!this.alive(id)) return; b.classList.remove("lit"); b.innerHTML=""; await wait(gap); if(!this.alive(id)) return; }
    this.r.phase="input"; this.msg(esc(t("flTapSeq",{i:0,k}))); },
  tapSeq(i,b){ const r=this.r,st=this.st; if(r.phase!=="input"||r.found.has(i)) return; const grid=$("#flGrid");
    if(i===r.cells[r.pos]){ r.found.add(i); r.pos++; b.classList.add("got"); b.innerHTML=`<b class="nob">${r.pos}</b>`; st.score+=10*st.L; tone(523*Math.pow(2,(r.pos-1)/12*2),.1,"triangle",.12); this.head();
      if(r.pos===r.k) this.clearSeq(); else this.msg(esc(t("flTapSeq",{i:r.pos,k:r.k}))); return; }
    b.classList.add("bad"); b.innerHTML=`<i class="ic">${ico("x")}</i>`; st.lives--; sfx.ng(); this.head(); r.phase="missed";
    this.msg(`<span style="color:var(--danger)">${esc(t("flMissSeq"))}</span>`);
    r.cells.forEach((c,j)=>{ if(j<r.pos) return; const x=grid.children[c]; x.classList.add("ans"); x.innerHTML=(this.s.flags==="1"?`<img src="flags/${r.flag[c]}.svg" alt="">`:"")+`<span class="no">${j+1}</span>`; });
    const id=st.id; if(st.lives<=0){ this.over(); return; } setTimeout(()=>{ if(!this.alive(id)||this.r!==r) return; r.phase="retry"; this.dock(); },700); },
  async clearSeq(){ const r=this.r,st=this.st,id=st.id; r.phase="cleared"; st.score+=50; sfx.ok(); this.msg(`<span style="color:var(--ok)">${esc(t("flPerfect",{n:50}))}</span>`); this.head();
    if(this.s.flags==="1"){ await wait(500); if(!this.alive(id)) return; const grid=$("#flGrid");
      r.cells.forEach((c,j)=>{ const x=grid.children[c]; x.classList.remove("got"); x.classList.add("ans"); x.innerHTML=`<img src="flags/${r.flag[c]}.svg" alt=""><span class="no">${j+1}</span>`; }); }
    await wait(300); if(!this.alive(id)) return; r.phase="done"; this.dock(); },
  tap(i,b){ const r=this.r,st=this.st; if(!r||!st) return; if(r.seq) return this.tapSeq(i,b);
    if(r.phase==="bonus") return this.bonusTap(i,b);
    if(r.phase!=="input"||r.found.has(i)||b.classList.contains("bad")) return;
    if(r.set.has(i)){ r.found.add(i); b.classList.add("got"); b.innerHTML=`<i class="ic">${ico("check")}</i>`; st.score+=10*st.L; sfx.hit(); this.head();
      if(r.found.size===r.k) this.clear(); else this.msg(esc(t("flTap",{n:r.k-r.found.size}))); }
    else { b.classList.add("bad"); b.innerHTML=`<i class="ic">${ico("x")}</i>`; r.miss++; st.lives--; sfx.ng(); this.head(); if(st.lives<=0) this.over(); } },
  async clear(){ const r=this.r,st=this.st,id=st.id; r.phase="cleared"; let m=t("flClear");
    if(r.miss===0){ st.score+=50; m=t("flPerfect",{n:50}); } sfx.ok(); this.msg(`<span style="color:var(--ok)">${esc(m)}</span>`); this.head();
    if(this.s.flags!=="1"){ await wait(500); if(!this.alive(id)) return; r.phase="done"; this.dock(); return; }
    await wait(800); if(!this.alive(id)) return;
    const grid=$("#flGrid"); r.cells.forEach(c=>{ const b=grid.children[c]; b.classList.remove("got"); b.innerHTML=""; b.style.boxShadow="inset 0 0 0 2px var(--ok)"; });
    $$("#flGrid .bad").forEach(b=>{ b.classList.remove("bad"); b.innerHTML=""; });
    r.bq=r.cells[rnd(r.cells.length)]; const code=r.flag[r.bq]; r.phase="bonus";
    this.msg(esc(t("flBonusQ"))); $("#flBonus").innerHTML=`<img class="pop" src="flags/${code}.svg" alt=""><div class="nm"><b>${esc(cName(code))}</b>${lang!=="en"?`<br><span style="color:var(--muted)">${esc(cEn(code))}</span>`:""}</div>`;
    speak(cEn(code)); },
  async bonusTap(i,b){ const r=this.r,st=this.st,id=st.id; if(!r.set.has(i)) return; r.phase="bonusdone"; const grid=$("#flGrid");
    if(i===r.bq){ st.score+=30; sfx.ok(); this.msg(`<span style="color:var(--ok)">${esc(t("flBonusOk",{n:30}))}</span>`); b.classList.add("got"); }
    else { sfx.ng(); this.msg(`<span style="color:var(--danger)">${esc(t("flBonusNg"))}</span>`); b.classList.add("bad"); }
    r.cells.forEach(c=>{ const x=grid.children[c]; x.style.boxShadow=""; x.innerHTML=`<img src="flags/${r.flag[c]}.svg" alt="">`; if(c===r.bq) x.classList.add("ans"); });
    this.head(); await wait(300); if(!this.alive(id)) return; r.phase="done"; this.dock(); },
  async over(){ const st=this.st,r=this.r,id=st.id; r.phase="over"; this.msg(`<span style="color:var(--danger)">${esc(t("gameOver"))}</span>`);
    const grid=$("#flGrid"); if(!r.seq) r.cells.forEach(c=>{ if(!r.found.has(c)){ const b=grid.children[c]; b.classList.add("ans"); if(this.s.flags==="1") b.innerHTML=`<img src="flags/${r.flag[c]}.svg" alt="">`; } });
    await wait(r.seq?2000:1400); if(!this.alive(id)) return;
    const reached=st.L,bk=st.mode==="seq"?"b_fl_best_seq":"b_fl_best"; const b=store.get(bk,{lv:0,score:0}); const isBest=st.score>(b.score||0)||reached>(b.lv||0);
    store.set(bk,{lv:Math.max(b.lv||0,reached),score:Math.max(b.score||0,st.score)});
    const score=st.score; this.st=null; this.r=null; this.view("setup"); this.refresh();
    showResult({title:`${t("tFlash")}（${t(bk==="b_fl_best_seq"?"flmSeq":"flmPos")}）`,big:`${t("level")} ${reached}`,bigLbl:t("reachLv"),isBest,stats:[[t("score"),score],[t("bestLv"),store.get(bk,{}).lv]],retry:()=>this.start()}); },
  quit(){ this.st=null; this.r=null; this.view("setup"); this.refresh(); }
};

return FL;
});
