class ToDo {
  constructor(form, input, toDoList, toDoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.toDoList = document.querySelector(toDoList);
    this.toDoCompleted = document.querySelector(toDoCompleted);
    this.toDoData = new Map(JSON.parse(localStorage.getItem('toDoData')));

    this.init();
  }
  setCaret(elem) {
    const
      range = document.createRange(),
      sel = window.getSelection();

    if (elem && elem.textContent && elem.getAttribute('contenteditable')) {
      range.setStart(elem.childNodes[0], elem.textContent.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
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
  drawRemovingToDoItem(item, action, progress) {
    item.style.transform = ` translate(${progress * 105 + '%'}, 0)`;
    if (progress === 1) {
      action();
    }
  }
  animateRemovingToDoItem(item, action) {
    this.animate({
      duration: 1000,
      timing: this.timing,
      draw: this.drawRemovingToDoItem.bind(this, item, action)
    });
  }
  drawAddingToDoItem(item, progress) {
    item.style.transform = ` translate(${-105 + (progress * 105) + '%'}, 0)`;
    if (progress === 1) {
      item.style.transform = '';
    }
  }
  animateAddingToDoItem(item) {
    this.animate({
      duration: 1000,
      timing: this.makeEaseOut(this.timing),
      draw: this.drawAddingToDoItem.bind(this, item)
    });
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
        <button class="todo-edit"></button>
        <button class="todo-save"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `;
    return li;
  }
  addToDoItem(item, animated) {
    const li = this.createToDoItem(item);

    item.completed ? this.toDoCompleted.append(li) : this.toDoList.append(li);
    // Анимация
    animated ? this.animateAddingToDoItem(li) : null;
  }
  loadToDoData() {
    this.toDoData.forEach(item => this.addToDoItem(item));
  }
  saveToDoItem(event) {
    const
      li = event.target.parentElement,
      item = this.toDoData.get(li.key),
      text = li.firstElementChild;

    li.querySelector('.todo-edit').style.display = 'block';
    li.querySelector('.todo-save').style.display = 'none';
    event.preventDefault();
    text.textContent.trim() ?
      (() => {
        item.value = text.textContent.trim();
        this.toDoData.set(li.key, item);
        this.addToStorage();
      })() : text.textContent = item.value;
    text.removeAttribute(`contenteditable`);
    text.style.cssText = '';
  }
  editingToDoItem(event) {
    event.key === "Enter" ? this.saveToDoItem(event) : null;
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
      this.addToDoItem(newToDoItem, true);
      this.addToStorage();
    }
    this.input.value = '';
  }
  handler(event) {
    if (event.type === 'click') {
      switch (event.target.className) {
      case 'todo-edit': this.editToDo(event); break;
      case 'todo-remove': this.removeToDo(event, true); break;
      case 'todo-complete': this.toggleStateToDo(event, true); break;
      }
    }
    if (event.target.className === 'text-todo') {
      switch (event.type) {
      case 'focusout': this.saveToDoItem(event); break;
      case 'keydown': this.editingToDoItem(event); break;
      }
    }
  }
  editToDo(event) {
    const
      li = event.target.parentElement.parentElement,
      text = li.firstElementChild;

    event.target.style.display = 'none';
    li.querySelector('.todo-save').style.display = 'block';
    text.setAttribute(`contenteditable`, true);
    text.style.cssText = `
      outline: none;
      font-size: 16px;
      color: tomato;
    `;
    text.focus();
    this.setCaret(text);
  }
  removeToDo(event, animated) {
    const li = event.target.parentElement.parentElement;

    this.toDoData.delete(li.key);
    this.addToStorage();
    // Анимация
    animated ? this.animateRemovingToDoItem(li, () => li.remove()) : li.remove();
  }
  toggleStateToDo(event, animated) {
    const
      li = event.target.parentElement.parentElement,
      item = this.toDoData.get(li.key);

    item.completed = !item.completed;
    this.toDoData.set(li.key, item);
    this.addToStorage();
    // Анимация
    animated ?
      this.animateRemovingToDoItem(li, item.completed ? () => {
        this.toDoCompleted.prepend(li);
        this.animateAddingToDoItem(li);
      } : () =>  {
        this.toDoList.append(li);
        this.animateAddingToDoItem(li);
      }) :
      item.completed ? this.toDoCompleted.prepend(li) : this.toDoList.append(li);
  }
  init() {
    this.loadToDoData();
    this.toDoList.parentElement.addEventListener('click', this.handler.bind(this));
    this.toDoList.parentElement.addEventListener('focusout', this.handler.bind(this));
    this.toDoList.parentElement.addEventListener('keydown', this.handler.bind(this));
    this.form.addEventListener('submit', this.addToDo.bind(this));
  }
}

new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
