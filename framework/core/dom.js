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
