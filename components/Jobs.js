import React from 'react'
import CenteredCard from './CenteredCard'
import { Grid, Typography, Link, Box } from '@material-ui/core'

export default function Jobs({ jobs }) {
  return jobs
    ? jobs.map((job) => <JobItem job={job} key={job.slug} />)
    : null
}

function JobItem({ job }) {
  return (
    <>
      <CenteredCard>
        <Grid key={job.slug} container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body2">
                <Link href={`/post/${job.slug}`}>{job.title}</Link>
              </Typography>
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
                  {job.location}
                </Typography>
                <Typography variant="caption">8 hours ago</Typography>
              </Box>
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
