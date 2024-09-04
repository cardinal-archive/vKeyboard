// script.js
const notes = {
    'C4': 'audio/C4.wav',
    'C#4': 'audio/Csharp4.wav',
    'D4': 'audio/D4.wav',
    'D#4': 'audio/Dsharp4.wav',
    'E4': 'audio/E4.wav',
    'F4': 'audio/F4.wav',
    'F#4': 'audio/Fsharp4.wav',
    'G4': 'audio/G4.wav',
    'G#4': 'audio/Gsharp4.wav',
    'A4': 'audio/A4.wav',
    'A#4': 'audio/Asharp4.wav',
    'B4': 'audio/B4.wav',
    'C5': 'audio/C5.wav',
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
