import {ref} from 'vue'

export class Celestial {
  x
  y
  density
  mass
  radius
  color

  static G = 10

  static canvasWidth
  static canvasHeight

  static _context

  static get context () {
    return Celestial._context
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  static set context (context) {
    Celestial._context = context
    Celestial.canvasHeight = context.canvas.height
    Celestial.canvasWidth = context.canvas.width
  }

  constructor ({
    x,
    y,
    density,
    mass,
    radius,
    color,
  }) {
    this.x = ref(x)
    this.y = ref(y)
    // this.density = density
    this.mass = mass
    this.radius = radius
    this.color = color
  }

  draw () {
    Celestial.context.beginPath()
    Celestial.context.arc(
      this.x.value,
      this.y.value,
      this.radius,
      0,
      Math.PI * 2,
      true
    )
    Celestial.context.closePath()
    Celestial.context.fillStyle = this.color
    Celestial.context.fill()
  }
}
