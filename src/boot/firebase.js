import firebase from 'firebase/app'
// Required for side-effects
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.QUISAGRAM_API_KEY,
  authDomain: process.env.QUISAGRAM_AUTH_DOMAIN,
  projectId: process.env.QUISAGRAM_PROJECT_ID,
  storageBucket: process.env.QUISAGRAM_STORAGE_BUCKET,
  messagingSenderId: process.env.QUISAGRAM_MESSAGING_SENDER_ID,
  appId: process.env.QUISAGRAM_APP_ID
}

// Initialize Firebase

firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  storage,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}
