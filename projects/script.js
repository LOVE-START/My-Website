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
    
    // 项目页初始化
    initProjectsPage();
    
    // 为每个section添加淡入动画
    animateSections();
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

// 项目页初始化
function initProjectsPage() {
    // 显示当前日期
    const currentDateEl = document.querySelector('.date-content');
    if (currentDateEl) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // 设置遇见的日期
    const firstMetDateEl = document.getElementById('first-met-date');
    if (firstMetDateEl) {
        const today = new Date();
        firstMetDateEl.textContent = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // 为时间线项添加动画
    animateTimelineItems();
    
    // 应用优化样式到所有项目
    applyEnhancedProjectStyles();
}

// 为时间线项添加淡入动画
function animateTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        // 错开时间显示，创建级联效果
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
    
    // 添加时间线点的脉动效果
    const timelineDots = document.querySelectorAll('.timeline-dot');
    timelineDots.forEach((dot) => {
        // 为特殊时间点添加脉动效果
        if (dot.parentElement.classList.contains('timeline-item-special')) {
            setInterval(() => {
                dot.animate([
                    { boxShadow: '0 0 10px var(--alive-color)' },
                    { boxShadow: '0 0 20px var(--alive-color)' },
                    { boxShadow: '0 0 10px var(--alive-color)' }
                ], {
                    duration: 2000,
                    iterations: Infinity
                });
            }, 100);
        }
    });
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

// 为所有项目应用优化样式
function applyEnhancedProjectStyles() {
    // 获取所有时间线项目
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        // 为所有项目添加增强类
        item.classList.add('enhanced-project');
        
        // 调整内容位置使其更靠近时间线
        const content = item.querySelector('.timeline-content');
        if (content) {
            // 根据索引判断奇偶，调整位置
            if (index % 2 === 0) {
                // 偶数项（按照排序后的顺序）
                content.style.left = "25%";
                content.style.width = "48%";
            } else {
                // 奇数项（按照排序后的顺序）
                content.style.right = "25%";
                content.style.width = "48%";
            }
            
            // 突出显示所有标签
            const tags = item.querySelectorAll('.tag');
            tags.forEach(tag => {
                tag.style.fontWeight = "600";
                tag.style.fontSize = "0.85rem";
                
                // 为特定类型的标签添加特殊样式
                if (tag.textContent === "Planning" || tag.textContent === "Start") {
                    tag.style.borderBottom = "2px solid var(--primary-color)";
                    tag.style.padding = "0.35rem 0.9rem";
                } else if (tag.textContent === "Development" || tag.textContent === "Milestone") {
                    tag.style.borderLeft = "2px solid var(--secondary-color)";
                    tag.style.padding = "0.35rem 0.9rem 0.35rem 1rem";
                } else if (tag.textContent === "Special") {
                    // 保持特殊标签的原有样式
                } else {
                    // 其他标签的默认增强样式
                    tag.style.borderRadius = "15px";
                    tag.style.padding = "0.35rem 0.9rem";
                }
            });
        }
        
        // 为特殊项目保留特殊样式
        if (!item.classList.contains('timeline-item-special')) {
            // 调整普通项目的圆点样式
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                dot.style.boxShadow = "0 0 12px var(--glow)";
            }
        }
        
        // 添加交互效果
        addItemInteraction(item);
    });
}

// 为时间线项目添加交互效果
function addItemInteraction(item) {
    const dot = item.querySelector('.timeline-dot');
    const content = item.querySelector('.timeline-content');
    const date = item.querySelector('.timeline-date');
    
    // 鼠标悬停在项目内容上时高亮整个项目
    content.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1.3)';
        dot.style.boxShadow = '0 0 20px var(--glow)';
        date.style.fontWeight = '700';
        date.style.color = 'var(--primary-color)';
        if (item.classList.contains('timeline-item-special')) {
            date.style.color = 'var(--alive-color)';
        }
    });
    
    content.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%)';
        dot.style.boxShadow = '0 0 12px var(--glow)';
        date.style.fontWeight = '500';
        date.style.color = '';
    });
    
    // 鼠标悬停在时间点上时高亮日期和内容
    dot.addEventListener('mouseenter', () => {
        content.style.transform = 'translateY(-5px)';
        content.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        date.style.fontWeight = '700';
        date.style.color = 'var(--primary-color)';
        if (item.classList.contains('timeline-item-special')) {
            date.style.color = 'var(--alive-color)';
        }
    });
    
    dot.addEventListener('mouseleave', () => {
        content.style.transform = '';
        content.style.boxShadow = '';
        date.style.fontWeight = '500';
        date.style.color = '';
    });
} 