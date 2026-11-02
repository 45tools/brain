"""note記事用のスクリーンショット（iPhone幅）と見出し画像を撮る → リポジトリの note-img/ へ"""
import asyncio, os, json
from playwright.async_api import async_playwright
from studio import FONT_CSS, FONT_FILES, FONTS, INIT

OUT = "/home/claude/brain/note-img"
os.makedirs(OUT, exist_ok=True)
APP = "http://localhost:8765/"

async def setup(ctx):
    await ctx.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=FONT_CSS))
    await ctx.route("https://fonts.local/**", lambda r: r.fulfill(status=200, content_type="font/woff2", body=open(os.path.join(FONTS, FONT_FILES[r.request.url.rsplit("/", 1)[1]]), "rb").read()))

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 390, "height": 760}, device_scale_factor=2, locale="ja-JP")
        await setup(ctx); await ctx.add_init_script(INIT % (11, "ja"))
        pg = await ctx.new_page()
        await pg.clock.install(time="2026-11-05T12:00:00+09:00"); await pg.clock.pause_at("2026-11-05T12:00:01+09:00")
        async def shot(n): await pg.clock.run_for(400); await pg.wait_for_timeout(150); await pg.screenshot(path=f"{OUT}/{n}.png")
        async def go(u): await pg.goto(u); await pg.clock.run_for(1500); await pg.wait_for_timeout(800)
        J = lambda c: pg.evaluate(c)
        await go(APP); await shot("01_home")
        # マス数え
        await pg.click('[data-go="count"]'); await pg.wait_for_selector('[data-pane="count"].act'); await shot("02_count_setup")
        await pg.click('#cntSizes [data-val="8"]'); await pg.click('#cntLayout [data-val="random"]'); await pg.click('#dock [data-act="start"]')
        f = await J("__b.MODS.count.q.filled.map((f,i)=>f?i:-1).filter(i=>i>=0)")
        for i in f[:7]: await pg.click(f'#cntGrid [data-c="{i}"]')
        await shot("03_count_mark")
        ans = await J("__b.MODS.count.q.ans")
        for d in str(ans + 1): await pg.click(f'#dock [data-k="{d}"]')
        await pg.click('#dock [data-k="ok"]'); await shot("04_count_review")
        await pg.click('#dock [data-act="review"]')
        for _ in str(ans + 1): await pg.click('#dock [data-k="del"]')
        for d in str(ans): await pg.click(f'#dock [data-k="{d}"]')
        await pg.click('#dock [data-k="ok"]'); await shot("05_count_answer")
        await pg.click('#cntQuit'); await pg.click('#cntStyle [data-val="kanji"]'); await pg.click('#dock [data-act="start"]'); await shot("06_count_kanji")
        k = await J("__b.MODS.count.q.ans")
        for d in str(k - 1): await pg.click(f'#dock [data-k="{d}"]')
        await pg.click('#dock [data-k="ok"]'); await pg.click('#dock [data-act="submit"]'); await pg.click('#cntQuit')
        await J("document.querySelector('#cntStats').scrollIntoView({block:'center'})"); await shot("07_count_compare")
        await J("scrollTo(0,0)")
        # 瞬間記憶
        await pg.click('#homeBtn'); await pg.click('[data-go="flash"]'); await pg.wait_for_selector('[data-pane="flash"].act'); await shot("08_flash_setup")
        await pg.click('#dock [data-act="start"]'); await pg.wait_for_timeout(800); await pg.clock.run_for(1100); await pg.wait_for_timeout(300); await pg.screenshot(path=f"{OUT}/09_flash_show.png")
        await pg.clock.run_for(1500)
        for c in await J("__b.MODS.flash.r.cells"): await pg.click(f'#flGrid [data-c="{c}"]')
        await pg.clock.run_for(1200); await shot("10_flash_bonus")
        await pg.click(f'#flGrid [data-c="{await J("__b.MODS.flash.r.bq")}"]'); await shot("11_flash_bonus_ans")
        await pg.click('#flQuit'); await pg.click('#flModeSel [data-val="seq"]'); await pg.click('#dock [data-act="start"]')
        await pg.clock.run_for(900)
        for _ in range(40):
            if await J("__b.MODS.flash.r.phase") == "input": break
            await pg.clock.run_for(200)
        for c in await J("__b.MODS.flash.r.cells"): await pg.click(f'#flGrid [data-c="{c}"]')
        await pg.clock.run_for(900); await shot("12_flash_order")
        # 数当て
        await pg.click('#flQuit'); await pg.click('#homeBtn'); await pg.click('[data-go="hb"]'); await pg.wait_for_selector('[data-pane="hb"].act'); await shot("13_hb_setup")
        await pg.click('#dock [data-act="start"]'); await shot("14_hb_pass")
        await pg.click('#dock [data-act="ready"]')
        for d in "123": await pg.click(f'#dock [data-k="{d}"]')
        await shot("15_hb_secret")
        await pg.click('#dock [data-k="ok"]'); await pg.click('#dock [data-act="ready"]')
        for d in "468": await pg.click(f'#dock [data-k="{d}"]')
        await pg.click('#dock [data-k="ok"]'); await pg.click('#dock [data-act="begin"]')
        for g in ("486",):
            for d in g: await pg.click(f'#dock [data-k="{d}"]')
            await pg.click('#dock [data-k="ok"]')
        for d in (0, 1, 2, 3): await pg.click(f'#hbBody [data-memo="{d}"]')
        await shot("16_hb_result")
        await pg.click('#dock [data-act="pass"]')
        for d in "132": await pg.click(f'#dock [data-k="{d}"]')
        await pg.click('#dock [data-k="ok"]'); await pg.click('#dock [data-act="pass"]')
        for d in "468": await pg.click(f'#dock [data-k="{d}"]')
        await pg.click('#dock [data-k="ok"]'); await shot("17_hb_win")
        # メニュー・ゲーム別の入口
        await pg.click('#dock [data-act="setup"]'); await pg.click('#homeBtn'); await pg.click('#menuBtn'); await shot("18_menu")
        await go(APP + "count/"); await shot("19_solo_count")
        await b.close()
    print("ok", sorted(os.listdir(OUT)))

asyncio.run(main())
