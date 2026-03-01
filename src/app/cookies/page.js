'use client';

import { useState, useEffect } from 'react';

// ==================== COOKIE UTILITY FUNCTIONS ====================
// These functions handle all Cookie CRUD operations

// CREATE: Set a cookie
const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  // encodeURIComponent prevents special characters from breaking the cookie
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
};

// READ: Get a cookie value
const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  // Loop through all cookies to find the one we need
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      // Decode the value in case it has special characters
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

// UPDATE: Update a cookie (basically set it again with new value)
const updateCookie = (name, value, days = 7) => {
  setCookie(name, value, days);
};

// DELETE: Delete a cookie by setting its expiration to the past
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
};

// HELPER: Get all todos from cookie storage
const getAllTodos = () => {
  const todosJSON = getCookie('todos');
  return todosJSON ? JSON.parse(todosJSON) : [];
};

// HELPER: Save all todos to cookie
const saveTodos = (todos) => {
  setCookie('todos', JSON.stringify(todos));
};

// ==================== MAIN TODO COMPONENT ====================

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load todos from cookies on component mount
  useEffect(() => {
    const loadedTodos = getAllTodos();
    setTodos(loadedTodos);
  }, []);

  // CREATE: Add a new todo
  const addTodo = () => {
    if (input.trim() === '') return;

    const newTodo = {
      id: Date.now(), // Simple ID generation
      text: input,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setInput('');
  };

  // READ: Get a single todo (demonstration)
  const getTodoById = (id) => {
    return todos.find((todo) => todo.id === id);
  };

  // UPDATE: Toggle todo completion status
  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // UPDATE: Edit todo text
  const saveTodoEdit = (id) => {
    if (editText.trim() === '') return;
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: editText } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setEditId(null);
    setEditText('');
  };

  // DELETE: Remove a todo
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // DELETE: Clear all todos
  const clearAllTodos = () => {
    if (confirm('Are you sure you want to delete all todos?')) {
      setTodos([]);
      saveTodos([]);
      deleteCookie('todos'); // Optionally delete the cookie entirely
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (editId) {
        saveTodoEdit(editId);
      } else {
        addTodo();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Todo App with Cookies
          </h1>
          <p className="text-gray-600">
            All data is stored in your browser cookies - try refreshing the page!
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{todos.length}</div>
            <div className="text-gray-600 text-sm">Total Todos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {todos.filter((t) => t.completed).length}
            </div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {todos.filter((t) => !t.completed).length}
            </div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No todos yet. Add one to get started! 🎯</p>
            </div>
          ) : (
            <ul className="divide-y">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="p-6 hover:bg-gray-50 transition flex items-center gap-4"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 cursor-pointer"
                  />

                  {editId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => saveTodoEdit(todo.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p
                          className={`text-lg ${
                            todo.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-800'
                          }`}
                        >
                          {todo.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {todo.createdAt}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditId(todo.id);
                          setEditText(todo.text);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Clear All Button */}
        {todos.length > 0 && (
          <button
            onClick={clearAllTodos}
            className="w-full mt-8 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Clear All Todos
          </button>
        )}

        {/* Educational Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mt-8">
          <h3 className="font-bold text-blue-900 mb-4">How Cookies Work Here:</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>
              <strong>CREATE:</strong> `setCookie()` - Stores new data in cookies
            </li>
            <li>
              <strong>READ:</strong> `getCookie()` - Retrieves data from cookies
            </li>
            <li>
              <strong>UPDATE:</strong> Update the data array and save back to cookie
            </li>
            <li>
              <strong>DELETE:</strong> `deleteCookie()` - Removes data by expiring
              the cookie
            </li>
            <li className="mt-3 italic">
              Open DevTools (F12) → Application → Cookies to see your data stored!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
