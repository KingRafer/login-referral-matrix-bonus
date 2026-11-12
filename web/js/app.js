// ============================================================
// Referral Matrix System - Demo Web App
// Data disimpan di localStorage agar persisten di browser
// ============================================================

const STORAGE_KEY = 'rms_demo_v1';

// ---------- Default Seed Data ----------
const DEFAULT_DATA = {
  currentUser: null,
  users: [
    {
      id: 1,
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password: 'admin123',
      referralCode: 'ADMIN01',
      sponsorId: null,
      rank: 'Gold',
      role: 'admin',
      status: 'active',
      joinedAt: '2025-01-10',
      matrixPosition: 1
    },
    {
      id: 2,
      name: 'Budi Santoso',
      email: 'budi@mail.com',
      password: '123456',
      referralCode: 'BUDI02',
      sponsorId: 1,
      rank: 'Silver',
      role: 'member',
      status: 'active',
      joinedAt: '2025-02-15',
      matrixPosition: 2
    },
    {
      id: 3,
      name: 'Siti Aminah',
      email: 'siti@mail.com',
      password: '123456',
      referralCode: 'SITI03',
      sponsorId: 1,
      rank: 'Bronze',
      role: 'member',
      status: 'active',
      joinedAt: '2025-03-01',
      matrixPosition: 3
    },
    {
      id: 4,
      name: 'Andi Wijaya',
      email: 'andi@mail.com',
      password: '123456',
      referralCode: 'ANDI04',
      sponsorId: 2,
      rank: 'Bronze',
      role: 'member',
      status: 'active',
      joinedAt: '2025-03-20',
      matrixPosition: 4
    },
    {
      id: 5,
      name: 'Rina Putri',
      email: 'rina@mail.com',
      password: '123456',
      referralCode: 'RINA05',
      sponsorId: 2,
      rank: 'Bronze',
      role: 'member',
      status: 'active',
      joinedAt: '2025-04-05',
      matrixPosition: 5
    },
    {
      id: 6,
      name: 'Doni Pratama',
      email: 'doni@mail.com',
      password: '123456',
      referralCode: 'DONI06',
      sponsorId: 3,
      rank: 'Bronze',
      role: 'member',
      status: 'active',
      joinedAt: '2025-04-18',
      matrixPosition: 6
    }
  ],
  bonusSettings: [
    { id: 1, name: 'Direct Referral', type: 'referral', percent: 10, level: 1, active: true },
    { id: 2, name: 'Level 2 Referral', type: 'referral', percent: 5, level: 2, active: true },
    { id: 3, name: 'Matrix Cycle Bonus', type: 'matrix', percent: 0, level: 1, active: true, amount: 150000 },
    { id: 4, name: 'Matching Bonus', type: 'matching', percent: 5, level: 3, active: true },
    { id: 5, name: 'Rank Gold Bonus', type: 'rank', percent: 0, level: 1, active: false, amount: 500000 }
  ],
  bonusHistory: [
    { id: 1, userId: 1, type: 'referral', from: 'Budi Santoso', desc: 'Direct referral bonus', amount: 250000, date: '2025-02-15' },
    { id: 2, userId: 1, type: 'referral', from: 'Siti Aminah', desc: 'Direct referral bonus', amount: 250000, date: '2025-03-01' },
    { id: 3, userId: 1, type: 'matching', from: 'Budi Santoso', desc: 'Matching dari downline', amount: 50000, date: '2025-03-22' },
    { id: 4, userId: 1, type: 'matrix', from: 'System', desc: 'Matrix cycle complete', amount: 150000, date: '2025-04-10' },
    { id: 5, userId: 2, type: 'referral', from: 'Andi Wijaya', desc: 'Direct referral bonus', amount: 200000, date: '2025-03-20' },
    { id: 6, userId: 1, type: 'referral', from: 'Rina Putri', desc: 'Level 2 referral', amount: 100000, date: '2025-04-05' }
  ],
  activities: [
    { text: 'Rina Putri bergabung via referral Budi', time: '2 hari lalu', icon: 'user-plus' },
    { text: 'Matrix cycle completed — bonus Rp 150.000', time: '5 hari lalu', icon: 'check-circle' },
    { text: 'Doni Pratama bergabung via referral Siti', time: '1 minggu lalu', icon: 'user-plus' },
    { text: 'Andi Wijaya upgrade rank ke Bronze', time: '2 minggu lalu', icon: 'trophy' }
  ],
  matrixSize: 2,
  nextUserId: 7,
  nextBonusId: 6,
  nextHistoryId: 7
};

