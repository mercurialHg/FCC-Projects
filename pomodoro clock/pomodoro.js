<<<<<<< HEAD
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
=======
$(function() {
  function Pomodoro(dialSelector, timerSelector, repetitionsSelector) {
    if (!jQuery) throw "You will need jQuery for this";

    this.dial = $(dialSelector);
    this.timer = $(timerSelector);
    this.repetitions = $(repetitionsSelector);
    this.$ = jQuery;

    this.settings = {
      //get with .getTime()
      work: null,
      pause: null,
      reps: null,
      time: null,
      //set in .start()
      currentSession: null, //pause or work
      repTime: null,
      currentSessionTime: null,
      timeToGo_rep: null,
      timeToGo_sess: null,
      running: null,
      timeoutID: null, //string
      repCounter: null,
      // set in setUnit()
      unit: null,
      //init
      initialized: null
    };
  }

  Pomodoro.prototype.init = function() {
    var _ = this;

    _.getTime();
    _.getCircumference();
    _.settings.repCounter = 0;
  };

  Pomodoro.prototype.getCircumference = function() {
    var _ = this,
      settings = _.settings;

    var radius = +_.dial.find("#dial-2").attr("r");
    settings.circumference = (2 * Math.PI * radius).toFixed(2);
  };

  Pomodoro.prototype.getTime = function() {
    var _ = this,
      settings = _.settings;

    var minutes = +_.timer.children(".minutes").text() * 60,
      seconds = +_.timer.children(".seconds").text(),
      reps = +_.repetitions.text() || 1;

    console.log(minutes, seconds, reps);

    settings.pause = _.timer.children(".pause") * 60 || 4; ///review
    settings.work = minutes + seconds;
    settings.repTime = settings.work + settings.pause;
    settings.time = (settings.work + settings.pause) * reps;
    settings.reps = reps;

    console.log(settings.pause, settings.work, settings.repTime, settings.time);
  };

  Pomodoro.prototype.setUnit = function(time) {
    var _ = this,
      settings = _.settings;

    settings.unit = (settings.circumference / time).toFixed(2);
  };

  Pomodoro.prototype.updateTime = function(time) {
    var _ = this;

    var seconds = time % 60,
      minutes = (time - seconds) / 60;

    _.timer.children(".seconds").text(seconds >= 10 ? seconds : "0" + seconds);
    _.timer.children(".minutes").text(minutes >= 10 ? minutes : "0" + minutes);
    //insert fade in functionality
  };

  Pomodoro.prototype.resetTime = function(time) {
    var _ = this;
    //add flicker animation
    _.updateTime(time);
  };

  Pomodoro.prototype.updateDial = function() {
    var _ = this,
      target = _.dial.find("#dial-2"),
      offset = +target.attr("stroke-dashoffset");

    target.attr("stroke-dashoffset", offset - _.settings.unit);
  };

  Pomodoro.prototype.resetDial = function() {
    var _ = this;
    target = _.dial.find("#dial-2");

    target.attr("stroke-dashoffset", 0);
  };

  $.extend(Pomodoro.prototype, {
    start: function() {
      var _ = this,
        settings = _.settings,
        running = settings.running,
        currentSession,
        currentSessionTime,
        currentSession,
        repTime;
      //if stopped
      if (settings.initialized === null) {
        _.init();
        currentSession = settings.currentSession = "work";
        currentSessionTime = settings.work;
        repTime = settings.repTime;
      }
      //if paused
      if (running === false) {
        currentSessionTime = settings.currentSessionTime;
        currentSession = settings.currentSession;
        repTime = settings.repTime;
      }
      //running state
      running = settings.running = true;
      //calculate dash offset per second
      _.setUnit(settings[currentSession]);
      //console.log("init unit ", settings.unit);

      settings.timeoutID = timer();

      function timer() {
        
        if (_.settings.running === false) {
          
          return
        }
           
        console.log(
          "start: session reptime ... unit ",
          currentSessionTime,
          repTime,
          currentSession,
          settings.unit
        );

        if (repTime < 0) {
          if (settings.repCounter === settings.reps) {
            _.stop();
            return;
          } else {
            settings.repCounter++;
            repTime = settings.work + settings.pause;
          }
        }

        if (currentSessionTime < 0) {
          currentSession = settings.currentSession =
            currentSession === "work" ? "pause" : "work";
          currentSessionTime = settings[currentSession];
          _.resetDial();
          _.setUnit(currentSessionTime);
          _.updateTime(currentSessionTime);
        } else {
          _.updateDial();
          _.updateTime(currentSessionTime);
        }
        
        settings.currentSessionTime = --currentSessionTime;
        settings.repTime = --repTime;

        return setTimeout(timer, 1000);
      }
    },
    pause: function() {
      var _ = this;

      _.settings.running = false;

    },

    stop: function() {
      var _ = this,
        settings = _.settings;

      _.settings.running = false;

      for (var i in settings) {
        settings[i] = null;
      }
    }
  });

  var pomodoro = new Pomodoro(".dial", ".timer", ".reps");
  
  var body = $('body')[0]
  body.pomodoro = pomodoro;

  pomodoro.init();

  //pomodoro.start();

  $("button.start").on("click", pomodoro.start.bind(pomodoro));
  $("button.pause").on("click", pomodoro.pause.bind(pomodoro));
  $("button.stom").on("click", pomodoro.stop.bind(pomodoro));
});
>>>>>>> 15c16313d750afa7105ce12ae788c0a1c97334db
