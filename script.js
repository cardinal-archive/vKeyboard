const notes = {
    'A3': 'audio/A3.mp3',
    'A#3': 'audio/Asharp3.mp3',
    'B3': 'audio/B3.mp3',
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
    'C#5': 'audio/Csharp5.mp3',
    'D5': 'audio/D5.mp3',
    'D#5': 'audio/Dsharp5.mp3',
    'E5': 'audio/E5.mp3',
    'metronome': 'metronome.mp3',
};

const keyMappings = {
    'KeyA': 'A3',
    'KeyW': 'A#3',
    'KeyS': 'B3',
    'KeyD': 'C4',
    'KeyR': 'C#4',
    'KeyF': 'D4',
    'KeyT': 'D#4',
    'KeyG': 'E4',
    'KeyH': 'F4',
    'KeyU': 'F#4',
    'KeyJ': 'G4',
    'KeyI': 'G#4',
    'KeyK': 'A4',
    'KeyO': 'A#4',
    'KeyL': 'B5',
    'KeySemicolon': 'C5',
    'KeyBracketLeft': 'C#5',
    'KeyQuote': 'D5',  
    'KeyRightBracket': 'D#5',
    'KeyBackSlash': 'E5',
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = {};

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
        highlightKey(note);
    }
};

const highlightKey = (note) => {
    document.querySelectorAll('.key').forEach(key => {
        if (key.dataset.note === note) {
            key.classList.add('active');
        } else {
            key.classList.remove('active');
        }
    });
};

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => playNote(key.dataset.note));
    key.addEventListener('mouseup', () => key.classList.remove('active'));
});

document.addEventListener('keydown', (event) => {
    const note = keyMappings[event.code];
    if (note) {
        playNote(note);
    }
});

document.addEventListener('keyup', (event) => {
    const note = keyMappings[event.code];
    if (note) {
        document.querySelectorAll('.key').forEach(key => {
            if (key.dataset.note === note) {
                key.classList.remove('active');
            }
        });
    }
});

document.getElementById('volume').addEventListener('input', (event) => {
    const volume = event.target.value;
    audioContext.destination.gain.value = volume;
});

// Metronome related code
