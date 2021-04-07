import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    padding: '0 10vw'
  },
  homeLink: {
    flexGrow: 1
  }
})

export default function Navbar() {
  const classes = useStyles()

  return (
    <nav>
      <AppBar className={classes.root} position="fixed">
        <Toolbar>
          <Typography className={classes.homeLink} variant="h6" color="inherit">
            <Link href="/">
              Job Listings
            </Link>
          </Typography>
          <Typography variant="button" color="inherit">
            <Link href="/login">
                Log in
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </nav>
  )
}
