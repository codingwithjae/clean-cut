export function initializeModal() {
  // Wait for the DOM content to be fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const signInButton = document.getElementById('header__signin-button');
    const modal = document.getElementById('main__signup-modal');
    const closeButton = document.getElementById('main__signup-modal-close');

    // Add event listener to show modal when sign-in button is clicked
    signInButton.addEventListener('click', function () {
      modal.classList.remove('hidden'); // Remove 'hidden' class to show the modal
      modal.setAttribute('aria-hidden', 'false'); // Update aria-hidden attribute
    });

    // Add event listener to hide modal when close button is clicked
    closeButton.addEventListener('click', function () {
      modal.classList.add('hidden'); // Add 'hidden' class to hide the modal
      modal.setAttribute('aria-hidden', 'true'); // Update aria-hidden attribute
    });
  });
}
