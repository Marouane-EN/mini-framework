import { render } from "./render.js";

let states = [];
let stateIndex = 0;
let effects = [];
let effectIndex = 0;
export let pindingEffects = [];

/**
 * Resets all hook indices and clears pending effects
 * Called before each render to prepare for fresh hook execution
 * Ensures hooks are called in the same order every render
 * 
 * @returns {void}
 */
export function clearhooks() {
  stateIndex = 0;
  effectIndex = 0;
  pindingEffects = [];
}

/**
 * React-style state hook for managing component state
 * Returns current state value and a setter function that triggers re-renders
 * Must be called in the same order on every render (don't call conditionally)
 * 
 * @param {*} initialValue - Initial state value (only used on first render)
 * @returns {Array} Tuple of [currentState, setState] - state value and updater function
 * 
 * @example
 * const [count, setCount] = useState(0);
 * setCount(count + 1); // Set new value
 * setCount(prev => prev + 1); // Functional update
 */
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

/**
 * React-style effect hook for side effects (data fetching, subscriptions, DOM manipulation)
 * Runs the callback after render if dependencies have changed
 * 
 * @param {Function} callback - Effect function to run (can return cleanup function)
 * @param {Array} dependencies - Array of values that trigger re-run when changed
 * @returns {void}
 * 
 * @example
 * // Run once on mount
 * useEffect(() => { console.log('Mounted'); }, []);
 * 
 * // Run when count changes
 * useEffect(() => { document.title = `Count: ${count}`; }, [count]);
 */
export function useEffect(callback, dependencies) {
  const oldDependencies = effects[effectIndex];
  const hasChanged = areDepsChanged(oldDependencies, dependencies);

  if (hasChanged) {
    pindingEffects.push(callback);
  }

  effects[effectIndex] = dependencies;
  effectIndex++;
}

/**
 * Checks if effect dependencies have changed between renders
 * Compares old and new dependency arrays using shallow equality
 * 
 * @param {Array|undefined} oldDeps - Previous dependency array
 * @param {Array} newDeps - Current dependency array
 * @returns {boolean} True if dependencies changed or it's first render, false otherwise
 */
function areDepsChanged(oldDeps, newDeps) {
  if (!oldDeps) return true;
  if (oldDeps.length !== newDeps.length) return true;

  for (let i = 0; i < newDeps.length; i++) {
    if (oldDeps[i] !== newDeps[i]) return true;
  }
  return false;
}
