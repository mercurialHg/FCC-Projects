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
        pause: null,
        reps : null,
        time : null,
        elapsed: null,
        session: null, //pause or work
        running : null,
    }
}

Pomodoro.prototype.getTime = function () {
    var _ = this;

    var minutes = +_.timer.find('minutes').text() * 60,
        seconds = +_.timer.find('minutes').text();

    var work = _.globals.work = minutes + seconds;
    var reps = _.globals.reps = +_.reps.text();
    var pause = _.globals.pause = 300 // 5 min default
    _.globals.time = (work + pause ) * reps - pause //unless infinite, time ends with a session, no need for a break


}

Pomodoro.prototype.displayTime = function () {
    if (running === null) {
        throw 'Pomodoro not initialized'
    }

    var _ = this;
    
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