// Frontend: React App
// File: App.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5050/todos')
            .then(response => setTodos(response.data));
    }, []);

    const addTodo = () => {
        if (text) {
            axios.post('http://localhost:5050/todos', { text })
                .then(response => setTodos([...todos, response.data]));
            setText('');
        }
    };

    const deleteTodo = (id) => {
        axios.delete(`http://localhost:5050/todos/${id}`)
            .then(() => setTodos(todos.filter(todo => todo._id !== id)));
    };

    return (
        <div className="App">
            <div className="App-header">
                <h1 className="App-title">Todo App</h1>
                <div className="todo-form">
                    <input 
                        className="todo-input" 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        placeholder="Enter a task..."
                    />
                    <button className="todo-button" onClick={addTodo}>Add</button>
                </div>
                <ul className="todo-list">
                    {todos.map(todo => (
                        <li key={todo._id} className="todo-item">
                            {todo.text}
                            <button className="delete-button" onClick={() => deleteTodo(todo._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
