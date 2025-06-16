 const products = [
            { id: 1, name: "Honda CRV", category: "SUV", price: 90, image: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGNhcnN8ZW58MHx8MHx8fDI%3D" },
            { id: 2, name: "Toyota Corolla", category: "Sedan", price: 70, image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29yb2xsYXxlbnwwfHwwfHx8Mg%3D%3D" },
            { id: 3, name: "Honda Civic", category: "Honda", price: 110, image: "https://images.unsplash.com/photo-1634737581963-5a22ba471961?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D" },
            { id: 4, name: "BMW X5", category: "SUV", price: 150, image: "https://images.unsplash.com/photo-1674996047492-6b5cdc2dcf0a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEJNVyUyMFg1fGVufDB8fDB8fHwy" },
            { id: 5, name: "Nissan Altima", category: "Sedan", price: 95, image: "https://images.unsplash.com/photo-1652644827556-35ef6c3f9602?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fG5pc3NhbiUyMGFsdGltYXxlbnwwfHwwfHx8Mg%3D%3D" },
            { id: 6, name: "Tesla Model S", category: "Sedan", price: 180, image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVzbGF8ZW58MHx8MHx8fDI%3D" },
            { id: 7, name: "Honda Pilot", category: "Honda", price: 85, image: "https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG9uZGF8ZW58MHx8MHx8fDI%3D" },
            { id: 8, name: "Ford Explorer", category: "SUV", price: 105, image: "https://images.unsplash.com/photo-1670069247956-1a6dfee5338e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZCUyMGV4cGxvcmVyfGVufDB8fDB8fHwy" },
                        
        ];

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