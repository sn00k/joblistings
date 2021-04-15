import React, { useState } from 'react'
import Link from 'next/link'
import { Typography, Toolbar, AppBar, IconButton, Drawer, MenuItem, Box } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core/styles'
import toast from 'react-hot-toast'
import { useAuth, useCheckMobileView } from '../lib/hooks'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    width: 928,
    margin: 'auto'
  },
  homeLink: {
    flexGrow: 1
  },
  links: {
    '& > * + *': {
      marginLeft: theme.spacing(3),
      'a': {
        color: 'inherit'
      }
    }
  }
}))

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const mobileView = useCheckMobileView()

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

  const getDrawerChoices = () => {
    return (
      <Typography variant="button" color="inherit">
        <Link href="/jobs">
          <MenuItem>All jobs</MenuItem>
        </Link>
        {auth.user ? (
          <>
            <Link href="/post">
              <MenuItem>Post a job</MenuItem>
            </Link>
            <Link href="/" onClick={handleSignout}>
              <MenuItem>Log out</MenuItem>
            </Link>  
          </>
        ) : (
          <Link href="/login">
              <MenuItem>Log in</MenuItem>
          </Link>
        )}
      </Typography>
    )
  }

  const displayMobile = () => {
    const handleDrawerOpen = () => {
      setDrawerOpen(true)
    }

    const handleDrawerClose = () => {
      setDrawerOpen(false);
    }

    return (
      <Toolbar>
        <IconButton
          {...{
            edge: 'start',
            color: 'inherit',
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          {...{
            anchor: 'left',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <Box width={200}>
            {getDrawerChoices()}
          </Box>
        </Drawer>
        <Typography className={classes.homeLink} variant="h6">
          <Link href="/" color="inherit">
            Job Listings
          </Link>
        </Typography>
      </Toolbar>
    )
  }

  const displayDesktop = () => {
    return (
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.homeLink} variant="h6">
          <Link href="/" color="inherit">
            Job Listings
          </Link>
        </Typography>
        <Typography variant="button" className={classes.links}>
          <Link href="/jobs" color="inherit">
            All jobs
          </Link>
          {auth.user ? (
            <>
              <Link href="/post" color="inherit">
                Post a job
              </Link>
              <Link href="/" color="inherit" onClick={handleSignout}>
                Log out
              </Link>  
            </>
          ) : (
            <Link href="/login" color="inherit">
              Log in
            </Link>
          )}
        </Typography>
      </Toolbar>
    )
  }

  return (
    <nav>
      <AppBar position="fixed">
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </nav>
  )
}
