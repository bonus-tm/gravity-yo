export const round = (value, precision = 0) => {
  if (!Number.isFinite(value)) return ''
  return Math.round(value * (10 ** precision)) / (10 ** precision)
}

export const rand = (min, max) => {
  return min + Math.round(Math.random() * (max - min))
}