// ---------- State ----------
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return structuredClone(DEFAULT_DATA);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------- Auth ----------
function switchAuthTab(tab) {
  document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('form-register').classList.toggle('hidden', tab !== 'register');
  document.getElementById('tab-login').className = tab === 'login'
    ? 'flex-1 py-2.5 rounded-lg text-sm font-medium bg-primary-600 text-white transition'
    : 'flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition';
  document.getElementById('tab-register').className = tab === 'register'
    ? 'flex-1 py-2.5 rounded-lg text-sm font-medium bg-primary-600 text-white transition'
    : 'flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition';
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass = document.getElementById('login-password').value;
  const user = state.users.find(u => u.email === email && u.password === pass);
  if (!user) {
    showToast('Email atau password salah', 'error');
    return;
  }
  state.currentUser = user.id;
  saveState();
  enterApp();
  showToast('Login berhasil! Selamat datang, ' + user.name);
}

function doRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pass = document.getElementById('reg-password').value;
  const refCode = document.getElementById('reg-referral').value.trim().toUpperCase();

  if (!name || !email || !pass) {
    showToast('Lengkapi semua field wajib', 'error');
    return;
  }
  if (state.users.find(u => u.email === email)) {
    showToast('Email sudah terdaftar', 'error');
    return;
  }

  let sponsorId = null;
  if (refCode) {
    const sponsor = state.users.find(u => u.referralCode === refCode);
    if (!sponsor) {
      showToast('Kode referral tidak valid', 'error');
      return;
    }
    sponsorId = sponsor.id;
  }

  const newUser = {
    id: state.nextUserId++,
    name,
    email,
    password: pass,
    referralCode: generateRefCode(name),
    sponsorId,
    rank: 'Bronze',
    role: 'member',
    status: 'active',
    joinedAt: new Date().toISOString().slice(0, 10),
    matrixPosition: state.users.length + 1
  };

  state.users.push(newUser);

  if (sponsorId) {
    const sponsor = state.users.find(u => u.id === sponsorId);
    state.activities.unshift({
      text: `${name} bergabung via referral ${sponsor.name}`,
      time: 'Baru saja',
      icon: 'user-plus'
    });

    const setting = state.bonusSettings.find(s => s.type === 'referral' && s.level === 1 && s.active);
    if (setting) {
      const amount = setting.amount || Math.round(250000 * (setting.percent / 10));
      state.bonusHistory.unshift({
        id: state.nextHistoryId++,
        userId: sponsorId,
        type: 'referral',
        from: name,
        desc: 'Direct referral bonus',
        amount,
        date: new Date().toISOString().slice(0, 10)
      });
    }
  }

  state.currentUser = newUser.id;
  saveState();
  enterApp();
  showToast('Registrasi berhasil! Selamat datang, ' + name);
}

function generateRefCode(name) {
  const base = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const num = String(state.nextUserId).padStart(2, '0');
  return base + num;
}

function doLogout() {
  state.currentUser = null;
  saveState();
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
}

function getCurrentUser() {
  return state.users.find(u => u.id === state.currentUser);
}

function enterApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  const user = getCurrentUser();
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-role').textContent = user.role === 'admin' ? 'Admin' : 'Member';
  document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('my-ref-code').textContent = user.referralCode;
  showPage('dashboard');
}

// ---------- Navigation ----------
function showPage(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
  document.getElementById('page-' + page).classList.remove('hidden');
  document.querySelectorAll('.sidebar-link').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
  const titles = {
    dashboard: 'Dashboard',
    referral: 'Referral',
    matrix: 'Matrix',
    bonus: 'Bonus Saya',
    settings: 'Setting Bonus',
    members: 'Members'
  };
  document.getElementById('page-title').textContent = titles[page] || page;

  if (page === 'dashboard') renderDashboard();
  if (page === 'referral') renderReferral();
  if (page === 'matrix') renderMatrix();
  if (page === 'bonus') renderBonusHistory();
  if (page === 'settings') renderBonusSettings();
  if (page === 'members') renderMembers();
}

