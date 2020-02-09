enchant();

window.onload = function () {
	var game = new Game(500, 400);  				//★画面サイズを500*400にする。

	//結果ツイート時にURLを貼るため、このゲームのURLをここに記入
	//var url = "https://twitter.com/hothukurou";
	//url = encodeURI(url); //きちんとURLがツイート画面に反映されるようにエンコードする
	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分


	for (var i = 1; i <= 7; i++) {
		eval('var B_Image' + i + '="image/image' + i + '.png"');		//eval関数を使ってimage/image〇のURLを取得して、変数B_Imageに格納
		eval('game.preload([B_Image' + i + ']);');						//ついでにプリロードまで済ませてしまう
	}

	var clearFlg =0;	//クリア状態　0:失敗,1:成功

	//読み込み終わり
	/////////////////////////////////////////////////

	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 
		var Score = 0;									//スコア
		var MonsterAry = [];							//モンスタースプライトを管理する配列

		//グローバル変数終わり
		/////////////////////////////////////////////////

		//////////////////////////////////////
		//オープニングシーン
		//////////////////////////////////////
		var S_OPENING = new Scene();					//シーン作成
		game.pushScene(S_OPENING);  					//S_MAINシーンオブジェクトを画面に設置
		S_OPENING.backgroundColor = "black"; 			//S_MAINシーンの背景は黒くした
		var S_Title = new Sprite(300, 200);				//タイトルを配置
		S_Title.image = game.assets[B_Image7];			//タイトル画像
		S_Title.x = 100;								
		S_Title.y = 30;									
		S_OPENING.addChild(S_Title);					

		//テキスト
		var S_OpeningText = new Label(); 				//テキストはLabelクラス
		S_OpeningText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_OpeningText.color = 'rgba(255,255,255,1)';	//色　RGB+透明度　今回は白
		S_OpeningText.width = 470;						//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる		S_OpeningText.moveTo(200, 200);					//移動位置指定
	
		S_OpeningText.moveTo(30, 200);					//移動位置指定
		S_OpeningText.text ='テキストファイル(UTF-8)を選択してください。';
		S_OPENING.addChild(S_OpeningText);				//S_MAINシーンにこの画像を埋め込む

		var S_input = new Entity();

		//DOM設定
		S_input._element = document.createElement('input');
		S_input._element.setAttribute('type','file');
		//S_input._element.setAttribute('font','20px Meiryo');
		//S_input._element.setAttribute('maxlength','40');
		S_input._element.setAttribute('id','inputfile');
		S_input.width = 300;
		S_input.height = 20;
		S_input.x = 30;
		S_input.y = 240;
		S_OPENING.addChild(S_input);

		var startMain = function (){
			game.popScene();
			game.pushScene(S_MAIN);  					//S_MAINシーンオブジェクトを画面に設置
			S_MAIN.backgroundColor = "gray"; 			//S_MAINシーンの背景は黒くした
		}

		var obj1 = document.getElementById("inputfile");
		var stringAry =[];

		//ダイアログでファイルが選択された時
		obj1.addEventListener("change",function(evt){
			S_OpeningText.text ='戦闘を開始します。';
			var file = evt.target.files;
			//FileReaderの作成
			var reader = new FileReader();
			//テキスト形式で読み込む
			reader.readAsText(file[0]);
			
			//読込終了後の処理
			reader.onload = function(ev){
				//テキストエリアに表示する
				stringAry = convertTxttoArray(reader.result);
				setTimeout(startMain,2000);
			}
		},false);
		
		var replaceAll = function(str, before, after) {
			return str.split(before).join(after);
		  };

		var convertTxttoArray = function (str){ // 読み込んだCSVデータが文字列として渡される
			var result = []; // 最終的な二次元配列を入れるための配列
			var tmp = str;
			//tmp = replaceAll(tmp,",",",\n") ;
			tmp = replaceAll(tmp,"\.","\.\n") ;
			//tmp = replaceAll(tmp,"、","、\n") ;
			tmp = replaceAll(tmp,"。","。\n") ;
			tmp = replaceAll(tmp,"\t","\n") ;
		
			var tmp2 = tmp.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
		
			var j=-1
			for(var i=0;i<tmp2.length;++i){
				if (tmp2[i].trim().length > 0) {
					//１文字以上あったら配列に格納
					j++;
					result[j] = tmp2[i].trim();
				}
			}
			return result;
		}

		//////////////////////////////////////
		//メインシーン
		//////////////////////////////////////
		var S_MAIN = new Scene();					//シーン作成

		//テキスト
		var S_Text = new Label(); 					//テキストはLabelクラス
		S_Text.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_Text.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_Text.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_Text.moveTo(400, 30);						//移動位置指定
		S_MAIN.addChild(S_Text);					//S_MAINシーンにこの画像を埋め込む

		S_Text.text = "現在：" + Score;				//テキストに文字表示 Scoreは変数なので、ここの数字が増える

		var idxString =-1;
		function init() {							//初期化用関数
			Score = 0;
			//画面のスライムをすべて削除する
			for (var i = 0; i < MonsterAry.length; i++) {
				if (MonsterAry[i] != null) MonsterAry[i].parentNode.removeChild(MonsterAry[i]);		//画面にスライムが残っていれば削除する
			}
			MonsterAry = [];		//モンスター管理用の配列を初期化

			S_OpeningText.text ='テキストファイル(UTF-8)を選択してください。';
			obj1.value = ""; //インプットボックス初期化
			idxString =-1;
			clearFlg =0;
		}
		init();

		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		S_MAIN.time = 0;										//S_MAIN内で使用するカウント用変数
		S_MAIN.onenterframe = function () {
			S_Text.text = "現在：" + Score;						//テキストに文字表示 Scoreは変数なので、ここの数字が増える
			this.time++;										//毎フレームカウントを１増やす
			if (stringAry.length <= Score) {					//★画面下に入ったら
				clearFlg =1;
				game.popScene();								//S_MAINシーンを外して
				game.pushScene(S_END);							//S_ENDシーンを見せる
			}	
			if (this.time >= 60 - Score) {						//カウントが６０-Scoreを超えたら
				this.time = 0;

				var S_Monster  = new Label(); 					//テキストはLabelクラス		
				idxString++;
				if (stringAry.length > idxString) {				//★画面下に入ったら
					
					S_Monster.font = "16px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
					S_Monster.color = 'rgba(255,0,0,1)';		//色　RGB+透明度　今回は白
					S_Monster.width = 16 * stringAry[idxString].length;	

					S_Monster.text = stringAry[idxString]; 
					//var S_Monster = new Sprite(32, 32);				//スライムを配置
					//S_Monster.image = game.assets[B_Image5];			//スライム画像
					//S_Monster.x = 0;									//★出現X座標
					S_Monster.x = 500;									//★出現X座標
					S_Monster.y = Math.random() * 360;					//★出現Y座標
					S_MAIN.addChild(S_Monster);							//S_MAINシーンに追加
					S_Monster.number = MonsterAry.length;				//自分がMonsterAryのどこにいるか覚えておく(削除するときに使う)
					MonsterAry.push(S_Monster);							//MonsterAry（モンスター管理用配列）に格納
				}

				S_Monster.onenterframe = function () {				//モンスターの動作
					this.x -= 2;									//★下に降りる
					//if (this.x >= 500) {							//★画面下に入ったら
					if (this.x <= 0) {								//★画面下に入ったら
						//
						game.popScene();							//S_MAINシーンを外して
						game.pushScene(S_END);						//S_ENDシーンを見せる
					}
					//if (this.frame == 2) this.frame = 0;			//フレームを動かす処理
					//else this.frame++;							//もし3フレーム以内なら次のフレームを表示
				};

			}
		};

		///////////////////////////////////////////////////
		//クリックで球を発射
		S_MAIN.ontouchend = function () {
			var S_Bomb = new Sprite(16, 16);				//爆弾画像のspriteを宣言（数字は縦横サイズ）
			S_Bomb.image = game.assets[B_Image4];			//爆弾画像
			S_Bomb.moveTo(S_Hero.x, S_Hero.y);				//自機の位置に持ってくる
			S_MAIN.addChild(S_Bomb);						//S_MAINシーンに貼る
			S_Bomb.onenterframe = function () {				//毎フレーム毎に実行
				//this.x -= 5;								//★上に進む
				this.x += 5;								//★上に進む
				for (var i = 0; i < MonsterAry.length; i++) {	//爆弾とスライムの衝突処理(MonsterAryに入っているすべてのモンスターに対して当たり判定を行う)
					if (MonsterAry[i] != null) {				//もう削除済みなら次のインデックスを見る
						if (Math.sqrt(((this.x - 8) - (MonsterAry[i].x - 8)) * ((this.x - 8) - (MonsterAry[i].x - 8)) + ((this.y - 8) - (MonsterAry[i].y - 8)) * ((this.y - 8) - (MonsterAry[i].y - 8))) < 32) {//衝突判定
							Score++;		//スコアを１足す

							var S_Effect = new Sprite(16, 16);									//爆発エフェクト
							S_Effect.moveTo(MonsterAry[i].x, MonsterAry[i].y);					//スライム画像と同じ位置に爆発エフェクトを設置
							S_MAIN.addChild(S_Effect);											//S_MAINシーンに表示
							S_Effect.image = game.assets[B_Image6];								//爆発画像
							S_Effect.onenterframe = function () {								//毎フレーム処理
								if (this.frame >= 5) this.parentNode.removeChild(this);			//フレームが最後だったら消える
								else this.frame++;												//そうでなかったら、フレームを１増やす
							};

							MonsterAry[i].parentNode.removeChild(MonsterAry[i]);				//スライムをS_MAINから外す
							MonsterAry[i] = null;												//管理用配列の自分の部分はNULLに置き換える
							this.parentNode.removeChild(this);									//thisは爆弾なので、爆弾を消す
							return;
						}
					}
				}
				if (this.y > 550) this.parentNode.removeChild(this);	//画面外に出たら、S_MAINシーンから外す。
			};
		};

		//自機
		//テキスト
		var S_Hero  = new Label(); 					//テキストはLabelクラス
		S_Hero.font = "16px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_Hero.color = 'rgba(0,0,255,1)';			//色　RGB+透明度　今回は白
		S_Hero.width = 32;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_Hero.text = "自機";

		//var S_Hero = new Sprite(32, 32);					//自機のサイズのspriteを宣言（数字は縦横サイズ）
		//S_Hero.image = game.assets[B_Image3];				//自機画像
		S_Hero.moveTo(0, 180);								//★自機の位置
		S_MAIN.addChild(S_Hero);							//S_MAINシーンに貼る
		S_Hero.time = 0;									//Sin波で自機を左右に移動させるので、カウントが必要
		S_Hero.onenterframe = function () {
			this.time++;									//カウントを１増やす
			this.y = Math.sin(this.time / 10) * 180 + 180;	//★Sin波で自機を左右に移動させる
		};



		////////////////////////////////////////////////////////////////
		//結果画面
		S_END = new Scene();
		S_END.backgroundColor = "blue";
		S_END.onenterframe = function () {
			var sClear="";
			if (clearFlg ==1){
				sClear ="クリア！！！！<br><br>";
			}
			else
			{
				sClear ="Game Over<br><br>";
			}
			S_GameOverText.text = sClear + Score + "体　敵を倒した！";
		};

		//GAMEOVER
		var S_GameOverText = new Label(); 					//テキストはLabelクラス
		S_GameOverText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_GameOverText.width = 200;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameOverText.moveTo(150, 100);					//移動位置指定
		S_END.addChild(S_GameOverText);						//S_ENDシーンにこの画像を埋め込む

		//リトライボタン
		var S_Retry = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Retry.moveTo(200, 250);						//コインボタンの位置
		S_Retry.image = game.assets[B_Image2];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Retry);						//S_MAINにこのコイン画像を貼り付ける  

		S_Retry.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			init();										//スコアなど、変化する変数を初期化する関数
			game.popScene();							//S_ENDシーンを外す
			game.pushScene(S_OPENING);					//S_MAINシーンを入れる
		};

		//ツイートボタン
		//var S_Tweet = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		//S_Tweet.moveTo(230, 300);						//コインボタンの位置
		//S_Tweet.image = game.assets[B_Image1];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		//S_END.addChild(S_Tweet);					//S_MAINにこのコイン画像を貼り付ける  

		//S_Tweet.ontouchend = function () {				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
		//	//ツイートＡＰＩに送信
		//
		//	window.open("http://twitter.com/intent/tweet?text=頑張って" + Score + "個壊した&hashtags=ahoge&url=" + url); //ハッシュタグにahogeタグ付くようにした。
		//};

	};
	game.start();
};