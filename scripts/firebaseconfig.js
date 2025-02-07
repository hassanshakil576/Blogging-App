import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAubsU2viTTyeUupCx3B6nQaDDz1Gbv8sY",
  authDomain: "blogging-app-3a50e.firebaseapp.com",
  projectId: "blogging-app-3a50e",
  storageBucket: "blogging-app-3a50e.firebasestorage.app",
  messagingSenderId: "844727321349",
  appId: "1:844727321349:web:9980c3018382cebf0bed6c",
  measurementId: "G-N6B2NV5GZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);