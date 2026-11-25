// 45 Brain ゲーム：read（速読。開いたときだけ読み込まれる。共通の関数は index.html にある）
// 4つの練習：フラッシュ読み／高速表示（文章が少しずつ流れる）／視野を広げる／読む速さの測定
// 文章・ことばは下の RD_TXT（日本語・中国語の本文の「/」は高速表示の区切り。画面には出さない）（日本語・英語・繁体字。簡体字は build.py が繁体字から作る）
BRAIN.def("read",`  <section data-pane="read" data-v="setup">
    <div class="vw" data-v="setup">
      <div class="panel">
        <h2 data-i="rdTitle"></h2>
        <p class="lead" id="rdLead"></p>
        <div class="opt"><span class="ol" data-i="rdOptKind"></span><div class="chips" id="rdKindSel">
          <button class="chip" data-val="flash" data-i="rdKFlash"></button><button class="chip" data-val="rsvp" data-i="rdKRsvp"></button><button class="chip" data-val="wide" data-i="rdKWide"></button><button class="chip" data-val="meas" data-i="rdKMeas"></button></div></div>
        <div class="opt" id="rdLenRow"><span class="ol" data-i="rdOptLen"></span><div class="chips" id="rdLenSel">
          <button class="chip" data-val="word" data-i="rdLenWord"></button><button class="chip" data-val="phrase" data-i="rdLenPhrase"></button></div></div>
        <div class="opt" id="rdSpRow"><span class="ol" id="rdSpLbl"></span><div class="chips" id="rdSpSel">
          <button class="chip num" data-val="0"></button><button class="chip num" data-val="1"></button><button class="chip num" data-val="2"></button><button class="chip num" data-val="3"></button></div></div>
        <div class="opt" id="rdWdRow"><span class="ol" data-i="rdOptWd"></span><div class="chips" id="rdWdSel">
          <button class="chip" data-val="0" data-i="rdWd0"></button><button class="chip" data-val="1" data-i="rdWd1"></button><button class="chip" data-val="2" data-i="rdWd2"></button></div></div>
      </div>
      <div class="panel">
        <h2 data-i="rdRec"></h2>
        <div class="best"><i class="ic" data-ic="trophy"></i><span id="rdBestLbl"></span><b class="num" id="rdBest"></b></div>
        <div class="rdhist" id="rdHist"></div>
      </div>
    </div>
    <div class="vw" data-v="play">
      <div class="phead"><button class="btn icon" id="rdQuit" aria-label="quit"><i class="ic" data-ic="x"></i></button><b class="num prog" id="rdProg"></b><span class="sp"></span><span class="timer num" id="rdInfo"></span></div>
      <div class="qtext" id="rdQ"></div>
      <div class="rdstage" id="rdStage"></div>
      <div class="banner" id="rdFb"></div>
      <div class="choices rdch" id="rdChoices"></div>
    </div>
  </section>`,function(){

/* =========================================================
   素材（文章は3問の内容クイズつき。問題は [問い, 正解, ちがう答え, ちがう答え]）
   ========================================================= */
const RD_TXT={
 ja:{unit:"字/分",sp:[300,500,800,1200],wide:"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわ",
  words:[["えんぴつ","えんとつ","えんそく","えんぴょう"],["しんかんせん","しんかいせん","しんぶんし","しんごうき"],["カレーライス","カレーパン","オムライス","ハヤシライス"],["ひまわり","ひなまつり","ひまつぶし","ひがわり"],["図書館","図工室","美術館","体育館"],["自転車","自動車","消防車","三輪車"],["天気予報","天気図","電気代","天体観測"],["チョコレート","チョコミント","ショートケーキ","チョコパフェ"],["ペンギン","ペンキ","パンダ","ペリカン"],["春休み","夏休み","冬休み","昼休み"],["朝ごはん","昼ごはん","晩ごはん","朝ねぼう"],["かたつむり","かまきり","かぶとむし","かたぐるま"],["エレベーター","エスカレーター","エレクトーン","エアコン"],["新聞紙","新幹線","信号機","新学期"],["雪だるま","雪合戦","雪げしき","雪まつり"],["冷蔵庫","冷凍庫","洗濯機","掃除機"]],
  phrases:[["りんごを食べた","りんごを買った","みかんを食べた","りんごを食べない"],["明日は雨がふる","明日は雪がふる","今日は雨がふる","明日も雨がふる"],["ねこが三びきいる","ねこが二ひきいる","いぬが三びきいる","ねこが三びきねる"],["赤いかさをさす","青いかさをさす","赤いかさをかう","赤いぼうしをかぶる"],["駅の前で待つ","駅のうしろで待つ","店の前で待つ","駅の前で会う"],["七時に起きた","九時に起きた","七時にねた","七時に着いた"],["本を二さつ借りた","本を三さつ借りた","本を二さつ買った","ノートを二さつ借りた"],["窓をあけてください","窓をしめてください","ドアをあけてください","窓をふいてください"],["右に曲がってすぐ","左に曲がってすぐ","右に曲がって三分","まっすぐ行ってすぐ"],["牛乳を一本ください","牛乳を二本ください","お茶を一本ください","牛乳を一つください"],["日曜日は休みです","土曜日は休みです","日曜日は仕事です","日曜日も休みです"],["大きな木の下で","小さな木の下で","大きな木の上で","大きな岩の下で"]],
  texts:[
   {ti:"図書館のねこ",tx:"町の小さな/図書館には、/ミルという/名前のねこがいる。/白い体に、/しっぽの先だけが/黒い。/ミルは毎朝九時、/図書館の戸が/開くと同時に/入ってきて、/絵本の棚の前で/丸くなる。/子どもたちは、/ミルのとなりに/すわって/本を読むのが/好きだ。/ある雨の日、/いつもの時間に/なっても/ミルが来なかった。/司書の/木村さんは/心配になり、/かさをさして/近所を/さがしに出た。/すると、/パン屋の軒下で、/ミルが/小さな子ねこ/三びきを/守るように/すわっていた。/木村さんは/子ねこたちを/箱に入れて、/図書館へ運んだ。/それからしばらく、/絵本の棚の前には、/ねこが四ひき/並んで/眠るようになった。",
    qs:[["ミルのしっぽの先は何色？","黒","白","茶色"],["雨の日、ミルはどこにいた？","パン屋の軒下","駅のベンチ","学校の門"],["子ねこは何びきいた？","三びき","二ひき","四ひき"]]},
   {ti:"自転車の練習",tx:"ゆいは/八歳の夏、/自転車に乗る/練習を始めた。/お父さんが/うしろの荷台を持ち、/ゆいは/まっすぐ前を見て/ペダルをこぐ。/はじめの日は/十回以上転んで、/ひざに/ばんそうこうを/二枚はった。/二日目、/お父さんは/「遠くの木を/見てごらん」と/言った。/足元ばかり/見ていたゆいが/顔を上げると、/ふしぎと/ハンドルが/ふらつかなくなった。/三日目の夕方、/ゆいは/公園を一周して、/ふり返った。/お父さんは/荷台を/持っていなかった。/ずっとうしろの/ベンチの横で、/手をふっていたのだ。/「いつから/一人だったの？」と/聞くと、/お父さんは笑って/「半周前から」と/答えた。",
    qs:[["練習を始めたのは何歳の夏？","八歳","七歳","十歳"],["お父さんが見るように言ったのは？","遠くの木","足元","ハンドル"],["一人で走っていたのはいつから？","半周前から","さいしょから","一周前から"]]},
   {ti:"星をかぞえる夜",tx:"冬休み、/けんたは/おじいちゃんの/山の家に泊まった。/町とちがって、/夜になると/外はまっ暗だ。/おじいちゃんは/厚いコートを/二枚出して、/けんたを/庭へ連れ出した。/見上げると、/空いっぱいに/星が広がっていた。/「星はいくつ見える？」と/おじいちゃんが聞く。/けんたは/指でかぞえ始めたが、/百をこえたところで/わからなくなった。/おじいちゃんは、/空を/小さな四角に分けて、/一つの四角の/星だけをかぞえる/方法を/教えてくれた。/四角の中には/十二個。/その四角が、/空に/五十くらいある。/「じゃあ、/六百くらいだね」と/けんたが言うと、/おじいちゃんは/「計算が速いな」と/ほめてくれた。",
    qs:[["けんたが泊まったのはいつ？","冬休み","夏休み","春休み"],["一つの四角の中の星は？","十二個","五十個","百個"],["けんたの答えは？","六百くらい","百くらい","千二百くらい"]]},
   {ti:"パン屋のおてつだい",tx:"土曜日の朝、/あおいは/近所のパン屋で/一日だけ/お手伝いをした。/店主の/山田さんは、/朝四時から/生地をこねている。/あおいの仕事は、/焼き上がったパンを/棚に並べることと、/値札を書くことだ。/いちばん人気は/クリームパンで、/開店から一時間で/四十個が/売り切れた。/昼すぎ、/小さな男の子が/百円玉を一枚/にぎって/店に来た。/ほしいのは/百二十円の/メロンパンだ。/男の子が/困った顔をしていると、/山田さんは、/形が少しくずれた/メロンパンを出して/「これは/百円だよ」と/言った。/男の子が/帰ったあと、/山田さんは/「くずれたパンも、/味は同じなんだ」と/小さな声で/教えてくれた。",
    qs:[["いちばん人気のパンは？","クリームパン","メロンパン","あんパン"],["男の子が持っていたお金は？","百円","百二十円","五十円"],["山田さんが生地をこね始めるのは？","朝四時","朝六時","朝九時"]]},
   {ti:"なくしたかぎ",tx:"月曜日の夕方、/はるとは/家のかぎを/なくしたことに/気づいた。/ランドセルの中も、/ポケットの中も、/何度さがしても/見つからない。/はるとは、/その日に歩いた道を/思い出すことにした。/学校を出て、/まず/文房具屋で/ノートを買った。/次に、/友だちのそうたと/公園の/ブランコに乗った。/最後に、/川ぞいの道を通って/帰ってきた。/文房具屋の/店員さんに聞くと、/落とし物は/ないと言う。/公園に行くと、/ブランコの下の/砂の中で、/青いキーホルダーが/光っていた。/こいだときに、/ポケットから/落ちたのだろう。/はるとは/それから、/かぎを/ランドセルの/内側のフックに/つけることにした。",
    qs:[["さいしょに寄った店は？","文房具屋","本屋","コンビニ"],["かぎはどこにあった？","ブランコの下","川ぞいの道","文房具屋"],["キーホルダーの色は？","青","赤","黄色"]]},
   {ti:"遠足とてるてるぼうず",tx:"水曜日は、/待ちに待った/遠足の日だった。/ところが/前の晩の/天気予報では、/雨の確率は/七十パーセント。/みおは/白い布で/てるてるぼうずを/三つ作り、/窓につるした。/朝起きると、/空は/くもっていたが、/雨はまだ/降っていなかった。/バスで/動物園に着いたころ、/雲のすき間から/日がさしてきた。/みおのクラスは/キリンにえさをあげ、/ペンギンの行進を/見た。/帰りのバスに/乗ったとたん、/大つぶの雨が/窓を/たたき始めた。/家に帰ったみおは、/てるてるぼうずに/一つずつ/「ありがとう」と/言ってから、/顔をかいてあげた。",
    qs:[["前の晩の雨の確率は？","七十パーセント","三十パーセント","五十パーセント"],["遠足の行き先は？","動物園","水族館","山"],["雨が降り始めたのは？","帰りのバスに乗ったとき","動物園に着いたとき","朝起きたとき"]]}]},
 en:{unit:"words/min",sp:[150,250,400,600],wide:"ABCDEFGHJKLMNPRSTUVWXYZ",
  words:[["pencil","pencils","stencil","pence"],["bread","beard","bead","break"],["listen","silent","tinsel","enlist"],["garden","danger","ranged","gander"],["horse","house","hose","hoarse"],["planet","plane","plant","planets"],["quiet","quite","quit","quilt"],["through","though","thought","tough"],["desert","dessert","deserts","desserts"],["form","from","farm","foam"],["weather","whether","feather","leather"],["train","trail","brain","drain"],["castle","cattle","costly","castles"],["bottle","battle","beetle","bottles"],["window","widow","winder","windows"],["monkey","money","donkey","monkeys"]],
  phrases:[["I ate an apple","I ate the apple","I bought an apple","I ate an orange"],["it will rain tomorrow","it will snow tomorrow","it may rain tomorrow","it will rain today"],["three cats are sleeping","two cats are sleeping","three dogs are sleeping","three cats are eating"],["open the window","close the window","open the door","clean the window"],["turn right at the bank","turn left at the bank","turn right at the park","go straight at the bank"],["I woke up at seven","I woke up at nine","I went to bed at seven","I woke up at eleven"],["two books from the library","three books from the library","two books from the store","two maps from the library"],["the red umbrella","the blue umbrella","the red unicorn","the red umbrellas"],["meet me at the station","meet me at the stadium","wait for me at the station","meet me at the stairs"],["a glass of milk","a glass of water","a cup of milk","two glasses of milk"],["under the big tree","under the small tree","above the big tree","under the big stone"],["we are closed on Sunday","we are open on Sunday","we are closed on Monday","we are closed on Sundays"]],
  texts:[
   {ti:"The Library Cat",tx:"A small library in town has a cat named Mil. Her body is white, and only the tip of her tail is black. Every morning at nine, Mil walks in as soon as the doors open and curls up in front of the picture-book shelf. Children love to sit next to her and read. One rainy day, Mil did not come at her usual time. Ms. Kimura, the librarian, got worried, opened her umbrella and went out to look for her. Under the roof of the bakery, she found Mil sitting beside three tiny kittens, as if she were guarding them. Ms. Kimura put the kittens in a box and carried them to the library. For a while after that, four cats slept in a row in front of the picture-book shelf.",
    qs:[["What color is the tip of Mil's tail?","Black","White","Brown"],["Where was Mil on the rainy day?","Under the bakery roof","On a station bench","At the school gate"],["How many kittens were there?","Three","Two","Four"]]},
   {ti:"Learning to Ride",tx:"The summer Yui turned eight, she began learning to ride a bike. Her father held the back of the bike while Yui looked straight ahead and pedaled. On the first day she fell more than ten times and put two bandages on her knees. On the second day, her father said, “Look at that tree far away.” Yui had been looking only at her feet, but when she raised her head, the handlebars stopped wobbling. On the evening of the third day, Yui rode once around the park and looked back. Her father was not holding the bike. He was waving from beside a bench far behind her. “Since when was I alone?” she asked. Her father laughed and said, “Since halfway around.”",
    qs:[["How old was Yui that summer?","Eight","Seven","Ten"],["What did her father tell her to look at?","A tree far away","Her feet","The handlebars"],["Since when was she riding alone?","Since halfway around","From the very start","Since one lap before"]]},
   {ti:"Counting Stars",tx:"During winter vacation, Kenta stayed at his grandfather's house in the mountains. Unlike in town, it gets completely dark outside at night. His grandfather took out two thick coats and led Kenta into the yard. When Kenta looked up, the whole sky was full of stars. “How many stars can you see?” his grandfather asked. Kenta began counting on his fingers, but after one hundred he lost track. His grandfather showed him a trick: divide the sky into small squares and count the stars in just one square. There were twelve in the square, and there were about fifty squares in the sky. “Then that's about six hundred,” said Kenta. “You're quick at math,” his grandfather said with a smile.",
    qs:[["When did Kenta stay there?","Winter vacation","Summer vacation","Spring vacation"],["How many stars were in one square?","Twelve","Fifty","One hundred"],["What was Kenta's answer?","About 600","About 100","About 1,200"]]},
   {ti:"A Day at the Bakery",tx:"On Saturday morning, Aoi helped out at a bakery in her neighborhood for one day. Mr. Yamada, the owner, starts kneading dough at four in the morning. Aoi's jobs were to put freshly baked bread on the shelves and to write price tags. The most popular item was the cream bun: forty of them sold out within an hour of opening. In the early afternoon, a little boy came in holding a single 100-yen coin. He wanted a melon bun, which cost 120 yen. When the boy looked troubled, Mr. Yamada brought out a melon bun that had lost its shape a little and said, “This one is 100 yen.” After the boy left, Mr. Yamada told Aoi quietly, “A bun that's lost its shape tastes just the same.”",
    qs:[["What was the most popular item?","Cream bun","Melon bun","Bean-paste bun"],["How much money did the boy have?","100 yen","120 yen","50 yen"],["When does Mr. Yamada start kneading dough?","At four","At six","At nine"]]},
   {ti:"The Lost Key",tx:"On Monday evening, Haruto realized he had lost his house key. He searched his school bag and his pockets again and again, but he could not find it. So he decided to remember the way he had walked that day. After leaving school, he first bought a notebook at the stationery store. Next, he rode the swings in the park with his friend Sota. Finally, he came home along the path by the river. When he asked the clerk at the stationery store, she said nothing had been found. At the park, he saw a blue key chain shining in the sand under the swings. It must have fallen from his pocket while he was swinging. After that, Haruto decided to hook his key inside his school bag.",
    qs:[["Where did he go first?","The stationery store","The bookstore","The convenience store"],["Where was the key?","Under the swings","By the river","At the stationery store"],["What color was the key chain?","Blue","Red","Yellow"]]},
   {ti:"The Field Trip",tx:"Wednesday was the field trip day that Mio had been waiting for. But the weather forecast the night before said there was a seventy percent chance of rain. Mio made three teru-teru bozu, little white cloth dolls that people hang to wish for good weather, and hung them in the window. When she woke up, the sky was cloudy, but it was not raining yet. By the time the bus reached the zoo, the sun was shining through gaps in the clouds. Mio's class fed the giraffes and watched the penguins march. The moment they got on the bus home, big raindrops began to hit the windows. Back home, Mio said “thank you” to each doll and then drew a face on it.",
    qs:[["What was the chance of rain?","70%","30%","50%"],["Where did the class go?","The zoo","The aquarium","The mountains"],["When did it start to rain?","When they got on the bus home","When they reached the zoo","When Mio woke up"]]}]},
 "zh-Hant":{unit:"字/分",sp:[300,500,800,1200],wide:"山川日月水火木金土人口手目耳花草雨雲天田石竹米貝車門馬魚鳥",
  words:[["圖書館","圖書室","美術館","體育館"],["腳踏車","汽車","消防車","三輪車"],["天氣預報","天氣圖","電費單","天文台"],["冰箱","冰庫","洗衣機","吸塵器"],["企鵝","鵝毛","熊貓","鵜鶘"],["暑假","寒假","春假","午休"],["早餐","午餐","晚餐","早安"],["蝸牛","螳螂","獨角仙","蝴蝶"],["電梯","手扶梯","電燈","電腦"],["報紙","高鐵","紅綠燈","新學期"],["雪人","打雪仗","雪景","雪祭"],["巧克力","巧克力冰","草莓蛋糕","克力巧"],["鉛筆","鉛字","煙囪","遠足"],["咖哩飯","咖哩麵包","蛋包飯","炒飯"],["未來","末日","本來","米飯"],["向日葵","日光燈","向左轉","太陽花"]],
  phrases:[["我吃了蘋果","我買了蘋果","我吃了橘子","我沒吃蘋果"],["明天會下雨","明天會下雪","今天會下雨","明天也會下雨"],["有三隻貓","有兩隻貓","有三隻狗","三隻貓在睡覺"],["撐紅色的傘","撐藍色的傘","買紅色的傘","戴紅色的帽子"],["在車站前面等","在車站後面等","在商店前面等","在車站前面見"],["七點起床了","九點起床了","七點睡覺了","七點到了"],["借了兩本書","借了三本書","買了兩本書","借了兩本筆記本"],["請打開窗戶","請關上窗戶","請打開門","請擦窗戶"],["右轉就到了","左轉就到了","右轉走三分鐘","直走就到了"],["請給我一瓶牛奶","請給我兩瓶牛奶","請給我一瓶茶","請給我一杯牛奶"],["星期日休息","星期六休息","星期日上班","星期日也休息"],["在大樹下面","在小樹下面","在大樹上面","在大石頭下面"]],
  texts:[
   {ti:"圖書館的貓",tx:"鎮上的/小圖書館裡，/有一隻/叫做米露的貓。/牠全身/是白色的，/只有/尾巴尖端/是黑色。/每天早上九點，/圖書館的門/一打開，/米露/就走進來，/在繪本書架前/縮成一團。/孩子們/很喜歡/坐在米露旁邊/看書。/某個下雨天，/到了/平常的時間，/米露/卻沒有出現。/圖書館員/木村小姐/很擔心，/撐著傘/到附近找牠。/結果/在麵包店的/屋簷下，/她看到米露/像在保護牠們/似的，/坐在/三隻小貓旁邊。/木村小姐/把小貓們/放進箱子，/帶回了圖書館。/從那之後/有好一陣子，/繪本書架前/總是/並排睡著/四隻貓。",
    qs:[["米露的尾巴尖端是什麼顏色？","黑色","白色","咖啡色"],["下雨天米露在哪裡？","麵包店的屋簷下","車站的長椅上","學校門口"],["小貓有幾隻？","三隻","兩隻","四隻"]]},
   {ti:"學騎腳踏車",tx:"結衣/八歲那年夏天，/開始練習/騎腳踏車。/爸爸/扶著後座，/結衣/看著正前方/踩踏板。/第一天/她跌倒了/十次以上，/膝蓋/貼了/兩片OK繃。/第二天，/爸爸說：/「看看/遠處那棵樹吧。」/原本/一直盯著腳下的/結衣/抬起頭，/車把/竟然/不再搖晃了。/第三天傍晚，/結衣/繞了公園一圈後/回頭一看，/爸爸/並沒有/扶著後座。/他一直/站在很後面的/長椅旁邊/揮手。/「我從什麼時候/開始/一個人騎的？」/結衣問。/爸爸/笑著回答：/「從半圈前/開始。」",
    qs:[["結衣開始練習那年幾歲？","八歲","七歲","十歲"],["爸爸叫她看哪裡？","遠處的樹","腳下","車把"],["她從什麼時候開始一個人騎？","半圈前","一開始","一圈前"]]},
   {ti:"數星星的夜晚",tx:"寒假的時候，/健太/住在/爺爺山上的家。/和城市不一樣，/這裡/一到晚上/外面就/一片漆黑。/爺爺/拿出/兩件厚外套，/帶健太/到院子裡。/抬頭一看，/滿天/都是星星。/「你看得到/幾顆星星？」/爺爺問。/健太/開始/用手指數，/但數過一百之後/就搞不清楚了。/爺爺/教他一個方法：/把天空/分成/一個個小方格，/只數/其中一格的/星星。/一格裡/有十二顆，/而天空/大約有/五十個/這樣的方格。/「那就是/大約六百顆吧。」/健太說。/爺爺稱讚他：/「你算得/真快。」",
    qs:[["健太是什麼時候住在爺爺家？","寒假","暑假","春假"],["一個方格裡有幾顆星星？","十二顆","五十顆","一百顆"],["健太的答案是？","大約六百顆","大約一百顆","大約一千二百顆"]]},
   {ti:"麵包店的一天",tx:"星期六早上，/葵/在附近的/麵包店/幫忙了一天。/老闆/山田先生/從清晨四點/就開始/揉麵團。/葵的工作/是把/剛烤好的麵包/排到架子上，/還有/寫價格牌。/最受歡迎的/是奶油麵包，/開店/一個小時內，/四十個/就賣光了。/過了中午，/一個小男孩/握著/一枚/一百日圓硬幣/走進店裡。/他想要的/是/一百二十日圓的/菠蘿麵包。/看到男孩/一臉為難，/山田先生/拿出一個/形狀有點走樣的/菠蘿麵包，/說：/「這個是/一百日圓喔。」/男孩走後，/山田先生/小聲地/告訴葵：/「形狀走樣的麵包，/味道/也是一樣的。」",
    qs:[["最受歡迎的是什麼麵包？","奶油麵包","菠蘿麵包","紅豆麵包"],["男孩帶了多少錢？","一百日圓","一百二十日圓","五十日圓"],["山田先生幾點開始揉麵團？","清晨四點","早上六點","早上九點"]]},
   {ti:"不見的鑰匙",tx:"星期一傍晚，/陽斗發現/家裡的鑰匙/不見了。/書包裡、/口袋裡/找了好幾遍，/都找不到。/於是/陽斗決定/回想/那天走過的路。/離開學校後，/他先去文具店/買了筆記本。/接著，/和朋友颯太/在公園/盪鞦韆。/最後，/沿著/河邊的小路/走回家。/他去問/文具店的店員，/店員說/沒有人/撿到東西。/到了公園，/他看到/鞦韆下面的/沙子裡，/有一個/藍色的鑰匙圈/在發光。/一定是/盪鞦韆的時候/從口袋/掉出來的。/從那之後，/陽斗/就把鑰匙/掛在/書包內側的/掛勾上。",
    qs:[["他最先去了哪家店？","文具店","書店","便利商店"],["鑰匙在哪裡？","鞦韆下面","河邊的小路","文具店"],["鑰匙圈是什麼顏色？","藍色","紅色","黃色"]]},
   {ti:"遠足和晴天娃娃",tx:"星期三是/大家/期待已久的/遠足日。/可是/前一天晚上的/氣象預報說，/降雨機率/有百分之七十。/美緒/用白布/做了/三個晴天娃娃，/掛在窗邊。/早上起床時，/天空/雖然陰陰的，/但還沒有下雨。/搭巴士/到動物園的時候，/陽光/從雲縫中/照了下來。/美緒的班級/餵了長頸鹿，/還看了/企鵝遊行。/一坐上/回程的巴士，/大顆的雨滴/就開始/打在窗戶上。/回到家後，/美緒/對每個晴天娃娃/說了聲「謝謝」，/然後/幫它們/畫上了臉。",
    qs:[["前一天晚上的降雨機率是多少？","百分之七十","百分之三十","百分之五十"],["班級去了哪裡？","動物園","水族館","山上"],["什麼時候開始下雨？","坐上回程巴士時","到達動物園時","美緒起床時"]]}]}
,"zh":{unit:"字/分",sp:[300,500,800,1200],wide:"山川日月水火木金土人口手目耳花草雨云天田石竹米贝车门马鱼鸟",
  words:[["图书馆","图书室","美术馆","体育馆"],["自行车","汽车","消防车","三轮车"],["天气预报","天气图","电费单","天文台"],["冰箱","冰库","洗衣机","吸尘器"],["企鹅","鹅毛","熊猫","鹈鹕"],["暑假","寒假","春假","午休"],["早餐","午餐","晚餐","早安"],["蜗牛","螳螂","独角仙","蝴蝶"],["电梯","手扶梯","电灯","电脑"],["报纸","高铁","红绿灯","新学期"],["雪人","打雪仗","雪景","雪祭"],["巧克力","巧克力冰","草莓蛋糕","克力巧"],["铅笔","铅字","烟囱","远足"],["咖喱饭","咖喱面包","蛋包饭","炒饭"],["未来","末日","本来","米饭"],["向日葵","日光灯","向左转","太阳花"]],
  phrases:[["我吃了苹果","我买了苹果","我吃了橘子","我没吃苹果"],["明天会下雨","明天会下雪","今天会下雨","明天也会下雨"],["有三只猫","有两只猫","有三只狗","三只猫在睡觉"],["撑红色的伞","撑蓝色的伞","买红色的伞","戴红色的帽子"],["在车站前面等","在车站后面等","在商店前面等","在车站前面见"],["七点起床了","九点起床了","七点睡觉了","七点到了"],["借了两本书","借了三本书","买了两本书","借了两本笔记本"],["请打开窗户","请关上窗户","请打开门","请擦窗户"],["右转就到了","左转就到了","右转走三分钟","直走就到了"],["请给我一瓶牛奶","请给我两瓶牛奶","请给我一瓶茶","请给我一杯牛奶"],["星期日休息","星期六休息","星期日上班","星期日也休息"],["在大树下面","在小树下面","在大树上面","在大石头下面"]],
  texts:[
   {ti:"图书馆的猫",tx:"镇上的/小图书馆里，/有一只/叫做米露的猫。/牠全身/是白色的，/只有/尾巴尖端/是黑色。/每天早上九点，/图书馆的门/一打开，/米露/就走进来，/在绘本书架前/缩成一团。/孩子们/很喜欢/坐在米露旁边/看书。/某个下雨天，/到了/平常的时间，/米露/却没有出现。/图书馆员/木村小姐/很担心，/撑着伞/到附近找牠。/结果/在面包店的/屋檐下，/她看到米露/像在保护牠们/似的，/坐在/三只小猫旁边。/木村小姐/把小猫们/放进箱子，/带回了图书馆。/从那之后/有好一阵子，/绘本书架前/总是/并排睡着/四只猫。",
    qs:[["米露的尾巴尖端是什么颜色？","黑色","白色","咖啡色"],["下雨天米露在哪里？","面包店的屋檐下","车站的长椅上","学校门口"],["小猫有几只？","三只","两只","四只"]]},
   {ti:"学骑自行车",tx:"结衣/八岁那年夏天，/开始练习/骑自行车。/爸爸/扶着后座，/结衣/看着正前方/踩踏板。/第一天/她跌倒了/十次以上，/膝盖/贴了/两片OK绷。/第二天，/爸爸说：/「看看/远处那棵树吧。」/原本/一直盯着脚下的/结衣/擡起头，/车把/竟然/不再摇晃了。/第三天傍晚，/结衣/绕了公园一圈后/回头一看，/爸爸/并没有/扶着后座。/他一直/站在很后面的/长椅旁边/挥手。/「我从什么时候/开始/一个人骑的？」/结衣问。/爸爸/笑着回答：/「从半圈前/开始。」",
    qs:[["结衣开始练习那年几岁？","八岁","七岁","十岁"],["爸爸叫她看哪里？","远处的树","脚下","车把"],["她从什么时候开始一个人骑？","半圈前","一开始","一圈前"]]},
   {ti:"数星星的夜晚",tx:"寒假的时候，/健太/住在/爷爷山上的家。/和城市不一样，/这里/一到晚上/外面就/一片漆黑。/爷爷/拿出/两件厚外套，/带健太/到院子里。/擡头一看，/满天/都是星星。/「你看得到/几颗星星？」/爷爷问。/健太/开始/用手指数，/但数过一百之后/就搞不清楚了。/爷爷/教他一个方法：/把天空/分成/一个个小方格，/只数/其中一格的/星星。/一格里/有十二颗，/而天空/大约有/五十个/这样的方格。/「那就是/大约六百颗吧。」/健太说。/爷爷称赞他：/「你算得/真快。」",
    qs:[["健太是什么时候住在爷爷家？","寒假","暑假","春假"],["一个方格里有几颗星星？","十二颗","五十颗","一百颗"],["健太的答案是？","大约六百颗","大约一百颗","大约一千二百颗"]]},
   {ti:"面包店的一天",tx:"星期六早上，/葵/在附近的/面包店/帮忙了一天。/老板/山田先生/从清晨四点/就开始/揉面团。/葵的工作/是把/刚烤好的面包/排到架子上，/还有/写价格牌。/最受欢迎的/是奶油面包，/开店/一个小时内，/四十个/就卖光了。/过了中午，/一个小男孩/握着/一枚/一百日圆硬币/走进店里。/他想要的/是/一百二十日圆的/菠萝面包。/看到男孩/一脸为难，/山田先生/拿出一个/形状有点走样的/菠萝面包，/说：/「这个是/一百日圆喔。」/男孩走后，/山田先生/小声地/告诉葵：/「形状走样的面包，/味道/也是一样的。」",
    qs:[["最受欢迎的是什么面包？","奶油面包","菠萝面包","红豆面包"],["男孩带了多少钱？","一百日圆","一百二十日圆","五十日圆"],["山田先生几点开始揉面团？","清晨四点","早上六点","早上九点"]]},
   {ti:"不见的钥匙",tx:"星期一傍晚，/阳斗发现/家里的钥匙/不见了。/书包里、/口袋里/找了好几遍，/都找不到。/于是/阳斗决定/回想/那天走过的路。/离开学校后，/他先去文具店/买了笔记本。/接着，/和朋友飒太/在公园/荡秋千。/最后，/沿着/河边的小路/走回家。/他去问/文具店的店员，/店员说/没有人/捡到东西。/到了公园，/他看到/秋千下面的/沙子里，/有一个/蓝色的钥匙圈/在发光。/一定是/荡秋千的时候/从口袋/掉出来的。/从那之后，/阳斗/就把钥匙/挂在/书包内侧的/挂勾上。",
    qs:[["他最先去了哪家店？","文具店","书店","便利商店"],["钥匙在哪里？","秋千下面","河边的小路","文具店"],["钥匙圈是什么颜色？","蓝色","红色","黄色"]]},
   {ti:"远足和晴天娃娃",tx:"星期三是/大家/期待已久的/远足日。/可是/前一天晚上的/气象预报说，/降雨几率/有百分之七十。/美绪/用白布/做了/三个晴天娃娃，/挂在窗边。/早上起床时，/天空/虽然阴阴的，/但还没有下雨。/搭巴士/到动物园的时候，/阳光/从云缝中/照了下来。/美绪的班级/喂了长颈鹿，/还看了/企鹅游行。/一坐上/回程的巴士，/大颗的雨滴/就开始/打在窗户上。/回到家后，/美绪/对每个晴天娃娃/说了声「谢谢」，/然后/帮它们/画上了脸。",
    qs:[["前一天晚上的降雨几率是多少？","百分之七十","百分之三十","百分之五十"],["班级去了哪里？","动物园","水族馆","山上"],["什么时候开始下雨？","坐上回程巴士时","到达动物园时","美绪起床时"]]}]}
};
const C=()=>RD_TXT[lang]||RD_TXT.ja;
const EN=()=>lang==="en";
const LK=()=>EN()?"en":"cj";   // 速さの記録は「語/分」と「字/分」で分ける
const units=s=>EN()?s.trim().split(/\s+/).filter(Boolean).length:s.replace(/\s/g,"").length;
const fmt2=ms=>(ms/1000).toFixed(2)+t("sec");
const WIDE=[10,15,20,25,30,35,40];        // 視野：左右の文字のまん中からの距離（画面幅の％）
const WMS=[400,250,150];                   // 視野：表示時間（ミリ秒）

// 文章の区切り：日本語・中国語は本文の「/」（表示しない）、英語は1〜2語ずつ
const plain=tx=>tx.replace(/\//g,"");
function chunks(text){
  if(!EN()) return text.split("/").filter(Boolean);
  const w=text.split(/\s+/).filter(Boolean),out=[];
  for(let i=0;i<w.length;i++){ let c=w[i]; if(c.replace(/[^A-Za-z0-9]/g,"").length<=3&&i+1<w.length&&!/[.,!?;:”"]$/.test(c)) c+=" "+w[++i]; out.push(c); } return out; }

/* =========================================================
   速読
   ========================================================= */
const RD={
  s:Object.assign({kind:"flash",len:"word",sp:"1",wd:"1"},store.get("b_rd",{})),
  st:null,rf:[],tms:[],run:0,dk:"",clk:0,
  save(){ store.set("b_rd",this.s); },
  init(){
    this.pane=$('[data-pane="read"]');
    const ch=(id,k)=>this.rf.push(chips($(id),()=>this.s[k],v=>{this.s[k]=v;this.save()},()=>this.refresh()));
    ch("#rdKindSel","kind"); ch("#rdLenSel","len"); ch("#rdSpSel","sp"); ch("#rdWdSel","wd");
    $("#rdQuit").onclick=()=>this.quit();
    $("#rdChoices").addEventListener("click",e=>{ const b=e.target.closest("[data-ch]"); if(b) this.choose(+b.dataset.ch,b); });
    this.refresh(); },
  key0(){ const s=this.s; return s.kind==="flash"?`flash-${s.len}`:s.kind==="wide"?`wide-${s.wd}`:`${s.kind}-${LK()}`; },
  refresh(){ const s=this.s,c=C(); this.rf.forEach(f=>f());
    $("#rdLead").innerHTML=t("rdLead_"+s.kind);
    $("#rdLenRow").hidden=s.kind!=="flash"; $("#rdSpRow").hidden=s.kind!=="rsvp"; $("#rdWdRow").hidden=s.kind!=="wide";
    $("#rdSpLbl").textContent=t("rdOptSp",{u:c.unit}); $$("#rdSpSel [data-val]").forEach(b=>b.textContent=c.sp[+b.dataset.val]);
    const b=store.get("b_rd_best",{})[this.key0()];
    const k=s.kind==="flash"?t(s.len==="word"?"rdLenWord":"rdLenPhrase"):s.kind==="wide"?t("rdWd"+s.wd):"";
    $("#rdBestLbl").textContent=t("rdBest_"+s.kind,{k});
    $("#rdBest").textContent=b==null?"—":s.kind==="flash"?fmt2(b):s.kind==="wide"?t("rdLv",{n:b}):`${b} ${c.unit}`;
    const h=s.kind==="meas"?(store.get("b_rd_hist",{})[LK()]||[]):[];
    $("#rdHist").innerHTML=h.length?`<b>${esc(t("rdHist"))}</b><br>`+h.map(x=>`${esc(new Date(x.d).toLocaleDateString(lang==="zh"?"zh-CN":lang==="zh-Hant"?"zh-TW":lang,{month:"numeric",day:"numeric"}))}　<span class="num">${x.v}</span> ${esc(c.unit)}　${esc(t("rdUnd"))} ${x.c}/3`).join("<br>"):""; },
  view(v){ this.pane.dataset.v=v; if(mode==="read") this.dock(); },
  dock(){ if(mode!=="read") return;
    if(this.pane.dataset.v==="setup") return setDock(`<button class="btn primary big" data-act="start"><i class="ic" data-ic="play"></i>${esc(t("rdStart"))}</button>`);
    if(this.dk==="mstart") return setDock(`<button class="btn primary big" data-act="mstart"><i class="ic" data-ic="play"></i>${esc(t("rdBegin"))}</button>`);
    if(this.dk==="mdone") return setDock(`<button class="btn primary big" data-act="mdone"><i class="ic" data-ic="check"></i>${esc(t("rdDone"))}</button>`);
    setDock(""); },
  act(a){ if(a==="start") this.start(); else if(a==="mstart") this.mBegin(); else if(a==="mdone") this.mEnd(); },
  later(fn,ms){ const r=this.run; this.tms.push(setTimeout(()=>{ if(r===this.run) fn(); },ms)); },
  clear(){ this.run++; this.tms.forEach(clearTimeout); this.tms=[]; clearInterval(this.clk); this.dk=""; },
  stage(cls,html){ const s=$("#rdStage"); s.className="rdstage "+cls; s.innerHTML=html; },
  setCh(list,one){ const el=$("#rdChoices"); el.classList.toggle("one",!!one); el.innerHTML=list.map((h,i)=>`<button class="btn" data-ch="${i}">${h}</button>`).join(""); },
  fb(h){ $("#rdFb").innerHTML=h; },
  start(){ this.clear(); const k=this.s.kind; this.st={kind:k,i:0,n:10,res:[]}; this.view("play"); this.fb(""); this.setCh([]); $("#rdInfo").textContent="";
    if(k==="flash"){ this.st.ms=this.s.len==="word"?500:800; this.fNext(); }
    else if(k==="wide"){ this.st.lv=1; this.wNext(); }
    else { const p=this.pick(); this.st.p=p; $("#rdProg").textContent=p.ti; k==="rsvp"?this.rStart():this.mStart(); } },
  pick(){ const L=C().texts,last=store.get("b_rd_last",[]); let cand=L.map((_,i)=>i).filter(i=>!last.includes(i)); if(!cand.length) cand=L.map((_,i)=>i);
    const i=cand[rnd(cand.length)]; store.set("b_rd_last",[i,...last].slice(0,3)); return L[i]; },
  prog(){ $("#rdProg").textContent=`${this.st.i} / ${this.st.n}`; },
  // ----- フラッシュ読み -----
  fNext(){ const st=this.st; st.i++; this.prog(); this.fb(""); this.setCh([]); st.open=false;
    const pool=C()[this.s.len==="word"?"words":"phrases"]; let g; do{ g=pool[rnd(pool.length)]; }while(pool.length>1&&g===st.lastG); st.lastG=g;
    const opts=shuffle(g.slice()), ans=opts[rnd(opts.length)]; st.cur={opts,ans};
    $("#rdInfo").textContent=fmt2(st.ms); $("#rdQ").textContent=t("rdFlashQ");
    this.stage("fl",`<span class="rdfix">+</span>`);
    this.later(()=>{ this.stage("fl",`<span class="rdword">${esc(ans)}</span>`);
      this.later(()=>{ this.stage("fl",`<span class="rdword rdmask">${esc(ans.replace(/\S/g,EN()?"#":"■"))}</span>`);
        this.later(()=>{ this.stage("fl",`<span class="rdfix">?</span>`); $("#rdQ").textContent=t("rdPick"); this.setCh(opts.map(esc),true); st.open=true; },200); },st.ms); },800); },
  // ----- 視野を広げる -----
  wNext(){ const st=this.st; st.i++; this.prog(); this.fb(""); this.setCh([]); st.open=false;
    const S=[...C().wide], a=rnd(S.length); let b; do{ b=rnd(S.length); }while(b===a); const ans=[S[a],String(1+rnd(9)),S[b]];
    const opts=[ans]; const key=x=>x.join("|"); let guard=0;
    while(opts.length<4&&guard++<60){ const o=ans.slice(), p=rnd(3); o[p]=p===1?String(1+rnd(9)):S[rnd(S.length)]; if(o[0]!==o[2]&&!opts.some(x=>key(x)===key(o))) opts.push(o); }
    shuffle(opts); st.cur={opts,ans};
    const d=WIDE[st.lv-1]; $("#rdInfo").textContent=t("rdLv",{n:st.lv}); $("#rdQ").textContent=t("rdWideQ");
    const tri=(x,cls)=>`<div class="rdwide${cls||""}"><span style="left:${50-d}%">${esc(x[0])}</span><span class="c" style="left:50%">${esc(x[1])}</span><span style="left:${50+d}%">${esc(x[2])}</span></div>`;
    this.stage("wd",`<span class="rdfix">+</span>`);
    this.later(()=>{ this.stage("wd",tri(ans));
      this.later(()=>{ this.stage("wd",tri(["■","■","■"]," rdmask"));
        this.later(()=>{ this.stage("wd",`<span class="rdfix">?</span>`); $("#rdQ").textContent=t("rdPickW");
          this.setCh(opts.map(o=>`<span class="rdtri"><b>${esc(o[0])}</b><i>${esc(o[1])}</i><b>${esc(o[2])}</b></span>`)); st.open=true; },200); },WMS[+this.s.wd]); },900); },
  // ----- 高速表示 -----
  rStart(){ const st=this.st,c=C(); st.speed=c.sp[+this.s.sp]; st.ch=chunks(st.p.tx);
    $("#rdInfo").textContent=`${st.speed} ${c.unit}`; $("#rdQ").textContent=t("rdReady");
    [3,2,1].forEach((n,j)=>this.later(()=>{ this.stage("rs",`<span class="rdfix num">${n}</span>`); sfx.tap(); },j*600));
    this.later(()=>{ $("#rdQ").textContent=""; st.t0=now(); this.rPlay(0); },1800); },
  rPlay(k){ const st=this.st; if(k>=st.ch.length){ this.stage("rs",`<span class="rdfix">✓</span>`); this.later(()=>this.qStart(),600); return; }
    const c=st.ch[k]; this.stage("rs",`<span class="rdword">${esc(c)}</span>`);
    let ms=Math.max(110,units(c)/st.speed*60000); if(/[。．！？.!?」”]$/.test(c)) ms*=1.5; this.later(()=>this.rPlay(k+1),ms); },
  // ----- 速さの測定 -----
  mStart(){ $("#rdQ").textContent=""; $("#rdInfo").textContent=""; this.stage("tx",`<div class="rdcover">${esc(t("rdCover"))}</div>`); this.dk="mstart"; this.dock(); },
  mBegin(){ const st=this.st; this.stage("tx",`<div class="rdtext">${esc(plain(st.p.tx))}</div>`); st.t0=now(); this.dk="mdone"; this.dock(); sfx.tap();
    clearInterval(this.clk); this.clk=setInterval(()=>$("#rdInfo").textContent=fmtSec(now()-st.t0),200); },
  mEnd(){ const st=this.st; st.ms=now()-st.t0; clearInterval(this.clk); this.dk=""; this.dock();
    st.speed=Math.round(units(plain(st.p.tx))/(st.ms/60000)); $("#rdInfo").textContent=fmtSec(st.ms); this.qStart(); },
  // ----- 内容のクイズ（高速表示・測定） -----
  qStart(){ const st=this.st; st.qi=0; st.qc=0; st.quiz=true; this.qNext(); },
  qNext(){ const st=this.st, q=st.p.qs[st.qi]; this.fb(""); this.stage("q","");
    $("#rdQ").innerHTML=`<small class="rdqn">${esc(t("rdQuiz",{i:st.qi+1,n:st.p.qs.length}))}</small><br>${esc(q[0])}`;
    const opts=shuffle(q.slice(1)); st.cur={opts,ans:q[1]}; this.setCh(opts.map(esc),true); st.open=true; },
  // ----- 答える -----
  choose(i,b){ const st=this.st; if(!st||!st.open) return; st.open=false; const {opts,ans}=st.cur; const same=(x,y)=>Array.isArray(x)?x.join("|")===y.join("|"):x===y;
    const ok=same(opts[i],ans);
    $$("#rdChoices [data-ch]").forEach((x,j)=>{ if(same(opts[j],ans)) x.classList.add("right"); }); if(!ok) b.classList.add("wrong");
    ok?sfx.ok():sfx.ng();
    const ansTxt=Array.isArray(ans)?ans.join(" "):ans;
    this.fb(ok?`<span class="okc">${esc(t("rdOk"))}</span>`:`<span class="ngc">${esc(t("rdNg",{a:ansTxt}))}</span>`);
    if(st.quiz){ if(ok) st.qc++; st.qi++; return this.later(()=>st.qi>=st.p.qs.length?this.finish():this.qNext(),ok?900:1500); }
    if(st.kind==="flash"){ st.res.push({ok,ms:st.ms}); st.ms=ok?Math.max(30,Math.round(st.ms*.8)):Math.min(1500,Math.round(st.ms*1.25)); }
    else { st.res.push({ok,lv:st.lv}); st.lv=ok?Math.min(WIDE.length,st.lv+1):Math.max(1,st.lv-1); }
    this.later(()=>st.i>=st.n?this.finish():st.kind==="flash"?this.fNext():this.wNext(),ok?800:1300); },
  finish(){ const st=this.st,c=C(),bm=store.get("b_rd_best",{}),k=this.key0(),r=st.res; let o;
    if(st.kind==="flash"||st.kind==="wide"){ const okN=r.filter(x=>x.ok).length;
      if(st.kind==="flash"){ const best=okN?Math.min(...r.filter(x=>x.ok).map(x=>x.ms)):null; const isBest=best!=null&&(bm[k]==null||best<bm[k]); if(isBest) bm[k]=best;
        o={title:t("tRead"),big:best==null?"—":fmt2(best),bigLbl:t("rdFlashBig"),isBest,stats:[[t("rdRight"),`${okN} / ${r.length}`],[t("rdLast"),fmt2(r[r.length-1].ms)]]}; }
      else { const best=okN?Math.max(...r.filter(x=>x.ok).map(x=>x.lv)):0; const isBest=best>0&&best>(bm[k]||0); if(isBest) bm[k]=best;
        o={title:t("tRead"),big:best?t("rdLv",{n:best}):"—",bigLbl:t("rdWideBig"),isBest,stats:[[t("rdRight"),`${okN} / ${r.length}`],[t("rdOptWd"),t("rdWd"+this.s.wd)]]}; } }
    else { const n=st.p.qs.length, okQ=st.qc>=2, isBest=okQ&&st.speed>(bm[k]||0); if(isBest) bm[k]=st.speed;
      const stats=[[t("rdUnd"),`${st.qc} / ${n}`]]; if(st.kind==="meas") stats.push([t("rdTime"),fmtSec(st.ms)]);
      if(st.kind==="meas"){ const h=store.get("b_rd_hist",{}); h[LK()]=[{v:st.speed,c:st.qc,d:Date.now()},...(h[LK()]||[])].slice(0,5); store.set("b_rd_hist",h); }
      const hint=st.kind==="rsvp"?(st.qc<2?t("rdHintSlow"):st.qc===n?t("rdHintFast"):""):(st.qc<2?t("rdHintMeas"):"");
      o={title:t("tRead"),big:String(st.speed),bigLbl:`${c.unit}`,isBest,stats,extra:hint?`<p class="rdhint">${esc(hint)}</p>`:""}; }
    store.set("b_rd_best",bm); this.clear(); this.st=null; this.view("setup"); this.refresh();
    showResult(Object.assign(o,{retry:()=>this.start()})); },
  quit(){ this.clear(); this.st=null; this.view("setup"); this.refresh(); }
};

return RD;
});
