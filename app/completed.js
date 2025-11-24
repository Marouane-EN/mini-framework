import { useState, jsx, addRoute, Store } from "../framework/main.js";
import { store } from "./app.js";
// GLOBAL STORE HOLDS TODOS

export function completed() {
  // ❌ OLD LOCAL STATE (REMOVED)
  // const [todos, setTodos] = useState([]);

  // ✔ todos now come from GLOBAL STORE
  let todos = store.get().todos;
  todos = todos.filter((t) => t.completed === true);
  // local UI states (still fine to keep)
  const [editingKey, setEditingKey] = useState(null);
  const [editText, setEditText] = useState("");

  // ✔ helper to update global todos
  function setTodos(newList) {
    store.set({ todos: newList }); // global update + re-render
  }

  const allChecked = todos.every((t) => t.completed === true);

  const itemLeft = todos.filter((todo) => !todo.completed).length;

  // -------------------------
  // TODO LOGIC
  // -------------------------

  function checkedTodo(todo) {
    // ❌ OLD (local state)
    /*
        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t.key === todo.key ? { ...t, completed: !t.completed } : t
          )
        );
        */

    // ✔ NEW (global state)
    const updated = todos.map((t) =>
      t.key === todo.key ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
  }

  function checkedAll() {
    const arr = todos.map((t) => ({ ...t, completed: !allChecked }));
    setTodos(arr);
  }

  function addTodo(e) {
    if (e.key === "Enter" && e.target.value.trim().length >= 2) {
      // ❌ OLD
      /*
          setTodos((prevTodos) => [
            ...prevTodos,
            {
              text: e.target.value,
              completed: false,
              key: crypto.randomUUID(),
            },
          ]);
          */

      // ✔ NEW
      const updated = [
        ...todos,
        {
          text: e.target.value,
          completed: false,
          key: crypto.randomUUID(),
        },
      ];
      setTodos(updated);

      e.target.value = "";
    }
  }

  function deleteTodo(key) {
    // ❌ OLD
    // const updated = todos.filter((todo) => todo.key != key);
    // setTodos(updated);

    // ✔ NEW
    setTodos(todos.filter((todo) => todo.key !== key));
  }

  function clearCompleted() {
    setTodos(todos.filter((todo) => !todo.completed));
  }

  function startEditing(todo) {
    setEditingKey(todo.key);
    setEditText(todo.text);
  }

  function finishEditing() {
    // ❌ OLD
    /*
        setTodos((prev) =>
          prev.map((t) => (t.key === editingKey ? { ...t, text: editText } : t))
        );
        */

    // ✔ NEW
    const updated = todos.map((t) =>
      t.key === editingKey ? { ...t, text: editText } : t
    );
    setTodos(updated);

    setEditingKey(null);
    setEditText("");
  }

  // -------------------------
  //  RENDER
  // -------------------------

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
                  onkeydown: (e) => e.key === "Enter" && finishEditing(),
                  autofocus: true,
                })
              : jsx(
                  "label",
                  {
                    className: todo.completed ? "checked" : "nocheck",
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

      // TOGGLE ALL
      todos.length > 0 &&
        jsx(
          "div",
          { className: "toggle-all-container" },

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
        )
    ),

    // FOOTER
    jsx(
      "footer",
      { className: "footer" },

      jsx("span", { className: "todo-count" }, itemLeft + " items left"),

      jsx(
        "ul",
        { className: "filters" },

        jsx("li", null, jsx("a", { className: "selected", href: "#/" }, "All")),

        jsx("li", null, jsx("a", { href: "#/active" }, "Active")),

        jsx("li", null, jsx("a", { href: "#/completed" }, "Completed"))
      ),

      jsx(
        "button",
        { className: "clear-completed", onclick: clearCompleted },
        "Clear completed"
      )
    )
  );
}
