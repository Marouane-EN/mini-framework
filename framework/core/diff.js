import { createElement } from "./dom.js";

export function updateElement(parent, newNode, oldNode, index = 0) {
  // If oldNode doesn't exist, create new DOM

  
  if (!oldNode) {

    parent.appendChild(createElement(newNode));
    return;
  }

  // If newNode doesn't exist, remove old DOM
  if (!newNode) {

    parent.removeChild(parent.childNodes[index]);
    return;
  }

  // If types differ, replace
  if (newNode.type !== oldNode.type || typeof newNode !== typeof oldNode) {
    
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    return;
  }

  // If text node, update textContent
  if (typeof newNode === "string" || typeof newNode === "number") {

    if (newNode !== oldNode) {
      parent.childNodes[index].textContent = newNode;
    }
    return;
  }

  // Update attributes
  const el = parent.childNodes[index];

  // Remove old attributes not in newNode
  for (const key in oldNode.props) {
    if (!(key in newNode.props)) {

      if (key.startsWith("on")) {
        el.removeEventListener(key.slice(2).toLowerCase(), oldNode.props[key]);
      } else {
        el.removeAttribute(key);
      }
    }
  }

  // Set new/changed attributes
  for (const key in newNode.props) {
    const value = newNode.props[key];
    if (key.startsWith("on")) {
      // For simplicity, remove old and add new
      
      if (oldNode.props[key] !== value) {
        if (oldNode.props[key]) {
          el.removeEventListener(
            key.slice(2).toLowerCase(),
            oldNode.props[key]
          );
        }
        el.addEventListener(key.slice(2).toLowerCase(), value);
      }
    } else if (key === "className") {
      el.className = value;
    } else if (key === "id") {
      el.id = value;
    } else {
      el.setAttribute(key, value);
    }
  }


  // Diff children
  const maxLen = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLen; i++) {
      
      updateElement(el, newNode.children[i], oldNode.children[i], i);
  }
  
}
