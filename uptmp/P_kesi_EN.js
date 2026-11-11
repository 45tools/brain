const sl=ms=>new Promise(r=>setTimeout(r,ms)); const d=document.querySelector('ytcp-uploads-dialog');
const pl=d.querySelector('ytcp-video-metadata-playlists'); (pl.querySelector('ytcp-dropdown-trigger, [role=button]')||pl).click(); await sl(1500);
const want=["45Play", "English"];
[...document.querySelectorAll('li')].filter(li=>li.offsetParent).forEach(li=>{ const t=li.innerText.trim(); if(want.includes(t)){ const cb=li.querySelector('ytcp-checkbox-lit, tp-yt-paper-checkbox, [role=checkbox]'); if(cb&&cb.getAttribute('aria-checked')!=='true') cb.click(); } });
await sl(600); [...document.querySelectorAll('ytcp-button, button')].find(b=>b.offsetParent&&b.innerText.trim()==='完了')?.click(); await sl(900);
[...d.querySelectorAll('*')].find(e=>e.children.length==0&&e.textContent.trim()=='すべて表示')?.click(); await sl(1000);
const ti=[...d.querySelectorAll('input')].find(i=>i.getAttribute('aria-label')==='タグ'||i.placeholder==='タグを追加'); ti.focus();
document.execCommand('insertText',false,"eraser battle,eraser flick,physics game,two player,free game,no ads,45 Play,45tools,"); await sl(500);
ti.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true})); await sl(800);
[pl.innerText.replace(/\s+/g,' '), [...new Set([...d.querySelectorAll('ytcp-chip')].map(c=>c.textContent.trim()))].length]