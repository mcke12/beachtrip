const packingList = {

"Beach Clothing": [
    "Swimsuits", "Cover-up", "T-shirts", "Tank Tops", "Shorts",
    "Pajamas", "Underwear", "Socks", "Flip Flops", "Hat", "Sunglasses"
],

"Beach Essentials": [
    "Beach Towels", "Sunscreen", "Aloe Vera", "Beach Bag", "Water Bottle",
    "Cooler", "Chair", "Umbrella", "Book", "Speaker"
],

"Toiletries": [
    "Toothbrush", "Toothpaste", "Deodorant", "Shampoo", "Conditioner",
    "Body Wash", "Hair Brush", "Razor", "Makeup", "Medications"
],

"Electronics": [
    "Phone Charger", "Watch Charger", "Laptop", "Laptop Charger",
    "Headphones", "Portable Charger"
],

"Food & Snacks": [
    "Snacks", "Drinks", "Coffee", "Ice"
],

"Wedding Clothes": [
    "Wedding Dress", "Heels", "Jewelry", "Purse", "Shawl", "Undergarments"
],

"Wedding Toiletries": [
    "Hair Products", "Makeup Bag", "Perfume", "Nail Kit"
],

"Before Leaving Home": [
    "Wallet", "Driver's License", "Keys", "Lock Doors",
    "Take Out Trash", "Set Thermostat", "Charge Phone",
    "Hotel Reservations", "Wedding Invitation"
]

};

// Categories that belong to the wedding half of the trip
const weddingCategories = new Set(["Wedding Clothes", "Wedding Toiletries"]);

// Section groupings with display labels
const sections = [
    { label: "🌴 Beach Trip", categories: ["Beach Clothing", "Beach Essentials", "Toiletries", "Electronics", "Food & Snacks"] },
    { label: "💍 Wedding Weekend", categories: ["Wedding Clothes", "Wedding Toiletries"] },
    { label: "✅ Before You Leave", categories: ["Before Leaving Home"] }
];

const container = document.getElementById("checklist");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");

let totalItems = 0;
let checkedItems = 0;

function updateProgress() {
    checkedItems = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const pct = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);
    progressFill.style.width = pct + "%";
    progressText.textContent = `${checkedItems} of ${totalItems}`;
}

function updateCategoryCount(countEl, section) {
    const checkboxes = section.querySelectorAll('input[type="checkbox"]');
    const checked = section.querySelectorAll('input[type="checkbox"]:checked').length;
    countEl.textContent = `${checked}/${checkboxes.length}`;
}

sections.forEach(({ label, categories }) => {
    const sectionLabel = document.createElement("p");
    sectionLabel.className = "section-label";
    sectionLabel.textContent = label;
    container.appendChild(sectionLabel);

    categories.forEach(category => {
        const items = packingList[category];
        const isWedding = weddingCategories.has(category);

        const section = document.createElement("div");
        section.className = "category" + (isWedding ? " wedding-card" : "");

        // Header row (emoji + title + count)
        const header = document.createElement("div");
        header.className = "category-header";

        const title = document.createElement("h2");
        title.textContent = category;
        header.appendChild(title);

        const countEl = document.createElement("span");
        countEl.className = "category-count";
        header.appendChild(countEl);

        section.appendChild(header);

        // Items
        const itemsDiv = document.createElement("div");
        itemsDiv.className = "category-items";

        items.forEach(item => {
            const id = category + "-" + item;

            const label = document.createElement("label");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = localStorage.getItem(id) === "true";

            if (checkbox.checked) label.classList.add("checked");

            checkbox.addEventListener("change", () => {
                localStorage.setItem(id, checkbox.checked);
                label.classList.toggle("checked", checkbox.checked);
                updateCategoryCount(countEl, section);
                updateProgress();
            });

            label.appendChild(checkbox);
            label.append(item);
            itemsDiv.appendChild(label);

            totalItems++;
        });

        section.appendChild(itemsDiv);
        container.appendChild(section);

        updateCategoryCount(countEl, section);
    });
});

updateProgress();
