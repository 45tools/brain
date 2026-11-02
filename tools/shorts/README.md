# 紹介ショート・note画像の作り方

- `studio.py`：本物のアプリ（localhost:8765）を 1080×1920 の画面に入れ、ページの時計を止めて1コマずつ撮る。読み上げは edge-tts
- `shorts.py`：ゲームごとの台本と操作。`python3 shorts.py count ja` で1本、`all` で全部（できたものは飛ばす）。`BGM=曲.mp3` を付けるとBGM入り
- `noteshots.py`：note記事用のスクリーンショット → `note-img/`。`header.py`：見出し画像
- 準備：`python3 -m http.server 8765`（リポジトリ直下）と `python3 -m http.server 8766`（このフォルダ）。フォントは @fontsource の fredoka / m-plus-rounded-1c を `../fonts/` に展開（studio.py の FONTS）
- 新しいゲームを足すときは、shorts.py に台本（L）と操作の関数を追加する
