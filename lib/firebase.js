import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()

export const fromMillis = firebase.firestore.Timestamp.fromMillis
export const serverTimestamp =
  firebase.firestore.FieldValue.serverTimestamp

// helper functions

/**
 * gets a user document with user id
 * @param  {string} uid
 */
export async function getUserWithUID(uid) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('uid', '==', uid).limit(1)
  const userDoc = (await query.get()).docs[0]

  return userDoc
}

/**
 * converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function jobPostToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
  }
}
