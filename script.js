// ── Beach quotes ─────────────────────────────────────
const quotes = [
    "The ocean is calling and I must go.",
    "Life is better in flip flops.",
    "Saltwater heals everything.",
    "Sandy toes, sun-kissed nose.",
    "Happiness comes in waves.",
    "Collect moments, not things — especially shells.",
    "A day at the beach restores the soul.",
    "Good times and tan lines.",
    "The beach is not a place to work — it's a place to breathe.",
    "Let the sea set you free.",
    "Sunsets are proof that endings can be beautiful.",
    "Mermaid vibes only.",
];

const quoteEl = document.getElementById("beach-quote");
let quoteIdx = Math.floor(Math.random() * quotes.length);

function showQuote() {
    quoteEl.classList.add("fade");
    setTimeout(() => {
        quoteIdx = (quoteIdx + 1) % quotes.length;
        quoteEl.textContent = `"${quotes[quoteIdx]}"`;

        quoteEl.classList.remove("fade");
    }, 600);
}

quoteEl.textContent = `"${quotes[quoteIdx]}"`;

setInterval(showQuote, 5000);


// ── Weather (Open-Meteo, no API key needed) ───────────
async function loadWeather() {
    const widget = document.getElementById("weather-widget");
    try {
        // Jekyll Island, GA coords
        const lat = 31.0543, lon = -81.4204;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FNew_York`;
        const res  = await fetch(url);
        const data = await res.json();
        const { temperature_2m, weathercode, windspeed_10m } = data.current;

        const weatherMap = {
            0:  { icon: "☀️",  desc: "Clear sky" },
            1:  { icon: "🌤️", desc: "Mostly clear" },
            2:  { icon: "⛅",  desc: "Partly cloudy" },
            3:  { icon: "☁️",  desc: "Overcast" },
            45: { icon: "🌫️", desc: "Foggy" },
            48: { icon: "🌫️", desc: "Freezing fog" },
            51: { icon: "🌦️", desc: "Light drizzle" },
            53: { icon: "🌦️", desc: "Drizzle" },
            55: { icon: "🌧️", desc: "Heavy drizzle" },
            61: { icon: "🌧️", desc: "Light rain" },
            63: { icon: "🌧️", desc: "Rain" },
            65: { icon: "🌧️", desc: "Heavy rain" },
            71: { icon: "🌨️", desc: "Light snow" },
            80: { icon: "🌦️", desc: "Rain showers" },
            95: { icon: "⛈️",  desc: "Thunderstorm" },
        };

        const w = weatherMap[weathercode] || { icon: "🌡️", desc: "See forecast" };

        widget.innerHTML = `
            <div class="weather-main">
                <span class="weather-icon">${w.icon}</span>
                <div>
                    <div class="weather-temp">${Math.round(temperature_2m)}°F</div>
                    <div class="weather-desc">${w.desc} · ${Math.round(windspeed_10m)} mph winds</div>
                </div>
            </div>
            <div class="weather-location">📍 Jekyll Island, GA</div>
        `;
    } catch {
        widget.innerHTML = `<span class="weather-loading">Weather unavailable</span>`;
    }
}

loadWeather();


// ── Packing data ──────────────────────────────────────
const packingList = {

"Beach Clothing": [
    "Swimsuits", "Cover-up", "T-shirts", "Tank Tops", "Shorts",
    "Pajamas", "Undergarments", "Socks", "Running Shoes", "Flip Flops", "Hat", "Sunglasses"
],
"Beach Essentials": [
    "Beach Towels", "Sunscreen", "Aloe Vera", "Beach Bag", "Water Bottle",
    "Cooler", "Beach Chair", "Umbrella", "Book", "Speaker"
],
"Toiletries": [
    "Toothbrush", "Toothpaste", "Retainer", "Deodorant", "Perfume", "Shampoo", "Conditioner",
    "Body Wash", "Hair Brush", "Hair Dryer", "Curling/Straightening Iron",
    "Razor", "Makeup", "Medications"
],
"Electronics": [
    "Phone Charger", "Watch Charger", "Laptop", "Laptop Charger",
    "Headphones", "Portable Charger", "Disposable Camera"
],
"Food & Snacks": [
    "Snacks", "Drinks", "Coffee", "Ice"
],
"Wedding Clothes": [
    "Wedding Guest Attire", "Shoes", "Jewelry", "Purse", "Undergarments"
],
"Wedding Toiletries": [
    "Hair Products", "Makeup Bag", "Perfume", "Nail Kit"
],
"Before Leaving Home": [
    "Wallet", "Driver's License", "Keys", "Lock Doors",
    "Take Out Trash", "Set Thermostat", "Charge Phone",
    "Hotel Reservations", "Wedding Invitation", "Plans for the dog"
]

};

const weddingCategories = new Set(["Wedding Clothes", "Wedding Toiletries"]);

const sections = [
    { label: "🌴 Beach Trip",       categories: ["Beach Clothing", "Beach Essentials", "Toiletries", "Electronics", "Food & Snacks"],  type: "beach" },
    { label: "💍 Wedding Weekend",  categories: ["Wedding Clothes", "Wedding Toiletries"],                                              type: "wedding" },
    { label: "🛒 Shopping List",    categories: [],                                                                                     type: "shopping" },
    { label: "✅ Before You Leave", categories: ["Before Leaving Home"],                                                                type: "before" }
];

const container    = document.getElementById("checklist");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const progressPct  = document.getElementById("progress-pct");
const tabBtns      = document.querySelectorAll(".tab-btn");

let totalItems = 0;

function loadCustomItems(key) {
    try { return JSON.parse(localStorage.getItem("custom-" + key) || "[]"); }
    catch { return []; }
}

function saveCustomItems(key, items) {
    localStorage.setItem("custom-" + key, JSON.stringify(items));
}

function updateProgress() {
    const checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const pct = totalItems === 0 ? 0 : Math.round((checked / totalItems) * 100);
    progressFill.style.width = pct + "%";
    progressText.textContent = `${checked} of ${totalItems} items`;
    progressPct.textContent  = pct + "%";
}

function updateCategoryCount(countEl, cardEl) {
    const total   = cardEl.querySelectorAll('input[type="checkbox"]').length;
    const checked = cardEl.querySelectorAll('input[type="checkbox"]:checked').length;
    countEl.textContent = `${checked}/${total}`;
}

function switchTab(idx) {
    document.querySelectorAll(".tab-panel").forEach((p, i) => p.classList.toggle("active", i === idx));
    tabBtns.forEach((btn, i) => {
        btn.classList.toggle("active", i === idx);
        btn.setAttribute("aria-selected", i === idx);
    });
}

function cardClass(category, sectionType) {
    if (weddingCategories.has(category)) return "category wedding-card";
    if (sectionType === "shopping")      return "category shopping-card";
    return "category";
}

function createItemRow(itemName, storageKey, isCustom, itemsDiv, countEl, card) {
    const id    = storageKey + "-" + itemName;
    const label = document.createElement("label");
    label.className = "item-row";

    const checkbox   = document.createElement("input");
    checkbox.type    = "checkbox";
    checkbox.checked = localStorage.getItem(id) === "true";
    if (checkbox.checked) label.classList.add("checked");

    checkbox.addEventListener("change", () => {
        localStorage.setItem(id, checkbox.checked);
        label.classList.toggle("checked", checkbox.checked);
        updateCategoryCount(countEl, card);
        updateProgress();
    });

    label.appendChild(checkbox);
    label.append(itemName);

    if (isCustom) {
        const del = document.createElement("button");
        del.className   = "delete-btn";
        del.textContent = "×";
        del.title       = "Remove item";
        del.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem(id);
            const customs = loadCustomItems(storageKey).filter(i => i !== itemName);
            saveCustomItems(storageKey, customs);
            label.remove();
            totalItems--;
            updateCategoryCount(countEl, card);
            updateProgress();
        });
        label.appendChild(del);
    }

    return label;
}

function buildAddRow(storageKey, itemsDiv, countEl, card, confirmClass) {
    const addRow = document.createElement("div");
    addRow.className = "add-row";

    const addBtn = document.createElement("button");
    addBtn.className = "add-trigger";
    addBtn.innerHTML = `<span class="add-plus">+</span> Add item`;
    addRow.appendChild(addBtn);

    const inputWrap = document.createElement("div");
    inputWrap.className = "add-input-wrap hidden";

    const input = document.createElement("input");
    input.type        = "text";
    input.className   = "add-input";
    input.placeholder = "Item name…";
    input.maxLength   = 60;

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "add-confirm " + (confirmClass || "");
    confirmBtn.textContent = "Add";

    const cancelBtn = document.createElement("button");
    cancelBtn.className   = "add-cancel";
    cancelBtn.textContent = "Cancel";

    inputWrap.append(input, confirmBtn, cancelBtn);
    addRow.appendChild(inputWrap);

    const open  = () => { addBtn.classList.add("hidden"); inputWrap.classList.remove("hidden"); input.focus(); };
    const close = () => { input.value = ""; inputWrap.classList.add("hidden"); addBtn.classList.remove("hidden"); };

    const commit = () => {
        const name = input.value.trim();
        if (!name) { input.focus(); return; }
        const customs = loadCustomItems(storageKey);
        if (customs.includes(name)) { input.focus(); return; }
        customs.push(name);
        saveCustomItems(storageKey, customs);

        const row = createItemRow(name, storageKey, true, itemsDiv, countEl, card);
        itemsDiv.insertBefore(row, addRow);
        totalItems++;
        updateCategoryCount(countEl, card);
        updateProgress();
        close();
    };

    addBtn.addEventListener("click", open);
    confirmBtn.addEventListener("click", commit);
    cancelBtn.addEventListener("click", close);
    input.addEventListener("keydown", e => { if (e.key === "Enter") commit(); if (e.key === "Escape") close(); });

    return addRow;
}

function buildCard(category, storageKey, sectionType, items, panel) {
    const card = document.createElement("div");
    card.className = cardClass(category, sectionType);

    const header = document.createElement("div");
    header.className = "category-header";

    const title = document.createElement("h2");
    title.textContent = category;
    header.appendChild(title);

    const countEl = document.createElement("span");
    countEl.className = "category-count";
    header.appendChild(countEl);

    card.appendChild(header);

    const itemsDiv = document.createElement("div");
    itemsDiv.className = "category-items";

    const confirmClass = sectionType === "wedding" ? "wedding" : sectionType === "shopping" ? "shopping" : "";

    items.forEach(item => {
        itemsDiv.appendChild(createItemRow(item, storageKey, false, itemsDiv, countEl, card));
        totalItems++;
    });

    loadCustomItems(storageKey).forEach(item => {
        itemsDiv.appendChild(createItemRow(item, storageKey, true, itemsDiv, countEl, card));
        totalItems++;
    });

    itemsDiv.appendChild(buildAddRow(storageKey, itemsDiv, countEl, card, confirmClass));
    card.appendChild(itemsDiv);
    panel.appendChild(card);
    updateCategoryCount(countEl, card);
}

// ── Build shopping tab (one big card, fully custom) ──
function buildShoppingPanel(panel) {
    const card = document.createElement("div");
    card.className = "category shopping-card";

    const header = document.createElement("div");
    header.className = "category-header";

    const title = document.createElement("h2");
    title.textContent = "🛒 Shopping List";
    header.appendChild(title);

    const countEl = document.createElement("span");
    countEl.className = "category-count";
    header.appendChild(countEl);

    card.appendChild(header);

    const itemsDiv = document.createElement("div");
    itemsDiv.className = "category-items";

    const storageKey = "shopping-list";
    const savedItems = loadCustomItems(storageKey);

    if (savedItems.length === 0) {
        const hint = document.createElement("p");
        hint.className = "shopping-empty";
        hint.id = "shopping-hint";
        hint.textContent = "Nothing here yet — add the things you need to pick up before the trip!";
        itemsDiv.appendChild(hint);
    }

    savedItems.forEach(item => {
        const hint = document.getElementById("shopping-hint");
        if (hint) hint.remove();
        itemsDiv.appendChild(createItemRow(item, storageKey, true, itemsDiv, countEl, card));
        totalItems++;
    });

    // Override delete to also show hint if empty
    // (handled inline in a wrapper)
    const addRow = buildAddRow(storageKey, itemsDiv, countEl, card, "shopping");
    itemsDiv.appendChild(addRow);
    card.appendChild(itemsDiv);
    panel.appendChild(card);
    updateCategoryCount(countEl, card);
}

// ── Build all tabs ────────────────────────────────────
sections.forEach(({ categories, type }, sIdx) => {
    const panel = document.createElement("div");
    panel.className   = "tab-panel" + (sIdx === 0 ? " active" : "");
    panel.setAttribute("role", "tabpanel");

    if (type === "shopping") {
        buildShoppingPanel(panel);
    } else {
        categories.forEach(category => {
            buildCard(category, category, type, packingList[category], panel);
        });
    }

    container.appendChild(panel);
});

tabBtns.forEach((btn, i) => btn.addEventListener("click", () => switchTab(i)));

updateProgress();
