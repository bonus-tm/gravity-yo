import {computed, reactive} from 'vue'

export const KEY = 'gravity-yo-params'

const paramDefaults = {
  G: 1,
  showVectors: true,
  stepByStep: false,
  bounceFromEdges: false,
  celestialsCount: 1,
  massMin: 1000,
  massMax: 10_000,
  radiusMin: 12,
  radiusMax: 12,
  wandererMass: 1,
  wandererRadius: 3,
  trailFadeoutMs: 2000,
}

export const params = reactive(Object.assign({}, paramDefaults))

export const restoreParams = () => {
  let savedParams = localStorage.getItem(KEY)
  if (savedParams) {
    savedParams = JSON.parse(savedParams)
    for (let [k, v] of Object.entries(savedParams)) {
      params[k] = v
    }
  }
}

export const revertToDefaults = () => {
  for (let [k, v] of Object.entries(paramDefaults)) {
    params[k] = v
  }
}

export const showRevert = computed(() => {
  for (let [k, v] of Object.entries(paramDefaults)) {
    if (params[k] !== v) return true
  }
  return false
})
