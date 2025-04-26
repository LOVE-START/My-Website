// 设置出生日期
const birthDate = new Date('2004-03-19T00:00:00');

// 更新当前年份
document.getElementById('current-year').textContent = new Date().getFullYear();

// 页面加载时执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子背景
    initParticles();
    
    // 导航栏交互
    setupNavbar();
    
    // About页初始化
    initAboutPage();
    
    // 为每个section添加淡入动画
    animateSections();
    
    // 设置复制到剪贴板功能
    setupClipboard();
});

// About页初始化
function initAboutPage() {
    // 计算并显示生命计时器
    updateLifeTimer();
    
    // 每小时更新一次计时器
    setInterval(updateLifeTimer, 1000 * 60 * 60);
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

// 计算生命时间函数
function updateLifeTimer() {
    const yearsEl = document.getElementById('years');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    
    if (!yearsEl || !daysEl || !hoursEl) return;
    
    const now = new Date();
    
    // 计算年份差异
    let years = now.getFullYear() - birthDate.getFullYear();
    
    // 检查是否已经过了今年的生日
    if (
        now.getMonth() < birthDate.getMonth() || 
        (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())
    ) {
        years--;
    }
    
    // 创建当前年份的生日日期用于计算剩余天数
    const birthdayThisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // 如果今年的生日已经过了，使用明年的生日日期
    if (now > birthdayThisYear) {
        birthdayThisYear.setFullYear(birthdayThisYear.getFullYear() + 1);
    }
    
    // 计算自上次生日以来的总毫秒数
    const lastBirthday = new Date(birthdayThisYear);
    lastBirthday.setFullYear(lastBirthday.getFullYear() - 1);
    
    // 计算自上次生日到现在的时间差
    const diff = now - lastBirthday;
    
    // 计算天数和小时
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    // 更新DOM元素
    yearsEl.textContent = years;
    daysEl.textContent = days;
    hoursEl.textContent = hours;
    
    // 添加数字变化的动画效果
    animateValue(yearsEl, years);
    animateValue(daysEl, days);
    animateValue(hoursEl, hours);
}

// 为数字变化添加动画效果
function animateValue(element, newValue) {
    const currentValue = parseInt(element.getAttribute('data-value') || '0');
    
    // 如果值没有变化，不执行动画
    if (currentValue === newValue) return;
    
    // 存储新值作为属性
    element.setAttribute('data-value', newValue);
    
    // 添加缩放动画
    element.style.transform = 'scale(1.2)';
    element.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
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
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 26, 0.9)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = 'rgba(15, 15, 26, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// 为复制到剪贴板功能进行设置
function setupClipboard() {
    const contactItems = document.querySelectorAll('.contact-item[data-clipboard]');
    
    contactItems.forEach(item => {
        item.addEventListener('click', async () => {
            const textToCopy = item.getAttribute('data-clipboard');
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // 添加复制成功的视觉反馈
                item.classList.add('copied');
                
                // 2秒后移除复制成功的样式
                setTimeout(() => {
                    item.classList.remove('copied');
                }, 2000);
                
                // 添加复制成功的反馈动画
                const icon = item.querySelector('.icon i');
                icon.style.transform = 'scale(1.3) rotate(10deg)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 500);
                
            } catch (err) {
                console.error('复制失败: ', err);
            }
        });
    });
}

// 初始化粒子背景
function initParticles() {
    if (!window.particlesJS) return;
    
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#6c63ff', '#ff6b95', '#43cbff', '#36f1cd']
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#6c63ff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
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
                    mode: 'grab'
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
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
} 