
const STORAGE_KEY = "para-tycoon-v2";
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

const chestDefs = [
  { id: "bronze", label: "Bronz Sandik", price: 3000, moneyMin: 400, moneyMax: 6000, rareChance: 0.08, rareItem: "Lucky Kedi", bonusIncome: 5 },
  { id: "silver", label: "Gumus Sandik", price: 20000, moneyMin: 6000, moneyMax: 45000, rareChance: 0.14, rareItem: "Altin Yazici", bonusIncome: 25 },
  { id: "gold", label: "Altin Sandik", price: 100000, moneyMin: 25000, moneyMax: 220000, rareChance: 0.22, rareItem: "Kraliyet Kasasi", bonusIncome: 90 }
];

const achievementDefs = [
  { id: "first1000", title: "Ilk Adim", description: "1000 TL gor.", check: (user) => user.bestScore >= 1000 },
  { id: "rich50k", title: "Zengin Baslangic", description: "50000 TL gor.", check: (user) => user.bestScore >= 50000 },
  { id: "tycoon1m", title: "Mini Tycoon", description: "1000000 TL gor.", check: (user) => user.bestScore >= 1000000 },
  { id: "shopper", title: "Alisverisci", description: "10 satin alma yap.", check: (user) => user.purchaseCount >= 10 },
  { id: "grinder", title: "Caliskan", description: "1 saat oyna.", check: (user) => user.playSeconds >= 3600 },
  { id: "social", title: "Sosyallik", description: "Bir klana katil.", check: (user) => Boolean(user.clanId) },
  { id: "chest", title: "Hazine Avcisi", description: "5 sandik ac.", check: (user) => user.stats.chestOpens >= 5 },
  { id: "bonus", title: "Sadik Oyuncu", description: "Gunluk bonus al.", check: (user) => user.stats.dailyBonusClaims >= 1 }
];

const missionTemplates = [
  { id: "manual10", label: "10 kere tikla", type: "manualClicks", target: 10, reward: 800 },
  { id: "manual40", label: "40 kere tikla", type: "manualClicks", target: 40, reward: 2500 },
  { id: "earn5000", label: "5000 TL kazan", type: "totalEarned", target: 5000, reward: 1200 },
  { id: "earn50000", label: "50000 TL kazan", type: "totalEarned", target: 50000, reward: 12000 },
  { id: "buy2", label: "2 gelistirme satin al", type: "upgradesBought", target: 2, reward: 1500 },
  { id: "buy5", label: "5 gelistirme satin al", type: "upgradesBought", target: 5, reward: 8000 },
  { id: "open1", label: "1 sandik ac", type: "chestOpens", target: 1, reward: 2000 },
  { id: "open3", label: "3 sandik ac", type: "chestOpens", target: 3, reward: 12000 }
];
const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");
const notificationStack = document.getElementById("notificationStack");
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
const profileClanStat = document.getElementById("profileClanStat");
const playTimeStat = document.getElementById("playTimeStat");
const purchaseCountStat = document.getElementById("purchaseCountStat");
const collectButton = document.getElementById("collectButton");
const logoutButton = document.getElementById("logoutButton");
const gameMessage = document.getElementById("gameMessage");
const dailyBonusText = document.getElementById("dailyBonusText");
const claimDailyBonusButton = document.getElementById("claimDailyBonusButton");
const soundToggleButton = document.getElementById("soundToggleButton");
const missionList = document.getElementById("missionList");
const achievementList = document.getElementById("achievementList");
const shopList = document.getElementById("shopList");
const chestList = document.getElementById("chestList");
const leaderboardList = document.getElementById("leaderboardList");
const clanNameInput = document.getElementById("clanNameInput");
const clanTagInput = document.getElementById("clanTagInput");
const clanAvatarInput = document.getElementById("clanAvatarInput");
const createClanButton = document.getElementById("createClanButton");
const clanList = document.getElementById("clanList");
const activeClanName = document.getElementById("activeClanName");
const clanInfoText = document.getElementById("clanInfoText");
const activeClanAvatar = document.getElementById("activeClanAvatar");
const clanTreasuryStat = document.getElementById("clanTreasuryStat");
const clanContributionStat = document.getElementById("clanContributionStat");
const clanTreasuryInfo = document.getElementById("clanTreasuryInfo");
const clanMembers = document.getElementById("clanMembers");
const clanAnnouncementInput = document.getElementById("clanAnnouncementInput");
const sendAnnouncementButton = document.getElementById("sendAnnouncementButton");
const leaveClanButton = document.getElementById("leaveClanButton");
const clanAnnouncementText = document.getElementById("clanAnnouncementText");
const clanChatMessages = document.getElementById("clanChatMessages");
const clanChatInput = document.getElementById("clanChatInput");
const sendClanMessageButton = document.getElementById("sendClanMessageButton");
const playerDirectory = document.getElementById("playerDirectory");
const playerProfileDialog = document.getElementById("playerProfileDialog");
const closePlayerProfileButton = document.getElementById("closePlayerProfileButton");
const dialogAvatar = document.getElementById("dialogAvatar");
const dialogUsername = document.getElementById("dialogUsername");
const dialogClan = document.getElementById("dialogClan");
const dialogJoinDate = document.getElementById("dialogJoinDate");
const dialogMoney = document.getElementById("dialogMoney");
const dialogBestScore = document.getElementById("dialogBestScore");
const dialogIncome = document.getElementById("dialogIncome");
const dialogPlayTime = document.getElementById("dialogPlayTime");
const dialogPurchases = document.getElementById("dialogPurchases");

