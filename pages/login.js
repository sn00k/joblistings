import { firestore } from '../lib/firebase'
import { useAuth, useForm } from '../lib/hooks'
import { validate, EMAIL_REGEX_STRING } from '../lib/util'
import { useState } from 'react'
import { CardActions, TextField, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import CenteredCard from '../components/CenteredCard'
import { Button as SubmitButton } from '../components/ContainedPrimarySubmitBtn'

const useStyles = makeStyles({
  actions: {
    marginTop: 20,
    justifyContent: 'space-between',
  },
})

export default function Login() {
  return (
    <main>
      <CenteredCard title="Login/Create account" maxWidth="500px">
        <LogInForm />
      </CenteredCard>
    </main>
  )
}

function LogInForm() {
  const initialValues = {
    email: '',
    password: '',
  }
  const [newUser, setNewUser] = useState(false)

  const auth = useAuth()
  const classes = useStyles()
  const router = useRouter()

  const handleSubmitForm = (e) => {
    if (Object.keys(errors).length > 0) {
      toast.error('Something went wrong when submitting the form.')
      console.warn({ errors })
      return
    }

    if (newUser) {
      // new user
      auth
        .signup(values.email.data, values.password.data)
        .then(({ email, uid }) => {
          const userDoc = firestore.doc(`users/${email}`)

          const batch = firestore.batch()
          batch.set(userDoc, { uid })
          batch.commit()

          router.push('/')
          toast.success('New account created!')
        })
        .catch((error) => {
          console.warn({ error })
          toast.error(`Error: ${error.message}`)
        })
    } else {
      // login
      auth
        .signin(values.email.data, values.password.data)
        .then(() => {
          router.push('/')
          toast.success('Logged in successfully!')
        })
        .catch((error) => {
          console.warn({ error })
          toast.error(`Error: ${error.message}`)
        })
    }

    setNewUser(false)
  }

  const { values, errors, handleChange, handleSubmit } = useForm(
    initialValues,
    handleSubmitForm,
    validate,
  )

  return (
    <section>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Grid spacing={3} container>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
              onChange={handleChange}
              onFocus={() => validate(values)}
              value={values.email.data || ''}
              inputProps={{
                'data-required': true,
                'data-test': true,
                'data-regex': EMAIL_REGEX_STRING,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password}
              onChange={handleChange}
              onFocus={() => validate(values)}
              value={values.password.data || ''}
              inputProps={{
                'data-required': true,
                'data-minlength': 6,
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <CardActions className={classes.actions}>
            <SubmitButton disabled={Object.keys(errors).length > 0}>
              Log In
            </SubmitButton>
            <SubmitButton
              disabled={Object.keys(errors).length > 0}
              onClick={() => setNewUser(true)}
            >
              New Account
            </SubmitButton>
          </CardActions>
        </Grid>
      </form>
    </section>
  )
}
