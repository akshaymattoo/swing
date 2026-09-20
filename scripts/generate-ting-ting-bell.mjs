import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sampleRate = 44_100;
const durationSeconds = 1.25;
const strikeTimes = [0, 0.42];
const sampleCount = Math.ceil(sampleRate * durationSeconds);
const pcm = Buffer.alloc(sampleCount * 2);

for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
  const time = sampleIndex / sampleRate;
  let value = 0;

  for (const strikeTime of strikeTimes) {
    const elapsed = time - strikeTime;
    if (elapsed < 0) continue;

    const attack = Math.min(1, elapsed / 0.004);
    const decay = Math.exp(-6.8 * elapsed);
    value += attack * decay * (
      Math.sin(2 * Math.PI * 1_568 * elapsed) * 0.58
      + Math.sin(2 * Math.PI * 2_352 * elapsed) * 0.28
      + Math.sin(2 * Math.PI * 3_136 * elapsed) * 0.14
    );
  }

  const softened = Math.tanh(value * 1.25) * 0.72;
  pcm.writeInt16LE(Math.round(softened * 32_767), sampleIndex * 2);
}

const wav = Buffer.alloc(44 + pcm.length);
wav.write('RIFF', 0);
wav.writeUInt32LE(36 + pcm.length, 4);
wav.write('WAVE', 8);
wav.write('fmt ', 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(pcm.length, 40);
pcm.copy(wav, 44);

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(projectRoot, 'assets/audio/ting-ting.wav');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, wav);
console.log(`Generated ${outputPath}`);
