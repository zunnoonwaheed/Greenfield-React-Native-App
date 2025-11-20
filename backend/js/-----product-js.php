<script>
// Update header badges
function updateHeaderCart(count) {
  const headerBadge = document.getElementById("cart-count"); // your HTML ID
  const offcanvasBadge = document.getElementById("cart-count-offcanvas"); // if exists

  [headerBadge, offcanvasBadge].forEach(el => {
    if (el) {
      if (count > 0) {
        el.textContent = count;
        el.classList.remove("d-none");
      } else {
        el.textContent = 0;
        el.classList.add("d-none");
      }
    }
  });
}


// ✅ Load / refresh cart content
// ✅ Cart reload karega
function loadCart() {
  fetch("cart-contents.php")
    .then(res => res.text())
    .then(html => {
      document.querySelector("#cartContent").innerHTML = html;

      // Re-bind buttons
      const cartDiv = document.getElementById("cartContent");
      bindCartButtons(cartDiv);

      // Update cart count badge
      let countInput = document.getElementById("cart-count-value");
      let newCount = countInput ? parseInt(countInput.value) : 0;
      updateHeaderCart(newCount);

      // Update cart total
      let totalInput = document.getElementById("cart-total-value");
      if (totalInput) {
        document.getElementById("cart-total").textContent = totalInput.value;
      }
    });
}

// ✅ Qty increase/decrease/remove item
function updateCartItem(id, action) {
  fetch("update-cart.php", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: "id=" + id + "&action=" + action
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      loadCart(); // cart dobara refresh
    }
  });
}

// ✅ Buttons bind
function bindCartButtons(container) {
  container.querySelectorAll(".updateQty").forEach(btn => {
    btn.addEventListener("click", function() {
      updateCartItem(this.dataset.id, this.dataset.action);
    });
  });
  container.querySelectorAll(".removeItem").forEach(btn => {
    btn.addEventListener("click", function() {
      updateCartItem(this.dataset.id, "remove");
    });
  });
}

 
 

// ✅ Add-to-Cart forms
document.addEventListener("submit", function(e) {
  if (e.target.classList.contains("addToCartForm")) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const msgBox = document.getElementById("cartMsg");

    fetch("/add-to-cart.php", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        if (msgBox) {
          msgBox.style.display = "block";
          msgBox.innerHTML = data.message;
        }

       if (data.success) {
  updateHeaderCart(data.cart_count);

  if (data.cart_html) {
    const cartDiv = document.getElementById("cartContent");
    cartDiv.innerHTML = data.cart_html;
    bindCartButtons(cartDiv);

    // ✅ Cart total update karo
    let totalInput = cartDiv.querySelector("#cart-total-value");
    if (totalInput) {
      document.getElementById("cart-total").textContent = totalInput.value;
    }
  }

  // ✅ Open Offcanvas
  var offcanvasEl = document.getElementById('offcanvasCart');
  var offcanvas = new bootstrap.Offcanvas(offcanvasEl);
  offcanvas.show();
}

      });
  }
});

// ✅ Continue Shopping button
document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "continueShoppingBtn") {
    e.preventDefault();
    var offcanvasEl = document.getElementById('offcanvasCart');
    var offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl) 
                    || new bootstrap.Offcanvas(offcanvasEl);
    offcanvas.hide();
  }
});

// ✅ Initial load
document.addEventListener("DOMContentLoaded", loadCart);
</script>
