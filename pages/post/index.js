import { useReducer, useState } from 'react'
import { formReducer } from '../../lib/reducers'
import { auth, firestore, serverTimestamp } from '../../lib/firebase'
import AuthCheck from '../../components/AuthCheck'
import CenteredCard from '../../components/CenteredCard'
import { Grid, Select, MenuItem, InputLabel, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import kebabCase from 'lodash.kebabcase';

const initialValue = {
  positionType: 'fullTime',
  location: '',
  title: '',
  description: '',
  phone: '',
  email: ''
}

const useStyles = makeStyles({
  root: {
    padding: 50
  },
  description: {
    width: '100%'
  }
})

export default function PostForm() {
  if (!auth.currentUser) {
    return null
  }
  
  return (
    <main>
      <AuthCheck>
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function CreateNewPost() {
  const [state, dispatch] = useReducer(formReducer, initialValue)
  const [locationError, setLocationError] = useState('')

  const router = useRouter()
  const classes = useStyles()

  // url safe slug
  const slug = encodeURI(kebabCase(state.title))

  const handleInput = (e) => {
    if (locationError) {
      setLocationError('')
    }
    dispatch({ type: "HANDLE_INPUT", field: e.target.name, payload: e.target.value })
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    if (state.location.length === 0) {
      setLocationError('Location is required.')
    }

    const ref = firestore
    .collection('users')
    .doc(auth.currentUser.email)
    .collection('posts')
    .doc(slug)

    const data = {
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      ...state
    }

    try {
      await ref.set(data)
      toast.success('Created new job post successfully!')
      router.push(`/post/${slug}`)
    } catch (error) {
      console.warn({error});
      toast.error('Something went wrong!')
    }
  }

  return (
    <main>
      <CenteredCard>
        <section>
          <form onSubmit={handleSubmitForm}>
            <Grid spacing={3} container className={classes.root}>
              <Grid item xs={6}>
                <InputLabel id="position">Position</InputLabel>
                <Select
                  labelId="position"
                  onChange={(e) => dispatch({ type: "HANDLE_POSITION_TYPE", payload: e.target.value })}
                  displayEmpty
                  defaultValue="fullTime"
                  value={state.positionType}
                >
                  <MenuItem value={"fullTime"}>Full Time</MenuItem>
                  <MenuItem value={"partTime"}>Part Time</MenuItem>
                  <MenuItem value={"contract"}>Contract</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Location"
                  type="text"
                  name="location"
                  error={!!locationError}
                  helperText={locationError}
                  onChange={handleInput}
                  value={state.location}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job title"
                  type="text"
                  name="title"
                  onChange={handleInput}
                  value={state.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job description"
                  type="text"
                  multiline
                  rows={12}
                  className={classes.description}
                  name="description"
                  onChange={handleInput}
                  value={state.description}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone"
                  type="text"
                  name="phone"
                  onChange={handleInput}
                  value={state.phone}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  type="text"
                  name="email"
                  onChange={handleInput}
                  value={state.email}
                />
              </Grid>
              <button type="submit">submit</button>
            </Grid>
          </form>
        </section>
      </CenteredCard>
    </main>
  )
}
