export const formReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE_INPUT":
      return {
        ...state,
        [action.field]: action.payload
      }
    case "HANDLE_POSITION_TYPE":
      return {
        ...state,
        positionType: action.payload
      }
    default:
      return state
  }
}