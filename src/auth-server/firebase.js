import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkaPsMiQIcpQa50kmCdeNBDFJBmkZzSto",
  authDomain: "event-share-8005c.firebaseapp.com",
  projectId: "event-share-8005c",
  storageBucket: "event-share-8005c.firebasestorage.app",
  messagingSenderId: "637355605609",
  appId: "1:637355605609:web:c918b61be6bbd90027ecf8",
  measurementId: "G-FFKF6T6EK1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
