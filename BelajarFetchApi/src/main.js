import { loginAPI } from './api/auth.js';
import { getProfileAPI } from './api/users.js';
import { getNewsAPI } from './api/news.js';
import { getToken, setToken, removeToken } from './utils/token.js';

// Visual Console Logging Helper
const consoleLogsContainer = document.getElementById('consoleLogs');

function addLog(message, type = 'info') {
  if (consoleLogsContainer) {
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    consoleLogsContainer.appendChild(entry);
    consoleLogsContainer.scrollTop = consoleLogsContainer.scrollHeight;
  }
}

// Override standard console logging to update our onscreen logger as well
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  originalLog(...args);
  const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
  if (msg.includes('[Interceptor Request]')) {
    addLog(msg, 'request');
  } else if (msg.includes('[Interceptor Response]')) {
    addLog(msg, 'response');
  } else {
    addLog(msg, 'info');
  }
};

console.error = (...args) => {
  originalError(...args);
  const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
  addLog(msg, 'error');
};

console.warn = (...args) => {
  originalWarn(...args);
  const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
  addLog(msg, 'error');
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const statusBadge = document.getElementById('statusBadge');

const noProfileMsg = document.getElementById('noProfileMsg');
const profileDetails = document.getElementById('profileDetails');
const profileFullName = document.getElementById('profileFullName');
const profileUsername = document.getElementById('profileUsername');
const profileRole = document.getElementById('profileRole');

const fetchProfileBtn = document.getElementById('fetchProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const clearConsoleBtn = document.getElementById('clearConsoleBtn');

// DOM Elements for News (Public API)
const fetchNewsBtn = document.getElementById('fetchNewsBtn');
const noNewsMsg = document.getElementById('noNewsMsg');
const newsList = document.getElementById('newsList');

// Sync UI with Auth Status
const updateAuthUI = () => {
  const token = getToken();
  if (token) {
    statusBadge.textContent = 'Logged In';
    statusBadge.className = 'badge badge-active';
    logoutBtn.style.display = 'block';
    
    usernameInput.disabled = true;
    passwordInput.disabled = true;
    loginBtn.disabled = true;
    loginBtn.style.opacity = '0.5';
  } else {
    statusBadge.textContent = 'Logged Out';
    statusBadge.className = 'badge badge-inactive';
    logoutBtn.style.display = 'none';
    
    usernameInput.disabled = false;
    passwordInput.disabled = false;
    loginBtn.disabled = false;
    loginBtn.style.opacity = '1';
    
    profileDetails.style.display = 'none';
    noProfileMsg.style.display = 'block';
  }
};

// 1. Submit Login Form
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  console.log(`[UI] Memulai proses login untuk: ${username}...`);
  try {
    const response = await loginAPI(username, password);
    console.log(`[UI] Login sukses: ${response.message}`);
    
    // Save token to localStorage
    setToken(response.token);
    updateAuthUI();
  } catch (error) {
    console.error(`[UI] Login gagal: Kredensial tidak valid.`);
  }
});

// 2. Fetch Profile Button Click (Private API)
fetchProfileBtn.addEventListener('click', async () => {
  console.log('[UI] Mengirim request ambil data profil via privateClient...');
  try {
    const response = await getProfileAPI();
    console.log('[UI] Pengambilan data profil berhasil!');
    
    // Update profile in UI
    const profile = response.userProfile;
    profileFullName.textContent = profile.fullName;
    profileUsername.textContent = profile.username;
    profileRole.textContent = profile.role;
    
    noProfileMsg.style.display = 'none';
    profileDetails.style.display = 'block';
  } catch (error) {
    console.error('[UI] Request profil ditolak oleh server (Gagal terotentikasi).');
  }
});

// 3. Fetch News Button Click (Public API)
fetchNewsBtn.addEventListener('click', async () => {
  console.log('[UI] Mengirim request ambil data berita via publicClient...');
  try {
    const response = await getNewsAPI();
    console.log(`[UI] Pengambilan berita berhasil: ${response.message}`);
    
    // Render News Items
    newsList.innerHTML = '';
    response.news.forEach(item => {
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'profile-field';
      fieldDiv.style.marginBottom = '10px';
      fieldDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">
          <span>${item.category}</span>
          <span>${item.date}</span>
        </div>
        <div style="font-size: 1rem; font-weight: 600; margin-top: 4px;">${item.title}</div>
      `;
      newsList.appendChild(fieldDiv);
    });

    noNewsMsg.style.display = 'none';
    newsList.style.display = 'block';
  } catch (error) {
    console.error('[UI] Gagal memuat berita.');
  }
});

// 4. Logout Button Click
logoutBtn.addEventListener('click', () => {
  console.log('[UI] Melakukan proses logout...');
  removeToken();
  updateAuthUI();
  console.log('[UI] Logout berhasil. Token di localStorage dihapus.');
});

// 5. Clear Logs Button Click
clearConsoleBtn.addEventListener('click', () => {
  const consoleLogs = document.getElementById('consoleLogs');
  if (consoleLogs) {
    consoleLogs.innerHTML = '';
    addLog('[System] Console dibersihkan.', 'info');
  }
});

// Initial UI Setup
updateAuthUI();
