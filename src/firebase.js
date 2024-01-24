// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  // apiKey: "AIzaSyAxDc0_HYpI7DpQJszJeRU5tzXqNifs79E",
  // authDomain: "hip-wharf-386618.firebaseapp.com",
  // projectId: "hip-wharf-386618",
  // storageBucket: "hip-wharf-386618.appspot.com",
  // messagingSenderId: "997806278968",
  // appId: "1:997806278968:web:8698800631283bd1c659cd",
  // measurementId: "G-VQR296S4M3"
  apiKey: `${process.env.API_KEY}`,
  authDomain: `${process.env.AUTH_DOMAIN}`,
  projectId: `${process.env.PROJECT_ID}`,
  storageBucket: `${process.env.STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.MSG_SENDER_ID}`,
  appId: `${process.env.APP_ID}`,
  measurementId: `${process.env.MEASUREMENT_ID}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const firestore = getFirestore(app);