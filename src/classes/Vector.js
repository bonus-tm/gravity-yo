export const Vector = {
  _dx: 0,
  _dy: 0,

  get dx () {
    return this._dx
  },
  set dx (value) {
    this._dx = value
    this._updateVector()
  },

  get dy () {
    return this._dy
  },
  set dy (value) {
    this._dy = value
    this._updateVector()
  },

  _direction: 0,
  _magnitude: 0,

  get direction () {
    return this._direction
  },
  set direction (value) {
    this._direction = value
    this._updateCoordinates()
  },

  get magnitude () {
    return this._magnitude
  },
  set magnitude (value) {
    this._magnitude = value
    this._updateCoordinates()
  },

  _updateVector () {
    this._magnitude = Math.sqrt(this._dx ** 2 + this._dy ** 2)
    this._direction = Math.atan2(this._dy, this._dx)
  },
  _updateCoordinates () {
    this._dx = this._magnitude * Math.cos(this._direction)
    this._dy = this._magnitude * Math.sin(this._direction)
  },

  add (vector) {
    this.dx = this.dx + vector.dx
    this.dy = this.dy + vector.dy
  },

  reset () {
    this._dx = 0
    this._dy = 0
    this._direction = 0
    this._magnitude = 0
  },
}

export const createVector = values => {
  return Object.assign(Object.create(Vector), values)
}
