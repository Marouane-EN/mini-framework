import { useState, useEffect, jsx, addRoute } from "../framework/main.js";

function App() {
  const [nn, setnb] = useState(0);
  const [n, setnnb] = useState(0);

  return jsx(
    "p",
    null,
    jsx(
      "button",
      {
        onclick: () => {
          setnb(nn + 1);
        },
      },
      "click "
    ),
    jsx("span", null, `hada hwa  ${nn}`),
    jsx(
      "p",
      null,
      jsx(
        "button",
        {
          onclick: () => {
            setnnb(n + 1);
          },
        },
        "click "
      ),
      jsx("span", null, `hada hwa  ${n}`)
    )
  );
}

addRoute("/", App);
