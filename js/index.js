class WhackAMole {
	
	// Properties used to initialize the Whack-a-Mole Game
	constructor(startButton, moles, scoreOut, moleCount,countDown, gameTimeLength, peepTimeMin, peepTimeMax){		
		// Game HTML Elements
		this.btnStart = startButton;
		this.moles = moles;
		this.scoreOut = scoreOut;
		this.moleCount = moleCount;
		this.countDown = countDown;
		
		// Game Images
		this.moleImgSrc = './img/mole3.png';
		this.moleBonkedImg = new Image();
		this.moleBonkedImg.src = './img/mole2.png';
		
		// Game Parameters
		this.gameTime = gameTimeLength;
		this.minPeepTime = peepTimeMin;
		this.maxPeepTime = peepTimeMax;
		this.numOfMoles = this.moles.length;
		
		// Game State Variables
		this.prevMoleNumber = null;
		this.timeUp = false;
		this.score = 0;
		this.count = 0;
		this.time = 15;
		this.gameTimer = null;
		this.peepTimer = null;		
	}
	
	init(){
		this.score = 0;
		this.count = 0;
		this.time = 15;
		this.scoreOut.text(this.score);
		this.moleCount.text(this.count);
		this.countDown.text(this.time);
		this.timeUp = false;
		this.prevMoleNumber = null;
		this.btnStart.text('Stop Game');
		this.peep();
		this.gameTimer = setTimeout(() => {
			console.log('Game Over');
			this.btnStart.text('Start Game');
			this.timeUp = true;
		}, 15000);	
		this.countdownTimer();	
	}
	
	stop(){
		console.log('Game Stopped');
		this.btnStart.text('Start Game');
		this.timeUp = true;
		this.moles.removeClass('up');
		clearInterval(this.peepTimer);
		clearInterval(this.gameTimer);
	}
	
	peep(){
		const time = this._randomTime(this.minPeepTime, this.maxPeepTime);
    	const mole = this._randomMole(this.moles);
    	mole.addClass('up');
    	this.peepTimer = setTimeout(() => {
      		mole.removeClass('up');
      		if(this.timeUp === false){
				this.peep();
			} 
    	}, time);
	}

countdownTimer() {
    this.timer = setInterval(() => {
        this.time--;
        this.countDown.text(this.time);
        if (this.time <= 0)
            clearInterval(this.timer);
    }, 1000);
}
	
	bonk(mole) {
		mole.attr('src', this.moleBonkedImg.src)
    		.removeClass('up')
			.addClass('bonked')
		    .one('transitionend', () => {
				  mole.attr('src', this.moleImgSrc);
				  mole.removeClass('bonked');
			  });
		this.score +=5;
		this.count++;
    this.scoreOut.text(this.score);
    this.moleCount.text(this.count);
	}
	
	// Utility functions: Generate a random time to determine how long the moles stay up
	_randomTime(min, max){
		return Math.round(Math.random() * (max - min) + min);
	}
	
	// randomly selects one of the moles to display
	_randomMole(moles) {
    	const idx = Math.floor(Math.random() * this.numOfMoles);
    	const mole = moles.eq(idx);
    	if (idx === this.prevMoleNumber ) {
      		console.log('...same mole...try again...');
      		return this._randomMole(moles);
    	}
		  this.prevMoleNumber = idx;
    	return mole;
	}
	
}

// Get a new instance of the Whack A Mole Class Parameters:
// 1. Start Button
// 2. Mole Image
// 3. Score out
// 3. Mole count
// 3. Timer
// 4. Game Time Length (ms)
// 5. Peep Time Min (ms)
// 6. Peep Time Max (ms)
const wam = new WhackAMole($('#btn-start'), $('.mole-pic'), $('#score-out'), $('#mole_count'), $('#countdown'), 15000, 400, 1500);

// Game Event Handlers
wam.btnStart.click(function(){
	
	if(wam.btnStart.text() === 'Start Game'){
		wam.init();
	}else{
		wam.stop();
	}
	
});

wam.moles.click(function(){
	
	if($(this).hasClass('bonked')){
		return;
	}
	
	wam.bonk( $(this) );
	
});