// ---------- Dashboard ----------
function renderDashboard() {
  const user = getCurrentUser();
  const downlines = getDownlines(user.id);
  document.getElementById('stat-downline').textContent = downlines.length;

  const myBonus = state.bonusHistory
    .filter(b => b.userId === user.id)
    .reduce((sum, b) => sum + b.amount, 0);
  document.getElementById('stat-bonus').textContent = formatRp(myBonus);
  document.getElementById('stat-rank').textContent = user.rank;

  const actEl = document.getElementById('activity-list');
  actEl.innerHTML = state.activities.slice(0, 5).map(a => `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
        <i class="fas fa-${a.icon} text-xs"></i>
      </div>
      <div>
        <div class="text-slate-200">${a.text}</div>
        <div class="text-xs text-slate-500">${a.time}</div>
      </div>
    </div>
  `).join('');

  const byType = {};
  state.bonusHistory.filter(b => b.userId === user.id).forEach(b => {
    byType[b.type] = (byType[b.type] || 0) + b.amount;
  });
  const sumEl = document.getElementById('bonus-summary');
  const typeLabel = { referral: 'Referral', matrix: 'Matrix', matching: 'Matching', rank: 'Rank' };
  sumEl.innerHTML = Object.keys(byType).length
    ? Object.entries(byType).map(([t, amt]) => `
        <div class="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary-400"></span>
            <span class="text-sm">${typeLabel[t] || t}</span>
          </div>
          <span class="font-medium text-sm">${formatRp(amt)}</span>
        </div>
      `).join('')
    : '<p class="text-sm text-slate-500">Belum ada bonus</p>';
}

// ---------- Referral ----------
function getDownlines(userId, level = 1, maxLevel = 5) {
  const result = [];
  const direct = state.users.filter(u => u.sponsorId === userId);
  direct.forEach(u => {
    result.push({ ...u, level });
    if (level < maxLevel) {
      result.push(...getDownlines(u.id, level + 1, maxLevel));
    }
  });
  return result;
}

function renderReferral() {
  const user = getCurrentUser();
  const link = `${window.location.origin}${window.location.pathname}?ref=${user.referralCode}`;
  document.getElementById('ref-link').value = link;

  const downlines = getDownlines(user.id);
  document.getElementById('downline-count').textContent = downlines.length + ' member';

  const tbody = document.getElementById('downline-table');
  if (!downlines.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-5 py-8 text-center text-slate-500">Belum ada downline. Bagikan link referral Anda!</td></tr>`;
    return;
  }
  tbody.innerHTML = downlines.map(u => {
    const bonusFrom = state.bonusHistory
      .filter(b => b.userId === user.id && b.from === u.name)
      .reduce((s, b) => s + b.amount, 0);
    return `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center text-xs font-bold text-primary-300">${u.name.charAt(0)}</div>
            <div>
              <div class="font-medium">${u.name}</div>
              <div class="text-xs text-slate-500">${u.email}</div>
            </div>
          </div>
        </td>
        <td class="px-5 py-3"><span class="text-xs bg-slate-800 px-2 py-1 rounded">L${u.level}</span></td>
        <td class="px-5 py-3 text-slate-400">${u.joinedAt}</td>
        <td class="px-5 py-3"><span class="text-xs px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}">${u.status}</span></td>
        <td class="px-5 py-3 text-right font-medium text-emerald-400">${bonusFrom ? formatRp(bonusFrom) : '-'}</td>
      </tr>
    `;
  }).join('');
}

function copyRefLink() {
  const input = document.getElementById('ref-link');
  navigator.clipboard.writeText(input.value).then(() => showToast('Link berhasil disalin!'));
}

// ---------- Matrix ----------
function changeMatrixSize(size) {
  state.matrixSize = size;
  saveState();
  document.querySelectorAll('.matrix-size-btn').forEach(btn => {
    const active = Number(btn.dataset.size) === size;
    btn.className = active
      ? 'matrix-size-btn px-3 py-1.5 rounded-lg text-xs bg-primary-600 text-white'
      : 'matrix-size-btn px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:bg-slate-700';
  });
  renderMatrix();
}

function buildMatrixTree(rootUser, width, maxDepth = 3) {
  const nodes = [];
  const queue = [{ user: rootUser, depth: 0, parentIdx: null }];
  const placed = new Set([rootUser.id]);

  while (queue.length && nodes.length < 40) {
    const { user, depth, parentIdx } = queue.shift();
    if (depth > maxDepth) continue;
    const idx = nodes.length;
    nodes.push({ user, depth, parentIdx, children: [] });
    if (parentIdx !== null) nodes[parentIdx].children.push(idx);

    const children = state.users
      .filter(u => u.sponsorId === user.id && !placed.has(u.id))
      .slice(0, width);

    if (children.length < width && depth < maxDepth) {
      const extras = state.users
        .filter(u => !placed.has(u.id) && u.id !== rootUser.id)
        .slice(0, width - children.length);
      children.push(...extras);
    }

    children.forEach(c => {
      placed.add(c.id);
      queue.push({ user: c, depth: depth + 1, parentIdx: idx });
    });

    for (let i = children.length; i < width && depth < maxDepth; i++) {
      const emptyIdx = nodes.length;
      nodes.push({ user: null, depth: depth + 1, parentIdx: idx, children: [] });
      nodes[idx].children.push(emptyIdx);
    }
  }
  return nodes;
}

