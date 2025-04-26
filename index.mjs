/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

/* === Firebase Setup === */
/* IMPORTANT: Replace this with your own firebaseConfig when doing challenges */
const firebaseConfig = {
  apiKey: "AIzaSyCu5Lf5E7MxuSUYR5T7zqUo9HNLFaD1530",
  authDomain: "stable-splicer-447620-b4.firebaseapp.com",
  projectId: "stable-splicer-447620-b4",
  storageBucket: "stable-splicer-447620-b4.firebasestorage.app",
  messagingSenderId: "413377316902",
  appId: "1:413377316902:web:c1c39fd3d328f084fabee7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Persistence successfully set
    console.log("Firebase persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

document.getElementById("connect-strava-btn").addEventListener("click", () => {
  const clientId = "144789";
  const redirectUri = encodeURIComponent(
    "http://dev.fitnessllm.app/fitnessllm-frontend/index.html",
  ); // Update this to match your Strava settings
  window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=read,activity:read`;
});

/* === UI === */
document.addEventListener("DOMContentLoaded", function () {
  // Extract the authorization code from URL
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");

  if (authCode) {
    console.log("Authorization code received:", authCode);
    exchangeAuthCodeForTokens(authCode);
  }
});

// Function to exchange the authorization code for tokens
function exchangeAuthCodeForTokens(authCode) {
  const clientId = "144789";
  const clientSecret = "a79a3452fd3ba4680f29ff57d45754aba49c02b2"; // Store securely in production

  // Create form data to send to Strava
  const formData = new URLSearchParams();
  formData.append("client_id", clientId);
  formData.append("client_secret", clientSecret);
  formData.append("code", authCode);
  formData.append("grant_type", "authorization_code");

  // Make the POST request to Strava
  fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Token response received:", data);

      // Check if we received the expected data
      if (data && data.access_token) {
        console.log("Access token received:", data.access_token);
        console.log("Refresh token received:", data.refresh_token);

        // Save tokens to Firebase
        saveTokensToFirebase(data.access_token, data.refresh_token);
      } else {
        console.error("Invalid response from Strava:", data);
      }
    })
    .catch((error) => {
      console.error("Error exchanging code for tokens:", error);
    });
}

// Function to save tokens to Firebase with JSON parse/stringify to remove undefined values
function saveTokensToFirebase(accessToken, refreshToken) {
  const user = auth.currentUser;

  if (user) {
    // Create a reference to a user-specific document to store the tokens
    const userRef = doc(db, "users", user.uid);

    // Prepare data object
    const dataToSave = {
      stravaAccessToken: accessToken,
      stravaRefreshToken: refreshToken,
      stravaTokenTimestamp: serverTimestamp(),
    };

    // Remove undefined values by converting to JSON and back
    const cleanData = JSON.parse(JSON.stringify(dataToSave));

    // Add timestamp back (as it's lost in the JSON conversion)
    cleanData.stravaTokenTimestamp = serverTimestamp();

    // Update the document with clean data
    updateDoc(userRef, cleanData)
      .then(() => {
        console.log("Strava tokens saved successfully");
        // You might want to update UI or redirect the user after successful token storage
      })
      .catch((error) => {
        console.error("Error saving tokens:", error);
      });
  } else {
    console.error("No user logged in, cannot save tokens");
  }
}

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");

const signInWithGoogleButtonEl = document.getElementById(
  "sign-in-with-google-btn",
);

const emailInputEl = document.getElementById("email-input");
const passwordInputEl = document.getElementById("password-input");

const signInButtonEl = document.getElementById("sign-in-btn");
const createAccountButtonEl = document.getElementById("create-account-btn");

const signOutButtonEl = document.getElementById("sign-out-btn");

const userGreetingEl = document.getElementById("user-greeting");

const allFilterButtonEl = document.getElementById("all-filter-btn");
/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle);

signInButtonEl.addEventListener("click", authSignInWithEmail);
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail);

signOutButtonEl.addEventListener("click", authSignOut);

/* === Main Code === */

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView();
    showUserGreeting(userGreetingEl, user);
    updateFilterButtonStyle(allFilterButtonEl);
    fetchAllPosts(user);
  } else {
    showLoggedOutView();
  }
});

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
  signInWithRedirect(auth, provider)
    .then((result) => {
      console.log("Signed in with Google");
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function authSignInWithEmail() {
  const email = emailInputEl.value;
  const password = passwordInputEl.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      clearAuthFields();
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function authCreateAccountWithEmail() {
  const email = emailInputEl.value;
  const password = passwordInputEl.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      clearAuthFields();
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function authSignOut() {
  signOut(auth)
    .then(() => {})
    .catch((error) => {
      console.error(error.message);
    });
}

/* = Functions - Firebase - Cloud Firestore = */
function showLoggedOutView() {
  hideView(viewLoggedIn);
  showView(viewLoggedOut);
}

function showLoggedInView() {
  hideView(viewLoggedOut);
  showView(viewLoggedIn);
}

function showView(view) {
  view.style.display = "flex";
}

function hideView(view) {
  view.style.display = "none";
}

function clearInputField(field) {
  field.value = "";
}

function clearAuthFields() {
  clearInputField(emailInputEl);
  clearInputField(passwordInputEl);
}
