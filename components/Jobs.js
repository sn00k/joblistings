import React from 'react'
import CenteredCard from './CenteredCard'
import { Grid } from '@material-ui/core'

export default function Jobs({ jobs }) {
  return jobs ? jobs.map((job) => <JobItem job={job} key={job.slug} />) : null
}

function JobItem({ job }) {
  return (
    <>
      <CenteredCard>
        <Grid
          key={job.slug}
          container
          spacing={3}
        >
          <Grid item xs={12}>
            <p>Title: {job.title}</p>
            <p>Description: {job.description}</p>
          </Grid>
        </Grid>
      </CenteredCard>
    </>
  )
}
