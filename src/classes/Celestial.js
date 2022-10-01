import {ref} from 'vue'

export const Celestial = {
  x: 0,
  y: 0,
  density: 0,
  mass: 1,
  radius: 1,
  color: '',

  draw (context) {
    context.beginPath()
    context.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2,
      true
    )
    context.closePath()
    context.fillStyle = this.color
    context.fill()
  },
}
