/* RIVA VALENCIA CART SYSTEM */

const CART_KEY = "rivaCart";
const SHIPPING_THRESHOLD = 250;
const SHIPPING_COST = 15;

/* GET CART */

function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/* SAVE CART */

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  renderCart();
}

/* FORMAT PRICE */

function formatPrice(price) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

/* ESCAPE HTML */

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

/* ADD PRODUCT TO CART

Example:
addToCart({
  id: 101,
  title: "Valencia Leather Bag",
  price: 189,
  image: "images/bag.jpg",
  color: "Brown"
});

*/

function addToCart(product) {
  if (
    !product ||
    product.id == null ||
    !product.title ||
    !Number.isFinite(Number(product.price)) ||
    Number(product.price) < 0
  ) {
    console.error("Invalid product data.");
    return;
  }

  const cart = getCart();

  const existing = cart.find(
    (item) =>
      String(item.id) === String(product.id) &&
      item.color === (product.color || "Default") &&
      item.title === product.title,
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      image: product.image || "",
      color: product.color || "Default",
      quantity: 1,
    });
  }

  saveCart(cart);

  console.log("Product added to bag.");
}

/* REMOVE PRODUCT */

function removeFromCart(index) {
  const cart = getCart();

  cart.splice(index, 1);

  saveCart(cart);
}

/* CHANGE QUANTITY */

function changeQuantity(index, amount) {
  const cart = getCart();

  if (!cart[index]) return;

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
}

/* CART COUNT */

function updateHeaderCount(cart) {
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  const countElement = document.getElementById("headerCartCount");
  const itemCount = document.getElementById("cartItemCount");

  if (countElement) countElement.textContent = count;

  if (itemCount) {
    itemCount.textContent = `${count} ${count === 1 ? "ITEM" : "ITEMS"}`;
  }
}

/* RENDER CART */

function renderCart() {
  const cart = getCart();

  const emptyCart = document.getElementById("emptyCart");
  const cartContent = document.getElementById("cartContent");
  const productsContainer = document.getElementById("cartProducts");

  if (!emptyCart || !cartContent || !productsContainer) return;

  updateHeaderCount(cart);

  if (cart.length === 0) {
    emptyCart.classList.remove("hidden");
    cartContent.classList.add("hidden");

    return;
  }

  emptyCart.classList.add("hidden");
  cartContent.classList.remove("hidden");

  let subtotal = 0;
  let productHTML = "";

  cart.forEach((item, index) => {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const price = Math.max(0, Number(item.price) || 0);

    const lineTotal = price * quantity;

    subtotal += lineTotal;

    productHTML += `

      <article class="cart-product">

        <div class="cart-product-info">

          <img
            class="cart-product-image"
            src="${escapeHTML(item.image)}"
            alt="${escapeHTML(item.title)}"
            onerror="this.onerror=null;this.src='https://placehold.co/300x400/f0ece5/211b17?text=Riva+Valencia'"
          >

          <div class="cart-product-details">

            <h3>${escapeHTML(item.title)}</h3>

            <p>Colour: ${escapeHTML(item.color || "Default")}</p>

            <button
              class="cart-remove"
              data-action="remove"
              data-index="${index}"
            >
              REMOVE
            </button>

          </div>

        </div>

        <span class="cart-price">
          ${formatPrice(price)}
        </span>

        <div class="quantity-control">

          <button
            data-action="decrease"
            data-index="${index}"
            aria-label="Decrease quantity"
          >−</button>

          <span>${quantity}</span>

          <button
            data-action="increase"
            data-index="${index}"
            aria-label="Increase quantity"
          >+</button>

        </div>

        <strong class="cart-line-total">
          ${formatPrice(lineTotal)}
        </strong>

      </article>

    `;
  });

  productsContainer.innerHTML = productHTML;

  /* SUMMARY */

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const total = subtotal + shipping;

  document.getElementById("cartSubtotal").textContent = formatPrice(subtotal);

  document.getElementById("cartShipping").textContent =
    shipping === 0 ? "FREE" : formatPrice(shipping);

  document.getElementById("cartTotal").textContent = formatPrice(total);

  /* SHIPPING PROGRESS */

  const progress = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  document.getElementById("shippingProgress").style.width = progress + "%";

  const remaining = Math.max(0, SHIPPING_THRESHOLD - subtotal);

  document.getElementById("shippingMessage").textContent =
    remaining === 0
      ? "Congratulations! Your order qualifies for complimentary shipping."
      : `You're only ${formatPrice(remaining)} away from complimentary shipping.`;
}

/* CART BUTTON EVENTS */

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const index = Number(button.dataset.index);

  if (!Number.isInteger(index)) return;

  switch (button.dataset.action) {
    case "remove":
      removeFromCart(index);
      break;

    case "increase":
      changeQuantity(index, 1);
      break;

    case "decrease":
      changeQuantity(index, -1);
      break;
  }
});

/* CHECKOUT */

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const checkoutButton = document.getElementById("checkoutButton");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      const cart = getCart();

      if (cart.length === 0) {
        alert("Your shopping bag is empty.");
        return;
      }

      alert(
        "Your cart is ready! Checkout and payment integration will be connected next.",
      );
    });
  }
});

/* UPDATE CART WHEN ANOTHER TAB CHANGES IT */

window.addEventListener("storage", (event) => {
  if (event.key === CART_KEY) {
    renderCart();
  }
});
