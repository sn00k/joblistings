import { auth } from './firebase'
import React, { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/router'

const authContext = createContext()

export function ProvideAuth({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [user, setUser] = useState(null)

  const signin = (email, password) => {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user)
        return response.user
      });
  }

  const signup = (email, password) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user)
        return response.user
      });
  }
  
  const signout = () => {
    return auth
      .signOut()
      .then(() => {
        setUser(false)
      });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(false)
      }
    })

    // cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return {
    user,
    signin,
    signup,
    signout
  }
}

export function useRequireAuth(redirectUrl = '/login') {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.user === false) {
      router.push(redirectUrl)
    }
  }, [auth, router])

  return auth
} 
