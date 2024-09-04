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
    'F5': 'audio/F5.mp3',
    'metronome': 'metronome.mp3',
};

const keyMappings = {
    'KeyA': 'B3',
    'KeyS': 'C4',
    'KeyE': 'C#4',
    'KeyD': 'D4',
    'KeyR': 'D#4',
    'KeyF': 'E4',
    'KeyG': 'F4',
    'KeyY': 'F#4',
    'KeyH': 'G4',
    'KeyU': 'G#4',
    'KeyJ': 'A4',
    'KeyI': 'A#4',
    'KeyK': 'B4',
    'KeyL': 'C5',
    'KeyP': 'C#5',
    'Semicolon': 'D5',  
    'BracketLeft': 'D#5',
    'Quote': 'E5',
    'Backslash': 'F5',
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

const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

const playNote = (note) => {
    if (audioBuffers[note]) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers[note];
        source.connect(gainNode);  // Connect to gainNode instead of directly to destination
        source.start(0);
        highlightKey(note);
    }
};

document.getElementById('volume').addEventListener('input', (event) => {
    const volume = event.target.value;
    gainNode.gain.value = volume;
});

const activeKeys = new Set();

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
    key.addEventListener('mousedown', () => {
        const note = key.dataset.note;
        if (note) {
            playNote(note);
            activeKeys.add(note); // Add to activeKeys set for mouse
        }
    });
    key.addEventListener('mouseup', () => {
        const note = key.dataset.note;
        if (note) {
            activeKeys.delete(note); // Remove from activeKeys set for mouse
            key.classList.remove('active');
        }
    });
});

document.addEventListener('keydown', (event) => {
    const note = keyMappings[event.code];
    if (note && !activeKeys.has(event.code)) {
        activeKeys.add(event.code); // Add the key to the activeKeys set
        playNote(note);
    }
});

document.addEventListener('keyup', (event) => {
    const note = keyMappings[event.code];
    if (note) {
        activeKeys.delete(event.code); // Remove the key from the activeKeys set
        document.querySelectorAll('.key').forEach(key => {
            if (key.dataset.note === note) {
                key.classList.remove('active');
            }
        });
    }
});

// Metronome related code
