<script setup>
import {onMounted, toRaw, watch} from 'vue'
import {KEY, params, restoreParams, showRevert, revertToDefaults} from '@/params.js'

watch(params, newParams => {
  localStorage.setItem(KEY, JSON.stringify(toRaw(newParams)))
})

onMounted(() => {
  restoreParams()
})

</script>

<template>
  <div id="settings">
    <h3>
      Settings
      <button v-if="showRevert" @click="revertToDefaults">
        Revert to defaults
      </button>
    </h3>
    <div>
      <label for="G">Gravitational constant</label>
      <input id="G" v-model="params.G" type="number" min="0" />
    </div>
    <div>
      <label for="power">Power of force decreasing with the distance</label>
      <input id="power" v-model="params.power" type="number" min="0" />
    </div>

    <div>
      <label for="celestialsCount">Celestials count</label>
      <input id="celestialsCount" v-model="params.celestialsCount" type="number" min="0" />
    </div>

    <div>
      <label for="massMin">Celestials mass range</label>
      <input id="massMin" v-model="params.massMin" type="number" min="1" />
      <input v-model="params.massMax" type="number" min="1" />
    </div>

    <div>
      <label for="wandererRadius">Wanderer radius</label>
      <input id="wandererRadius" v-model="params.wandererRadius" type="number" min="1" />
    </div>

    <div>
      <label for="wandererMass">Wanderer mass</label>
      <input id="wandererMass" v-model="params.wandererMass" type="number" min="1" />
    </div>

    <div>
      <label for="trailFadeoutMs">Trail fadeout time in ms</label>
      <input id="trailFadeoutMs" v-model="params.trailFadeoutMs" type="number" min="1" />
    </div>

    <div>
      <input id="showVectors" v-model="params.showVectors" type="checkbox" />
      <label for="showVectors">Show velocity and force vectors</label>
    </div>
    <div>
      <input id="bounceFromEdges" v-model="params.bounceFromEdges" type="checkbox" />
      <label for="bounceFromEdges">Bounce from edges</label>
    </div>
  </div>
</template>
