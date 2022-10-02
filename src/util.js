export const G = 10

export const round = (value, precision = 0) => {
  if (!Number.isFinite(value)) return ''
  return Math.round(value * (10 ** precision)) / (10 ** precision)
}

/**
 * Set opacity of some color
 * @param {String} color #aabbcc, rgb(), rgba(), or color name in palette
 * @param {Number} opacity
 * @return {string}
 */
export const setOpacity = (color, opacity = 1) => {
  if (!color) return ''

  color = color.trim()

  if (color.startsWith('#')) {
    return hex2rgba(color, opacity)
  }
  if (color.startsWith('rgba')) {
    return rgba(color, {a: opacity})
  }
  if (color.startsWith('rgb')) {
    return rgb2rgba(color, opacity)
  }

  return `rgba(128,128,128,${opacity})`
}

/**
 * Convert hex string color to rgba string with optional opacity
 * @param {String} hex color like #12ab4f
 * @param {Number} opacity optional opacity 0-1
 * @return {String}
 */
const hex2rgba = (hex, opacity = 1) => {
  if (!hex) return `rgba(128,128,128,${opacity})`

  let [, r1, r2, g1, g2, b1, b2] = hex.split('')
  let r = parseInt(`${r1}${r2}`, 16)
  let g = parseInt(`${g1}${g2}`, 16)
  let b = parseInt(`${b1}${b2}`, 16)
  return `rgba(${r},${g},${b},${opacity})`
}

/**
 * Convert rgb() to rgba() with given opacity
 * @param {String} rgb
 * @param {Number} opacity
 * @return {`rgba(${String},${String},${String},${String})`}
 */
const rgb2rgba = (rgb, opacity = 1) => {
  let [, r, g, b] = rgb.match(/rgb\((\d+),\s?(\d+),\s?(\d+)\)/)
  return `rgba(${r},${g},${b},${opacity})`
}

/**
 * Update values in rgba
 * @param {String} srcColor
 * @param {String} r
 * @param {String} g
 * @param {String} b
 * @param {String} a
 * @return {`rgba(${String},${String},${String},${String})`}
 */
const rgba = (srcColor, {r = '', g = '', b = '', a = ''}) => {
  let [, _r, _g, _b, _a] = srcColor.match(
    /rgba\((\d+),\s?(\d+),\s?(\d+),\s?([\d.]+)\)/
  )
  return `rgba(${r || _r},${g || _g},${b || _b},${a || _a})`
}
