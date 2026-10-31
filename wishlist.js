
/* ======================================
   RIVA VALENCIA - WISHLIST ENGINE
====================================== */

const grid = document.getElementById("wishlistGrid");
const emptyState = document.getElementById("emptyState");
const content = document.getElementById("wishlistContent");
const count = document.getElementById("wishlistCount");

function getWishlist() {
    try {
        const data = JSON.parse(
            localStorage.getItem("rivaWishlist") || "[]"
        );
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function getCart() {
    try {
        const data = JSON.parse(
            localStorage.getItem("rivaCart") || "[]"
        );
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function updateCartCount() {
    const cart = getCart();

    const total = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
    );

    document.getElementById("cartCount").textContent = total;
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.wishlistToastTimer);

    window.wishlistToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* RENDER WISHLIST */

function renderWishlist() {
    const wishlist = getWishlist();

    count.textContent = `${wishlist.length} ITEMS`;

    if (wishlist.length === 0) {
        emptyState.style.display = "block";
        content.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    content.style.display = "block";

    grid.innerHTML = wishlist.map(item => `
        <article class="wishlist-card">

            <div class="wishlist-image">
                <img
                    src="${item.image}"
                    alt="${item.title || item.name || "Saved product"}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/600x700/f0ebe4/302820?text=Riva+Valencia'"
                >

                <button
                    class="remove-button"
                    data-remove="${item.id}"
                    aria-label="Remove product"
                >×</button>
            </div>

            <div class="wishlist-info">
                <h3>${item.title || item.name || "Riva Valencia Product"}</h3>

                <p>€${Number(item.price).toFixed(2)} EUR</p>

                <div class="wishlist-actions">

                    <button
                        class="add-bag"
                        data-add="${item.id}"
                    >
                        ADD TO BAG +
                    </button>

                    <button
                        class="view-product"
                        data-view="${item.id}"
                    >
                        VIEW
                    </button>

                </div>
            </div>

        </article>
    `).join("");
}

/* REMOVE SINGLE PRODUCT */

grid.addEventListener("click", event => {

    const removeButton = event.target.closest("[data-remove]");

    if (removeButton) {

        const id = Number(removeButton.dataset.remove);

        const wishlist = getWishlist().filter(
            item => Number(item.id) !== id
        );

        localStorage.setItem(
            "rivaWishlist",
            JSON.stringify(wishlist)
        );

        renderWishlist();
        showToast("PRODUCT REMOVED FROM WISHLIST");
    }

});

/* ADD TO BAG */

grid.addEventListener("click", event => {

    const button = event.target.closest("[data-add]");

    if (!button) return;

    const id = Number(button.dataset.add);

    const product = getWishlist().find(
        item => Number(item.id) === id
    );

    if (!product) return;

    const cart = getCart();

    const title = product.title || product.name;

    const existing = cart.find(item =>
        Number(item.id) === id &&
        item.color === "Default" &&
        item.title === title
    );

    if (existing) {
        existing.quantity = (Number(existing.quantity) || 0) + 1;
    } else {
        cart.push({
            id: id,
            title: title,
            price: Number(product.price),
            image: product.image,
            color: "Default",
            quantity: 1
        });
    }

    localStorage.setItem("rivaCart", JSON.stringify(cart));

    updateCartCount();
    showToast("PRODUCT ADDED TO YOUR BAG ✓");

});

/* VIEW PRODUCT */

grid.addEventListener("click", event => {

    const button = event.target.closest("[data-view]");

    if (!button) return;

    const id = button.dataset.view;

    window.location.href = `product.html?id=${encodeURIComponent(id)}`;

});

/* CLEAR ALL */

document.getElementById("clearWishlist").addEventListener("click", () => {

    if (!confirm("Are you sure you want to clear your wishlist?")) {
        return;
    }

    localStorage.setItem("rivaWishlist", JSON.stringify([]));

    renderWishlist();
    showToast("YOUR WISHLIST HAS BEEN CLEARED");

});

/* INITIALIZE */

updateCartCount();
renderWishlist();
