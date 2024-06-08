import {
  GithubAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";

// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Select the GitHub login button
  const githubButton = document.querySelector("#gitHubLogin");

  // Add an event listener to the GitHub login button
  githubButton.addEventListener("click", async () => {
    // Create an instance of the GitHub authentication provider
    const provider = new GithubAuthProvider();

    try {
      // Sign in with the GitHub popup window
      const credentials = await signInWithPopup(auth, provider);

      // Show a welcome message with the user's display name
      showMessage("Welcome " + credentials.user.displayName + "!");
    } catch (error) {
      // Log any errors
      showMessage("Error to login in", "error");
    }
  });
});
