
/* ==========================================
   RIVA VALENCIA - COLLECTION ENGINE
========================================== */

const products = [
    {
        id: 101,
        name: "Valencia Leather Handbag",
        price: 189,
        category: "bags",
        gender: "women",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
        hoverImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700",
        tag: "BESTSELLER",
        stock: true
    },
    {
        id: 102,
        name: "Classic Quilted Bag",
        price: 225,
        category: "bags",
        gender: "women",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700",
        hoverImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
        tag: "NEW ARRIVAL",
        stock: true
    },
    {
        id: 103,
        name: "Heritage Crossbody",
        price: 159,
        category: "bags",
        gender: "women",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700",
        hoverImage: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=700",
        tag: "LIMITED EDITION",
        stock: true
    },
    {
        id: 104,
        name: "Minimal Leather Wallet",
        price: 89,
        category: "accessories",
        gender: "men",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700",
        hoverImage: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=700",
        tag: "ESSENTIAL",
        stock: true
    },
    {
        id: 105,
        name: "Everyday Leather Tote",
        price: 199,
        category: "bags",
        gender: "women",
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=700",
        hoverImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
        tag: "BESTSELLER",
        stock: true
    },
    {
        id: 106,
        name: "Urban Leather Backpack",
        price: 179,
        category: "bags",
        gender: "men",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
        hoverImage: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=700",
        tag: "NEW ARRIVAL",
        stock: true
    },
    {
        id: 107,
        name: "Signature Sunglasses",
        price: 119,
        category: "accessories",
        gender: "women",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700",
        hoverImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700",
        tag: "NEW",
        stock: true
    },
    {
        id: 108,
        name: "Premium Leather Belt",
        price: 79,
        category: "accessories",
        gender: "men",
        image: "https://images.unsplash.com/photo-1624222247344-550fb8d4b4f7?w=700",
        hoverImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
        tag: "ESSENTIAL",
        stock: false
    }
];


/* ==========================================
   ELEMENTS
========================================== */

const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const resultText = document.getElementById("resultText");
const noProducts = document.getElementById("noProducts");

const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");

let selectedCategory = "all";
let searchTerm = "";
let minimumPrice = 0;
let maximumPrice = Infinity;
let stockOnly = false;


/* ==========================================
   LOCAL STORAGE HELPERS
========================================== */

function readStorage(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getCartCount() {
    return readStorage("rivaCart").reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
    );
}

function updateHeaderCount() {
    const count = document.getElementById("headerCartCount");

    if (count) {
        count.textContent = getCartCount();
    }
}


/* ==========================================
   WISHLIST
========================================== */

function isWishlisted(id) {
    return readStorage("rivaWishlist").some(
        item => Number(item.id) === Number(id)
    );
}

function toggleWishlist(id) {

    const product = products.find(
        item => item.id === Number(id)
    );

    if (!product) return;

    let wishlist = readStorage("rivaWishlist");

    if (isWishlisted(id)) {

        wishlist = wishlist.filter(
            item => Number(item.id) !== Number(id)
        );

    } else {

        wishlist.push({
            id: product.id,
            title: product.name,
            price: product.price,
            image: product.image
        });

    }

    saveStorage("rivaWishlist", wishlist);

    renderProducts();
}


/* ==========================================
   ADD TO CART
========================================== */

function addProductToCart(id) {

    const product = products.find(
        item => item.id === Number(id)
    );

    if (!product) return;

    if (!product.stock) {
        showToast("SORRY, THIS PRODUCT IS OUT OF STOCK");
        return;
    }

    let cart = readStorage("rivaCart");

    const existing = cart.find(
        item =>
            Number(item.id) === product.id &&
            item.color === "Default" &&
            item.title === product.name
    );

    if (existing) {

        existing.quantity = (Number(existing.quantity) || 0) + 1;

    } else {

        cart.push({
            id: product.id,
            title: product.name,
            price: product.price,
            image: product.image,
            color: "Default",
            quantity: 1
        });

    }

    saveStorage("rivaCart", cart);

    updateHeaderCount();

    showToast("PRODUCT ADDED TO YOUR BAG ✓");
}


/* ==========================================
   TOAST
========================================== */

let toastTimer;

