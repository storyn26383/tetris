function tetris(id){
	var _tetris = this;
	_tetris.gameInformation = '俄羅斯方塊 (Ver 2.02) - 程式撰寫 by Sasaya (2009/06/11 17:45)';//版本資訊
	_tetris.playboxWidth = 10;//遊戲表格的寬
	_tetris.playboxHeight = 20;//遊戲表格的高
	_tetris.blockQuantity = 5;//方塊種數
	_tetris.downSpeed = 500;//方塊落下的速度
	_tetris.downAcceleration = 10;//清除連線時方塊掉落的加速度
	_tetris.okmoveBlock = 1;//方塊碰地之後還有一次的移動機會
	_tetris.blockDirection = 0;//落下中的方塊方向
	_tetris.playblockType = 0;//落下中的方塊種類
	_tetris.previewblockType = 0;//下一個要落下的方塊種類
	_tetris.pauseGame = 0;//是否暫停遊戲
	_tetris.downInterval = 0;//自動落下之計時器資訊
	_tetris.score = 0;//遊戲分數
	_tetris.deleteLine = 0;//已清除連線數量
	_tetris.gameOver = 0;//是否遊戲結束
	_tetris.gameStart = 0;//遊戲是否開始
	_tetris.blocks = new Array(//宣告各種方塊
		new Array(new Array(0,0,0),new Array(1,0,0),new Array(1,1,1)),
		new Array(new Array(0,0,0),new Array(0,0,1),new Array(1,1,1)),
		new Array(new Array(0,0,0),new Array(0,1,1),new Array(1,1,0)),
		new Array(new Array(0,0,0),new Array(0,1,0),new Array(1,1,1)),
		new Array(new Array(0,0,0),new Array(1,1,0),new Array(0,1,1))
	);
	_tetris.playBlock = new Array(//紀錄方塊的四個方向
		new Array(new Array(0,0,0),new Array(0,0,0),new Array(0,0,0)),
		new Array(new Array(0,0,0),new Array(0,0,0),new Array(0,0,0)),
		new Array(new Array(0,0,0),new Array(0,0,0),new Array(0,0,0)),
		new Array(new Array(0,0,0),new Array(0,0,0),new Array(0,0,0))
	);
	_tetris.moveBlock = new Array(//紀錄移動中的方塊座標
		new Array(new Array(0,0),new Array(0,0),new Array(0,0)),
		new Array(new Array(0,0),new Array(0,0),new Array(0,0)),
		new Array(new Array(0,0),new Array(0,0),new Array(0,0))
	);

	_tetris.loading = function(){//載入遊戲
		var preview = '<table cellpadding=0 cellspacing=0 border=0>';
		for(var i = 0 ; i < 3 ; i++){
			preview += '<tr>';
			for(var j = 0 ; j < 3 ; j++){
				preview += '<td id=previewBox_'+id+'_'+i+'_'+j+'>○</td>';
			}
			preview += '</tr>';
		}
		preview += '</table>';

		var play = '<table cellpadding=0 cellspacing=0 border=0>';
		for(var i = -2 ; i < _tetris.playboxHeight + 2 ; i++){
			play += '<tr>';
			for(var j = -2 ; j < _tetris.playboxWidth + 2 ; j++){
				if(i < 0 || j < 0 || i >= _tetris.playboxHeight || j >= _tetris.playboxWidth){
					play += '<td id=playBox_'+id+'_'+i+'_'+j+'></td>';
				}else{
					play += '<td id=playBox_'+id+'_'+i+'_'+j+'>○</td>';
				}
			}
			play += '</tr>';
		}
		play += '</table>';
		document.all[id].innerHTML = '<div id=gameBox_'+id+' align=center></div>';
		document.all['gameBox_'+id].innerHTML = '<div id=scoreBox_'+id+' align=center>Score: 0</div><div id=deletelineBox_'+id+' align=center>Lines: 0</div><div id=previewBox_'+id+' align=center></div><div id=playBox_'+id+' align=center></div>';
		document.all['previewBox_'+id].innerHTML = preview;
		document.all['playBox_'+id].innerHTML = play;
		document.title = _tetris.gameInformation;//將版本資訊輸出到標題列
		_tetris.gameStart = 1;//準備開始遊戲
		_tetris.previewblockType = Math.floor(Math.random() * _tetris.blockQuantity);//預先載入方塊
		_tetris.block();//開始製造方塊
		_tetris.downInterval = setInterval(function(){_tetris.move('Down');},_tetris.downSpeed);//開始遊戲
	};

	_tetris.block = function(){//製作方塊
		_tetris.blockDirection = 0;
		_tetris.playblockType = _tetris.previewblockType;
		_tetris.previewblockType = Math.floor(Math.random() * _tetris.blockQuantity);
		for(var i = 0 ; i < 3 ; i++){//初始落下方塊
			for(var j = 0 ; j < 3 ; j++){
				_tetris.moveBlock[i][j][0] = i;
				_tetris.moveBlock[i][j][1] = Math.round((_tetris.playboxWidth / 2) - 2 + j);
				document.all['previewBox_'+id+'_'+i+'_'+j].innerHTML = '○';//清空預覽方塊
			}
		}
		for(var i = 0 ; i < 3 ; i++){//顯示預覽方塊
			for(var j = 0 ; j < 3 ; j++){
				if(_tetris.blocks[_tetris.previewblockType][i][j]){s = '●';}else{s = '○';}
				document.all['previewBox_'+id+'_'+i+'_'+j].innerHTML = s;
			}
		}
		for(var i = 0 ; i < 4 ; i++){//方塊的四個方向
			for(var j = 0 ; j < 3 ; j++){
				for(var k = 0 ; k < 3 ; k++){
					switch(i){
						case 0:
							if(_tetris.blocks[_tetris.playblockType][j][k]){_tetris.playBlock[i][j][k] = 1;}else{_tetris.playBlock[i][j][k] = 0;}
							break;
						case 1:
							if(_tetris.blocks[_tetris.playblockType][2-k][j]){_tetris.playBlock[i][j][k] = 1;}else{_tetris.playBlock[i][j][k] = 0;}
							break;
						case 2:
							if(_tetris.blocks[_tetris.playblockType][2-j][2-k]){_tetris.playBlock[i][j][k] = 1;}else{_tetris.playBlock[i][j][k] = 0;}
							break;
						case 3:
							if(_tetris.blocks[_tetris.playblockType][k][2-j]){_tetris.playBlock[i][j][k] = 1;}else{_tetris.playBlock[i][j][k] = 0;}
							break;
					}
				}
			}
		}
		for(var i = 0 ; i < 3 ; i++){
			for(var j = 0 ; j < 3 ; j++){
				if(document.all['playBox_'+id+'_'+_tetris.moveBlock[i][j][0]+'_'+_tetris.moveBlock[i][j][1]].innerHTML == '●'){_tetris.gameOver = 1;}
			}
		}
		_tetris.show();//顯示落下方塊
		if(_tetris.gameOver){//判斷遊戲是否結束
			alert('Game Over!!!');
			clearInterval(_tetris.downInterval);
		}
	};

	_tetris.pause = function(){//暫停遊戲
		_tetris.pauseGame = (_tetris.pauseGame + 1) % 2;
		if(!_tetris.pauseGame && !_tetris.gameOver){_tetris.downInterval = setInterval(function(){_tetris.move('Down');},_tetris.downSpeed);}
		else{clearInterval(_tetris.downInterval);}
	}

	_tetris.move = function(m){
		if(!_tetris.pauseGame && !_tetris.gameOver){
			if(tetris.check('move'+m)){
				_tetris.clean();
				switch(m){
					case 'Down':
						for(var i = 0 ; i < 3 ; i++){
							for(var j = 0 ; j < 3 ; j++){
								_tetris.moveBlock[i][j][0]++;
							}
						}
						break;
					case 'Right':
						for(var i = 0 ; i < 3 ; i++){
							for(var j = 0 ; j < 3 ; j++){
								_tetris.moveBlock[i][j][1]++;
							}
						}
						break;
					case 'Left':
						for(var i = 0 ; i < 3 ; i++){
							for(var j = 0 ; j < 3 ; j++){
								_tetris.moveBlock[i][j][1]--;
							}
						}
						break;
				}
				_tetris.show();
			}
		}
	};

	_tetris.turn = function(m){
		if(!_tetris.pauseGame && !_tetris.gameOver){
			if(tetris.check('turn'+m)){
				_tetris.clean();
				switch(m){
					case 'Right':
						_tetris.blockDirection = (_tetris.blockDirection + 1) % 4;
						break;
					case 'Left':
						_tetris.blockDirection = (_tetris.blockDirection + 3) % 4;
						break;
				}
				_tetris.show();
			}
		}
	};

	_tetris.check = function(m){
		_tetris.clean();
		var checkMove = 1;
		var checkDirection = _tetris.blockDirection;
		var checkArray = new Array(
			new Array(new Array(0,0),new Array(0,0),new Array(0,0)),
			new Array(new Array(0,0),new Array(0,0),new Array(0,0)),
			new Array(new Array(0,0),new Array(0,0),new Array(0,0))
		);
		for(var i = 0 ; i < 3 ; i++){
			for(var j = 0 ; j < 3 ; j++){
				checkArray[i][j][0] = _tetris.moveBlock[i][j][0];
				checkArray[i][j][1] = _tetris.moveBlock[i][j][1];
			}
		}
		switch(m){
			case 'moveDown':
				for(var i = 0 ; i < 3 ; i++){
					for(var j = 0 ; j < 3 ; j++){
						checkArray[i][j][0]++;
					}
				}
				break;
			case 'moveRight':
				for(var i = 0 ; i < 3 ; i++){
					for(var j = 0 ; j < 3 ; j++){
						checkArray[i][j][1]++;
					}
				}
				break;
			case 'moveLeft':
				for(var i = 0 ; i < 3 ; i++){
					for(var j = 0 ; j < 3 ; j++){
						checkArray[i][j][1]--;
					}
				}
				break;
			case 'turnRight':
				checkDirection = (checkDirection + 1) % 4;
				break;
			case 'turnLeft':
				checkDirection = (checkDirection + 3) % 4;
				break;
		}
		for(var i = 0 ; i < 3 ; i++){
			for(var j = 0 ; j < 3 ; j++){
				if(_tetris.playBlock[checkDirection][i][j]){
					if(document.all['playBox_'+id+'_'+checkArray[i][j][0]+'_'+checkArray[i][j][1]].innerHTML != '○'){checkMove = 0;}
				}
			}
		}
		_tetris.show();
		if(!checkMove && _tetris.okmoveBlock && m == 'moveDown'){_tetris.okmoveBlock--;}//讓方塊碰到底還有一次的移動機會
		else if(!checkMove && !_tetris.okmoveBlock && m == 'moveDown'){_tetris.lockBlock();}//如果方塊無法在移動則建立新方塊
		else{_tetris.okmoveBlock = 1;}
		return checkMove;
	};

	_tetris.lockBlock = function(){//固定方塊
		for(var i = 0 ; i < 3 ; i++){
			for(var j = 0 ; j < 3 ; j++){
				if(_tetris.playBlock[_tetris.blockDirection][i][j]){
					document.all['playBox_'+id+'_'+_tetris.moveBlock[i][j][0]+'_'+_tetris.moveBlock[i][j][1]].flag = '●';
				}
			}
		}
		for(var i = 0 ; i < 3 ; i++){
			_tetris.cleanLine(_tetris.moveBlock[i][0][0],0,true);//檢查是否連線
		}
		_tetris.block();//建立新方塊
	};

	_tetris.cleanLine = function(x,y,check){
		if(document.all['playBox_'+id+'_'+x+'_'+y].flag == '●'){
			if(y < _tetris.playboxWidth-1){_tetris.cleanLine(x,y+1,check);}//如果有方塊則進入遞迴
			else{//清除連線
				for(var i = 0 ; i < _tetris.playboxWidth ; i++){
					for(var j = x ; j > 0 ; j--){
						document.all['playBox_'+id+'_'+j+'_'+i].flag = document.all['playBox_'+id+'_'+(j-1)+'_'+i].flag;
						document.all['playBox_'+id+'_'+j+'_'+i].innerHTML = document.all['playBox_'+id+'_'+(j-1)+'_'+i].innerHTML;
					}
				}
				for(var i = 0 ; i < _tetris.playboxWidth ; i++){
					document.all['playBox_'+id+'_0_'+i].flag = '';
					document.all['playBox_'+id+'_0_'+i].innerHTML = '○';
				}
				if(_tetris.downSpeed - _tetris.downAcceleration > 0){//加速方塊掉落
					_tetris.downSpeed -= _tetris.downAcceleration;
					clearInterval(_tetris.downInterval);
					_tetris.downInterval = setInterval(function(){_tetris.move('Down');},_tetris.downSpeed);
				}else if(_tetris.downSpeed != 1){//遊戲最高速度為1
					_tetris.downSpeed = 1;
					clearInterval(_tetris.downInterval);
					_tetris.downInterval = setInterval(function(){_tetris.move('Down');},_tetris.downSpeed);
				}
				_tetris.deleteLine++;//增加已清除連線之數量
				_tetris.score += (500 - _tetris.downSpeed) * _tetris.deleteLine;//增加分數

				document.all['scoreBox_'+id].innerHTML = 'Score: ' + _tetris.score;//顯示分數
				document.all['deletelineBox_'+id].innerHTML = 'Lines: ' + _tetris.deleteLine;//顯示已清除連線之數量
			}
		}
	}

	_tetris.show = function(){
		for(var i = 0 ; i < 3 ; i++){
			for(var j = 0 ; j < 3 ; j++){
				var s = '';
				if(_tetris.playBlock[_tetris.blockDirection][i][j]){s = '●';}else{s = '○';}
				if(_tetris.moveBlock[i][j][0] < 0 || _tetris.moveBlock[i][j][1] < 0 || _tetris.moveBlock[i][j][0] >= _tetris.playboxHeight || _tetris.moveBlock[i][j][1] >= _tetris.playboxWidth){s = '';}
				if(!(document.all['playBox_'+id+'_'+_tetris.moveBlock[i][j][0]+'_'+_tetris.moveBlock[i][j][1]].flag == '●' && s == '○')){
					document.all['playBox_'+id+'_'+_tetris.moveBlock[i][j][0]+'_'+_tetris.moveBlock[i][j][1]].innerHTML = s;
				}
			}
		}
	};

	_tetris.clean = function(){
		for(var i = 0 ; i < 3 ; i++){
			for(var j = 0 ; j < 3 ; j++){
				if(!(_tetris.moveBlock[i][j][0] < 0 || _tetris.moveBlock[i][j][1] < 0 || _tetris.moveBlock[i][j][0] >= _tetris.playboxHeight || _tetris.moveBlock[i][j][1] >= _tetris.playboxWidth)){
					if(document.all['playBox_'+id+'_'+_tetris.moveBlock[i][j][0]+'_'+_tetris.moveBlock[i][j][1]].flag != '●'){
						document.all['playBox_'+id+'_'+_tetris.moveBlock[i][j][0]+'_'+_tetris.moveBlock[i][j][1]].innerHTML = '○';
					}
				}
			}
		}
	};
}