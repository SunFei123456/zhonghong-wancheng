// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 初始化AOS动画
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // 初始化轮播图
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    // 导航栏功能
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 移动端菜单切换
    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    // 二级菜单移动端切换
    document.querySelectorAll('.nav-item').forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');

        if (dropdown) {
            link.addEventListener('click', function (e) {
                // 在移动端阻止默认行为，显示下拉菜单
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');

                    // 关闭其他下拉菜单
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        if (menu !== dropdown) {
                            menu.classList.remove('active');
                        }
                    });
                }
            });
        }
    });

    // 搜索功能
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            alert(`搜索: "${query}"

我们会为您提供相关的文化空间建设方案和案例。

建议您也可以直接联系我们的专业顾问获取更精准的信息。`);
            searchInput.value = '';
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 点击其他区域关闭菜单
    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) {
            navMenu.classList.remove('active');
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });

    // 平滑滚动导航
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // 关闭移动端菜单
                navMenu.classList.remove('active');
            }
        });
    });

    console.log('中泓万城官网初始化完成！');

    // 水系统案例轮播
    (function () {
        const track = document.querySelector('.w-cases-track');
        const slides = Array.from(document.querySelectorAll('.w-cases-slide'));
        const prevBtn = document.querySelector('.w-cases-arrow.prev');
        const nextBtn = document.querySelector('.w-cases-arrow.next');
        const dotsContainer = document.querySelector('.w-cases-dots');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;

        // 创建指示点
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

        function updateSlide() {
            slides.forEach((slide, index) => {
                slide.style.display = index === currentIndex ? 'grid' : 'none';
            });
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === slides.length - 1;
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlide();
        }

        prevBtn && prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) goToSlide(currentIndex - 1);
        });

        nextBtn && nextBtn.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
        });

        updateSlide();
    })();

    // 视差滚动（市政施工分节）
    (function () {
        const parallaxSections = Array.from(document.querySelectorAll('.m-parallax .parallax-bg'));
        if (parallaxSections.length === 0) return;

        const onScroll = () => {
            const viewportH = window.innerHeight || document.documentElement.clientHeight;
            parallaxSections.forEach(bg => {
                const rect = bg.parentElement.getBoundingClientRect();
                // 仅当分节进入视口时计算
                if (rect.bottom > 0 && rect.top < viewportH) {
                    const progress = (viewportH - rect.top) / (viewportH + rect.height);
                    // 简洁风：更轻的位移与缩放
                    const translateY = Math.round((progress - 0.5) * 18); // -9px ~ 9px
                    bg.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.03)`;
                    bg.classList.add('is-parallaxing');
                }
            });
        };

        // 初次与滚动/缩放时更新
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
    })();

    // 文化空间案例左右切换交互
    (function () {
        const track = document.querySelector('.cases-track');
        const leftBtn = document.querySelector('.cases-arrow.left');
        const rightBtn = document.querySelector('.cases-arrow.right');
        const cards = Array.from(document.querySelectorAll('.case-card'));

        if (!track || cards.length === 0) return;

        // 将第一个卡片设为 active 并居中
        function setActive(index) {
            cards.forEach((c, i) => c.classList.toggle('active', i === index));
            const card = cards[index];
            const trackRect = track.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            // 计算 scrollLeft 目标：将 card 居中
            const currentScroll = track.scrollLeft;
            const offset = (card.offsetLeft - (track.clientWidth / 2) + (card.clientWidth / 2));
            track.scrollTo({ left: offset, behavior: 'smooth' });
        }

        // 初始化 active
        let activeIndex = 0;
        setActive(activeIndex);

        rightBtn && rightBtn.addEventListener('click', () => {
            activeIndex = Math.min(cards.length - 1, activeIndex + 1);
            setActive(activeIndex);
        });

        leftBtn && leftBtn.addEventListener('click', () => {
            activeIndex = Math.max(0, activeIndex - 1);
            setActive(activeIndex);
        });

        // 点击卡片设置为 active 并居中
        cards.forEach((c, i) => {
            c.addEventListener('click', () => {
                activeIndex = i;
                setActive(activeIndex);
            });
        });

        // 当用户手动滚动时，取最近的卡片为 active（节流）
        let scrollTimer = null;
        track.addEventListener('scroll', () => {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                // 计算距离中心最近的卡片
                const center = track.scrollLeft + track.clientWidth / 2;
                let nearest = 0;
                let minDist = Infinity;
                cards.forEach((card, idx) => {
                    const cardCenter = card.offsetLeft + card.clientWidth / 2;
                    const dist = Math.abs(cardCenter - center);
                    if (dist < minDist) { minDist = dist; nearest = idx; }
                });
                activeIndex = nearest;
                cards.forEach((c, i) => c.classList.toggle('active', i === activeIndex));
            }, 120);
        });
    })();
});

// 案例库模块交互
document.querySelectorAll('.case-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.classList.add('hovered');
    });
    item.addEventListener('mouseleave', () => {
        item.classList.remove('hovered');
    });
});

// ===== 水系统页 - 横向手风琴效果（支持拖拽滑动） =====
(function () {
    const accordion = document.querySelector('.w-accordion');
    const accordionItems = document.querySelectorAll('.w-accordion-item');

    if (!accordion || accordionItems.length === 0) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let clickedItem = null;
    let hasMoved = false;

    // 点击切换
    accordionItems.forEach((item, index) => {
        item.addEventListener('mousedown', function (e) {
            clickedItem = this;
            hasMoved = false;
        });

        item.addEventListener('click', function (e) {
            // 如果拖拽过，不触发点击
            if (hasMoved) return;

            // 移除所有active类
            accordionItems.forEach(i => i.classList.remove('active'));
            // 添加active到当前点击项
            this.classList.add('active');
        });
    });

    // 鼠标拖拽滑动
    accordion.addEventListener('mousedown', function (e) {
        isDragging = true;
        startX = e.pageX - accordion.offsetLeft;
        scrollLeft = accordion.scrollLeft;
        accordion.style.cursor = 'grabbing';
    });

    accordion.addEventListener('mouseleave', function () {
        isDragging = false;
        accordion.style.cursor = 'grab';
    });

    accordion.addEventListener('mouseup', function () {
        isDragging = false;
        accordion.style.cursor = 'grab';
    });

    accordion.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        e.preventDefault();
        hasMoved = true;
        const x = e.pageX - accordion.offsetLeft;
        const walk = (x - startX) * 2; // 滑动速度倍数
        accordion.scrollLeft = scrollLeft - walk;
    });

    // 触摸拖拽滑动
    accordion.addEventListener('touchstart', function (e) {
        isDragging = true;
        startX = e.touches[0].pageX - accordion.offsetLeft;
        scrollLeft = accordion.scrollLeft;
    });

    accordion.addEventListener('touchend', function () {
        isDragging = false;
    });

    accordion.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        hasMoved = true;
        const x = e.touches[0].pageX - accordion.offsetLeft;
        const walk = (x - startX) * 2;
        accordion.scrollLeft = scrollLeft - walk;
    });
})();

// 首页案例轮播筛选功能
(function () {
    const filterBtns = document.querySelectorAll('.cases-filters .pill');
    const caseCards = document.querySelectorAll('.case-card[data-category]');

    if (filterBtns.length === 0 || caseCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // 移除所有active类
            filterBtns.forEach(b => b.classList.remove('active'));
            // 添加active到当前按钮
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // 筛选卡片
            caseCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    // 添加淡入动画
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });

            // 重新初始化轮播位置
            const track = document.querySelector('.cases-track');
            if (track) {
                track.scrollLeft = 0;
            }
        });
    });
})();

// 返回顶部按钮功能
(function () {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;

    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // 点击返回顶部
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

