"""45 Brain 紹介ショート（ゲーム別×3言語）。
python3 shorts.py count ja   … 1本だけ
python3 shorts.py all        … 9本
"""
import asyncio, sys, os, json
from studio import Studio, APP

COL = {"count": "#3D7BFF", "flash": "#FF8F1F", "hb": "#9B5CF6"}
NAME = {"count": {"ja": "マス数え", "en": "Count", "zh-Hant": "數格子"},
        "flash": {"ja": "瞬間記憶", "en": "Flash", "zh-Hant": "瞬間記憶"},
        "hb": {"ja": "数当て", "en": "Guess", "zh-Hant": "猜數字"}}
TAG = {"count": {"ja": "塗られたマスは、いくつ？", "en": "How many squares are filled?", "zh-Hant": "塗色的格子有幾格？"},
       "flash": {"ja": "光った場所、おぼえられる？", "en": "Can you remember where it lit up?", "zh-Hant": "記得住發光的位置嗎？"},
       "hb": {"ja": "秘密の数字を当てよう", "en": "Crack the secret number", "zh-Hant": "猜出秘密數字"}}
END = {"ja": ("無料・広告なし・インストール不要", ["勉強のあいまに", "1人でも、みんなでも"], "毎週水曜、新しいゲームが増えます"),
       "en": ("Free · No ads · No install", ["Quick study breaks", "Play solo or together"], "A new game every Wednesday"),
       "zh-Hant": ("免費・無廣告・免安裝", ["讀書的空檔", "一個人或大家一起"], "每週三新增遊戲")}

L = {  # 読み上げ（字幕も同じ文）
 "count": {
  "ja": ["45 Brain、マス数え。塗られたマスは、いくつ？", "マスの数や塗り方を選んで、スタート。時間制限はありません。", "数えたマスは、タップで印をつけられます。", "答え合わせでは、10個ずつ番号がつくので、どこで数えまちがえたかが分かります。", "文字モードでは、毛の中にまざった、手を数えます。", "45 Brain。無料・広告なしで、ブラウザですぐ遊べます。"],
  "en": ["45 Brain: Count. How many squares are filled?", "Pick the grid size and pattern, then start. There's no time limit.", "Tap squares to mark the ones you've counted.", "The answer numbers the squares in groups of ten, so you can see where you slipped.", "In Characters mode, find the look-alike characters.", "45 Brain. Free, no ads, right in your browser."],
  "zh-Hant": ["45 Brain，數格子。塗色的格子有幾格？", "選好格子數和塗法就開始，沒有時間限制。", "數過的格子，點一下就能做記號。", "對答案時每10個標上編號，一眼看出哪裡數錯。", "文字模式要數出混在「毛」裡的「手」。", "45 Brain，免費、無廣告，用瀏覽器馬上就能玩。"]},
 "flash": {
  "ja": ["45 Brain、瞬間記憶。光った場所、おぼえられる？", "一瞬だけ光るマスの場所をおぼえて、タップします。", "クリアすると、国旗のボーナス問題。",
         "順番モードでは、光った順番どおりにタップ。", "レベルが上がるほど、数が増えていきます。", "45 Brain。無料・広告なしで、ブラウザですぐ遊べます。"],
  "en": ["45 Brain: Flash. Can you remember where it lit up?", "Squares light up for an instant. Remember where, then tap them.", "Clear a level for a flag bonus question.",
         "In Order mode, tap them in the order they lit up.", "Each level adds more squares.", "45 Brain. Free, no ads, right in your browser."],
  "zh-Hant": ["45 Brain，瞬間記憶。記得住發光的位置嗎？", "記住一瞬間發光的位置，然後點選。", "過關後，還有國旗加分題。",
         "順序模式要照發光的順序點選。", "等級越高，數量越多。", "45 Brain，免費、無廣告，用瀏覽器馬上就能玩。"]},
 "hb": {
  "ja": ["45 Brain、数当て。相手の秘密の数字を当てよう。", "1台のスマホを回して、それぞれ秘密の数字を決めます。", "数字も位置も合えばストライク、数字だけ合えばボール。",
         "メモを使って、ちがう数字を消していこう。", "先に当てた人の勝ち。ひとりでも遊べます。", "45 Brain。無料・広告なしで、ブラウザですぐ遊べます。"],
  "en": ["45 Brain: Guess. Crack your friend's secret number.", "Pass one phone around. Each player picks a secret number.", "Right digit, right place is a strike. Right digit, wrong place is a ball.",
         "Use the memo to cross out digits.", "First to crack it wins. You can play solo, too.", "45 Brain. Free, no ads, right in your browser."],
  "zh-Hant": ["45 Brain，猜數字。猜出對方的秘密數字。", "一支手機輪流傳，各自決定秘密數字。", "數字和位置都對是好球，只有數字對是壞球。",
         "用筆記把不可能的數字劃掉。", "先猜中的人贏，也可以一個人玩。", "45 Brain，免費、無廣告，用瀏覽器馬上就能玩。"]},
}