let state = loadState();
let currentUser = state.currentUser || null;
let pendingAvatar = null;
let pendingClanAvatar = null;
let audioContext = null;

avatarInput.addEventListener("change", onAvatarChange);
clanAvatarInput.addEventListener("change", onClanAvatarChange);
registerButton.addEventListener("click", registerUser);
loginButton.addEventListener("click", loginUser);
collectButton.addEventListener("click", collectManualMoney);
logoutButton.addEventListener("click", logoutUser);
createClanButton.addEventListener("click", createClan);
sendClanMessageButton.addEventListener("click", sendClanMessage);
claimDailyBonusButton.addEventListener("click", claimDailyBonus);
soundToggleButton.addEventListener("click", toggleSound);
sendAnnouncementButton.addEventListener("click", sendClanAnnouncement);
leaveClanButton.addEventListener("click", leaveClan);
closePlayerProfileButton.addEventListener("click", () => playerProfileDialog.close());

initialize();

function initialize() {
  render();
  setInterval(gameTick, 1000);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { currentUser: null, accounts: {}, clans: {} };

  try {
    const parsed = JSON.parse(raw);
    parsed.accounts = parsed.accounts || {};
    parsed.clans = parsed.clans || {};
    Object.values(parsed.accounts).forEach((account) => hydrateUser(account));
    Object.values(parsed.clans).forEach((clan) => hydrateClan(clan));
    return parsed;
  } catch (error) {
    return { currentUser: null, accounts: {}, clans: {} };
  }
}

