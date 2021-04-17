import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@material-ui/core'

export default function CenteredCard(props) {
  const defaults = {
    maxWidth: 928,
    outerWrapperMarginBot: 24,
  }

  return (
    <>
      <Grid container direction="row" justify="center">
        <Box marginBottom={2}>
          <Typography variant="h4">{props.title}</Typography>
        </Box>
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
