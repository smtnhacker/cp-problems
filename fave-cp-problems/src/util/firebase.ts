import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCS9Un8ksMEWVAaWMduEsu6qYVYgGQU68M",
    authDomain: "fave-cp-prob.firebaseapp.com",
    projectId: "fave-cp-prob",
    storageBucket: "fave-cp-prob.appspot.com",
    messagingSenderId: "556935955800",
    appId: "1:556935955800:web:e26603c46ab4d8bd2f112d",
    measurementId: "G-RDVX969QLL",
    databaseURL: "https://fave-cp-prob-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };

  export const app = initializeApp(firebaseConfig);
  export const analytics = getAnalytics(app);
  export const db = getDatabase(app)