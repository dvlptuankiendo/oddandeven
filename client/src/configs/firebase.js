import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAjNs2bxWFWueXVSkMjs9A4w20Dzm9s9MU",
  authDomain: "project-2947478510646266936.firebaseapp.com",
  projectId: "project-2947478510646266936",
  storageBucket: "project-2947478510646266936.appspot.com",
  messagingSenderId: "745720037734",
  appId: "1:745720037734:web:9ac9beb53d2d0f59a948a7",
};

const app = firebase.initializeApp(config);

export default app;
