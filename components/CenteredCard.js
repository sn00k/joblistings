import { Grid, Card, CardContent } from '@material-ui/core'

export default function CenteredCard(props) {
  const defaultMaxWidth = 928

  return (
    <>
      <Grid container direction="row" justify="center">
        <h1>{props.title}</h1>
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{
          maxWidth: props.maxWidth ?? defaultMaxWidth,
          margin: 'auto',
        }}
      >
        <Card style={{ width: props.maxWidth ?? defaultMaxWidth }}>
          <CardContent>{props.children}</CardContent>
        </Card>
      </Grid>
    </>
  )
}
