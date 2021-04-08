import { useReducer } from 'react'
import { formReducer } from '../lib/reducers'
import { Grid, Card, CardContent } from '@material-ui/core'

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
  const [state, dispatch] = useReducer(formReducer, initialValue)

  const handleInput = (e) => {
    return null
  }

  return (
    <main>
      {
         // TODO:
         // REFACTOR THIS TO A COMPONENT THAT RENDERS ITS CHILDREN
      }
      <Grid
        container
        direction="row"
        justify="center"
      >
        <h1>Post new job</h1>
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Card>
          <CardContent>
            <PostForm />
          </CardContent>
        </Card>
      </Grid>
    </main>
  )
}

function PostForm() {
  return (
    null
  )
}
