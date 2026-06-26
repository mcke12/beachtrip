const packingList = {

"Beach Clothing":[
"Swimsuits",
"Cover-up",
"T-shirts",
"Tank Tops",
"Shorts",
"Pajamas",
"Underwear",
"Socks",
"Flip Flops",
"Hat",
"Sunglasses"
],

"Beach Essentials":[
"Beach Towels",
"Sunscreen",
"Aloe Vera",
"Beach Bag",
"Water Bottle",
"Cooler",
"Chair",
"Umbrella",
"Book",
"Speaker"
],

"Toiletries":[
"Toothbrush",
"Toothpaste",
"Deodorant",
"Shampoo",
"Conditioner",
"Body Wash",
"Hair Brush",
"Razor",
"Makeup",
"Medications"
],

"Electronics":[
"Phone Charger",
"Watch Charger",
"Laptop",
"Laptop Charger",
"Headphones",
"Portable Charger"
],

"Food & Snacks":[
"Snacks",
"Drinks",
"Coffee",
"Ice"

],

"Wedding Clothes":[
"Wedding Dress",
"Heels",
"Jewelry",
"Purse",
"Shawl",
"Undergarments"
],

"Wedding Toiletries":[
"Hair Products",
"Makeup Bag",
"Perfume",
"Nail Kit"
],

"Before Leaving Home":[
"Wallet",
"Driver's License",
"Keys",
"Lock Doors",
"Take Out Trash",
"Set Thermostat",
"Charge Phone",
"Hotel Reservations",
"Wedding Invitation"
]

};

const container = document.getElementById("checklist");

for (const category in packingList){

    const section = document.createElement("div");
    section.className="category";

    const title = document.createElement("h2");
    title.textContent=category;
    section.appendChild(title);

    packingList[category].forEach(item=>{

        const id = category+"-"+item;

        const label=document.createElement("label");

        const checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.checked=localStorage.getItem(id)==="true";

        if(checkbox.checked){
            label.classList.add("checked");
        }

        checkbox.addEventListener("change",()=>{

            localStorage.setItem(id,checkbox.checked);

            if(checkbox.checked){
                label.classList.add("checked");
            }
            else{
                label.classList.remove("checked");
            }

        });

        label.appendChild(checkbox);
        label.append(item);

        section.appendChild(label);

    });

    container.appendChild(section);

}