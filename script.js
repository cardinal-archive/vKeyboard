// script.js
const notes = {
    'C4': 'path_to_C4.mp3',
    'C#4': 'path_to_Csharp4.mp3',
    'D4': 'path_to_D4.mp3',
    'D#4': 'path_to_Dsharp4.mp3',
    'E4': 'path_to_E4.mp3',
    'F4': 'path_to_F4.mp3',
    'F#4': 'path_to_Fsharp4.mp3',
    'G4': 'path_to_G4.mp3',
    'G#4': 'path_to_Gsharp4.mp3',
    'A4': 'path_to_A4.mp3',
    'A#4': 'path_to_Asharp4.mp3',
    'B4': 'path_to_B4.mp3',
    'C5': 'path_to_C5.mp3',
};

const keys = document.querySelectorAll('.key');
const sustainButton = document.getElementById('sustain-button');
const volumeControl = document.getElementById('volume-control');
const singleSustainCheckbox = document.getElementById('single-sustain');
const octaveUpButton = document.getElementById('octave-up');
const octaveDownButton = document.getElementById('octave-down');

let isSustaining = false;
let sustainedNotes = new Set();
let volume = 0.5;
let octaveShift = 0;

const playNote = (note) => {
    const audio = new Audio(notes[note]);
    audio.volume = volume;
    audio.play();
    if (isSustaining) {
        sustainedNotes.add(audio);
    } else {
        audio.addEventListener('ended', () => {
            sustainedNotes.delete(audio);
        });
    }
};

const stopNote = (audio) => {
    audio.pause();
    audio.currentTime = 0;
    sustainedNotes.delete(audio);
};

const getNoteWithOctaveShift = (note) => {
    // Adjust note with octave shift
    const noteParts = note.match(/([A-G#]+)(\d+)/);
    if (noteParts) {
        const [, noteName, octave] = noteParts;
        return `${noteName}${parseInt(octave) + octaveShift}`;
    }
    return note;
};

keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = getNoteWithOctaveShift(key.dataset.note);
        playNote(note);
    });
    key.addEventListener('mouseup', () => {
        if (!isSustaining && !singleSustainCheckbox.checked) {
            // For non-sustain mode and sustain multiple notes
            // Stop all sustained notes if checkbox is unchecked
            sustainedNotes.forEach(audio => {
                stopNote(audio);
            });
        }
    });
});

sustainButton.addEventListener('mousedown', () => {
    isSustaining = true;
});

sustainButton.addEventListener('mouseup', () => {
    isSustaining = false;
    if (!singleSustainCheckbox.checked) {
        // Stop all sustained notes
        sustainedNotes.forEach(audio => {
            stopNote(audio);
        });
    }
});

volumeControl.addEventListener('input', (event) => {
    volume = event.target.value;
    sustainedNotes.forEach(audio => {
        audio.volume = volume;
    });
});

octaveUpButton.addEventListener('click', () => {
    octaveShift += 1;
});

octaveDownButton.addEventListener('click', () => {
    octaveShift -= 1;
});
