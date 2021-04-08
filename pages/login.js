import { auth } from '../lib/firebase'
import { useState } from 'react'
import { Button, Card, CardContent, CardActions, TextField, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const useStyles = makeStyles({
  actions: {
    marginTop: 20,
    justifyContent: 'space-between'
  }
})

export default function Login() {
  return (
    <main>
        <Grid
          container
          direction="row"
          justify="center"
        >
          <h1>Login</h1>
        </Grid>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
            <Card>
              <CardContent>
                <LogInForm />
              </CardContent>
            </Card>
        </Grid>
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

  const classes = useStyles()
  const router = useRouter()
  
  const handleSubmitForm = async (e) => {
    e.preventDefault()

    if (!isFormValid) {
      toast.error('Something went wrong when submitting the form.')
      return
    }

    if (newUser) {
      // new user
      auth
        .createUserWithEmailAndPassword(formEmail, formPassword)
        .catch((error) => console.log({error}))

      router.push('/')
      toast.success('New account created!')
    } else {
      // login
      auth
        .signInWithEmailAndPassword(formEmail, formPassword)
        .catch((error) => console.log({error}))

      router.push('/')
      toast.success('Logged in successfully!')
    }

    setNewUser(false)
  }

  const handleOnEmailChange = (e) => {
    const val = e.target.value.toLowerCase()
    const regex = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/
    setFormEmail(val)
    setEmailError('Invalid email address')

    if (regex.test(val)) {
      setIsFormValid(true)
      setEmailError('')
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
