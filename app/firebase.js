import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD3mZnKux-s9cd7gIjyeqhq7d-qQdZq6cw",
    authDomain: "distribuidos-bc599.firebaseapp.com",
    projectId: "distribuidos-bc599",
    storageBucket: "distribuidos-bc599.appspot.com",
    messagingSenderId: "732114803800",
    appId: "1:732114803800:web:930c82ea283ddb18757e2d"
  };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
