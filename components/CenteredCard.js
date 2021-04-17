import {
  Grid,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core'

export default function CenteredCard(props) {
  const defaults = {
    maxWidth: 928,
    outerWrapperMarginBot: 24,
  }

  return (
    <>
      <Grid container direction="row" justify="center">
        <Typography variant="h4">{props.title}</Typography>
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{
          maxWidth: props.maxWidth ?? defaults.maxWidth,
          margin: 'auto',
          marginBottom:
            props.wrapperMarginBot ?? defaults.outerWrapperMarginBot,
        }}
      >
        <Card
          style={{ width: props.contentWidth ?? defaults.maxWidth }}
        >
          <CardContent>{props.children}</CardContent>
        </Card>
      </Grid>
    </>
  )
}
