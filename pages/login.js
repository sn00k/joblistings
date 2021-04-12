import { firestore } from '../lib/firebase'
import { formReducer } from '../lib/reducers'
import { useAuth } from '../lib/hooks'
import { useState, useReducer } from 'react'
import { Button, CardActions, TextField, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import CenteredCard from '../components/CenteredCard'

const useStyles = makeStyles({
  actions: {
    marginTop: 20,
    justifyContent: 'space-between'
  }
})

export default function Login() {
  return (
    <main>
      <CenteredCard title="Login/Create account">
        <LogInForm />
      </CenteredCard>
    </main>
  )
}

function LogInForm() {
  const initialValues = {
    email: '',
    password: ''
  }
  const [state, dispatch] = useReducer(formReducer, initialValues)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [newUser, setNewUser] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  const auth = useAuth()
  const classes = useStyles()
  const router = useRouter()
  
  const handleSubmitForm = (e) => {
    e.preventDefault()

    if (!isFormValid) {
      toast.error('Something went wrong when submitting the form.')
      return
    }

    if (newUser) {
      // new user
      auth
        .signup(state.email, state.password)
        .then(({user}) => {
          const userDoc = firestore.doc(`users/${user.email}`)

          const batch = firestore.batch()
          batch.set(userDoc, { uid: user.uid })
          batch.commit()

          router.push('/')
          toast.success('New account created!')
        })
        .catch((error) => {
          console.warn({error})
          toast.error('Something went wrong!')
        })
    } else {
      // login
      auth
        .signin(state.email, state.password)
        .then(() => {
          router.push('/')
          toast.success('Logged in successfully!')
        })
        .catch((error) => {
          console.warn({error})
          toast.error('Something went wrong!')
        })
    }

    setNewUser(false)
  }

  const handleOnEmailChange = async (e) => {
    const val = e.target.value.toLowerCase()
    const regex = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/
    dispatch({ type: "HANDLE_INPUT", field: e.target.name, payload: val })
    setEmailError('Invalid email address')

    if (regex.test(val)) {
      const ref = firestore.doc(`users/${val}`)
      const { exists } = await ref.get()

      if (!exists) {
        setEmailError('')
        setIsFormValid(!passwordError)
      } else {
        setEmailError('That email already exists!')
      }
    }
  }

  const handleOnPasswordChange = (e) => {
    const val = e.target.value
    dispatch({ type: "HANDLE_INPUT", field: e.target.name, payload: val })
    setPasswordError('Password too short')

    if (val.length > 3) {
      setPasswordError('')
      setIsFormValid(!emailError)
    }
  }

  return (
    <section>
      <form onSubmit={handleSubmitForm} noValidate autoComplete="off">
        <Grid spacing={3} container>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              error={!!emailError}
              helperText={emailError}
              onChange={handleOnEmailChange}
              value={state.email || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              error={!!passwordError}
              helperText={passwordError}
              onChange={handleOnPasswordChange}
              value={state.password || ''}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <CardActions className={classes.actions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isFormValid}>
                Log In
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isFormValid}
              onClick={() => setNewUser(true)}>
                New Account
            </Button>
          </CardActions>
        </Grid>
      </form>
    </section>
  )
}
