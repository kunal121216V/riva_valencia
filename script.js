
// ==================================
// RIVA VALENCIA - MAIN JAVASCRIPT
// ==================================

// SIDE MENU

const menuToggle = document.getElementById("menuToggle");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");

function setMenu(open) {
  sideMenu?.classList.toggle("open", open);
  menuOverlay?.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

menuToggle?.addEventListener("click", () => {
  setMenu(true);
});

closeMenu?.addEventListener("click", () => {
  setMenu(false);
});

menuOverlay?.addEventListener("click", () => {
  setMenu(false);
});

sideMenu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    setMenu(false);
  });
});


// SEARCH PANEL

const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");

searchToggle?.addEventListener("click", () => {

  searchPanel?.classList.toggle("open");

  if (searchPanel?.classList.contains("open")) {
    searchPanel.querySelector("input")?.focus();
  }

});


// SEARCH DEMO

document.getElementById("searchForm")?.addEventListener("submit", event => {

  event.preventDefault();

  const term = event.currentTarget
    .querySelector("input")
    .value.trim();

  if (term) {
    alert(
      `Search will be connected to the product catalogue in the next phase. You searched for: ${term}`
    );
  }

});


// WISHLIST

let wishlist = JSON.parse(
  localStorage.getItem("rvWishlist") || "[]"
);

function updateWishlistCount() {

  const count = document.getElementById("wishCount");

  if (!count) return;

  count.textContent = wishlist.length;

  count.classList.toggle(
    "visible",
    wishlist.length > 0
  );

}


// WISHLIST BUTTONS

document.querySelectorAll(".wish-button").forEach((button, index) => {

  const productName = button
    .closest(".product-card")
    ?.querySelector(".product-name")
    ?.textContent.trim() || `Product ${index + 1}`;

  // Restore wishlist state

  if (wishlist.includes(productName)) {

    button.classList.add("active");
    button.textContent = "♥";

  }

  button.addEventListener("click", () => {

    if (wishlist.includes(productName)) {

      wishlist = wishlist.filter(
        item => item !== productName
      );

      button.classList.remove("active");
      button.textContent = "♡";

    } else {

      wishlist.push(productName);

      button.classList.add("active");
      button.textContent = "♥";

    }

    localStorage.setItem(
      "rvWishlist",
      JSON.stringify(wishlist)
    );

    updateWishlistCount();

  });

});

updateWishlistCount();


// NEWSLETTER

document.getElementById("newsletterForm")
  ?.addEventListener("submit", event => {

    event.preventDefault();

    const email = event.currentTarget
      .querySelector("input")
      .value.trim();

    const message = document.getElementById(
      "newsletterMessage"
    );

    if (email) {

      message.textContent =
        "Thank you. You are on the list.";

      event.currentTarget.reset();

    }

});


// PLACEHOLDER LINKS

document.querySelectorAll('a[href="#"]').forEach(link => {

  link.addEventListener("click", event => {

    event.preventDefault();

    alert(
      "This page will be added during the next development phase."
    );

  });

});
