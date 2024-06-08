/**
 * Initializes the loader by hiding it after a specified time delay.
 */
export function initializeLoader() {
  // Get the loader element
  const loader = document.querySelector(".loader");

  // Hide the loader after 2 seconds (2000 milliseconds)
  setTimeout(() => {
    loader.classList.add("loader__hidden");
  }, 2000);
}

// Add event listener to initialize the loader when the window loads
window.addEventListener("load", initializeLoader);
