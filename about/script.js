// 设置出生日期
const birthDate = new Date('2004-03-19T00:00:00');

// 更新当前年份
document.getElementById('current-year').textContent = new Date().getFullYear();

// 页面加载时执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题
    initTheme();
    
    // 初始化粒子背景
    initParticles();
    
    // 导航栏交互
    setupNavbar();
    
    // 生命计时器初始化
    initLifeCounter();
    
    // 初始化复制功能
    initClipboard();
});

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
            particles: ['#6c63ff', '#ff6b95', '#43cbff', '#36f1cd'],
            lines: '#6c63ff',
            speed: 1.2,
            particleCount: 80,
            opacity: 0.6,
            size: 3.5,
            mode: 'grab',
            lineOpacity: 0.15,
            lineWidth: 0.8
        };
    } else {
        return {
            particles: ['#f5a88e', '#e8a5c1', '#f5d5c6', '#c17f91'],
            lines: '#f5a88e',
            speed: 0.8,
            particleCount: 50,
            opacity: 0.3,
            size: 4,
            mode: 'bubble',
            lineOpacity: 0.2,
            lineWidth: 1
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
                enable: true,
                distance: 150,
                color: themeColors.lines,
                opacity: themeColors.lineOpacity,
                width: themeColors.lineWidth
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

// 生命计时器初始化
function initLifeCounter() {
    const birthday = new Date('2004-03-19');
    const yearsSpan = document.getElementById('years');
    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    
    function updateCounter() {
        const now = new Date();
        const diff = now - birthday;
        const years = diff / (1000 * 60 * 60 * 24 * 365.25);
        const days = (years - Math.floor(years)) * 365.25;
        const hours = (days - Math.floor(days)) * 24;
        
        yearsSpan.textContent = Math.floor(years);
        daysSpan.textContent = Math.floor(days);
        hoursSpan.textContent = Math.floor(hours);
        
        setTimeout(updateCounter, 60000); // 每分钟更新一次
    }
    
    updateCounter();
}

// 初始化复制功能
function initClipboard() {
    const clipboardItems = document.querySelectorAll('[data-clipboard]');
    
    clipboardItems.forEach(item => {
        item.addEventListener('click', () => {
            const text = item.getAttribute('data-clipboard');
            navigator.clipboard.writeText(text)
                .then(() => {
                    // 显示复制成功的提示
                    const indicator = item.querySelector('.copy-indicator');
                    if (indicator) {
                        indicator.classList.add('active');
                        setTimeout(() => {
                            indicator.classList.remove('active');
                        }, 2000);
                    }
                });
        });
    });
} 