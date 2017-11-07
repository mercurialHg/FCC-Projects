/*
App description:
    clock:   dial 
             pomodoro, | config
             pause     | config
             pomodoro timer after start (hides config)
             /// both available only before init and after stop
             repetitions: default = 4; min 1; max Infinite
    buttons: start 
             pause  
             stop 

    progress: list of max 4 pomodoro : pending and completed

    (optional) motivational : quotes 
    
    behavior:
            set pomodoro + pause manually in UI    
            press start
            config menu fades out
            pomodoro section becomes timer and fades in 
            timer decreases each second
            dial increases each second
            ...
            timer changes to pause -fade
            dial resets to 0 (in background, fade in already reset)
            timer decreases each second
            dial increases each second
            ...
            progress updates
            ...
            end


Background:

    initialize:
        ///
        read pomodoro;
        read pause;
        read repetitions;
        write session = 'pomodoro'              --> tells what session is curently active and displayed
        write sessionProgress = 'pomodoro';     --> set initially to pomodoro
        write repetitionProgress                --> how much of a pomodoro + pause has elapsed

        write paused             --> false
        write init               --> true

        get circumference
        set unit =  circumference / pomodoro;
        set progressCounter  = 0

    start:
        //track how much of a pomodoro/pause has passed + update dial for each second

        if (not paused) do nothing

        if (not initialized)
            initialized

        if (paused) resume: 
            read Memory.session 
            read Memory.sessionElapsed
            read Memory.repetitionElapsed
            read Memory.unit

            write paused             --> true

    pause:
        write paused --> true 

    stop:
        write init   --> false

        reset dial;
        clear memory;


*/