function showToast(message) {

    const toast = document.getElementById("shopToast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* ==========================================
   RENDER PRODUCTS
========================================== */

function renderProducts() {

    let filtered = [...products];

    // Category navigation
    if (selectedCategory !== "all") {

        if (selectedCategory === "women" || selectedCategory === "men") {

            filtered = filtered.filter(
                product => product.gender === selectedCategory
            );

        } else {

            filtered = filtered.filter(
                product => product.category === selectedCategory
            );

        }
    }

    // Sidebar category checkboxes
    const checkedCategories = [
        ...document.querySelectorAll(".category-filter:checked")
    ].map(input => input.value);

    if (checkedCategories.length > 0) {

        filtered = filtered.filter(product =>
            checkedCategories.some(category =>
                category === product.category ||
                category === product.gender
            )
        );

    }

    // Search
    if (searchTerm) {

        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.gender.toLowerCase().includes(searchTerm)
        );

    }

    // Price
    filtered = filtered.filter(product =>
        product.price >= minimumPrice &&
        product.price <= maximumPrice
    );

    // Stock
    if (stockOnly) {
        filtered = filtered.filter(product => product.stock);
    }

    // Sorting
    const sortValue = sortSelect.value;

    if (sortValue === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sortValue === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (sortValue === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Count
    productCount.textContent = filtered.length;
    resultText.textContent = `Showing ${filtered.length} products`;

    // Empty state
    if (filtered.length === 0) {

        productGrid.innerHTML = "";
        noProducts.style.display = "block";
        return;

    }

    noProducts.style.display = "none";

    // Product cards
    productGrid.innerHTML = filtered.map(product => `

        <article class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    data-hover="${product.hoverImage}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/700x850/f0ebe4/302820?text=Riva+Valencia'"
                >

                <span class="product-tag">
                    ${product.tag}
                </span>

                <button
                    class="wishlist-button ${isWishlisted(product.id) ? "active" : ""}"
                    data-wishlist="${product.id}"
                    aria-label="Toggle wishlist"
                    aria-pressed="${isWishlisted(product.id)}"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"/>
                    </svg>
                </button>

                <button
                    class="quick-add"
                    data-add="${product.id}"
                    ${!product.stock ? "disabled" : ""}
                >
                    ${product.stock ? "QUICK ADD + " : "OUT OF STOCK"}
                </button>

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category.toUpperCase()}
                </span>

                <h3>${product.name}</h3>

                <span class="product-price">
                    €${product.price.toFixed(2)} EUR
                </span>

            </div>

        </article>

    `).join("");

}


/* ==========================================
   IMAGE HOVER EFFECT
========================================== */

productGrid.addEventListener("mouseover", event => {

    const image = event.target.closest("img[data-hover]");

    if (image) {
        image.src = image.dataset.hover;
    }

});

productGrid.addEventListener("mouseout", event => {

    const image = event.target.closest("img[data-hover]");

    if (image) {

        const productCard = image.closest(".product-card");

        const button = productCard.querySelector("[data-add]");

        const product = products.find(
            item => item.id === Number(button.dataset.add)
        );

        if (product) {
            image.src = product.image;
        }

    }

});


/* ==========================================
   PRODUCT ACTIONS
========================================== */

productGrid.addEventListener("click", event => {

    const addButton = event.target.closest("[data-add]");
    const wishlistButton = event.target.closest("[data-wishlist]");

    if (addButton) {
        addProductToCart(addButton.dataset.add);
    }

    if (wishlistButton) {
        toggleWishlist(wishlistButton.dataset.wishlist);
    }

});


/* ==========================================
   CATEGORY NAVIGATION
========================================== */

document.querySelectorAll(".category-link").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".category-link").forEach(item =>
            item.classList.remove("active")
        );

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        // Clear sidebar category checkboxes
        document.querySelectorAll(".category-filter").forEach(input => {
            input.checked = false;
        });

        renderProducts();

    });

});


/* ==========================================
   SIDEBAR FILTERS
========================================== */

document.querySelectorAll(".category-filter").forEach(input => {
    input.addEventListener("change", renderProducts);
});

document.getElementById("applyPrice").addEventListener("click", () => {

    const min = document.getElementById("minPrice").value;
    const max = document.getElementById("maxPrice").value;

    minimumPrice = min === "" ? 0 : Math.max(0, Number(min));
    maximumPrice = max === "" ? Infinity : Math.max(0, Number(max));

    if (
        minimumPrice > maximumPrice ||
        !Number.isFinite(minimumPrice) ||
        (!Number.isFinite(maximumPrice) && maximumPrice !== Infinity)
    ) {
        showToast("PLEASE CHECK YOUR PRICE RANGE");
        return;
    }

    renderProducts();

});

document.getElementById("stockFilter").addEventListener("change", event => {

    stockOnly = event.target.checked;
    renderProducts();

});

document.getElementById("clearFilters").addEventListener("click", resetFilters);

document.getElementById("resetShop").addEventListener("click", resetFilters);

function resetFilters() {

    selectedCategory = "all";
    searchTerm = "";
    minimumPrice = 0;
    maximumPrice = Infinity;
    stockOnly = false;

    document.querySelectorAll(".category-filter").forEach(input => {
        input.checked = false;
    });

    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("stockFilter").checked = false;

    searchInput.value = "";
    sortSelect.value = "featured";

    document.querySelectorAll(".category-link").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === "all"
        );
    });

    renderProducts();

}


/* ==========================================
   SORTING
========================================== */

sortSelect.addEventListener("change", renderProducts);


/* ==========================================
   SEARCH
========================================== */

const searchPanel = document.getElementById("searchPanel");

document.getElementById("searchToggle").addEventListener("click", () => {

    searchPanel.classList.toggle("active");

    if (searchPanel.classList.contains("active")) {
        searchInput.focus();
    }

});

document.getElementById("closeSearch").addEventListener("click", () => {

    searchPanel.classList.remove("active");
    searchInput.value = "";
    searchTerm = "";

    renderProducts();

});

searchInput.addEventListener("input", () => {

    searchTerm = searchInput.value.trim().toLowerCase();

    renderProducts();

});


/* ==========================================
   MOBILE FILTER
========================================== */

document.getElementById("mobileFilterButton").addEventListener("click", () => {

    document.getElementById("filterSidebar")
        .classList.toggle("open");

});


/* ==========================================
   NEWSLETTER DEMO
========================================== */

document.getElementById("newsletterForm").addEventListener("submit", event => {

    event.preventDefault();

    showToast("THANK YOU FOR JOINING THE ATELIER!");

    event.target.reset();

});


/* ==========================================
   MOBILE MENU DEMO
========================================== */

document.getElementById("menuToggle").addEventListener("click", () => {

    showToast("MENU NAVIGATION COMING SOON");

});


/* ==========================================
   INITIALIZE
========================================== */

updateHeaderCount();
renderProducts();
