import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'

export default function Navbar() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className="navbar">
            <Link href="/">
              Job Listings
            </Link>
          </Typography>
          <Typography variant="button" color="inherit">
            <Link href="/">
                Log in
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}
