/* ============================================
   STATE MANAGEMENT
   ============================================ */
const STATE = {
    username: localStorage.getItem('xp_username') || '',
    avatar: localStorage.getItem('xp_avatar') || '👨‍💻',
    windows: [],
    windowZIndex: 1000,
    iconPositions: JSON.parse(localStorage.getItem('xp_icon_positions') || '{}'),
    wallpaper: localStorage.getItem('xp_wallpaper') || 'gradient1',
    theme: localStorage.getItem('xp_theme') || 'blue',
    iconSize: localStorage.getItem('xp_icon_size') || 'large',
    customItems: JSON.parse(localStorage.getItem('xp_custom_items') || '[]'),
    files: JSON.parse(localStorage.getItem('xp_files') || '{}'),
    accounts: JSON.parse(localStorage.getItem('xp_accounts') || '[]'),
    selectedItem: null
};

const WALLPAPERS = {
    gradient1: 'linear-gradient(135deg, #0066CC 0%, #003366 50%, #001A33 100%)',
    gradient2: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    gradient3: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    gradient4: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    gradient5: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    gradient6: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    gradient7: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
    gradient8: 'linear-gradient(135deg, #0C3483 0%, #A2B6DF 50%, #6B8CCE 100%)'
};

const THEMES = {
    blue: { name: 'Синяя', titleGradient: 'linear-gradient(180deg, #0058EE 0%, #3593FF 4%, #288EFF 6%, #127DFF 8%, #0369FC 10%, #0262EE 14%, #0057E5 20%, #0054E3 24%, #0055EB 54%, #0050E0 58%, #0044D1 76%, #0030BE 86%, #0018A3 100%)', startGradient: 'linear-gradient(180deg, #3C8F3C 0%, #358235 50%, #2A6B2A 100%)', taskbar: 'linear-gradient(180deg, #245EDB 0%, #2456C8 3%, #1C4DB8 6%, #194AB0 50%, #1845A5 54%, #1B4FB5 100%)', accent: '#0055EA' },
    green: { name: 'Зелёная', titleGradient: 'linear-gradient(180deg, #2D8F2D 0%, #4CB84C 4%, #3AAA3A 6%, #1A6B1A 90%, #0D4D0D 100%)', startGradient: 'linear-gradient(180deg, #3C8F3C 0%, #2D7D2D 50%, #1A5C1A 100%)', taskbar: 'linear-gradient(180deg, #1A6B1A 0%, #2D8F2D 50%, #1A5C1A 100%)', accent: '#2D8F2D' },
    purple: { name: 'Фиолетовая', titleGradient: 'linear-gradient(180deg, #6A1B9A 0%, #9C4DCC 4%, #8E3EBF 6%, #4A148C 90%, #311B92 100%)', startGradient: 'linear-gradient(180deg, #7B1FA2 0%, #6A1B9A 50%, #4A148C 100%)', taskbar: 'linear-gradient(180deg, #4A148C 0%, #6A1B9A 50%, #311B92 100%)', accent: '#6A1B9A' },
    silver: { name: 'Серебряная', titleGradient: 'linear-gradient(180deg, #8A8A8A 0%, #C0C0C0 4%, #B0B0B0 6%, #6A6A6A 90%, #4A4A4A 100%)', startGradient: 'linear-gradient(180deg, #888 0%, #666 50%, #444 100%)', taskbar: 'linear-gradient(180deg, #4A4A4A 0%, #6A6A6A 50%, #3A3A3A 100%)', accent: '#5A5A5A' }
};

const DEFAULT_ICONS = [
    { id: 'mycomputer', icon: '💻', label: 'Мой компьютер', x: 20, y: 20 },
    { id: 'mydocuments', icon: '📂', label: 'Мои документы', x: 20, y: 110 },
    { id: 'ie', icon: '🌐', label: 'Internet Explorer', x: 20, y: 200 },
    { id: 'notepad', icon: '📝', label: 'Блокнот', x: 20, y: 290 },
    { id: 'paint', icon: '🎨', label: 'Paint', x: 20, y: 380 },
    { id: 'minesweeper', icon: '💣', label: 'Сапёр', x: 110, y: 20 },
    { id: 'calculator', icon: '🧮', label: 'Калькулятор', x: 110, y: 110 },
    { id: 'controlpanel', icon: '⚙️', label: 'Панель управления', x: 110, y: 200 },
    { id: 'recycle', icon: '🗑️', label: 'Корзина', x: 20, y: 470 }
];

/* ============================================
   INITIALIZATION
   ============================================ */
function init() {
    if (STATE.username) {
        document.getElementById('login-screen').classList.add('hidden');
        showDesktop();
    } else {
        showLogin();
    }
    startClock();
}

function showLogin() {
    renderUserAccounts();
    document.getElementById('welcome-shutdown').addEventListener('click', () => {
        if (confirm('Выключить компьютер?')) {
            document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-size:24px;flex-direction:column;gap:15px;"><div>Компьютер выключен</div><button onclick="location.reload()" style="padding:10px 20px;font-size:14px;cursor:pointer;background:#4A8BC2;color:#fff;border:none;border-radius:4px;">Включить снова</button></div>`;
        }
    });

    document.getElementById('cancel-new-user').addEventListener('click', () => document.getElementById('new-user-modal').classList.remove('visible'));
    document.getElementById('create-new-user').addEventListener('click', createNewUser);

    document.querySelectorAll('#new-avatar-selection .avatar-option').forEach(av => {
        av.addEventListener('click', () => {
            document.querySelectorAll('#new-avatar-selection .avatar-option').forEach(a => a.classList.remove('selected'));
            av.classList.add('selected');
            window.newAvatarSelected = av.dataset.avatar;
        });
    });
    window.newAvatarSelected = '👨‍💻';

    document.getElementById('prompt-login-btn').addEventListener('click', loginWithAccount);
    document.getElementById('prompt-password').addEventListener('keypress', (e) => { if (e.key === 'Enter') loginWithAccount(); });
    document.getElementById('prompt-back').addEventListener('click', backToAccountSelection);
}

