

const
  todoControl = document.querySelector('.todo-control'),
  headerInput = document.querySelector('.header-input'),
  todoList = document.getElementById('todo'),
  todoCompleted = document.getElementById('completed');

class ToDo {
  constructor() {
    this.todoData = localStorage.todoData ? JSON.parse(localStorage.todoData) : [];
    this.items = [];
    this.loadTodo();
    if (this.todoData) {
      this.addEventListeners();
    }
  }
  checkSpaces(str) {
    return !str ? str : str.trim() !== '';
  }
  editTodoItem(event) {
    const
      li = event.target.parentElement.parentElement,
      input = document.createElement('input'),
      editForm = document.createElement('form'),
      textTodo = li.querySelector('.text-todo'),
      todoEditBtn = li.querySelector('.todo-edit'),
      todoSaveBtn = li.querySelector('.todo-save'),
      listener = event => this.saveTodoItem(event, listener);

    li.prepend(editForm);
    editForm.append(input);
    input.value = textTodo.textContent;
    textTodo.textContent = '';
    todoEditBtn.style.display = 'none';
    todoSaveBtn.style.display = 'block';
    input.focus();
    input.addEventListener('blur', listener);
    editForm.addEventListener('submit', listener);
  }
  saveTodoItem(event, listener) {
    const
      li = event.currentTarget.tagName !== 'FORM' ?
        event.currentTarget.parentElement.parentElement :
        event.currentTarget.parentElement,
      input = li.querySelector('input'),
      editForm = li.querySelector('form'),
      textTodo = li.querySelector('.text-todo'),
      todoEditBtn = li.querySelector('.todo-edit'),
      todoSaveBtn = li.querySelector('.todo-save'),
      index = this.items.indexOf(li);

    if (event.type === 'submit') {
      input.removeEventListener('blur', listener);
    }
    event.preventDefault();
    this.todoData[index].value = this.checkSpaces(input.value) ? input.value : this.todoData[index].value;
    textTodo.textContent = this.todoData[index].value;
    localStorage.todoData  = JSON.stringify(this.todoData);
    editForm.remove();
    todoSaveBtn.style.display = '';
    todoEditBtn.style.display = '';
  }
  getNewTodoItem(item) {
    const li = document.createElement('li');

    li.classList.add('todo-item');
    li.innerHTML =
    `
      <span class="text-todo">${item.value}</span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-save"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `;
    this.items.push(li);
    return li;
  }
  stateToggleTodoItem(event) {
    const
      li = event.currentTarget.parentElement.parentElement,
      item = this.todoData[this.items.indexOf(li)];

    item.completed = !item.completed;
    localStorage.todoData  = JSON.stringify(this.todoData);
    //
    item.completed ? todoCompleted.prepend(li) : todoList.append(li);
  }
  removeTodoItem(event) {
    const
      li = event.target.parentElement.parentElement,
      index = this.items.indexOf(li);

    this.todoData.splice(index, 1);
    this.items.splice(index, 1);
    localStorage.todoData  = JSON.stringify(this.todoData);
    //
    li.remove();
  }
  addTodoItem(item) {
    const li = this.getNewTodoItem(item);

    item.completed ? todoCompleted.append(li) : todoList.append(li);
    li.querySelector('.todo-complete').addEventListener('click', event => this.stateToggleTodoItem(event));
    li.querySelector('.todo-remove').addEventListener('click', event => this.removeTodoItem(event));
    li.querySelector('.todo-edit').addEventListener('click', event => this.editTodoItem(event));
  }
  addEventListeners() {
    todoControl.addEventListener('submit', event => {
      event.preventDefault();
      if (this.checkSpaces(headerInput.value)) {
        this.todoData.push({
          value: headerInput.value.trim(),
          completed: false
        });
        localStorage.todoData  = JSON.stringify(this.todoData);
        headerInput.value = '';
        this.addTodoItem(this.todoData[this.todoData.length - 1]);
      }
    });
  }
  loadTodo() {
    const todoData = localStorage.todoData ? JSON.parse(localStorage.todoData) : [];

    todoData.forEach(item => {
      this.addTodoItem(item);
    });
  }
}

new ToDo();
