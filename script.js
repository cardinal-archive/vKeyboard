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
    'metronome': 'audio/metronome.mp3'  // New metronome sound
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
const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

// Preload and decode audio files
const preloadAudio = async () => {
    const fetchPromises = Object.keys(notes).map(async note => {
        try {
            const response = await fetch(notes[note]);
            if (!response.ok) throw new Error(`Failed to load ${notes[note]}`);
            const arrayBuffer = await response.arrayBuffer();
            audioBuffers[note] = await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error(error);
        }
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
        highlightKey(note);
    }
};

const playMetronomeSound = () => {
    const metronomeNote = 'metronome'; // Use the key for the new metronome sound
    if (audioBuffers[metronomeNote]) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers[metronomeNote];
        source.connect(gainNode);  // Ensure the metronome sound also goes through the gain node
        source.start(0);
    } else {
        console.error(`No audio buffer for metronome note: ${metronomeNote}`);
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

document.getElementById('volume').addEventListener('input', (event) => {
    const volume = parseFloat(event.target.value);
    gainNode.gain.value = volume;
});

const metronomeInterval = 60000 / 120; // Default to 120 BPM
let metronomeTimer;
let isMetronomeRunning = false;

const startStopMetronome = () => {
    if (isMetronomeRunning) {
        clearInterval(metronomeTimer);
        isMetronomeRunning = false;
        document.getElementById('metronome-toggle').textContent = 'Start Metronome';
    } else {
        const bpm = parseInt(document.getElementById('bpm').value, 10) || 120;
        const interval = 60000 / bpm;
        metronomeTimer = setInterval(playMetronomeSound, interval);
        isMetronomeRunning = true;
        document.getElementById('metronome-toggle').textContent = 'Stop Metronome';
    }
};

document.getElementById('metronome-toggle').addEventListener('click', startStopMetronome);
