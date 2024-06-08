import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";

const signupForm = document.querySelector("#signup-form");

// Event listener for form submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  console.log(email, password);

  try {
    // Create user with email and password
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Show welcome message
    showMessage("Welcome " + userCredentials.user.email);

    console.log(userCredentials);
  } catch (error) {
    // Handle different error cases
    if (error.code === "auth/email-already-in-use") {
      showMessage("Email already in use", "error");
    } else if (error.code === "auth/invalid-email") {
      showMessage("Invalid email", "error");
    } else if (error.code === "auth/weak-password") {
      showMessage("Weak password", "error");
    } else if (error.code) {
      showMessage("Something went wrong", "error");
    }
  }
});
