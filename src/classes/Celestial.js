import {circle} from '@/classes/draw.js'
import {params} from '@/params.js'

export const Celestial = {
  x: 0,
  y: 0,
  // density: 0,
  mass: 1,
  color: '',
  _radius: null,

  get radius () {
    if (this._radius === null) {
      // linear equation: y = a * x + b
      // radius = a * mass + b
      // a = (rMax - rMin) / (mMax - mMin)
      // rMin = a * mMin + b =>
      // b = rMin - a * mMin

      let a = (params.radiusMax - params.radiusMin) / (params.massMax - params.massMin)
      let b = params.radiusMin - a * params.massMin

      this._radius = a * this.mass + b
    }
    return this._radius
  },

  draw () {
    circle(this.x, this.y, this.radius, this.color)
  },
}
