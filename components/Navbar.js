import React from 'react'
import Link from 'next/link'
import { Typography, Toolbar, AppBar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import toast from 'react-hot-toast'
import { useAuth } from '../lib/hooks'

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
  const auth = useAuth()

  const handleSignout = () => {
    auth.signout()
      .then(() => toast.success('Logged out successfully!'))
      .catch((error) => {
        console.warn({error})
        toast.error('Something went wrong!')
      })
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
            <Link href="/jobs">
              All jobs
            </Link>
            {auth.user ? (
              <>
                <Link href="/post">
                  Post a job
                </Link>
                <Link href="/">
                  <a onClick={handleSignout}>Log out</a>
                </Link>  
              </>
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
