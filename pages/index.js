import { Box, Typography } from '@material-ui/core'
import CenteredCard from '../components/CenteredCard'
import { firestore, fromMillis, jobPostToJSON } from '../lib/firebase'

export default function Home() {
  return (
    <main>
      <section>
        <CenteredCard title="TODO: Featured Jobs"></CenteredCard>
      </section>
    </main>
  )
}
