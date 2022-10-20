import {reactive, toRaw, watch} from 'vue'

const KEY = 'gravity-yo-params'

export const params = reactive({
  G: 1,
  showVectors: true,
  stepByStep: false,
  celestialsCount: 1,
  celestialsMassRange: [1000, 10_000],
  celestialsRadiusRange: [12, 12],
  wandererMass: 1,
  wandererRadius: 3,
  bounceFromEdges: false,
  trailFadeoutMs: 4500,
})

export const restoreParams = () => {
  let savedParams = localStorage.getItem(KEY)
  if (savedParams) {
    savedParams = JSON.parse(savedParams)
    for (let [k, v] of Object.entries(savedParams)) {
      params[k] = v
    }
  }
}

watch(params, newParams => {
  localStorage.setItem(KEY, JSON.stringify(toRaw(newParams)))
})
