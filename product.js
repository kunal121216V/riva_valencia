
/* RIVA VALENCIA PRODUCT SYSTEM */

const productData = {
  id: 101,
  title: "Valencia Leather Handbag",
  price: 189,
  images: [
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1000",
    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1000"
  ]
};

let selectedColor = "Classic Brown";
let selectedSize = "Standard";
let quantity = 1;


/* IMAGE GALLERY */

const mainImage = document.getElementById("mainProductImage");
const thumbnails = document.querySelectorAll(".thumbnail");

thumbnails.forEach((thumbnail, index) => {

  thumbnail.addEventListener("click", () => {

    mainImage.src = productData.images[index];

    thumbnails.forEach(item =>
      item.classList.remove("active")
    );

    thumbnail.classList.add("active");

  });

});


/* COLOR SELECTION */

const colorButtons = document.querySelectorAll(".color-swatch");

colorButtons.forEach(button => {

  button.addEventListener("click", () => {

    colorButtons.forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");

    selectedColor = button.dataset.color;

    document.getElementById("selectedColor").textContent =
      selectedColor;

    document.getElementById("detailColor").textContent =
      selectedColor;

  });

});


/* SIZE SELECTION */

const sizeButtons = document.querySelectorAll(".size-button");

sizeButtons.forEach(button => {

  button.addEventListener("click", () => {

    sizeButtons.forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");

    selectedSize = button.dataset.size;

    document.getElementById("detailSize").textContent =
      selectedSize;

  });

});


/* QUANTITY */

const quantityDisplay =
  document.getElementById("productQuantity");

function updateQuantity() {

  quantityDisplay.textContent = quantity;

}

document.getElementById("increaseQuantity")
  .addEventListener("click", () => {

    if (quantity < 10) {
      quantity++;
      updateQuantity();
    }

  });

document.getElementById("decreaseQuantity")
  .addEventListener("click", () => {

    if (quantity > 1) {
      quantity--;
      updateQuantity();
    }

  });


/* ADD TO BAG */

const addButton = document.getElementById("addToBag");

addButton.addEventListener("click", () => {

  if (typeof addToCart !== "function") {
    alert("Cart system could not be loaded.");
    return;
  }

  const selectedProduct = {
    id: productData.id,
    title: productData.title + " - " + selectedSize,
    price: productData.price,
    image: mainImage.src,
    color: selectedColor
  };

  // Add product to the existing cart
  addToCart(selectedProduct);

  // Set the requested quantity
  const cart = JSON.parse(
    localStorage.getItem("rivaCart") || "[]"
  );

  const matchingProduct = cart.find(item =>
    String(item.id) === String(productData.id) &&
    item.color === selectedColor &&
    item.title === selectedProduct.title
  );

  if (matchingProduct) {
    matchingProduct.quantity += quantity - 1;
  }

  localStorage.setItem("rivaCart", JSON.stringify(cart));

  // Update header count
  const count = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const headerCount =
    document.getElementById("headerCartCount");

  if (headerCount) {
    headerCount.textContent = count;
  }

  // Notification
  showToast();

  // Reset quantity
  quantity = 1;
  updateQuantity();

});


/* TOAST NOTIFICATION */

function showToast() {

  const toast = document.getElementById("productToast");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);

}


/* WISHLIST */

const wishlistButton =
  document.getElementById("wishlistButton");

function getWishlist() {

  try {
    return JSON.parse(
      localStorage.getItem("rivaWishlist") || "[]"
    );
  } catch {
    return [];
  }

}

function updateWishlistButton() {

  const wishlist = getWishlist();

  const exists = wishlist.some(
    item => item.id === productData.id
  );

  wishlistButton.classList.toggle("active", exists);
  wishlistButton.setAttribute("aria-pressed", String(exists));
  wishlistButton.setAttribute(
    "aria-label",
    exists ? "Remove from wishlist" : "Add to wishlist"
  );

}

wishlistButton.addEventListener("click", () => {

  let wishlist = getWishlist();

  const exists = wishlist.some(
    item => item.id === productData.id
  );

  if (exists) {

    wishlist = wishlist.filter(
      item => item.id !== productData.id
    );

  } else {

    wishlist.push({
      id: productData.id,
      title: productData.title,
      price: productData.price,
      image: productData.images[0]
    });

  }

  localStorage.setItem(
    "rivaWishlist",
    JSON.stringify(wishlist)
  );

  updateWishlistButton();

});

updateWishlistButton();


/* IMAGE LIGHTBOX */

const lightbox =
  document.getElementById("productLightbox");

const lightboxImage =
  document.getElementById("lightboxImage");

document.getElementById("zoomButton")
  .addEventListener("click", () => {

    lightboxImage.src = mainImage.src;

    lightbox.classList.add("active");

  });

document.getElementById("closeLightbox")
  .addEventListener("click", () => {

    lightbox.classList.remove("active");

  });

lightbox.addEventListener("click", event => {

  if (event.target === lightbox) {
    lightbox.classList.remove("active");
  }

});

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    lightbox.classList.remove("active");
  }

});
