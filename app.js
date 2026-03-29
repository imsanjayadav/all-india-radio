(function () {
  // ==========================================
  // 1. CONFIGURATION & FEATURE FLAGS
  // ==========================================
  const Config = {
    flags: {
      enableCrossfade: true,
      enableVisualizer: true,
      enableSmartSort: true,
      enableDevPanel: true
    },
    audio: {
      crossfadeDuration: 1.5, // seconds
      maxRetries: 3
    },
    state: {
      isLowBandwidth: false
    }
  };

  if ('connection' in navigator) {
    const type = navigator.connection.effectiveType;
    if (type === '2g' || type === '3g') {
      Config.state.isLowBandwidth = true;
      Config.flags.enableVisualizer = false;
      console.log('[Vision] Low bandwidth mode enabled.');
    }
  }

  const stations = [
    { name: 'Radio Mirchi 98.3 FM', freq: '98.3', city: 'Mumbai', lang: 'Hindi', format: 'Bollywood', stream: 'https://eu8.fastcast4u.com/proxy/clyedupq?mp=%2F1?aw_0_req_lsid=2c0fae177108c9a42a7cf24878625444', icon: '🎤' },
    { name: 'Vividh Bharati', freq: '102.6', city: 'Delhi', lang: 'Hindi', format: 'National', stream: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8', icon: '🇮🇳' },
    { name: '92.7 Big FM', freq: '92.7', city: 'Mumbai', lang: 'Hindi', format: 'Bollywood', stream: 'https://stream.zeno.fm/dbstwo3dvhhtv', icon: '🔊' },
    { name: 'Radio BBC World Service', freq: '101.1', city: 'Delhi', lang: 'English', format: 'News', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', icon: '🌍' },
    { name: '93.5 Red FM', freq: '93.5', city: 'Delhi', lang: 'Hindi', format: 'News', stream: 'https://stream.zeno.fm/9phrkb1e3v8uv', icon: '🌍' },
    { name: 'Ishq FM', freq: '104.2', city: 'Delhi', lang: 'Hindi', format: 'Love Songs', stream: 'https://drive.uber.radio/uber/bollywoodlove/icecast.audio', icon: '❤️' },
    { name: 'Radio City Hindi', freq: '91.1', city: 'Mumbai', lang: 'Hindi', format: 'Hindi', stream: 'https://stream-177.zeno.fm/pxc55r5uyc9uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJweGM1NXI1dXljOXV2IiwiaG9zdCI6InN0cmVhbS0xNzcuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6ImplWXdDUDhwU3ZpZTQtOHRDSDVoR3ciLCJpYXQiOjE3NzMxNDg5MTQsImV4cCI6MTc3MzE0ODk3NH0.wJOSrzcCqqTb8SX7I-IT-drPH4pXZMfw22zCjjjcLp0', icon: '🏬' },
    { name: 'Radio Mango 91.9', freq: '91.9', city: 'Kochi', lang: 'Malayalam', format: 'Malayalam', stream: 'https://listen.openstream.co/4635/audio', icon: '🥭' },
    { name: 'Hungama 90s Once Again', freq: '95.0', city: 'Mumbai', lang: 'Hindi', format: 'Old songs', stream: 'https://stream.zeno.fm/rm4i9pdex3cuv', icon: '🕺' },
    { name: 'Mohammed Rafi Radio', freq: '95.0', city: 'Mumbai', lang: 'Hindi', format: 'Old songs', stream: 'https://stream.zeno.fm/2xx62x8ztm0uv', icon: '🕺' },
    { name: 'Air FM Gold', freq: '100.1', city: 'Delhi', lang: 'Hindi', format: 'classic, news', stream: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio00564kbps.m3u8', icon: '🕺' },
    { name: 'Air FM Rainbow', freq: '107.1', city: 'Delhi', lang: 'Hindi', format: 'classic, news', stream: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio004/hlspbaudio00464kbps.m3u8', icon: '🕺' },
    { name: '91.1 FM Radio City', freq: '91.1', city: 'Delhi', lang: 'Hindi', format: 'Hindi', stream: 'https://stream.zeno.fm/pxc55r5uyc9uv', icon: '🕺' },
    { name: 'All India Radio Air Akashvani', freq: '', city: 'Delhi', lang: 'Hindi', format: 'News', stream: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio002/hlspbaudio00264kbps.m3u8', icon: '🕺' },
    { name: '94.3 Club FM', freq: '94.3', city: 'Kerala', lang: 'Malayalam', format: 'POP', stream: 'https://listen.openstream.co/4635/audio', icon: '🕺' },
  ];

  // ─── DOM Elements ────────────────────────────────────────────────
  const app = document.getElementById('app');
  const stationGrid = document.getElementById('stationGrid');
  const categoryContainer = document.getElementById('categoryContainer');
  const searchInput = document.getElementById('searchInput');
  const player = document.getElementById('player');
  const playerClose = document.getElementById('playerClose');
  const audioPlayer = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const volumeSlider = document.getElementById('volumeSlider');
  const playerName = document.getElementById('playerName');
  const playerIconEl = document.getElementById('playerIcon');
  const playerStatus = document.getElementById('playerStatus');
  const playerMainInfo = document.getElementById('playerMainInfo');
  const featuredCard = document.getElementById('featuredCard');
  const featuredName = document.getElementById('featuredName');
  const featuredFreq = document.getElementById('featuredFreq');
  const featuredCity = document.getElementById('featuredCity');
  const bottomNav = document.getElementById('bottomNav');
  const toastContainer = document.getElementById('toastContainer');
  const offlineBanner = document.getElementById('offlineBanner');
  const recentSection = document.getElementById('recentSection');
  const recentRow = document.getElementById('recentRow');
  const favGrid = document.getElementById('favGrid');
  const historyGrid = document.getElementById('historyGrid');
  const sleepMenu = document.getElementById('sleepMenu');
  const sleepBadge = document.getElementById('sleepBadge');
  const playerFavIcon = document.getElementById('playerFavIcon');

  // ─── State ───────────────────────────────────────────────────────
  let activeStation = stations[0];
  let currentCategory = 'All';
  let searchQuery = '';
  let isPlaying = false;
  let isExpanded = false;
  let sleepTimerId = null;
  let sleepRemaining = 0;
  let sleepInterval = null;
  let deferredInstallPrompt = null;

  // ==========================================
  // 2. INTELLIGENCE & DATA MANAGER
  // ==========================================
  const DataManager = (() => {
    let customStations = JSON.parse(localStorage.getItem('vfm_custom') || '[]');
    let volumeMemory = JSON.parse(localStorage.getItem('vfm_volumes') || '{}');
    let pinnedStations = JSON.parse(localStorage.getItem('vfm_pinned') || '[]');
    let favorites = JSON.parse(localStorage.getItem('vfm_favorites') || '[]');
    let listenHistory = JSON.parse(localStorage.getItem('vfm_history') || '[]');

    const saveFavorites = () => localStorage.setItem('vfm_favorites', JSON.stringify(favorites));
    const saveHistory = () => localStorage.setItem('vfm_history', JSON.stringify(listenHistory));

    const getDailyPicks = (stationList) => {
      const today = new Date().toDateString();
      let seed = 0;
      for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
      const picks = [];
      const listCopy = [...stationList];
      for (let i = 0; i < 3 && listCopy.length > 0; i++) {
        const index = (seed + i * 17) % listCopy.length;
        picks.push(listCopy.splice(index, 1)[0]);
      }
      return picks;
    };

    const getSmartRankedStations = (baseStations) => {
      let combined = [...baseStations, ...customStations];
      if (!Config.flags.enableSmartSort) return combined;

      return combined.sort((a, b) => {
        if (pinnedStations.includes(a.name) && !pinnedStations.includes(b.name)) return -1;
        if (!pinnedStations.includes(a.name) && pinnedStations.includes(b.name)) return 1;

        const aScore = (favorites.includes(a.name) ? 50 : 0) + listenHistory.filter(h => h.name === a.name).length;
        const bScore = (favorites.includes(b.name) ? 50 : 0) + listenHistory.filter(h => h.name === b.name).length;
        return bScore - aScore;
      });
    };

    const exportData = () => {
      const data = { favorites, listenHistory, customStations, volumeMemory, pinnedStations };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VisionFM_Backup_$new Date().toISOString().split('T')[0].json`;
      a.click();
      showToast('fa-download', 'Data Exported Successfully!');
    };

    const addCustomStation = (name, url) => {
      customStations.push({ name, freq: 'Custom', city: 'Imported', lang: 'Unknown', format: 'Custom', stream: url, icon: '🌟' });
      localStorage.setItem('vfm_custom', JSON.stringify(customStations));
    };

    return {
      get favorites() { return favorites; },
      get listenHistory() { return listenHistory; },
      saveFavorites, saveHistory, getDailyPicks, getSmartRankedStations, exportData, volumeMemory, pinnedStations, customStations, addCustomStation
    };
  })();

  function isFav(name) { return DataManager.favorites.includes(name); }

  function toggleFavorite(name) {
    if (isFav(name)) {
      DataManager.favorites.splice(DataManager.favorites.indexOf(name), 1);
      showToast('fa-heart-crack', 'Removed from Favorites');
    } else {
      DataManager.favorites.push(name);
      showToast('fa-heart', 'Added to Favorites');
    }
    DataManager.saveFavorites();
    renderStations();
    renderFavorites();
    updatePlayerFavIcon();
  }

  function addToHistory(name) {
    const history = DataManager.listenHistory;
    const idx = history.findIndex(h => h.name === name);
    if (idx !== -1) history.splice(idx, 1);
    history.unshift({ name, ts: Date.now() });
    if (history.length > 30) history.splice(30);
    DataManager.saveHistory();
    renderRecentlyPlayed();
    renderHistory();
  }

  // ─── Toast Notifications ──────────────────────────────────────────
  function showToast(icon, message) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    toastContainer.appendChild(t);
    setTimeout(() => { t.classList.add('toast-out'); }, 2200);
    setTimeout(() => { t.remove(); }, 2500);
  }

  // ==========================================
  // 3. ADVANCED AUDIO ENGINE (Web Audio API)
  // ==========================================
  const AudioEngine = (() => {
    let audioCtx, analyser, dataArray;
    const players = [new Audio(), new Audio()];
    const nodes = [];
    const gains = [];
    let activeIndex = 0;
    let retryCount = 0;
    // We keep a reference to a direct standard player just in case Web Audio is blocked by CORS.
    const fallbackPlayer = document.getElementById('audioPlayer');

    const initWebAudio = () => {
      if (audioCtx) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        players.forEach((player, i) => {
          player.crossOrigin = "anonymous";
          const source = audioCtx.createMediaElementSource(player);
          const gain = audioCtx.createGain();

          source.connect(gain);
          gain.connect(analyser);
          gain.connect(audioCtx.destination);

          nodes.push(source);
          gains.push(gain);

          player.addEventListener('error', () => {
            if (i !== activeIndex) return;
            if (retryCount < Config.audio.maxRetries) {
              retryCount++;
              showToast('fa-spinner fa-spin', `Stream failed. Retrying (${retryCount}/${Config.audio.maxRetries})...`);
              setTimeout(() => player.play(), 2000);
            } else {
              showToast('fa-triangle-exclamation', 'Station offline. Skipping to next.');
              nextStation();
            }
          });

          // Audio Events
          player.addEventListener('waiting', () => { if (i === activeIndex) playerStatus.innerText = 'Buffering...'; });
          player.addEventListener('playing', () => { if (i === activeIndex) playerStatus.innerText = 'Live - Streaming'; });
        });
      } catch (e) {
        console.warn("Web Audio API not supported or blocked", e);
      }
    };

    const playStation = (streamUrl, stationName) => {
      initWebAudio();

      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      retryCount = 0;
      isPlaying = true;

      // Handle raw standard fallback if initialization failed
      if (!audioCtx) {
        fallbackPlayer.src = streamUrl;
        fallbackPlayer.play().catch(e => {
          playerStatus.innerText = 'Error - Tap to retry';
          showToast('fa-exclamation-triangle', 'Stream unavailable');
        });
        playIcon.className = 'fas fa-pause';
        playerStatus.innerText = 'Live - Streaming';
        return;
      }

      const nextIndex = (activeIndex + 1) % 2;
      const currentAudio = players[activeIndex];
      const nextAudio = players[nextIndex];
      const currentGain = gains[activeIndex];
      const nextGain = gains[nextIndex];

      nextAudio.src = streamUrl;
      const playPromise = nextAudio.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          const targetVol = DataManager.volumeMemory[stationName] || 0.7;
          volumeSlider.value = targetVol;

          if (Config.flags.enableCrossfade) {
            nextGain.gain.setValueAtTime(0, audioCtx.currentTime);
            nextGain.gain.linearRampToValueAtTime(targetVol, audioCtx.currentTime + Config.audio.crossfadeDuration);

            currentGain.gain.setValueAtTime(currentGain.gain.value, audioCtx.currentTime);
            currentGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + Config.audio.crossfadeDuration);

            setTimeout(() => { if (currentAudio.src !== nextAudio.src) currentAudio.pause(); }, Config.audio.crossfadeDuration * 1000);
          } else {
            currentAudio.pause();
            nextGain.gain.value = targetVol;
          }
          activeIndex = nextIndex;
          playIcon.className = 'fas fa-pause';
          playerStatus.innerText = 'Live - Streaming';
        }).catch(e => {
          console.warn("CORS/Playback error on Station:", e);
          // Fallback internally
          fallbackPlayer.src = streamUrl;
          fallbackPlayer.play();
          playIcon.className = 'fas fa-pause';
        });
      }
    };

    const togglePlay = (streamUrl, stationName) => {
      if (isPlaying) {
        players[activeIndex].pause();
        fallbackPlayer.pause();
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        playerStatus.innerText = 'Live - Paused';
      } else {
        playStation(streamUrl, stationName);
      }
    };

    const setVolume = (val, stationName) => {
      if (audioCtx && gains[activeIndex]) {
        gains[activeIndex].gain.value = val;
      }
      fallbackPlayer.volume = val;
      DataManager.volumeMemory[stationName] = val;
      localStorage.setItem('vfm_volumes', JSON.stringify(DataManager.volumeMemory));
    };

    return { initWebAudio, playStation, togglePlay, setVolume, getAnalyser: () => ({ analyser, dataArray }) };
  })();

  // ==========================================
  // 4. DYNAMIC UI & VISUALIZER
  // ==========================================
  const UIEngine = (() => {
    const canvas = document.getElementById('visualizerCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let animationId;

    const drawVisualizer = () => {
      if (!Config.flags.enableVisualizer || Config.state.isLowBandwidth || !canvas || !ctx) return;
      animationId = requestAnimationFrame(drawVisualizer);

      const { analyser, dataArray } = AudioEngine.getAnalyser();
      if (!analyser) return;

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / dataArray.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#f59e0b';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    };

    const applyDynamicTheme = (station) => {
      const colors = ['#f59e0b', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      let index = 0;
      for (let i = 0; i < station.name.length; i++) index += station.name.charCodeAt(i);
      index = index % colors.length;
      document.documentElement.style.setProperty('--accent-color', colors[index]);
      document.documentElement.style.setProperty('--accent-glow', colors[index] + '40');
    };

    return { startVisualizer: () => drawVisualizer(), applyDynamicTheme };
  })();

  // ==========================================
  // 5. GESTURES, CONTEXT MENU & DEV PANEL
  // ==========================================
  const InteractionEngine = (() => {
    let touchStartX = 0;

    const init = () => {
      player.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      player.addEventListener('touchend', e => {
        const diffX = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diffX) > 80 && !isExpanded) {
          diffX > 0 ? nextStation() : prevStation();
        }
      }, { passive: true });

      document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D' && Config.flags.enableDevPanel) {
          const panel = document.getElementById('devPanel');
          if (panel) {
            panel.classList.toggle('active');
            document.getElementById('devLog').innerText = `
[System Status]
Viewport: ${window.innerWidth}x${window.innerHeight}
Network: ${navigator.connection ? navigator.connection.effectiveType : 'Unknown'}
Crossfade: ${Config.flags.enableCrossfade ? 'ON' : 'OFF'}
History Size: ${DataManager.listenHistory.length}
Favs Size: ${DataManager.favorites.length}
Active Station: ${activeStation ? activeStation.name : 'None'}
              `;
          }
        }
      });

      const closeDevPanel = document.getElementById('closeDevPanel');
      if (closeDevPanel) closeDevPanel.onclick = () => {
        document.getElementById('devPanel').classList.remove('active');
      };
    };

    const attachLongPress = (element, stationObj) => {
      let pressTimer;
      element.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => showContextMenu(stationObj), 600);
      }, { passive: true });
      element.addEventListener('touchend', () => clearTimeout(pressTimer));
      element.addEventListener('touchmove', () => clearTimeout(pressTimer));

      element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(stationObj);
      });
    };

    const showContextMenu = (station) => {
      const menu = document.getElementById('contextMenu');
      const overlay = document.getElementById('contextOverlay');
      if (!menu) return;
      document.getElementById('contextTitle').innerText = station.name;
      overlay.classList.add('active');
      menu.classList.add('active');
      document.getElementById('ctxPlay').onclick = () => { window.selectStation(station.name); closeMenu(); };
      document.getElementById('ctxFav').onclick = () => { toggleFavorite(station.name); closeMenu(); };
      document.getElementById('ctxPin').onclick = () => {
        if (!DataManager.pinnedStations.includes(station.name)) {
          DataManager.pinnedStations.push(station.name);
          localStorage.setItem('vfm_pinned', JSON.stringify(DataManager.pinnedStations));
          showToast('fa-thumbtack', 'Station pinned');
          renderStations();
        }
        closeMenu();
      };
      document.getElementById('ctxShare').onclick = () => { shareStationSpecific(station); closeMenu(); };
    };

    const closeMenu = () => {
      const overlay = document.getElementById('contextOverlay');
      const menu = document.getElementById('contextMenu');
      if (overlay) overlay.classList.remove('active');
      if (menu) menu.classList.remove('active');
    };

    const overlay = document.getElementById('contextOverlay');
    if (overlay) overlay.addEventListener('click', closeMenu);

    return { init, attachLongPress };
  })();

  // ─── Init ────────────────────────────────────────────────────────
  function init() {
    showSkeletonStations();
    renderCategories();
    InteractionEngine.init();

    // Import custom station modal logic
    const importSaveBtn = document.getElementById('importSave');
    if (importSaveBtn) {
      importSaveBtn.onclick = () => {
        const name = document.getElementById('importName').value;
        const url = document.getElementById('importUrl').value;
        if (name && url) {
          DataManager.addCustomStation(name, url);
          document.getElementById('importModalOverlay').classList.remove('active');
          showToast('fa-check', 'Station imported!');
          renderStations();
        }
      };
      document.getElementById('importCancel').onclick = () => {
        document.getElementById('importModalOverlay').classList.remove('active');
      };
    }

    setTimeout(() => {
      restoreLastStation();
      renderStations();
      renderRecentlyPlayed();
      updateFeatured(activeStation);
      setupEventListeners();
      UIEngine.startVisualizer();
      setupServiceWorker();
      setupInstallPrompt();
    }, 400);
  }

  // ─── Skeleton Screens ─────────────────────────────────────────────
  function showSkeletonStations() {
    let html = '';
    for (let i = 0; i < 5; i++) {
      html += `<div class="skeleton-card"><div class="sk-img"></div><div class="sk-text"><div class="sk-line"></div><div class="sk-line"></div></div></div>`;
    }
    stationGrid.innerHTML = html;
  }

  // ─── Restore Last Station ──────────────────────────────────────────
  function restoreLastStation() {
    const last = localStorage.getItem('vfm_lastStation');
    if (last) {
      const allStations = DataManager.getSmartRankedStations(stations);
      const s = allStations.find(st => st.name === last);
      if (s) {
        activeStation = s;
        playerName.innerText = s.name;
        playerIconEl.innerText = s.icon || '📻';
        UIEngine.applyDynamicTheme(s);
      }
    }
  }

  // ─── Render Categories ─────────────────────────────────────────────
  function renderCategories() {
    const formats = ['All', ...new Set(stations.map(s => s.format))];
    categoryContainer.innerHTML = formats.map(f => {
      return `<div class="pill ${f === currentCategory ? 'active' : ''}" data-category="${f}">${f}</div>`;
    }).join('');
  }

  // ─── Render Stations ───────────────────────────────────────────────
  function renderStations() {
    const allStations = DataManager.getSmartRankedStations(stations);
    const filtered = allStations.filter(s => {
      const matchesCat = currentCategory === 'All' || s.format === currentCategory;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      stationGrid.innerHTML = `<div class="no-results"><i class="fas fa-radio"></i><p>No stations found for "${searchQuery}"</p></div>`;
      return;
    }

    let gridHtml = '';
    filtered.forEach((s, index) => {
      const eName = s.name.replace(/'/g, "\\'");
      const favClass = isFav(s.name) ? 'active' : '';
      const favIcon = isFav(s.name) ? 'fas' : 'far';
      const pinIcon = DataManager.pinnedStations.includes(s.name) ? '<i class="fas fa-thumbtack" style="color:var(--text-secondary);font-size:0.7rem;"></i> ' : '';

      gridHtml += `
        <div class="station-card fade-in ${activeStation.name === s.name ? 'active' : ''}" 
             style="animation-delay:${index * 0.04}s" 
             id="card_${index}"
             onclick="selectStation('${eName}')">
          <div class="station-image">${s.icon || '📻'}</div>
          <div class="station-details">
            <div class="station-name">${pinIcon}${s.name}</div>
            <div class="station-meta">
              <span class="station-freq">${s.freq} MHz</span>
              <span>•</span><span>${s.city}</span>
              <span>•</span><span>${s.lang}</span>
            </div>
          </div>
          <div class="fav-btn ${favClass}" onclick="event.stopPropagation(); toggleFav('${eName}')">
            <i class="${favIcon} fa-heart"></i>
          </div>
        </div>`;

      if ((index + 1) % 4 === 0) {
        gridHtml += `
          <div class="station-ad-card fade-in" style="animation-delay:${index * 0.04 + 0.1}s">
            <div class="ad-inline-header"><div class="ad-badge">Ad</div><span style="font-size:0.7rem;color:var(--text-secondary);opacity:0.7;">Sponsored</span></div>
            <div style="display:flex;gap:12px;align-items:center;">
              <div style="width:44px;height:44px;background:#34a853;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><i class="fas fa-shopping-bag"></i></div>
              <div style="flex:1;"><h5 style="font-size:0.85rem;color:var(--text-primary);margin-bottom:2px;">Vision Store</h5><p style="font-size:0.7rem;color:var(--text-secondary);">Limited time offer on headphones!</p></div>
              <button style="background:rgba(255,255,255,0.1);color:var(--text-primary);border:1px solid var(--glass-border);padding:4px 12px;border-radius:20px;font-size:0.7rem;font-weight:600;" onclick="document.getElementById('importModalOverlay').classList.add('active');">+ Import URL</button>
            </div>
          </div>`;
      }
    });
    stationGrid.innerHTML = gridHtml;

    // Attach Long Press after rendering
    filtered.forEach((s, index) => {
      const el = document.getElementById(`card_${index}`);
      if (el) InteractionEngine.attachLongPress(el, s);
    });
  }

  // ─── Favorites Tab ────────────────────────────────────────────────
  function renderFavorites() {
    const allStations = DataManager.getSmartRankedStations(stations);
    const favStations = allStations.filter(s => isFav(s.name));
    if (favStations.length === 0) {
      favGrid.innerHTML = '<div class="no-results"><i class="fas fa-heart"></i><p>No favorites yet. Tap the ♥ on any station.</p></div>';
      return;
    }
    favGrid.innerHTML = favStations.map(s => {
      const eName = s.name.replace(/'/g, "\\'");
      return `
        <div class="station-card fade-in ${activeStation.name === s.name ? 'active' : ''}" onclick="selectStation('${eName}')">
          <div class="station-image">${s.icon || '📻'}</div>
          <div class="station-details">
            <div class="station-name">${s.name}</div>
            <div class="station-meta"><span class="station-freq">${s.freq} MHz</span><span>•</span><span>${s.city}</span></div>
          </div>
          <div class="fav-btn active" onclick="event.stopPropagation(); toggleFav('${eName}')"><i class="fas fa-heart"></i></div>
        </div>`;
    }).join('');
  }

  // ─── History Tab ──────────────────────────────────────────────────
  function renderHistory() {
    const allStations = DataManager.getSmartRankedStations(stations);
    if (DataManager.listenHistory.length === 0) {
      historyGrid.innerHTML = '<div class="no-results"><i class="fas fa-clock-rotate-left"></i><p>No listening history yet.</p></div>';
      return;
    }
    historyGrid.innerHTML = DataManager.listenHistory.map(h => {
      const s = allStations.find(st => st.name === h.name);
      if (!s) return '';
      const eName = s.name.replace(/'/g, "\\'");
      const ago = timeAgo(h.ts);
      return `
        <div class="station-card fade-in" onclick="selectStation('${eName}')">
          <div class="station-image">${s.icon || '��'}</div>
          <div class="station-details">
            <div class="station-name">${s.name}</div>
            <div class="station-meta"><span class="station-freq">${s.freq} MHz</span><span>•</span><span>${ago}</span></div>
          </div>
        </div>`;
    }).join('');
  }

  function timeAgo(ts) {
    let d = Math.floor((Date.now() - ts) / 1000);
    if (d < 60) return 'Just now';
    if (d < 3600) return Math.floor(d / 60) + 'm ago';
    if (d < 86400) return Math.floor(d / 3600) + 'h ago';
    return Math.floor(d / 86400) + 'd ago';
  }

  // ─── Recently Played Row ──────────────────────────────────────────
  function renderRecentlyPlayed() {
    const recent = DataManager.listenHistory.slice(0, 6);
    if (recent.length === 0) { recentSection.style.display = 'none'; return; }
    recentSection.style.display = 'block';

    const allStations = DataManager.getSmartRankedStations(stations);
    recentRow.innerHTML = recent.map(h => {
      const s = allStations.find(st => st.name === h.name);
      if (!s) return '';
      const eName = s.name.replace(/'/g, "\\'");
      return `
        <div class="recent-chip" onclick="selectStation('${eName}')">
          <div class="rc-icon">${s.icon || '📻'}</div>
          <div><div class="rc-name">${s.name}</div><div class="rc-city">${s.city}</div></div>
        </div>`;
    }).join('');
  }

  // ─── Featured ─────────────────────────────────────────────────────
  function updateFeatured(s) {
    featuredName.innerText = s.name;
    featuredFreq.innerText = s.freq + ' MHz';
    featuredCity.innerText = s.city;
    featuredCard.onclick = () => window.selectStation(s.name);
  }

  // ─── Select Station ───────────────────────────────────────────────
  window.selectStation = (name) => {
    const allStations = DataManager.getSmartRankedStations(stations);
    const s = allStations.find(st => st.name === name);
    if (!s) return;

    activeStation = s;
    playerName.innerText = s.name;
    playerIconEl.innerText = s.icon || '📻';

    localStorage.setItem('vfm_lastStation', s.name);
    addToHistory(s.name);
    renderStations();
    updatePlayerFavIcon();
    updateMediaSession(s);
    UIEngine.applyDynamicTheme(s);

    AudioEngine.playStation(s.stream, s.name);
  };

  window.toggleFav = (name) => toggleFavorite(name);

  function updatePlayerFavIcon() {
    playerFavIcon.className = isFav(activeStation.name) ? 'fas fa-heart' : 'far fa-heart';
    playerFavIcon.style.color = isFav(activeStation.name) ? '#ef4444' : '';
  }

  // ─── Prev / Next Station ──────────────────────────────────────────
  function getFilteredStations() {
    const allStations = DataManager.getSmartRankedStations(stations);
    return allStations.filter(s => currentCategory === 'All' || s.format === currentCategory);
  }

  function prevStation() {
    const list = getFilteredStations();
    const idx = list.findIndex(s => s.name === activeStation.name);
    const prev = idx > 0 ? list[idx - 1] : list[list.length - 1];
    window.selectStation(prev.name);
  }

  function nextStation() {
    const list = getFilteredStations();
    const idx = list.findIndex(s => s.name === activeStation.name);
    const next = idx < list.length - 1 ? list[idx + 1] : list[0];
    window.selectStation(next.name);
  }

  // ─── Sleep Timer ──────────────────────────────────────────────────
  function setSleepTimer(mins) {
    clearTimeout(sleepTimerId);
    clearInterval(sleepInterval);
    if (mins === 0) {
      sleepBadge.style.display = 'none';
      document.getElementById('sleepTimerBtn').classList.remove('active');
      showToast('fa-moon', 'Sleep timer off');
      return;
    }
    sleepRemaining = mins * 60;
    sleepBadge.style.display = 'inline-block';
    sleepBadge.innerText = mins + 'm';
    document.getElementById('sleepTimerBtn').classList.add('active');
    showToast('fa-moon', `Sleep timer: ${mins} min`);

    sleepInterval = setInterval(() => {
      sleepRemaining--;
      let m = Math.floor(sleepRemaining / 60);
      let sec = sleepRemaining % 60;
      sleepBadge.innerText = m > 0 ? m + 'm' : sec + 's';
      if (sleepRemaining <= 0) {
        clearInterval(sleepInterval);
        AudioEngine.togglePlay(activeStation.stream, activeStation.name);
        sleepBadge.style.display = 'none';
        document.getElementById('sleepTimerBtn').classList.remove('active');
        showToast('fa-moon', 'Sleep timer ended — goodnight!');
      }
    }, 1000);
  }

  // ─── Media Session API ────────────────────────────────────────────
  function updateMediaSession(s) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: s.name,
        artist: `${s.city} • ${s.freq} MHz`,
        album: 'Vision FM',
        artwork: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
      navigator.mediaSession.setActionHandler('play', () => AudioEngine.playStation(s.stream, s.name));
      navigator.mediaSession.setActionHandler('pause', () => AudioEngine.togglePlay(s.stream, s.name));
      navigator.mediaSession.setActionHandler('previoustrack', prevStation);
      navigator.mediaSession.setActionHandler('nexttrack', nextStation);
    }
  }

  // ─── Share ────────────────────────────────────────────────────────
  function shareStationSpecific(s) {
    const text = `🎧 Listening to ${s.name} (${s.freq} MHz, ${s.city}) on Vision FM!`;
    const shareData = { title: s.name, text: text, url: window.location.href };
    if (navigator.share) {
      navigator.share(shareData).catch(() => { });
    } else {
      navigator.clipboard.writeText(text).then(() => showToast('fa-copy', 'Copied to clipboard!'));
    }
  }

  function shareStation() {
    shareStationSpecific(activeStation);
  }

  // ─── Bottom Nav Tabs ──────────────────────────────────────────────
  function switchTab(tabId) {
    document.querySelectorAll('.tab-view').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    if (tabId === 'tabFavorites') renderFavorites();
    if (tabId === 'tabHistory') renderHistory();
  }

  // ─── Offline / Online Detection ───────────────────────────────────
  function setupConnectivity() {
    window.addEventListener('offline', () => {
      offlineBanner.classList.add('show');
      showToast('fa-wifi', 'You are offline');
    });
    window.addEventListener('online', () => {
      offlineBanner.classList.remove('show');
      showToast('fa-wifi', 'Back online!');
      if (!isPlaying) {
        setTimeout(() => AudioEngine.playStation(activeStation.stream, activeStation.name), 1000);
      }
    });
  }

  // ─── Swipe Gestures ───────────────────────────────────────────────
  function setupSwipeGestures() {
    let startY = 0;
    player.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
    player.addEventListener('touchend', e => {
      let diff = startY - e.changedTouches[0].clientY;
      if (diff > 60 && !isExpanded) {
        app.classList.add('player-expanded');
        isExpanded = true;
      } else if (diff < -60 && isExpanded) {
        app.classList.remove('player-expanded');
        isExpanded = false;
      }
    }, { passive: true });
  }

  // ─── Service Worker ───────────────────────────────────────────────
  function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then(() => {
        console.log('[VFM] Service Worker registered');
      }).catch(err => console.warn('[VFM] SW failed:', err));
    }
  }

  // ─── Install Prompt ───────────────────────────────────────────────
  function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredInstallPrompt = e;
      if (localStorage.getItem('vfm_installDismissed')) return;
      setTimeout(() => showInstallBanner(), 15000);
    });
  }

  function showInstallBanner() {
    if (!deferredInstallPrompt) return;
    const banner = document.createElement('div');
    banner.className = 'install-prompt';
    banner.innerHTML = `
      <div class="ip-icon"><img src="icon-192.png" alt="VFM"></div>
      <div class="ip-text"><div class="ip-title">Install Vision FM</div><div class="ip-sub">Add to home screen for faster access</div></div>
      <button class="ip-btn" id="installAccept">Install</button>
      <div class="ip-close" id="installDismiss"><i class="fas fa-times"></i></div>`;
    document.body.appendChild(banner);
    document.getElementById('installAccept').onclick = () => {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(() => banner.remove());
    };
    document.getElementById('installDismiss').onclick = () => {
      banner.remove();
      localStorage.setItem('vfm_installDismissed', '1');
    };
  }

  // ─── Event Listeners ──────────────────────────────────────────────
  function setupEventListeners() {
    // Interstitial Ad
    const adOverlay = document.getElementById('adOverlay');
    const closeAdBtn = document.getElementById('closeAdBtn');
    if (closeAdBtn) {
      closeAdBtn.style.display = 'none';
      closeAdBtn.addEventListener('click', () => adOverlay.classList.remove('show'));
    }

    // Search
    searchInput.addEventListener('input', e => { searchQuery = e.target.value; renderStations(); });

    // Categories
    categoryContainer.addEventListener('click', e => {
      if (e.target.classList.contains('pill')) {
        currentCategory = e.target.dataset.category;
        renderCategories();
        renderStations();
      }
    });

    // Player Expand/Collapse
    playerMainInfo.addEventListener('click', () => {
      if (!isExpanded) { app.classList.add('player-expanded'); isExpanded = true; }
    });
    playerClose.addEventListener('click', e => {
      e.stopPropagation();
      app.classList.remove('player-expanded');
      isExpanded = false;
    });

    // Play/Pause
    playBtn.addEventListener('click', e => {
      e.stopPropagation();
      AudioEngine.togglePlay(activeStation.stream, activeStation.name);
    });

    // Prev / Next
    document.getElementById('prevBtn').addEventListener('click', e => { e.stopPropagation(); prevStation(); });
    document.getElementById('nextBtn').addEventListener('click', e => { e.stopPropagation(); nextStation(); });

    // Volume
    volumeSlider.addEventListener('input', e => { AudioEngine.setVolume(e.target.value, activeStation.name); });

    // Shuffle
    document.getElementById('shuffleBtn').addEventListener('click', () => {
      const filtered = getFilteredStations();
      const rand = filtered[Math.floor(Math.random() * filtered.length)];
      window.selectStation(rand.name);
      showToast('fa-shuffle', `Random: ${rand.name}`);
    });

    // Share
    document.getElementById('shareBtn').addEventListener('click', e => { e.stopPropagation(); shareStation(); });

    // Player Favorite
    document.getElementById('playerFavBtn').addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(activeStation.name);
    });

    // Sleep Timer
    document.getElementById('sleepTimerBtn').addEventListener('click', e => {
      e.stopPropagation();
      sleepMenu.classList.toggle('show');
    });
    sleepMenu.addEventListener('click', e => {
      const item = e.target.closest('.sleep-menu-item');
      if (item) {
        setSleepTimer(parseInt(item.dataset.mins));
        sleepMenu.classList.remove('show');
      }
    });

    // Bottom Nav
    bottomNav.addEventListener('click', e => {
      const item = e.target.closest('.nav-item');
      if (item && item.dataset.tab) switchTab(item.dataset.tab);
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); AudioEngine.togglePlay(activeStation.stream, activeStation.name); }
      if (e.code === 'ArrowRight') nextStation();
      if (e.code === 'ArrowLeft') prevStation();
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        let vol = parseFloat(volumeSlider.value);
        vol = Math.min(1, vol + 0.1);
        volumeSlider.value = vol;
        AudioEngine.setVolume(vol, activeStation.name);
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        let vol = parseFloat(volumeSlider.value);
        vol = Math.max(0, vol - 0.1);
        volumeSlider.value = vol;
        AudioEngine.setVolume(vol, activeStation.name);
      }
    });

    // Connectivity & Gestures
    setupConnectivity();
    setupSwipeGestures();
  }

  init();
})();
