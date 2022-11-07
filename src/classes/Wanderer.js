import {reactive} from 'vue'
import {params} from '@/params.js'
import {setOpacity} from '@/util/colors.js'
import {createVector} from '@/classes/Vector.js'
import {circle, line} from '@/services/draw.js'
import {calcForce} from '@/services/vector.js'

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

  updateForce (bodies) {
    try {
      let {dx, dy, direction, magnitude} = calcForce({
        x: this.x,
        y: this.y,
        mass: this.mass,
        radius: this.radius,
      }, bodies)

      this.velocity.dx += dx
      this.velocity.dy += dy
    } catch (e) {
      if (e.message === 'Collision detected') {
        this.collision = true
      }
    }
  },

  /**
   *
   * @param dt seconds
   */
  move (dt) {
    let dx = this.velocity.dx
    let dy = this.velocity.dy

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
    }

    circle(this.x, this.y, this.radius, this.color)
  },
})
