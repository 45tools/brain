const C="brain-2026.11.03-2";
const FILES=["./", "index.html", "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png", "count/", "count/index.html", "games/count.js", "count/icon-180.png", "flash/", "flash/index.html", "games/flash.js", "flash/icon-180.png", "hb/", "hb/index.html", "games/hb.js", "hb/icon-180.png", "add/", "add/index.html", "games/add.js", "add/icon-180.png", "clock/", "clock/index.html", "games/clock.js", "clock/icon-180.png", "flags/ae.svg", "flags/ar.svg", "flags/at.svg", "flags/au.svg", "flags/be.svg", "flags/br.svg", "flags/ca.svg", "flags/ch.svg", "flags/cl.svg", "flags/cn.svg", "flags/co.svg", "flags/cu.svg", "flags/cz.svg", "flags/de.svg", "flags/dk.svg", "flags/eg.svg", "flags/es.svg", "flags/fi.svg", "flags/fr.svg", "flags/gb.svg", "flags/gh.svg", "flags/gr.svg", "flags/id.svg", "flags/ie.svg", "flags/in.svg", "flags/it.svg", "flags/jm.svg", "flags/jp.svg", "flags/ke.svg", "flags/kr.svg", "flags/ma.svg", "flags/mx.svg", "flags/my.svg", "flags/ng.svg", "flags/nl.svg", "flags/no.svg", "flags/np.svg", "flags/nz.svg", "flags/pe.svg", "flags/ph.svg", "flags/pl.svg", "flags/pt.svg", "flags/ru.svg", "flags/sa.svg", "flags/se.svg", "flags/sg.svg", "flags/th.svg", "flags/tr.svg", "flags/tw.svg", "flags/ua.svg", "flags/us.svg", "flags/vn.svg", "flags/za.svg"];
// 入れるときは必ずサーバーから取り直す（端末に残った古い版を使わない）
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:"reload"})))).catch(()=>{}));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
// いつもネット上の最新を確認し、つながらないときだけ保存版を使う
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET"||!r.url.startsWith(self.location.origin)) return;
  const key=r.url.split("#")[0].split("?")[0];
  e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(C).then(c=>c.put(key,cp)); } return res; })
    .catch(()=>caches.match(key).then(m=>m||caches.match(r,{ignoreSearch:true})).then(m=>m||(r.mode==="navigate"?caches.match(new URL("index.html",self.registration.scope).href):undefined))));
});
