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
