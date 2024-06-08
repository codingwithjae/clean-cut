const navLinks = document.querySelector(".header__navbar-container");
let isOpen = false;
let currentIcon = null;

// Function to create icon element
function createIcon(iconClass) {
  const icon = document.createElement("i");
  icon.className = `fa ${iconClass} header__nav-icon text-3xl cursor-pointer md:hidden text-white transition-transform`;
  return icon;
}

// Function to initialize the menu button
export function initializeMenuButton() {
  const buttonContainer = document.querySelector(".header__menu-button");
  currentIcon = createIcon("fa-bars");
  currentIcon.onclick = onToggleMenu; // Asignamos el evento onclick aquí
  buttonContainer.appendChild(currentIcon);
}

// Function to toggle the menu
export function onToggleMenu() {
  isOpen = !isOpen;
  navLinks.style.top = isOpen ? "120px" : "-160%";

  // Determine the icon class based on the menu state
  const iconClass = isOpen ? "fa-times" : "fa-bars";
  currentIcon.className = `fa ${iconClass} header__nav-icon text-3xl cursor-pointer md:hidden text-white transition-transform`;
  currentIcon.classList.toggle("rotate-90", isOpen);
}
