document.addEventListener("DOMContentLoaded", () => {
  console.log("SweetBite Bakery website loaded ✨");

  // 🍰 Menu items
  const menuItems = [
    { name: "Chocolate Cake", price: 1500, image: "images/chocolate-cake.jpg" },
    { name: "Cupcake", price: 250, image: "images/cupcake.jpg" },
    { name: "Macaron", price: 350, image: "images/macaron.jpg" },
    { name: "Cookies", price: 300, image: "images/cookies.jpg" },
    { name: "Blueberry Cake", price: 2000, image: "images/blueberry-cake.jpg" },
    { name: "Croissant", price: 500, image: "images/croissant.jpg" },
  ];

  // 🧁 Populate menu page dynamically
  const container = document.getElementById("menuItems");
  if (container) {
    menuItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "col-md-4 col-sm-6";
      card.innerHTML = `
        <div class="card h-100 shadow-sm border-0">
          <img src="${item.image}" class="card-img-top" alt="${item.name}">
          <div class="card-body text-center">
            <h5 class="card-title text-brown fw-semibold">${item.name}</h5>
            <p class="card-text text-muted">PKR ${item.price}</p>
            <a href="order.html" class="btn btn-order">Order Now</a>
          </div>
        </div>`;
      container.appendChild(card);
    });
  }

  // 🛒 Order page logic
  const orderForm = document.getElementById("orderForm");
  const cart = [];

  if (orderForm) {
    const addItemBtn = document.getElementById("addItem");
    const cartContainer = document.getElementById("cartContainer");
    const cartList = document.getElementById("cartList");
    const clearCartBtn = document.getElementById("clearCart");

    // ➕ Add item to cart
    addItemBtn.addEventListener("click", () => {
      const itemValue = document.getElementById("item").value;
      const qty = parseInt(document.getElementById("quantity").value);

      if (!itemValue) {
        alert("⚠️ Please select an item to add!");
        return;
      }

      const selectedItem = menuItems.find(m => itemValue.includes(m.name));
      if (!selectedItem) {
        alert("❌ Item not found!");
        return;
      }

      // Merge if already exists
      const existing = cart.find(c => c.name === selectedItem.name);
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({ ...selectedItem, qty });
      }

      cartContainer.style.display = "block";
      updateCartUI();
      document.getElementById("item").value = "";
      document.getElementById("quantity").value = 1;
    });

    // 🗑️ Clear all items from cart
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Remove all items from your order?")) {
        cart.length = 0;
        updateCartUI();
        cartContainer.style.display = "none";
      }
    });

    // 🔄 Update cart display (Fixed total duplication)
    function updateCartUI() {
      cartList.innerHTML = ""; // Clear previous list first
      let total = 0;

      // List each cart item
      cart.forEach((c, i) => {
        const itemTotal = c.price * c.qty;
        total += itemTotal;

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
          ${c.name} × ${c.qty} — PKR ${itemTotal}
          <button class="btn btn-sm btn-outline-danger">❌</button>
        `;

        // Delete item button
        li.querySelector("button").onclick = () => {
          cart.splice(i, 1);
          updateCartUI();
          if (cart.length === 0) cartContainer.style.display = "none";
        };

        cartList.appendChild(li);
      });

      // ✅ Add only ONE total line
      if (cart.length > 0) {
        const totalLi = document.createElement("li");
        totalLi.className = "list-group-item text-center fw-bold text-success mt-2";
        totalLi.textContent = `Total: PKR ${total}`;
        cartList.appendChild(totalLi);
      }
    }

    // ✅ Submit order (show total in alert)
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const address = document.getElementById("address").value.trim();

      if (!name || !email || !address) {
        alert("⚠️ Please fill all required fields!");
        return;
      }

      if (cart.length === 0) {
        alert("🛒 Please add at least one item to your cart before submitting!");
        return;
      }

      // 🧾 Order summary
      let total = 0;
      const summary = cart.map(c => {
        const itemTotal = c.price * c.qty;
        total += itemTotal;
        return `${c.qty} × ${c.name} — PKR ${itemTotal}`;
      }).join("\n");

      alert(
        `🎉 Thank you, ${name}!\n\n` +
        `Your order includes:\n${summary}\n\n` +
        `📦 Total Bill: PKR ${total}\n` +
        `📍 Delivery Address:\n${address}\n\n` +
        `We'll deliver your order soon! 🍰`
      );

      // 🔄 Reset after submit
      orderForm.reset();
      cart.length = 0;
      updateCartUI();
      cartContainer.style.display = "none";
    });
  }
});
