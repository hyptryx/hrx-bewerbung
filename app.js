import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---------------------------------------------------------
// Firebase Config – DEINE ECHTEN DATEN HIER EINTRAGEN
// ---------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCe4KxJOU7uWqgmXzi5NL-QKa0CGn-qpfI",
  authDomain: "hrx-bewerbungsseite.firebaseapp.com",
  projectId: "hrx-bewerbungsseite",
  storageBucket: "hrx-bewerbungsseite.firebasestorage.app",
  messagingSenderId: "651494196655",
  appId: "1:651494196655:web:0d2ee74ff0fc1295e69b5a"
};

console.log("Firebase Config geladen:", firebaseConfig);

// ---------------------------------------------------------
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase initialisiert:", app);

const form = document.getElementById("applicationForm");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("Formular wurde abgeschickt");

  const age18 = document.getElementById("age18").checked;
  const age16 = document.getElementById("age16").checked;
  const privacy = document.getElementById("privacy").checked;

  if (!age18 && !age16) {
    statusEl.textContent = "Bitte bestätige dein Alter.";
    statusEl.style.color = "red";
    return;
  }

  if (!privacy) {
    statusEl.textContent = "Bitte stimme der Datenschutzerklärung zu.";
    statusEl.style.color = "red";
    return;
  }

  const data = {
    plattform: form.plattform.value,
    referrer: form.referrer.value,
    email: form.email.value.trim(),
    discord: form.discord.value.trim(),
    twitchName: form.twitchName.value.trim(),
    twitchLink: form.twitchLink.value.trim(),
    tiktokName: form.tiktokName.value.trim(),
    tiktokLink: form.tiktokLink.value.trim(),
    avgViewers: form.avgViewers.value ? Number(form.avgViewers.value) : null,
    streamsPerWeek: form.streamsPerWeek.value ? Number(form.streamsPerWeek.value) : null,
    category: form.category.value,
    motivation: form.motivation.value.trim(),
    age18,
    age16,
    privacyAccepted: privacy,
    status: "pending",
    createdAt: serverTimestamp(),
  };

  console.log("Daten die gespeichert werden:", data);

  try {
    statusEl.textContent = "Sende...";
    statusEl.style.color = "#7b5cff";

    const docRef = await addDoc(collection(db, "hrx_applications"), data);

    console.log("Dokument gespeichert:", docRef.id);

    statusEl.textContent = "Bewerbung erfolgreich gesendet!";
    statusEl.style.color = "green";
    form.reset();
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
    statusEl.textContent = "Fehler beim Senden. Details in der Konsole.";
    statusEl.style.color = "red";
  }
});
