import { pindingEffects, clearhooks } from "./hooks.js";
import { updateElement } from "./diff.js";
const root = document.getElementById("root");
let rootElements;
let oldVDOM;
export function render(App) {
  if (App) rootElements = App;
  pindingEffects.forEach((fn) => fn());

  clearhooks();
  const newVDOM = rootElements(); // new virtual DOM
  
  updateElement(root, newVDOM, oldVDOM); // diff & patch
  oldVDOM = newVDOM; // save for next render
}
