import {Celestial} from './Celestial.js'

export class CelestialWanderer extends Celestial {
  angle
  velocity

  constructor (props) {
    super(props)

    this.angle = props.angle
    this.velocity = props.velocity
  }

  distanceTo (body) {
    return Math.sqrt(
      ((this.x.value - body.x.value) ** 2) + ((this.y.value - body.y.value) ** 2)
    )
  }

  angleTo (body) {
    return Math.PI + Math.atan2(this.y.value - body.y.value, this.x.value - body.x.value)
  }

  /**
   *
   * @param {Celestial} body
   * @returns {boolean} is collision detected
   */
  interact (body) {
    let distance = this.distanceTo(body)
    let velocity = Celestial.G * (this.mass + body.mass) / (distance ** 2)
    let angle = this.angleTo(body)

    console.log({distance, velocity, angle})

    this.updateVector(velocity, angle)

    return this.checkCollision(body, distance)
  }

  move () {
    this.x.value += this.velocity * Math.cos(this.angle)
    this.y.value += this.velocity * Math.sin(this.angle)
  }

  updateVector (vn, an) {
    let xn = this.velocity * Math.cos(this.angle) + vn * Math.cos(an)
    let yn = this.velocity * Math.sin(this.angle) + vn * Math.sin(an)
    this.velocity = Math.sqrt(xn * xn + yn * yn)
    this.angle = Math.atan2(yn, xn)
  }

  checkCollision (body, distance) {
    return distance < this.radius + body.radius
  }

  checkBounds () {
    return this.x.value < 0 ||
      this.x.value > Celestial.canvasWidth ||
      this.y.value < 0 ||
      this.y.value > Celestial.canvasHeight
  }
}
