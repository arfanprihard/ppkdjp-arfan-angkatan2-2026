// TODO 1: Impor fungsi yang dibutuhkan dari berkas latihan Anda
// impor loginAPI dari './api/auth.js'
// impor getProfileAPI dari './api/users.js'
// impor getNewsAPI dari './api/news.js'
// impor getToken, setToken, removeToken dari './utils/token.js'


// =========================================================
// SCRIPT LOGGER UTILITY (Jangan diubah, ini untuk mencetak log ke layar browser)
// =========================================================
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
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
console.log = (...args) => {
  originalLog(...args);
  const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
  if (msg.includes('[Interceptor Request]')) addLog(msg, 'request');
  else if (msg.includes('[Interceptor Response]')) addLog(msg, 'response');
  else addLog(msg, 'info');
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
// =========================================================

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

const fetchNewsBtn = document.getElementById('fetchNewsBtn');
const noNewsMsg = document.getElementById('noNewsMsg');
const newsList = document.getElementById('newsList');

// Sync UI dengan status otentikasi
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

// TODO 2: Lengkapi Event Listener Form Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  console.log(`[UI] Memulai proses login untuk: ${username}...`);
  try {
    // 1. Panggil loginAPI(username, password)
    // 2. Simpan token ke localStorage menggunakan setToken(token)
    // 3. Panggil updateAuthUI()
    // Tulis kode Anda di sini...
    
  } catch (error) {
    console.error(`[UI] Login gagal: Kredensial tidak valid.`);
  }
});

// TODO 3: Lengkapi Event Listener Ambil Data Profil (Private API)
fetchProfileBtn.addEventListener('click', async () => {
  console.log('[UI] Mengirim request ambil data profil via privateClient...');
  try {
    // 1. Panggil getProfileAPI()
    // 2. Tampilkan datanya ke UI (profileFullName, profileUsername, profileRole)
    // 3. Sembunyikan noProfileMsg dan tampilkan profileDetails
    // Tulis kode Anda di sini...

  } catch (error) {
    console.error('[UI] Request profil ditolak oleh server.');
  }
});

// TODO 4: Lengkapi Event Listener Ambil Berita Publik (Public API)
fetchNewsBtn.addEventListener('click', async () => {
  console.log('[UI] Mengirim request ambil data berita via publicClient...');
  try {
    // 1. Panggil getNewsAPI()
    // 2. Lakukan perulangan data berita dan render ke dalam newsList
    // 3. Sembunyikan noNewsMsg dan tampilkan newsList
    // Tulis kode Anda di sini...

  } catch (error) {
    console.error('[UI] Gagal memuat berita.');
  }
});

// TODO 5: Lengkapi Event Listener Logout
logoutBtn.addEventListener('click', () => {
  console.log('[UI] Melakukan proses logout...');
  // 1. Panggil removeToken()
  // 2. Panggil updateAuthUI()
  // Tulis kode Anda di sini...
});

clearConsoleBtn.addEventListener('click', () => {
  const consoleLogs = document.getElementById('consoleLogs');
  if (consoleLogs) {
    consoleLogs.innerHTML = '';
    addLog('[System] Console dibersihkan.', 'info');
  }
});

// Jalankan fungsi sinkronisasi UI saat halaman dimuat
updateAuthUI();
