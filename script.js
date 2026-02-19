
// --- State Management ---
const state = {
    currentView: null,
    sliderInterval: null,
    activeSlide: 0
};

// --- Data ---
const data = {
    home: {
        sliderImages: [
            "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
        ],
        featureImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        introTitle: "חוויה של טעמים וריחות",
        introText: "ברוכים הבאים למסעדת כנען. אנו מזמינים אתכם למסע קולינרי מרתק המשלב חומרי גלם מקומיים טריים עם טכניקות בישול מודרניות. כל מנה מספרת סיפור, כל ביס הוא זיכרון.",
        featureTitle: "השף שלנו",
        featureText: "השף יונתן כהן מביא עמו ניסיון של למעלה מ-15 שנה במטבחים המובילים באירופה. הפילוסופיה שלו פשוטה: כבוד לחומר הגלם ואהבה לאנשים.",
    },
    menu: {
        categories: ['ראשונות', 'עיקריות', 'קינוחים', 'אלכוהול'],
        items: [
            { category: 'ראשונות', name: 'קרפצ\'יו סלק', price: '58 ₪', desc: 'סלקים צלויים, גבינת המאירי, אגוזי מלך ובלסמי מצומצם' },
            { category: 'ראשונות', name: 'סביצ\'ה דג ים', price: '64 ₪', desc: 'דג ים טרי, כוסברה, צ\'ילי, בצל סגול וקרם אבוקדו' },
            { category: 'ראשונות', name: 'פולנטה פטריות', price: '62 ₪', desc: 'פולנטה רכה, תערובת פטריות יער, פרמזן ושמן כמהין' },
            { category: 'עיקריות', name: 'פילה בקר', price: '148 ₪', desc: '220 גרם פילה בקר, פירה כמהין, ורוטב יין אדום' },
            { category: 'עיקריות', name: 'ניוקי ערמונים', price: '88 ₪', desc: 'ניוקי עבודת יד, שמנת, ערמונים, מרווה ופרמזן' },
            { category: 'עיקריות', name: 'דג היום', price: '125 ₪', desc: 'פילה דג ים צרוב, ריזוטו כרישה ולימון' },
            { category: 'קינוחים', name: 'נמסיס שוקולד', price: '48 ₪', desc: 'עוגת שוקולד עשירה, גלידת וניל וטוויל שקדים' },
            { category: 'קינוחים', name: 'מלבי קוקוס', price: '42 ₪', desc: 'מלבי על בסיס חלב קוקוס, סירופ ורדים, בוטנים וקוקוס קלוי' },
            { category: 'אלכוהול', name: 'יין הבית (אדום/לבן)', price: '38 ₪', desc: 'גליל עליון, 2021' },
            { category: 'אלכוהול', name: 'קוקטייל הבית', price: '52 ₪', desc: 'ג\'ין, מלפפון, נענע ולימון' },
        ]
    },
    contact: {
        address: "נתניה, שדרות בן צבי 113",
        phone: "09-8884444",
        email: "info@canaan-rest.co.il"
    }
};

// --- Core Functions ---

function init() {
    navigateTo('home');
    setupMobileMenu();
}

function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
    // Close menu on link click
    menu.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => menu.classList.add('hidden'));
    });
}

function navigateTo(viewName) {
    if (state.currentView === viewName) return;

    state.currentView = viewName;
    
    // Update UI State
    document.querySelectorAll('.nav-link').forEach(el => {
        if (el.dataset.target === viewName) {
            el.classList.add('active-nav');
            el.classList.remove('text-gray-600');
        } else {
            el.classList.remove('active-nav');
            el.classList.add('text-gray-600');
        }
    });

    // Scroll to top
    window.scrollTo(0,0);

    // Clean up intervals
    if (state.sliderInterval) clearInterval(state.sliderInterval);

    // Render Process
    const app = document.getElementById('app-content');
    
    // 1. Remove Animation Class to reset
    app.classList.remove('view-animate');
    
    // 2. Trigger Reflow (Magic trick to restart CSS animation)
    void app.offsetWidth; 
    
    // 3. Clear content
    app.innerHTML = '';

    // 4. Render new content
    switch (viewName) {
        case 'home':
            renderHome(app);
            break;
        case 'menu':
            renderMenu(app);
            break;
        case 'about':
            renderAbout(app);
            break;
        case 'contact':
            renderContact(app);
            break;
    }

    // 5. Apply Animation Class - this fades in EVERYTHING at once
    app.classList.add('view-animate');
}

