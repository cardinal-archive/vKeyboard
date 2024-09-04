const notes = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88,
    'C2': 523.25
};

const keys = document.querySelectorAll('.key');
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator;

keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        playTone(key.dataset.note);
        key.classList.add('pressed');
    });

    key.addEventListener('mouseup', () => {
        stopTone();
        key.classList.remove('pressed');
    });

    key.addEventListener('mouseleave', () => {
        stopTone();
        key.classList.remove('pressed');
    });
});

function playTone(note) {
    const frequency = notes[note];
    if (oscillator) {
        oscillator.stop();
    }
    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
}

function stopTone() {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
}
