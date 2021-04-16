import React from 'react'
import CenteredCard from './CenteredCard'
import { Grid, Typography, Link, Box } from '@material-ui/core'
import Moment from 'react-moment'

export default function Jobs({ jobs }) {
  return jobs
    ? jobs.map((job) => <JobItem job={job} key={job.slug} />)
    : null
}

function JobItem({ job }) {
  return (
    <>
      <CenteredCard contentWidth={'clamp(45ch, 50%, 75ch)'}>
        <Grid key={job.slug} container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row">
              <Box flexGrow="1" mr={1.5}>
                <Typography variant="body2">
                  <Link href={`/post/${job.slug}`}>{job.title}</Link>
                </Typography>
              </Box>
              <Typography variant="caption">
                {job.location}
              </Typography>
            </Box>
            <Box display="flex">
              <Box
                flexGrow="1"
                color={
                  job.position === 'fullTime'
                    ? 'success.main'
                    : 'inherit'
                }
              >
                <Typography variant="caption">
                  {printPositionType(job.position)}
                </Typography>
              </Box>
              <Typography variant="caption">
                <Moment fromNow>{job.createdAt}</Moment>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CenteredCard>
    </>
  )
}

function printPositionType(position) {
  return new Map([
    ['fullTime', 'Full Time'],
    ['partTime', 'Part Time'],
    ['contract', 'Contract'],
  ]).get(position)
}
