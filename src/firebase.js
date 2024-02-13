// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// New imports for authentication

import { getFirestore, query, getDocs, collection, where, addDoc } from "@firebase/firestore"
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth"

import { useNavigate } from "react-router-dom";

// firebase configuration (firebase connectivity) --> all credentials 

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MSG_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();



// Sign in with google function snippet
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    console.log(auth);
    console.log(res);
    // const user_obj = res.user;
    // console.log(user_obj);
    const user_obj = auth.currentUser;
    console.log(user_obj);
    const q = query(collection(db, "Users"), where('uid', '==', user_obj.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "Users"), {
        uid: user_obj.uid,
        name: user_obj.displayName,
        authProvider: "google",
        email: user_obj.email,
      });
      alert("Login success with authProvider: Google")
    }

  } catch (err) {
    console.error(err);
    alert(err);
  }
};



// login option with email and password if the user is registered function snippet
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    // alert("Login Success ")
  } catch (err) {
    alert("Error while signin. \n May be your are not registered or may be invalid credentials \n " + err.message)
    console.error(err);
  }
};




// registeration function snippet
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    const user_obj = auth.currentUser;
    await addDoc(collection(db, "Users"), {
      uid: user_obj.uid,
      name,
      authProvider: "local",
      email,
    });
    alert("Thank you for registeration")
  } catch (err) {
    console.error(err, "hello saving error");
    alert(err.message);
  }
};




// reset password function snippet
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};




// logout function snippet
const Logout = async (navigate) => {
  await signOut(auth);
  navigate("/")
  alert("Logout Success");

};




// exporting all the utilities
export { auth, db, signInWithGoogle, logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, Logout };