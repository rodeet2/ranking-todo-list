
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
  if (input.value.trim() === '') return;

  const li = createTodoItem(input.value.trim());
  list.appendChild(li);
  saveTodo(input.value.trim());
  input.value = '';
});

function createTodoItem(text) {
  const li = document.createElement('li');
  li.setAttribute('draggable', 'true');
  li.innerHTML = `
    <span>${text}</span>
  <button class="delete-btn" title="Delete">🗑️</button>
  `;

  // Drag events
  li.addEventListener('dragstart', () => li.classList.add('dragging'));
  li.addEventListener('dragend', () => li.classList.remove('dragging'));

  // Delete button
li.querySelector('.delete-btn').addEventListener('click', () => {
  deleteTodo(li.querySelector('span').textContent);
  li.remove();
});

  return li;
}

// Drag and reorder logic
list.addEventListener('dragover', (e) => {
  e.preventDefault();
  const dragging = document.querySelector('.dragging');
  const afterElement = getDragAfterElement(list, e.clientY);
  if (!afterElement) {
    list.appendChild(dragging);
  } else {
    list.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
 localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
}

  const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
  savedTodos.forEach(text => {
    const li = createTodoItem(text);
    list.appendChild(li);
  });
});


document.getElementById('todo-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    document.getElementById('add-btn').click(); 
  }
});

function saveTodo(task) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(task);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function deleteTodo(taskToRemove) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const updated = todos.filter(task => task !== taskToRemove);
  localStorage.setItem('todos', JSON.stringify(updated));
}

