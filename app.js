import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Deine Firebase Config einfügen
const firebaseConfig = {
  apiKey: "AIzaSyCe4KxJOU7uWqgmXzi5NL-QKa0CGn-qpfI",
  authDomain: "hrx-bewerbungsseite.firebaseapp.com",
  projectId: "hrx-bewerbungsseite",
  storageBucket: "hrx-bewerbungsseite.firebasestorage.app",
  messagingSenderId: "651494196655",
  appId: "1:651494196655:web:0d2ee74ff0fc1295e69b5a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("applicationForm");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const age18 = document.getElementById("age18").checked;
  const age16 = document.getElementById("age16").checked;
  const privacy = document.getElementById("privacy").checked;

  if (!age18 && !age16) {
    statusEl.textContent = "Bitte bestätige dein Alter (mind. 16 oder 18).";
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

  try {
    statusEl.textContent = "Sende...";
    statusEl.style.color = "#7b5cff";

    await addDoc(collection(db, "hrx_applications"), data);

    statusEl.textContent = "Bewerbung erfolgreich gesendet!";
    statusEl.style.color = "green";
    form.reset();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Fehler beim Senden.";
    statusEl.style.color = "red";
  }
});

