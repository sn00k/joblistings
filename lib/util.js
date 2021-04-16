const EMAIL_REGEX_STRING =
  '^\\w+([\\.-]?\\w+)+@\\w+([\\.:]?\\w+)+(\\.[a-zA-Z0-9]{2,3})+$'
const PHONE_REGEX_STRING =
  '^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$'

const toUpperCaseFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const validate = (values) => {
  let errors = {}
  for (const key in values) {
    if (!key) continue

    const value = values[key]

    if (
      (value.required === undefined && !value) ||
      (value.required === 'true' && !value.data)
    ) {
      errors[key] = `${toUpperCaseFirst(key)} is required`
    } else if (
      value.minlength &&
      value.data.length < value.minlength
    ) {
      errors[key] = `${toUpperCaseFirst(key)} must be ${
        value.minlength
      } or more characters`
    } else if (value.test === 'true' && value.data) {
      const re = value.regexflags
        ? new RegExp(value.regex).test(value.data, value.regexflags)
        : new RegExp(value.regex).test(value.data)
      if (!re) {
        errors[key] = `${toUpperCaseFirst(key)} is invalid`
      }
    }
  }

  return errors
}

export {
  EMAIL_REGEX_STRING,
  PHONE_REGEX_STRING,
  toUpperCaseFirst,
  validate,
}
