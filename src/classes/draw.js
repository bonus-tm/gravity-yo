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

export const arrow = (x, y, direction, color, size = 10) => {
  let wingLength = size * 0.277308492477241  // 25,12
  let wingAngle = 1.1232763516377267

  let rootX = x + 0.32 * size * Math.cos(direction + Math.PI)
  let rootY = y + 0.32 * size * Math.sin(direction + Math.PI)

  let pointX = x + 0.5 * size * Math.cos(direction)
  let pointY = y + 0.5 * size * Math.sin(direction)

  let lwX = rootX + wingLength * Math.cos(direction + Math.PI + wingAngle)
  let lwY = rootY + wingLength * Math.sin(direction + Math.PI + wingAngle)

  let rwX = rootX + wingLength * Math.cos(direction - Math.PI - wingAngle)
  let rwY = rootY + wingLength * Math.sin(direction - Math.PI - wingAngle)

  context.value.beginPath()

  // context.value.lineWidth = 2
  // context.value.strokeStyle = 'red'
  context.value.fillStyle = color

  context.value.moveTo(rootX, rootY)
  context.value.lineTo(lwX,lwY)
  context.value.lineTo(pointX,pointY)
  context.value.lineTo(rwX,rwY)
  context.value.closePath()

  // context.value.stroke()
  context.value.fill()
}
