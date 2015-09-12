$(function() {
	var $display = $('.display');
	$display.hide();
	var $settings = $('.settings');
	
	var pomoLength = {},
			shortBreak = {},
			longBreak = {};

	var work = true;
	var pomodoros = 0;
	var started = false;
	var sound = true;
	var $audio = $('audio')[0];

	var $minutes = $('.minutes');
	var $seconds = $('.seconds');

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

	var endTime;
	var timeRemaining;
	var timeInterval;
	var maxTime;

	var $pomoNum = $('.pomo-num');
	var pomoNum;

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

	var $break = $('.break');
	var $work = $('.work');
	var $body = $('body');

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

	var $pause = $('.pause');
	var $play = $('.play');
	var $sound = $('.sound');
	var $mute = $('.mute');

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

	var showPause = function() {
		if ( $pause.css('display') == 'none' ){
    	$play.hide();
			$pause.show();
		}
	};

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
		$play.hide();
		$pause.show();
	});

});