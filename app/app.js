import { useState, useEffect, jsx, addRoute } from "../framework/main.js";
function App() {
  const [todos, setTodos] = useState([]);
  console.log(todos);

  const itemLeft = todos.filter((todo) => {
    return todo.completed == false;
  }).length;

  function checkedTodo(todo) {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.key === todo.key ? { ...t, completed: !t.completed } : t
      )
    );
  }

  function addTodo(e) {
    if (e.key === "Enter" && e.target.value.trim().length >= 2) {
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          text: e.target.value,
          completed: false,
          key: prevTodos.length,
        },
      ]);
      e.target.value = "";
    }
  }

  function deleteTodo(key) {
    const updated = todos.filter((todo) => {
      return todo.key != key;
    });
    setTodos(updated);
  }

  return jsx(
    "section",
    { class: "todoapp" },

    // HEADER
    jsx(
      "header",
      { class: "header" },

      jsx("h1", null, "todos"),

      jsx(
        "div",
        { class: "input-container" },

        jsx("input", {
          class: "new-todo",
          id: "todo-input",
          type: "text",
          autofocus: true,
          placeholder: "What needs to be done?",
          onkeydown: (e) => addTodo(e),
        }),

        jsx(
          "label",
          { class: "visually-hidden", for: "todo-input" },
          "New Todo Input"
        )
      )
    ),

    // MAIN
    jsx(
      "main",
      { class: "main" },

      jsx(
        "ul",
        { class: "todo-list" },

        ...todos.map((todo) => {
          return jsx(
            "li",
            { class: "todo-item", key: todo.key },

            jsx("input", {
              type: "checkbox",
              class: "toggle",
              onclick: () => checkedTodo(todo),
            }),
            jsx(
              "label",
              { className: `${todo.completed ? "checked" : "nocheck"}` },
              todo.text
            ),

            jsx("button", {
              class: "destroy",
              onclick: () => deleteTodo(todo.key),
            })
          );
        })
      ),

      // FOOTER (conditional)
      todos.length > 0
        ? jsx(
            "footer",
            { class: "footer" },

            jsx("span", { class: "todo-count" }, itemLeft + " items left"),

            jsx(
              "ul",
              { class: "filters" },

              jsx(
                "li",
                null,
                jsx("a", { class: "selected", href: "#/" }, "All")
              ),

              jsx("li", null, jsx("a", { href: "#/active" }, "Active")),

              jsx("li", null, jsx("a", { href: "#/completed" }, "Completed"))
            ),

            jsx("button", { class: "clear-completed" }, "Clear completed")
          )
        : null
    )
  );
}

export const footer = jsx(
  "footer",
  { class: "info" },

  jsx("p", null, "Double-click to edit a todo"),

  jsx("p", null, "Created by the ranniz family"),

  jsx(
    "p",
    null,
    "Part of ",
    jsx("a", { href: "https://github.com/" }, "Zone01")
  )
);

addRoute("/", App);
