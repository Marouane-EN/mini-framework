import { pindingEffects, clearhooks } from "./hooks.js"
import { updateElement } from "./diff.js"
let oldVDOM
let roo
const root = document.getElementById("root")
export function render(App) {

  if (App) roo = App
  pindingEffects.forEach(fn => fn());

  clearhooks()
  const newVDOM = roo(); // new virtual DOM
  updateElement(root, newVDOM, oldVDOM); // diff & patch
  oldVDOM = newVDOM; // save for next render
}


