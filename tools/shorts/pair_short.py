"""45 Brain 神経衰弱（pair）の紹介ショート。45 Play の撮影スタジオ（play/tools/shorts/studio.py）を借りる。
準備：python3 -m http.server 8770 --directory ~/projects/45tools ／ python3 -m http.server 8771 --directory ~/projects/45tools/play/tools/shorts
使い方：python3 pair_short.py ja|en|zh-Hant   （BGM=曲.mp3 でBGM入り）
"""
import asyncio, sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "play", "tools", "shorts"))
import studio
studio.APP = APP = "http://localhost:8770/brain/"
studio.HERE = HERE  # 出力は brain/tools/shorts/out
from studio import Studio

COL = "#E89A00"
NAME = {"ja": "神経衰弱", "en": "Pairs", "zh-Hant": "記憶翻牌"}
TAG = {"ja": "同じ絵は、どこにあった？", "en": "Where was the match?", "zh-Hant": "相同的圖在哪裡？"}
END = {"ja": ("無料・広告なし・インストール不要", ["勉強のあいまに", "1人でも、みんなでも"], "毎週水曜、新しいゲームが増えます"),
       "en": ("Free · No ads · No install", ["Quick study breaks", "Play solo or together"], "A new game every Wednesday"),
       "zh-Hant": ("免費・無廣告・免安裝", ["讀書的空檔", "一個人或大家一起"], "每週三新增遊戲")}
L = {
 "ja": ["45 Brain、神経衰弱。同じ絵のカード、どこにあった？", "ひとりでも、コンピューターとでも、2人から4人でも遊べます。",
        "めくった絵の場所をおぼえて、2枚そろえよう。そろえたら、もう1回！", "コンピューターは、強いほど、よくおぼえています。",
        "数とドットでは、数字の3と、点3つがペア。", "自分の写真をカードにもできます。写真はスマホの中だけに保存されます。",
        "45 Brain。無料・広告なしで、ブラウザですぐ遊べます。"],
 "en": ["45 Brain: Pairs. Where was the matching card?", "Play solo, against the computer, or with 2 to 4 players.",
        "Remember where each picture was and find the pairs. Make a match and go again!", "The harder the computer, the better its memory.",
        "In Numbers and dots, the number 3 matches three dots.", "You can even make cards from your own photos. They stay on your phone.",
        "45 Brain. Free, no ads, right in your browser."],
 "zh-Hant": ["45 Brain，記憶翻牌。相同的牌在哪裡？", "可以一個人玩、和電腦對戰，或2到4人一起玩。",
        "記住翻過的圖案位置，湊成一對。配對成功就再翻一次！", "電腦越強，記性越好。",
        "在數字與點模式，數字3和三個點是一對。", "也能用自己的照片做牌，照片只存在手機裡。",
        "45 Brain，免費、無廣告，用瀏覽器馬上就能玩。"],
}

# 写真の代わり：風景っぽい絵（実在の人や場所は使わない）
PHOTOS_JS = r"""(()=>{ const P=__b.MODS.pair, out=[];
 const draw=(f)=>{ const c=document.createElement('canvas'); c.width=c.height=160; const g=c.getContext('2d'); f(g); return c.toDataURL('image/jpeg',.8); };
 const sky=(g,a,b)=>{ const gr=g.createLinearGradient(0,0,0,160); gr.addColorStop(0,a); gr.addColorStop(1,b); g.fillStyle=gr; g.fillRect(0,0,160,160); };
 out.push(draw(g=>{ sky(g,'#FF9A5A','#FFD27A'); g.fillStyle='#FFF3B0'; g.beginPath(); g.arc(80,98,26,0,7); g.fill(); g.fillStyle='#3A6EA5'; g.fillRect(0,104,160,56); }));
 out.push(draw(g=>{ sky(g,'#8FD3FF','#E6F6FF'); g.fillStyle='#6C8A5A'; g.beginPath(); g.moveTo(0,130); g.lineTo(55,50); g.lineTo(100,120); g.lineTo(130,70); g.lineTo(160,130); g.lineTo(160,160); g.lineTo(0,160); g.fill(); g.fillStyle='#fff'; g.beginPath(); g.moveTo(45,64); g.lineTo(55,50); g.lineTo(66,66); g.fill(); }));
 out.push(draw(g=>{ sky(g,'#BFE8B0','#7CC46A'); for(let i=0;i<7;i++){ g.fillStyle=['#FF6B8B','#FFD23F','#fff','#FF9F1C'][i%4]; g.beginPath(); g.arc(20+i*21,100+(i%2)*22,9,0,7); g.fill(); } }));
 out.push(draw(g=>{ sky(g,'#1B2A55','#3B4F8F'); g.fillStyle='#FFF7C2'; g.beginPath(); g.arc(112,46,18,0,7); g.fill(); g.fillStyle='#fff'; for(let i=0;i<14;i++){ g.fillRect((i*37)%150+4,(i*53)%90+6,2,2); } g.fillStyle='#0E1530'; g.fillRect(0,128,160,32); }));
 out.push(draw(g=>{ sky(g,'#FFE4EC','#FFC2D4'); g.fillStyle='#8B5A3C'; g.fillRect(74,90,12,70); g.fillStyle='#FF8FB1'; [[80,70,34],[52,84,22],[108,84,22]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.fill();}); }));
 out.push(draw(g=>{ sky(g,'#9EE7FF','#3CB5E5'); g.fillStyle='#F4D58D'; g.fillRect(0,118,160,42); g.fillStyle='#fff'; g.beginPath(); g.arc(40,40,12,0,7); g.arc(54,36,15,0,7); g.arc(68,42,11,0,7); g.fill(); }));
 P.photos=out; localStorage.setItem('b_pr_photos',JSON.stringify(out)); P.refresh(); return out.length; })()"""


async def flip_pair(s, idx, after=0.3):
    if await s.js(f"(()=>{{const st=__b.MODS.pair.st; return !st||st.cards[{idx[0]}].done}})()"): return
    await s.tap(f'#prGrid [data-c="{idx[0]}"]', after=0.35)
    await s.tap(f'#prGrid [data-c="{idx[1]}"]', after=after)


