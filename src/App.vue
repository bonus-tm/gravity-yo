<script setup>
import {onMounted, reactive, ref} from 'vue'
import {wanderer} from '@/classes/Wanderer.js'
import {Celestial} from '@/classes/Celestial.js'
import {setOpacity} from '@/util/colors.js'
import {rand, round} from '@/util/numbers.js'
import {params} from '@/params.js'
import {canvas, context, backgroundColor} from '@/store'
import {clearCanvas, lineGradient} from '@/services/draw.js'
import Settings from '@/components/Settings.vue'
import Logo from '@/components/Logo.vue'
import {calcForces, drawForces} from '@/classes/forces.js'
import SvgCog from '@/components/SvgCog.vue'

let raf

let colorBg
let colorCelestial
let colorWanderer

let celestials = []

let time

let velocityMin = ref(Infinity)
let velocityMax = ref(0)

onMounted(() => {
  let style = getComputedStyle(document.body)
  colorBg = style.getPropertyValue('--color-bg').trim()
  colorCelestial = style.getPropertyValue('--color-celestial').trim()
  colorWanderer = style.getPropertyValue('--color-wanderer').trim()

  backgroundColor.value = style.getPropertyValue('--color-bg').trim()

  console.log('mounted', {colorBg, colorCelestial, colorWanderer})

  let minDimension = Math.min(canvas.value.width, canvas.value.height)
  params.radiusMin = Math.round(minDimension / 100)
  params.radiusMax = Math.round(minDimension / 20)

  context.value = canvas.value.getContext('2d')

  createCelestials()

  calcForces(celestials)
  drawForces()

  drawCelestials()
})

const createCelestials = () => {
  celestials = []
  let {width, height} = canvas.value
  let padding = 0.1
  for (let i = 0; i < params.celestialsCount; i++) {
    let body = Object.assign(Object.create(Celestial), {
      // x: 500,
      // y: 250,
      // mass: params.massMax,

      x: rand(width * padding, width * (1 - padding)),
      y: rand(height * padding, height * (1 - padding)),
      mass: rand(params.massMin, params.massMax),
      color: colorCelestial,
    })
    celestials.push(body)
  }
}

const drawCelestials = () => {
  for (let body of celestials) {
    body.draw()
  }
}

const createWanderer = (x, y, dx, dy) => {
  wanderer.reset()
  time = performance.now()
  console.log('createWanderer', time)
  wanderer.init({
    x,
    y,
    direction: Math.PI + Math.atan2(dy, dx),
    speed: Math.sqrt(dx * dx + dy * dy) / 100,
  })
}

const frame = ts => {
  clearCanvas()
  drawCelestials()

  let dt = time > ts ? 0 : (ts - time) / 1000
  time = ts

  wanderer.updateForce(celestials)
  wanderer.move(dt)

  wanderer.drawTrail()
  wanderer.draw()

  wanderer.pushToTrack()

  let isOutside = wanderer.checkBounds(canvas.value)

  if (!wanderer.collision && !isOutside) {
    raf = window.requestAnimationFrame(frame)
  }
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
  // createWanderer(500, 200, Math.sqrt(params.G * (params.massMax + 1) / (250-200)), 0)

  wanderer.draw()

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

const showSettings = ref(false)
const toggleSettings = () => {
  showSettings.value = !showSettings.value
}
</script>

<template>
  <header>
    <Logo />
    <h2>
      Level
      <b>{{ params.celestialsCount }}</b>
    </h2>
    <div class="spacer" />
    <div>
      <div>
        Time
        {{ round(wanderer.time / 1000, 1) }}
        s
      </div>
      <div>
        Distance
        {{ round(wanderer.distanceTravelled, 0) }}
        px
      </div>
    </div>
    <div>
      <SvgCog @click="toggleSettings" />
    </div>
  </header>

  <canvas
    ref="canvas"
    height="500"
    width="1000"
    @mousemove="onMove"
    @mousedown.left="pointStart"
    @mouseup.left="pointEnd"
  />

  <Settings v-show="showSettings" />
</template>
