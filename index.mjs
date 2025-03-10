/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
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

const userProfilePictureEl = document.getElementById("user-profile-picture");
const userGreetingEl = document.getElementById("user-greeting");

const moodEmojiEls = document.getElementsByClassName("mood-emoji-btn");
const textareaEl = document.getElementById("post-input");

const allFilterButtonEl = document.getElementById("all-filter-btn");

const filterButtonEls = document.getElementsByClassName("filter-btn");

const postsEl = document.getElementById("posts");

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle);

signInButtonEl.addEventListener("click", authSignInWithEmail);
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail);

signOutButtonEl.addEventListener("click", authSignOut);

for (let moodEmojiEl of moodEmojiEls) {
  moodEmojiEl.addEventListener("click", selectMood);
}

for (let filterButtonEl of filterButtonEls) {
  filterButtonEl.addEventListener("click", selectFilter);
}

/* === State === */

let moodState = 0;

/* === Global Constants === */

const collectionName = "posts";

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
  signInWithPopup(auth, provider)
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

async function addPostToDB(postBody, user) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      body: postBody,
      uid: user.uid,
      createdAt: serverTimestamp(),
      mood: moodState,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error(error.message);
  }
}

async function updatePostInDB(docId, newBody) {
  const postRef = doc(db, collectionName, docId);

  await updateDoc(postRef, {
    body: newBody,
  });
}

async function deletePostFromDB(docId) {
  await deleteDoc(doc(db, collectionName, docId));
}

function fetchInRealtimeAndRenderPostsFromDB(query, user) {
  onSnapshot(query, (querySnapshot) => {
    clearAll(postsEl);

    querySnapshot.forEach((doc) => {
      renderPost(postsEl, doc);
    });
  });
}

function fetchTodayPosts(user) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const postsRef = collection(db, collectionName);

  const q = query(
    postsRef,
    where("uid", "==", user.uid),
    where("createdAt", ">=", startOfDay),
    where("createdAt", "<=", endOfDay),
    orderBy("createdAt", "desc"),
  );

  fetchInRealtimeAndRenderPostsFromDB(q, user);
}

function fetchWeekPosts(user) {
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);

  if (startOfWeek.getDay() === 0) {
    // If today is Sunday
    startOfWeek.setDate(startOfWeek.getDate() - 6); // Go to previous Monday
  } else {
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  }

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const postsRef = collection(db, collectionName);

  const q = query(
    postsRef,
    where("uid", "==", user.uid),
    where("createdAt", ">=", startOfWeek),
    where("createdAt", "<=", endOfDay),
    orderBy("createdAt", "desc"),
  );

  fetchInRealtimeAndRenderPostsFromDB(q, user);
}

function fetchMonthPosts(user) {
  const startOfMonth = new Date();
  startOfMonth.setHours(0, 0, 0, 0);
  startOfMonth.setDate(1);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const postsRef = collection(db, collectionName);

  const q = query(
    postsRef,
    where("uid", "==", user.uid),
    where("createdAt", ">=", startOfMonth),
    where("createdAt", "<=", endOfDay),
    orderBy("createdAt", "desc"),
  );

  fetchInRealtimeAndRenderPostsFromDB(q, user);
}

function fetchAllPosts(user) {
  const postsRef = collection(db, collectionName);

  const q = query(
    postsRef,
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc"),
  );

  fetchInRealtimeAndRenderPostsFromDB(q, user);
}

/* == Functions - UI Functions == */

function createPostHeader(postData) {
  /*
        <div class="header">
        </div>
    */
  const headerDiv = document.createElement("div");
  headerDiv.className = "header";

  /*
        <h3>21 Sep 2023 - 14:35</h3>
    */
  const headerDate = document.createElement("h3");
  headerDate.textContent = displayDate(postData.createdAt);
  headerDiv.appendChild(headerDate);

  /*
        <img src="assets/emojis/5.png">
    */
  const moodImage = document.createElement("img");
  moodImage.src = `assets/emojis/${postData.mood}.png`;
  headerDiv.appendChild(moodImage);

  return headerDiv;
}

function createPostBody(postData) {
  /*
        <p>This is a post</p>
    */
  const postBody = document.createElement("p");
  postBody.innerHTML = replaceNewlinesWithBrTags(postData.body);

  return postBody;
}

function createPostUpdateButton(wholeDoc) {
  const postId = wholeDoc.id;
  const postData = wholeDoc.data();

  /*
        <button class="edit-color">Edit</button>
    */
  const button = document.createElement("button");
  button.textContent = "Edit";
  button.classList.add("edit-color");
  button.addEventListener("click", function () {
    const newBody = prompt("Edit the post", postData.body);

    if (newBody) {
      updatePostInDB(postId, newBody);
    }
  });

  return button;
}

