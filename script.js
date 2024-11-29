const API_KEY = 'c227da62-a676-456f-8c56-6fc4d86aa0d9';
const API_URL = `https://js1-todo-api.vercel.app/api/todos?apikey=${API_KEY}`;

const todoList = document.getElementById('todoList');
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const errorMessage = document.getElementById('errorMessage');

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Kunde inte hämta todos');
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error(error);
    }
}

function renderTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${todo.title}</span>
            <div>
                <button onclick="toggleTodo('${todo._id}', ${todo.completed})">
                    ${todo.completed ? 'Markera som ej klar' : 'Markera som klar'}
                </button>
                <button onclick="deleteTodo('${todo._id}', ${todo.completed})">Ta bort</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTodoTitle = todoInput.value.trim();

    if (!newTodoTitle) {
        errorMessage.textContent = 'Todo-text kan inte vara tom!';
        return;
    }
    errorMessage.textContent = '';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTodoTitle }),
        });

        if (response.status === 201) {
            fetchTodos();
            todoInput.value = ''; 
        } else {
            throw new Error('Kunde inte lägga till todo');
        }
    } catch (error) {
        console.error(error);
    }
});

async function deleteTodo(id, isCompleted) {
    if (!isCompleted) {
        showModal('Du kan inte ta bort en todo som inte är klarmarkerad.');
        return;
    }

    try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=${API_KEY}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchTodos();
        } else {
            throw new Error('Kunde inte ta bort todo');
        }
    } catch (error) {
        console.error(error);
    }
}

async function toggleTodo(id, currentStatus) {
    try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=${API_KEY}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus }),
        });

        if (response.ok) {
            fetchTodos();
        } else {
            throw new Error('Kunde inte uppdatera todo');
        }
    } catch (error) {
        console.error(error);
    }
}

function showModal(message) {
    document.getElementById('modalText').innerText = message;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

fetchTodos();
