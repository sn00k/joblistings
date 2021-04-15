import { Grid, Card, CardContent } from '@material-ui/core'

export default function CenteredCard(props) {
  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
      >
        <h1>{props.title}</h1>
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ maxWidth: 928, margin: 'auto' }}
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
