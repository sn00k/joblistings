import { firestore } from '../lib/firebase'
import { useAuth } from '../lib/hooks'
import { useState } from 'react'
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
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
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
        .signup(formEmail, formPassword)
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
        .signin(formEmail, formPassword)
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
    setFormEmail(val)
    setEmailError('Invalid email address')

    if (regex.test(val)) {
      const ref = firestore.doc(`users/${val}`)
      const { exists } = await ref.get()

      if (!exists) {
        setIsFormValid(true)
        setEmailError('')
      } else {
        setEmailError('That email already exists!')
      }
    }
  }

  const handleOnPasswordChange = (e) => {
    const val = e.target.value
    setFormPassword(val)
    setPasswordError('Password too short')

    if (val.length > 3) {
      setPasswordError('')
      setIsFormValid(true)
    }
  }

  return (
    <section>
      <form onSubmit={handleSubmitForm} noValidate autoComplete="off">
        <Grid spacing={3} container>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              error={!!emailError}
              helperText={emailError}
              onChange={handleOnEmailChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              error={!!passwordError}
              helperText={passwordError}
              onChange={handleOnPasswordChange}
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