// --- View Renderers ---

function renderHome(container) {
    // Section 1: Split View (Intro + Slider)
    const section1 = document.createElement('section');
    section1.className = "grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]";
    
    // Left: Intro Text (Removed individual animations)
    const textSide = document.createElement('div');
    textSide.className = "bg-[#F9F7F2] p-12 lg:p-24 flex flex-col justify-center order-2 lg:order-1";
    textSide.innerHTML = `
        <div>
            <h2 class="text-xs uppercase tracking-widest text-[#C05621] font-bold mb-4">ברוכים הבאים</h2>
            <h1 class="text-4xl lg:text-6xl font-black text-[#2D3748] mb-6 leading-tight">${data.home.introTitle}</h1>
            <p class="text-lg text-gray-600 leading-relaxed mb-8">${data.home.introText}</p>
            <button onclick="navigateTo('menu')" class="inline-block bg-[#2D3748] text-white px-8 py-4 font-bold text-lg hover:bg-[#C05621] transition-colors duration-300 w-fit">
                לצפייה בתפריט
            </button>
        </div>
    `;

    // Right: Slider
    const sliderSide = document.createElement('div');
    sliderSide.className = "relative h-[50vh] lg:h-auto overflow-hidden order-1 lg:order-2 bg-gray-200";
    
    let sliderHTML = '';
    data.home.sliderImages.forEach((src, idx) => {
        sliderHTML += `<img src="${src}" class="slider-image ${idx === 0 ? 'active' : ''}" alt="Restaurant slide ${idx+1}">`;
    });
    sliderSide.innerHTML = sliderHTML;

    section1.appendChild(textSide);
    section1.appendChild(sliderSide);
    container.appendChild(section1);

    // Start Slider Logic
    let currentSlide = 0;
    const slides = sliderSide.querySelectorAll('.slider-image');
    state.sliderInterval = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000);

    // Section 2: Split View (Image + Text)
    const section2 = document.createElement('section');
    section2.className = "grid grid-cols-1 lg:grid-cols-2";
    
    const s2Img = document.createElement('div');
    s2Img.className = "h-[400px] lg:h-[600px] bg-cover bg-center";
    s2Img.style.backgroundImage = `url('${data.home.featureImage}')`;

    const s2Text = document.createElement('div');
    s2Text.className = "bg-white p-12 lg:p-24 flex flex-col justify-center";
    s2Text.innerHTML = `
        <h3 class="text-3xl font-bold text-[#2D3748] mb-6 border-b-4 border-[#C05621] w-20 pb-2">${data.home.featureTitle}</h3>
        <p class="text-lg text-gray-600 leading-relaxed mb-6">${data.home.featureText}</p>
        <div class="flex items-center space-x-4 space-x-reverse text-[#C05621] font-bold cursor-pointer hover:underline" onclick="navigateTo('about')">
            <span>קרא עוד עלינו</span>
            <span>&larr;</span>
        </div>
    `;

    section2.appendChild(s2Img);
    section2.appendChild(s2Text);
    container.appendChild(section2);

    // Section 3: Contact & Map
    const section3 = document.createElement('section');
    section3.className = "bg-[#2D3748] text-white py-20";
    section3.innerHTML = `
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">בואו לבקר אותנו</h2>
                <div class="w-16 h-1 bg-[#C05621] mx-auto"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <!-- Info -->
                <div class="space-y-8 text-center md:text-right">
                    <div class="bg-white/5 p-8 rounded-lg backdrop-blur hover:bg-white/10 transition">
                        <h4 class="text-xl font-bold text-[#C05621] mb-2">כתובת</h4>
                        <p class="text-xl">${data.contact.address}</p>
                    </div>
                    <div class="bg-white/5 p-8 rounded-lg backdrop-blur hover:bg-white/10 transition">
                        <h4 class="text-xl font-bold text-[#C05621] mb-2">טלפון להזמנות</h4>
                        <p class="text-xl dir-ltr">${data.contact.phone}</p>
                    </div>
                    <div class="bg-white/5 p-8 rounded-lg backdrop-blur hover:bg-white/10 transition">
                        <h4 class="text-xl font-bold text-[#C05621] mb-2">דוא"ל</h4>
                        <p class="text-xl">${data.contact.email}</p>
                    </div>
                </div>

                <!-- Real Google Map -->
                <div class="h-[400px] w-full bg-gray-200 rounded-lg overflow-hidden relative shadow-lg">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        scrolling="no" 
                        marginheight="0" 
                        marginwidth="0" 
                        src="https://maps.google.com/maps?q=Sderot+Ben+Zvi+113,+Netanya&hl=he&z=16&output=embed"
                        title="מפה לנתניה, שדרות בן צבי 113">
                    </iframe>
                </div>
            </div>
        </div>
    `;
    container.appendChild(section3);
}

