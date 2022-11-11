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
    <div class="settings-content">
      <h3>Settings</h3>

      <div class="revert-button">
        <button v-if="showRevert" @click="revertToDefaults">
          Revert to defaults
        </button>
      </div>

      <div class="form-field">
        <label for="celestialsCount">Celestials count</label>
        <input id="celestialsCount" v-model="params.celestialsCount" type="number" min="0" />
      </div>

      <div class="form-field">
        <label for="massMin">Celestials mass range</label>
        <input id="massMin" v-model="params.massMin" type="number" min="1" />
        <input v-model="params.massMax" type="number" min="1" />
      </div>

      <div class="form-field">
        <label for="wandererRadius">Wanderer radius</label>
        <input id="wandererRadius" v-model="params.wandererRadius" type="number" min="1" />
      </div>

      <div class="form-field">
        <label for="wandererMass">Wanderer mass</label>
        <input id="wandererMass" v-model="params.wandererMass" type="number" min="1" />
      </div>

      <div class="form-field">
        <label for="trailFadeoutMs">Trail fadeout time in ms</label>
        <input id="trailFadeoutMs" v-model="params.trailFadeoutMs" type="number" min="1" />
      </div>

      <div class="form-field">
        <label for="G">Gravitational constant</label>
        <input id="G" v-model="params.G" type="number" min="0" />
      </div>

      <div class="form-field">
        <input id="showVectors" v-model="params.showVectors" type="checkbox" />
        <label for="showVectors">Show velocity and force vectors</label>
      </div>

      <div class="form-field">
        <input id="bounceFromEdges" v-model="params.bounceFromEdges" type="checkbox" />
        <label for="bounceFromEdges">Bounce from edges</label>
      </div>
    </div>
  </div>
</template>

<style>
#settings {
  position: fixed;
  top: var(--header-height);
  bottom: 0;
  right: 0;
  left: 0;
  background-color: var(--color-app-bg);
  display: flex;
  justify-content: center;
}
.settings-content {
  width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.revert-button {
  min-height: 4rem;
}

.form-field {
  display: flex;
  gap: 0.5em;
  align-items: baseline;
}
.form-field label {
  text-align: right;
  cursor: pointer;
}
.form-field input[type="number"] {
  width: 4rem;
  text-align: right;
}
</style>
