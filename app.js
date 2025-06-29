let user = {};
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function startApp() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const theme = document.getElementById('theme').value;

  if (!name || !email) return alert("Please enter all fields!");

  user = { name, email, theme };
  document.body.className = theme;
  document.getElementById('userName').textContent = name;
  document.getElementById('userEmail').textContent = email;

  document.getElementById('personalInfo').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  renderTasks();
}

function logout() {
  localStorage.removeItem('tasks');
  location.reload();
}

function addTask() {
  const title = document.getElementById('taskInput').value.trim();
  const desc = document.getElementById('descInput').value.trim();
  const due = document.getElementById('dueInput').value;
  const priority = document.getElementById('priorityInput').value;

  if (!title) return alert("Enter a task!");

  tasks.push({
    id: Date.now(),
    title, desc, due, priority,
    completed: false,
    created: new Date().toISOString()
  });

  saveTasks();
  renderTasks();
  document.getElementById('taskInput').value = '';
  document.getElementById('descInput').value = '';
  document.getElementById('dueInput').value = '';
  document.getElementById('priorityInput').value = 'medium';
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  const now = new Date();

  const filtered = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    if (filter === 'overdue') return !task.completed && task.due && new Date(task.due) < now;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `${task.priority} ${task.completed ? 'completed' : ''}`;
    if (!task.completed && task.due && new Date(task.due) < now) {
      li.classList.add('overdue');
    }

    li.innerHTML = `
      <strong>${task.title}</strong>
      ${task.desc ? `<div>${task.desc}</div>` : ''}
      <div class="meta">
        ${task.due ? `Due: ${task.due}` : ''} | Created: ${new Date(task.created).toLocaleString()}
      </div>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const overdue = tasks.filter(t => !t.completed && t.due && new Date(t.due) < now).length;

  document.getElementById('taskStats').textContent =
    `Total: ${total} | Completed: ${completed} | Overdue: ${overdue}`;
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks(status) {
  filter = status;
  document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.filters button[onclick="filterTasks('${status}')"]`).classList.add('active');
  renderTasks();
}
