import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { useContext } from 'react'
import { UserContext } from '../lib/context'
import { auth } from '../lib/firebase'
import toast from 'react-hot-toast';

const useStyles = makeStyles({
  root: {
    padding: '0 10vw'
  },
  homeLink: {
    flexGrow: 1
  },
  toolbar: {
    width: 928,
    margin: '0 auto'
  }
})

export default function Navbar() {
  const { user } = useContext(UserContext)
  const classes = useStyles()

  const handleLogOut = () => {
    auth.signOut()
      .then(() => toast.success('Logged out successfully!'))
      .catch((error) => console.log({error}))
  }
  
  return (
    <nav>
      <AppBar className={classes.root} position="fixed">
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.homeLink} variant="h6" color="inherit">
            <Link href="/">
              Job Listings
            </Link>
          </Typography>
          <Typography variant="button" color="inherit">
            {user ? (
              <Link href="#">
                <a onClick={handleLogOut}>Log out</a>
              </Link>
            ) : (
              <Link href="/login">
                Log in
              </Link>
            )}
          </Typography>
        </Toolbar>
      </AppBar>
    </nav>
  )
}
