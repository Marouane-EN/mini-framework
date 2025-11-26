import { useState, jsx } from "../../framework/main.js";
import { store } from "./app.js";

export function active() {
  let todos = store.get().todos;
  let currentTodos = store.get().todos.filter((t) => t.completed === false);
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
    if (editText.trim().length < 2) return;
    const updated = todos.map((t) =>
      t.key === editingKey ? { ...t, text: editText } : t
    );
    setTodos(updated);

    setEditingKey(null);
    setEditText("");
  }

  return jsx(
    "div",
    null,
    jsx(
      "section",
      { className: "todoapp", id: "root" },

      // HEADER
      jsx(
        "header",
        { className: "header", "data-testid": "header" },

        jsx("h1", null, "todos"),

        jsx(
          "div",
          { className: "input-container" },

          jsx("input", {
            className: "new-todo",
            id: "todo-input",
            type: "text",
            "data-testid": "text-input",
            placeholder: "What needs to be done?",
            value: "",
            onkeydown: (e) => addTodo(e),
          }),
          jsx(
            "label",
            { className: "visually-hidden", for: "todo-input" },
            "New Todo Input"
          )
        )
      ),

      // MAIN
      jsx(
        "main",
        { className: "main", "data-testid": "main" },

        // checked All
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

            jsx(
              "label",
              {
                className: "toggle-all-label",
                for: "toggle-all",
              },
              "Toggle All Input"
            )
          ),
        jsx(
          "ul",
          { className: "todo-list", "data-testid": "todo-list" },

          ...currentTodos.map((todo) => {
            return jsx(
              "li",
              { className: todo.completed ? "completed" : "", key: todo.key },
              editingKey !== todo.key
                ? jsx(
                    "div",
                    { className: "view" },
                    todo.completed
                      ? jsx("input", {
                          type: "checkbox",
                          className: "toggle",
                          "data-testid": "todo-item-toggle",
                          checked: "checked",
                          onclick: () => checkedTodo(todo),
                        })
                      : jsx("input", {
                          type: "checkbox",
                          className: "toggle",
                          "data-testid": "todo-item-toggle",
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
                      "data-testid": "todo-item-button",
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
                        onkeydown: (e) => e.key === "Enter" && finishEditing(),
                        oninput: (e) => setEditText(e.target.value),
                        onblur: () => (
                          setTimeout(() => {
                            setEditText("");
                            setEditingKey(null);
                          }),
                          0
                        ),
                        autoFocus: true,
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
        )
      ),

      // TOGGLE ALL

      // FOOTER
      todos.length > 0 &&
        jsx(
          "footer",
          { className: "footer", "data-testid": "footer" },

          jsx("span", { className: "todo-count" }, itemLeft + " items left"),

          jsx(
            "ul",
            { className: "filters", "data-testid": "footer-navigation" },

            jsx("li", null, jsx("a", { href: "#/" }, "All")),

            jsx(
              "li",
              null,
              jsx("a", { className: "selected", href: "#/active" }, "Active")
            ),

            jsx("li", null, jsx("a", { href: "#/completed" }, "Completed"))
          ),

          jsx(
            "button",
            { className: "clear-completed", onclick: clearCompleted },
            "Clear completed"
          )
        )
    ),
    jsx(
      "footer",
      { className: "info" },
      jsx("p", null, "Double-click to edit a todo"),
      jsx("p", null, "Created by the ranniz family"),
      jsx(
        "p",
        null,
        "Part of ",
        jsx("a", { href: "https://github.com/RedaAz07" }, "Zone01")
      )
    )
  );
}
