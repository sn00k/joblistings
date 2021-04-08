import React from 'react'
import Link from 'next/link'
import { Typography, Toolbar, AppBar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { auth } from '../lib/firebase'
import toast from 'react-hot-toast'
import AuthCheck from './AuthCheck'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 10vw'
  },
  homeLink: {
    flexGrow: 1
  },
  toolbar: {
    width: 928,
    margin: '0 auto'
  },
  links: {
    '& > * + *': {
      marginLeft: theme.spacing(3),
    },
  }
}))

export default function Navbar() {
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
          <Typography variant="button" color="inherit" className={classes.links}>
            <AuthCheck
              fallback={
                <>
                  <Link href="/jobs">
                  All jobs
                  </Link>
                  <Link href="/login">
                    Log in
                  </Link>
                </>
              }>
              <Link href="/jobs">
                All jobs
              </Link>
              <Link href="/post">
                Post a job
              </Link>
              <Link href="#">
                <a onClick={handleLogOut}>Log out</a>
              </Link>
            </AuthCheck>
          </Typography>
        </Toolbar>
      </AppBar>
    </nav>
  )
}
