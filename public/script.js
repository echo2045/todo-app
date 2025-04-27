const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');
const completedList = document.getElementById('completedList');

// Snooze modal elements
const snoozeModal = document.getElementById('snoozeModal');
const closeModal = document.getElementById('closeModal');
const modalTaskInfo = document.getElementById('modalTaskInfo');
const newDeadlineInput = document.getElementById('newDeadlineInput');
const confirmSnoozeBtn = document.getElementById('confirmSnoozeBtn');

async function fetchTodos() {
  const response = await fetch('/todos');
  const todos = await response.json();

  todoList.innerHTML = '';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  todos.forEach(todo => {
    const deadlineDate = new Date(todo.deadline);
    const deadlineDay = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());

    if (deadlineDay <= today) {
      const li = document.createElement('li');
      li.textContent = `${todo.task} (Due: ${deadlineDate.toLocaleString()})`;

      if (now > deadlineDate && todo.done === false) {
        const lateLabel = document.createElement('span');
        lateLabel.textContent = 'Late';
        lateLabel.classList.add('late-label');
        li.appendChild(lateLabel);
      }

      // Checkbox
      const markDone = document.createElement('input');
      markDone.type = 'checkbox';
      markDone.style.marginLeft = '10px';
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

      // Snooze button
      const snoozeBtn = document.createElement('button');
      snoozeBtn.textContent = 'Snooze';
      snoozeBtn.classList.add('snooze-btn');
      snoozeBtn.addEventListener('click', () => {
        modalTaskInfo.textContent = `Task: ${todo.task}\nCurrent Due: ${new Date(todo.deadline).toLocaleString()}`;
        newDeadlineInput.value = todo.deadline.slice(0, 16);
        snoozeModal.style.display = 'block';

        confirmSnoozeBtn.onclick = async () => {
          const newDeadline = newDeadlineInput.value;
          if (newDeadline) {
            await fetch(`/todos/${todo.id}/snooze`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ newDeadline })
            });
            snoozeModal.style.display = 'none';
            fetchTodos();
            fetchCompleted();
          }
        };
      });
      li.appendChild(snoozeBtn);

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this task?')) {
          await fetch(`/todos/${todo.id}`, { method: 'DELETE' });
          fetchTodos();
          fetchCompleted();
        }
      });
      li.appendChild(deleteBtn);

      todoList.appendChild(li);
    }
  });
}

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

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this completed task?')) {
        await fetch(`/todos/${todo.id}`, { method: 'DELETE' });
        fetchTodos();
        fetchCompleted();
      }
    });
    li.appendChild(deleteBtn);

    completedList.appendChild(li);
  });
}

// Close modal actions
closeModal.addEventListener('click', () => {
  snoozeModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === snoozeModal) {
    snoozeModal.style.display = 'none';
  }
});

// Add todo
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

// Initial load
fetchTodos();
fetchCompleted();
