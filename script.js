let currentOctave = 3;

document.getElementById('octave-down').addEventListener('click', () => {
    if (currentOctave > 1) currentOctave--;
    updateKeys();
});

document.getElementById('octave-up').addEventListener('click', () => {
    if (currentOctave < 7) currentOctave++;
    updateKeys();
});

document.querySelectorAll('.white-key, .black-key').forEach(key => {
    let oscillator;

    key.addEventListener('mousedown', () => {
        playNote(key.dataset.note);
    });

    key.addEventListener('mouseup', stopNote);
    key.addEventListener('mouseleave', stopNote);

    function playNote(note) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(getFrequency(note), audioContext.currentTime);
        oscillator.start();
        key.oscillator = oscillator;
        key.gainNode = gainNode;
    }

    function stopNote() {
        if (oscillator) {
            key.gainNode.gain.exponentialRampToValueAtTime(0.00001, key.oscillator.context.currentTime + 0.03);
            oscillator.stop(key.oscillator.context.currentTime + 0.03);
        }
    }
});

function updateKeys() {
    document.querySelectorAll('.white-key, .black-key').forEach(key => {
        let note = key.dataset.note;
        key.dataset.note = note.slice(0, -1) + currentOctave;
    });
}

function getFrequency(note) {
    const A4 = 440;
    const semitoneRatio = Math.pow(2, 1/12);
    const notes = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2};
    const [letter, octave] = [note.slice(0, -1), note.slice(-1)];
    const noteNumber = notes[letter] + (octave - 4) * 12;
    return A4 * Math.pow(semitoneRatio, noteNumber);
}
