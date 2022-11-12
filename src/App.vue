<script setup>
import {onMounted, ref} from 'vue'
import {wanderer} from '@/classes/Wanderer'
import {setOpacity} from '@/util/colors'
import {rand, round} from '@/util/numbers'
import {params} from '@/params'
import {canvas, context, backgroundColor, colorCelestial, colorWanderer} from '@/store'
import {circle, clearCanvas, lineGradient} from '@/services/draw'
import Settings from '@/components/Settings.vue'
import Logo from '@/components/Logo.vue'
import {calcForces, drawForces} from '@/classes/forces'
import SvgCog from '@/components/SvgCog.vue'
import {distance} from '@/services/vector'

let raf

let celestials = []

let time

onMounted(() => {
  let style = getComputedStyle(document.body)

  backgroundColor.value = style.getPropertyValue('--color-bg').trim()

  colorCelestial.value = style.getPropertyValue('--color-celestial').trim()
  colorWanderer.value = style.getPropertyValue('--color-wanderer').trim()

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
    let mass = rand(params.massMin, params.massMax)
    let radius = Math.sqrt((params.radiusMax ** 2) * mass / params.massMax)
    let x
    let y

    let tooClose = true
    let attempt = 0

    while (tooClose && attempt < params.celestialsCount * 100) {
      tooClose = false
      attempt++

      x = rand(width * padding, width * (1 - padding))
      y = rand(height * padding, height * (1 - padding))

      for (let body of celestials) {
        let dist = distance([x, y], [body.x, body.y])
        if (dist < radius + body.radius + Math.max(radius, body.radius)) {
          tooClose = true
          break
        }
      }
    }

    celestials.push({x, y, mass, radius})
  }
}

const drawCelestials = () => {
  for (let body of celestials) {
    circle(body.x, body.y, body.radius, colorCelestial.value)
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

  lineGradient(s.x, s.y, x, y, wanderer.radius,
    setOpacity(colorWanderer.value, wanderer.maxTrailOpacity),
    setOpacity(colorWanderer.value, wanderer.minTrailOpacity)
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
