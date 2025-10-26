// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 初始化AOS动画
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // 初始化轮播图 - 淡入淡出效果
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
        speed: 1000,
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
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
        const arrow = item.querySelector('.dropdown-arrow');

        if (dropdown && arrow) {
            // 点击箭头时切换下拉菜单
            arrow.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation(); // 阻止事件冒泡到链接
                    
                    // 切换当前下拉菜单和箭头状态
                    const isActive = dropdown.classList.contains('active');
                    dropdown.classList.toggle('active');
                    item.classList.toggle('dropdown-active', !isActive);

                    // 关闭其他下拉菜单和箭头
                    document.querySelectorAll('.nav-item').forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.querySelector('.dropdown-menu')?.classList.remove('active');
                            otherItem.classList.remove('dropdown-active');
                        }
                    });
                }
            });

            // 点击链接文字时正常跳转（不阻止默认行为）
            // 在移动端，链接本身可以正常跳转到对应页面
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
            // 同时移除所有箭头旋转状态
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('dropdown-active');
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

// AI聊天机器人助手
(function() {
    const botAssistant = document.getElementById('botAssistant');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    
    if (!botAssistant || !chatWindow) return;
    
    // AI回复数据库
    const aiResponses = {
        '公司主要业务是什么？': '中泓万城是一家综合性工程服务商，主营业务包括：\n\n🏗️ **市政施工**：水电路气绿排全链条工程\n🏙️ **城市更新和运营**：老旧小区改造、商圈更新等\n🎨 **设计可视化**：建筑效果图、动画制作\n\n我们拥有完善的资质体系和专业团队，为您提供一站式解决方案！',
        
        '有哪些成功案例？': '我们完成了多个优质项目：\n\n✨ **深圳释放街区酒吧街改造**\n✨ **Mix岛社区商业项目**\n✨ **老旧小区综合改造提升**\n✨ **历史文化街区保护与活化**\n\n累计完成500+项目，客户满意度达98%！想了解具体案例可以访问我们的案例页面。',
        
        '如何联系你们？': '📞 **咨询热线**：400-400-4000\n📧 **电子邮箱**：info@zhongwancheng.com\n📍 **公司地址**：北京市朝阳区XXX大厦\n\n工作时间：周一至周五 9:00-18:00\n我们的专业团队会在24小时内与您取得联系！',
        
        'default': '感谢您的咨询！🤖\n\n我可以帮您了解：\n• 公司业务介绍\n• 成功案例展示\n• 联系方式查询\n• 项目咨询服务\n\n请选择上方快捷按钮或直接输入您的问题，我会尽力为您解答！'
    };
    
    // 添加入场动画
    setTimeout(() => {
        botAssistant.style.opacity = '1';
        botAssistant.style.transform = 'scale(1)';
    }, 500);
    
    // 打开聊天窗口
    botAssistant.addEventListener('click', function() {
        chatWindow.classList.add('active');
        chatInput.focus();
    });
    
    // 关闭聊天窗口
    chatClose.addEventListener('click', function() {
        chatWindow.classList.remove('active');
    });
    
    // 获取当前时间
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
    }
    
    // 添加消息到聊天区域
    function addMessage(text, isUser = false) {
        // 移除欢迎消息
        const welcome = chatBody.querySelector('.chat-welcome');
        if (welcome) {
            welcome.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (isUser) {
            avatarDiv.innerHTML = '<i class="fas fa-user" style="color: #d12b26; font-size: 20px; line-height: 35px;"></i>';
        } else {
            avatarDiv.innerHTML = '<img src="./gif/bot.gif" alt="AI" />';
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // 格式化文本：处理换行和Markdown格式
        let formattedText = text
            .replace(/\n/g, '<br>') // 换行符转换为<br>
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **粗体**转换
            .replace(/\*(.*?)\*/g, '<em>$1</em>'); // *斜体*转换
        
        contentDiv.innerHTML = formattedText;
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        chatBody.appendChild(messageDiv);
        
        // 滚动到底部
        setTimeout(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 100);
    }
    
    // 显示输入中动画
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="./gif/bot.gif" alt="AI" />
            </div>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // 移除输入中动画
    function removeTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) {
            typing.remove();
        }
    }
    
    // AI回复
    function botReply(userMessage) {
        showTypingIndicator();
        
        // 模拟AI思考时间
        setTimeout(() => {
            removeTypingIndicator();
            
            let response = aiResponses['default'];
            
            // 智能匹配回复
            for (let key in aiResponses) {
                if (userMessage.includes(key.replace('？', '').replace('?', ''))) {
                    response = aiResponses[key];
                    break;
                }
            }
            
            // 关键词匹配
            if (userMessage.includes('业务') || userMessage.includes('服务') || userMessage.includes('做什么')) {
                response = aiResponses['公司主要业务是什么？'];
            } else if (userMessage.includes('案例') || userMessage.includes('项目')) {
                response = aiResponses['有哪些成功案例？'];
            } else if (userMessage.includes('联系') || userMessage.includes('电话') || userMessage.includes('地址')) {
                response = aiResponses['如何联系你们？'];
            } else if (userMessage.includes('你好') || userMessage.includes('您好') || userMessage.includes('hi') || userMessage.includes('hello')) {
                response = '您好！很高兴为您服务！😊\n\n我是中泓万城的AI智能助手，可以帮您了解公司业务、项目案例等信息。请问有什么可以帮到您的吗？';
            } else if (userMessage.includes('谢谢') || userMessage.includes('感谢')) {
                response = '不客气！很高兴能帮到您！🤝\n\n如果还有其他问题，随时欢迎咨询。祝您生活愉快！';
            }
            
            addMessage(response, false);
        }, 1000 + Math.random() * 1000);
    }
    
    // 发送消息
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        addMessage(message, true);
        chatInput.value = '';
        
        // AI自动回复
        botReply(message);
    }
    
    // 发送按钮点击
    chatSend.addEventListener('click', sendMessage);
    
    // 回车发送
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 快捷建议按钮
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            addMessage(question, true);
            botReply(question);
        });
    });
})();

