import { useState } from 'react'
import { firestore, postToJSON } from '../../lib/firebase'
import Jobs from '../../components/Jobs'

const LIMIT = 10

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)

  const jobs = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { jobs }
  }
}

export default function AllJobs(props) {
  const [jobs, setJobs] = useState(props.jobs)
  const [loading, setLoading] = useState(false)
  const [jobsEnd, setJobsEnd] = useState(false)

  return (
    <main>
      <h1 style={{ textAlign: 'center' }}>Showing x of y jobs</h1>
      <Jobs jobs={jobs}/>
    </main>
  )
}