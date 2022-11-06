import {canvas} from '@/store.js'
import {createVector} from '@/classes/Vector.js'
import {params} from '@/params.js'
import {arrow, line} from '@/services/draw.js'
import {setOpacity} from '@/util/colors.js'
import {calcForce, distance, toPolar} from '@/services/vector'

const step = 10
let grid = []
let maxMagnitude = 0

const distanceTo = (x, y, body) => {
  return Math.sqrt(
    ((x - body.x) ** 2) + ((y - body.y) ** 2)
  )
}

const angleTo = (x, y, body) => {
  return Math.atan2(body.y - y, body.x - x)
}

export const calcForces = celestials => {
  grid = []

  let {width, height} = canvas.value
  let mass = params.wandererMass

  for (let y = 0; y <= height; y += step) {
    for (let x = 0; x <= width; x += step) {
      let force = calcForce({x, y, mass, radius: 1}, celestials, 0)

      if (force.magnitude > maxMagnitude) {
        maxMagnitude = force.magnitude
      }

      grid.push({x, y})
    }
  }
  console.log({maxMagnitude})
}

export const drawForces = () => {
  for (let {x, y, force} of grid) {

    if (params.forcesType === 'lines') {
      // force.magnitude = force.magnitude * step * 2 / maxMagnitude
      line(x, y, x + force.dx, y + force.dy, 1, 'rgba(0,200,255)')
    }
    if (params.forcesType === 'arrows') {
      arrow(x, y, force.direction, setOpacity('rgb(0,200,255)', 0.1 + force.magnitude / maxMagnitude))
    }
  }
}
