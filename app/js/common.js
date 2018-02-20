window.onload = function() {

	var allInput = document.getElementsByTagName('input'),
		wrapInputs = document.getElementById('wrapInputs'),		
		choiceX = document.getElementById('choiceX'),
		choiceO = document.getElementById('choiceO'),
		btnPlay = document.getElementById('btnPlay'),
		btnAnew = document.getElementById('btnAnew'),
		text = document.getElementById('text'),
		customWrap = document.querySelector('.customWrap'),
		jsWrap = document.querySelector('.jsWrap'),
		messageWrap = document.querySelector('.messageWrap'),
		gameBlock = document.getElementById('game'),		
		allBlock = document.querySelectorAll('#game > div'),
		arrBlock,
		randomNum,
		customVar = 'x',
		compVar,
		timerCheck,
		timerCompAct,
		numberOfTimes = 0,
		arrTextValue = ['left','center','right'];

/* Клик по кнопке "Начать игру" */
	btnPlay.onclick = function(e) {
		/* узнаю чем будет играть пользователь и записываю значение value в переменную customVar*/
		for(var i = 0;i<allInput.length;i++) {
			if(allInput[i].checked) {
				customVar = allInput[i].value;
			}
		};
		actions(e.target,'yes',btnAnew);
		wrapInputs.className = 'hideBlock';
		if(messageWrap.classList.contains('messageBlock')) {
			messageWrap.classList.add('messageBlockBack');
			var timerRemoveClasses = setTimeout(function() {
				messageWrap.classList.remove('messageBlock');
				messageWrap.classList.remove('messageBlockBack');
			}, 1500);
		}

		if(customVar == 'x') {
			customWrap.innerHTML = '<img src="img/x_large.png" class="scaleShowImg">';
			compVar = 'o';
			jsWrap.innerHTML = '<img src="img/zero_large.png" class="scaleShowImg">';
			customTurn(true);

		} 
		else {
			customWrap.innerHTML = '<img src="img/zero_large.png" class="scaleShowImg">';
			compVar = 'x';
			jsWrap.innerHTML = '<img src="img/x_large.png" class="scaleShowImg">';
			customTurn(false);

			timerCompAct = setTimeout(jsAct, 1500);
		}

		

	};
/* Клик по кнопке "Играть заново" */
	btnAnew.onclick = function(e) {
		actions(e.target,'no',btnPlay);
		wrapInputs.classList.remove('hideBlock');
		text.innerHTML = '';
		text.classList.remove('textWinner');
		numberOfTimes = 0;
		choiceX.checked = true;
		choiceO.checked = false;
		customWrap.innerHTML = '';
		jsWrap.innerHTML = '';

		if(customWrap.classList.contains('winShadowJump') || jsWrap.classList.contains('winShadowJump')) {
			customWrap.classList.remove('winShadowJump');
			jsWrap.classList.remove('winShadowJump');
		}

		for(var i = 0; i < allBlock.length;i++){
			allBlock[i].removeAttribute('data-check');
			allBlock[i].innerHTML = '';
		}
		timerCheck = setInterval(checkAttr,1000);
	};
/* Функция повторяющихся действий */
	function actions(target,yOrN,btn) {
		gameBlock.dataset.start = yOrN;
		target.style.display = 'none';
		btn.style.display = 'block';
	};

/* Функция прописывающая соответственный текст в span */
	function customTurn(ans) {
		if(ans == true) {
			text.innerHTML = 'Ваш ход';
			text.style.textAlign = arrTextValue[0];
			gameBlock.dataset.turn = 'custom';
		}
		else if(ans == false) {
			text.innerHTML = 'Javascript ход';
			text.style.textAlign = arrTextValue[2];			
			gameBlock.dataset.turn = 'javascript';
		}
		else {
			text.innerHTML = 'Победили - ' + ans;
			text.style.textAlign = arrTextValue[1];
			text.classList.add('textWinner');
			gameBlock.dataset.turn = '';
		}
	};

/* Запрещаю клик, пока пользователь не нажал на кнопку "Play"  */
	function checkAttr() {
		if(gameBlock.dataset.start == 'no') {
			gameBlock.onclick = function(e) {
				messageWrap.classList.add('messageBlock');
				return false; // запрещаю клик по блокам
			}
		} else {
			clearInterval(timerCheck);
			gameBlock.onclick = function(e) {
				if(numberOfTimes <= 9) {
					customAct(e.target);
				}
			}
		}
	};

/* Таймер, который проверяет каждую секунду значение атрибута data-start у блока #game */
	timerCheck = setInterval(checkAttr,1000);

/* Дествия пользователя*/
	function customAct(elem) {
		if(elem.classList.contains('block') && elem.dataset.check !== 'check' && gameBlock.dataset.start !== 'no') {
			elem.innerHTML = customVar;
			elem.setAttribute('data-check','check');
			// Проверяю есть ли победитель
			checkWinner();

			if(numberOfTimes < 9){
				numberOfTimes++;
				//функция, которая будет делать ход javascript после клика пользователя.
				timerCompAct = setTimeout(jsAct, 1500);
			}
			// Выбираю пустые блоки в массив arrBlock
			findEmptyBlocks();
			
			if(gameBlock.dataset.start !== 'no') {
				repeatActions(false);

				if(arrBlock.length >= 1) {
					customTurn(false);
				}
			}
		}
	};

/* Функция, которая делает ход js */
	function jsAct(){
		if(gameBlock.dataset.start !== 'no') {
			var num;
			function choiceBlock(){
				num = 9 - numberOfTimes;
				// Выбираю случайное число
				randomNum = getRandomNumber(0,num);
				function getRandomNumber(min, max) {
					return Math.floor(Math.random() * (max - min) + min);
				}
				// Выбираю пустые блоки в массив arrBlock
				findEmptyBlocks();

				if(arrBlock.length>0){
					arrBlock[randomNum].innerHTML = compVar;
					arrBlock[randomNum].setAttribute('data-check','check');
					// Проверяю есть ли победитель
					checkWinner();
				}
				if(gameBlock.dataset.start !== 'no') {
					if(arrBlock.length > 1) {
						customTurn(true);
					}
					if(numberOfTimes < 9){
						numberOfTimes++;
					}
					repeatActions();
				};
			};
			choiceBlock();
		}
	};

/* Функция повторяющихся действий */

	function repeatActions() {
		if(numberOfTimes == 9){
			text.innerHTML = 'Ничья!';
			text.style.textAlign = arrTextValue[1];
			gameBlock.dataset.start = 'no';
			gameBlock.dataset.turn = '';
		}
	};

/* Функция, которая находит и записывает в массив пустые блоки */
	function findEmptyBlocks() {
		arrBlock = [];
		for(var i = 0;i<allBlock.length;i++) {
			if(!allBlock[i].hasAttribute('data-check')) {
				arrBlock.push(allBlock[i]);
			}
		}
	};

/* Функция, отслеживающая победителя */
	function checkWinner() {
		var arrAll = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
		for(var i = 0; i < arrAll.length; i++) {
			var s = arrAll[i];
			if(allBlock[s[0]].innerHTML=='x' && allBlock[s[1]].innerHTML=='x' && allBlock[s[2]].innerHTML=='x') {
				winActions('крестики!','x');
			} 
			if(allBlock[s[0]].innerHTML=='o' && allBlock[s[1]].innerHTML=='o' && allBlock[s[2]].innerHTML=='o') {
				winActions('нолики!','o');
			}
		}
	};

/* Функция повторяющихся действий */

	function winActions(winner,winSymbol) {
		gameBlock.dataset.start = 'no';
		customTurn(winner);
		if(customVar == winSymbol) {
			document.querySelector('.customWrap img').className = 'jump';
			document.querySelector('.customWrap').classList.add('winShadowJump');
		} else {
			document.querySelector('.jsWrap img').className = 'jump';
			document.querySelector('.jsWrap').classList.add('winShadowJump');

		}
	}


} // скобка window.onload

