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
const activeNodes = new Map(); // Map to keep track of active notes and their nodes
const keyTimers = {}; // Track active timers for each key to prevent rapid firing

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
        
        activeNodes.set(note, source);
        highlightKey(note);

        // Clear any existing timer for this note
        if (keyTimers[note]) {
            clearInterval(keyTimers[note]);
        }
    }
};

const stopNote = (note) => {
    const source = activeNodes.get(note);
    if (source) {
        source.stop(); // Stop the source node
        activeNodes.delete(note); // Remove from active nodes
        highlightKey(note, false);
    }
};

const highlightKey = (note, highlight = true) => {
    document.querySelectorAll('.key').forEach(key => {
        if (key.dataset.note === note) {
            key.classList.toggle('active', highlight);
        }
    });
};

const handleKeyDown = (event) => {
    const note = keyMappings[event.code];
    if (note) {
        if (!keyTimers[note]) {
            playNote(note);
            keyTimers[note] = setInterval(() => {
                playNote(note); // Ensure the note plays again after the interval
            }, 200); // Adjust interval as needed
        }
    }
};

const handleKeyUp = (event) => {
    const note = keyMappings[event.code];
    if (note) {
        if (keyTimers[note]) {
            clearInterval(keyTimers[note]); // Stop rapid firing
            delete keyTimers[note];
        }
        stopNote(note);
    }
};

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => playNote(key.dataset.note));
    key.addEventListener('mouseup', () => stopNote(key.dataset.note));
    key.addEventListener('mouseleave', () => stopNote(key.dataset.note)); // Optional: stop note if mouse leaves key
});

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
