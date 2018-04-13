// eslint-disable-next-line
export const repeat = (str, count) => {
  let result = str
  // eslint-disable-next-line
  while ((count -= 1)) {
    result += str
  }
  return result
}
