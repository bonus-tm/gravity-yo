import {circle} from '@/classes/draw.js'

export const Celestial = {
  x: 0,
  y: 0,
  // density: 0,
  mass: 1,
  radius: 1,
  color: '',

  draw () {
    circle(this.x, this.y, this.radius, this.color)
  },
}