async def title_card(s, game, lang):
    art = TILES[game]
    await s.stage(f"__card({json.dumps(f'<div class=chip><i>45</i>Brain</div><div class=tile>{art}</div><div class=big>{NAME[game][lang]}</div><div class=tag>{TAG[game][lang]}</div>')})")


async def end_card(s, lang):
    a, pills, wk = END[lang]
    html = (f'<div class=chip><i>45</i>Brain</div><div class=tag>{a}</div><div class=url>45tools.github.io/brain</div>'
            f'<div class=pills>{"".join(f"<span>{p}</span>" for p in pills)}</div><div class=small>{wk}</div>')
    await s.stage(f"__card({json.dumps(html)})")


async def opening(s, game, lang):
    await s.scene("title")
    await title_card(s, game, lang)
    await s.say(L[game][lang][0], caption="")
    await s.wait_speech(0.3)
    await s.stage(f"__card(''); __title({json.dumps(NAME[game][lang])}); __finger(true)")
    await s.stage(f"__app({json.dumps(APP + '#' + game)})")
    await s.page.clock.run_for(1500)
    await s.page.wait_for_timeout(1500)
    await s.page.frame(name="app").wait_for_selector(f'[data-pane="{game}"].act', timeout=15000)


async def ending(s, game, lang):
    await s.wait_speech(0.4)
    await s.scene("end")
    await s.stage("__finger(false); __cap('')")
    await end_card(s, lang)
    await s.say(L[game][lang][-1], caption="")
    await s.wait_speech(0.8)


async def count(s, lang):
    T = L["count"][lang]
    await opening(s, "count", lang)
    await s.scene("setup")
    await s.say(T[1]); await s.hold(0.6)
    await s.tap('#cntSizes [data-val="8"]', after=0.3)
    await s.tap('#cntLayout [data-val="random"]', after=0.3)
    await s.tap('#cntQ [data-val="5"]', after=0.3)
    await s.wait_speech()
    await s.tap('#dock [data-act="start"]', after=0.4)
    await s.scene("mark")
    await s.say(T[2])
    ans = await s.js("__b.MODS.count.q.ans"); filled = await s.js("__b.MODS.count.q.filled.map((f,i)=>f?i:-1).filter(i=>i>=0)")
    for i in filled[:6]:
        await s.tap(f'#cntGrid [data-c="{i}"]', after=0.12)
    await s.wait_speech(0.2)
    await s.scene("answer")
    await s.keys(str(ans)); await s.tap('#dock [data-k="ok"]', after=0.3)
    await s.say(T[3]); await s.wait_speech(0.8)
    await s.scene("kanji")
    await s.tap('#cntQuit', after=0.3)
    await s.tap('#cntStyle [data-val="kanji"]', after=0.3)
    await s.tap('#dock [data-act="start"]', after=0.2)
    await s.say(T[4]); await s.hold(1.5)
    kans = await s.js("__b.MODS.count.q.ans")
    await s.keys(str(kans)); await s.tap('#dock [data-k="ok"]', after=0.3)
    await s.wait_speech(1.0)
    await ending(s, "count", lang)


