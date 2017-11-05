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
        // set in setUnit()
        unit: null
      };
    }
  
    Pomodoro.prototype.init = function() {
      var _ = this;
  
      _.getTime();
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
      var repTime = (settings.repTime = settings.work + settings.pause);
      settings.time = (settings.work + settings.pause) * reps;
  
      console.log(settings.pause, settings.work, settings.repTime, settings.time);
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
  
    Pomodoro.prototype.updateDial = function(reset) {
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
  
    Pomodoro.prototype.getCircumference = function() {
      var _ = this,
        settings = _.settings;
  
      var radius = +_.dial.find("circle:eq(0)").attr("r");
      settings.circumference = (2 * Math.PI * radius).toFixed(2);
    };
  
    Pomodoro.prototype.setUnit = function(time) {
      var _ = this;
  
      return (this.settings.circumference / time).toFixed(2);
    };
  
    $.extend(Pomodoro.prototype, {
      start: function() {
        var _ = this,
          settings = _.settings,
          time = settings.time,
          work = settings.work,
          pause = settings.pause,
          currentSession = settings.currentSession,
          currentSessionTime = settings.currentSessionTime,
          repTime = settings.repTime,
          reps = settings.reps;
  
        var counter = 0;
  
        _.getCircumference();
        console.log("circumference", settings.circumference);
  
        if (settings.currentSession === null) {
          settings.currentSession = "work";
          currentSessionTime = work;
        } else if (settings.running) {
          currentSessionTime = settings.timeToGo_sess;
          reptime = settings.timeToGo_rep;
        }
  
        settings.running = true;
  
        settings.timeoutID = timer();
  
        function timer() {

          settings.timeToGo_rep = --repTime;
          settings.timeToGo_sess = --currentSessionTime;
          console.log(
            "reptime, current session elapsed",
            repTime,
            currentSessionTime
          );
          console.log("running now", settings.currentSession);
  
          if (currentSessionTime === 0) {
            settings.currentSession =
              settings.currentSession === "work" ? "pause" : "work";
            currentSessionTime = settings[settings.currentSession];
            _.resetDial();
            _.updateTime(currentSessionTime);
            _.setUnit(currentSessionTime);
            return setTimeout(timer, 1000);
          }
  
          if (repTime === 0) {
            if (counter < reps) {
              counter++;
              repTime = settings.repTime;
              return setTimeout(timer, 1000);
            } else {
              //add infinite condition here
              _.stop();
            }
          }
    
    
          return setTimeout(timer, 1000);
        }
      },
      pause: function() {
        var _ = this;
  
        _.settings.running = false;
  
        clearTimeout(_.settings.timeoutID);
      },
  
      stop: function() {
        var _ = this,
          settings = _.settings;
  
        clearTimeout(_.settings.timeoutID);
  
        for (var i in settings) {
          settings[i] = null;
        }
      }
    });
  
    var pomodoro = new Pomodoro(".dial", ".timer", ".reps");
  
    pomodoro.init();
  
    pomodoro.start();
  
    console.log(pomodoro);
  
    //pomodoro.stop()
  });
  