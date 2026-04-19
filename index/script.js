// 更新当前年份
document.getElementById('current-year').textContent = new Date().getFullYear();

// 页面加载时执行
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initParticles();
    setupNavbar();
    initHomePage();
    animateSections();
    initVinylPlayer();
    createStars();
    
    if (typeof GlobalMusicPlayer !== 'undefined') {
        GlobalMusicPlayer.init();
    }
});

// 黑胶唱片播放器模块
function initVinylPlayer() {
    const player = document.getElementById('vinylPlayer');
    const record = document.getElementById('vinylRecord');
    const label = document.getElementById('vinylLabel');
    const playBtn = document.getElementById('vinylPlayBtn');
    const status = document.getElementById('vinylStatus');
    const audio = document.getElementById('bgMusic');
    const moonCatPlaceholder = document.getElementById('moonCatPlaceholder');
    
    if (!player) return;

    const labelImg = document.createElement('img');
    labelImg.src = '../assets/images/moon-cat.png';
    labelImg.alt = 'Now Playing';
    labelImg.className = 'vinyl-label-img';
    label.appendChild(labelImg);

    function togglePlay(e) {
        if (e) e.stopPropagation();
        
        if (typeof GlobalMusicPlayer !== 'undefined') {
            const state = GlobalMusicPlayer.getState();
            if (state.isPlaying) {
                GlobalMusicPlayer.pause();
            } else {
                GlobalMusicPlayer.play();
            }
        }
    }

    playBtn.addEventListener('click', togglePlay);
    player.addEventListener('click', togglePlay);
    
    if (moonCatPlaceholder) {
        moonCatPlaceholder.addEventListener('click', togglePlay);
        moonCatPlaceholder.title = '点击播放音乐';
    }

    if (audio) {
        audio.addEventListener('ended', () => {
            record.classList.remove('playing');
            player.classList.remove('playing');
            player.classList.remove('visible');
            label.classList.remove('playing');
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            status.textContent = 'Click to Play';
            if (moonCatPlaceholder) {
                moonCatPlaceholder.classList.remove('hidden');
            }
        });
    }
}

/**
 * 同步图片和播放器的显示状态
 * @param {boolean} isPlaying - 是否正在播放
 */
function syncMoonCatVisibility(isPlaying) {
    const player = document.getElementById('vinylPlayer');
    const moonCatPlaceholder = document.getElementById('moonCatPlaceholder');
    
    if (isPlaying) {
        if (player) player.classList.add('visible');
        if (moonCatPlaceholder) moonCatPlaceholder.classList.add('hidden');
    } else {
        if (player) player.classList.remove('visible');
        if (moonCatPlaceholder) moonCatPlaceholder.classList.remove('hidden');
    }
}

// 初始化主题
function initTheme() {
    // 获取保存的主题偏好
    const savedTheme = localStorage.getItem('theme');
    
    // 如果存在保存的主题，应用它
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // 设置主题切换按钮
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // 切换主题类
            document.body.classList.toggle('dark-theme');
            
            // 保存主题偏好到localStorage
            const isDarkTheme = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
            
            // 重新初始化粒子效果以适应新主题
            initParticles();
        });
    }
}

// 首页初始化
function initHomePage() {
    // 显示当前日期
    const currentDateEl = document.getElementById('current-date');
    if (currentDateEl) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = now.toLocaleDateString('en-US', options);
    }
}

// 为section添加动画
function animateSections() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // 错开时间显示，创建级联效果
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 300 * (index + 1));
    });
}

// 设置导航栏交互
function setupNavbar() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // 点击导航项关闭菜单
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 在滚动时添加背景颜色渐变
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        
        if (window.scrollY > 50) {
            if (isDarkTheme) {
                navbar.style.background = 'rgba(15, 15, 26, 0.9)';
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.background = 'rgba(252, 241, 230, 0.9)';
                navbar.style.boxShadow = '0 5px 20px rgba(226, 178, 148, 0.2)';
            }
        } else {
            if (isDarkTheme) {
                navbar.style.background = 'rgba(15, 15, 26, 0.8)';
            } else {
                navbar.style.background = 'rgba(252, 241, 230, 0.8)';
            }
            navbar.style.boxShadow = 'none';
        }
    });
}

// 获取当前主题的颜色值
function getThemeColors() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    if (isDarkTheme) {
        return {
            particles: ['#6c63ff', '#ff6b95'],
            lines: '#6c63ff',
            speed: 0.5,
            particleCount: 35,
            opacity: 0.4,
            size: 3,
            mode: 'grab',
            lineOpacity: 0.08,
            lineWidth: 0.5
        };
    } else {
        return {
            particles: ['#f5a88e', '#e8a5c1'],
            lines: '#f5a88e',
            speed: 0.4,
            particleCount: 25,
            opacity: 0.25,
            size: 3,
            mode: 'bubble',
            lineOpacity: 0.1,
            lineWidth: 0.5
        };
    }
}

// 初始化粒子背景
function initParticles() {
    if (!window.particlesJS) return;
    
    // 获取当前主题的颜色配置
    const themeColors = getThemeColors();
    
    particlesJS('particles-js', {
        particles: {
            number: {
                value: themeColors.particleCount,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: themeColors.particles
            },
            shape: {
                type: ['circle', 'star'],
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: themeColors.opacity,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: themeColors.size,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: themeColors.speed,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: themeColors.mode
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.6
                    }
                },
                bubble: {
                    distance: 150,
                    size: 6,
                    duration: 2,
                    opacity: 0.5,
                    speed: 3
                },
                push: {
                    particles_nb: 3
                }
            }
        },
        retina_detect: true
    });
}

// 创建星星效果
function createStars() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;
    
    // 创建5-8颗星星
    const starsCount = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // 随机位置
        const posX = Math.floor(Math.random() * 100);
        const posY = Math.floor(Math.random() * 100);
        
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        
        // 随机大小
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        heroVisual.appendChild(star);
    }
} 