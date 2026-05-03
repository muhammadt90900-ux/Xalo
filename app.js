// ===== DATA =====
const partsData = [
  { id: 1, title: "فلتەری هەوا تویۆتا", price: 15000, seller: "ئەحمەد", city: "هەولێر", img: "🔧", vip: true, type: "parts" },
  { id: 2, title: "بریک پاد هیوندای", price: 22000, seller: "کارگای ئەمین", city: "سلێمانی", img: "⚙️", vip: false, type: "parts" },
  { id: 3, title: "باتری ١٢ ڤۆڵت بۆشی", price: 85000, seller: "شانازی", city: "دهۆک", img: "🔋", vip: true, type: "parts" },
  { id: 4, title: "لەستیکی یەدەک میشلان", price: 45000, seller: "گارەژی ڕێبین", city: "هەولێر", img: "🛞", vip: false, type: "parts" },
  { id: 5, title: "مووتەری ئەسڵ نیسان", price: 320000, seller: "فرۆشگای ئوستا", city: "سلێمانی", img: "🔩", vip: true, type: "parts" },
];

const carsData = [
  { id: 6, title: "تویۆتا کامری ٢٠٢٢", price: 18500000, seller: "خالد ئەحمەد", city: "هەولێر", img: "🚗", km: "45,000", year: 2022, type: "cars" },
  { id: 7, title: "کیا سپۆرتیج ٢٠٢١", price: 16800000, seller: "کارگای ئەوین", city: "سلێمانی", img: "🚙", km: "62,000", year: 2021, type: "cars" },
  { id: 8, title: "هیوندای توسان ٢٠٢٣", price: 21000000, seller: "ئارەزوو موتۆرز", city: "دهۆک", img: "🚕", km: "12,000", year: 2023, type: "cars" },
  { id: 9, title: "تویۆتا لاند کروزەر", price: 45000000, seller: "پریمیوم کارز", city: "هەولێر", img: "🛻", km: "88,000", year: 2020, type: "cars" },
];

// ===== STATE =====
let userPlan = null; // null, 'free', 'vip'
let myListings = [];
let savedIds = [];
let currentSubTab = "parts";
let addType = "parts";

// ===== INIT =====
window.onload = function () {
  renderVIP();
  renderHomeCars();
  renderBrowse();
  updateCounts();
};

// ===== RENDER VIP =====
function renderVIP() {
  const all = [...partsData, ...myListings.filter(l => l.vip)];
  const vips = all.filter(i => i.vip);
  const container = document.getElementById("vipList");
  container.innerHTML = "";
  vips.forEach(item => {
    const div = document.createElement("div");
    div.className = "vip-card";
    div.onclick = () => openItemModal(item);
    div.innerHTML = `
      <div class="vip-card-icon">${item.img}</div>
      <div class="vip-card-title">${item.title}</div>
      <div class="vip-card-price">${item.price.toLocaleString()} د.ع</div>
      <div class="vip-card-city">📍 ${item.city}</div>
    `;
    container.appendChild(div);
  });
}

// ===== RENDER HOME CARS =====
function renderHomeCars() {
  const container = document.getElementById("homeCarsList");
  container.innerHTML = "";
  const cars = [...carsData, ...myListings.filter(l => l.type === "cars")].slice(0, 3);
  cars.forEach(car => {
    container.appendChild(makeListItem(car, true));
  });
}

// ===== RENDER BROWSE =====
function renderBrowse() {
  const container = document.getElementById("browseList");
  container.innerHTML = "";
  const search = document.getElementById("searchInput").value;
  const city = document.getElementById("cityFilter").value;

  let items = currentSubTab === "parts"
    ? [...partsData, ...myListings.filter(l => l.type === "parts")]
    : [...carsData, ...myListings.filter(l => l.type === "cars")];

  items = items.filter(i => {
    const cityMatch = city === "هەموو شارەکان" || i.city === city;
    const searchMatch = i.title.includes(search) || (i.seller && i.seller.includes(search)) || search === "";
    return cityMatch && searchMatch;
  });

  if (items.length === 0) {
    container.innerHTML = '<div class="empty-msg">هیچ بابەتێک نەدۆزرایەوە</div>';
    return;
  }
  items.forEach(item => container.appendChild(makeListItem(item, false)));
}

// ===== MAKE LIST ITEM =====
function makeListItem(item, isHome) {
  const div = document.createElement("div");
  div.className = "list-item" + (item.vip ? " vip-item" : "");
  div.onclick = () => openItemModal(item);

  const saved = savedIds.includes(item.id);
  const priceColor = item.type === "cars" ? "item-price-blue" : "";
  const badge = item.vip
    ? '<span class="badge-vip">VIP</span>'
    : item.free
    ? '<span class="badge-free">خۆڕای</span>'
    : "";
  const extra = item.km ? `• ${item.year} • ${item.km} کم` : "";

  div.innerHTML = `
    <div class="item-emoji">${item.img}</div>
    <div class="item-info">
      <div class="item-name">${item.title} ${badge}</div>
      <div class="item-meta-sm">👤 ${item.seller || "تۆ"} • 📍 ${item.city} ${extra}</div>
      <div class="item-price-sm ${priceColor}">${item.price.toLocaleString()} د.ع</div>
    </div>
    <button class="save-btn" onclick="event.stopPropagation(); toggleSave(${item.id}, this)">${saved ? "❤️" : "🤍"}</button>
  `;
  return div;
}

// ===== FILTER =====
function filterItems() {
  renderBrowse();
}

// ===== SWITCH TAB =====
function switchTab(name, btn) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  if (name === "browse") renderBrowse();
  if (name === "saved") renderSaved();
  if (name === "sell") renderMyListings();
}

