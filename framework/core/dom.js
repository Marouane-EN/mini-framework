/**
 * Converts a virtual DOM node into a real DOM element
 * Recursively creates DOM elements with their attributes, event listeners, and children
 * 
 * @param {Object|string|number} node - Virtual DOM node to convert
 * @param {string} node.type - HTML tag name (e.g., 'div', 'span', 'button')
 * @param {Object} node.props - Element properties (className, id, event handlers, etc.)
 * @param {Array} node.children - Array of child virtual nodes
 * @returns {HTMLElement|Text} Real DOM element or text node
 * 
 * @example
 * const vNode = { type: 'div', props: { className: 'box' }, children: ['Hello'] };
 * const domElement = createElement(vNode);
 * // Returns: <div class="box">Hello</div>
 */
export function createElement(node) {
  console.log("++++++++node", node);

  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(String(node));
  }

  // if (typeof node.type === "function") {
  //     console.log("sqdsqdqs",node);
  //     return createElement(node.type({ ...node.props, children: node.children }));
  // }

  const el = document.createElement(node.type);

  for (const [key, value] of Object.entries(node.props)) {
    if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "className") {
      el.className = value;
    } else if (key === "id") {
      el.id = value;
    } else {
      el.setAttribute(key, value);
    }
  }

  node.children.flat().forEach((child) => {
    if (child == null || child === false) return;
    el.appendChild(createElement(child));
  });

  return el;
}
