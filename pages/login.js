import { auth, firestore } from '../lib/firebase'
import { useContext, useEffect, useRef } from 'react'
import { UserContext } from '../lib/context'
import { useState } from 'react'
import { Button, Card, CardContent, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    maxWidth: 800
  }
})

export default function Login() {
  const { user, username } = useContext(UserContext)
  const [ newUser, setNewUser ] = useState(false)
  const classes = useStyles()

  return (
    <main>
      <Container>
        <Card className={classes.root}>
          <CardContent>
            <LogInForm />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setNewUser(true)}>
                New Account
            </Button>
          </CardContent>
        </Card>
      </Container>
    </main>
  )
}

function LogInForm() {
  return (
    <h1>Login</h1>
  )
}