function renderUserAccounts() {
    const container = document.getElementById('user-accounts');
    let html = STATE.accounts.map((acc, idx) => `
        <div class="user-account" data-account-idx="${idx}">
            <div class="account-avatar">${acc.avatar}</div>
            <div class="account-info"><div class="account-name">${acc.name}</div><div class="account-role">Администратор</div></div>
        </div>
    `).join('');
    html += `<div class="user-account add-new" id="add-new-account"><div class="account-avatar">➕</div><div class="account-info"><div class="account-name">Создать новую учётную запись</div><div class="account-role">Нажмите для добавления</div></div></div>`;
    container.innerHTML = html;

    container.querySelectorAll('.user-account[data-account-idx]').forEach(el => {
        el.addEventListener('click', () => selectAccount(STATE.accounts[parseInt(el.dataset.accountIdx)]));
    });
    document.getElementById('add-new-account').addEventListener('click', () => {
        document.getElementById('new-user-modal').classList.add('visible');
        document.getElementById('new-user-name').value = '';
        document.getElementById('new-user-name').focus();
    });
}

function createNewUser() {
    const name = document.getElementById('new-user-name').value.trim();
    if (!name) { alert('Введите имя пользователя!'); return; }
    STATE.accounts.push({ name, avatar: window.newAvatarSelected, created: Date.now() });
    localStorage.setItem('xp_accounts', JSON.stringify(STATE.accounts));
    document.getElementById('new-user-modal').classList.remove('visible');
    renderUserAccounts();
    selectAccount(STATE.accounts[STATE.accounts.length - 1]);
}

function selectAccount(account) {
    window.selectedAccount = account;
    document.getElementById('user-accounts').style.display = 'none';
    document.querySelector('.welcome-subtitle').style.display = 'none';
    document.getElementById('prompt-avatar').textContent = account.avatar;
    document.getElementById('prompt-name').textContent = account.name;
    document.getElementById('prompt-password').value = '';
    document.getElementById('password-prompt').classList.add('visible');
    document.getElementById('prompt-password').focus();
}

function backToAccountSelection() {
    window.selectedAccount = null;
    document.getElementById('password-prompt').classList.remove('visible');
    document.getElementById('user-accounts').style.display = 'flex';
    document.querySelector('.welcome-subtitle').style.display = 'block';
}

function loginWithAccount() {
    if (!window.selectedAccount) return;
    STATE.username = window.selectedAccount.name;
    STATE.avatar = window.selectedAccount.avatar;
    localStorage.setItem('xp_username', STATE.username);
    localStorage.setItem('xp_avatar', STATE.avatar);
    document.getElementById('login-screen').classList.add('hidden');
    setTimeout(showDesktop, 300);
}

/* ============================================
   DESKTOP & ICONS
   ============================================ */
function showDesktop() {
    applyWallpaper();
    applyTheme();
    renderDesktopIcons();
    setupEventListeners();
    document.getElementById('start-avatar').textContent = STATE.avatar;
    document.getElementById('start-username').textContent = STATE.username;
}

function renderDesktopIcons() {
    const desktop = document.getElementById('desktop');
    desktop.innerHTML = '';
    const allIcons = [...DEFAULT_ICONS, ...STATE.customItems];

    allIcons.forEach((icon) => {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        el.dataset.id = icon.id;
        const pos = STATE.iconPositions[icon.id] || { x: icon.x, y: icon.y };
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';
        el.innerHTML = `<span class="icon-img">${icon.icon}</span><span class="icon-label">${icon.label}</span>`;

        setupIconDrag(el);
        el.addEventListener('dblclick', () => openApp(icon.id));
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            selectDesktopItem(icon.id, el);
        });
        desktop.appendChild(el);
    });
}

function selectDesktopItem(id, element) {
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    element.classList.add('selected');
    STATE.selectedItem = id;
    const deleteItem = document.querySelector('.ctx-item[data-action="delete-selected"]');
    if (deleteItem && !DEFAULT_ICONS.find(i => i.id === id)) {
        deleteItem.style.display = 'flex';
    }
}

function setupIconDrag(el) {
    let isDragging = false, startX, startY, initialX, initialY;
    el.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        initialX = parseInt(el.style.left) || 0; initialY = parseInt(el.style.top) || 0;
        el.style.zIndex = 100; el.classList.add('selected');
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        e.preventDefault();
    });
    function onDragMove(e) {
        if (!isDragging) return;
        el.style.left = (initialX + e.clientX - startX) + 'px';
        el.style.top = (initialY + e.clientY - startY) + 'px';
    }
    function onDragEnd() {
        isDragging = false; el.style.zIndex = '';
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        STATE.iconPositions[el.dataset.id] = { x: parseInt(el.style.left), y: parseInt(el.style.top) };
        localStorage.setItem('xp_icon_positions', JSON.stringify(STATE.iconPositions));
    }
}

/* ============================================
   WINDOW MANAGEMENT
   ============================================ */
function createWindow(options) {
    const { title, icon, width = 600, height = 450, content, id, toolbar = '', addressBar = false } = options;
    const existing = STATE.windows.find(w => w.id === id);
    if (existing) {
        existing.el.classList.remove('minimized');
        bringToFront(existing.el);
        return existing;
    }

    const win = document.createElement('div');
    win.className = 'window';
    win.dataset.id = id;
    win.style.width = width + 'px';
    win.style.height = height + 'px';
    win.style.left = (Math.random() * 200 + 50) + 'px';
    win.style.top = (Math.random() * 100 + 30) + 'px';

    let html = `<div class="window-title-bar"><div class="window-title"><span>${icon}</span><span>${title}</span></div><div class="window-controls"><button class="win-minimize" title="Свернуть">—</button><button class="win-maximize" title="Развернуть">□</button><button class="win-close" title="Закрыть">✕</button></div></div>`;
    if (toolbar) html += `<div class="window-toolbar">${toolbar}</div>`;
    if (addressBar) html += `<div class="window-address-bar"><span style="font-size:11px;">Адрес:</span><input type="text" value="about:home" class="address-input"><button class="toolbar-btn go-btn">➜</button></div>`;
    html += `<div class="window-body ${options.noPadding ? 'no-padding' : ''}">${content}</div>`;
    win.innerHTML = html;

    document.getElementById('desktop').appendChild(win);
    bringToFront(win);

    const winObj = { id, el: win, title, icon, minimized: false, maximized: false };
    STATE.windows.push(winObj);

    win.querySelector('.win-close').addEventListener('click', () => closeWindow(id));
    win.querySelector('.win-minimize').addEventListener('click', () => minimizeWindow(id));
    win.querySelector('.win-maximize').addEventListener('click', () => maximizeWindow(id));

    setupWindowDrag(win);
    win.addEventListener('mousedown', () => bringToFront(win));
    addTaskbarItem(winObj);
    return winObj;
}

function setupWindowDrag(win) {
    const titleBar = win.querySelector('.window-title-bar');
    let isDragging = false, startX, startY, initialX, initialY;

    titleBar.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || win.classList.contains('maximized')) return;
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        initialX = parseInt(win.style.left); initialY = parseInt(win.style.top);
        bringToFront(win);
        document.addEventListener('mousemove', onWinDragMove);
        document.addEventListener('mouseup', onWinDragEnd);
        e.preventDefault();
    });

    function onWinDragMove(e) {
        if (!isDragging) return;
        let newX = initialX + e.clientX - startX;
        let newY = initialY + e.clientY - startY;
        // Prevent dragging off-screen
        newY = Math.max(0, Math.min(newY, window.innerHeight - 80));
        win.style.left = newX + 'px';
        win.style.top = newY + 'px';
    }

    function onWinDragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', onWinDragMove);
        document.removeEventListener('mouseup', onWinDragEnd);
    }

    titleBar.addEventListener('dblclick', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        maximizeWindow(win.dataset.id);
    });
}

function closeWindow(id) {
    const idx = STATE.windows.findIndex(w => w.id === id);
    if (idx === -1) return;
    STATE.windows[idx].el.remove();
    STATE.windows.splice(idx, 1);
    const tbItem = document.querySelector(`.taskbar-item[data-id="${id}"]`);
    if (tbItem) tbItem.remove();
}

function minimizeWindow(id) {
    const winObj = STATE.windows.find(w => w.id === id);
    if (!winObj) return;
    winObj.el.classList.add('minimized');
    winObj.minimized = true;
    const tbItem = document.querySelector(`.taskbar-item[data-id="${id}"]`);
    if (tbItem) tbItem.classList.remove('active');
}

function maximizeWindow(id) {
    const winObj = STATE.windows.find(w => w.id === id);
    if (!winObj) return;
    winObj.maximized = !winObj.maximized;
    winObj.el.classList.toggle('maximized', winObj.maximized);
}

function bringToFront(win) {
    STATE.windowZIndex++;
    win.style.zIndex = STATE.windowZIndex;
    document.querySelectorAll('.taskbar-item').forEach(t => t.classList.remove('active'));
    const tbItem = document.querySelector(`.taskbar-item[data-id="${win.dataset.id}"]`);
    if (tbItem) tbItem.classList.add('active');
}

function addTaskbarItem(winObj) {
    const container = document.getElementById('taskbar-apps');
    const item = document.createElement('div');
    item.className = 'taskbar-item active';
    item.dataset.id = winObj.id;
    item.innerHTML = `<span>${winObj.icon}</span> <span>${winObj.title}</span>`;
    item.addEventListener('click', () => {
        if (winObj.minimized) {
            winObj.el.classList.remove('minimized');
            winObj.minimized = false;
            bringToFront(winObj.el);
            item.classList.add('active');
        } else {
            minimizeWindow(winObj.id);
        }
    });
    container.appendChild(item);
}

/* ============================================
   APPLICATIONS
   ============================================ */
function openApp(appId) {
    switch (appId) {
        case 'mycomputer': openMyComputer(); break;
        case 'notepad': openNotepad(); break;
        case 'paint': openPaint(); break;
        case 'ie': openBrowser(); break;
        case 'calculator': openCalculator(); break;
        case 'minesweeper': openMinesweeper(); break;
        case 'controlpanel': openControlPanel(); break;
        case 'personalize': openPersonalization(); break;
        case 'mydocuments': openMyDocuments(); break;
        case 'mypictures': openMyPictures(); break;
        case 'mymusic': openMyMusic(); break;
        case 'help': openHelp(); break;
        case 'recycle': openRecycle(); break;
        case 'run': openRunDialog(); break;
        case 'cp_sounds': openCpSounds(); break;
        case 'cp_display': openCpDisplay(); break;
        default:
            if (appId.startsWith('folder_')) openFolder(appId);
            else if (appId.startsWith('file_')) openTextFile(appId);
            break;
    }
}

