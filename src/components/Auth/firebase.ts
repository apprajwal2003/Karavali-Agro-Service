// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAe6fxN3v-XOENfDpLdHYjyeumjoeGkUI",
  authDomain: "karavali-agro-services.firebaseapp.com",
  projectId: "karavali-agro-services",
  storageBucket: "karavali-agro-services.appshot.app",
  messagingSenderId: "605480877382",
  appId: "1:605480877382:web:6bbf15a861b50606c6b947",
  measurementId: "G-0Z8WP6913J",
};

// Initialize Firebase
const app = getApps().length == 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };
