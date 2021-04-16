import {
  jobPostToJSON,
  getUserWithUID,
  firestore,
} from '../../../lib/firebase'
import JobPostContent from '../../../components/JobPostContent'
import { useDocumentData } from 'react-firebase-hooks/firestore'

export async function getStaticProps({ params }) {
  const { uid, slug } = params
  const userDoc = await getUserWithUID(uid)

  let job
  let path

  if (userDoc) {
    const jobRef = userDoc.ref.collection('posts').doc(slug)
    job = jobPostToJSON(await jobRef.get())

    path = jobRef.path
  }

  return {
    props: { job, path },
    revalidate: 5000,
  }
}

export async function getStaticPaths() {
  // improve by using admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get()
  const paths = snapshot.docs.map((doc) => {
    const { slug, uid } = doc.data()
    return {
      params: { uid, slug },
    }
  })

  return {
    // must be in this format:
    // paths: [
    //   { params : { uid, slug }}
    // ],
    paths,
    fallback: 'blocking',
  }
}

export default function Post(props) {
  const jobRef = firestore.doc(props.path)
  const [realtimeJobPost] = useDocumentData(jobRef)

  const job = realtimeJobPost || props.job
  return (
    <main>
      <section>
        <JobPostContent job={job} />
      </section>
    </main>
  )
}
