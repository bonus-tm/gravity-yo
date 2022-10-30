import {reactive} from 'vue'
import {params} from '@/params.js'
import {setOpacity} from '@/util/colors.js'
import {createVector} from '@/classes/Vector.js'
import {circle, line} from '@/classes/draw.js'

/**
 * init
 *   x0,y0
 *   f = 0
 *   v = vInitial
 *
 * t0 = 0
 *    no movement
 *    trail empty
 *    at x0,y0
 *      draw wanderer
 *      calc f0
 *      calc v0 = vInitial + v(f0)
 *      draw vectors f0, v0
 *    push t0,x0,y0,v0,f0 to track
 *
 * t1 = t0 + dt
 *    move with v0, f0 → x1,y1
 *    draw trail
 *    at x1,y1
 *      draw wanderer
 *      calc f1
 *      calc v1 = v0 + v(f1)
 *      draw vectors f1, v1
 *    push t1,x1,y1,v1,f1 to track
 *
 * t2 = t1 + dt
 *    move with v1, f1 → x2,y2
 *    draw trail
 *    at x2,y2
 *      draw wanderer
 *      calc f2
 *      calc v2 = v1 + v(f1)
 *      draw vectors f1, v1
 *    push t2,x2,y2,v2,f2 to track
 *
 * ...
 *
 * tn = t[n-1] + dt
 *    move with v[n-1], f[n-1] → xn,yn  (n = 0, dt = 0 => xn,yn = x[n-1],y[n-1] = x0,y0)
 *    draw trail
 *    at xn,yn
 *      draw wanderer
 *      calc fn
 *      calc vn = v[n-1] + v(f[n-1])
 *      draw vectors f[n-1], v[n-1]
 *    push tn,xn,yn,vn,fn to track
 */


export const wanderer = reactive({
  // time is ms
  time: 0,
  y: 0,
  x: 0,
  distanceTravelled: 0,
  track: [],

  radius: params.wandererRadius,
  mass: params.wandererMass,

  force: createVector(),
  velocity: createVector(),

  color: 'rgb(255,0,0)',

  maxTrailOpacity: 0.5,
  minTrailOpacity: 0.1,

  maxTrailWidth: 0.8,
  minTrailWidth: 0.8,

  collision: false,

  reset () {
    this.time = 0
    this.x = 0
    this.y = 0

    this.radius = params.wandererRadius

    this.force.reset()
    this.velocity.reset()

    this.distanceTravelled = 0

    this.track = []
    this.collision = false
  },

  init ({x, y, direction, speed}) {
    this.x = x
    this.y = y
    this.velocity.direction = direction
    this.velocity.magnitude = speed
  },

  distanceTo (body) {
    return Math.sqrt(
      ((this.x - body.x) ** 2) + ((this.y - body.y) ** 2)
    )
  },

  angleTo (body) {
    return Math.PI + Math.atan2(this.y - body.y, this.x - body.x)
  },

  updateForce (bodies) {
    this.force.reset()
    for (let body of bodies) {
      let distance = this.distanceTo(body)
      if (distance < this.radius + body.radius) {
        this.collision = true
      }

      let magnitude = params.G * this.mass * body.mass / distance ** params.power
      let direction = this.angleTo(body)

      this.force.add(createVector({direction, magnitude}))
    }
  },

  /**
   *
   * @param dt seconds
   */
  calcVelocity (dt) {
    this.velocity.dx += this.force.dx * dt / this.mass
    this.velocity.dy += this.force.dy * dt / this.mass
  },

  /**
   *
   * @param dt seconds
   */
  move (dt) {
    let dx = this.velocity.dx * dt + this.force.dx * dt * dt / (2 * this.mass)
    let dy = this.velocity.dy * dt + this.force.dy * dt * dt / (2 * this.mass)

    this.x += dx
    this.y += dy
    this.time += dt * 1000
    this.distanceTravelled += Math.sqrt(dx ** 2 + dy ** 2)
  },

  pushToTrack () {
    // time is ms
    this.track.push({
      time: this.time,
      x: this.x,
      y: this.y,
      vdx: this.velocity.dx,
      vdy: this.velocity.dy,
      vDir: this.velocity.direction,
      vMag: this.velocity.magnitude,
      fdx: this.force.dx,
      fdy: this.force.dy,
      fDir: this.force.direction,
      fMag: this.force.magnitude,
    })
  },

  checkBounds (canvas) {
    return this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
  },

  drawTrail () {
    // let width = this.minTrailWidth * (this.radius * 2)
    // let widthStep = ((this.radius * 2) - width) / this.maxTrailSteps
    let fadeTime = params.trailFadeoutMs

    let x0 = this.x
    let y0 = this.y
    let i = this.track.length - 1
    while (i > 0 && this.time - this.track[i].time < fadeTime) {
      let {x, y, time} = this.track[i]

      // draw only when any coordinate difference is more than 1px
      if (Math.abs(x - x0) >= 1 || Math.abs(y - y0) >= 1) {
        let trackTime = this.time - time
        let opacity = this.maxTrailOpacity * (fadeTime - trackTime) / fadeTime
        line(x0, y0, x, y, this.radius, setOpacity(this.color, opacity))

        x0 = x
        y0 = y
      }
      i--
    }
  },

  draw () {
    if (params.showVectors) {
      line(
        this.x,
        this.y,
        this.x + this.velocity.dx,
        this.y + this.velocity.dy,
        1,
        'rgb(0,255,0)'
      )
      line(
        this.x,
        this.y,
        this.x + this.force.dx,
        this.y + this.force.dy,
        1,
        'rgb(0,200,255)'
      )
    }

    circle(this.x, this.y, this.radius, this.color)
  },
})
