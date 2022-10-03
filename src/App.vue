<script setup>
import {onMounted, reactive, ref} from 'vue'
import {CelestialWanderer} from './classes/CelestialWanderer.js'
import {Celestial} from './classes/Celestial.js'
import {rand, round, setOpacity} from './util.js'

let raf
const canvas = ref(null)
let context

let colorBg
let colorCelestial
let colorWanderer

let wanderer
let wanderers = reactive([])
let celestials = []
let celestialsCount = ref(10)

onMounted(() => {
  let style = getComputedStyle(document.body)
  colorBg = style.getPropertyValue('--color-bg').trim()
  colorCelestial = style.getPropertyValue('--color-celestial').trim()
  colorWanderer = style.getPropertyValue('--color-wanderer').trim()

  console.log('mounted', {colorBg, colorCelestial, colorWanderer})

  context = canvas.value.getContext('2d')

  createCelestials()
  drawCelestials()
})

const clear = () => {
  context.fillStyle = colorBg
  context.fillRect(0, 0, canvas.value.width, canvas.value.height)
}

const createCelestials = () => {
  celestials = []
  for (let i = 0; i < celestialsCount.value; i++) {
    let body = Object.assign({}, Celestial, {
      x: rand(20, canvas.value.width - 20),
      y: rand(20, canvas.value.height - 20),
      radius: 12,
      mass: 100,
      color: colorCelestial,
    })
    celestials.push(body)
  }
}

const drawCelestials = () => {
  for (let body of celestials) {
    body.draw(context)
  }
}

const frame = () => {
  // console.log('framed')
  let isCollided = false
  for (let body of celestials) {
    isCollided = isCollided || wanderer.interact(body)
  }

  let isOutside = wanderer.checkBounds(canvas.value)
  wanderer.move()

  if (wanderer.trail.length) {
    wanderer.drawTrail(context, colorBg)
  }
  wanderer.draw(context)

  if (!isCollided && !isOutside) {
    raf = window.requestAnimationFrame(frame)
  }
}

const run = () => {
  window.cancelAnimationFrame(raf)

  // clear canvas
  clear()

  // create stationary bodies
  createCelestials()
  drawCelestials()

  wanderers = reactive([])
}

let lineDrawing = ref(false)
let s = {x: 0, y: 0}
const pointStart = e => {
  lineDrawing.value = true
  s.x = e.offsetX
  s.y = e.offsetY
}
const pointEnd = e => {
  lineDrawing.value = false

  clear()
  drawCelestials()

  // create wanderer
  let dx = e.offsetX - s.x
  let dy = e.offsetY - s.y
  wanderer = reactive(Object.assign({}, CelestialWanderer, {
    x: s.x,
    y: s.y,
    radius: 3,
    mass: 1,
    color: colorWanderer,
    angle: Math.PI + Math.atan2(dy, dx),
    velocity: Math.sqrt(dx * dx + dy * dy) / 10,
    trail: [],
  }))
  wanderers.push(wanderer)

  wanderer.draw(context)

  // run frames
  raf = window.requestAnimationFrame(frame)
}
const onMove = e => {
  if (lineDrawing.value) {
    drawLine(e.offsetX, e.offsetY)
  }
}
const drawLine = (x, y) => {
  clear()
  drawCelestials()

  let gradient = context.createLinearGradient(s.x, s.y, x, y)
  gradient.addColorStop(0, setOpacity(colorWanderer, CelestialWanderer.maxTrailOpacity))
  gradient.addColorStop(1, setOpacity(colorWanderer, CelestialWanderer.minTrailOpacity))

  context.beginPath()
  context.lineWidth = 1
  context.strokeStyle = gradient
  context.moveTo(s.x, s.y)
  context.lineTo(x, y)
  context.stroke()
}
</script>

<template>
  <div style="text-align: left">
    <div>X: {{ round(wanderers[0]?.x) }}</div>
    <div>Y: {{ round(wanderers[0]?.y) }}</div>
  </div>

  <!--<div v-if="wanderers[0]" style="position:absolute;top: 10px;left: 10px;">-->
  <!--  <div v-for="([x, y], i) in wanderers[0].trail" :key="`trail-${i}`">-->
  <!--    {{ round(x) }}, {{ round(y) }}-->
  <!--  </div>-->
  <!--</div>-->

  <canvas
    @mousedown.left="pointStart"
    @mouseup.left="pointEnd"
    @mousemove="onMove"
    ref="canvas"
    width="1000"
    height="500"
  />
  <br>
  <input v-model="celestialsCount" />
  <button @click="run">Run</button>
</template>

<style scoped>
canvas {
  border: 1px solid darkolivegreen;
}
</style>
