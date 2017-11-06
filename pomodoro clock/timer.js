function updateTime() {
    time--;
    timeElapsed++;
    console.log('time', time);

    console.log('timeElapsed', timeElapsed)
    //console.log(time)
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

var session = {
    work: 10,
    pause: 5,
}
var working = true;
var timeElapsed = 0;
var sessions = 4
var time = (session.work + session.pause) * 4 - session.pause;
var timer = updateTime();



function timer() {
    
//   console.log(
//     "start: session reptime ... unit ",
//     currentSessionTime,
//     repTime,
//     currentSession,
//     settings.unit
//   );

    //reps finished

    settings.currentSessionTime = --currentSessionTime;
    settings.repTime = --repTime;

    _.updateDial();
    _.updateTime(currentSessionTime);


    if (reptime - 1 < 0) {
        if (settings.repCounter === settings.reps) {
            console.log('finished');
            return;
          } else {
            settings.repCounter++;
            repTime = settings.work + settings.pause;
          }
    }

    if (currentSessionTime -1 < 0) {
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

  return setTimeout(timer, 1000);
}
