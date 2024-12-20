import React, { useState } from 'react';
import './TodoApp.css';

function App() {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-header">Todo App</h1>
      
      <form className="todo-form" onSubmit={handleSubmit}>
        <input 
          type="text"
          className="todo-input"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Cosa devi fare?"
        />
        <button type="submit" className="todo-button">Aggiungi</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
              {todo.text}
            </span>
            <button 
              className="delete-button"
              onClick={() => deleteTodo(todo.id)}
            >
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;