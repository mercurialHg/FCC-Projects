$(function () {
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

  Pomodoro.prototype.init = function () {
    var _ = this;

    _.getTime();
    _.getCircumference();
    _.settings.repCounter = 0;
    
  };

  Pomodoro.prototype.getCircumference = function () {
    var _ = this,
      settings = _.settings;

    var radius = +_.dial.find("#dial-2").attr("r");
    settings.circumference = (2 * Math.PI * radius).toFixed(2);
  };

  Pomodoro.prototype.getTime = function () {
    var _ = this,
      settings = _.settings;

    var minutes = +_.timer.children(".minutes").text() * 60,
      seconds = +_.timer.children(".seconds").text(),
      reps = +_.repetitions.text() || 1;

    console.log(minutes, seconds, reps);

    settings.pause = _.timer.children(".pause") * 60 || 4; ///review
    settings.work = minutes + seconds;
    settings.repTime = settings.work + settings.pause;
    settings.reps = reps;

    console.log(settings.pause, settings.work, settings.repTime, settings.time);
  };

  Pomodoro.prototype.setUnit = function (time) {
    var _ = this,
      settings = _.settings;

    settings.unit = (settings.circumference / time).toFixed(2);
  };

  Pomodoro.prototype.updateTime = function (time) {
    var _ = this;

    var seconds = time % 60,
      minutes = (time - seconds) / 60;

    _.timer.children(".seconds").text(seconds >= 10 ? seconds : "0" + seconds);
    _.timer.children(".minutes").text(minutes >= 10 ? minutes : "0" + minutes);
    //insert fade in functionality
  };

  Pomodoro.prototype.resetTime = function (time) {
    var _ = this;
    //add flicker animation
    _.updateTime(time);
  };

  Pomodoro.prototype.updateDial = function () {
    var _ = this,
      target = _.dial.find("#dial-2"),
      offset = +target.attr("stroke-dashoffset");

    target.attr("stroke-dashoffset", offset - _.settings.unit);
  };

  Pomodoro.prototype.resetDial = function () {
    var _ = this;
    target = _.dial.find("#dial-2");

    target.attr("stroke-dashoffset", 0);
  };

  Pomodoro.prototype.start = function () {
      var _ = this,
          settings = _.settings,
          currentSession, currentSessionTime, repTime;


          if (!initialized)  {
            _.init();

            currentSession = 'work';
            currentSessionTime = settings.currentSession = settings.work;
            repTime = settings.repTime = settings.work + settings.pause;
          } 

          if (settings.runnning === false ) {
            currentSession = settings.currentSession;
            currentSessionTime = settings.currentSessionTime;
            repTime = settings.repTime;
          }

          settings.running = true;
          _.setUnit(settings[settings.currentSession]);

          settings.timeoutID = timer();
          
          var date = new Date();
          console.log('init date', date.getMinutes() + ":"+ date.getSeconds())

          function timer() {

            settings.currentSessionTime = --currentSessionTime;
            settings.repTime = --repTime;
            
            _.updateTime(currentSessionTime);
            _.updateDial();
            
            (function () { 
              var date = new Date();
              console.log('init date', date.getMinutes() + ":"+ date.getSeconds())
            })();

            if (repTime === 0) {
              if (settings.repCounter === settings.reps) {
                console.log('time for a long break');
                return;
              } else {
                settings.repCounter++;
                repTime = settings.work + settings.pause;
              }
            }

            if (currentSessionTime === 0) {
              settings.currentSession = currentSession = currentSession === 'work' ? 'pause' : 'work';
              currentSessionTime = settings[currentSession];
              
            }

            return setTimeout(timer, 1000)

          }

  };  

  Pomodoro.prototype.pause = function () {

  };

  Pomodoro.prototype.stop = function () {

  };

  var pomodoro = new Pomodoro(".dial", ".timer", ".reps");

  var body = $('body')[0]
  body.pomodoro = pomodoro;

  pomodoro.init();

  //pomodoro.start();

  $("button.start").on("click", pomodoro.start.bind(pomodoro));
  $("button.pause").on("click", pomodoro.pause.bind(pomodoro));
  $("button.stom").on("click", pomodoro.stop.bind(pomodoro));
});
