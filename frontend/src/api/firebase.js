import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBim2G514ADqYUApXAJuCOnf0AYsCQirrE",
  authDomain: "scissor-app-5beeb.firebaseapp.com",
  databaseURL: "https://scissor-app-5beeb-default-rtdb.firebaseio.com",
  projectId: "scissor-app-5beeb",
  storageBucket: "scissor-app-5beeb.appspot.com",
  messagingSenderId: "939427112588",
  appId: "1:939427112588:web:76d42a455092c18b04bda9",
  measurementId: "G-9THLCC99R5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);