
// db.json
let products = [];

fetch("http://localhost:3000/products")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderCards();     // Load cards from API data
    updateCartUI();    // If needed, update cart from localStorage
  });

// db.json en

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCards(filtered = products) {
  const container = document.getElementById("productCards");
  container.innerHTML = "";
  filtered.forEach(prod => {
    const col = document.createElement("div");
    col.className = "col-md-3 mb-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${prod.image}" class="card-img-top" height="150">
        <div class="card-body">
          <h5>${prod.name}</h5>
          <p>${prod.category} - $${prod.price}</p>
          <button class="btn btn-success btn-sm" onclick='addToCart(${prod.id})'>Add to Cart</button>
          <button class="btn btn-secondary btn-sm ms-1" onclick='editProduct(${prod.id})'>Edit</button>
        </div>
      </div>`;
    container.appendChild(col);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!cart.some(item => item.id === id)) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  } else {
    alert("Already in cart");
  }
}

function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${item.name} ($${item.price})</span>
      <button class="btn btn-danger btn-sm" onclick='removeFromCart(${item.id})'>Delete</button>`;
    cartItems.appendChild(li);
  });

  document.getElementById("cartTotal").textContent = total;
  document.getElementById("cartCount").textContent = cart.length;
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// Filters
document.getElementById("applyBtn").onclick = () => {
  const cat = document.getElementById("categoryFilter").value;
  const price = document.getElementById("priceFilter").value;

  let filtered = products;

  if (cat) filtered = filtered.filter(p => p.category === cat);
  if (price === "below") filtered = filtered.filter(p => p.price < 100);
  if (price === "above") filtered = filtered.filter(p => p.price >= 100);

  renderCards(filtered);
};

// Edit Modal Logic
function editProduct(id) {
  const prod = products.find(p => p.id === id);
  document.getElementById("editId").value = prod.id;
  document.getElementById("editName").value = prod.name;
  document.getElementById("editCategory").value = prod.category;
  document.getElementById("editPrice").value = prod.price;
  document.getElementById("editImage").value = prod.image;
  const modal = new bootstrap.Modal(document.getElementById("editModal"));
  modal.show();
}

document.getElementById("editForm").onsubmit = function (e) {
  e.preventDefault();
  const id = +document.getElementById("editId").value;
  const prod = products.find(p => p.id === id);
  prod.name = document.getElementById("editName").value;
  prod.category = document.getElementById("editCategory").value;
  prod.price = +document.getElementById("editPrice").value;
  prod.image = document.getElementById("editImage").value;

  renderCards(); // re-render cards
  updateCartUI(); // update if in cart
  bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
};

renderCards();
updateCartUI();