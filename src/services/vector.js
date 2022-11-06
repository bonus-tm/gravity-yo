import {params} from '@/params.js'

export const distance = ([x1, y1], [x2, y2]) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export const angle = ([x1, y1], [x2, y2]) => {
  return Math.atan2(y2 - y1, x2 - x1)
}

export const toPolar = (dx, dy) => {
  let magnitude = Math.sqrt(dx ** 2 + dy ** 2)
  let direction = Math.atan2(dy, dx)
  return [direction, magnitude]
}

export const toCartesian = (direction, magnitude) => {
  let dx = magnitude * Math.cos(direction)
  let dy = magnitude * Math.sin(direction)
  return [dx, dy]
}

export const add = ([dx1, dy1], [dx2, dy2]) => {
  let dx = dx1 + dx2
  let dy = dy1 + dy2
  return [dx, dy]
}

/**
 * Effective calculation vector sum of all forces between target and other bodies
 * @param {{x: number, y: number, mass: number, radius: number}} target
 * @param {[{x: number, y: number, mass: number, radius: number}]} bodies
 * @param {number} threshold min distance when skip force calculation
 * @return {{dx: number, dy: number, magnitude: number, direction: number}}
 */
export const calcForce = (target, bodies, threshold = 0) => {
  /*
   Explanation:

        A — target position [Ax,Ay]
        .
        ⎸\
        ⎸ \
        ⎸  \
      B ⎸———\ C
        ⎸    \
        ⎸_____\
      D        E — nth body position [Ex,Ey]

  AE — distance
  AC — vector in question and also its magnitude

  AB = vector dy
  BC = vector dx

  AD = dY = Ey - Ay
  DE = dX = Ex - Ax

  dx = dX * magnitude / distance
  dy = dY * magnitude / distance
  */

  let force = {dx: 0, dy: 0, direction: 0, magnitude: 0, collision: false}

  for (let body of bodies) {
    let dist2 = Math.pow(target.x - body.x, 2) + Math.pow(target.y - body.y, 2)
    let dist = Math.sqrt(dist2)
    if (dist < threshold + target.radius + body.radius) {
      force.collision = true
      continue
    }

    let magnitude = params.G * (target.mass + body.mass) / dist2

    // let dx = force.magnitude * Math.cos(force.direction) +

    force.dx += (body.x - target.x) * magnitude / dist
    force.dy += (body.y - target.y) * magnitude / dist
  }

  [force.direction, force.magnitude] = toPolar(force.dx, force.dy)

  return force
}
