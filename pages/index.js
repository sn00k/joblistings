import { Box, Typography } from '@material-ui/core'
import { firestore, jobPostToJSON } from '../lib/firebase'
import AllJobs from './jobs'

const LIMIT = 5

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('featured', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)

  const jobs = (await postsQuery.get()).docs.map(jobPostToJSON)

  return {
    props: { jobs },
  }
}

export default function FeaturedJobs(props) {
  const { jobs } = props
  return (
    <>
      <Box textAlign="center">
        <Typography variant="h4">Featured Jobs</Typography>
      </Box>
      <AllJobs jobs={jobs} isFeatured />
    </>
  )
}