function openMyComputer() {
    createWindow({
        title: 'Мой компьютер', icon: '💻', width: 650, height: 450, id: 'mycomputer',
        content: `<div class="explorer-content">
            <div class="explorer-item" ondblclick="openApp('mydocuments')"><span class="item-icon">💾</span><span class="item-name">Локальный диск (C:)</span></div>
            <div class="explorer-item"><span class="item-icon">💿</span><span class="item-name">Дисковод (D:)</span></div>
            <div class="explorer-item" ondblclick="openApp('mydocuments')"><span class="item-icon">📁</span><span class="item-name">Мои документы</span></div>
            <div class="explorer-item" ondblclick="openApp('mypictures')"><span class="item-icon">🖼️</span><span class="item-name">Мои рисунки</span></div>
        </div>`,
        toolbar: `<button class="toolbar-btn">⬆️ Вверх</button><button class="toolbar-btn">🔍 Поиск</button>`,
        addressBar: true
    });
}

function openNotepad(filename, fileContent) {
    const id = filename ? `notepad_${filename}` : `notepad_${Date.now()}`;
    createWindow({
        title: filename ? `${filename} — Блокнот` : 'Безымянный — Блокнот', icon: '📝', width: 550, height: 400, id: id,
        content: `<textarea class="notepad-textarea" id="notepad-content-${id}">${fileContent || ''}</textarea>`,
        toolbar: `<button class="toolbar-btn" onclick="window.saveNotepad('${id}')">💾 Сохранить</button><button class="toolbar-btn" onclick="window.clearNotepad('${id}')">🗑️ Очистить</button>`,
        noPadding: true
    });
}

window.saveNotepad = function(id) {
    const textarea = document.querySelector(`#notepad-content-${id}`);
    if (!textarea) return;
    const fname = id.replace('notepad_', '') || 'untitled';
    STATE.files[fname] = textarea.value;
    localStorage.setItem('xp_files', JSON.stringify(STATE.files));
    alert('Файл сохранён!');
};

window.clearNotepad = function(id) {
    const textarea = document.querySelector(`#notepad-content-${id}`);
    if (textarea) textarea.value = '';
};

function openPaint() {
    const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
    const colorBtns = colors.map(c => `<div class="paint-color ${c === '#000000' ? 'active' : ''}" style="background:${c}" data-color="${c}"></div>`).join('');
    createWindow({
        title: 'Paint', icon: '🎨', width: 700, height: 500, id: 'paint',
        content: `<div class="paint-container"><div class="paint-toolbar">${colorBtns}<select class="paint-size" style="padding:2px;"><option value="2">Тонкая</option><option value="5" selected>Средняя</option><option value="10">Толстая</option></select><button class="toolbar-btn" onclick="window.clearCanvas()">🗑️ Очистить</button><button class="toolbar-btn" onclick="window.saveCanvas()">💾 Сохранить</button></div><canvas class="paint-canvas" id="paint-canvas"></canvas></div>`,
        noPadding: true
    });
    setTimeout(() => initPaintCanvas(), 100);
}

window.paintColor = '#000000'; window.paintSize = 5; window.isPainting = false;
function initPaintCanvas() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth; canvas.height = container.offsetHeight - 40;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.parentElement.querySelectorAll('.paint-color').forEach(btn => {
        btn.addEventListener('click', () => {
            canvas.parentElement.querySelectorAll('.paint-color').forEach(b => b.classList.remove('active'));
            btn.classList.add('active'); window.paintColor = btn.dataset.color;
        });
    });
    canvas.parentElement.querySelector('.paint-size').addEventListener('change', (e) => window.paintSize = parseInt(e.target.value));

    canvas.addEventListener('mousedown', (e) => { window.isPainting = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
    canvas.addEventListener('mousemove', (e) => {
        if (!window.isPainting) return;
        ctx.strokeStyle = window.paintColor; ctx.lineWidth = window.paintSize; ctx.lineCap = 'round';
        ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke();
    });
    canvas.addEventListener('mouseup', () => window.isPainting = false);
    canvas.addEventListener('mouseleave', () => window.isPainting = false);
}

window.clearCanvas = function() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
};

window.saveCanvas = function() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;
    const link = document.createElement('a'); link.download = 'paint-image.png'; link.href = canvas.toDataURL(); link.click();
};

function openCalculator() {
    createWindow({
        title: 'Калькулятор', icon: '🧮', width: 260, height: 380, id: 'calculator',
        content: `<div class="calculator"><input type="text" class="calc-display" id="calc-display" value="0" readonly><div class="calc-buttons">
            <button class="calc-btn" onclick="window.calcInput('C')">C</button><button class="calc-btn" onclick="window.calcInput('CE')">CE</button><button class="calc-btn" onclick="window.calcInput('←')">←</button><button class="calc-btn operator" onclick="window.calcInput('/')">÷</button>
            <button class="calc-btn" onclick="window.calcInput('7')">7</button><button class="calc-btn" onclick="window.calcInput('8')">8</button><button class="calc-btn" onclick="window.calcInput('9')">9</button><button class="calc-btn operator" onclick="window.calcInput('*')">×</button>
            <button class="calc-btn" onclick="window.calcInput('4')">4</button><button class="calc-btn" onclick="window.calcInput('5')">5</button><button class="calc-btn" onclick="window.calcInput('6')">6</button><button class="calc-btn operator" onclick="window.calcInput('-')">−</button>
            <button class="calc-btn" onclick="window.calcInput('1')">1</button><button class="calc-btn" onclick="window.calcInput('2')">2</button><button class="calc-btn" onclick="window.calcInput('3')">3</button><button class="calc-btn operator" onclick="window.calcInput('+')">+</button>
            <button class="calc-btn" onclick="window.calcInput('±')">±</button><button class="calc-btn" onclick="window.calcInput('0')">0</button><button class="calc-btn" onclick="window.calcInput('.')">.</button><button class="calc-btn equals" onclick="window.calcInput('=')">=</button>
        </div></div>`
    });
}

