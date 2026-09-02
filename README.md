# randomsounds

A dependency-free Web Audio API sound effects module with procedural random pitch, envelopes, waveforms, noise, fuzz, arcade blips, and chiptune chaos.

## Usage

```js
import { soundEffects } from './audiofx.js';
soundEffects.randomSound(); // alias for chaos()
soundEffects.chaos({ voices: 4 });
```

Open `index.html` in a modern browser and use the accessible Random sound or Chaos synth buttons. Audio initializes lazily after a user gesture.