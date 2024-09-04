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

const keyMappings = {
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
    'KeyK': 'C5',
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = {};
const keysPressed = new Set();
const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

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
        source.connect(gainNode);
        source.start(0);
        highlightKeys();
    }
};

const highlightKeys = () => {
    document.querySelectorAll('.key').forEach(key => {
        if (keysPressed.has(key.dataset.note)) {
            key.classList.add('active');
        } else {
            key.classList.remove('active');
        }
    });
};

const handleKeyDown = (event) => {
    const note = keyMappings[event.code];
    if (note && !keysPressed.has(note)) {
        keysPressed.add(note);
        playNote(note);
    }
};

const handleKeyUp = (event) => {
    const note = keyMappings[event.code];
    if (note) {
        keysPressed.delete(note);
        highlightKeys();
    }
};

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => {
        if (!keysPressed.has(key.dataset.note)) {
            keysPressed.add(key.dataset.note);
            playNote(key.dataset.note);
        }
    });
    key.addEventListener('mouseup', () => {
        keysPressed.delete(key.dataset.note);
        highlightKeys();
    });
    key.addEventListener('mouseleave', () => {
        keysPressed.delete(key.dataset.note);
        highlightKeys();
    });
});

document.getElementById('volume').addEventListener('input', (event) => {
    if (gainNode) {
        gainNode.gain.value = event.target.value;
    }
});

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
