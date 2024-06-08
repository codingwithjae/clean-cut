import {
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";

// Select Google login button
const googleButton = document.querySelector("#googleLogin");

// Add event listener to Google login button
googleButton.addEventListener("click", async () => {
  // Create Google auth provider instance
  const provider = new GoogleAuthProvider();

  try {
    // Sign in with Google popup
    const credentials = await signInWithPopup(auth, provider);

    // Show welcome message with user's display name
    showMessage("Welcome " + credentials.user.displayName);
  } catch (error) {
    // Log any errors
    showMessage("Error to login in", "error");
  }
});
