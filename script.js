const STORAGE_KEY = "para-tycoon-v1";
const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' rx='28' fill='%231b4332'/><circle cx='60' cy='42' r='22' fill='%23f6bd60'/><path d='M24 100c8-20 24-30 36-30s28 10 36 30' fill='%232d6a4f'/></svg>";

const upgrades = [
  { id: "plus2", label: "+2 TL / sn", income: 2, basePrice: 25 },
  { id: "plus10", label: "+10 TL / sn", income: 10, basePrice: 120 },
  { id: "plus100", label: "+100 TL / sn", income: 100, basePrice: 1000 },
  { id: "plus500", label: "+500 TL / sn", income: 500, basePrice: 4500 },
  { id: "plus1000", label: "+1000 TL / sn", income: 1000, basePrice: 9000 },
  { id: "plus5000", label: "+5000 TL / sn", income: 5000, basePrice: 40000 },
  { id: "plus10000", label: "+10000 TL / sn", income: 10000, basePrice: 75000 },
  { id: "plus50000", label: "+50000 TL / sn", income: 50000, basePrice: 300000 }
];

const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const avatarInput = document.getElementById("avatarInput");
const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");
const authMessage = document.getElementById("authMessage");
const welcomeName = document.getElementById("welcomeName");
const profileAvatar = document.getElementById("profileAvatar");
const moneyStat = document.getElementById("moneyStat");
const incomeStat = document.getElementById("incomeStat");
const joinDateStat = document.getElementById("joinDateStat");
const profileMoneyStat = document.getElementById("profileMoneyStat");
const bestMoneyStat = document.getElementById("bestMoneyStat");
const collectButton = document.getElementById("collectButton");
const logoutButton = document.getElementById("logoutButton");
const gameMessage = document.getElementById("gameMessage");
const shopList = document.getElementById("shopList");
const leaderboardList = document.getElementById("leaderboardList");
const clanNameInput = document.getElementById("clanNameInput");
const clanTagInput = document.getElementById("clanTagInput");
const clanAvatarInput = document.getElementById("clanAvatarInput");
const createClanButton = document.getElementById("createClanButton");
const clanList = document.getElementById("clanList");
const activeClanName = document.getElementById("activeClanName");
const clanInfoText = document.getElementById("clanInfoText");
const activeClanAvatar = document.getElementById("activeClanAvatar");
const clanMembers = document.getElementById("clanMembers");
const clanChatMessages = document.getElementById("clanChatMessages");
const clanChatInput = document.getElementById("clanChatInput");
const sendClanMessageButton = document.getElementById("sendClanMessageButton");

let state = loadState();
let currentUser = state.currentUser || null;
let pendingAvatar = null;
let pendingClanAvatar = null;

avatarInput.addEventListener("change", onAvatarChange);
clanAvatarInput.addEventListener("change", onClanAvatarChange);
registerButton.addEventListener("click", registerUser);
loginButton.addEventListener("click", loginUser);
collectButton.addEventListener("click", collectManualMoney);
logoutButton.addEventListener("click", logoutUser);
createClanButton.addEventListener("click", createClan);
sendClanMessageButton.addEventListener("click", sendClanMessage);

initialize();

function initialize() {
  render();
  setInterval(gameTick, 1000);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { currentUser: null, accounts: {}, clans: {} };
  }

  try {
    const parsed = JSON.parse(raw);
    parsed.accounts = parsed.accounts || {};
    parsed.currentUser = parsed.currentUser || null;
    parsed.clans = parsed.clans || {};

    Object.values(parsed.accounts).forEach((account) => hydrateUser(account));
    return parsed;
  } catch (error) {
    return { currentUser: null, accounts: {}, clans: {} };
  }
}

function saveState() {
  state.currentUser = currentUser;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrateUser(user) {
  user.money = Number(user.money || 0);
  user.baseIncome = Number(user.baseIncome || 1);
  user.bestScore = Number(user.bestScore || 0);
  user.avatar = user.avatar || defaultAvatar;
  user.upgradePrices = user.upgradePrices || createUpgradePrices();
  user.clanId = user.clanId || null;
  user.joinedAt = user.joinedAt || new Date().toISOString();
  updateBestScore(user);
}

function createUpgradePrices() {
  const prices = {};
  upgrades.forEach((upgrade) => {
    prices[upgrade.id] = upgrade.basePrice;
  });
  return prices;
}

function createUser(username, password, avatar) {
  return {
    username,
    password,
    avatar: avatar || defaultAvatar,
    money: 0,
    baseIncome: 1,
    bestScore: 0,
    upgradePrices: createUpgradePrices(),
    clanId: null,
    joinedAt: new Date().toISOString()
  };
}

function normalizeUsername(value) {
  return value.trim().toLowerCase();
}

function getUser() {
  if (!currentUser) return null;
  return state.accounts[currentUser] || null;
}

function onAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) {
    pendingAvatar = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    pendingAvatar = reader.result;
    authMessage.textContent = "Profil resmi hazir.";
  };
  reader.readAsDataURL(file);
}

function onClanAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) {
    pendingClanAvatar = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    pendingClanAvatar = reader.result;
    gameMessage.textContent = "Klan simgesi hazir.";
  };
  reader.readAsDataURL(file);
}

function registerUser() {
  const username = normalizeUsername(usernameInput.value);
  const password = passwordInput.value.trim();

  if (username.length < 3 || password.length < 3) {
    authMessage.textContent = "Isim ve sifre en az 3 karakter olsun.";
    return;
  }

  if (state.accounts[username]) {
    authMessage.textContent = "Bu isim zaten kayitli.";
    return;
  }

  state.accounts[username] = createUser(username, password, pendingAvatar);
  currentUser = username;
  clearInputs();
  saveState();
  render();
  gameMessage.textContent = "Hesap acildi. Para kazanmaya basladin.";
}

function loginUser() {
  const username = normalizeUsername(usernameInput.value);
  const password = passwordInput.value.trim();
  const user = state.accounts[username];

  if (!user || user.password !== password) {
    authMessage.textContent = "Isim veya sifre yanlis.";
    return;
  }

  currentUser = username;
  clearInputs();
  saveState();
  render();
  gameMessage.textContent = "Tekrar hos geldin.";
}

function logoutUser() {
  currentUser = null;
  saveState();
  render();
  authMessage.textContent = "Cikis yapildi.";
}

function clearInputs() {
  usernameInput.value = "";
  passwordInput.value = "";
  avatarInput.value = "";
  clanAvatarInput.value = "";
  pendingAvatar = null;
}

function collectManualMoney() {
  const user = getUser();
  if (!user) return;

  user.money += 1;
  sync("Elle +1 TL alindi.");
}

function gameTick() {
  const user = getUser();
  if (!user) return;

  user.money += user.baseIncome;
  sync();
}

function buyUpgrade(id) {
  const user = getUser();
  const upgrade = upgrades.find((entry) => entry.id === id);
  if (!user || !upgrade) return;

  const price = user.upgradePrices[id];
  if (user.money < price) {
    gameMessage.textContent = "Bu gelistirme icin yeterli paran yok.";
    return;
  }

  user.money -= price;
  user.baseIncome += upgrade.income;
  user.upgradePrices[id] = price * 2;
  sync(`${upgrade.label} satin alindi. Fiyati ikiye katlandi.`);
}

function sync(message) {
  const user = getUser();
  if (user) {
    updateBestScore(user);
  }

  saveState();
  renderApp();
  if (message) {
    gameMessage.textContent = message;
  }
}

function render() {
  const loggedIn = Boolean(getUser());
  authScreen.classList.toggle("hidden", loggedIn);
  app.classList.toggle("hidden", !loggedIn);

  if (loggedIn) {
    renderApp();
  }
}

function renderApp() {
  const user = getUser();
  if (!user) return;

  updateBestScore(user);
  welcomeName.textContent = user.username;
  profileAvatar.src = user.avatar || defaultAvatar;
  moneyStat.textContent = `${formatNumber(user.money)} TL`;
  incomeStat.textContent = `${formatNumber(user.baseIncome)} TL`;
  joinDateStat.textContent = formatDate(user.joinedAt);
  profileMoneyStat.textContent = `${formatNumber(user.money)} TL`;
  bestMoneyStat.textContent = `${formatNumber(user.bestScore)} TL`;

  shopList.innerHTML = upgrades.map((upgrade) => `
    <article class="shop-item">
      <div>
        <strong>${upgrade.label}</strong>
        <p>Mevcut fiyat: ${formatNumber(user.upgradePrices[upgrade.id])} TL</p>
      </div>
      <button class="primary-button" data-upgrade-id="${upgrade.id}">
        Satin Al
      </button>
    </article>
  `).join("");

  document.querySelectorAll("[data-upgrade-id]").forEach((button) => {
    button.addEventListener("click", () => buyUpgrade(button.dataset.upgradeId));
  });

  renderLeaderboard();
  renderClans();
}

function updateBestScore(user) {
  user.bestScore = Math.max(Number(user.bestScore || 0), Number(user.money || 0));
}

function getLeaderboardEntries() {
  return Object.values(state.accounts)
    .map((account) => {
      hydrateUser(account);
      return {
        username: account.username,
        bestScore: Number(account.bestScore || 0),
        income: Number(account.baseIncome || 1)
      };
    })
    .sort((left, right) => {
      if (right.bestScore !== left.bestScore) {
        return right.bestScore - left.bestScore;
      }

      return right.income - left.income;
    })
    .slice(0, 20);
}

function renderLeaderboard() {
  if (!leaderboardList) return;

  const entries = getLeaderboardEntries();
  if (!entries.length) {
    leaderboardList.innerHTML = `
      <article class="leaderboard-empty">
        Henuz kayitli skor yok. Ilk siraya yerlesmek icin oyuna basla.
      </article>
    `;
    return;
  }

  leaderboardList.innerHTML = entries.map((entry, index) => `
    <article class="leaderboard-item">
      <div class="leaderboard-rank">${index + 1}</div>
      <div class="leaderboard-meta">
        <strong>${entry.username}</strong>
        <span>Gelir: ${formatNumber(entry.income)} TL / sn</span>
      </div>
      <div class="leaderboard-score">
        <strong>${formatNumber(entry.bestScore)} TL</strong>
        <span>En iyi skor</span>
      </div>
    </article>
  `).join("");
}

