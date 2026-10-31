
document.addEventListener("DOMContentLoaded", () => {

  const signInTab = document.getElementById("signInTab");
  const registerTab = document.getElementById("registerTab");

  const loginContent = document.getElementById("loginContent");
  const registerContent = document.getElementById("registerContent");
  const forgotContent = document.getElementById("forgotContent");

  // Switch authentication screens

  function showScreen(screen) {

    loginContent.classList.toggle("hidden", screen !== "login");
    registerContent.classList.toggle("hidden", screen !== "register");
    forgotContent.classList.toggle("hidden", screen !== "forgot");

    signInTab.classList.toggle("active", screen === "login");
    registerTab.classList.toggle("active", screen === "register");

    document.querySelector(".auth-divider").style.display =
      screen === "forgot" ? "none" : "flex";

    document.querySelector(".google-button").style.display =
      screen === "forgot" ? "none" : "block";

    document.querySelector(".auth-tabs").style.display =
      screen === "forgot" ? "none" : "grid";
  }

  signInTab.addEventListener("click", () => showScreen("login"));

  registerTab.addEventListener("click", () => showScreen("register"));

  document.getElementById("joinButton").addEventListener("click", () => {
    showScreen("register");
  });

  document.getElementById("backToLogin").addEventListener("click", () => {
    showScreen("login");
  });

  document.getElementById("forgotLink").addEventListener("click", event => {
    event.preventDefault();
    showScreen("forgot");
  });

  document.getElementById("returnLogin").addEventListener("click", () => {
    showScreen("login");
  });


  // Show / Hide password

  document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", () => {

      const input = document.getElementById(button.dataset.target);

      input.type = input.type === "password" ? "text" : "password";

      button.textContent = input.type === "password" ? "◉" : "◎";

    });

  });


  // Login demo

  document.getElementById("loginForm").addEventListener("submit", event => {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const message = document.getElementById("loginMessage");

    if (!email || !password) return;

    message.style.color = "#a33";
    message.textContent = "Authentication backend is not connected yet.";

  });


  // Registration demo

  document.getElementById("registerForm").addEventListener("submit", event => {

    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    const message = document.getElementById("registerMessage");

    if (!name || !email || password.length < 8) return;

    message.style.color = "#a33";
    message.textContent = "Registration backend is not connected yet.";

  });


  // Password reset demo

  document.getElementById("forgotForm").addEventListener("submit", event => {

    event.preventDefault();

    const email = document.getElementById("forgotEmail").value.trim();

    const message = document.getElementById("forgotMessage");

    if (!email) return;

    message.style.color = "#a33";
    message.textContent = "Password reset service is not connected yet.";

  });


  // Google sign-in placeholder

  document.getElementById("googleButton").addEventListener("click", () => {

    alert("Google authentication will be integrated during backend development.");

  });

});
