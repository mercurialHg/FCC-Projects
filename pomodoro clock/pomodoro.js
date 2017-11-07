$(function () {

  function Pomodoro(dial, timer, pomodoro, pause, repetitions, progress) {
    if (!jQuery) throw "You will need jQuery for this";

    this.dialElem = $(dial);      //circle svg element
    this.timerElem = $(timer)     //container for pomodoro and pause
    this.pomodoroElem = $(pomodoro);  //pomodoro timer before start, countdown during 
    this.pauseElem = $(pause);
    this.repetitionsElem = $(repetitions);
    this.progressElem = $(progress); // container for progress

    this.defaultTransition = "all .2s linear"

    /*
      structure: 
      main
        | clock
            | dial
            | timer
                | pomodoro
                | pause
            | repetitions
        | progress
    */

    this.settings = {
      //saved on init
      pomodoro: 0,
      pause: 0,
      repetitions: 0,
      circ: 0,
    };

    this.memory = {
      //saved on pause
      session: null,
      sessionProgress: null,
      repetitionProgress: null,
      unit: null,
    };

    this.state = {
      //describe state
      initialized: null,
      paused: null,
      stopped: null,
      progress: null,
    }
  }

  Pomodoro.prototype.init = function () {
    var _ = this,
      settings = _.settings,
      state = _.state;

    _.getSettings();
    state.initialized = true;
    state.paused = false;
    state.stopped = true;
    state.progress = 0;
  };

  Pomodoro.prototype.getSettings = function () {
    var _ = this,
      settings = _.settings;

    var minutes = +_.pomodoroElem.children('.minutes').text() * 60,
      seconds = +_.pomodoroElem.children('.seconds').text();
    settings.pomodoro = minutes + seconds;

    minutes = seconds = null

    minutes = +_.pauseElem.children('.minutes').text() * 60;
    seconds = +_.pauseElem.children('.seconds').text();

    settings.pause = minutes + seconds;

    settings.repetitions = +_.repetitionsElem.text();

    _.getCircumference();

    //console.log('work pause ', settings);
  };

  Pomodoro.prototype.getCircumference = function () {
    var _ = this,
      settings = _.settings;

    var radius = +_.dialElem.attr("r");
    settings.circ = (2 * Math.PI * radius).toFixed(2);
    _.dialElem.attr("stroke-dasharray", settings.circ)
  };

  Pomodoro.prototype.setUnit = function (time) {
    var _ = this,
      settings = _.settings;

    settings.unit = (settings.circ / time).toFixed(2);
  };

  Pomodoro.prototype.resetTime = Pomodoro.prototype.updateTime = function (time) {
    var _ = this;

    var seconds = time % 60,
      minutes = (time - seconds) / 60;

    _.pomodoroElem.children(".seconds").text(seconds >= 10 ? seconds : "0" + seconds);
    _.pomodoroElem.children(".minutes").text(minutes >= 10 ? minutes : "0" + minutes);

  };

  Pomodoro.prototype.updateDial = function () {
    var _ = this,
      offset = +_.dialElement.attr("stroke-dashoffset");

    _.dialElement.attr("stroke-dashoffset", offset - _.memory.unit);

    console.log(offset, _.memory.unit);
  };

  Pomodoro.prototype.resetDial = function () {
    var _ = this;

    _.pomodoroElem.css("transition", "none");
    _.dialElem.attr("stroke-dashoffset", 0);
    _.pomodoroElem.css("transition", _.defaultTransition);

  };

  Pomodoro.prototype.start = function () {
    var _ = this,
      settings = _.settings,
      memory = _.memory,
      state = _.state;

    //local vars
    var session, sessionProgress, repetitionProgress, unit;

    if (state.initialized === false) {
      _.init();
    }  //create pomodoro, pause, repetitions, circ

    if (state.paused) {
      session = memory.session;
      sessionProgress = memory.sessionProgress;
      repetitionProgress = memory.repetitionProgress;
      unit = memory.unit;
    } else {
      session = "pomodoro";
      sessionProgress = settings.pomodoro;
      repetitionProgress = settings.pomodoro + settings.pause;
      _.setUnit(sessionProgress);
    }

    var timer = runPomodoro();

    function runPomodoro() {
      //check if paused
      if (state.paused) {
        saveToMemory();
        return;
      }

      sessionProgress--;
      repetitionProgress--;

      _.updateDial();
      _.updateTime(sessionProgress);

      if (sessionProgress < 0) {
        session = session === 'work' ? 'pause' : 'work';
        sessionProgress = settings[session];
        _.resetDial();
        _.setUnit(sessionProgress);
        _.updateTime(sessionProgress);
        repetitionProgress++;

        console.log('session changed ',
          repetitionProgress,
          sessionProgress,
          session)

      }
      if (repetitionProgress === 0) {
        state.progress++;
        if (state.progress === settings.repetitions) {
          _.stop();
          console.log('time for a long break', repTime, currentSessionTime, currentSession);
          return;
        }
      }

      //check if paused
      if (state.paused) {
        saveToMemory();
        return;
      }

      return setTimeout(runPomodoro, 1000);
    }; // ens runPomodoro()

    function saveToMemory() {
      memory.session = session;
      memory.sessionProgress = sessionProgress;
      memory.repetitionProgress = repetitionProgress;
      unit = memory.unit;
    }

  }//end start()

  Pomodoro.prototype.pause = function () {
    this.state.paused = false;
  };

  Pomodoro.prototype.stop = function () {
    var _ = this;

    _.clearMemory();
    _.resetDial();
    _.updateTime(_.settings.pomodoro);
    _.state.progress = 0;

    //add UI reset

  };

  Pomodoro.prototype.clearMemory = function () {
    var memory = this.memory;

    for (var i in memory) {
      memory[i] = null;
    }
  }

  var pomodoro = new Pomodoro("#dial-2", "", "");

  var body = $('body')[0]
  body.pomodoro = pomodoro;

  pomodoro.init();

  //pomodoro.start();

  $("button.start").on("click", pomodoro.start.bind(pomodoro));
  $("button.pause").on("click", pomodoro.pause.bind(pomodoro));
  $("button.stop").on("click", pomodoro.stop.bind(pomodoro));
});