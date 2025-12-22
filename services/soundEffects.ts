
let audioCtx: AudioContext | null = null;

const getAudioCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) => {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
  
  gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const playClickSound = () => {
  try { playTone(800, 'sine', 0.1, 0, 0.05); } catch (e) {}
};

export const playHoverSound = () => {
  try { playTone(400, 'sine', 0.05, 0, 0.01); } catch (e) {}
};

export const playSuccessSound = () => {
  try {
    playTone(523.25, 'sine', 0.3, 0, 0.1); 
    playTone(659.25, 'sine', 0.3, 0.1, 0.1);
    playTone(783.99, 'sine', 0.6, 0.2, 0.1);
  } catch (e) {}
};

export const playCelebrationSound = () => {
  try {
    playTone(523.25, 'triangle', 0.4, 0, 0.15);
    playTone(659.25, 'triangle', 0.4, 0.1, 0.15);
    playTone(783.99, 'triangle', 0.4, 0.2, 0.15);
    playTone(1046.50, 'triangle', 0.8, 0.3, 0.2);
  } catch (e) {}
};

export const playStartRecordingSound = () => {
  try {
    playTone(440, 'sine', 0.2, 0, 0.1);
    playTone(880, 'sine', 0.4, 0.1, 0.1);
  } catch (e) {}
};

export const playStopRecordingSound = () => {
  try {
    playTone(880, 'sine', 0.2, 0, 0.1);
    playTone(440, 'sine', 0.4, 0.1, 0.1);
  } catch (e) {}
};
