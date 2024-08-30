// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import  {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVj48_gJrT5AprTTqrn6hbOgtoDvtg9lI",
  authDomain: "fashcardsaas.firebaseapp.com",
  projectId: "fashcardsaas",
  storageBucket: "fashcardsaas.appspot.com",
  messagingSenderId: "814266374759",
  appId: "1:814266374759:web:890bd0ff084810f8b192c2",
  measurementId: "G-MJB38FXTJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app)
export {db}