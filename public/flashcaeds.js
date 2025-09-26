const todoCardsContainer = document.getElementById('todoCardsContainer');
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');

// Load todos from localStorage
function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(todo => {
    createTodoCard(todo.text, todo.completed);
  });
}

// Save todos to localStorage
function saveTodos() {
  const todos = [];
  document.querySelectorAll('.todo-card').forEach(card => {
    todos.push({
      text: card.querySelector('.todo-text').textContent,
      completed: card.classList.contains('completed')
    });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Create and add a todo card
function createTodoCard(text, completed = false) {
  const card = document.createElement('div');
  card.className = 'todo-card';
  if (completed) card.classList.add('completed');

  card.innerHTML = `
      <div class="todo-text">${text}</div>
      <button class="delete-btn" aria-label="Delete task"><i class="fas fa-trash"></i></button>
    `;

  // Toggle completed on text click
  card.querySelector('.todo-text').addEventListener('click', () => {
    card.classList.toggle('completed');
    saveTodos();
  });

  // Delete button event
  card.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation(); // prevent toggling completed when clicking delete
    card.remove();
    saveTodos();
  });

  todoCardsContainer.appendChild(card);
}

// Handle form submit
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    createTodoCard(text);
    saveTodos();
    todoInput.value = '';
    todoInput.focus();
  }
});

// Initialize
loadTodos();