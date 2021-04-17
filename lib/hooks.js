import { auth, firestore } from './firebase'
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
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

export function useCheckIfDocExists(path, doc) {
  const [docExists, setDocExists] = useState(false)
  const id = useRef(null)

  const clear = () => window.clearInterval(id.current)

  useEffect(() => {
    id.current = window.setTimeout(() => {
      checkIfDocExists(doc)
    }, 500)

    return clear
  }, [path, doc])

  const checkIfDocExists = async (doc) => {
    if (doc.length >= 4) {
      const ref = firestore.doc(path)
      const { exists } = await ref.get()
      if (exists) {
        setDocExists(true)
      } else {
        setDocExists(false)
      }
    }
  }

  return docExists
}

export function useRouterStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState()

  const router = useRouter()

  useEffect(() => {
    const start = () => {
      setIsLoading(true)
    }
    const complete = () => {
      setIsLoading(false)
      setIsError(false)
      setError()
    }
    const error = (error) => {
      setIsLoading(false)
      setIsError(true)
      setError(error)
    }

    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', complete)
    router.events.on('routeChangeError', error)

    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', complete)
      router.events.off('routeChangeError', error)
    }
  }, [])

  return { isLoading, isError, error }
}
