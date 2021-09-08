

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
  makeEaseOut(timing) {
    return timeFraction => 1 - timing(1 - timeFraction);
  }
  timing(timeFraction) {
    return Math.pow(timeFraction, 2) * (1.75 * timeFraction - 0.75);
  }
  animate({ duration, draw, timing }) {
    const
      start = performance.now(),
      requestID = requestAnimationFrame((function animate(time) {
        const
          timeFraction = (time - start) / duration,
          progress = timing(timeFraction > 1 ? 1 : timeFraction);
        draw.call(this, progress);

        if (timeFraction < 1) {
          return requestAnimationFrame(animate.bind(this));
        } else {
          cancelAnimationFrame(requestID);
        }
      }).bind(this));
  }
  removeToDoItemAnimationToRight(item, action, progress) {
    item.style.transform = ` translate(${progress * 105 + '%'}, 0)`;
    if (progress === 1) {
      action();
    }
  }
  addToDoItemAnimationFromLeft(item, progress) {
    item.style.transform = ` translate(${-105 + (progress * 105) + '%'}, 0)`;
    if (progress === 1) {
      item.style.transform = '';
    }
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
    this.animate({
      duration: 1000,
      timing: this.timing,
      draw: this.removeToDoItemAnimationToRight.bind(this, li,
        item.completed ? () => todoCompleted.prepend(li) : () =>  todoList.append(li))
    });
    setTimeout(this.animate, 1000, {
      duration: 1000,
      timing: this.makeEaseOut(this.timing),
      draw: this.addToDoItemAnimationFromLeft.bind(this, li)
    });
  }
  removeTodoItem(event) {
    const
      li = event.target.parentElement.parentElement,
      index = this.items.indexOf(li);

    this.todoData.splice(index, 1);
    this.items.splice(index, 1);
    localStorage.todoData  = JSON.stringify(this.todoData);
    //
    this.animate({
      duration: 1000,
      timing: this.timing,
      draw: this.removeToDoItemAnimationToRight.bind(this, li, () => li.remove())
    });
  }
  addTodoItem(item, animated) {
    const li = this.getNewTodoItem(item);

    this.animate({
      duration: animated ? 1000 : 0,
      timing: this.makeEaseOut(this.timing),
      draw: this.addToDoItemAnimationFromLeft.bind(this, li)
    });
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
        this.addTodoItem(this.todoData[this.todoData.length - 1], true);
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