function createClan() {
  const user = getUser();
  if (!user) return;

  const name = clanNameInput.value.trim();
  const tag = clanTagInput.value.trim().toUpperCase();

  if (user.clanId) {
    gameMessage.textContent = "Zaten bir klandasin.";
    return;
  }

  if (user.money < 100000) {
    gameMessage.textContent = "Klan kurmak icin 100000 TL gerekiyor.";
    return;
  }

  if (name.length < 3 || tag.length < 2) {
    gameMessage.textContent = "Klan adi ve etiketi yeterince uzun olsun.";
    return;
  }

  const clanId = normalizeUsername(name);
  if (state.clans[clanId]) {
    gameMessage.textContent = "Bu klan zaten var.";
    return;
  }

  user.money -= 100000;
  user.clanId = clanId;
  state.clans[clanId] = {
    id: clanId,
    name,
    tag,
    avatar: pendingClanAvatar || defaultAvatar,
    owner: user.username,
    members: [user.username],
    chat: [`(${tag})${user.username}: Klan kuruldu.`]
  };

  clanNameInput.value = "";
  clanTagInput.value = "";
  clanAvatarInput.value = "";
  pendingClanAvatar = null;
  sync("Klan kuruldu.");
}

function renderClans() {
  const user = getUser();
  const clans = Object.values(state.clans || {});

  if (!clans.length) {
    clanList.innerHTML = '<article class="leaderboard-empty">Henuz klan yok. Ilk klani sen kur.</article>';
  } else {
    clanList.innerHTML = clans.map((clan) => `
      <article class="clan-item">
        <div class="clan-item-main">
          <img src="${clan.avatar || defaultAvatar}" class="clan-avatar" alt="${clan.name}">
          <div>
            <strong>${clan.name} (${clan.tag})</strong>
            <p>${clan.members.length} uye</p>
            <p>Katilma bedeli: 5000 TL</p>
          </div>
        </div>
        <button class="secondary-button" data-join-clan="${clan.id}" ${user.clanId === clan.id ? "disabled" : ""}>
          ${user.clanId === clan.id ? "Klandasin" : "5000 TL ile Katil"}
        </button>
      </article>
    `).join("");
  }

  document.querySelectorAll("[data-join-clan]").forEach((button) => {
    button.addEventListener("click", () => joinClan(button.dataset.joinClan));
  });

  renderActiveClan();
}

function joinClan(clanId) {
  const user = getUser();
  const clan = state.clans[clanId];
  if (!user || !clan) return;

  if (user.clanId) {
    gameMessage.textContent = "Baska bir klana girmek icin once mevcut klandan cikman gerekir.";
    return;
  }

  if (user.money < 5000) {
    gameMessage.textContent = "Bir klana katilmak icin 5000 TL gerekiyor.";
    return;
  }

  user.money -= 5000;
  user.clanId = clanId;
  clan.members.push(user.username);
  clan.chat.push(`(${clan.tag})${user.username}: Klana katildi.`);
  if (clan.chat.length > 40) {
    clan.chat.shift();
  }
  sync(`${clan.name} klanina katildin.`);
}

function renderActiveClan() {
  const user = getUser();
  if (!user || !user.clanId || !state.clans[user.clanId]) {
    activeClanName.textContent = "Klanin Yok";
    clanInfoText.textContent = "Klan sohbeti icin once bir klana katil.";
    activeClanAvatar.classList.add("hidden");
    clanMembers.innerHTML = "";
    clanChatMessages.innerHTML = '<p class="chat-line">Henuz klan mesaji yok.</p>';
    return;
  }

  const clan = state.clans[user.clanId];
  activeClanName.textContent = `${clan.name} (${clan.tag})`;
  clanInfoText.textContent = `${clan.members.length} uye var. Klandakiler burada konusabilir.`;
  activeClanAvatar.src = clan.avatar || defaultAvatar;
  activeClanAvatar.classList.remove("hidden");
  clanMembers.innerHTML = clan.members.map((memberName) => `
    <article class="clan-member-chip">${memberName}</article>
  `).join("");
  clanChatMessages.innerHTML = clan.chat.length
    ? clan.chat.map((message) => `<p class="chat-line">${message}</p>`).join("")
    : '<p class="chat-line">Henuz klan mesaji yok.</p>';
}

function sendClanMessage() {
  const user = getUser();
  if (!user || !user.clanId || !state.clans[user.clanId]) {
    gameMessage.textContent = "Mesaj gondermek icin bir klana katil.";
    return;
  }

  const text = clanChatInput.value.trim();
  if (!text) {
    return;
  }

  const clan = state.clans[user.clanId];
  clan.chat.push(`(${clan.tag})${user.username}: ${text}`);
  if (clan.chat.length > 40) {
    clan.chat.shift();
  }
  clanChatInput.value = "";
  sync("Klan mesajin gonderildi.");
}

function formatNumber(value) {
  return Math.floor(value).toLocaleString("tr-TR");
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