async def flash(s, lang):
    T = L["flash"][lang]
    await opening(s, "flash", lang)
    await s.scene("play")
    await s.say(T[1]); await s.hold(0.4)
    await s.tap('#dock [data-act="start"]', after=0.1)
    await s.page.wait_for_timeout(600)  # 国旗の画像を読み込む時間（本当の時間）
    for _ in range(120):
        if await s.js("__b.MODS.flash.r.phase") == "input": break
        await s.tick(2)
    cells = await s.js("__b.MODS.flash.r.cells")
    for c in cells: await s.tap(f'#flGrid [data-c="{c}"]', after=0.15)
    await s.wait_speech()
    await s.scene("bonus")
    await s.say(T[2]); await s.hold(1.0)
    bq = await s.js("__b.MODS.flash.r.bq")
    await s.tap(f'#flGrid [data-c="{bq}"]', after=0.2)
    await s.wait_speech(0.6)
    await s.scene("order")
    await s.tap('#flQuit', after=0.3)
    await s.tap('#flModeSel [data-val="seq"]', after=0.2)
    await s.say(T[3])
    await s.tap('#dock [data-act="start"]', after=0.1)
    await s.page.wait_for_timeout(600)
    for _ in range(80):
        if await s.js("__b.MODS.flash.r.phase") == "input": break
        await s.tick(2)
    cells = await s.js("__b.MODS.flash.r.cells")
    for c in cells: await s.tap(f'#flGrid [data-c="{c}"]', after=0.15)
    await s.hold(0.8)
    await s.say(T[4])
    await s.tap('#dock [data-act="nextlv"]', after=0.1)
    await s.page.wait_for_timeout(600)
    for _ in range(90):
        if await s.js("__b.MODS.flash.r.phase") == "input": break
        await s.tick(2)
    cells = await s.js("__b.MODS.flash.r.cells")
    for c in cells: await s.tap(f'#flGrid [data-c="{c}"]', after=0.12)
    await s.hold(0.6)
    await ending(s, "flash", lang)


async def hb(s, lang):
    T = L["hb"][lang]
    await opening(s, "hb", lang)
    await s.scene("secret")
    await s.say(T[1]); await s.hold(0.3)
    await s.tap('#dock [data-act="start"]', after=0.5)
    for sec in ("123", "468"):
        await s.tap('#dock [data-act="ready"]', after=0.2)
        await s.keys(sec, gap=0.12); await s.tap('#dock [data-k="ok"]', after=0.4)
    await s.wait_speech()
    await s.tap('#dock [data-act="begin"]', after=0.3)
    await s.scene("guess")
    await s.keys("486", gap=0.15); await s.tap('#dock [data-k="ok"]', after=0.3)
    await s.say(T[2]); await s.wait_speech(0.3)
    await s.scene("memo")
    await s.say(T[3])
    for d in (0, 1, 2, 3):
        await s.tap(f'#hbBody [data-memo="{d}"]', after=0.15)
    await s.wait_speech(0.2)
    await s.scene("win")
    await s.tap('#dock [data-act="pass"]', after=0.3)
    await s.keys("132", gap=0.12); await s.tap('#dock [data-k="ok"]', after=0.5)
    await s.tap('#dock [data-act="pass"]', after=0.3)
    await s.keys("468", gap=0.15); await s.tap('#dock [data-k="ok"]', after=0.3)
    await s.say(T[4]); await s.hold(0.4)
    await ending(s, "hb", lang)


TILES = {}

async def run(game, lang, bgm=None):
    async with Studio(f"{game}_{lang}", lang, COL[game]) as s:
        if not TILES:
            # ホームのアイコンの絵を、アプリ本体から借りる
            await s.stage(f"__app({json.dumps(APP)})"); await s.page.clock.run_for(1500); await s.page.wait_for_timeout(1200)
            for g in COL: TILES[g] = await s.page.frame(name="app").evaluate(f"TILE['{g}']")
            await s.stage("__app('about:blank')")
        await {"count": count, "flash": flash, "hb": hb}[game](s, lang)
    return s.finish(bgm)


if __name__ == "__main__":
    bgm = os.environ.get("BGM")
    if sys.argv[1] == "all":
        for g in COL:
            for lg in ("ja", "en", "zh-Hant"):
                TILES.clear()
                if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), "out", f"{g}_{lg}", "final.mp4")): continue
                try: print("OK", g, lg, asyncio.run(run(g, lg, bgm)), flush=True)
                except Exception as e: print("FAIL", g, lg, repr(e)[:300], flush=True)
    else:
        print(asyncio.run(run(sys.argv[1], sys.argv[2], bgm)))
