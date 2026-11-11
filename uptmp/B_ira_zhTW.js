const sl=ms=>new Promise(r=>setTimeout(r,ms)); const d=document.querySelector('ytcp-uploads-dialog');
const lab=[...d.querySelectorAll('*')].find(e=>e.children.length==0&&e.textContent.trim()=='動画の言語'); const trig=lab.closest('ytcp-form-select, ytcp-dropdown-trigger, ytcp-select'); (trig.querySelector('ytcp-dropdown-trigger')||trig).click(); await sl(1200);
const it=[...document.querySelectorAll('tp-yt-paper-item, [role="option"]')].find(e=>e.innerText.trim()==="中国語 (台湾)"); if(it) it.click(); await sl(800);
const lang=trig.innerText.replace(/\s+/g,' ');
for(let i=0;i<3;i++){ d.querySelector('#next-button').click(); await sl(1800); }
[...d.querySelectorAll('*')].find(e=>e.children.length==0&&e.textContent.trim()=='スケジュールを設定')?.click(); await sl(1200);
d.querySelector('#datepicker-trigger').click(); await sl(1000);
[...document.querySelectorAll('.calendar-day')].filter(e=>e.offsetParent&&e.textContent.trim()==='14')[0].click(); await sl(1000);
const ti=[...d.querySelectorAll('input')].find(i=>/^\d{1,2}:\d{2}$/.test(i.value)); ti.click(); await sl(1000); const o=[...document.querySelectorAll('tp-yt-paper-item, [role=option]')].filter(e=>e.offsetParent).find(e=>e.innerText.trim()==='20:00'); if(o){ o.scrollIntoView({block:'center'}); await sl(300); o.click(); } await sl(800);
const tz=[...d.querySelectorAll('*')].map(e=>e.children.length==0?e.textContent.trim():'').find(s=>/GMT/.test(s));
const link=[...d.querySelectorAll('a')].map(a=>a.href).filter(h=>/shorts/.test(h))[0];
[lang, d.querySelector('#datepicker-trigger').innerText, ti.value, tz, link]