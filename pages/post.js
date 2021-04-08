import { useReducer } from 'react'
import { formReducer } from '../lib/reducers'
import AuthCheck from '../components/AuthCheck'
import CenteredCard from '../components/CenteredCard'

const initialValue = {
  positionType: null,
  location: null,
  title: null,
  description: null,
  contact: {
    phone: null,
    email: null
  }
}

export default function Post() {
  return (
    <main>
      <AuthCheck>
        <PostForm />
      </AuthCheck>
    </main>
  )
}

function PostForm() {
  const [state, dispatch] = useReducer(formReducer, initialValue)

  const handleInput = (e) => {
    return null
  }

  return (
    <main>
      <CenteredCard>
        PostContent
      </CenteredCard>
    </main>
  )
}
