# 45 Brain

勉強のあいまに脳をきたえるミニゲーム集。https://45tools.github.io/brain/

- ホームはゲームのアイコンが並ぶ待ち受け型。ゲームごとの入口 `/<id>/`（例 /brain/count/）からは、そのゲームだけをホーム画面に追加できる
- 公開日時は `src/shell.html` の `GAMES`（rel）で管理。時刻になるとアイコンが出る。`?preview=1` で未公開分も表示（`?preview=0` で戻す）
- 使い方リンクは `GUIDE`（日本語→note、英語・中国語→各ゲームのショート）

## 作り方
- 編集するのは `src/shell.html`（共通）と `src/games/<id>.js`（ゲーム本体）
- `python3 tools/build.py` → `index.html`・`<id>/`・`games/`・`sw.js` を書き出す（`src/shell.html` の `APP_VER` を上げてから）
- アイコンを作り直すときは `python3 tools/icons.py`
- `src/later/kesi.js` は消しゴムおとし（45 Play に移す予定、今は Brain に入れていない）

国旗画像：[flag-icons](https://github.com/lipis/flag-icons)（MIT License, flags/LICENSE）
