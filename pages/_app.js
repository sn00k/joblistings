import '../styles/globals.css'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { ProvideAuth, useRouterStatus } from '../lib/hooks'
import { Box } from '@material-ui/core'

function MyApp({ Component, pageProps }) {
  const { isLoading, isError, error } = useRouterStatus()

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <ProvideAuth>
      <Head>
        <title>Job Listings</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Navbar />
      <Box mx="auto">
        {isLoading && !isError ? (
          <Loader show={isLoading} />
        ) : (
          <Component {...pageProps} />
        )}

        {isError && (
          <Box mx="auto">
            <p>{error}</p>
          </Box>
        )}
      </Box>
      <Toaster />
    </ProvideAuth>
  )
}

export default MyApp
