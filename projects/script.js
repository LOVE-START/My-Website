/**
 * Projects Page - 时间线展示模块
 * 功能：数据驱动的时间线渲染、主题切换、粒子背景、导航交互
 * 架构：配置分离、事件驱动、内存安全
 */

(function() {
    'use strict';

    // ============================================
    // 配置区域 - 所有可配置项集中管理
    // ============================================
    
    const CONFIG = {
        selectors: {
            timeline: '#timeline',
            currentDate: '.date-content',
            currentYear: '#current-year',
            themeToggle: '#themeToggle',
            navToggle: '#navToggle',
            navMenu: '.nav-menu',
            navbar: '.navbar',
            particlesContainer: '#particles-js'
        },
        
        animation: {
            fadeInDelay: 200,
            sectionDelay: 300,
            pulseDuration: 2000
        }
    };

    // 时间线数据配置 - 易于维护和扩展
    const TIMELINE_DATA = [
        {
            id: 'nfunest-complete',
            title: 'NFUNest - Development Complete',
            date: '2026-02-18',
            description: 'Successfully completed NFUNest, a smart dormitory management platform. Features include room allocation, roommate matching, facility booking, and community interaction for campus housing.',
            tags: ['milestone', 'development'],
            type: 'milestone'
        },
        {
            id: 'nfunest-launch',
            title: 'NFUNest - Project Launch',
            date: '2025-11-15',
            description: 'Initiated development of NFUNest, aiming to revolutionize campus housing experience with smart management solutions and community features.',
            tags: ['start', 'planning'],
            type: 'start'
        },
        {
            id: 'nfuyummy-complete',
            title: 'NFUYummy - Development Complete',
            date: '2025-10-06',
            description: 'Completed NFUyummy, a campus food delivery and restaurant discovery platform. Implemented real-time ordering, menu browsing, and review system.',
            tags: ['milestone', 'development'],
            type: 'milestone'
        },
        {
            title: 'NFUYummy - Project Launch',
            date: '2025-05-15',
            description: 'Started development of NFUyummy, a platform designed to connect students with campus dining options and food delivery services.',
            tags: ['start', 'planning'],
            type: 'start'
        },
        {
            id: 'nfucourse-complete',
            title: 'NFUCourse - Development Complete',
            date: '2025-04-02',
            description: 'Successfully completed the development of the NFUCourse project. Implemented all planned features and conducted thorough testing.',
            tags: ['milestone', 'development'],
            type: 'milestone'
        },
        {
            id: 'nfucourse-launch',
            title: 'NFUCourse - Project Launch',
            date: '2025-03-06',
            description: 'Officially began development of the NFUCourse project. Set up the development environment and created the initial project structure.',
            tags: ['start', 'planning'],
            type: 'start'
        },
        {
            id: 'special-meeting',
            title: 'I Met You',
            date: 'today',
            description: 'The day everything changed. A new journey begins.',
            tags: ['special'],
            type: 'special'
        }
    ];

    // 标签类型配置 - 支持自定义样式
    const TAG_CONFIG = {
        milestone: { label: 'Milestone', class: 'tag-milestone' },
        development: { label: 'Development', class: 'tag-development' },
        start: { label: 'Start', class: 'tag-start' },
        planning: { label: 'Planning', class: 'tag-planning' },
        special: { label: 'Special', class: 'tag-special' }
    };

    // ============================================
    // 状态管理
    // ============================================
    
    const State = {
        animationFrames: new Set(),
        intervals: new Set(),
        isInitialized: false
    };

    // ============================================
    // 工具函数
    // ============================================
    
    /**
     * 解析日期字符串
     * @param {string} dateStr - 日期字符串或 'today'
     * @returns {Date} 解析后的日期对象
     */
    function parseDate(dateStr) {
        return dateStr === 'today' ? new Date() : new Date(dateStr);
    }

    /**
     * 格式化日期显示
     * @param {Date} date - 日期对象
     * @returns {string} 格式化后的日期字符串
     */
    function formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    /**
     * 安全添加事件监听器
     * @param {Element} element - DOM 元素
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理函数
     */
    function addSafeListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    /**
     * 清理所有动画资源
     */
    function cleanupAnimations() {
        State.animationFrames.forEach(id => cancelAnimationFrame(id));
        State.animationFrames.clear();
        
        State.intervals.forEach(id => clearInterval(id));
        State.intervals.clear();
    }

    // ============================================
    // 时间线渲染模块
    // ============================================
    
    const TimelineRenderer = {
        /**
         * 渲染时间线
         * @param {Array} data - 时间线数据
         */
        render(data) {
            const container = document.querySelector(CONFIG.selectors.timeline);
            if (!container) return;

            const sortedData = this.sortByDate(data);
            container.innerHTML = '';
            
            sortedData.forEach((item, index) => {
                const element = this.createItem(item, index);
                container.appendChild(element);
            });
        },

        /**
         * 按日期倒序排列
         * @param {Array} data - 原始数据
         * @returns {Array} 排序后的数据
         */
        sortByDate(data) {
            return [...data].sort((a, b) => {
                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);
                return dateB - dateA;
            });
        },

        /**
         * 创建单个时间线项目
         * @param {Object} item - 项目数据
         * @param {number} index - 项目索引
         * @returns {HTMLElement} 项目元素
         */
        createItem(item, index) {
            const element = document.createElement('div');
            const isSpecial = item.type === 'special';
            
            element.className = `timeline-item${isSpecial ? ' timeline-item-special' : ''}`;
            element.dataset.type = item.type;
            element.dataset.index = index;

            const date = parseDate(item.date);
            
            element.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-date">${formatDate(date)}</div>
                <div class="timeline-content">
                    <h3>${this.escapeHtml(item.title)}</h3>
                    <p>${this.escapeHtml(item.description)}</p>
                    <div class="timeline-tags">
                        ${this.renderTags(item.tags, isSpecial)}
                    </div>
                </div>
            `;

            return element;
        },

        /**
         * 渲染标签
         * @param {Array} tags - 标签数组
         * @param {boolean} isSpecial - 是否为特殊项目
         * @returns {string} HTML 字符串
         */
        renderTags(tags, isSpecial) {
            return tags.map(tagKey => {
                const config = TAG_CONFIG[tagKey] || { label: tagKey, class: '' };
                const specialClass = isSpecial ? ' tag-special' : '';
                return `<span class="tag ${config.class}${specialClass}">${config.label}</span>`;
            }).join('');
        },

        /**
         * HTML 转义防止 XSS
         * @param {string} str - 原始字符串
         * @returns {string} 转义后的字符串
         */
        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    };

    // ============================================
    // 动画模块
    // ============================================
    
    const AnimationController = {
        /**
         * 初始化时间线动画
         */
        initTimelineAnimations() {
            const items = document.querySelectorAll('.timeline-item');
            
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, CONFIG.animation.fadeInDelay * (index + 1));
            });

            this.initSpecialDotPulse();
        },

        /**
         * 特殊时间点脉动效果 - 使用 requestAnimationFrame
         */
        initSpecialDotPulse() {
            const specialDots = document.querySelectorAll('.timeline-item-special .timeline-dot');
            
            specialDots.forEach(dot => {
                this.animatePulse(dot);
            });
        },

        /**
         * 脉动动画
         * @param {Element} dot - 时间点元素
         */
        animatePulse(dot) {
            let startTime = null;
            const duration = CONFIG.animation.pulseDuration;

            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = (timestamp - startTime) % duration;
                const phase = progress / duration;
                
                const glow = 10 + Math.sin(phase * Math.PI * 2) * 10;
                dot.style.boxShadow = `0 0 ${glow}px var(--alive-color)`;
                
                const frameId = requestAnimationFrame(animate);
                State.animationFrames.add(frameId);
            };

            const frameId = requestAnimationFrame(animate);
            State.animationFrames.add(frameId);
        },

        /**
         * Section 淡入动画
         */
        initSectionAnimations() {
            const sections = document.querySelectorAll('section');
            
            sections.forEach((section, index) => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, CONFIG.animation.sectionDelay * (index + 1));
            });
        }
    };

    // ============================================
    // 交互模块
    // ============================================
    
    const InteractionController = {
        /**
         * 初始化所有交互
         */
        init() {
            this.initItemInteractions();
        },

        /**
         * 时间线项目交互效果
         */
        initItemInteractions() {
            const items = document.querySelectorAll('.timeline-item');
            
            items.forEach(item => {
                const dot = item.querySelector('.timeline-dot');
                const content = item.querySelector('.timeline-content');
                const date = item.querySelector('.timeline-date');
                const isSpecial = item.classList.contains('timeline-item-special');

                if (!dot || !content || !date) return;

                content.addEventListener('mouseenter', () => {
                    dot.style.transform = 'translate(-50%, -50%) scale(1.3)';
                    dot.style.boxShadow = '0 0 20px var(--glow)';
                    date.style.fontWeight = '700';
                    date.style.color = isSpecial ? 'var(--alive-color)' : 'var(--primary-color)';
                });

                content.addEventListener('mouseleave', () => {
                    dot.style.transform = 'translate(-50%, -50%)';
                    dot.style.boxShadow = '';
                    date.style.fontWeight = '';
                    date.style.color = '';
                });

                dot.addEventListener('mouseenter', () => {
                    content.style.transform = 'translateY(-5px)';
                    content.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                    date.style.fontWeight = '700';
                    date.style.color = isSpecial ? 'var(--alive-color)' : 'var(--primary-color)';
                });

                dot.addEventListener('mouseleave', () => {
                    content.style.transform = '';
                    content.style.boxShadow = '';
                    date.style.fontWeight = '';
                    date.style.color = '';
                });
            });
        }
    };

    // ============================================
    // 主题模块
    // ============================================
    
    const ThemeController = {
        /**
         * 初始化主题
         */
        init() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
            }

            addSafeListener(
                document.querySelector(CONFIG.selectors.themeToggle),
                'click',
                () => this.toggle()
            );
        },

        /**
         * 切换主题
         */
        toggle() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            ParticlesController.refresh();
        }
    };

    // ============================================
    // 导航模块
    // ============================================
    
    const NavigationController = {
        /**
         * 初始化导航
         */
        init() {
            const navToggle = document.querySelector(CONFIG.selectors.navToggle);
            const navMenu = document.querySelector(CONFIG.selectors.navMenu);

            addSafeListener(navToggle, 'click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            document.querySelectorAll('.nav-item').forEach(item => {
                addSafeListener(item, 'click', () => {
                    navToggle?.classList.remove('active');
                    navMenu?.classList.remove('active');
                });
            });

            this.initScrollEffect();
        },

        /**
         * 滚动效果
         */
        initScrollEffect() {
            const navbar = document.querySelector(CONFIG.selectors.navbar);
            if (!navbar) return;

            window.addEventListener('scroll', () => {
                const isDark = document.body.classList.contains('dark-theme');
                const scrolled = window.scrollY > 50;

                if (scrolled) {
                    navbar.style.background = isDark 
                        ? 'rgba(15, 15, 26, 0.9)' 
                        : 'rgba(252, 241, 230, 0.9)';
                    navbar.style.boxShadow = isDark 
                        ? '0 5px 20px rgba(0, 0, 0, 0.2)' 
                        : '0 5px 20px rgba(226, 178, 148, 0.2)';
                } else {
                    navbar.style.background = isDark 
                        ? 'rgba(15, 15, 26, 0.8)' 
                        : 'rgba(252, 241, 230, 0.8)';
                    navbar.style.boxShadow = 'none';
                }
            });
        }
    };

    // ============================================
    // 粒子背景模块
    // ============================================
    
    const ParticlesController = {
        /**
         * 获取主题颜色配置
         * @returns {Object} 颜色配置
         */
        getThemeColors() {
            const isDark = document.body.classList.contains('dark-theme');
            
            return isDark ? {
                particles: ['#6c63ff', '#ff6b95', '#43cbff', '#36f1cd'],
                speed: 1.2,
                count: 100,
                opacity: 0.6,
                size: 3.5,
                mode: 'grab'
            } : {
                particles: ['#f5a88e', '#e8a5c1', '#f5d5c6', '#c17f91'],
                speed: 0.8,
                count: 70,
                opacity: 0.3,
                size: 4,
                mode: 'bubble'
            };
        },

        /**
         * 初始化粒子背景
         */
        init() {
            if (!window.particlesJS) return;

            const colors = this.getThemeColors();

            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: colors.count,
                        density: { enable: true, value_area: 800 }
                    },
                    color: { value: colors.particles },
                    shape: {
                        type: ['circle', 'star'],
                        stroke: { width: 0, color: '#000000' },
                        polygon: { nb_sides: 5 }
                    },
                    opacity: {
                        value: colors.opacity,
                        random: true,
                        anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
                    },
                    size: {
                        value: colors.size,
                        random: true,
                        anim: { enable: true, speed: 1, size_min: 0.1, sync: false }
                    },
                    line_linked: { enable: false },
                    move: {
                        enable: true,
                        speed: colors.speed,
                        direction: 'none',
                        random: true,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: { enable: true, rotateX: 600, rotateY: 1200 }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: colors.mode },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 140, line_linked: { opacity: 0.6 } },
                        bubble: { distance: 150, size: 6, duration: 2, opacity: 0.5, speed: 3 },
                        push: { particles_nb: 3 }
                    }
                },
                retina_detect: true
            });
        },

        /**
         * 刷新粒子背景
         */
        refresh() {
            this.init();
        }
    };

    // ============================================
    // 页面初始化
    // ============================================
    
    const App = {
        /**
         * 初始化应用
         */
        init() {
            if (State.isInitialized) return;
            State.isInitialized = true;

            this.updateCurrentYear();
            this.updateCurrentDate();
            
            TimelineRenderer.render(TIMELINE_DATA);
            
            ThemeController.init();
            ParticlesController.init();
            NavigationController.init();
            
            AnimationController.initTimelineAnimations();
            AnimationController.initSectionAnimations();
            
            InteractionController.init();

            window.addEventListener('beforeunload', cleanupAnimations);
        },

        /**
         * 更新当前年份
         */
        updateCurrentYear() {
            const yearEl = document.querySelector(CONFIG.selectors.currentYear);
            if (yearEl) {
                yearEl.textContent = new Date().getFullYear();
            }
        },

        /**
         * 更新当前日期显示
         */
        updateCurrentDate() {
            const dateEl = document.querySelector(CONFIG.selectors.currentDate);
            if (dateEl) {
                const now = new Date();
                dateEl.textContent = formatDate(now);
            }
        }
    };

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

    // 暴露 API 供外部使用（可选）
    window.ProjectsPage = {
        addTimelineItem: (item) => {
            TIMELINE_DATA.push(item);
            TimelineRenderer.render(TIMELINE_DATA);
            AnimationController.initTimelineAnimations();
            InteractionController.init();
        },
        removeTimelineItem: (id) => {
            const index = TIMELINE_DATA.findIndex(item => item.id === id);
            if (index > -1) {
                TIMELINE_DATA.splice(index, 1);
                TimelineRenderer.render(TIMELINE_DATA);
            }
        },
        getTimelineData: () => [...TIMELINE_DATA]
    };

})();
