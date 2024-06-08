// Firebase and other module imports
import {
  deleteDoc,
  doc,
  collection,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { showMessage } from "./showMessage.js";
import { db, auth } from "./firebase.js";

// DOM element selectors
const dashboardContainer = document.querySelector(".dashboard"); // Dashboard container
const featureContainer = document.querySelector(".features"); // Features container
const postedLinks = document.querySelector(".dashboard__links-list"); // List of posted links
const closeDashboardButton = document.querySelector(".dashboard__close-button"); // Dashboard close button
const closeFeatureButton = document.querySelector(".features__close-button"); // Features close button
const dashboardToggle = document.querySelector(".header__dashboard-button"); // Dashboard toggle button
const featuresToggle = document.querySelector(".header__features-button"); // Features toggle button

// Function to create HTML for links
const createLinkHTML = (links) => `
<div class="dashboard__links-container list-group-item-action text-white flex items-center justify-between mb-4 mt-2">
    <button class="dashboard__copy-link-button relative transition duration-300 hover:text-gray-400" data-link-text="${
      links.shortUrl
    }">
        <i class="fa-regular fa-copy"></i>
    </button>
    <div class="dashboard__tooltip-container relative px-6"> 
        <p class="text-gray-300 font-light transition duration-300 hover:text-gray-400 cursor-pointer">
            ${links.shortUrl}
        </p>
        <span class="dashboard__tooltip bg-gray-800 text-white text-center rounded px-2 py-1 absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300">
        ${truncateUrl(links.originalUrl)}
    </span>
    </div>
    <button class="dashboard__delete-button relative transition duration-300 hover:text-gray-400" data-link-id="${
      links.docId
    }">
        <i class="fa-solid fa-delete-left"></i>
    </button>
</div>

`;

// Function to truncate URL
const truncateUrl = (url) =>
  url.length > 40 ? `${url.substring(0, 40)}...` : url;

// Event listener to toggle dashboard visibility
dashboardToggle?.addEventListener("click", () =>
  dashboardContainer.classList.toggle("hidden")
);

// Event listener to toggle features visibility
featuresToggle?.addEventListener("click", () => {
  featureContainer.classList.toggle("hidden");
  dashboardContainer.classList.add("hidden");
});

// Function to set up links
export const setupLinks = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Query to get user's links
      const userLinksQuery = query(
        collection(db, "usersLinks"),
        where("userId", "==", user.uid)
      );

      // Subscription to changes in user's links
      const unsubscribe = onSnapshot(userLinksQuery, (snapshot) => {
        const userLinks = snapshot.docs;

        // Generate HTML for links and insert into the DOM
        const html = userLinks
          .map((doc) => {
            const links = { ...doc.data(), docId: doc.id };
            return createLinkHTML(links);
          })
          .join("");

        postedLinks.innerHTML =
          html || '<h4 class="text-white">No links available</h4>';
        setupEventListeners(); // Set up event listeners for links
      });

      setupLinks.unsubscribe = () => unsubscribe(); // Function to cancel subscription
    } else {
      dashboardContainer.classList.add("hidden"); // Hide dashboard if no authenticated user
      if (setupLinks.unsubscribe) {
        setupLinks.unsubscribe();
      }
    }
  });
};

// Function to set up event listeners for links
const setupEventListeners = () => {
  document
    .querySelectorAll(".dashboard__delete-button, .dashboard__copy-link-button")
    .forEach((button) => {
      button.addEventListener("click", async (event) => {
        if (button.classList.contains("dashboard__delete-button")) {
          const linkId = button.getAttribute("data-link-id");
          await deleteLink(linkId); // Delete the link
        } else {
          const linkText = event.currentTarget.getAttribute("data-link-text");
          copyToClipboard(linkText); // Copy link URL to clipboard
          showMessage("Link copied to clipboard"); // Show success message
        }
      });
    });
};

// Function to delete a link
const deleteLink = async (linkId) => {
  try {
    await deleteDoc(doc(db, "usersLinks", linkId)); // Delete the corresponding document
    showMessage("Link deleted successfully"); // Show success message
  } catch (error) {
    console.error("Error deleting link:", error); // Log any errors to console
    showMessage("Error deleting link", "error"); // Show error message
  }
};

// Function to copy text to clipboard
const copyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

// Event listener to close the dashboard
closeDashboardButton?.addEventListener("click", () =>
  dashboardContainer.classList.add("hidden")
);

// Event listener to close the features container
closeFeatureButton?.addEventListener("click", () =>
  featureContainer.classList.add("hidden")
);