window.calcExpression = ''; window.calcNewNumber = true;
window.calcInput = function(val) {
    const display = document.getElementById('calc-display'); if (!display) return;
    if (val === 'C') { display.value = '0'; window.calcExpression = ''; window.calcNewNumber = true; }
    else if (val === 'CE') { display.value = '0'; window.calcNewNumber = true; }
    else if (val === '←') { display.value = display.value.slice(0, -1) || '0'; }
    else if (val === '±') { display.value = display.value.startsWith('-') ? display.value.slice(1) : '-' + display.value; }
    else if (['+', '-', '*', '/'].includes(val)) { window.calcExpression += display.value + val; window.calcNewNumber = true; }
    else if (val === '=') {
        window.calcExpression += display.value;
        try { display.value = String(parseFloat(eval(window.calcExpression).toFixed(10))); } catch (e) { display.value = 'Ошибка'; }
        window.calcExpression = ''; window.calcNewNumber = true;
    } else {
        if (window.calcNewNumber) { display.value = val; window.calcNewNumber = false; } else { display.value += val; }
    }
};

/* --- MINESWEEPER (Новая фишка!) --- */
function openMinesweeper() {
    const rows = 9, cols = 9, minesCount = 10;
    let board = [], revealed = 0, gameOver = false;
    
    // Init board
    for(let r=0; r<rows; r++) { board[r] = []; for(let c=0; c<cols; c++) board[r][c] = { mine: false, count: 0, revealed: false, flagged: false }; }
    // Place mines
    let minesPlaced = 0;
    while(minesPlaced < minesCount) {
        let r = Math.floor(Math.random()*rows), c = Math.floor(Math.random()*cols);
        if(!board[r][c].mine) { board[r][c].mine = true; minesPlaced++; }
    }
    // Calc numbers
    for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
            if(board[r][c].mine) continue;
            let count = 0;
            for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++) {
                if(r+dr>=0 && r+dr<rows && c+dc>=0 && c+dc<cols && board[r+dr][c+dc].mine) count++;
            }
            board[r][c].count = count;
        }
    }

    let content = `<div style="padding:10px; background:#C0C0C0; height:100%; display:flex; flex-direction:column; align-items:center;">
        <div class="ms-header"><span id="ms-mines">${minesCount}</span><button class="toolbar-btn" onclick="openApp('minesweeper')" style="font-size:18px; padding:0 5px;">😊</button><span id="ms-timer">000</span></div>
        <div class="minesweeper-board" id="ms-board"></div>
    </div>`;

    createWindow({ title: 'Сапёр', icon: '💣', width: 320, height: 420, id: 'minesweeper', content: content, noPadding: true });

    setTimeout(() => {
        const boardEl = document.getElementById('ms-board');
        boardEl.innerHTML = '';
        for(let r=0; r<rows; r++) {
            for(let c=0; c<cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'ms-cell';
                cell.dataset.r = r; cell.dataset.c = c;
                
                cell.addEventListener('click', () => {
                    if(gameOver || board[r][c].revealed || board[r][c].flagged) return;
                    revealCell(r, c);
                });
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    if(gameOver || board[r][c].revealed) return;
                    board[r][c].flagged = !board[r][c].flagged;
                    cell.textContent = board[r][c].flagged ? '🚩' : '';
                });
                boardEl.appendChild(cell);
            }
        }

        function revealCell(r, c) {
            if(r<0 || r>=rows || c<0 || c>=cols || board[r][c].revealed || board[r][c].flagged) return;
            board[r][c].revealed = true; revealed++;
            const cellEl = document.querySelector(`.ms-cell[data-r="${r}"][data-c="${c}"]`);
            cellEl.classList.add('revealed');
            
            if(board[r][c].mine) {
                cellEl.classList.add('mine'); cellEl.textContent = '💣';
                gameOver = true; alert('Вы проиграли!'); return;
            }
            if(board[r][c].count > 0) {
                cellEl.textContent = board[r][c].count;
                cellEl.classList.add(`ms-${board[r][c].count}`);
            } else {
                for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++) revealCell(r+dr, c+dc);
            }
            if(revealed === rows*cols - minesCount) { gameOver = true; alert('Поздравляем! Вы выиграли! 🎉'); }
        }
    }, 100);
}

/* --- BROWSER (Исправлен X-Frame-Options) --- */
function openBrowser() {
    createWindow({
        title: 'Internet Explorer', icon: '🌐', width: 800, height: 550, id: 'ie',
        content: `<div class="browser-content">
            <h1>🌐 Добро пожаловать в Internet Explorer!</h1>
            <p>Современные сайты (Google, Yandex) блокируют отображение во фреймах (X-Frame-Options). Используйте встроенный поиск для симуляции или открытия в новой вкладке.</p>
            <hr style="margin:15px 0;">
            <h2>🔍 Быстрый поиск</h2>
            <div style="margin:15px 0;">
                <button class="toolbar-btn" onclick="window.openSearch('ya')" style="padding:10px 20px;font-size:14px;">🔍 Яндекс</button>
                <button class="toolbar-btn" onclick="window.openSearch('google')" style="padding:10px 20px;font-size:14px;">🔍 Google</button>
            </div>
        </div>`,
        toolbar: `<button class="toolbar-btn" onclick="window.browserHome()">🏠 Домой</button><button class="toolbar-btn" onclick="window.browserRefresh()">🔄 Обновить</button><button class="toolbar-btn" onclick="window.openSearch('ya')">🔍 Поиск</button>`,
        addressBar: true
    });
}

