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

const keyElements = document.querySelectorAll('.key');
const keyMappings = Array.from(keyElements).reduce((acc, key) => {
    acc[key.dataset.key] = key;
    return acc;
}, {});

let activeNotes = {};
let keyRepeatTimers = {};  // Track timers for rapid firing

const playNote = (note) => {
    if (!activeNotes[note]) {
        const audio = new Audio(notes[note]);
        activeNotes[note] = audio;
        audio.play();
    }
};

const stopNote = (note) => {
    if (activeNotes[note]) {
        activeNotes[note].pause();
        activeNotes[note].currentTime = 0;
        delete activeNotes[note];
    }
};

const handleKeyDown = (event) => {
    const keyElement = keyMappings[event.code];
    if (keyElement && !keyElement.classList.contains('highlighted')) {
        keyElement.classList.add('highlighted');
        playNote(keyElement.dataset.note);

        // Handle rapid firing
        if (!keyRepeatTimers[event.code]) {
            keyRepeatTimers[event.code] = setInterval(() => {
                playNote(keyElement.dataset.note);
            }, 200); // Adjust the interval for rapid firing
        }
    }
};

const handleKeyUp = (event) => {
    const keyElement = keyMappings[event.code];
    if (keyElement && keyElement.classList.contains('highlighted')) {
        keyElement.classList.remove('highlighted');
        stopNote(keyElement.dataset.note);

        // Clear rapid firing timer
        if (keyRepeatTimers[event.code]) {
            clearInterval(keyRepeatTimers[event.code]);
            delete keyRepeatTimers[event.code];
        }
    }
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Debugging: Logging to see if key events are being registered
window.addEventListener('keydown', (e) => console.log(`Key down: ${e.code}`));
window.addEventListener('keyup', (e) => console.log(`Key up: ${e.code}`));
