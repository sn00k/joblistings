import '../styles/globals.css'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'
import { Box } from '@material-ui/core'

function MyApp({ Component, pageProps }) {
  const userData = useUserData()

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <UserContext.Provider value={userData}>
      <Head>
        <title>Job Listings</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Navbar />
      <Box width={928} mx="auto">
        <Component {...pageProps} />
      </Box>
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
