<script setup>
import {computed, reactive, ref} from 'vue'
import {CelestialWanderer} from './classes/CelestialWanderer.js'
import {Celestial} from './classes/Celestial.js'
import {round} from './util.js'

const canvas = ref(null)
let context

let wanderer
let wanderers = reactive([])
let celestials = []

let celestialsCount = ref(1)

let colorBg
let colorCelestial
let colorWanderer


const frame = () => {
  console.log('framed')
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
    window.requestAnimationFrame(frame)
  }
}


const run = () => {
  let style = getComputedStyle(document.body)
  colorBg = style.getPropertyValue('--color-bg')
  colorCelestial = style.getPropertyValue('--color-celestial')
  colorWanderer = style.getPropertyValue('--color-wanderer')
  console.log({colorBg, colorCelestial, colorWanderer})

  // prep canvas
  context = canvas.value.getContext('2d')
  context.fillStyle = colorBg
  context.fillRect(0, 0, canvas.value.width, canvas.value.height)

  // create stationary bodies
  celestials = []
  for (let i = 0; i < celestialsCount.value; i++) {
    let body = Object.assign(Celestial, {
      x: 100,
      y: 100,
      radius: 12,
      mass: 100,
      color: colorCelestial,
    })
    body.draw(context)

    celestials.push(body)
  }

  // create wanderer
  wanderer = reactive(Object.assign(CelestialWanderer, {
    x: 10,
    y: 64,
    // x: 178,
    // y: 12,
    radius: 3,
    mass: 1,
    color: colorWanderer,
    angle: 0,
    velocity: 5,
    trail: [],
  }))
  wanderers.push(wanderer)

  // wanderer.trail = [
  //   [73, 48],
  //   [84, 47],
  //   [95, 46],
  //   [107, 43],
  //   [118, 40],
  //   [129, 36],
  //   [140, 32],
  //   [150, 27],
  //   [159, 22],
  //   [169, 17],
  // ]

  wanderer.draw(context)

  // wanderer.drawTrail(context, colorBg)


  // run frames
  window.requestAnimationFrame(frame)
}
</script>

<template>
  <div style="text-align: left">
  <div>X: {{ round(wanderers[0]?.x) }}</div>
  <div>Y: {{ round(wanderers[0]?.y) }}</div>
  </div>

  <div v-if="wanderers[0]" style="position:absolute;top: 10px;left: 10px;">
    <div v-for="([x, y], i) in wanderers[0].trail" :key="`trail-${i}`">
      {{ round(x) }}, {{ round(y) }}
    </div>
  </div>

  <canvas @click="run" ref="canvas" width="1000" height="500"></canvas>
  <br>
  <input v-model="celestialsCount" />
</template>

<style scoped>
canvas {
  border: 1px solid darkolivegreen;
}
</style>
