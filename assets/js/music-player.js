/**
 * 全局音乐播放器模块
 * 实现跨页面的音乐播放状态同步
 */

const GlobalMusicPlayer = (function() {
    const STORAGE_KEY = 'musicPlayerState';
    const AUDIO_SRC = 'assets/beloved.mp3';
    
    let audio = null;
    let isInitialized = false;
    let updateInterval = null;
    let pendingSeekTime = null;

    function init() {
        if (isInitialized) return;
        
        createAudioElement();
        createPlayerUI();
        setupEventListeners();
        restoreState();
        startSync();
        
        isInitialized = true;
    }

    function createAudioElement() {
        audio = document.getElementById('bgMusic') || document.getElementById('globalBgMusic');
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'globalBgMusic';
            audio.preload = 'auto';
            audio.innerHTML = `<source src="${AUDIO_SRC}" type="audio/mpeg">`;
            document.body.appendChild(audio);
        }
    }

    function createPlayerUI() {
        const existingPlayer = document.querySelector('.music-player');
        if (existingPlayer) return;

        const playerHTML = `
            <div class="music-player" id="globalMusicPlayer">
                <div class="music-player-indicator"></div>
                <button class="music-player-btn" id="globalPlayBtn" title="播放/暂停">
                    <i class="fas fa-play"></i>
                </button>
                <div class="music-player-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="music-player-info">
                    <div class="music-player-title">be loved</div>
                    <div class="music-player-time">
                        <span id="globalCurrentTime">0:00</span>
                        <span>/</span>
                        <span id="globalDuration">0:00</span>
                    </div>
                </div>
                <div class="music-player-progress" id="globalProgress">
                    <div class="music-player-progress-bar" id="globalProgressBar"></div>
                    <div class="music-player-progress-glow"></div>
                </div>
                <button class="music-player-close" id="globalCloseBtn" title="关闭">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            const playerWrapper = document.createElement('div');
            playerWrapper.className = 'nav-player-wrapper';
            playerWrapper.innerHTML = playerHTML;
            
            const navToggle = navContainer.querySelector('.nav-toggle');
            if (navToggle) {
                navContainer.insertBefore(playerWrapper, navToggle);
            } else {
                navContainer.appendChild(playerWrapper);
            }
        }
    }

    function restoreState() {
        const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        
        if (state.isPlaying) {
            showPlayer();
            updatePlayButton(false);
            syncWithVinylPlayer(true);
            
            pendingSeekTime = state.currentTime || 0;
            
            if (audio.readyState >= 1) {
                audio.currentTime = pendingSeekTime;
            }
            
            audio.play().catch(err => {
                console.log('自动播放需要用户交互:', err);
                updatePlayButton(true);
            });
        }
    }

    function saveState() {
        if (!audio) return;
        
        const state = {
            isPlaying: !audio.paused,
            currentTime: audio.currentTime,
            duration: audio.duration,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function setupEventListeners() {
        document.addEventListener('click', function(e) {
            if (e.target.closest('#globalPlayBtn')) {
                e.preventDefault();
                e.stopPropagation();
                togglePlay();
            }
            
            if (e.target.closest('#globalCloseBtn')) {
                e.preventDefault();
                e.stopPropagation();
                stopAndHide();
            }
            
            if (e.target.closest('#globalProgress')) {
                e.preventDefault();
                e.stopPropagation();
                seekTo(e);
            }
        }, true);

        if (audio) {
            audio.addEventListener('timeupdate', updateProgress);
            
            audio.addEventListener('loadedmetadata', () => {
                updateDuration();
                if (pendingSeekTime !== null && audio.duration) {
                    audio.currentTime = Math.min(pendingSeekTime, audio.duration);
                    pendingSeekTime = null;
                }
            });
            
            audio.addEventListener('canplay', () => {
                if (pendingSeekTime !== null && audio.duration) {
                    audio.currentTime = Math.min(pendingSeekTime, audio.duration);
                    pendingSeekTime = null;
                }
            });
            
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('play', handlePlay);
            audio.addEventListener('pause', handlePause);
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    function togglePlay() {
        if (!audio) return;
        
        if (audio.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    }

    function playAudio() {
        if (!audio) return;
        
        audio.play().then(() => {
            showPlayer();
            updatePlayButton(false);
            saveState();
            syncWithVinylPlayer(true);
        }).catch(err => {
            console.error('播放错误:', err);
        });
    }

    function pauseAudio() {
        if (!audio) return;
        
        audio.pause();
        updatePlayButton(true);
        saveState();
        syncWithVinylPlayer(false);
    }

    function stopAndHide() {
        if (!audio) return;
        
        audio.pause();
        audio.currentTime = 0;
        pendingSeekTime = null;
        hidePlayer();
        localStorage.removeItem(STORAGE_KEY);
        syncWithVinylPlayer(false);
    }

    function showPlayer() {
        const player = document.getElementById('globalMusicPlayer');
        if (player) {
            player.classList.add('visible');
        }
    }

    function hidePlayer() {
        const player = document.getElementById('globalMusicPlayer');
        if (player) {
            player.classList.remove('visible');
        }
    }

    function updatePlayButton(isPaused) {
        const playBtn = document.getElementById('globalPlayBtn');
        const player = document.getElementById('globalMusicPlayer');
        
        if (playBtn) {
            playBtn.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
        }
        
        if (player) {
            if (isPaused) {
                player.classList.add('paused');
            } else {
                player.classList.remove('paused');
            }
        }
    }

    function updateProgress() {
        if (!audio) return;
        
        const progress = document.getElementById('globalProgressBar');
        const currentTimeEl = document.getElementById('globalCurrentTime');
        
        if (progress && audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = `${percent}%`;
        }
        
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    }

    function updateDuration() {
        const durationEl = document.getElementById('globalDuration');
        if (durationEl && audio) {
            durationEl.textContent = formatTime(audio.duration);
        }
    }

    function seekTo(e) {
        if (!audio || !audio.duration) return;
        
        const progress = document.getElementById('globalProgress');
        if (!progress) return;
        
        const rect = progress.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = percent * audio.duration;
        saveState();
    }

    function handleEnded() {
        updatePlayButton(true);
        localStorage.removeItem(STORAGE_KEY);
        syncWithVinylPlayer(false);
    }

    function handlePlay() {
        updatePlayButton(false);
        showPlayer();
        saveState();
    }

    function handlePause() {
        updatePlayButton(true);
        saveState();
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            saveState();
        }
    }

    function startSync() {
        if (updateInterval) clearInterval(updateInterval);
        updateInterval = setInterval(saveState, 1000);
    }

    function syncWithVinylPlayer(isPlaying) {
        const vinylPlayer = document.getElementById('vinylPlayer');
        const vinylRecord = document.getElementById('vinylRecord');
        const vinylLabel = document.getElementById('vinylLabel');
        const vinylPlayBtn = document.getElementById('vinylPlayBtn');
        const vinylStatus = document.getElementById('vinylStatus');
        const moonCatPlaceholder = document.getElementById('moonCatPlaceholder');

        if (vinylPlayer && vinylRecord) {
            if (isPlaying) {
                vinylPlayer.classList.add('playing');
                vinylPlayer.classList.add('visible');
                vinylRecord.classList.add('playing');
                if (vinylLabel) vinylLabel.classList.add('playing');
                if (vinylPlayBtn) vinylPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                if (vinylStatus) vinylStatus.textContent = 'Now Playing...';
                if (moonCatPlaceholder) moonCatPlaceholder.classList.add('hidden');
            } else {
                vinylPlayer.classList.remove('playing');
                vinylPlayer.classList.remove('visible');
                vinylRecord.classList.remove('playing');
                if (vinylLabel) vinylLabel.classList.remove('playing');
                if (vinylPlayBtn) vinylPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                if (vinylStatus) vinylStatus.textContent = 'Paused';
                if (moonCatPlaceholder) moonCatPlaceholder.classList.remove('hidden');
            }
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function triggerPlay() {
        playAudio();
    }

    function triggerPause() {
        pauseAudio();
    }

    function getState() {
        return {
            isPlaying: audio ? !audio.paused : false,
            currentTime: audio ? audio.currentTime : 0,
            duration: audio ? audio.duration : 0
        };
    }

    return {
        init,
        play: triggerPlay,
        pause: triggerPause,
        toggle: togglePlay,
        getState,
        showPlayer,
        hidePlayer
    };
})();

if (typeof window !== 'undefined') {
    window.GlobalMusicPlayer = GlobalMusicPlayer;
}
