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

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = {};
let sustain = false;
let multiSustain = false;

// Preload and decode audio files
const preloadAudio = async () => {
    const fetchPromises = Object.keys(notes).map(async note => {
        const response = await fetch(notes[note]);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffers[note] = await audioContext.decodeAudioData(arrayBuffer);
    });
    await Promise.all(fetchPromises);
};
preloadAudio();

const playNote = (note) => {
    if (audioBuffers[note]) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers[note];
        source.connect(audioContext.destination);
        source.start(0);
    }
};

const stopAllNotes = () => {
    // Web Audio API doesn't support stopping all notes directly.
    // Implement custom logic if needed.
};

// Event Listeners
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => playNote(key.dataset.note));
    key.addEventListener('mouseup', () => {
        if (!sustain && !multiSustain) {
            stopAllNotes();
        }
    });
});

document.getElementById('sustain').addEventListener('click', () => {
    sustain = !sustain;
});

document.getElementById('multi-sustain').addEventListener('change', (event) => {
    multiSustain = event.target.checked;
});

document.getElementById('volume').addEventListener('input', (event) => {
    // Volume control for Web Audio API requires adjusting gain nodes
    // Implement volume control if necessary
});
