import {Celestial} from './Celestial.js'
import {G} from '../util.js'

export const CelestialWanderer = {
  ...Celestial,
  angle: 0,
  velocity: 0,

  distanceTo (body) {
    return Math.sqrt(
      ((this.x - body.x) ** 2) + ((this.y - body.y) ** 2)
    )
  },

  angleTo (body) {
    return Math.PI + Math.atan2(this.y - body.y, this.x - body.x)
  },

  /**
   *
   * @param {Celestial} body
   * @returns {boolean} is collision detected
   */
  interact (body) {
    let distance = this.distanceTo(body)
    let velocity = G * (this.mass + body.mass) / (distance ** 2)
    let angle = this.angleTo(body)

    console.log({distance, velocity, angle})

    this.updateVector(velocity, angle)

    return this.checkCollision(body, distance)
  },

  move () {
    this.x += this.velocity * Math.cos(this.angle)
    this.y += this.velocity * Math.sin(this.angle)
  },

  updateVector (vn, an) {
    let xn = this.velocity * Math.cos(this.angle) + vn * Math.cos(an)
    let yn = this.velocity * Math.sin(this.angle) + vn * Math.sin(an)
    this.velocity = Math.sqrt(xn * xn + yn * yn)
    this.angle = Math.atan2(yn, xn)
  },

  checkCollision (body, distance) {
    return distance < this.radius + body.radius
  },

  checkBounds (canvas) {
    return this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
  },
}
