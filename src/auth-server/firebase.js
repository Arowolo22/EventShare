// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