function renderMenu(container) {
    container.innerHTML = `
        <div class="bg-[#2D3748] text-white py-24 text-center">
            <h1 class="text-5xl font-bold mb-4">התפריט שלנו</h1>
            <p class="text-xl text-gray-400">חומרי גלם מקומיים, השראה עולמית</p>
        </div>
        <div class="container mx-auto px-4 py-12" id="menu-content">
            <div class="flex flex-wrap justify-center gap-4 mb-12" id="menu-tabs">
                ${data.menu.categories.map(cat => `
                    <button onclick="filterMenu('${cat}')" 
                    class="menu-tab px-6 py-2 rounded-full border border-[#2D3748] focus:outline-none font-bold hover:bg-[#2D3748] hover:text-white transition-all ${cat === 'ראשונות' ? 'bg-[#2D3748] text-white' : 'text-[#2D3758]'}"
                    data-cat="${cat}">
                        ${cat}
                    </button>
                `).join('')}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="menu-grid">
                ${getMenuGridHTML('ראשונות')}
            </div>
        </div>
    `;
}

window.filterMenu = function(category) {
    document.querySelectorAll('.menu-tab').forEach(btn => {
        if(btn.dataset.cat === category) {
            btn.classList.add('bg-[#2D3748]', 'text-white');
            btn.classList.remove('text-[#2D3758]');
        } else {
            btn.classList.remove('bg-[#2D3748]', 'text-white');
            btn.classList.add('text-[#2D3758]');
        }
    });
    const grid = document.getElementById('menu-grid');
    grid.style.opacity = '0';
    setTimeout(() => {
        grid.innerHTML = getMenuGridHTML(category);
        grid.style.opacity = '1';
    }, 200);
};

function getMenuGridHTML(category) {
    const items = data.menu.items.filter(item => item.category === category);
    return items.map(item => `
        <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-300 flex justify-between items-start">
            <div class="flex-1 ml-4">
                <h3 class="text-xl font-bold text-[#2D3748] mb-2">${item.name}</h3>
                <p class="text-gray-500 leading-relaxed">${item.desc}</p>
            </div>
            <div class="text-[#C05621] font-bold text-xl whitespace-nowrap">${item.price}</div>
        </div>
    `).join('');
}

