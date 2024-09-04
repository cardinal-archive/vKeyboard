<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virtual Piano</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #2c2c2c;
            color: white;
            font-family: Arial, sans-serif;
        }
        .piano {
            display: flex;
            margin-top: 20px;
            position: relative;
        }
        .key {
            width: 60px;
            height: 200px;
            border: 1px solid black;
            background-color: white;
            position: relative;
            z-index: 1;
        }
        .key.black {
            width: 40px;
            height: 120px;
            background-color: black;
            position: absolute;
            top: 0;
            z-index: 2;
        }
        .key.highlighted {
            background-color: #ddd;
        }
        .key.black.highlighted {
            background-color: #555;
        }
        .controls {
            margin-top: 20px;
        }
        .volume-control {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>Virtual Piano</h1>

    <div class="piano">
        <div class="key white" data-note="C4" data-key="KeyA">A</div>
        <div class="key black" data-note="C#4" data-key="KeyW" style="left: 40px;">W</div>
        <div class="key white" data-note="D4" data-key="KeyS">S</div>
        <div class="key black" data-note="D#4" data-key="KeyE" style="left: 100px;">E</div>
        <div class="key white" data-note="E4" data-key="KeyD">D</div>
        <div class="key white" data-note="F4" data-key="KeyF">F</div>
        <div class="key black" data-note="F#4" data-key="KeyT" style="left: 220px;">T</div>
        <div class="key white" data-note="G4" data-key="KeyG">G</div>
        <div class="key black" data-note="G#4" data-key="KeyY" style="left: 280px;">Y</div>
        <div class="key white" data-note="A4" data-key="KeyH">H</div>
        <div class="key black" data-note="A#4" data-key="KeyU" style="left: 340px;">U</div>
        <div class="key white" data-note="B4" data-key="KeyJ">J</div>
        <div class="key white" data-note="C5" data-key="KeyK">K</div>
    </div>

    <div class="controls">
        <button id="octave-down">Octave Down</button>
        <button id="octave-up">Octave Up</button>
        <div class="volume-control">
            <label for="volume">Volume:</label>
            <input type="range" id="volume" min="0" max="1" step="0.01" value="0.5">
        </div>
    </div>

    <script>
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

        const playNote = (note) => {
            if (!activeNotes[note]) {
                activeNotes[note] = new Audio(notes[note]);
                activeNotes[note].play();
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
            }
        };

        const handleKeyUp = (event) => {
            const keyElement = keyMappings[event.code];
            if (keyElement && keyElement.classList.contains('highlighted')) {
                keyElement.classList.remove('highlighted');
                stopNote(keyElement.dataset.note);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    </script>
</body>
</html>
