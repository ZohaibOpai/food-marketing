// ===== FOOD DATA =====
const foods = [
    { id: 1, name: "Chicken Burger", category: "Fast Food", price: 350, emoji: "🍔" },
    { id: 2, name: "Pepperoni Pizza", category: "Fast Food", price: 750, emoji: "🍕" },
    { id: 3, name: "French Fries", category: "Fast Food", price: 200, emoji: "🍟" },
    { id: 4, name: "Chicken Biryani", category: "Pakistani", price: 450, emoji: "🍛" },
    { id: 5, name: "Beef Karahi", category: "Pakistani", price: 850, emoji: "🥘" },
    { id: 6, name: "Nihari", category: "Pakistani", price: 500, emoji: "🍲" },
    { id: 7, name: "Gulab Jamun", category: "Dessert", price: 150, emoji: "🍮" },
    { id: 8, name: "Chocolate Cake", category: "Dessert", price: 300, emoji: "🎂" },
    { id: 9, name: "Mango Shake", category: "Drinks", price: 180, emoji: "🥭" },
    { id: 10, name: "Lassi", category: "Drinks", price: 120, emoji: "🥛" },
    { id: 11, name: "Hot Coffee", category: "Drinks", price: 220, emoji: "☕" },
    { id: 12, name: "Shawarma", category: "Fast Food", price: 280, emoji: "🌯" },
];

let cart = [];
let currentCategory = "All";

// ===== RENDER FOOD CARDS =====
function renderFoods(list) {
    const grid = document.getElementById("food-grid");
    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = "<p style='text-align:center; color:#aaa; grid-column:1/-1;'>No food found 😕</p>";
        return;
    }

    list.forEach(food => {
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
        <div class="food-img">${food.emoji}</div>
        <div class="food-info">
          <div class="food-name">${food.name}</div>
          <div class="food-cat">${food.category}</div>
          <div class="food-price">Rs. ${food.price}</div>
          <button class="add-btn" onclick="addToCart(${food.id})">+ Add to Cart</button>
        </div>
      `;
        grid.appendChild(card);
    });
}

// ===== FILTER BY CATEGORY =====
function filterCategory(cat, btn) {
    currentCategory = cat;

    // Update active button
    document.querySelectorAll(".filter-btns button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    applyFilters();
}

// ===== FILTER BY SEARCH =====
function filterFood() {
    applyFilters();
}

function applyFilters() {
    const search = document.getElementById("search-input").value.toLowerCase();

    let result = foods.filter(f => {
        const matchCat = currentCategory === "All" || f.category === currentCategory;
        const matchSearch = f.name.toLowerCase().includes(search);
        return matchCat && matchSearch;
    });

    renderFoods(result);
}

// ===== ADD TO CART =====
function addToCart(id) {
    const food = foods.find(f => f.id === id);
    const existing = cart.find(c => c.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...food, qty: 1 });
    }

    updateCartUI();
    showToast(`${food.emoji} ${food.name} added to cart!`);
}

// ===== UPDATE CART UI =====
function updateCartUI() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const count = cart.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById("cart-count").textContent = count;

    const cartItemsDiv = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p class='empty-cart'>Your cart is empty 🛒</p>";
        totalEl.style.display = "none";
        checkoutBtn.style.display = "none";
        return;
    }

    cartItemsDiv.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.emoji} ${item.name} x${item.qty}</div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="cart-item-price">Rs. ${item.price * item.qty}</span>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `).join("");

    totalEl.textContent = `Total: Rs. ${total}`;
    totalEl.style.display = "block";
    checkoutBtn.style.display = "block";
}

// ===== REMOVE FROM CART =====
function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
}

// ===== TOGGLE CART =====
function toggleCart() {
    const sidebar = document.getElementById("cart-sidebar");
    const overlay = document.getElementById("overlay");
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
}

// ===== CHECKOUT =====
function checkout() {
    cart = [];
    updateCartUI();
    toggleCart();
    showToast("✅ Order placed! Thank you!");
}

// ===== CONTACT FORM =====
function submitForm(e) {
    e.preventDefault();
    const msg = document.getElementById("form-msg");
    msg.style.display = "block";
    e.target.reset();
    setTimeout(() => msg.style.display = "none", 4000);
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// ===== INIT =====
renderFoods(foods);