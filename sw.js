const C="brain-2026.10.29-1";
const FILES=["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "flags/jp.svg", "flags/us.svg", "flags/gb.svg", "flags/fr.svg", "flags/de.svg", "flags/it.svg", "flags/es.svg", "flags/ca.svg", "flags/br.svg", "flags/ar.svg", "flags/mx.svg", "flags/au.svg", "flags/nz.svg", "flags/cn.svg", "flags/kr.svg", "flags/tw.svg", "flags/in.svg", "flags/th.svg", "flags/vn.svg", "flags/ph.svg", "flags/id.svg", "flags/my.svg", "flags/sg.svg", "flags/ru.svg", "flags/ua.svg", "flags/tr.svg", "flags/eg.svg", "flags/za.svg", "flags/ng.svg", "flags/ke.svg", "flags/sa.svg", "flags/ae.svg", "flags/se.svg", "flags/no.svg", "flags/fi.svg", "flags/dk.svg", "flags/nl.svg", "flags/be.svg", "flags/ch.svg", "flags/at.svg", "flags/pt.svg", "flags/gr.svg", "flags/pl.svg", "flags/ie.svg", "flags/cl.svg", "flags/co.svg", "flags/pe.svg", "flags/ma.svg", "flags/gh.svg", "flags/cz.svg", "flags/jm.svg", "flags/cu.svg", "flags/np.svg"];
// 入れるときは必ずサーバーから取り直す（端末に残った古い版を使わない）
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:"reload"})))));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
// いつもネット上の最新を確認し、つながらないときだけ保存版を使う
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET"||!r.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(C).then(c=>c.put(r.mode==="navigate"?"index.html":r,cp)); } return res; })
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==="navigate"?caches.match("index.html"):undefined))));
});
