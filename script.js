// Note mappings
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

// Key bindings
const keyBindings = {
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

// Variables to keep track of active notes and keys
const audioElements = {};
const activeKeys = new Set();

// Function to handle key press and release
function handleKeyPress(note, keyElement) {
    if (!activeKeys.has(note)) {
        activeKeys.add(note);
        playNote(note);
        keyElement.classList.add('active'); // Highlight the key
    }
}

function handleKeyRelease(note, keyElement) {
    activeKeys.delete(note);
    stopNoteIfNoSustain(note);
    keyElement.classList.remove('active'); // Remove highlight
}

function playNote(note) {
    if (!audioElements[note]) {
        audioElements[note] = new Audio(notes[note]);
    }
    audioElements[note].currentTime = 0;
    audioElements[note].play();
}

function stopNoteIfNoSustain(note) {
    if (audioElements[note]) {
        audioElements[note].pause();
        audioElements[note].currentTime = 0;
    }
}

// Handle mouse events for keys
document.querySelectorAll('.key').forEach(key => {
    const note = key.dataset.note;
    key.addEventListener('mousedown', () => handleKeyPress(note, key));
    key.addEventListener('mouseup', () => handleKeyRelease(note, key));
    key.addEventListener('mouseleave', () => handleKeyRelease(note, key));
});

// Handle keyboard events
document.addEventListener('keydown', (event) => {
    const note = keyBindings[event.code];
    if (note) {
        const keyElement = document.querySelector(`.key[data-note="${note}"]`);
        handleKeyPress(note, keyElement);
    }
});

document.addEventListener('keyup', (event) => {
    const note = keyBindings[event.code];
    if (note) {
        const keyElement = document.querySelector(`.key[data-note="${note}"]`);
        handleKeyRelease(note, keyElement);
    }
});
