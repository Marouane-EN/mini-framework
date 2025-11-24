import { useState, jsx } from "../../framework/main.js";
import { store } from "./app.js";
// GLOBAL STORE HOLDS TODOS

export function completed() {
  let todos = store.get().todos;
  let currentTodos = store.get().todos.filter((t) => t.completed === true);
  const [editingKey, setEditingKey] = useState(null);
  const [editText, setEditText] = useState("");

  function setTodos(newList) {
    store.set({ todos: newList });
  }

  const allChecked = currentTodos.every((t) => t.completed === true);

  const itemLeft = todos.filter((todo) => !todo.completed).length;

  function checkedTodo(todo) {
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
      const updated = [
        ...todos,
        { text: e.target.value, completed: false, key: crypto.randomUUID() },
      ];
      setTodos(updated); // safe, full array
      e.target.value = "";
    }
  }

  function deleteTodo(key) {
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
    const updated = todos.map((t) =>
      t.key === editingKey ? { ...t, text: editText } : t
    );
    setTodos(updated);

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

        ...currentTodos.map((todo) => {
          return jsx(
            "li",
            { className: "todo-item", key: todo.key },

            editingKey !== todo.key
              ? jsx(
                  "div",
                  { className: "view" },
                  jsx("input", {
                    type: "checkbox",
                    className: "toggle",
                    onclick: () => checkedTodo(todo),
                  }),
                  jsx(
                    "label",
                    {
                      "data-testid": "todo-item-label",
                      ondblclick: () => startEditing(todo),
                    },
                    todo.text
                  ),

                  jsx("button", {
                    className: "destroy",
                    onclick: () => deleteTodo(todo.key),
                  })
                )
              : jsx(
                  "div",
                  { className: "view" },
                  jsx(
                    "div",
                    { className: "input-container" },
                    jsx("input", {
                      type: "text",
                      className: "new-todo",
                      id: "todo-input",
                      "data-testid": "text-input",
                      value: editText,
                      oninput: (e) => setEditText(e.target.value),
                      onkeydown: (e) => e.key === "Enter" && finishEditing(),
                    }),
                    jsx(
                      "label",
                      {
                        className: "visually-hidden",
                        for: "todo-input",
                      },
                      todo.text
                    )
                  )
                )
          );
        })
      ),

      // TOGGLE ALL
      currentTodos.length > 0 &&
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
    todos.length > 0 &&
      // FOOTER
      jsx(
        "footer",
        { className: "footer" },

        jsx("span", { className: "todo-count" }, itemLeft + " items left"),

        jsx(
          "ul",
          { className: "filters" },

          jsx("li", null, jsx("a", { href: "#/" }, "All")),

          jsx("li", null, jsx("a", { href: "#/active" }, "Active")),

          jsx(
            "li",
            null,
            jsx(
              "a",
              { className: "selected", href: "#/completed" },
              "Completed"
            )
          )
        ),

        jsx(
          "button",
          { className: "clear-completed", onclick: clearCompleted },
          "Clear completed"
        )
      )
  );
}
