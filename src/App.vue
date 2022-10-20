<script setup>
import {onMounted, reactive, ref} from 'vue'
import {wanderer} from '@/classes/Wanderer.js'
import {Celestial} from '@/classes/Celestial.js'
import {setOpacity} from '@/util/colors.js'
import {rand, round} from '@/util/numbers.js'
import {params, restoreParams} from '@/params.js'
import {canvas, context, backgroundColor} from '@/store'
import {clearCanvas, lineGradient, testTrail} from '@/classes/draw.js'

let raf

let colorBg
let colorCelestial
let colorWanderer

let celestials = []

let time

onMounted(() => {
  restoreParams()

  let style = getComputedStyle(document.body)
  colorBg = style.getPropertyValue('--color-bg').trim()
  colorCelestial = style.getPropertyValue('--color-celestial').trim()
  colorWanderer = style.getPropertyValue('--color-wanderer').trim()

  backgroundColor.value = style.getPropertyValue('--color-bg').trim()

  console.log('mounted', {colorBg, colorCelestial, colorWanderer})

  context.value = canvas.value.getContext('2d')

  createCelestials()
  drawCelestials()

  // testTrail()
})

const createCelestials = () => {
  celestials = []
  for (let i = 0; i < params.celestialsCount; i++) {
    let body = Object.assign(Object.create(Celestial), {
      // x: rand(20, canvas.value.width - 20),
      // y: rand(20, canvas.value.height - 20),
      x: 200,
      y: 200,
      radius: 12,
      mass: 30000,
      color: colorCelestial,
    })
    celestials.push(body)
  }
  console.log(celestials)
}

const drawCelestials = () => {
  for (let body of celestials) {
    body.draw(context)
  }
}

const createWanderer = (x, y, dx, dy) => {
  wanderer.reset()
  time = performance.now()
  console.log('createWanderer', time)
  wanderer.init({
    x: 200,
    y: 130,
    // direction: Math.PI + Math.atan2(dy, dx),
    // speed: Math.sqrt(dx * dx + dy * dy) / 10,
    direction: 0,
    speed: 20,
  })
}

const frame = ts => {
  console.log('framed', {ts})
  clearCanvas()
  drawCelestials()

  let dt = time > ts ? 0 : (ts - time) / 1000
  time = ts

  wanderer.move(dt)
  wanderer.drawTrail()

  wanderer.draw()
  wanderer.updateForce(celestials)
  wanderer.calcVelocity(dt)

  wanderer.pushToTrack()



  let isCollided = false
  // for (let body of celestials) {
  //   isCollided = isCollided || wanderer.interact(body)
  // }

  let isOutside = wanderer.checkBounds(canvas.value)
  // wanderer.move()

  if (!isCollided && !isOutside) {
    raf = window.requestAnimationFrame(frame)
  }
}

const run = () => {
  window.cancelAnimationFrame(raf)

  clearCanvas()

  // create stationary bodies
  createCelestials()
  drawCelestials()
}

let lineDrawing = ref(false)
let s = {x: 0, y: 0}
const pointStart = e => {
  window.cancelAnimationFrame(raf)
  wanderer.reset()
  lineDrawing.value = true
  s.x = e.offsetX
  s.y = e.offsetY
}
const pointEnd = e => {
  lineDrawing.value = false

  clearCanvas()
  drawCelestials()

  // create wanderer
  let dx = e.offsetX - s.x
  let dy = e.offsetY - s.y
  createWanderer(s.x, s.y, dx, dy)

  wanderer.draw(context)
  console.log(wanderer)

  // run frames
  raf = window.requestAnimationFrame(frame)
}
const onMove = e => {
  if (lineDrawing.value) {
    drawLine(e.offsetX, e.offsetY)
  }
}
const drawLine = (x, y) => {
  clearCanvas()
  drawCelestials()

  lineGradient(s.x, s.y, x, y, 1,
    setOpacity(colorWanderer, wanderer.maxTrailOpacity),
    setOpacity(colorWanderer, wanderer.minTrailOpacity)
  )
}
</script>

<template>
  <div style="text-align: left">
    <div>X: {{ round(wanderer.x) }}</div>
    <div>Y: {{ round(wanderer.y) }}</div>

    <div>forceDirection: {{ round(wanderer.force.direction, 5) }}</div>
    <div>forceMagnitude: {{ round(wanderer.force.magnitude, 5) }}</div>
    <div>forceXY: {{ round(wanderer.force.dx, 5) }},{{ round(wanderer.force.dy, 5) }}</div>
    <div>velocityDirection: {{ round(wanderer.velocity.direction, 5) }}</div>
    <div>velocityMagnitude: {{ round(wanderer.velocity.magnitude, 5) }}</div>
  </div>

  <div v-if="wanderer" style="position:absolute;top: 10px;left: 10px;">
    <div v-for="([x, y], i) in wanderer.trail" :key="`trail-${i}`">
      {{ round(x) }}, {{ round(y) }}
    </div>
  </div>

  <canvas
    @mousedown.left="pointStart"
    @mouseup.left="pointEnd"
    @mousemove="onMove"
    ref="canvas"
    width="1000"
    height="500"
  />

  <h3>Settings</h3>
  <div>
    <label for="celestialsCount">Celestials count</label>
    <input id="celestialsCount" v-model="params.celestialsCount" type="number" min="0" />
  </div>
  <div>
    <input id="stepByStep" v-model="params.stepByStep" type="checkbox" />
    <label for="stepByStep">Step debug mode</label>
  </div>
  <div>
    <input id="showVectors" v-model="params.showVectors" type="checkbox" />
    <label for="showVectors">Show velocity and force vectors</label>
  </div>
  <div>
    <input id="bounceFromEdges" v-model="params.bounceFromEdges" type="checkbox" />
    <label for="bounceFromEdges">Bounce from edges</label>
  </div>
</template>

<style scoped>
canvas {
  border: 1px solid darkolivegreen;
  background-color: var(--color-bg);
}
</style>
