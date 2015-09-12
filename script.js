$(function() {
	//===============
	// jQuery objects
	//===============
	var $display = $('.display');
	var $settings = $('.settings');
	var $pause = $('.pause');
	var $play = $('.play');
	var $sound = $('.sound');
	var $mute = $('.mute');
	var $audio = $('audio')[0];
	var $minutes = $('.minutes');
	var $seconds = $('.seconds');
	var $pomoNum = $('.pomo-num');
	var $break = $('.break');
	var $work = $('.work');
	var $body = $('body');

	//==========================
	// initial variable settings
	//==========================
	var work = true; // indicates whether or not it is time to work or not
	var pomodoros = 0; // number of pomodoros finished
	var started = false; // option to indicate whether or not settings have been chosen
	var sound = true; // option to enable sound
	
	//============================
	// blank variable declarations
	//============================
	var endTime; // date number indicated end time
	var timeRemaining; // will hold object about time reamiaing
	var timeInterval; // variable to hold interval timer
	var maxTime; // max amount of time for timer
	var pomoNum; // indicates which pomodoro out of 4 is currently 

	//============================
	// settings options
	//============================ 
	var pomoLength = {},
			shortBreak = {},
			longBreak = {};

	var setTime = function(html, variable) {
		$(html).on('click', 'button', function() {
			var $this = $(this);
			if ($this.hasClass('chosen')) {
				return;
			} else {
				$this.parent().find('button').removeClass('chosen');
				$this.addClass('chosen');
			}
			var number = $(this).text();
			variable.num = +number;
		});
	};

	setTime('.pomodoro-length', pomoLength);
	setTime('.short-break', shortBreak);
	setTime('.long-break', longBreak);

	//============================
	// functions
	//============================
	var getTimeRemaining = function(endTime) {
		var time = endTime - Date.now();
		var seconds = Math.floor( (time/1000) % 60 );
		var minutes = Math.floor( (time/(1000 * 60)) % 60 );
		return {
			time: time,
			seconds: ('0' + seconds).slice(-2),
			minutes: ('0' + minutes).slice(-2)
		};
	};

	var nextVariables = function() {
		clearInterval(timeInterval);
		if (pomodoros === 4) {
			pomoNum = 1;
		} else {
			pomoNum = pomodoros + 1;
		}
		$pomoNum.text(pomoNum);
		if (work) {
			pomodoros++;
		} else {
			if (pomodoros === 4) {
				pomodoros = 0;
			}
		}
		work = !work;
	};

	var prevVariables = function() {
		clearInterval(timeInterval);
		if (work) {
			if (pomodoros > 0) {
				pomoNum = pomodoros;
			} else {
				pomoNum = 4;
			}
		} else {
			if (pomodoros === 4) {
				pomoNum = 4;
			}
		}
		$pomoNum.text(pomoNum);
		if (!work) {
			pomodoros--;
		} else {
			if (pomodoros === 0) {
				pomodoros = 4;
			}
		}
		work = !work;
	};

	// function to display time or start next timer
	var display = function() {
		timeRemaining = getTimeRemaining(endTime);
		if (timeRemaining.time <= 1000) {
			nextVariables();
			nextTimer();
		} else {
			$minutes.text(timeRemaining.minutes);
			$seconds.text(timeRemaining.seconds);
		}
	};

	var countDown = function() {
		timeInterval = setInterval(display, 1000);
	};

	// sets end time
	var setEndTime = function() {
		if (work) {
			maxTime = (pomoLength.num * 60 * 1000) + 5;			
		} else {
			if (pomodoros < 4) {
				maxTime = (shortBreak.num * 60 * 1000) + 5;
			} else {
				maxTime = (longBreak.num * 60 * 1000) + 5;
			}
		}
		endTime = maxTime + Date.now();
	};	

	// starts next timer
	var nextTimer = function() {
		setEndTime();
		if (sound && started) {
			$audio.play();
		}
		display();
		countDown();
		if (work) {
			$break.hide();
			$work.show();
			$body.removeClass('relax');
		} else {
			$break.show();
			$work.hide();
			$body.addClass('relax');
		}
	}

	// function to show pause button
	var showPause = function() {
		if ( $pause.css('display') == 'none' ){
    	$play.hide();
			$pause.show();
		}
	};


	//============================
	// event handlers for buttons
	//============================
	$('.start').on('click', function() {
		var $error = $('.error');
		if (pomoLength.num && shortBreak.num && longBreak.num) {
			nextTimer();
			$error.hide();
			$display.show();
			$settings.hide();
			started = true;
		} else {
			$error.show();
		}
	});

	$('.reset').on('click', function() {
		clearInterval(timeInterval);
		nextTimer();
		showPause();
	});

	$('.prev').on('click', function() {
		prevVariables();
		nextTimer();
		showPause();
	});

	$('.next').on('click', function() {
		nextVariables();
		nextTimer();
		showPause();
	});

	$('.change-settings').on('click', function() {
		clearInterval(timeInterval);
		work = true;
		pomodoros = 0;
		$pomoNum.text(1);
		$display.hide();
		$settings.show();
		showPause();
		$body.removeClass('relax');
		started = false;
	});

	$('.more').on('click', function() {
		if (timeRemaining.time >= (maxTime - 60005)) {
			endTime+= (maxTime - timeRemaining.time);
		} else {
			endTime+= 60000;
		}
		clearInterval(timeInterval);
		display();
		countDown();
		showPause();
	});

	$('.less').on('click', function() {
		if (timeRemaining.time <= 60000) {
			endTime = Date.now() + 1005;
		} else {
			endTime-= 60000;
		}
		clearInterval(timeInterval);
		display();
		countDown();
		showPause();
	});

	$pause.on('click', function() {
		timeRemaining = getTimeRemaining(endTime);
		clearInterval(timeInterval);
		$pause.hide();
		$play.show();
	});

	$play.on('click', function() {
		endTime = Date.now() + timeRemaining.time;
		display();
		countDown();
		showPause();
	});

	$sound.on('click', function() {
		sound = false;
		$sound.hide();
		$mute.show();
	});

	$mute.on('click', function() {
		sound = true;
		$mute.hide();
		$sound.show();
	});

});