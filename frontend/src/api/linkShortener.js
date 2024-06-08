import { showMessage } from "./showMessage.js";
import {
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth, db } from "./firebase.js";

// Function to initialize the link shortener
export function initializeLinkShortener() {
  // Flags to track button click and response arrival
  let buttonClicked = false;
  let responseReceived = false;

  // Assign input event listener
  const linkInput = document.querySelector(".shortener__form-url");
  linkInput.addEventListener("input", handleInputChange);

  // Assign click event listener
  const shortenerButton = document.getElementById("shortener__input-button");
  shortenerButton.addEventListener("click", postData);

  // Check user authentication state
  onAuthStateChanged(auth, (user) => {
    setTimeout(() => {
      if (!user) {
        showMessage(
          "You can shorten links, but they won't be saved. Please sign in to save them.",
          "warning"
        );
      }
    }, 4000);
  });

  // Handle input change event
  function handleInputChange(event) {
    const urlInput = event.target.value;
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(urlInput) && buttonClicked) {
      // Handle invalid input if the button was clicked
    }
  }

  // Handle button click event
  async function postData(event) {
    event.preventDefault();

    const inputElement = document.querySelector(".shortener__form-url");
    const errorMessage = document.querySelector(".shortener__error");
    const urlInput = inputElement.value;
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(urlInput)) {
      errorMessage.textContent = showMessage(
        "Please enter a valid URL",
        "error"
      );
      buttonClicked = true;
      return;
    }

    errorMessage.textContent = "";

    // Show loading message after 2 seconds
    const loadingMessageTimeout = setTimeout(() => {
      if (!responseReceived) {
        showMessage("Your link will be ready in a few seconds");
      }
    }, 2000);

    // Proxy API URL for URL shortening
    const proxyApiUrl = "https://corsproxyserver.onrender.com/api/v1/shorten";

    // Make request to the proxy server
    const response = await fetch(proxyApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: urlInput }),
    });

    // Clear the loading message timeout
    clearTimeout(loadingMessageTimeout);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Show success message
    showMessage("Link created successfully");
    inputElement.value = data.result_url;
    inputElement.setAttribute("title", urlInput); // Set tooltip

    const user = auth.currentUser;

    if (user) {
      // Save link data to Firestore
      const linkData = {
        userId: user.uid,
        originalUrl: urlInput,
        shortUrl: data.result_url,
      };

      try {
        await addDoc(collection(db, "usersLinks"), linkData);
      } catch (error) {
        console.error("Error adding document:", error);
      }
    }

    // Set the response received flag to true
    responseReceived = true;
  }
}

// Event listener for page load
document.addEventListener("DOMContentLoaded", () => {
  const copyIcon = document.querySelector(".shortener__form-icon");

  // Event listener for click on copy icon
  copyIcon.addEventListener("click", () => {
    const inputElement = document.querySelector(".shortener__form-url");

    // Check if input is empty
    if (inputElement.value.trim() === "") {
      // Show message if input is empty
      showMessage("Please, add first a link to shorten", "error");
      return; // Exit the function
    }

    // Select text in the input
    inputElement.select();
    document.execCommand("copy");

    // Deselect text
    window.getSelection().removeAllRanges();

    // Show success message
    showMessage("Link copied to clipboard", "success");
  });
});
