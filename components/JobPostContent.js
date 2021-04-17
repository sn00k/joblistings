import { Link, Box, Typography } from '@material-ui/core'
import CenteredCard from './CenteredCard'
import Moment from 'react-moment'
import PhoneIcon from '@material-ui/icons/Phone'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  phone: {
    display: 'flex',
    alignItems: 'center',
  },
  svg: {
    marginRight: 10,
  },
})

export default function JobPostContent({ job }) {
  const classes = useStyles()
  const createdAt =
    typeof job?.createdAt === 'number'
      ? new Date(job.createdAt)
      : job.createdAt.toDate()

  return (
    <CenteredCard contentWidth={'clamp(45ch, 50%, 75ch)'}>
      <Typography variant="h5">{job.title}</Typography>
      <Box mt={1}>
        <Typography variant="subtitle2">
          Posted by{' '}
          <Link href={`mailto:${job.email}`}>{job.email}</Link> on{' '}
          <i>
            <Moment format="YYYY-MM-DD">{createdAt}</Moment>
          </i>
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="body1">{job.description}</Typography>
      </Box>
      {job.phone && (
        <Box mt={4}>
          <Typography className={classes.phone}>
            <PhoneIcon className={classes.svg} /> {job.phone}
          </Typography>
        </Box>
      )}
    </CenteredCard>
  )
}