function createPostDeleteButton(wholeDoc) {
  const postId = wholeDoc.id;

  /*
        <button class="delete-color">Delete</button>
    */
  const button = document.createElement("button");
  button.textContent = "Delete";
  button.classList.add("delete-color");
  button.addEventListener("click", function () {
    deletePostFromDB(postId);
  });
  return button;
}

function createPostFooter(wholeDoc) {
  /*
        <div class="footer">
            <button>Edit</button>
            <button>Delete</button>
        </div>
    */
  const footerDiv = document.createElement("div");
  footerDiv.className = "footer";

  footerDiv.appendChild(createPostUpdateButton(wholeDoc));
  footerDiv.appendChild(createPostDeleteButton(wholeDoc));

  return footerDiv;
}

function renderPost(postsEl, wholeDoc) {
  const postData = wholeDoc.data();

  const postDiv = document.createElement("div");
  postDiv.className = "post";

  postDiv.appendChild(createPostHeader(postData));
  postDiv.appendChild(createPostBody(postData));
  postDiv.appendChild(createPostFooter(wholeDoc));

  postsEl.appendChild(postDiv);
}

function replaceNewlinesWithBrTags(inputString) {
  return inputString.replace(/\n/g, "<br>");
}

function postButtonPressed() {
  const postBody = textareaEl.value;
  const user = auth.currentUser;

  if (postBody && moodState) {
    addPostToDB(postBody, user);
    clearInputField(textareaEl);
    resetAllMoodElements(moodEmojiEls);
  }
}

function clearAll(element) {
  element.innerHTML = "";
}

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

function showUserGreeting(element, user) {
  const displayName = user.displayName;

  if (displayName) {
    const userFirstName = displayName.split(" ")[0];

    element.textContent = `Hey ${userFirstName}, how are you?`;
  } else {
    element.textContent = `Hey friend, how are you?`;
  }
}

function displayDate(firebaseDate) {
  if (!firebaseDate) {
    return "Date processing";
  }

  const date = firebaseDate.toDate();

  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${day} ${month} ${year} - ${hours}:${minutes}`;
}

/* = Functions - UI Functions - Mood = */

function selectMood(event) {
  const selectedMoodEmojiElementId = event.currentTarget.id;

  changeMoodsStyleAfterSelection(selectedMoodEmojiElementId, moodEmojiEls);

  const chosenMoodValue = returnMoodValueFromElementId(
    selectedMoodEmojiElementId,
  );

  moodState = chosenMoodValue;
}

function changeMoodsStyleAfterSelection(
  selectedMoodElementId,
  allMoodElements,
) {
  for (let moodEmojiEl of moodEmojiEls) {
    if (selectedMoodElementId === moodEmojiEl.id) {
      moodEmojiEl.classList.remove("unselected-emoji");
      moodEmojiEl.classList.add("selected-emoji");
    } else {
      moodEmojiEl.classList.remove("selected-emoji");
      moodEmojiEl.classList.add("unselected-emoji");
    }
  }
}

function resetAllMoodElements(allMoodElements) {
  for (let moodEmojiEl of allMoodElements) {
    moodEmojiEl.classList.remove("selected-emoji");
    moodEmojiEl.classList.remove("unselected-emoji");
  }

  moodState = 0;
}

function returnMoodValueFromElementId(elementId) {
  return Number(elementId.slice(5));
}

/* == Functions - UI Functions - Date Filters == */

function resetAllFilterButtons(allFilterButtons) {
  for (let filterButtonEl of allFilterButtons) {
    filterButtonEl.classList.remove("selected-filter");
  }
}

function updateFilterButtonStyle(element) {
  element.classList.add("selected-filter");
}

function fetchPostsFromPeriod(period, user) {
  if (period === "today") {
    fetchTodayPosts(user);
  } else if (period === "week") {
    fetchWeekPosts(user);
  } else if (period === "month") {
    fetchMonthPosts(user);
  } else {
    fetchAllPosts(user);
  }
}

function selectFilter(event) {
  const user = auth.currentUser;

  const selectedFilterElementId = event.target.id;

  const selectedFilterPeriod = selectedFilterElementId.split("-")[0];

  const selectedFilterElement = document.getElementById(
    selectedFilterElementId,
  );

  resetAllFilterButtons(filterButtonEls);

  updateFilterButtonStyle(selectedFilterElement);

  fetchPostsFromPeriod(selectedFilterPeriod, user);
}