window.openSearch = function(engine) {
    const winEl = document.querySelector('.window[data-id="ie"]'); if (!winEl) return;
    const body = winEl.querySelector('.window-body');
    const addressInput = winEl.querySelector('.address-input');
    const query = prompt('Введите поисковый запрос:');
    if (!query) return;
    
    const searchUrl = engine === 'ya' ? `https://ya.ru/search?text=${encodeURIComponent(query)}` : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    body.innerHTML = `<div class="mock-browser-msg">
        <h2>🔍 Результаты поиска: "${query}"</h2>
        <p>Сайт ${engine === 'ya' ? 'Яндекс' : 'Google'} не может быть отображён во фрейме из-за политики безопасности браузера.</p>
        <br>
        <a href="${searchUrl}" target="_blank" class="toolbar-btn" style="text-decoration:none; display:inline-block; padding:10px 20px;">➡️ Открыть ${engine === 'ya' ? 'Яндекс' : 'Google'} в новой вкладке</a>
    </div>`;
    if (addressInput) addressInput.value = searchUrl;
};

window.browserHome = function() { openBrowser(); };
window.browserRefresh = function() {
    const winEl = document.querySelector('.window[data-id="ie"]');
    if (winEl) {
        const currentContent = winEl.querySelector('.window-body').innerHTML;
        winEl.querySelector('.window-body').innerHTML = '<div style="padding:40px; text-align:center;">🔄 Обновление страницы...</div>';
        setTimeout(() => { winEl.querySelector('.window-body').innerHTML = currentContent; }, 600);
    }
};

/* --- FILE SYSTEM & MY DOCUMENTS --- */
function openMyDocuments() {
    const filesHtml = Object.keys(STATE.files).map(f => `<div class="explorer-item" ondblclick="openApp('file_${f}')" data-id="file_${f}"><span class="item-icon">📄</span><span class="item-name">${f}</span></div>`).join('');
    const foldersHtml = STATE.customItems.filter(i => i.id.startsWith('folder_')).map(f => `<div class="explorer-item" ondblclick="openApp('${f.id}')" data-id="${f.id}"><span class="item-icon">📁</span><span class="item-name">${f.label}</span></div>`).join('');

    createWindow({
        title: 'Мои документы', icon: '📂', width: 550, height: 400, id: 'mydocuments',
        content: `<div class="explorer-content">${foldersHtml}${filesHtml}${!filesHtml && !foldersHtml ? '<p style="color:#888; padding:20px;">Папка пуста. Создайте файлы через ПКМ на рабочем столе.</p>' : ''}</div>`,
        toolbar: `<button class="toolbar-btn">⬆️ Вверх</button>`, addressBar: true
    });
}

function openMyPictures() { createWindow({ title: 'Мои рисунки', icon: '🖼️', width: 500, height: 350, id: 'mypictures', content: `<div class="explorer-content" style="justify-content:center;align-items:center;"><div style="text-align:center;"><span style="font-size:60px;">🖼️</span><p style="margin-top:15px;color:#666;">Мои рисунки</p></div></div>` }); }
function openMyMusic() { createWindow({ title: 'Моя музыка', icon: '🎵', width: 500, height: 350, id: 'mymusic', content: `<div class="explorer-content" style="justify-content:center;align-items:center;"><div style="text-align:center;"><span style="font-size:60px;">🎵</span><p style="margin-top:15px;color:#666;">Музыкальная коллекция пуста.</p></div></div>` }); }
function openRecycle() { createWindow({ title: 'Корзина', icon: '🗑️', width: 450, height: 350, id: 'recycle', content: `<div class="explorer-content" style="justify-content:center;align-items:center;"><div style="text-align:center;"><span style="font-size:60px;">🗑️</span><p style="margin-top:15px;color:#666;">Корзина пуста</p></div></div>` }); }

function openFolder(folderId) {
    const folder = STATE.customItems.find(i => i.id === folderId); if (!folder) return;
    createWindow({ title: folder.label, icon: '📁', width: 500, height: 350, id: folderId, content: `<div class="explorer-content"><p style="color:#888; padding:20px;">Папка "${folder.label}" пуста.</p></div>` });
}

function openTextFile(fileId) {
    const filename = fileId.replace('file_', '');
    openNotepad(filename, STATE.files[filename] || '');
}

/* --- CONTROL PANEL --- */
function openControlPanel() {
    createWindow({
        title: 'Панель управления', icon: '⚙️', width: 620, height: 480, id: 'controlpanel',
        content: `<div class="control-panel">
            <div class="cp-item" onclick="openApp('personalize')"><span class="cp-icon">🎨</span><span class="cp-label">Экран</span></div>
            <div class="cp-item" onclick="openApp('cp_sounds')"><span class="cp-icon">🔊</span><span class="cp-label">Звуки</span></div>
            <div class="cp-item" onclick="openApp('cp_display')"><span class="cp-icon">🖥️</span><span class="cp-label">Разрешение</span></div>
            <div class="cp-item" onclick="openApp('help')"><span class="cp-icon">❓</span><span class="cp-label">Справка</span></div>
            <div class="cp-item" onclick="window.resetSystem()"><span class="cp-icon">♻️</span><span class="cp-label">Сброс системы</span></div>
        </div>`
    });
}

