import { useState } from 'react'
import {
  firestore,
  fromMillis,
  jobPostToJSON,
} from '../../lib/firebase'
import Jobs from '../../components/Jobs'
import Loader from '../../components/Loader'
import { Grid, Box, Button, Typography } from '@material-ui/core'

const LIMIT = 10

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)

  const jobs = (await postsQuery.get()).docs.map(jobPostToJSON)

  return {
    props: { jobs },
  }
}

export default function AllJobs(props) {
  const [jobs, setJobs] = useState(props.jobs)
  const [loading, setLoading] = useState(false)
  const [jobsEnd, setJobsEnd] = useState(false)

  const { isFeatured } = props

  const fetchMoreJobs = async () => {
    setLoading(true)
    const last = jobs[jobs.length - 1]

    const cursor =
      typeof last.createdAt === 'number'
        ? fromMillis(last.createdAt)
        : last.createdAt

    const query = firestore
      .collectionGroup('posts')
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT)

    const newJobs = (await query.get()).docs.map((doc) => doc.data())

    setJobs(jobs.concat(newJobs))
    setLoading(false)

    if (newJobs.length < LIMIT) {
      setJobsEnd(true)
    }
  }

  return (
    <main>
      {!isFeatured && (
        <Box textAlign="center" marginBottom={2}>
          <Typography variant="h4">
            Showing {jobs.length} of {jobs.length} jobs
          </Typography>
        </Box>
      )}
      <Jobs jobs={jobs} />
      {loading && (
        <Box mt={4}>
          <Loader show={loading} />
        </Box>
      )}
      {!isFeatured && (
        <Grid
          container
          justify="center"
          alignItems="center"
          display="flex"
          m={2}
        >
          <Box mt={4}>
            {!loading && !jobsEnd && (
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={fetchMoreJobs}
              >
                Load more
              </Button>
            )}
            {jobsEnd && 'No more job posts to fetch'}
          </Box>
        </Grid>
      )}
    </main>
  )
}
