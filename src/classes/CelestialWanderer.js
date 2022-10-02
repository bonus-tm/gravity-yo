import {Celestial} from './Celestial.js'
import {G, setOpacity} from '../util.js'

export const CelestialWanderer = {
  ...Celestial,
  angle: 0,
  velocity: 0,

  trail: [],
  maxTrailSteps: 20,
  minTrailOpacity: 0.4,
  maxTrailOpacity: 0.98,
  minTrailWidth: 0.75,

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

    // console.log({distance, velocity, angle})

    this.updateVector(velocity, angle)

    return this.checkCollision(body, distance)
  },

  move () {
    this.trail.push([this.x, this.y])
    while (this.trail.length > this.maxTrailSteps) {
      this.trail.shift()
    }

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
    return this.x < 10 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
  },

  /**
   *
   * @param {CanvasRenderingContext2D} context
   * @param bgColor
   */
  drawTrail (context, bgColor) {
    context.beginPath()
    context.lineWidth = this.radius * 2
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = bgColor

    // erase trail
    context.moveTo(...this.trail[0])
    for (let [x, y] of this.trail) {
      context.lineTo(x, y)
    }
    context.stroke()


    // draw fresh
    let opacity = (this.maxTrailOpacity - this.minTrailOpacity) / this.maxTrailSteps
    // console.log({opacity, color: setOpacity(this.color, opacity)})
    let width = this.minTrailWidth * (this.radius * 2)
    let widthStep = ((this.radius * 2) - width) / this.maxTrailSteps

    let trail = [...this.trail]
    while (trail.length > 0) {
      context.beginPath()
      let [x, y] = trail[0]
      context.moveTo(x, y)

      context.lineWidth = width
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.strokeStyle = setOpacity(this.color, opacity)
      for (let [x, y] of trail) {
        context.lineTo(x, y)
      }
      context.stroke()
      trail.shift()
      width += widthStep
    }

  },

}
