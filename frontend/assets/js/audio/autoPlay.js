// Simple auto-play music helper with graceful fallback
// Place your mp3 at: ./assets/media/music/theme.mp3 (or change AUDIO_SRC below)
(function () {
  'use strict';

  const AUDIO_SRC = './assets/media/music/theme.mp3';
  const VOLUME = 0.6;

  let audioEl = null;
  let started = false;

  function createAudio() {
    audioEl = new Audio(AUDIO_SRC);
    audioEl.loop = true;
    audioEl.preload = 'auto';
    audioEl.volume = VOLUME;
    return audioEl;
  }

  function tryAutoPlay() {
    if (!audioEl) createAudio();
    return audioEl.play();
  }

  function showHint() {
    const hint = document.createElement('div');
    hint.textContent = '点击任意位置开启音乐';
    hint.style.position = 'fixed';
    hint.style.left = '50%';
    hint.style.bottom = '28px';
    hint.style.transform = 'translateX(-50%)';
    hint.style.padding = '6px 10px';
    hint.style.borderRadius = '12px';
    hint.style.fontSize = '12px';
    hint.style.color = '#dfe6ff';
    hint.style.background = 'rgba(0,0,0,0.45)';
    hint.style.backdropFilter = 'blur(4px)';
    hint.style.zIndex = '2';
    hint.style.pointerEvents = 'none';
    hint.id = 'music-hint';
    document.body.appendChild(hint);
  }

  function hideHint() {
    const n = document.getElementById('music-hint');
    if (n) n.remove();
  }

  function startOnFirstGesture() {
    if (started) return;
    const handler = () => {
      if (started) return;
      started = true;
      tryAutoPlay().finally(hideHint);
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('pointerdown', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    showHint();
  }

  document.addEventListener('DOMContentLoaded', () => {
    tryAutoPlay().then(() => {
      started = true;
    }).catch(() => {
      // Autoplay likely blocked; wait for first user gesture
      startOnFirstGesture();
    });
  });
})();


