class ToDo {
  constructor(form, input, toDoList, toDoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.toDoList = document.querySelector(toDoList);
    this.toDoCompleted = document.querySelector(toDoCompleted);
    this.toDoData = new Map(JSON.parse(localStorage.getItem('toDoData')));

    this.init();
  }
  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  checkInput(error) {
    return error ? (() => {
      this.input.setAttribute(`placeholder`, `Какие планы?`);
      this.input.style.setProperty(`--placeholder-color`, `rgba(255, 255, 255, 0.75)`);
      return true;
    })() : (() => {
      this.input.setAttribute(`placeholder`, `Вы забыли ввести текст?!`);
      this.input.style.setProperty(`--placeholder-color`, `tomato`);
      return false;
    })();
  }
  addToStorage() {
    localStorage.setItem('toDoData', JSON.stringify([...this.toDoData]));
  }
  createToDoItem(item) {
    const li = document.createElement('li');

    li.classList.add('todo-item');
    li.key = item.key;
    li.innerHTML =
    `
      <span class="text-todo">${item.value}</span>
      <div class="todo-buttons">
        <!-- <button class="todo-edit"></button> -->
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `;
    return li;
  }
  addToDoItem(item) {
    const li = this.createToDoItem(item);

    item.completed ? this.toDoCompleted.append(li) : this.toDoList.append(li);
  }
  loadToDoData() {
    this.toDoData.forEach(item => this.addToDoItem(item));
  }
  addToDo(event) {
    event.preventDefault();
    if (this.checkInput(this.input.value.trim())) {
      const newToDoItem = {
        value: this.input.value.trim(),
        completed: false,
        key: this.generateKey()
      };
      this.toDoData.set(newToDoItem.key, newToDoItem);
      this.addToDoItem(newToDoItem);
      this.addToStorage();
    }
    this.input.value = '';
  }
  handler(event) {
    switch (event.target.className) {
    case 'todo-edit': this.editToDo(event.target.parentElement.parentElement.key); break;
    case 'todo-remove': this.removeToDo(); break;
    case 'todo-complete': this.toggleStateToDo(); break;
    }
  }
  editToDo(key) {
    console.log('Редактировать:', key);
  }
  removeToDo() {
    const li = event.target.parentElement.parentElement;

    this.toDoData.delete(li.key);
    this.addToStorage();
    li.remove();
  }
  toggleStateToDo() {
    const
      li = event.target.parentElement.parentElement,
      item = this.toDoData.get(li.key);

    item.completed = !item.completed;
    this.toDoData.set(li.key, item);
    this.addToStorage();
    item.completed ? this.toDoCompleted.prepend(li) : this.toDoList.append(li);
  }
  init() {
    this.loadToDoData();
    this.toDoList.parentElement.addEventListener('click', this.handler.bind(this));
    this.form.addEventListener('submit', this.addToDo.bind(this));
  }
}

new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
