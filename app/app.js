import { useState, jsx, addRoute } from "../framework/main.js";
function App() {
  const [todos, setTodos] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [editText, setEditText] = useState("");

  const allChecked = (todos.every((t) => t.completed === true))

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

  function checkedAll() {

    const arr = todos.map((t) => {
      return { ...t, completed: !allChecked };
    });
    setTodos(arr);
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

  function clearCompleted() {
    const activeTodos = todos.filter((todo) => {
      return todo.completed == false;
    });
    setTodos(activeTodos);
  }

  function startEditing(todo) {
    setEditingKey(todo.key);
    setEditText(todo.text);
  }

  function finishEditing() {
    setTodos(prev =>
      prev.map(t =>
        t.key === editingKey ? { ...t, text: editText } : t
      )
    );

    setEditingKey(null);
    setEditText("");
  }

  return jsx(
    "section",
    { className: "todoapp" },

    // HEADER
    jsx(
      "header",
      { className: "header" },

      jsx("h1", null, "todos"),

      jsx(
        "div",
        { className: "input-container" },

        jsx("input", {
          className: "new-todo",
          id: "todo-input",
          type: "text",
          autofocus: true,
          placeholder: "What needs to be done?",
          onkeydown: (e) => addTodo(e),
        })
      )
    ),

    // MAIN
    jsx(
      "main",
      { className: "main" },

      jsx(
        "ul",
        { className: "todo-list" },

        ...todos.map((todo) => {
          return jsx(
            "li",
            { className: "todo-item", key: todo.key },
            jsx("input", {
              type: "checkbox",
              className: "toggle",
              onclick: () => checkedTodo(todo),
            }),

            editingKey === todo.key
              ? jsx("input", {
                type: "text",
                className: "edit-input",
                value: editText,
                oninput: (e) => setEditText(e.target.value),
                onkeydown: (e) => {
                  if (e.key === "Enter") finishEditing();
                },
                autofocus: true,
              })
              : jsx(
                "label",
                {
                  className: `${todo.completed ? "checked" : "nocheck"}`,
                  ondblclick: () => startEditing(todo),
                },
                todo.text
              ),
            jsx("button", {
              className: "destroy",
              onclick: () => deleteTodo(todo.key),
            })
          );
        })
      ),
      // TOGGLE ALL (conditional)
      todos.length > 0
        && jsx(
          "div",
          {
            className: "toggle-all-container",
          },
          jsx("input", {
            className: allChecked ? "toggle-all checkedAll" : "toggle-all",
            type: "checkbox",
            id: "toggle-all",
            "data-testid": "toggle-all",
            onclick: () => checkedAll(),
          }),
          jsx("label", {
            className: "toggle-all-label",
            for: "toggle-all",
          })
        ),
    ),
    // FOOTER (conditional)
    todos.length > 0
      && jsx(
        "footer",
        { className: "footer" },

        jsx("span", { className: "todo-count" }, itemLeft + " items left"),

        jsx(
          "ul",
          { className: "filters" },

          jsx(
            "li",
            null,
            jsx("a", { className: "selected", href: "#/" }, "All")
          ),

          jsx("li", null, jsx("a", { href: "#/active" }, "Active")),

          jsx("li", null, jsx("a", { href: "#/completed" }, "Completed"))
        ),

        jsx("button", { className: "clear-completed", onclick: clearCompleted }, "Clear completed")
      ),
  );
}

export const footer = jsx(
  "footer",
  { className: "info" },

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