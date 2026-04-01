// Firebase config AquaFlow
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAw1h1K-gSdIiTJy8fUeBy1c8BsOLvNgS4",
  authDomain: "aquaflow-61d9a.firebaseapp.com",
  projectId: "aquaflow-61d9a",
  storageBucket: "aquaflow-61d9a.firebasestorage.app",
  messagingSenderId: "454757999714",
  appId: "1:454757999714:web:6385d2c5c0e131c071dd3b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ── Login com Google ──────────────────────────────────────────────────────────
export async function loginGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Salva o usuário no Firestore se for novo
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        nome: user.displayName,
        email: user.email,
        foto: user.photoURL,
        criadoEm: new Date().toISOString(),
        plano: "free",
        aquarios: []
      });
    }
    return user;
  } catch (err) {
    console.error("Erro no login:", err);
    throw err;
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ── Observa estado do usuário ─────────────────────────────────────────────────
export function onUsuarioMuda(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Expõe globalmente para o index.html ───────────────────────────────────────
window.aquaAuth = { loginGoogle, logout, onUsuarioMuda, auth, db };
