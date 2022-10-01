export const G = 10

export const round = (value, precision = 2) => {
  return Math.round(value * (10 ** precision)) / (10 ** precision)
}
