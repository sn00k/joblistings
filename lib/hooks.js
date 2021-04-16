import { auth } from './firebase'
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react'
import { useRouter } from 'next/router'

// auth
const authContext = createContext()

export function ProvideAuth({ children }) {
  const auth = useProvideAuth()
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
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
      })
  }

  const signup = (email, password) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user)
        return response.user
      })
  }

  const signout = () => {
    return auth.signOut().then(() => {
      setUser(false)
    })
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
    signout,
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

// form handling & validation
export function useForm(initialValues, callback, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback()
    }
  }, [errors])

  useEffect(() => {
    setErrors(validate(values))
  }, [values])

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }

    setErrors(validate(values))
    setIsSubmitting(true)
  }

  const handleChange = (e) => {
    e.persist()

    if (e.target.dataset) {
      setValues((values) => ({
        ...values,
        [e.target.name]: {
          ...Object.assign({}, e.target.dataset),
          data: e.target.value,
        },
      }))
    } else {
      setValues((values) => ({
        ...values,
        [e.target.name]: { data: e.target.value },
      }))
    }
  }

  return {
    handleSubmit,
    handleChange,
    values,
    errors,
  }
}

export function useCheckMobileView() {
  const [mobileView, setMobileView] = useState(false)

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1024
        ? setMobileView(true)
        : setMobileView(false)
    }

    setResponsiveness()
    window.addEventListener('resize', () => setResponsiveness())

    return () =>
      window.removeEventListener('resize', () => setResponsiveness())
  }, [])

  return mobileView
}