function renderMatrix() {
  const user = getCurrentUser();
  const width = state.matrixSize;
  const maxDepth = width === 2 ? 3 : 2;
  const nodes = buildMatrixTree(user, width, maxDepth);

  const levels = {};
  nodes.forEach((n, i) => {
    if (!levels[n.depth]) levels[n.depth] = [];
    levels[n.depth].push({ ...n, idx: i });
  });

  const container = document.getElementById('matrix-tree');
  let html = '';

  Object.keys(levels).sort((a, b) => a - b).forEach(depth => {
    const levelNodes = levels[depth];
    html += `<div class="flex justify-center gap-4 mb-6 relative">`;
    levelNodes.forEach(n => {
      if (n.user) {
        const isMe = n.user.id === user.id;
        html += `
          <div class="matrix-node flex flex-col items-center">
            <div class="w-20 h-20 rounded-2xl ${isMe ? 'bg-primary-600 ring-2 ring-primary-400' : 'bg-slate-800 border border-slate-700'} flex flex-col items-center justify-center cursor-default shadow-lg">
              <div class="w-8 h-8 rounded-full ${isMe ? 'bg-white/20' : 'bg-primary-600/30'} flex items-center justify-center text-xs font-bold mb-1">${n.user.name.charAt(0)}</div>
              <div class="text-[10px] font-medium truncate w-16 text-center">${n.user.name.split(' ')[0]}</div>
            </div>
            <div class="text-[10px] text-slate-500 mt-1">${n.user.rank}</div>
          </div>
        `;
      } else {
        html += `
          <div class="matrix-node flex flex-col items-center">
            <div class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600">
              <i class="fas fa-plus text-lg"></i>
            </div>
            <div class="text-[10px] text-slate-600 mt-1">Kosong</div>
          </div>
        `;
      }
    });
    html += `</div>`;
  });

  container.innerHTML = html;

  const filled = nodes.filter(n => n.user).length;
  const empty = nodes.filter(n => !n.user).length;
  document.getElementById('matrix-filled').textContent = filled;
  document.getElementById('matrix-empty').textContent = empty;
  document.getElementById('matrix-cycles').textContent = Math.floor(filled / (width * width));
}