function renderAbout(container) {
    container.innerHTML = `
        <div class="bg-[#F9F7F2] py-20">
            <div class="container mx-auto px-6">
                <div class="max-w-4xl mx-auto text-center mb-16">
                    <h1 class="text-4xl font-bold text-[#2D3748] mb-6">הסיפור שלנו</h1>
                    <p class="text-lg text-gray-600 leading-relaxed">
                        מסעדת כנען הוקמה מתוך תשוקה לאוכל ישראלי אמיתי. אנחנו מאמינים שחיבור לאדמה ולשורשים הוא הבסיס לכל מנה טובה. 
                        התפריט שלנו משתנה מדי עונה, בהתאם ליבולים הטריים שמגיעים מהחקלאים המקומיים שלנו.
                    </p>
                </div>

                <div class="bg-white p-8 rounded-2xl shadow-lg mb-16">
                    <h3 class="text-2xl font-bold text-center mb-8 text-[#2D3748]">פרופיל הטעמים שלנו</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div class="chart-container">
                            <canvas id="flavorChart"></canvas>
                        </div>
                        <div class="space-y-4">
                            <div class="p-4 bg-gray-50 rounded-lg border-r-4 border-[#C05621]">
                                <h4 class="font-bold">חדשנות (85%)</h4>
                                <p class="text-sm text-gray-600">טכניקות בישול מודרניות כמו סו-ויד ופרמנטציה.</p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg border-r-4 border-[#2D3748]">
                                <h4 class="font-bold">מסורת (90%)</h4>
                                <p class="text-sm text-gray-600">מתכונים שעברו מדור לדור וקיבלו אינטרפרטציה חדשה.</p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg border-r-4 border-gray-400">
                                <h4 class="font-bold">מקומיות (95%)</h4>
                                <p class="text-sm text-gray-600">95% מחומרי הגלם שלנו מגיעים מיצרנים ישראלים בטווח של 100 ק"מ.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" class="rounded-lg h-48 w-full object-cover hover:opacity-80 transition">
                    <img src="https://images.unsplash.com/photo-1550966871-3ed3c6227685?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" class="rounded-lg h-48 w-full object-cover hover:opacity-80 transition translate-y-8">
                    <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" class="rounded-lg h-48 w-full object-cover hover:opacity-80 transition">
                    <img src="https://images.unsplash.com/photo-1428515613728-6e880345aa89?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" class="rounded-lg h-48 w-full object-cover hover:opacity-80 transition translate-y-8">
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        const ctx = document.getElementById('flavorChart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['מלוח', 'מתוק', 'חמוץ', 'חריף', 'אוממי', 'מרקם'],
                datasets: [{
                    label: 'חתימת הטעם של כנען',
                    data: [80, 40, 75, 50, 90, 85],
                    backgroundColor: 'rgba(192, 86, 33, 0.2)',
                    borderColor: '#C05621',
                    pointBackgroundColor: '#2D3748',
                    borderWidth: 2
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: '#e2e8f0' },
                        grid: { color: '#e2e8f0' },
                        pointLabels: { font: { family: 'Heebo', size: 14 } },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }, 100);
}

function renderContact(container) {
    container.innerHTML = `
        <div class="bg-white py-20 min-h-[70vh]">
            <div class="container mx-auto px-6">
                <div class="max-w-2xl mx-auto bg-[#F9F7F2] p-10 rounded-2xl shadow-xl">
                    <h2 class="text-3xl font-bold text-center text-[#2D3748] mb-8">צור קשר</h2>
                    <form id="contactForm" onsubmit="handleContact(event)" class="space-y-6">
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">שם מלא</label>
                            <input type="text" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#C05621] transition">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">טלפון</label>
                            <input type="tel" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#C05621] transition">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">הודעה</label>
                            <textarea rows="4" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#C05621] transition"></textarea>
                        </div>
                        <button type="submit" class="w-full bg-[#2D3748] text-white font-bold py-4 rounded-lg hover:bg-[#C05621] transition duration-300 shadow-lg">
                            שלח הודעה
                        </button>
                    </form>
                    <div id="formSuccess" class="hidden mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                        ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.handleContact = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'שולח...';
    btn.disabled = true;
    
    setTimeout(() => {
        document.getElementById('formSuccess').classList.remove('hidden');
        e.target.reset();
        btn.innerText = originalText;
        btn.disabled = false;
    }, 1500);
};

// Initialize App
init();
