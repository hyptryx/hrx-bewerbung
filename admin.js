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

// ---------------------------------------------------------
// Firebase Config – DEINE ECHTEN DATEN HIER EINTRAGEN
// ---------------------------------------------------------
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  projectId: "DEIN_PROJEKT",
  storageBucket: "DEIN_PROJEKT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

// ---------------------------------------------------------
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elemente
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

// LOGIN
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

// LOGOUT
logoutButton.addEventListener("click", async () => {
  await signOut(auth);
});

// AUTH-STATUS
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.style.display = "none";
    adminSection.style.display = "block";
    startListening();
  } else {
    loginSection.style.display = "block";
    adminSection.style.display = "none";
    stopListening();
  }
});

// Firestore Listener starten
function startListening() {
  if (unsubscribe) return;

  const q = query(
    collection(db, "hrx_applications"),
    orderBy("createdAt", "desc")
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    lastSnapshot = snapshot;
    render(snapshot);
  });
}

// Listener stoppen
function stopListening() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  container.innerHTML = "";
}

// Filter ändern
statusFilter.addEventListener("change", () => {
  currentFilter = statusFilter.value;
  if (lastSnapshot) render(lastSnapshot);
});

// Render-Funktion
function render(snapshot) {
  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (currentFilter !== "all" && data.status !== currentFilter) return;

    const card = document.createElement("div");
    card.className = "application-card";

    card.innerHTML = `
      <h3>${data.email || "Unbekannt"}</h3>

      <p><strong>Plattform:</strong> ${data.plattform || "-"}</p>
      <p><strong>Empfohlen von:</strong> ${data.referrer || "-"}</p>

      <p><strong>Discord:</strong> ${data.discord || "-"}</p>

      <p><strong>Twitch:</strong> ${data.twitchName || "-"} (${data.twitchLink || "-"})</p>
      <p><strong>TikTok:</strong> ${data.tiktokName || "-"} (${data.tiktokLink || "-"})</p>

      <p><strong>Viewer:</strong> ${data.avgViewers ?? "-"} |
         <strong>Streams/Woche:</strong> ${data.streamsPerWeek ?? "-"}</p>

      <p><strong>Kategorie:</strong> ${data.category || "-"}</p>

      <p><strong>Motivation:</strong><br>${data.motivation || "-"}</p>

      <p><strong>Status:</strong>
        <span class="badge ${data.status}">${data.status}</span>
      </p>

      <div class="btn-row">
        <button class="btn btn-approve">Approve</button>
        <button class="btn btn-deny">Deny</button>
      </div>
    `;

    const approveBtn = card.querySelector(".btn-approve");
    const denyBtn = card.querySelector(".btn-deny");

    approveBtn.addEventListener("click", () => {
      updateDoc(doc(db, "hrx_applications", docSnap.id), {
        status: "approved"
      });
    });

    denyBtn.addEventListener("click", () => {
      updateDoc(doc(db, "hrx_applications", docSnap.id), {
        status: "denied"
      });
    });

    container.appendChild(card);
  });

  if (!container.innerHTML) {
    container.innerHTML = "<p>Keine Bewerbungen gefunden.</p>";
  }
}
