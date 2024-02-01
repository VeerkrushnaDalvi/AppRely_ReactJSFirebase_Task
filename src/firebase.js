// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// New imports for authentication

import {getFirestore, query, getDocs, collection, where, addDoc} from "@firebase/firestore"
import {GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from "firebase/auth"
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




const signInWithGoogle = async () =>{
  try{
    const res = await signInWithPopup(auth, googleProvider);
    console.log(auth);
    console.log(res);
    const user_obj = res.user;
    console.log(user_obj);
    const q = query(collection(db,"users"), where('uid', '==', user_obj.uid));
    const docs = await getDocs(q);
    if(docs.docs.length === 0){
        await addDoc(collection(db, "users"),{
          uid:user_obj.uid,
          name:user_obj.displayName,
          authProvider:"google",
          email:user_obj.email,
        });
        alert("Login success with authProvider: Google")
    }
    
  }catch(err){
    console.error(err);
    alert(err);
  }
};


const  logInWithEmailAndPassword = async (email, password) => {
  try{
    await signInWithEmailAndPassword(auth,email,password);
    alert("Login Success ")
  } catch (err){
    alert("Error while signin. \n May be your are not registered or may be invalid credentials ")
    console.error(err);
  }
};




const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user_obj = res.user;
    console.log(user_obj)
    await addDoc(collection(db, "users"), {
      uid: user_obj.uid,
      name,
      authProvider: "local",
      email,
    });
    alert("Thank you for registeration")
  } catch (err) {
    console.error(err,"hello saving error");
    alert(err.message);
  }
};



const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};



const logout = () => {
  signOut(auth);
  alert("Logout Success")
};



export {auth, db, signInWithGoogle, logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, logout};