
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6qbvP75LyhV2bocejvWC72VfnGTnvZ0w",
  authDomain: "speaking-coach-96743.firebaseapp.com",
  projectId: "speaking-coach-96743",
  storageBucket: "speaking-coach-96743.firebasestorage.app",
  messagingSenderId: "914212540894",
  appId: "1:914212540894:web:5e9507fd70e5b9bd4bcd4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
