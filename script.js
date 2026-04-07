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
const collectButton = document.getElementById("collectButton");
const logoutButton = document.getElementById("logoutButton");
const gameMessage = document.getElementById("gameMessage");
const shopList = document.getElementById("shopList");

let state = loadState();
let currentUser = state.currentUser || null;
let pendingAvatar = null;

avatarInput.addEventListener("change", onAvatarChange);
registerButton.addEventListener("click", registerUser);
loginButton.addEventListener("click", loginUser);
collectButton.addEventListener("click", collectManualMoney);
logoutButton.addEventListener("click", logoutUser);

initialize();

function initialize() {
  render();
  setInterval(gameTick, 1000);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { currentUser: null, accounts: {} };
  }

  try {
    const parsed = JSON.parse(raw);
    parsed.accounts = parsed.accounts || {};
    parsed.currentUser = parsed.currentUser || null;

    Object.values(parsed.accounts).forEach((account) => hydrateUser(account));
    return parsed;
  } catch (error) {
    return { currentUser: null, accounts: {} };
  }
}

function saveState() {
  state.currentUser = currentUser;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrateUser(user) {
  user.money = Number(user.money || 0);
  user.baseIncome = Number(user.baseIncome || 1);
  user.avatar = user.avatar || defaultAvatar;
  user.upgradePrices = user.upgradePrices || createUpgradePrices();
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
    upgradePrices: createUpgradePrices()
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

  welcomeName.textContent = user.username;
  profileAvatar.src = user.avatar || defaultAvatar;
  moneyStat.textContent = `${formatNumber(user.money)} TL`;
  incomeStat.textContent = `${formatNumber(user.baseIncome)} TL`;

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
}

function formatNumber(value) {
  return Math.floor(value).toLocaleString("tr-TR");
}
