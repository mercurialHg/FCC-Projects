function Pomodoro(dialSelector, timerSelector, repetitionsSelector) {
    if (!jQuery) throw 'You will need jQuery for this';

    this.dial = $(dialSelector);
    this.timer = $(timerSelector);
    this.repetitions = $(repetitionsSelector);
    this.$ = jQuery;


    this.settings = {
        work: null,
        pause: null,
        reps: null,
        currentSession: null, //pause or work
        repTime: null,
        currentSessionTime: null,
        time: null,
        unit: null,
        timeToGo_rep: null,
        timeToGo_sess: null,
        running: null,
        timeoutID: null, //string
    }
}

Pomodoro.prototype.init  = function () {
    
}

Pomodoro.prototype.getTime = function () {
    var _ = this,
        settings = _.settings;

    var minutes = +_.timer.children('.minutes').text() * 60,
        seconds = + _.timer.children('.seconds').text(),
        reps = +_.repetitions.text();

    settings.pause = _.timer.children('.pause') * 60 || 300;
    settings.work = minutes + seconds;
    settings.repTime = settings.work + settings.time;
    settings.time = (settings.work + settings.pause) * reps - settings.pause;


}

Pomodoro.prototype.updateTime = function (time) {

    var _ = this;

    var seconds = time % 60,
        minutes = (time - seconds) - seconds;

    _.timer.children(".seconds").text(seconds);
    _.timer.children(".minutes").text(seconds);
    //insert fade in functionality

}

Pomodoro.prototype.resetTime = function (time) {
    var _ = this;
    //add flicker animation
    _.updateTime(time);
}

Pomodoro.prototype.updateDial = function (reset) {
    var _ = this,
        target = _.dial.find('#dial-2'),
        offset = +target.attr('stroke-dashoffset');

    target.attr('stroke-dashoffset', offset - _.settings.unit);
}

Pomodoro.prototype.resetDial = function () {
    var _ = this;
    target = _.dial.find('#dial-2');
       
    target.attr('stroke-dashoffset', 0);
}


Pomodoro.prototype.getCircumference = function () {
    var _ = this,
        settings = _.settings;

    var radius = + _.dial.find('circle:eq(0)').attr("r");
    settings.circumference = (2 * Math.PI * radius).toFixed(2);

}

Pomodoro.prototype.setUnit = function (time) {
    var _ = this;


    return (this.settings.circumference / time).toFixed(2)
}




$.extend(Pomodoro.prototype, {
    start: function () {
        var _ = this,
            settings = _.settings,
            time = settings.time,
            work = settings.work,
            pause = settings.pause,
            currentSession = settings.currentSession,
            currentSessionTime = settings.currentSessionTime,
            repTime = settings.reptTime,
            reps = settings.reps;

        var counter = 0;

        _.getCircumference();


        if (currentSession === null) {
            currentSession = 'work';
            currentSessionTime = work;

        } else if (settings.running) {
            currentSessionTime = settings.timeToGo_sess;
            reptime = settings.timeToGo_rep;
        }

        settings.running = true;

        function timer() {

            settings.timeToGo_rep = --repTime;
            settings.timeToGo_sess = --currentSessionTime;
            ///console.log("reptime, current session elapsed", repTime, currentSessionTime)

            if (currentSessionTime === 0) {
                settings.currentSession = currentSession === 'work' ? 'pause' : 'work';
                currentSessionTime = settings[currentSession];
                _.resetDial();
                _.updateTime(currentSessionTime);
                _.setUnit(currentSessionTime);
                return setTimeout(timer, 1000)
            }

            if (repTime === 0) {
                if (counter < reps) {
                    counter++;
                    reptime = settings.repTime;
                    return setTimeout(timer, 1000)
                }
                //add infinite condition here 
                else {
                    _.stop();
                }
            }

            _.updateDial();
            _.updateTime();


        }

        settings.timeoutID = timer();
    },
    pause: function () {
        var _ = this,
            timeoutID = _.settings.timeoutID;
        _.settings.running = false;
        clearTimeout(timeoutID);
    },

    stop: function () {
        var _ = this,
            settings = _.settings,
            timeoutID = _.settings.timeoutID;

        clearTimeout(timeoutID);

        for (var i in settings) {
            settings[i] = null;
        }
    },
})