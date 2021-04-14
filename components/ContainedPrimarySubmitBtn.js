import { Button as MUIButton } from '@material-ui/core'

const Button = (props) => {
  return (
    <MUIButton
      variant="contained"
      color="primary"
      type="submit"
      {...props}
    >
      {props.children}
    </MUIButton>
  )
}

export {
  Button
}
