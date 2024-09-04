const notes = {
    'C4': 'audio/C4.mp3',
    'C#4': 'audio/Csharp4.mp3',
    'D4': 'audio/D4.mp3',
    'D#4': 'audio/Dsharp4.mp3',
    'E4': 'audio/E4.mp3',
    'F4': 'audio/F4.mp3',
    'F#4': 'audio/Fsharp4.mp3',
    'G4': 'audio/G4.mp3',
    'G#4': 'audio/Gsharp4.mp3',
    'A4': 'audio/A4.mp3',
    'A#4': 'audio/Asharp4.mp3',
    'B4': 'audio/B4.mp3',
    'C5': 'audio/C5.mp3',
};

const audioElements = {};
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let sustain = false;
let multiSustain = false;

// Preload audio files
const preloadAudio = () => {
    Object.keys(notes).forEach(note => {
        const audio = new Audio(notes[note]);
        audio.load(); // Preload the audio
        audioElements[note] = audio;
    });
};
preloadAudio();

const playNote = (note) => {
    if (!audioElements[note]) {
        const audio = new Audio(notes[note]);
        audioElements[note] = audio;
    }
    if (!multiSustain) {
        stopAllNotes();
    }
    audioElements[note].currentTime = 0;
    audioElements[note].play();
};

const stopNoteIfNoSustain = (note) => {
    if (!sustain && audioElements[note]) {
        audioElements[note].pause();
        audioElements[note].currentTime = 0;
    }
};

const stopAllNotes = () => {
    for (let note in audioElements) {
        audioElements[note].pause();
        audioElements[note].currentTime = 0;
    }
};

// Event Listeners
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => playNote(key.dataset.note));
    key.addEventListener('mouseup', () => stopNoteIfNoSustain(key.dataset.note));
});

document.getElementById('sustain').addEventListener('click', () => {
    sustain = !sustain;
});

document.getElementById('multi-sustain').addEventListener('change', (event) => {
    multiSustain = event.target.checked;
});

document.getElementById('volume').addEventListener('input', (event) => {
    for (let note in audioElements) {
        audioElements[note].volume = event.target.value;
    }
});
