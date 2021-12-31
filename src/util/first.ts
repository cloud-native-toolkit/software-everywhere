import Optional from "optional-js"

const first = <T>(values: T[]): Optional<T> => {
  if (!values || values.length === 0) {
    return Optional.empty()
  }

  return Optional.of(values[0])
}

export default first