function openPersonalization() {
    const wpOptions = Object.entries(WALLPAPERS).map(([key, value]) => `<div class="wallpaper-option ${STATE.wallpaper === key ? 'active' : ''}" style="background: ${value}" data-wallpaper="${key}"></div>`).join('');
    const thOptions = Object.entries(THEMES).map(([key, theme]) => `<div class="theme-option ${STATE.theme === key ? 'active' : ''}" style="background: ${theme.titleGradient}" data-theme="${key}">${theme.name}</div>`).join('');
    
    createWindow({
        title: 'Свойства: Экран', icon: '🎨', width: 550, height: 500, id: 'personalize',
        content: `<div class="cp-dialog">
            <div class="cp-section"><h4>🖼️ Обои рабочего стола</h4><div class="wallpaper-grid">${wpOptions}</div></div>
            <div class="cp-section"><h4>🎨 Тема оформления</h4><div class="theme-grid">${thOptions}</div></div>
        </div>`
    });

    setTimeout(() => {
        document.querySelectorAll('.wallpaper-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.wallpaper-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                STATE.wallpaper = opt.dataset.wallpaper;
                localStorage.setItem('xp_wallpaper', STATE.wallpaper);
                applyWallpaper();
            });
        });
        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                STATE.theme = opt.dataset.theme;
                localStorage.setItem('xp_theme', STATE.theme);
                applyTheme();
            });
        });
    }, 100);
}

function openCpSounds() {
    createWindow({ title: 'Звуки и аудио', icon: '🔊', width: 450, height: 300, id: 'cp_sounds', content: `<div class="cp-dialog"><h2>🔊 Звуки</h2><p>Симуляция: Звуки системы включены.</p><button class="cp-button" onclick="alert('Тестовый звук: Beep!')">▶️ Проверить звук</button></div>` });
}
function openCpDisplay() {
    createWindow({ title: 'Разрешение экрана', icon: '🖥️', width: 450, height: 300, id: 'cp_display', content: `<div class="cp-dialog"><h2>🖥️ Экран</h2><div class="cp-row"><label>Разрешение:</label><select class="cp-select"><option>1920 x 1080</option><option>1280 x 720</option></select></div><button class="cp-button" onclick="alert('Настройки применены!')">Применить</button></div>` });
}

/* --- RUN DIALOG (Новая фишка!) --- */
function openRunDialog() {
    createWindow({
        title: 'Выполнить', icon: '⌨️', width: 350, height: 180, id: 'run',
        content: `<div style="padding:20px; display:flex; flex-direction:column; gap:15px;">
            <div style="display:flex; gap:15px; align-items:flex-start;">
                <span style="font-size:32px;">🖥️</span>
                <div>
                    <p style="font-size:12px; margin-bottom:10px;">Введите имя программы, папки, документа или ресурса Интернета, и Windows откроет его.</p>
                    <label style="font-size:12px;">Открыть:</label>
                    <input type="text" id="run-input" style="width:100%; padding:4px; border:1px solid #7F9DB9; margin-top:5px;" value="notepad">
                </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px;">
                <button class="cp-button" onclick="executeRun()">OK</button>
                <button class="cp-button" onclick="closeWindow('run')">Отмена</button>
            </div>
        </div>`
    });
}

window.executeRun = function() {
    const cmd = document.getElementById('run-input').value.trim().toLowerCase();
    closeWindow('run');
    if (cmd === 'notepad') openApp('notepad');
    else if (cmd === 'calc') openApp('calculator');
    else if (cmd === 'mspaint' || cmd === 'paint') openApp('paint');
    else if (cmd === 'iexplore' || cmd === 'ie') openApp('ie');
    else if (cmd === 'winmine' || cmd === 'minesweeper') openApp('minesweeper');
    else if (cmd === 'control') openApp('controlpanel');
    else alert(`Windows не удается найти '${cmd}'. Проверьте правильность имени и повторите попытку.`);
};

/* --- HELP --- */
function openHelp() {
    createWindow({
        title: 'Справка', icon: '❓', width: 500, height: 450, id: 'help',
        content: `<div style="padding:20px; line-height:1.8;">
            <h2>📖 Справка Windows XP Clone</h2><hr style="margin:15px 0;">
            <h3>🖱️ Основные действия:</h3>
            <ul style="padding-left:20px; font-size:13px;">
                <li><strong>Двойной клик</strong> — открыть приложение</li>
                <li><strong>Перетаскивание</strong> — изменить позицию иконок/окон</li>
                <li><strong>ПКМ на рабочем столе</strong> — создать файл/папку, персонализация</li>
                <li><strong>ПКМ на файле/папке</strong> — удалить объект</li>
                <li><strong>Пуск -> Выполнить</strong> — команды: notepad, calc, paint, ie, minesweeper, control</li>
            </ul>
            <h3 style="margin-top:15px;">🌐 Браузер:</h3>
            <ul style="padding-left:20px; font-size:13px;">
                <li>Кнопка 🔍 Поиск открывает диалог и перенаправляет на Яндекс/Google в новой вкладке (из-за ограничений X-Frame-Options).</li>
            </ul>
        </div>`
    });
}

/* ============================================
   THEME & WALLPAPER
   ============================================ */
function applyWallpaper() {
    document.getElementById('desktop').style.backgroundImage = WALLPAPERS[STATE.wallpaper] || WALLPAPERS.gradient1;
}

