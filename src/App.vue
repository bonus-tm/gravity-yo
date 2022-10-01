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

let wandererCoords = computed(() => {
  if (!wanderer) return 'inactive'

  return `X:${round(wanderer.x)}, Y:${round(wanderer.y)}`
})
let wx = computed(() => {
  return wanderer?.x
})
let wy = computed(() => wanderer?.y)

const frame = () => {
  console.log('framed')
  let isCollided = false
  for (let body of celestials) {
    isCollided = isCollided || wanderer.interact(body)
  }

  let isOutside = wanderer.checkBounds(canvas.value)
  wanderer.move()
  wanderer.draw(context)

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
    y: 58,
    radius: 3,
    mass: 1,
    color: colorWanderer,
    angle: 0,
    velocity: 4,
  }))
  wanderers.push(wanderer)
  wanderer.draw(context)

  // run frames
  window.requestAnimationFrame(frame)
}
</script>

<template>
  <div>X: {{ round(wanderers[0]?.x) }}</div>
  <div>Y: {{ round(wanderers[0]?.y) }}</div>
  
  <canvas @click="run" ref="canvas" width="1000" height="500"></canvas>
  <br>
  <input v-model="celestialsCount" />
</template>

<style scoped>
canvas {
  border: 1px solid darkolivegreen;
}
</style>
