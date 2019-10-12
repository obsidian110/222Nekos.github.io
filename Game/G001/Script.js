enchant();

window.onload = function () {
	var game = new Game(400, 500);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分


	//画像
	var AnimalImg0 = "animal0.png";						//game.htmlからの相対パス
	game.preload([AnimalImg0]);					//データを読み込んでおく

	var AnimalImg1 = "animal1.png";						//game.htmlからの相対パス
	game.preload([AnimalImg1]);					//データを読み込んでおく

	var AnimalImg2 = "animal2.png";						//game.htmlからの相対パス
	game.preload([AnimalImg2]);					//データを読み込んでおく

	var AnimalImg3 = "animal3.png";						//game.htmlからの相対パス
	game.preload([AnimalImg3]);					//データを読み込んでおく

	var AnimalImg4 = "animal4.png";						//game.htmlからの相対パス
	game.preload([AnimalImg4]);					//データを読み込んでおく

	var AnimalImg5 = "animal5.png";						//game.htmlからの相対パス
	game.preload([AnimalImg5]);					//データを読み込んでおく

	//リトライボタン
	var B_Retry = "Retry.png";						//game.htmlからの相対パス
	game.preload([B_Retry]);					//データを読み込んでおく


	//ツイートボタン
//	var B_Tweet = "Tweet.png";						//game.htmlからの相対パス
//	game.preload([B_Tweet]);					//データを読み込んでおく		

	
	var B_Title = "title.png";	
	game.preload([B_Title]);			

	var B_Koya = "inugoya.png";	
	game.preload([B_Koya]);	

	/////////////////////////////////////////////////
	var B_Field = "field.png";	
	game.preload([B_Field]);	
	var bg = function( scene , gazou) {
		field = new Sprite( 400, 500 );
		field.image = game.assets[gazou];
		scene.addChild( field );
	}
	
	//読み込み終わり	
	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 

		var Level = 1;									//ポイント
		var State = -1;								//現在のゲーム状態
		var cnt = 0;
		//グローバル変数終わり
		/////////////////////////////////////////////////
	
		var S_TITLE  = new Scene();					//シーン作成
		bg(S_TITLE,B_Title)
		game.pushScene(S_TITLE); 
		
		var S_MAIN = new Scene();					//シーン作成
		bg(S_MAIN,B_Field);

		//game.pushScene(S_MAIN);  					//S_MAINシーンオブジェクトを画面に設置

		//犬小屋
		var S_Koya = new Array() ;
		var i ;
		//ポイント表示テキスト
		var S_Serihu = new Array() ;					//テキストはLabelクラス

		var arr = [0,1,2,3,4,5];
		var a = arr.length;

		//シャッフルアルゴリズム
		randAray = function(){
			while (a) {
				var j = 0
				j = Math.floor( Math.random() * a );
				var t = arr[--a];
				arr[a] = arr[j];
				arr[j] = t;
			}
		}
		
		for( i = 0 ; i < 6 ; i++ ){
            //Spriteを作成する
			S_Koya[i] = new Sprite( 96, 75 ) ;
			S_Koya[i].image = game.assets[B_Koya];
			S_Serihu[i] = new Label();
			S_Serihu[i].font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
			S_Serihu[i].color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
			S_Serihu[i].width = 200;	
			S_Serihu[i].opacity = 0;
		}

		SetSerihu = function(){
			for( i = 0 ; i < 6 ; i++ ){
				S_Serihu[i].opacity = 0;
				switch (arr[i]){
					case 0:
						S_Serihu[i].text = "キャン";					//テキストに文字表示 Pointは変数なので、ここの数字が増える
						//alert(i);
						break;
					case 1:
						S_Serihu[i].text = "ニャン";					//テキストに文字表示 Pointは変数なので、ここの数字が増える
						break;
					case 2:
						S_Serihu[i].text = "キュン";					//テキストに文字表示 Pointは変数なので、ここの数字が増える
						break;
					case 3:
						S_Serihu[i].text = "シャン";					//テキストに文字表示 Pointは変数なので、ここの数字が増える
						  break;
					case 4:
						S_Serihu[i].text = "ジョン";					//テキストに文字表示 Pointは変数なので、ここの数字が増える 
						break;
					case 5:
						S_Serihu[i].text = "ギョーザ";					//テキストに文字表示 Pointは変数なので、ここの数字が増える
						break;
					}			
			}		
		}

		//var S_Koya = new Sprite(96, 75);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Koya[0].moveTo(30, 200);						//リトライボタンの位置
		S_Koya[1].moveTo(150, 200);
		S_Koya[2].moveTo(280, 200);						//リトライボタンの位置
		S_Koya[3].moveTo(30, 400);
		S_Koya[4].moveTo(150, 400);						//リトライボタンの位置
		S_Koya[5].moveTo(280, 400);

		S_Serihu[0].moveTo(10, 170);						//移動位置指定
		S_Serihu[1].moveTo(130, 170);						//移動位置指定
		S_Serihu[2].moveTo(260, 170);						//移動位置指定
		S_Serihu[3].moveTo(10, 370);						//移動位置指定
		S_Serihu[4].moveTo(130, 370);						//移動位置指定
		S_Serihu[5].moveTo(260, 370);						//移動位置指定

		//ポイント表示テキスト
		var S_Text = new Label(); 					//テキストはLabelクラス
		S_Text.font = "40px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_Text.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_Text.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_Text.moveTo(100, 50);						//移動位置指定
		//S_MAIN.addChild(S_Text);					//S_MAINシーンにこの画像を埋め込む

		S_Text.text = "LEVEL " + Level;					//テキストに文字表示 Pointは変数なので、ここの数字が増える

			
		//ぞう山ボタン
		var Animal = new Sprite(400, 400);	//Sprite(166, 168)	//画像サイズをここに書く。
											//使う予定の画像サイズはプロパティで見ておくこと
		//Animal.scale(0.25, 0.25);
		Animal.moveTo(85, 130);						//ぞう山ボタンの位置
		Animal.opacity = 0;

		//S_MAIN.addChild(Animal);					//S_MAINにこのぞう山画像を貼り付ける  
		
		var setAnimalImage = function(agI){
			Animal.opacity =1
			cnt=0
			switch (arr[agI]){
				case 0:
					Animal.image = game.assets[AnimalImg0];
					State=1;
					break;
				case 1:
					Animal.image = game.assets[AnimalImg1]; 
					State=9;
					break;
				case 2:
					Animal.image = game.assets[AnimalImg2];
					State=9;
					break;
				case 3:
					Animal.image = game.assets[AnimalImg3];
					State=9;
					break;
				case 4:
					Animal.image = game.assets[AnimalImg4];  
					State=9;
					break;
				case 4:
					Animal.image = game.assets[AnimalImg5];
					State=9;
					break;
				}
			S_MAIN.addChild(Animal);			
		}
		
		//-------------------------------------------
		//ポイント表示テキスト

		var main1 = function( scene , gazou) {

			for( i = 0 ; i < 6 ; i++ ){
				S_MAIN.addChild(S_Serihu[i]);
			}
		
			S_MAIN.addChild(S_Text);					//S_MAINシーンにこの画像を埋め込む

			S_MAIN.addChild(Animal);					//S_MAINにこのぞう山画像を貼り付ける  
			for( i = 0 ; i < 6 ; i++ ){
				S_MAIN.addChild(S_Koya[i]);	
			}
			S_MAIN.addChild(S_Koya[0]);					//S_ENDにこのリトライボタン画像を貼り付ける  
			
		
		}		
		S_Koya[0].ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			setAnimalImage(0)
		};
		S_Koya[1].ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			setAnimalImage(1)
		};
		S_Koya[2].ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			setAnimalImage(2)
		};
		S_Koya[3].ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			setAnimalImage(3)
		};
		S_Koya[4].ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			setAnimalImage(4)
		};
		S_Koya[5].ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			setAnimalImage(5)
		};						
		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe = function () {
			cnt += 1
			if (State==-1){
				if (cnt >= 80){
					game.popScene();					//S_MAINシーンを外す
					game.pushScene(S_MAIN);				//S_ENDシーンを読み込ませる
					bg(S_MAIN,B_Field);
					randAray();
					SetSerihu();					
					main1();
					cnt =0
					State=0
				}
			}

			if (State == 0){
				if ((cnt ) >= 60){
					for( i = 0 ; i < 6 ; i++ ){	
						S_Serihu[i].opacity = 0;
					}
					
				}
				//セリフ表示
				if(cnt >= 70){
					for( i = 0 ; i < 6 ; i++ ){	
						S_Serihu[i].opacity = 1;
					}
					cnt =0
				} 
			}

			if (State==1){
				if (cnt >= 50){
					game.popScene();					//S_MAINシーンを外す
					game.pushScene(S_END);				//S_ENDシーンを読み込ませる
					
					Animal.opacity =0
					//ゲームオーバー後のテキスト表示
					S_GameOverText.text = "　クリア！！　";				//テキストに文字表示 
				}
			}
			if (State==9){
				if (cnt >= 50){
					game.popScene();					//S_MAINシーンを外す
					game.pushScene(S_END);				//S_ENDシーンを読み込ませる
					
					Animal.opacity =0
					//ゲームオーバー後のテキスト表示
					S_GameOverText.text = "GAME OVER！！";				//テキストに文字表示 
				}
			}
		};



		////////////////////////////////////////////////////////////////
		//結果画面
		S_END = new Scene();
		bg(S_END,B_Field);
		//S_END.backgroundColor = "blue";

		//GAMEOVER
		var S_GameOverText = new Label(); 					//テキストはLabelクラス
		S_GameOverText.font = "40px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_GameOverText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameOverText.moveTo(60, 100);						//移動位置指定
		S_END.addChild(S_GameOverText);						//S_ENDシーンにこの画像を埋め込む

		//リトライボタン
		var S_Retry = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Retry.moveTo(140, 300);						//リトライボタンの位置
		S_Retry.image = game.assets[B_Retry];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Retry);					//S_ENDにこのリトライボタン画像を貼り付ける  

		S_Retry.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する

			State = -1;
			cnt=0
			game.popScene();						//S_ENDシーンを外す
			game.pushScene(S_TITLE);					//S_MAINシーンを入れる
		};

	};
	game.start();
};