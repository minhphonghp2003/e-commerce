import { initializeApp } from "firebase/app";


const firebaseConfig = {

    apiKey: "AIzaSyC4DPL618IrHN-qIoLYHT683ZefKvRsMjU",
    authDomain: "staticfile-9a793.firebaseapp.com",
    projectId: "staticfile-9a793",
    storageBucket: "staticfile-9a793.appspot.com",
    messagingSenderId: "810775382890",
    appId: "1:810775382890:web:83607a1de87040449a3313",
    measurementId: "G-GSPX8CDSBD"

};


// Initialize Firebase

const firebase_app  = initializeApp(firebaseConfig);


export default {firebase_app}
