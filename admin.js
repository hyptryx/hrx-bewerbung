import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// gleiche Config wie in app.js
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  projectId: "DEIN_PROJEKT",
  storageBucket: "DEIN_PROJEKT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM
const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");
const loginStatus = document.getElementById("loginStatus");
const logoutButton = document.getElementById("logoutButton");

const container = document.getElementById("applications");
const statusFilter = document.getElementById("statusFilter");

let currentFilter = "all";
let lastSnapshot = null;
let unsubscribe = null;

// Login
loginButton.addEventListener("click", async () => {
  loginStatus.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    loginStatus.textContent = "Login erfolgreich.";
    loginStatus.style.color = "green";
  } catch (err) {
    loginStatus.textContent = "Login fehlgeschlagen.";
    loginStatus.style.color = "red";
  }
});

// Logout
logoutButton.addEventListener("click", async () => {
  await signOut(auth);
});

// Auth-Status
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.style.display = "none";
    adminSection.style.display = "block";
    startListening();
  } else {
    loginSection.style.display = "block";
    admin
