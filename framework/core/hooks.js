import { render } from "./render.js";

let states = [];
let stateIndex = 0;
let effects = [];
let effectIndex = 0;
export let pindingEffects = [];

export function clearhooks() {
  stateIndex = 0;
  effectIndex = 0;
  pindingEffects = [];
}
export function useState(initialValue) {
  const currentIndex = stateIndex;
  states[currentIndex] =
    states[currentIndex] !== undefined ? states[currentIndex] : initialValue;

  function setState(newValue) {
    if (typeof newValue === "function") {
      states[currentIndex] = newValue(states[currentIndex]);
    } else {
      states[currentIndex] = newValue;
    }
    render();
  }

  stateIndex++;

  return [states[currentIndex], setState];
}
export function useEffect(callback, dependencies) {
  const oldDependencies = effects[effectIndex];
  const hasChanged = areDepsChanged(oldDependencies, dependencies);

  if (hasChanged) {
    pindingEffects.push(callback);
  }

  effects[effectIndex] = dependencies;
  effectIndex++;
}
function areDepsChanged(oldDeps, newDeps) {
  if (!oldDeps) return true;
  if (oldDeps.length !== newDeps.length) return true;

  for (let i = 0; i < newDeps.length; i++) {
    if (oldDeps[i] !== newDeps[i]) return true;
  }
  return false;
}
