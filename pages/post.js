import {
  useRequireAuth,
  useAuth,
  useForm,
  useCheckMobileView,
  useCheckIfDocExists,
} from '../lib/hooks'
import { firestore, serverTimestamp } from '../lib/firebase'
import {
  validate,
  EMAIL_REGEX_STRING,
  PHONE_REGEX_STRING,
} from '../lib/util'
import CenteredCard from '../components/CenteredCard'
import { Button as SubmitButton } from '../components/ContainedPrimarySubmitBtn'
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  CardActions,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import kebabCase from 'lodash.kebabcase'

const useStyles = makeStyles({
  root: {
    padding: 50,
  },
  description: {
    width: '100%',
  },
})

export default function PostForm() {
  const auth = useRequireAuth()

  if (!auth.user) {
    return <p>Loading...</p>
  }

  return (
    <main>
      <CreateNewPost />
    </main>
  )
}

function CreateNewPost() {
  // model this after inputProps
  // if field is required: default to a string
  // if field is NOT required: define default as an object with field value called "data"
  const initialValues = {
    position: {
      data: 'fullTime',
    },
    location: '',
    title: '',
    description: '',
    phone: {
      data: '',
    },
    email: '',
  }

  const router = useRouter()
  const classes = useStyles()
  const auth = useAuth()
  const mobileView = useCheckMobileView()

  const handleSubmitForm = async () => {
    let formData = {}

    for (const [key] of Object.entries(values)) {
      for (const [k, v] of Object.entries(values[key])) {
        if (k === 'data') {
          formData = {
            ...formData,
            [key]: v,
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      toast.error('Something went wrong when submitting the form.')
      console.warn({ errors })
      return
    }

    const ref = firestore
      .collection('users')
      .doc(auth.user.email)
      .collection('posts')
      .doc(slug)

    const data = {
      uid: auth.user.uid,
      createdAt: serverTimestamp(),
      slug,
      featured: false,
      ...formData,
    }

    try {
      await ref.set(data)
      toast.success('Created new job post successfully!')
      router.push(`/jobs/${auth.user.uid}/${slug}`)
    } catch (error) {
      console.warn({ error })
      toast.error('Something went wrong!')
    }
  }

  const { values, errors, handleChange, handleSubmit } = useForm(
    initialValues,
    handleSubmitForm,
    validate,
  )

  // url safe slug
  const slug = encodeURI(kebabCase(values.title.data))
  const slugError = useCheckIfDocExists(
    `users/${auth.user.email}/posts/${slug}`,
    slug,
  )

  return (
    <main>
      <CenteredCard
        title="Post new job"
        maxWidth={mobileView ? '100%' : 928}
      >
        <section>
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <Grid
              container
              spacing={3}
              className={classes.root}
              direction={mobileView ? 'column' : 'row'}
            >
              <Grid item xs={6}>
                <InputLabel id="position">Position</InputLabel>
                <Select
                  labelId="position"
                  name="position"
                  onChange={handleChange}
                  defaultValue="fullTime"
                  value={values.position.data || ''}
                >
                  <MenuItem value={'fullTime'}>Full Time</MenuItem>
                  <MenuItem value={'partTime'}>Part Time</MenuItem>
                  <MenuItem value={'contract'}>Contract</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Location"
                  name="location"
                  type="text"
                  required
                  fullWidth={!!mobileView}
                  error={!!errors.location}
                  helperText={errors.location}
                  onChange={handleChange}
                  value={values.location.data || ''}
                  inputProps={{
                    'data-required': true,
                    'data-minlength': 2,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job title"
                  name="title"
                  type="text"
                  required
                  fullWidth={!!mobileView}
                  error={!!errors.title || !!slugError}
                  helperText={
                    errors.title ||
                    (slugError &&
                      'A job post with that title already exists!')
                  }
                  onChange={handleChange}
                  value={values.title.data || ''}
                  inputProps={{
                    'data-required': true,
                    'data-minlength': 4,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job description"
                  name="description"
                  type="text"
                  multiline
                  rows={12}
                  error={!!errors.description}
                  helperText={errors.description}
                  className={classes.description}
                  name="description"
                  onChange={handleChange}
                  value={values.description.data || ''}
                  inputProps={{
                    'data-required': true,
                    'data-minlength': 25,
                  }}
                />
              </Grid>
              <Grid item xs={mobileView ? 12 : 6}>
                <TextField
                  label="Phone"
                  name="phone"
                  type="text"
                  fullWidth={!!mobileView}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  onChange={handleChange}
                  value={values.phone.data || ''}
                  inputProps={{
                    'data-required': false,
                    'data-test': true,
                    'data-regex': PHONE_REGEX_STRING,
                    'data-regexflags': 'im',
                  }}
                />
              </Grid>
              <Grid item xs={mobileView ? 12 : 6}>
                <TextField
                  label="Email"
                  name="email"
                  type="text"
                  fullWidth={!!mobileView}
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={handleChange}
                  value={values.email.data || ''}
                  inputProps={{
                    'data-required': true,
                    'data-test': true,
                    'data-regex': EMAIL_REGEX_STRING,
                  }}
                />
              </Grid>
              <CardActions className={classes.actions}>
                <SubmitButton
                  disabled={
                    Object.keys(errors).length > 0 || slugError
                  }
                >
                  Post
                </SubmitButton>
              </CardActions>
            </Grid>
          </form>
        </section>
      </CenteredCard>
    </main>
  )
}
