// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
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
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 移动端菜单切换
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // 二级菜单移动端切换
    document.querySelectorAll('.nav-item').forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');
        
        if (dropdown) {
            link.addEventListener('click', function(e) {
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
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 点击其他区域关闭菜单
    document.addEventListener('click', function(e) {
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

    // 文化空间案例左右切换交互
    (function(){
        const track = document.querySelector('.cases-track');
        const leftBtn = document.querySelector('.cases-arrow.left');
        const rightBtn = document.querySelector('.cases-arrow.right');
        const cards = Array.from(document.querySelectorAll('.case-card'));

        if (!track || cards.length === 0) return;

        // 将第一个卡片设为 active 并居中
        function setActive(index){
            cards.forEach((c,i)=> c.classList.toggle('active', i===index));
            const card = cards[index];
            const trackRect = track.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            // 计算 scrollLeft 目标：将 card 居中
            const currentScroll = track.scrollLeft;
            const offset = (card.offsetLeft - (track.clientWidth/2) + (card.clientWidth/2));
            track.scrollTo({ left: offset, behavior: 'smooth' });
        }

        // 初始化 active
        let activeIndex = 0;
        setActive(activeIndex);

        rightBtn && rightBtn.addEventListener('click', ()=>{
            activeIndex = Math.min(cards.length - 1, activeIndex + 1);
            setActive(activeIndex);
        });

        leftBtn && leftBtn.addEventListener('click', ()=>{
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
        track.addEventListener('scroll', ()=>{
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(()=>{
                // 计算距离中心最近的卡片
                const center = track.scrollLeft + track.clientWidth/2;
                let nearest = 0;
                let minDist = Infinity;
                cards.forEach((card, idx)=>{
                    const cardCenter = card.offsetLeft + card.clientWidth/2;
                    const dist = Math.abs(cardCenter - center);
                    if (dist < minDist){ minDist = dist; nearest = idx; }
                });
                activeIndex = nearest;
                cards.forEach((c,i)=> c.classList.toggle('active', i===activeIndex));
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

// Appended by Gemini for the diagnosis tool
document.addEventListener('DOMContentLoaded', function() {
    // 需求诊断工具交互
    const diagnosisForm = document.getElementById('diagnosis-form');
    const aiResponseDiv = document.getElementById('ai-response');

    if (diagnosisForm) {
        diagnosisForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const hallType = document.getElementById('hall-type').value;
            const area = document.getElementById('area').value;
            const budget = document.getElementById('budget').value;

            if (!area || !budget) {
                aiResponseDiv.innerHTML = '<p style="color: #C91F37;"><strong>错误：</strong> 请填写面积和预算以获取诊断。</p>';
                aiResponseDiv.style.display = 'block';
                return;
            }

            // 模拟AI响应
            aiResponseDiv.style.display = 'block';
            aiResponseDiv.innerHTML = '<p><strong>正在分析您的需求...</strong></p>';

            setTimeout(() => {
                let responseText = none;
                aiResponseDiv.innerHTML = responseText;
                
                // 滚动到响应位置
                aiResponseDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

            }, 1500); // 模拟AI思考时间
        });
    }
});
