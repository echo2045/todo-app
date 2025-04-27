const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');
const completedList = document.getElementById('completedList');

// Fetch and display active tasks
async function fetchTodos() {
    const response = await fetch('/todos');
    const todos = await response.json();
  
    todoList.innerHTML = '';
    const now = new Date();
  
    todos.forEach(todo => {
      const li = document.createElement('li');
      
      li.textContent = `${todo.task} (Due: ${new Date(todo.deadline).toLocaleString()})`;
  
      const deadlineDate = new Date(todo.deadline);
  
      if (now > deadlineDate && todo.done === false) {
        const lateLabel = document.createElement('span');
        lateLabel.textContent = 'Late';
        lateLabel.classList.add('late-label');
        li.appendChild(lateLabel);
      }
  
      // Checkbox to mark as done
      const markDone = document.createElement('input');
      markDone.type = 'checkbox';
      markDone.style.marginLeft = '15px';
      markDone.addEventListener('change', async () => {
        if (markDone.checked) {
          await fetch(`/todos/${todo.id}/done`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          });
          fetchTodos();
          fetchCompleted();
        }
      });
      li.appendChild(markDone);
  
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this task?')) {
          await fetch(`/todos/${todo.id}`, {
            method: 'DELETE'
          });
          fetchTodos();
          fetchCompleted();
        }
      });
      li.appendChild(deleteBtn);
  
      todoList.appendChild(li);
    });
  }
  

// Fetch and display completed tasks
async function fetchCompleted() {
    const response = await fetch('/todos/completed');
    const completedTodos = await response.json();
  
    completedList.innerHTML = '';
  
    completedTodos.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = `${todo.task} (Completed: ${new Date(todo.completed_at).toLocaleString()})`;
  
      const completedDate = new Date(todo.completed_at);
      const deadlineDate = new Date(todo.deadline);
  
      if (completedDate > deadlineDate) {
        const doneLateLabel = document.createElement('span');
        doneLateLabel.textContent = 'Done Late';
        doneLateLabel.classList.add('late-label');
        li.appendChild(doneLateLabel);
      }
  
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this completed task?')) {
          await fetch(`/todos/${todo.id}`, {
            method: 'DELETE'
          });
          fetchTodos();
          fetchCompleted();
        }
      });
      li.appendChild(deleteBtn);
  
      completedList.appendChild(li);
    });
  }
  

// Add a new todo
addTodoBtn.addEventListener('click', async () => {
  const task = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (task === '' || deadline === '') {
    alert('Please enter both task and deadline.');
    return;
  }

  await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, deadline })
  });

  taskInput.value = '';
  deadlineInput.value = '';

  fetchTodos();
  fetchCompleted();
});

// Initial fetch
fetchTodos();
fetchCompleted();
