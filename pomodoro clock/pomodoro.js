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
    };
  }

  Pomodoro.prototype.init = function (stop) {

    console.log(this)
    var _ = this,
        settings = _.settings
        
    _.getTime(); //update time
    _.getCircumference();
    _.resetDial();
    settings.repCounter = 0;
    settings.currentSession = 'work';
    settings.currentSessionTime = settings.work;
    settings.repTime = settings.work + settings.pause;
    _.updateTime(settings.currentSessionTime)
    settings.running = false;
    console.log(settings)
  };

  Pomodoro.prototype.getCircumference = function () {
    var _ = this,
      settings = _.settings;

    var radius = +_.dial.find("#dial-2").attr("r");
    settings.circumference = (2 * Math.PI * radius).toFixed(2);
    _.dial.find("#dial-2").attr("stroke-dasharray", settings.circumference)
  };

  Pomodoro.prototype.getTime = function () {
    var _ = this,
      settings = _.settings;

    var minutes = +_.timer.children(".minutes").text() * 60,
      seconds = +_.timer.children(".seconds").text(),
      reps = +_.repetitions.text() || 1;

    //console.log('minutes seconds reps ', minutes, seconds, reps);

    settings.pause = _.timer.children(".pause") * 60 || 4; ///review
    settings.work = minutes + seconds;
    settings.reps = reps;

    //console.log('work pause ', settings.work, settings.pause);
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

    console.log(offset, _.settings.unit);
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

    console.log(settings.running, "asdfhasjdgdfasjkdf")

    if (settings.running === true) return;

    if (settings.running === false) {
      console.log('asdfasldfhaskjldfhjklasdhfjkashdfjk', settings.currentSession, settings.currentSessionTime)

      currentSession = settings.currentSession;
      currentSessionTime = settings.currentSessionTime;
      repTime = settings.repTime;

      console.log(currentSession, currentSessionTime, repTime)
    }

    settings.running = true;
    _.setUnit(settings[currentSession]);
    settings.timeoutID = timer();

    // console.log(settings.unit)
    var date = new Date();
    // console.log('init date', date.getSeconds())


    //timer function
    function timer() {

      if (settings.running === false) return;

      settings.currentSessionTime = --currentSessionTime;
      settings.repTime = --repTime;

      _.updateTime(currentSessionTime);
      _.updateDial();

      console.log("rep time session ", repTime, currentSessionTime, currentSession);


      if (currentSessionTime < 0) {
        settings.currentSession = currentSession = currentSession === 'work' ? 'pause' : 'work';
        currentSessionTime = settings[currentSession];
        _.resetDial();
        _.setUnit(currentSessionTime);
        _.updateTime(currentSessionTime);
        repTime = settings.repTime = ++repTime;
        console.log('session changed ', repTime, currentSessionTime, currentSession, settings.unit)
      }

      if (repTime === 0) {
        if (settings.repCounter === settings.reps) {
          _.stop();
          console.log('time for a long break', repTime, currentSessionTime, currentSession);
          return;
        } else {
          settings.repCounter++;
          repTime = settings.work + settings.pause;
        }
      }

      if (settings.running === false) return;
      return setTimeout(timer, 1000)

    } //end timer function

  };

  Pomodoro.prototype.pause = function () {
    this.settings.running = false;
    console.log('paused')
  };

  Pomodoro.prototype.stop = function () {
    var _ = this,
      settings = _.settings;

    if (_.settings.running === false ) return;
    
    settings.repCounter = 1;
    
    console.log('stopped')
  };

  var pomodoro = new Pomodoro(".dial", ".timer", ".reps");

  var body = $('body')[0]
  body.pomodoro = pomodoro;

  pomodoro.init();

  //pomodoro.start();

  $("button.start").on("click", pomodoro.start.bind(pomodoro));
  $("button.pause").on("click", pomodoro.pause.bind(pomodoro));
  $("button.stop").on("click", pomodoro.stop.bind(pomodoro));
});
