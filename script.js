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
