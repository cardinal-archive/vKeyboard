// script.js
const notes = {
    'C3': 'path_to_C3.mp3',
    'C#3': 'path_to_Csharp3.mp3',
    'D3': 'path_to_D3.mp3',
    // Add paths for all notes
};

const keys = document.querySelectorAll('.key');
const sustainButton = document.getElementById('sustain-button');
const volumeControl = document.getElementById('volume-control');

let isSustaining = false;
let sustainedNotes = new Set();
let volume = 0.5; // Default volume

const playNote = (note) => {
    const audio = new Audio(notes[note]);
    audio.volume = volume; // Set volume
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

keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.dataset.note;
        playNote(note);
    });
    key.addEventListener('mouseup', () => {
        if (!isSustaining) {
            // For non-sustain mode, stop the note
            // (In this case, stopping the note is handled by the audio end event)
        }
    });
});

sustainButton.addEventListener('mousedown', () => {
    isSustaining = true;
});

sustainButton.addEventListener('mouseup', () => {
    isSustaining = false;
    // Stop all sustained notes
    sustainedNotes.forEach(audio => {
        stopNote(audio);
    });
});

// Volume control
volumeControl.addEventListener('input', (event) => {
    volume = event.target.value;
    sustainedNotes.forEach(audio => {
        audio.volume = volume;
    });
});
