const loggedOutLinks = document.querySelectorAll(".header__logged-out-buttons");
const loggedOutButtonOut = document.querySelectorAll(".logged-in");
const logOutButtonIn = document.getElementById("log-out");
const formModalClose = document.getElementById("main__signup-modal");

export const loginCheck = (user) => {
  // Check if user is logged in
  if (user) {
    // If logged in, show logged-out buttons and hide logged-in buttons
    loggedOutButtonOut.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
    logOutButtonIn.style.visibility = "visible"; // Show log-out button
    logOutButtonIn.classList.add("opacity-100"); // Add class to adjust opacity
    formModalClose.classList.add("hidden"); // Hide the sign-up modal
  } else {
    // If not logged in, hide logged-out buttons and show logged-in buttons
    loggedOutButtonOut.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
    logOutButtonIn.style.visibility = "hidden"; // Hide log-out button
  }
};
