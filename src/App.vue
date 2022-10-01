<script setup>
import {computed, ref} from 'vue'
import {CelestialWanderer} from './classes/CelestialWanderer.js'
import {Celestial} from './classes/Celestial.js'

const canvas = ref(null)

let wanderer
let celestials = []

let celestialsCount = ref(1)

const frame = () => {
  console.log('framed')
  let isCollided = false
  for (let body of celestials) {
    isCollided = isCollided || wanderer.interact(body)
  }

  let isOutside = wanderer.checkBounds()
  wanderer.move()
  wanderer.draw()

  if (!isCollided && !isOutside) {
    window.requestAnimationFrame(frame)
  }
}

const run = () => {
  let style = getComputedStyle(document.body)
  let colorBg = style.getPropertyValue('--color-bg')
  let colorCelestial = style.getPropertyValue('--color-celestial')
  let colorWanderer = style.getPropertyValue('--color-wanderer')
  console.log({colorBg, colorCelestial, colorWanderer})

  // prep canvas
  Celestial.context = canvas.value.getContext('2d')
  Celestial.context.fillStyle = colorBg
  Celestial.context.fillRect(0, 0, Celestial.canvasWidth, Celestial.canvasHeight)

  // create stationary bodies
  celestials = []
  for (let i = 0; i < celestialsCount.value; i++) {
    let body = new Celestial({
      x: 100,
      y: 100,
      radius: 12,
      mass: 100,
      color: colorCelestial,
    })
    body.draw()

    celestials.push(body)
  }

  // create wanderer
  wanderer = new CelestialWanderer({
    x: 10,
    y: 58,
    radius: 3,
    mass: 1,
    color: colorWanderer,
    angle: 0,
    velocity: 4,
  })
  wanderer.draw()

  // run frames
  window.requestAnimationFrame(frame)
}
</script>

<template>
  <canvas @click="run" ref="canvas" width="1000" height="500"></canvas>
  <br>
  <input v-model="celestialsCount" />
</template>

<style scoped>
canvas {
  border: 1px solid darkolivegreen;
}
</style>
