function updateTime() {
    time--;
    timeElapsed++;
    console.log('time', time);

    console.log('timeElapsed', timeElapsed)
    if (time === 0) {
        clearTimeout(timer)
        return;
    }
    if (timeElapsed === session.work && working) {
        working = false;
        timeElapsed = 0;
        var x = working ? 'work' : 'pause'
        console.log(x + ' for ' + session[x]);
        return setTimeout(updateTime, 1000);
    }
    if (timeElapsed === session.pause && !working) {
        working = true;
        timeElapsed = 0;
        var x = working ? 'work' : 'pause'
        console.log(x + ' for ' + session[x]);
        return setTimeout(updateTime, 1000);
    }
    return setTimeout(updateTime, 1000);
}


function stop () {
    clearTimeout(timer);
    resetTime();
    timeElapsed = 0;
    state = 'stopped'
}

function pause() {
    clearTimeout(timer);
    state = 'paused'
}

function resetTime() {
    time = (session.work + session.pause) * 4 - session.pause;
}


function Pomodoro (timerElement, dialElement, repsElement) {

    this.dial = dialElement;
    this.timer = timerElement;
    this.reps = repsElement;
    this.globals = {
        work : null,
        pause: null,        //int
        reps : null,        //int
        time : null,        //int
        elapsed: null,      //int
        session: null,      //pause or work
        running : null,     //boolean
    }
}

Pomodoro.prototype.getTime = Pomodoro.prototype.resetTime = function (reset) {
    var _ = this;

    var minutes = +_.timer.children('.minutes').text() * 60,
        seconds = +_.timer.children('.seconds').text();

    var work = _.globals.work = minutes + seconds;
    var reps = _.globals.reps = +_.reps.text();
    var pause = _.globals.pause = 300 // 5 min default
    _.globals.time = (work + pause ) * reps - pause //unless infinite, time ends with a session, no need for a break

    if (reset) {
        _.globals.session  = 'work';
        _.globals.running = false;
    }

}

Pomodoro.prototype.displayTime = function () {
    if (running === null) {
        throw 'Pomodoro not initialized'
    }

    var _ = this;
    var minutes = Math.floor(_.globals.elapsed / 60);
    var seconds = _.globals.elapsed % 60;

    _.timer.children('.minutes').text(minutes);
    _.timer.children('.seconds').text(seconds);

}





var session = {
    work: 10,
    pause: 5,
}
var working = true;
var timeElapsed = 0;
var sessions = 4
var time = (session.work + session.pause) * 4 - session.pause;
var timer = updateTime();