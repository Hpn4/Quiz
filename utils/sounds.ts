import { Audio } from 'expo-av';

type SoundKey = 'select' | 'correct' | 'wrong' | 'next' | 'perfect';

/*
correct wrong https://freesound.org/people/LaurenPonder/sounds/639432/
select next https://freesound.org/people/SOUNDSCAPE_HUMFAK/sounds/257680/
applause https://freesound.org/people/Alterr/sounds/209792/
horn https://freesound.org/people/mokasza/sounds/810330/
*/
const SOUNDS: Record<SoundKey, any> = {
  select: require('../assets/sounds/select.mp3'),
  correct: require('../assets/sounds/correct.mp3'),
  wrong: require('../assets/sounds/wrong.mp3'),
  next: require('../assets/sounds/next.mp3'),
  perfect: require('../assets/sounds/perfect.mp3'),
};

const cache: Map<SoundKey, Audio.Sound> = new Map();

async function loadSound(key: SoundKey) {
  if (cache.has(key)) return cache.get(key)!;
  try {
    const { sound } = await Audio.Sound.createAsync(SOUNDS[key], { shouldPlay: false });
    cache.set(key, sound);
    return sound;
  } catch (e) {
    console.warn('Failed to load sound', key, e);
    return null;
  }
}

async function play(key: SoundKey) {
  try {
    const sound = await loadSound(key);
    if (!sound) return;
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch (e) {
    console.warn('Failed to play sound', key, e);
  }
}

export const playSelect = () => play('select');
export const playCorrect = () => play('correct');
export const playWrong = () => play('wrong');
export const playNext = () => play('next');
export const playPerfect = () => play('perfect');

export default { playSelect, playCorrect, playWrong, playNext, playPerfect };
