import { Grid, Card, CardContent } from '@material-ui/core'

export default function CenteredCard(props) {
  return (
    <>
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
            {props.children}
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}
