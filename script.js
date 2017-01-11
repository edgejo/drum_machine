var num_beats = 4;
var active_beats = [];
var playing = false;
var current_beat = -1;
var beat_callback = -1;

function pageInit() {
    var beat_button_template = '<button id="temp-id" class="beat-button"></button>';
    var beat_rows = document.getElementsByClassName("beat-row");

    for (var i = 0; i < beat_rows.length; i++) {
        var drum_type = beat_rows[i].id.replace("row-", "");
        beat_rows[i].innerHTML = drum_type.toLocaleUpperCase() + " ";

        for (var j = 1; j <= num_beats; j++) {
            var button_id = drum_type + j.toString();
            beat_rows[i].innerHTML += beat_button_template.replace("temp-id", button_id);
        }
    }

    var beat_buttons = document.getElementsByClassName("beat-button");
    for (var i = 0; i < beat_buttons.length; i++) {
        beat_buttons[i].style.backgroundColor = "red";
        beat_buttons[i].innerHTML = beat_buttons[i].id.substr(1);
        beat_buttons[i].addEventListener("click", beatButtonEventListener);
    }

    var play_button = document.getElementById("play");
    play_button.addEventListener("click", playButtonEventListener);
    play_button.innerHTML = "Play";
}

function beatButtonEventListener() {
    var target_element = event.target;
    var beat_object = parseBeatObject(target_element);

    if (toggleBeat(beat_object)) {
        target_element.style.backgroundColor = "green";
    } else {
        target_element.style.backgroundColor = "red";
    }
}

function toggleBeat(beat) {
    var index = beat.getActiveIndex();

    if (index >= 0) {
        active_beats.splice(index, 1);
        console.log("de-activated beat: " + beat.id);
        return false;
    } else {
        active_beats.push(beat);
        console.log("activated beat: " + beat.id);
        return true;
    }
}

function Beat(id, type, time) {
    this.id = id;
    this.type = type;
    this.time = time;
    this.getActiveIndex = function() {
        // TODO improve iteration logic
        for (var i = 0; i < active_beats.length; i++){
            if (active_beats[i].id == this.id){
                return i;
            }
        }
        return -1;
    };
}

function parseBeatObject(html_beat_button) {
    var button_id;
    var drum_type;
    var drum_time;
    var beat_object;

    button_id = html_beat_button.id;
    drum_type = button_id.substr(0, 1);
    drum_time = parseInt(button_id.substr(1));

    beat_object = new Beat(button_id, drum_type, drum_time);

    return beat_object;
}

function playButtonEventListener() {
    var play_button = event.target;
    var bpm = 120;

    if (playing == false) {
        startMusic(bpm);
        play_button.innerHTML = "Stop";
    } else {
        stopMusic();
        play_button.innerHTML = "Play";
    }
}

function startMusic(bpm) {
    var beat_frequency;

    playing = true;
    current_beat = 1;

    // number of ms between beats
    beat_frequency = (60 / bpm) * 1000;

    beat_callback = window.setInterval(processNextBeat, beat_frequency);
    processNextBeat();
}

function stopMusic() {
    var current_beat_div;

    window.clearInterval(beat_callback);
    playing = false;

    current_beat_div = document.getElementById("current-beat");
    current_beat_div.innerHTML = "";
}

function processNextBeat() {
    var current_beat_div = document.getElementById("current-beat");
    current_beat_div.innerHTML = current_beat + " ";

    // get all beats at the current_time
    for (var i = 0; i < active_beats.length; i++){
        if (active_beats[i].time == current_beat) {
            current_beat_div.innerHTML += active_beats[i].type + " ";
        }
    }   

    if (current_beat < num_beats){
        current_beat += 1;
    } else {
        current_beat = 1;
    }
}