// ---------- Bonus History ----------
function renderBonusHistory() {
  const user = getCurrentUser();
  const list = state.bonusHistory.filter(b => b.userId === user.id);
  const tbody = document.getElementById('bonus-table');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-5 py-8 text-center text-slate-500">Belum ada riwayat bonus</td></tr>`;
    return;
  }
  const typeBadge = {
    referral: 'bg-primary-500/20 text-primary-300',
    matrix: 'bg-cyan-500/20 text-cyan-300',
    matching: 'bg-amber-500/20 text-amber-300',
    rank: 'bg-yellow-500/20 text-yellow-300'
  };
  tbody.innerHTML = list.map(b => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-3 text-slate-400">${b.date}</td>
      <td class="px-5 py-3"><span class="text-xs px-2 py-1 rounded-full ${typeBadge[b.type] || 'bg-slate-700'}">${b.type}</span></td>
      <td class="px-5 py-3">${b.from}</td>
      <td class="px-5 py-3 text-slate-400">${b.desc}</td>
      <td class="px-5 py-3 text-right font-medium text-emerald-400">+${formatRp(b.amount)}</td>
    </tr>
  `).join('');
}

// ---------- Bonus Settings (Admin) ----------
let editingBonusId = null;

function renderBonusSettings() {
  const list = document.getElementById('bonus-settings-list');
  list.innerHTML = state.bonusSettings.map(s => `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-1">
          <span class="font-medium">${s.name}</span>
          <span class="text-xs px-2 py-0.5 rounded-full ${s.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}">${s.active ? 'Aktif' : 'Nonaktif'}</span>
          <span class="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">${s.type}</span>
        </div>
        <div class="text-sm text-slate-400">
          ${s.percent ? s.percent + '%' : formatRp(s.amount || 0)} · Level max: ${s.level}
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="editBonusSetting(${s.id})" class="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition">
          <i class="fas fa-pen text-xs"></i>
        </button>
        <button onclick="toggleBonusActive(${s.id})" class="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition ${s.active ? 'text-emerald-400' : 'text-slate-500'}">
          <i class="fas fa-power-off text-xs"></i>
        </button>
        <button onclick="deleteBonusSetting(${s.id})" class="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-900/50 flex items-center justify-center text-slate-400 hover:text-red-400 transition">
          <i class="fas fa-trash text-xs"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function openBonusModal(id = null) {
  editingBonusId = id;
  document.getElementById('modal-title').textContent = id ? 'Edit Bonus Setting' : 'Tambah Bonus Setting';
  if (id) {
    const s = state.bonusSettings.find(x => x.id === id);
    document.getElementById('bs-name').value = s.name;
    document.getElementById('bs-type').value = s.type;
    document.getElementById('bs-percent').value = s.percent || '';
    document.getElementById('bs-level').value = s.level;
    document.getElementById('bs-active').checked = s.active;
  } else {
    document.getElementById('bs-name').value = '';
    document.getElementById('bs-type').value = 'referral';
    document.getElementById('bs-percent').value = '';
    document.getElementById('bs-level').value = '1';
    document.getElementById('bs-active').checked = true;
  }
  document.getElementById('bonus-modal').classList.remove('hidden');
}

function closeBonusModal() {
  document.getElementById('bonus-modal').classList.add('hidden');
  editingBonusId = null;
}

function saveBonusSetting() {
  const name = document.getElementById('bs-name').value.trim();
  const type = document.getElementById('bs-type').value;
  const percent = Number(document.getElementById('bs-percent').value) || 0;
  const level = Number(document.getElementById('bs-level').value) || 1;
  const active = document.getElementById('bs-active').checked;

  if (!name) {
    showToast('Nama bonus wajib diisi', 'error');
    return;
  }

  if (editingBonusId) {
    const s = state.bonusSettings.find(x => x.id === editingBonusId);
    Object.assign(s, { name, type, percent, level, active });
    showToast('Bonus setting diperbarui');
  } else {
    state.bonusSettings.push({
      id: state.nextBonusId++,
      name, type, percent, level, active
    });
    showToast('Bonus setting ditambahkan');
  }
  saveState();
  closeBonusModal();
  renderBonusSettings();
}

function editBonusSetting(id) {
  openBonusModal(id);
}

function toggleBonusActive(id) {
  const s = state.bonusSettings.find(x => x.id === id);
  s.active = !s.active;
  saveState();
  renderBonusSettings();
  showToast(s.active ? 'Bonus diaktifkan' : 'Bonus dinonaktifkan');
}

function deleteBonusSetting(id) {
  if (!confirm('Hapus setting bonus ini?')) return;
  state.bonusSettings = state.bonusSettings.filter(x => x.id !== id);
  saveState();
  renderBonusSettings();
  showToast('Bonus setting dihapus');
}

// ---------- Members ----------
function renderMembers() {
  document.getElementById('member-count').textContent = state.users.length + ' member';
  const tbody = document.getElementById('members-table');
  tbody.innerHTML = state.users.map(u => {
    const sponsor = state.users.find(s => s.id === u.sponsorId);
    return `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center text-xs font-bold text-primary-300">${u.name.charAt(0)}</div>
            <div>
              <div class="font-medium">${u.name}</div>
              <div class="text-xs text-slate-500">${u.email}</div>
            </div>
          </div>
        </td>
        <td class="px-5 py-3 font-mono text-primary-300 text-xs">${u.referralCode}</td>
        <td class="px-5 py-3 text-slate-400">${sponsor ? sponsor.name : '—'}</td>
        <td class="px-5 py-3"><span class="text-xs bg-slate-800 px-2 py-1 rounded">${u.rank}</span></td>
        <td class="px-5 py-3 text-slate-400">${u.joinedAt}</td>
        <td class="px-5 py-3"><span class="text-xs px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}">${u.status}</span></td>
      </tr>
    `;
  }).join('');
}

// ---------- Utils ----------
function formatRp(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle text-red-400' : 'check-circle text-emerald-400'}"></i> ${msg}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 2800);
}

// ---------- Init ----------
(function init() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref) {
    switchAuthTab('register');
    document.getElementById('reg-referral').value = ref.toUpperCase();
  }

  if (state.currentUser) {
    enterApp();
  }
})();
