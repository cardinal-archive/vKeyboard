let audioContext;
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

const mapKeyToNote = {
    'KeyA': 'C4',
    'KeyW': 'C#4',
    'KeyS': 'D4',
    'KeyE': 'D#4',
    'KeyD': 'E4',
    'KeyF': 'F4',
    'KeyT': 'F#4',
    'KeyG': 'G4',
    'KeyY': 'G#4',
    'KeyH': 'A4',
    'KeyU': 'A#4',
    'KeyJ': 'B4',
    'KeyK': 'C5'
};

let activeNotes = {};
let volume = 0.5; // Default volume

document.addEventListener('mousedown', initializeAudioContext);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
document.getElementById('volume').addEventListener('input', (event) => {
    volume = event.target.value;
    updateVolume();
});

function initializeAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('Audio context resumed');
        });
    }
}

function handleKeyDown(event) {
    if (!audioContext) {
        initializeAudioContext();
    }
    const note = mapKeyToNote[event.code];
    if (note && !activeNotes[note]) {
        playNote(note);
        highlightKey(note, true);
        activeNotes[note] = true;
    }
}

function handleKeyUp(event) {
    const note = mapKeyToNote[event.code];
    if (note && activeNotes[note]) {
        stopNote(note);
        highlightKey(note, false);
        delete activeNotes[note];
    }
}

function playNote(note) {
    const audio = new Audio(notes[note]);
    audio.volume = volume;
    audio.play();
}

function stopNote() {
    // Note stopping logic is not required with this setup, but if needed, handle here.
}

function highlightKey(note, highlight) {
    const key = document.querySelector(`[data-note="${note}"]`);
    if (key) {
        key.classList.toggle('highlighted', highlight);
    }
}

function updateVolume() {
    // Update volume for all currently playing notes
    for (let note in activeNotes) {
        const audio = new Audio(notes[note]);
        audio.volume = volume;
        // Need to handle actual playback elements if managed differently
    }
}