function saveState() {
  state.currentUser = currentUser;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrateClan(clan) {
  clan.avatar = clan.avatar || defaultAvatar;
  clan.members = clan.members || [];
  clan.chat = clan.chat || [];
  clan.announcement = clan.announcement || "Aktif klan duyurusu yok.";
}

function hydrateUser(user) {
  user.money = Number(user.money || 0);
  user.baseIncome = Number(user.baseIncome || 1);
  user.bestScore = Number(user.bestScore || 0);
  user.avatar = user.avatar || defaultAvatar;
  user.upgradePrices = user.upgradePrices || createUpgradePrices();
  user.clanId = user.clanId || null;
  user.joinedAt = user.joinedAt || new Date().toISOString();
  user.playSeconds = Number(user.playSeconds || 0);
  user.purchaseCount = Number(user.purchaseCount || 0);
  user.totalEarned = Number(user.totalEarned || 0);
  user.soundEnabled = user.soundEnabled !== false;
  user.rareItems = user.rareItems || [];
  user.achievements = user.achievements || {};
  user.lastDailyBonus = user.lastDailyBonus || "";
  user.lastMissionDate = user.lastMissionDate || "";
  user.missions = user.missions || [];
  user.stats = user.stats || { manualClicks: 0, upgradesBought: 0, chestOpens: 0, dailyBonusClaims: 0 };
  refreshDailyMissions(user);
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
  const user = {
    username,
    password,
    avatar: avatar || defaultAvatar,
    money: 0,
    baseIncome: 1,
    bestScore: 0,
    upgradePrices: createUpgradePrices(),
    clanId: null,
    joinedAt: new Date().toISOString(),
    playSeconds: 0,
    purchaseCount: 0,
    totalEarned: 0,
    soundEnabled: true,
    rareItems: [],
    achievements: {},
    lastDailyBonus: "",
    lastMissionDate: "",
    missions: [],
    stats: { manualClicks: 0, upgradesBought: 0, chestOpens: 0, dailyBonusClaims: 0 }
  };
  refreshDailyMissions(user);
  return user;
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
    notify("Klan simgesi hazir.");
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
  notify("Hesap acildi. Para kazanmaya basladin.", "success");
  playSound("success");
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
  notify("Tekrar hos geldin.", "success");
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
  pendingClanAvatar = null;
}

function collectManualMoney() {
  const user = getUser();
  if (!user) return;
  user.money += 1;
  user.totalEarned += 1;
  user.stats.manualClicks += 1;
  sync("Elle +1 TL alindi.", false);
  playSound("click");
}

function gameTick() {
  const user = getUser();
  if (!user) return;
  user.money += totalIncome(user);
  user.totalEarned += totalIncome(user);
  user.playSeconds += 1;
  sync("", false);
}

function totalIncome(user) {
  const rareBonus = user.rareItems.reduce((sum, item) => sum + item.bonusIncome, 0);
  return user.baseIncome + rareBonus;
}

function buyUpgrade(id) {
  const user = getUser();
  const upgrade = upgrades.find((entry) => entry.id === id);
  if (!user || !upgrade) return;

  const price = user.upgradePrices[id];
  if (user.money < price) {
    notify("Bu gelistirme icin yeterli paran yok.");
    return;
  }

  user.money -= price;
  user.baseIncome += upgrade.income;
  user.upgradePrices[id] = price * 2;
  user.purchaseCount += 1;
  user.stats.upgradesBought += 1;
  sync(`${upgrade.label} satin alindi. Fiyati x2 oldu.`, true);
  playSound("buy");
}

function buyChest(id) {
  const user = getUser();
  const chest = chestDefs.find((entry) => entry.id === id);
  if (!user || !chest) return;
  if (user.money < chest.price) {
    notify("Sandik icin yeterli paran yok.");
    return;
  }

  user.money -= chest.price;
  user.purchaseCount += 1;
  user.stats.chestOpens += 1;
  const moneyReward = randomInt(chest.moneyMin, chest.moneyMax);
  user.money += moneyReward;
  user.totalEarned += moneyReward;
  let message = `${chest.label} acildi. +${formatNumber(moneyReward)} TL geldi.`;

  if (Math.random() < chest.rareChance) {
    user.rareItems.push({ name: chest.rareItem, bonusIncome: chest.bonusIncome });
    message += ` Nadir esya kazandin: ${chest.rareItem}.`;
  }

  sync(message, true);
  playSound("success");
}

function sync(message, loud) {
  const user = getUser();
  if (user) {
    refreshDailyMissions(user);
    unlockAchievements(user);
    updateBestScore(user);
  }

  saveState();
  renderApp();
  if (message) {
    gameMessage.textContent = message;
    if (loud) notify(message, "success");
  }
}

function render() {
  const loggedIn = Boolean(getUser());
  authScreen.classList.toggle("hidden", loggedIn);
  app.classList.toggle("hidden", !loggedIn);
  if (loggedIn) renderApp();
}

function renderApp() {
  const user = getUser();
  if (!user) return;

  refreshDailyMissions(user);
  welcomeName.textContent = user.username;
  profileAvatar.src = user.avatar || defaultAvatar;
  moneyStat.textContent = `${formatNumber(user.money)} TL`;
  incomeStat.textContent = `${formatNumber(totalIncome(user))} TL`;
  joinDateStat.textContent = formatDate(user.joinedAt);
  profileMoneyStat.textContent = `${formatNumber(user.money)} TL`;
  bestMoneyStat.textContent = `${formatNumber(user.bestScore)} TL`;
  profileClanStat.textContent = getClanName(user);
  playTimeStat.textContent = formatPlayTime(user.playSeconds);
  purchaseCountStat.textContent = formatNumber(user.purchaseCount);
  dailyBonusText.textContent = canClaimDailyBonus(user)
    ? "Bugunun bonusu hazir."
    : "Bugun bonusu aldın, yarin tekrar gel.";
  claimDailyBonusButton.disabled = !canClaimDailyBonus(user);
  soundToggleButton.textContent = `Ses: ${user.soundEnabled ? "Acik" : "Kapali"}`;

  renderShop(user);
  renderChests();
  renderMissions(user);
  renderAchievements(user);
  renderLeaderboard();
  renderClans();
  renderPlayerDirectory();
}

function renderShop(user) {
  shopList.innerHTML = upgrades.map((upgrade) => `
    <article class="shop-item">
      <div>
        <strong>${upgrade.label}</strong>
        <p>Mevcut fiyat: ${formatNumber(user.upgradePrices[upgrade.id])} TL</p>
      </div>
      <button class="primary-button" data-upgrade-id="${upgrade.id}">Satin Al</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-upgrade-id]").forEach((button) => {
    button.addEventListener("click", () => buyUpgrade(button.dataset.upgradeId));
  });
}

function renderChests() {
  chestList.innerHTML = chestDefs.map((chest) => `
    <article class="shop-item">
      <div>
        <strong>${chest.label}</strong>
        <p>Fiyat: ${formatNumber(chest.price)} TL</p>
        <p>Nadir esya sansi: %${Math.round(chest.rareChance * 100)}</p>
      </div>
      <button class="secondary-button" data-chest-id="${chest.id}">Ac</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-chest-id]").forEach((button) => {
    button.addEventListener("click", () => buyChest(button.dataset.chestId));
  });
}

