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
    'A3': 'audio/A3.mp3',
    'A#3': 'audio/Asharp3.mp3',
    'B3': 'audio/B3.mp3',
    'C#5': 'audio/Csharp5.mp3',
    'D5': 'audio/D5.mp3',
    'D#5': 'audio/Dsharp5.mp3',
    'E5': 'audio/E5.mp3',
    'metronome': 'audio/metronome.mp3',
};

const keyMappings = {
    'KeyQ': 'A3',
    'Digit2': 'A#3',
    'KeyW': 'B3',
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
    'KeyL': 'C#5',
    'KeyO': 'D5',
    'KeyP': 'D#5',
    'KeyN': 'E5',
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = {};

const preloadAudio = async () => {
    const fetchPromises = Object.keys(notes).map(async note => {
        const response = await fetch(notes[note]);
        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            audioBuffers[note] = await audioContext.decodeAudioData(arrayBuffer);
        } else {
            console.error(`Failed to load ${notes[note]}`);
        }
    });
    await Promise.all(fetchPromises);
};
preloadAudio();

const playNote = (note) => {
    if (audioBuffers[note]) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers[note];
        const gainNode = audioContext.createGain();
        gainNode.gain.value = document.getElementById('volume').value; // Set volume based on slider
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
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

let metronomeInterval;
const metronomeButton = document.getElementById('metronome-toggle');
const bpmInput = document.getElementById('bpm');

const startMetronome = () => {
    const bpm = parseInt(bpmInput.value, 10);
    const interval = 60000 / bpm; // Calculate interval in milliseconds
    metronomeInterval = setInterval(() => {
        playMetronomeSound();
    }, interval);
    metronomeButton.textContent = 'Stop';
};

const stopMetronome = () => {
    clearInterval(metronomeInterval);
    metronomeButton.textContent = 'Start';
};

metronomeButton.addEventListener('click', () => {
    if (metronomeButton.textContent === 'Start') {
        startMetronome();
    } else {
        stopMetronome();
    }
});

const playMetronomeSound = () => {
    if (audioBuffers['C4']) { // Use a note sound for metronome tick
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers['C4']; // You can replace this with a specific metronome sound
        const gainNode = audioContext.createGain();
        gainNode.gain.value = document.getElementById('volume').value; // Set volume based on slider
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(0);
    }
};
