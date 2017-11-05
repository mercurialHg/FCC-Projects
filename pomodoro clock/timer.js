// function updateTime() {
//     time--;
//     timeElapsed++;
//     console.log('time', time);

//     console.log('timeElapsed', timeElapsed)
//     //console.log(time)
//     if (time === 0) {
//         clearTimeout(timer)
//         return;
//     }
//     if (timeElapsed === session.work && working) {
//         working = false;
//         timeElapsed = 0;
//         var x = working ? 'work' : 'pause'
//         console.log(x + ' for ' + session[x]);
//         return setTimeout(updateTime, 1000);
//     }
//     if (timeElapsed === session.pause && !working) {
//         working = true;
//         timeElapsed = 0;
//         var x = working ? 'work' : 'pause'
//         console.log(x + ' for ' + session[x]);
//         return setTimeout(updateTime, 1000);
//     }
//     return setTimeout(updateTime, 1000);
// }

var session = {
    work: 10,
    pause: 5,
}
var working = true;
var timeElapsed = 0;
var sessions = 4
var time = (session.work + session.pause) * 4 - session.pause;
var timer = updateTime();

function Pomodoro (dialSelector, timerSelector, repetitionsSelector) {
    if (!jQuery) throw 'You will need jQuery for this';

    this.dial = $(dialSelector);
    this.timer = $(timerSelector);
    this.repetitions = $(repetitionsSelector);
    this.$ = jQuery;


    this.settings = {
        work : null,
        pause: null,
        reps: null,
        session: null, //pause or work
        time: null,
        elapsedTime: null,
        running: null,
    }
}

Pomodoro.prototype.getSettings = function () {
    var _ = this,
        settings = _.settings;

    var minutes = +_.timer.children('.minutes').text() * 60,
        seconds =+ _.timer.children('.seconds').text(), 
        reps = +_.repetitions.text();

    settings.pause = _.timer.children('.pause') * 60 || 300;
    settings.work = minutes + seconds;
    settings.time = (settings.work + settings.pause) * reps - settings.pause;

    
}

Pomodoro.prototype.setTime = function(time) {

    var _ = this;

    var seconds = time % 60,
        minutes = (time - seconds) - seconds;

    _.timer.children(".seconds").text(seconds);
    _.timer.children(".minutes").text(seconds);
    _.updateDial();
    //insert fade in functionality

}

Pomodoro.prototype.getUnit = function(time) {
    var _ = this;
    var $ = _.$;
    
}

Pomodoro.prototype.getCirc = function(radius) {
    return 2 * Math.PI * radius;
}