async def run(lang, bgm=None):
    T = L[lang]
    async with Studio(f"pair_{lang}", lang, COL) as s:
        await s.stage("document.querySelector('#top .chip').innerHTML='<i>45</i>Brain'")
        await s.stage(f"__app({json.dumps(APP + '?preview=1')})"); await s.page.clock.run_for(1500); await s.page.wait_for_timeout(1200)
        tile = await s.page.frame(name="app").evaluate("TILE['pair']")
        await s.stage("__app('about:blank')")
        # タイトル
        await s.scene("title")
        await s.stage(f"__card({json.dumps(f'<div class=chip><i>45</i>Brain</div><div class=tile>{tile}</div><div class=big>{NAME[lang]}</div><div class=tag>{TAG[lang]}</div>')})")
        await s.say(T[0], caption=""); await s.wait_speech(0.3)
        await s.stage(f"__card(''); __title({json.dumps(NAME[lang])}); __finger(true)")
        await s.stage(f"__app({json.dumps(APP + '?preview=1#pair')})")
        await s.page.clock.run_for(1500); await s.page.wait_for_timeout(1500)
        await s.page.frame(name="app").wait_for_selector('[data-pane="pair"].act', timeout=15000)
        await s.js("(()=>{const m=__b.MODS.pair; Object.assign(m.s,{who:'1',cpu:'3',n:'12',set:'animal',peek:'0',swap:'0'}); m.refresh();})()")
        # 設定
        await s.scene("setup")
        await s.say(T[1]); await s.hold(0.5)
        await s.tap('#prWhoSel [data-val="cpu"]', after=0.5)
        await s.tap('#prCpuSel [data-val="2"]', after=0.4)
        await s.tap('#prNSel [data-val="12"]', after=0.3)
        await s.wait_speech(0.2)
        await s.tap('#dock [data-act="start"]', after=0.6)
        # 対戦：はずれ → そろう → もう1回そろう → コンピューターの番
        await s.scene("play")
        await s.say(T[2])
        cards = await s.js("__b.MODS.pair.st.cards.map(c=>c.p)")
        pos = {}
        for i, p in enumerate(cards): pos.setdefault(p, []).append(i)
        a, b = pos[cards[0]], pos[cards[1]] if cards[1] != cards[0] else pos[cards[2]]
        await flip_pair(s, (a[0], b[0]), after=1.4)          # はずれ（2枚の場所をおぼえる）
        await s.hold(0.4)
        cpu_turns = 0
        while await s.js("__b.MODS.pair.st&&__b.MODS.pair.st.cur") == 1 and cpu_turns < 400:
            await s.tick(3); cpu_turns += 1
        await s.wait_speech(0.2)
        await s.say(T[3])
        await flip_pair(s, a, after=1.0)                     # おぼえていた絵をそろえる
        st = await s.js("(()=>{const st=__b.MODS.pair.st; return st?st.cards.map(c=>c.done):null})()")
        if st and not st[b[0]] and not st[b[1]]:
            await flip_pair(s, b, after=1.0)
        await s.wait_speech(0.4)
        # 数とドット（さいしょに見る）
        await s.scene("dots")
        await s.js("(()=>{const m=__b.MODS.pair; m.quit(); Object.assign(m.s,{who:'1',set:'dots',n:'8',peek:'3'}); m.refresh(); m.start();})()")
        await s.say(T[4]); await s.hold(1.2)
        await s.wait_speech(0.2)
        while await s.js("!!(__b.MODS.pair.st&&__b.MODS.pair.st.busy)"):
            await s.tick(3)
        cards = await s.js("__b.MODS.pair.st.cards.map(c=>c.p)")
        pos = {}
        for i, p in enumerate(cards): pos.setdefault(p, []).append(i)
        await flip_pair(s, pos[cards[0]], after=0.8)
        await flip_pair(s, pos[cards[1] if cards[1] != cards[0] else cards[2]], after=0.8)
        # 写真
        await s.scene("photo")
        await s.js("(()=>{const m=__b.MODS.pair; m.quit(); Object.assign(m.s,{set:'photo',n:'12',peek:'0'}); m.refresh();})()")
        await s.js(PHOTOS_JS)
        await s.js("document.querySelector('#prPhotoPanel').scrollIntoView({block:'center'})")
        await s.say(T[5]); await s.hold(1.6)
        await s.tap('#dock [data-act="start"]', after=0.5)
        cards = await s.js("__b.MODS.pair.st.cards.map(c=>c.p)")
        pos = {}
        for i, p in enumerate(cards): pos.setdefault(p, []).append(i)
        for p in list(pos)[:3]:
            await flip_pair(s, pos[p], after=0.7)
        await s.wait_speech(0.5)
        await s.js("(()=>{const m=__b.MODS.pair; m.quit(); localStorage.removeItem('b_pr_photos');})()")
        # 終わり
        await s.wait_speech(0.2)
        await s.scene("end")
        await s.stage("__finger(false); __cap('')")
        x, pills, wk = END[lang]
        html = (f'<div class=chip><i>45</i>Brain</div><div class=tag>{x}</div><div class=url>45tools.github.io/brain</div>'
                f'<div class=pills>{"".join(f"<span>{p}</span>" for p in pills)}</div><div class=small>{wk}</div>')
        await s.stage(f"__card({json.dumps(html)})")
        await s.say(T[-1], caption=""); await s.wait_speech(0.8)
    return s.finish(bgm)


if __name__ == "__main__":
    print(asyncio.run(run(sys.argv[1], os.environ.get("BGM"))))