function applyTheme() {
    const theme = THEMES[STATE.theme] || THEMES.blue;
    document.documentElement.style.setProperty('--title-gradient', theme.titleGradient);
    document.documentElement.style.setProperty('--start-gradient', theme.startGradient);
    document.documentElement.style.setProperty('--taskbar-gradient', theme.taskbar);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    document.getElementById('taskbar').style.background = theme.taskbar;
    document.getElementById('start-btn').style.background = theme.startGradient;
    document.querySelectorAll('.window-title-bar').forEach(tb => tb.style.background = theme.titleGradient);
    const startHeader = document.querySelector('.start-header');
    if (startHeader) startHeader.style.background = theme.titleGradient;
}

/* ============================================
   CONTEXT MENU & EVENTS
   ============================================ */
function setupEventListeners() {
    const desktop = document.getElementById('desktop');
    const contextMenu = document.getElementById('context-menu');
    const startMenu = document.getElementById('start-menu');
    const startBtn = document.getElementById('start-btn');

    desktop.addEventListener('contextmenu', (e) => {
        if (e.target === desktop || e.target.id === 'desktop' || e.target.classList.contains('desktop-icon')) {
            e.preventDefault();
            if (e.target.classList.contains('desktop-icon')) {
                STATE.selectedItem = e.target.dataset.id;
                const deleteItem = document.querySelector('.ctx-item[data-action="delete-selected"]');
                deleteItem.style.display = DEFAULT_ICONS.find(i => i.id === STATE.selectedItem) ? 'none' : 'flex';
            } else {
                STATE.selectedItem = null;
                document.querySelector('.ctx-item[data-action="delete-selected"]').style.display = 'none';
            }
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';
            contextMenu.classList.add('visible');
        }
    });

    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target)) contextMenu.classList.remove('visible');
        if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) startMenu.classList.remove('visible');
        if (e.target === desktop || e.target.id === 'desktop') {
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            STATE.selectedItem = null;
        }
    });

    document.querySelectorAll('.ctx-item').forEach(item => {
        item.addEventListener('click', () => {
            handleContextAction(item.dataset.action);
            contextMenu.classList.remove('visible');
        });
    });

    startBtn.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('visible'); });
    document.querySelectorAll('.start-item').forEach(item => {
        item.addEventListener('click', () => { openApp(item.dataset.app); startMenu.classList.remove('visible'); });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Выйти из системы?')) { localStorage.removeItem('xp_username'); localStorage.removeItem('xp_avatar'); location.reload(); }
    });

    document.getElementById('shutdown-btn').addEventListener('click', () => {
        if (confirm('Выключить компьютер?')) {
            document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-size:24px;flex-direction:column;gap:15px;"><div>Компьютер выключен</div><button onclick="location.reload()" style="padding:10px 20px;font-size:14px;cursor:pointer;background:#4A8BC2;color:#fff;border:none;border-radius:4px;">Включить снова</button></div>`;
        }
    });
}

function handleContextAction(action) {
    switch (action) {
        case 'refresh': renderDesktopIcons(); break;
        case 'view-large':
            STATE.iconSize = 'large'; localStorage.setItem('xp_icon_size', 'large');
            document.querySelectorAll('.desktop-icon .icon-img').forEach(i => i.style.fontSize = '36px'); break;
        case 'view-small':
            STATE.iconSize = 'small'; localStorage.setItem('xp_icon_size', 'small');
            document.querySelectorAll('.desktop-icon .icon-img').forEach(i => i.style.fontSize = '24px'); break;
        case 'new-folder':
            const folderName = prompt('Имя папки:');
            if (folderName) {
                STATE.customItems.push({ id: 'folder_' + Date.now(), icon: '📁', label: folderName, x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 });
                localStorage.setItem('xp_custom_items', JSON.stringify(STATE.customItems));
                renderDesktopIcons();
            } break;
        case 'new-file':
            const fileName = prompt('Имя текстового файла (с расширением .txt):');
            if (fileName) {
                STATE.files[fileName] = '';
                localStorage.setItem('xp_files', JSON.stringify(STATE.files));
                STATE.customItems.push({ id: 'file_' + fileName, icon: '📄', label: fileName, x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 });
                localStorage.setItem('xp_custom_items', JSON.stringify(STATE.customItems));
                renderDesktopIcons();
            } break;
        case 'personalize': openPersonalization(); break;
        case 'delete-selected':
            if (STATE.selectedItem) deleteSelectedItem(STATE.selectedItem);
            break;
    }
}

function deleteSelectedItem(id) {
    if (confirm('Вы уверены, что хотите удалить этот объект?')) {
        if (id.startsWith('folder_')) {
            STATE.customItems = STATE.customItems.filter(i => i.id !== id);
            localStorage.setItem('xp_custom_items', JSON.stringify(STATE.customItems));
        } else if (id.startsWith('file_')) {
            const fileName = id.replace('file_', '');
            delete STATE.files[fileName];
            localStorage.setItem('xp_files', JSON.stringify(STATE.files));
            STATE.customItems = STATE.customItems.filter(i => i.id !== id);
            localStorage.setItem('xp_custom_items', JSON.stringify(STATE.customItems));
        }
        delete STATE.iconPositions[id];
        localStorage.setItem('xp_icon_positions', JSON.stringify(STATE.iconPositions));
        renderDesktopIcons();
    }
}

window.resetSystem = function() {
    if (confirm('Вы уверены? Все данные (файлы, настройки, аккаунты) будут удалены!')) {
        localStorage.clear(); location.reload();
    }
};

function startClock() {
    function update() {
        const now = new Date();
        const clockEl = document.getElementById('clock');
        if (clockEl) clockEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    update(); setInterval(update, 1000);
}

document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.target.id === 'desktop') e.preventDefault();
});

// Запуск
init();