// ===== SWITCH SUB TAB =====
function switchSub(type) {
  currentSubTab = type;
  document.getElementById("subParts").classList.toggle("active", type === "parts");
  document.getElementById("subCars").classList.toggle("active", type === "cars");
  renderBrowse();
}

// ===== SAVE =====
function toggleSave(id, btn) {
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter(x => x !== id);
    btn.textContent = "🤍";
  } else {
    savedIds.push(id);
    btn.textContent = "❤️";
  }
  renderSaved();
}

// ===== RENDER SAVED =====
function renderSaved() {
  const container = document.getElementById("savedList");
  const all = [...partsData, ...carsData, ...myListings];
  const saved = all.filter(i => savedIds.includes(i.id));
  if (saved.length === 0) {
    container.innerHTML = '<div class="empty-box"><div style="font-size:48px">🤍</div><div>هێشتا هیچ بابەتێکت پارێزراوە نییە</div></div>';
    return;
  }
  container.innerHTML = "";
  saved.forEach(item => container.appendChild(makeListItem(item, false)));
}

// ===== OPEN ITEM MODAL =====
function openItemModal(item) {
  document.getElementById("itemEmoji").textContent = item.img;
  document.getElementById("itemTitle").textContent = item.title;
  document.getElementById("itemVip").innerHTML = item.vip ? '<span class="badge-vip">⭐ VIP</span>' : "";
  document.getElementById("itemPrice").textContent = item.price.toLocaleString() + " د.ع";
  document.getElementById("itemPrice").style.color = item.type === "cars" ? "#4fc3f7" : "#ffa500";
  let meta = `👤 ${item.seller || "تۆ"}   📍 ${item.city}`;
  if (item.km) meta += `   🛣️ ${item.km} کم   📅 ${item.year}`;
  document.getElementById("itemMeta").textContent = meta;
  openModal("itemModal");
}

// ===== ADD MODAL =====
function openAddModal() {
  if (!userPlan) {
    openModal("planModal");
    return;
  }
  updateFreeWarning();
  openModal("addModal");
}

function setType(type) {
  addType = type;
  document.getElementById("typePartsBtn").classList.toggle("active", type === "parts");
  document.getElementById("typeCarsBtn").classList.toggle("active", type === "cars");
  updateFreeWarning();
}

function updateFreeWarning() {
  const myParts = myListings.filter(l => l.type === "parts").length;
  const left = 5 - myParts;
  const warn = document.getElementById("freeWarning");
  if (userPlan === "free" && addType === "parts") {
    document.getElementById("freeLeft").textContent = left;
    warn.classList.remove("hidden");
  } else {
    warn.classList.add("hidden");
  }
}

function submitListing() {
  const title = document.getElementById("fTitle").value.trim();
  const price = document.getElementById("fPrice").value.trim();
  const city = document.getElementById("fCity").value;
  const desc = document.getElementById("fDesc").value.trim();

  if (!title || !price) {
    showNotif("تکایە هەموو خانەکان پڕ بکەرەوە", "error");
    return;
  }

  const myParts = myListings.filter(l => l.type === "parts").length;
  if (userPlan === "free" && addType === "parts" && myParts >= 5) {
    showNotif("بۆ زیادتر لە ٥ بابەت، پلانی VIP هەڵبژێرە!", "error");
    return;
  }

  const newItem = {
    id: Date.now(),
    title, price: parseInt(price), city, desc,
    type: addType,
    seller: "تۆ",
    img: addType === "parts" ? "🔧" : "🚗",
    vip: userPlan === "vip",
    free: true,
  };

  myListings.push(newItem);
  closeModal("addModal");
  document.getElementById("fTitle").value = "";
  document.getElementById("fPrice").value = "";
  document.getElementById("fDesc").value = "";
  showNotif("بابەتەکەت بە سەرکەوتوویی زیاد کرا ✅");
  updateCounts();
  renderVIP();
  renderHomeCars();
  renderMyListings();
}

// ===== MY LISTINGS =====
function renderMyListings() {
  const container = document.getElementById("myListings");
  if (myListings.length === 0) {
    container.innerHTML = '<div class="empty-msg">هێشتا هیچ بابەتێکت نەداناوە</div>';
    return;
  }
  container.innerHTML = "";
  myListings.forEach(item => {
    const div = document.createElement("div");
    div.className = "my-item";
    div.innerHTML = `
      <div class="my-item-emoji">${item.img}</div>
      <div style="flex:1">
        <div class="my-item-name">${item.title}</div>
        <div class="my-item-price">${item.price.toLocaleString()} د.ع</div>
      </div>
      <span class="badge-active">چالاک</span>
    `;
    container.appendChild(div);
  });
}

// ===== UPDATE COUNTS =====
function updateCounts() {
  document.getElementById("partsCount").textContent = partsData.length + myListings.filter(l => l.type === "parts").length;
  document.getElementById("carsCount").textContent = carsData.length + myListings.filter(l => l.type === "cars").length;
}

// ===== PLAN =====
function choosePlan(plan) {
  userPlan = plan;
  closeModal("planModal");
  const names = { free: "خۆڕای", vip: "VIP" };
  showNotif(`بەخێربێیت! پلانی ${names[plan]} هەڵبژێردرا ✅`);
  document.querySelector(".btn-plan").textContent = plan === "vip" ? "⭐ VIP" : "بەکارهێنەر";
  setTimeout(() => openAddModal(), 400);
}

// ===== MODAL HELPERS =====
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// ===== NOTIFICATION =====
function showNotif(msg, type = "success") {
  const el = document.getElementById("notif");
  el.textContent = msg;
  el.className = "notif" + (type === "error" ? " error" : "");
  setTimeout(() => el.classList.add("hidden"), 3000);
}
