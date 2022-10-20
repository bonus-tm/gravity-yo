import {canvas, context, backgroundColor} from '@/store'
import {setOpacity} from '@/util/colors.js'

export const clearCanvas = () => {
  context.value.fillStyle = backgroundColor.value
  context.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
}

export const circle = (x, y, radius, color) => {
  context.value.beginPath()
  context.value.arc(x, y, radius, 0, Math.PI * 2, true)
  context.value.closePath()
  context.value.fillStyle = color
  context.value.fill()
}

export const line = (x0, y0, x1, y1, width, color) => {
  context.value.beginPath()
  context.value.moveTo(x0, y0)
  context.value.lineWidth = width
  context.value.strokeStyle = color
  context.value.lineTo(x1, y1)
  context.value.stroke()
}

export const lineGradient = (x0, y0, x1, y1, width, colorStart, colorStop) => {
  let gradient = context.value.createLinearGradient(x0, y0, x1, y1)
  gradient.addColorStop(0, colorStart)
  gradient.addColorStop(1, colorStop)

  context.value.beginPath()
  context.value.lineWidth = width
  context.value.strokeStyle = gradient
  context.value.moveTo(x0, y0)
  context.value.lineTo(x1, y1)
  context.value.stroke()
}


export const testTrail = () => {

  context.value.lineWidth = 4
  // context.value.lineCap = 'round'

  let step = 2
  for (let i = step; i < 20; i += step) {
    context.value.beginPath()
    context.value.moveTo(40 + (i-step)**2, 40 + (i-step)*5)
    context.value.lineTo(40 + i ** 2, 40 + i * 5)
    context.value.strokeStyle = `rgba(255, 0, 0, ${1/(i - step + 1)})`
    context.value.stroke()
  }
}