function renderMissions(user) {
  missionList.innerHTML = user.missions.map((mission) => {
    const progress = Math.min(100, Math.floor((mission.progress / mission.target) * 100));
    return `
      <article class="mission-item">
        <strong>${mission.label}</strong>
        <p>Odul: ${formatNumber(mission.reward)} TL</p>
        <p>${formatNumber(mission.progress)} / ${formatNumber(mission.target)}</p>
        <div class="mission-progress"><div class="mission-progress-fill" style="width:${progress}%"></div></div>
        <div class="button-row">
          <button class="primary-button" data-claim-mission="${mission.id}" ${mission.claimed || mission.progress < mission.target ? "disabled" : ""}>Odulu Al</button>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-claim-mission]").forEach((button) => {
    button.addEventListener("click", () => claimMission(button.dataset.claimMission));
  });
}

function renderAchievements(user) {
  achievementList.innerHTML = achievementDefs.map((achievement) => {
    const unlocked = Boolean(user.achievements[achievement.id]);
    return `
      <article class="achievement-item ${unlocked ? "unlocked" : ""}">
        <strong>${achievement.title}</strong>
        <p>${achievement.description}</p>
        <p>${unlocked ? "Acildi" : "Kilitli"}</p>
      </article>
    `;
  }).join("");
}

function refreshDailyMissions(user) {
  const today = todayKey();
  if (user.lastMissionDate === today && user.missions.length) {
    updateMissionProgress(user);
    return;
  }

  const pool = [...missionTemplates].sort(() => Math.random() - 0.5).slice(0, 3);
  user.missions = pool.map((mission) => ({
    ...mission,
    progress: 0,
    claimed: false
  }));
  user.lastMissionDate = today;
  updateMissionProgress(user);
}

function updateMissionProgress(user) {
  user.missions.forEach((mission) => {
    if (mission.type === "manualClicks") mission.progress = user.stats.manualClicks;
    if (mission.type === "upgradesBought") mission.progress = user.stats.upgradesBought;
    if (mission.type === "chestOpens") mission.progress = user.stats.chestOpens;
    if (mission.type === "totalEarned") mission.progress = user.totalEarned;
  });
}

function claimMission(missionId) {
  const user = getUser();
  const mission = user ? user.missions.find((entry) => entry.id === missionId) : null;
  if (!user || !mission || mission.claimed || mission.progress < mission.target) return;
  mission.claimed = true;
  user.money += mission.reward;
  user.totalEarned += mission.reward;
  sync(`Gorev odulu alindi: +${formatNumber(mission.reward)} TL`, true);
}

function unlockAchievements(user) {
  achievementDefs.forEach((achievement) => {
    if (!user.achievements[achievement.id] && achievement.check(user)) {
      user.achievements[achievement.id] = true;
      notify(`Basarim acildi: ${achievement.title}`, "success");
      playSound("success");
    }
  });
}

function canClaimDailyBonus(user) {
  return user.lastDailyBonus !== todayKey();
}

function claimDailyBonus() {
  const user = getUser();
  if (!user || !canClaimDailyBonus(user)) return;
  const reward = 2000 + (totalIncome(user) * 20);
  user.lastDailyBonus = todayKey();
  user.money += reward;
  user.totalEarned += reward;
  user.stats.dailyBonusClaims += 1;
  sync(`Gunluk bonus alindi: +${formatNumber(reward)} TL`, true);
}

function toggleSound() {
  const user = getUser();
  if (!user) return;
  user.soundEnabled = !user.soundEnabled;
  saveState();
  renderApp();
  notify(`Ses ${user.soundEnabled ? "acildi" : "kapandi"}.`);
}

function updateBestScore(user) {
  user.bestScore = Math.max(Number(user.bestScore || 0), Number(user.money || 0));
}

function getLeaderboardEntries() {
  return Object.values(state.accounts)
    .map((account) => {
      hydrateUser(account);
      return { username: account.username, bestScore: account.bestScore, income: totalIncome(account) };
    })
    .sort((left, right) => right.bestScore - left.bestScore || right.income - left.income)
    .slice(0, 20);
}

function renderLeaderboard() {
  const entries = getLeaderboardEntries();
  leaderboardList.innerHTML = entries.length ? entries.map((entry, index) => `
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
  `).join("") : '<article class="leaderboard-empty">Henuz skor yok.</article>';
}

function renderPlayerDirectory() {
  const users = Object.values(state.accounts);
  playerDirectory.innerHTML = users.length ? users.map((entry) => `
    <article class="leaderboard-item">
      <div class="leaderboard-meta">
        <strong>${entry.username}</strong>
        <span>Klan: ${getClanName(entry)} | Para: ${formatNumber(entry.money)} TL</span>
      </div>
      <div class="button-row">
        <button class="secondary-button" data-open-profile="${entry.username}">Profili Ac</button>
      </div>
    </article>
  `).join("") : '<article class="leaderboard-empty">Henuz oyuncu yok.</article>';

  document.querySelectorAll("[data-open-profile]").forEach((button) => {
    button.addEventListener("click", () => openPlayerProfile(button.dataset.openProfile));
  });
}

function createClan() {
  const user = getUser();
  if (!user) return;
  const name = clanNameInput.value.trim();
  const tag = clanTagInput.value.trim().toUpperCase();

  if (user.clanId) return notify("Zaten bir klandasin.");
  if (user.money < 100000) return notify("Klan kurmak icin 100000 TL gerekiyor.");
  if (name.length < 3 || tag.length < 2) return notify("Klan adi ve etiketi yeterince uzun olsun.");

  const clanId = normalizeUsername(name);
  if (state.clans[clanId]) return notify("Bu klan zaten var.");

  user.money -= 100000;
  user.purchaseCount += 1;
  user.clanId = clanId;
  state.clans[clanId] = {
    id: clanId,
    name,
    tag,
    avatar: pendingClanAvatar || defaultAvatar,
    owner: user.username,
    members: [user.username],
    chat: [`(${tag})${user.username}: Klan kuruldu.`],
    announcement: "Aktif klan duyurusu yok."
  };

  clanNameInput.value = "";
  clanTagInput.value = "";
  clanAvatarInput.value = "";
  pendingClanAvatar = null;
  sync("Klan kuruldu.", true);
}

function renderClans() {
  const user = getUser();
  const clans = Object.values(state.clans || {});
  clanList.innerHTML = clans.length ? clans.map((clan) => `
    <article class="clan-item">
      <div class="clan-item-main">
        <img src="${clan.avatar || defaultAvatar}" class="clan-avatar" alt="${clan.name}">
        <div>
          <strong>${clan.name} (${clan.tag})</strong>
          <p>${clan.members.length} uye</p>
          <p>Lider: ${clan.owner}</p>
        </div>
      </div>
      <button class="secondary-button" data-join-clan="${clan.id}" ${user.clanId ? "disabled" : ""}>5000 TL ile Katil</button>
    </article>
  `).join("") : '<article class="leaderboard-empty">Henuz klan yok. Ilk klani sen kur.</article>';

  document.querySelectorAll("[data-join-clan]").forEach((button) => {
    button.addEventListener("click", () => joinClan(button.dataset.joinClan));
  });
  renderActiveClan();
}

function joinClan(clanId) {
  const user = getUser();
  const clan = state.clans[clanId];
  if (!user || !clan) return;
  if (user.clanId) return notify("Baska bir klana girmek icin once cik.");
  if (user.money < 5000) return notify("Bir klana katilmak icin 5000 TL gerekiyor.");
  user.money -= 5000;
  user.purchaseCount += 1;
  user.clanId = clanId;
  clan.members.push(user.username);
  clan.chat.push(`(${clan.tag})${user.username}: Klana katildi.`);
  sync(`${clan.name} klanina katildin.`, true);
}

function renderActiveClan() {
  const user = getUser();
  if (!user || !user.clanId || !state.clans[user.clanId]) {
    activeClanName.textContent = "Klanin Yok";
    clanInfoText.textContent = "Klan sohbeti icin once bir klana katil.";
    activeClanAvatar.classList.add("hidden");
    clanTreasuryStat.textContent = "0 TL";
    clanContributionStat.textContent = "0 TL";
    clanTreasuryInfo.textContent = "Hazir";
    clanMembers.innerHTML = "";
    clanAnnouncementText.textContent = "Aktif klan duyurusu yok.";
    clanChatMessages.innerHTML = '<p class="chat-line">Henuz klan mesaji yok.</p>';
    sendAnnouncementButton.disabled = true;
    leaveClanButton.disabled = true;
    return;
  }

  const clan = state.clans[user.clanId];
  const treasury = calculateClanTreasury(clan);
  const isOwner = clan.owner === user.username;
  activeClanName.textContent = `${clan.name} (${clan.tag})`;
  clanInfoText.textContent = `${clan.members.length} uye var. Rolun: ${isOwner ? "Baskan" : "Uye"}.`;
  activeClanAvatar.src = clan.avatar || defaultAvatar;
  activeClanAvatar.classList.remove("hidden");
  clanTreasuryStat.textContent = `${formatNumber(treasury.total)} TL`;
  clanContributionStat.textContent = `${formatNumber(treasury.mine)} TL`;
  clanTreasuryInfo.textContent = treasury.total > 0 ? "Doluyor" : "Bos";
  clanAnnouncementText.textContent = clan.announcement || "Aktif klan duyurusu yok.";
  sendAnnouncementButton.disabled = !isOwner;
  leaveClanButton.disabled = false;
  clanMembers.innerHTML = clan.members.map((memberName) => `
    <article class="clan-member-chip">${memberName}${memberName === clan.owner ? " (Baskan)" : ""}</article>
  `).join("");
  clanChatMessages.innerHTML = clan.chat.length
    ? clan.chat.map((message) => `<p class="chat-line">${message}</p>`).join("")
    : '<p class="chat-line">Henuz klan mesaji yok.</p>';
}

function sendClanMessage() {
  const user = getUser();
  if (!user || !user.clanId || !state.clans[user.clanId]) return notify("Mesaj icin klana katil.");
  const text = clanChatInput.value.trim();
  if (!text) return;
  const clan = state.clans[user.clanId];
  clan.chat.push(`(${clan.tag})${user.username}: ${text}`);
  if (clan.chat.length > 40) clan.chat.shift();
  clanChatInput.value = "";
  sync("Klan mesajin gonderildi.", false);
}

function sendClanAnnouncement() {
  const user = getUser();
  if (!user || !user.clanId) return;
  const clan = state.clans[user.clanId];
  if (!clan || clan.owner !== user.username) return notify("Duyuruyu sadece baskan gonderebilir.");
  const text = clanAnnouncementInput.value.trim();
  if (!text) return;
  clan.announcement = text;
  clan.chat.push(`(${clan.tag}) DUYURU: ${text}`);
  clanAnnouncementInput.value = "";
  sync("Klan duyurusu yayinlandi.", true);
}

function leaveClan() {
  const user = getUser();
  if (!user || !user.clanId) return;
  const clan = state.clans[user.clanId];
  if (!clan) {
    user.clanId = null;
    return sync("Klansiz kaldin.", false);
  }

  clan.members = clan.members.filter((member) => member !== user.username);
  clan.chat.push(`(${clan.tag})${user.username}: Klandan ayrildi.`);
  user.clanId = null;

  if (!clan.members.length) {
    delete state.clans[clan.id];
  } else if (clan.owner === user.username) {
    clan.owner = clan.members[0];
    clan.chat.push(`(${clan.tag}) Yeni baskan: ${clan.owner}`);
  }

  sync("Klandan ayrildin.", true);
}

function getClanName(user) {
  return user.clanId && state.clans[user.clanId] ? state.clans[user.clanId].name : "Yok";
}

function calculateClanTreasury(clan) {
  const activeUser = getUser();
  let total = 0;
  let mine = 0;

  clan.members.forEach((memberName) => {
    const member = state.accounts[memberName];
    if (!member) return;
    const contribution = Math.floor((member.bestScore || 0) * 0.1);
    total += contribution;
    if (activeUser && memberName === activeUser.username) {
      mine = contribution;
    }
  });

  return { total, mine };
}

function openPlayerProfile(username) {
  const user = state.accounts[username];
  if (!user) return;

  dialogAvatar.src = user.avatar || defaultAvatar;
  dialogUsername.textContent = user.username;
  dialogClan.textContent = `Klan: ${getClanName(user)}`;
  dialogJoinDate.textContent = formatDate(user.joinedAt);
  dialogMoney.textContent = `${formatNumber(user.money)} TL`;
  dialogBestScore.textContent = `${formatNumber(user.bestScore)} TL`;
  dialogIncome.textContent = `${formatNumber(totalIncome(user))} TL / sn`;
  dialogPlayTime.textContent = formatPlayTime(user.playSeconds);
  dialogPurchases.textContent = formatNumber(user.purchaseCount);
  playerProfileDialog.showModal();
}

function notify(text) {
  gameMessage.textContent = text;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = text;
  notificationStack.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function ensureAudio() {
  if (!audioContext) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (AudioContextCtor) audioContext = new AudioContextCtor();
  }
}

function playSound(kind) {
  const user = getUser();
  if (!user || !user.soundEnabled) return;
  ensureAudio();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.type = kind === "success" ? "triangle" : "sine";
  oscillator.frequency.value = kind === "buy" ? 420 : kind === "success" ? 620 : 300;
  gain.gain.value = 0.03;
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.09);
}

function formatNumber(value) {
  return Math.floor(value).toLocaleString("tr-TR");
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatPlayTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} sa ${minutes} dk`;
  return `${minutes} dk`;
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
