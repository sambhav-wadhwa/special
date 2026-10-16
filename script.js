(() => {
  const $ = (id) => document.getElementById(id);
  // Little drifting hearts in the background
  const field = document.querySelector('.sparkle-field');
  const symbols = ['♡', '✧', '♥', '·'];
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = `${Math.random() * 100}%`;
    s.style.animationDuration = `${12 + Math.random() * 17}s`;
    s.style.animationDelay = `${-Math.random() * 25}s`;
    s.style.fontSize = `${12 + Math.random() * 15}px`;
    field.appendChild(s);
  }

  // Reason cards reveal a tiny love note.
  const reasonMessage = $('reasonMessage');
  document.querySelectorAll('.reason-card').forEach(card => {
    card.addEventListener('click', () => {
      reasonMessage.textContent = card.dataset.reveal;
      card.style.background = '#fff0f5';
      document.querySelectorAll('.reason-card').forEach(other => {
        if (other !== card) other.style.background = '#fff';
      });
    });
  });

  // Heart-catching game: entirely local, no accounts or internet calls.
  const arena = $('gameArena'), scoreEl = $('score'), timeEl = $('time');
  const progress = $('gameProgress'), hint = $('arenaHint'), result = $('gameResult');
  const start = $('startGame'), reset = $('resetGame');
  let score = 0, time = 20, interval = null, spawner = null, playing = false;
  const heartEmojis = ['💗', '💖', '💘', '💕', '💝'];
  function clearGame() {
    clearInterval(interval); clearInterval(spawner);
    interval = spawner = null; playing = false;
    arena.querySelectorAll('.floating-heart').forEach(h => h.remove());
  }
  function updateScore() {
    scoreEl.textContent = score;
    progress.textContent = `${Math.min(score, 5)} / 5 hearts`;
  }
  function spawnHeart() {
    if (!playing) return;
    const heart = document.createElement('button');
    heart.className = 'floating-heart';
    heart.type = 'button';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.setAttribute('aria-label', 'Catch this heart');
    const maxX = Math.max(0, arena.clientWidth - 54);
    const maxY = Math.max(0, arena.clientHeight - 58);
    heart.style.left = `${Math.random() * maxX}px`;
    heart.style.top = `${Math.random() * maxY}px`;
    heart.addEventListener('click', () => {
      if (!playing) return;
      score++; updateScore(); heart.remove();
      if (score >= 5) winGame();
    });
    arena.appendChild(heart);
    setTimeout(() => heart.remove(), 1450);
  }
  function winGame() {
    clearGame();
    hint.hidden = false;
    hint.textContent = 'You caught all my hearts! 💞';
    result.textContent = 'Secret unlocked: if I could pick a favourite place, it would be wherever I get to be with you. ♡';
    start.textContent = 'Play again ♡';
  }
  function endGame() {
    clearGame();
    hint.hidden = false;
    hint.textContent = 'The hearts are taking a tiny nap 😴';
    result.textContent = score >= 5 ? 'You did it, love! 💗' : `You caught ${score} heart${score === 1 ? '' : 's'}! Every single one was sent with love. Try again?`;
    start.textContent = 'Try again ♡';
  }
  function beginGame() {
    clearGame(); score = 0; time = 20; updateScore();
    timeEl.textContent = time; result.textContent = '';
    hint.hidden = true; playing = true; start.textContent = 'Playing… catch them!';
    spawnHeart(); spawner = setInterval(spawnHeart, 620);
    interval = setInterval(() => {
      time--; timeEl.textContent = time;
      if (time <= 0) endGame();
    }, 1000);
  }
  start.addEventListener('click', beginGame);
  reset.addEventListener('click', () => {
    clearGame(); score = 0; time = 20; updateScore(); timeEl.textContent = time;
    hint.hidden = false; hint.textContent = 'Press start, then catch the hearts 💘';
    result.textContent = ''; start.textContent = 'Start the game ♡';
  });

  // Surprise reveal + gentle burst of hearts.
  $('surpriseButton').addEventListener('click', () => {
    const surprise = $('finalSurprise');
    surprise.hidden = !surprise.hidden;
    $('surpriseButton').textContent = surprise.hidden ? 'Tap for one more surprise ✨' : 'A little more love, unlocked 💗';
    if (!surprise.hidden) {
      for (let i = 0; i < 18; i++) {
        const h = document.createElement('span');
        h.textContent = ['💗','💖','💕','✨'][i % 4];
        h.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:${20+Math.random()*60}vh;z-index:60;pointer-events:none;font-size:${16+Math.random()*20}px;transition:transform 1.4s ease,opacity 1.4s ease`;
        document.body.appendChild(h);
        requestAnimationFrame(() => { h.style.transform = `translateY(-${80+Math.random()*160}px) rotate(${Math.random()*80-40}deg)`; h.style.opacity = '0'; });
        setTimeout(() => h.remove(), 1500);
      }
    }
  });

  // The "little tune" button plays your own MP3 instead of the synthesized melody.
  // Add your file as assets/our-song.mp3. Playback starts only after a user tap.
  let tuneOn = false;
  const loveSong = new Audio('assets/our-song.mp3');
  loveSong.loop = true;
  loveSong.preload = 'none';
  loveSong.volume = 0.75;
  loveSong.addEventListener('error', () => {
    tuneOn = false;
    $('musicToggle').setAttribute('aria-pressed', 'false');
    $('musicToggle').innerHTML = '♫ <span>little tune</span>';
    toast('Add your MP3 as assets/our-song.mp3 first 💗');
  });
  $('musicToggle').addEventListener('click', async () => {
    tuneOn = !tuneOn;
    $('musicToggle').setAttribute('aria-pressed', String(tuneOn));
    $('musicToggle').innerHTML = tuneOn ? '♫ <span>tune on</span>' : '♫ <span>little tune</span>';
    if (tuneOn) {
      try { audioCtx ||= new (window.AudioContext || window.webkitAudioContext)(); await audioCtx.resume(); } catch (_) {}
      playNote(); tuneTimer = setInterval(playNote, 430);
      toast('A tiny tune, just for you ♫');
    } else {
      clearInterval(tuneTimer); toast('Tune paused ♡');
    }
  });
  let toastTimer;
  function toast(message) {
    const el = $('toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // Progressive web app install support.
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }

  // FIX: these handlers live inside the same scope as $, so the buttons respond.
  const verdictButton = $('verdictButton');
  if (verdictButton) {
    verdictButton.addEventListener('click', () => {
      const response = $('verdictResponse');
      if (response) response.textContent = 'Verdict accepted! Your sentence begins immediately: one giant hug, plus unlimited “you’re cute” reminders. 👩‍⚖️💗';
      verdictButton.textContent = 'Verdict accepted 💗';
      verdictButton.disabled = true;
    });
  }

  const hugLines = [
    '🫂 SQUEEEEEZE. Imagine me holding you close and not letting go until you feel a little lighter.',
    '💗 Hug delivered! Side effects may include smiling, feeling adored, and wanting another one.',
    '🐻 Bear hug activated. You are safe to be your whole self here—messy hair, weird moods, everything.',
    '🌷 Tiny reminder: you do not have to fix everything today. Take a breath. I am cheering for you.'
  ];
  const hugButton = $('hugButton');
  if (hugButton) hugButton.addEventListener('click', () => {
    const message = $('hugMessage');
    if (message) message.textContent = hugLines[Math.floor(Math.random() * hugLines.length)];
    hugButton.textContent = 'One more hug, please 🫂';
    hugButton.classList.remove('hug-pulse');
    void hugButton.offsetWidth;
    hugButton.classList.add('hug-pulse');
  });

  // Gentle 3D tilt: works with a mouse, but is disabled for touch and reduced-motion users.
  const tiltCards = document.querySelectorAll('.tilt-card');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 8;
        const ry = (x - 0.5) * 10;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Make the cat cards playful: tapping one gives a tiny caption toast.
  const catReactions = [
    '🫡 The tiny officer salutes your excellent taste in boyfriends.',
    '😎 Cool cat confirms: you two are dangerously cute.',
    '🫂 Hug delivery dispatched. Estimated arrival: right now.',
    '🥹 This cat has reviewed you and awarded infinite cuteness points.'
  ];
  document.querySelectorAll('.cat-card').forEach((card, index) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Tap for a cute cat message');
    const react = () => toast(catReactions[index % catReactions.length]);
    card.addEventListener('click', react);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); react(); }
    });
  });
})();
