'use strict';

const
  todoControl = document.querySelector('.todo-control'),
  headerInput = document.querySelector('.header-input'),
  todoList = document.getElementById('todo'),
  todoCompleted = document.getElementById('completed'),
  checkSpaces = function(str) {
    return !str ? str : str.trim() !== '';
  },
  addTodo = function () {
    const todoData = localStorage.todoData ? JSON.parse(localStorage.todoData) : [];
    
    todoList.textContent = '';
    todoCompleted.textContent = '';
    todoData.forEach(function(item){
      const li = document.createElement('li');

      li.classList.add('todo-item');
      li.innerHTML = 
      `
        <span class="text-todo">${item.value}</span>
        <div class="todo-buttons">
          <button class="todo-remove"></button>
          <button class="todo-complete"></button>
        </div>
      `;
      if (item.completed) {
        todoCompleted.prepend(li);
      } else {
        todoList.append(li);
      }
      const btnTodoCompleted = li.querySelector('.todo-complete').addEventListener('click', function() {
        item.completed = !item.completed;
        localStorage.todoData  = JSON.stringify(todoData);
        addTodo();
      });
      const btnTodoRemove = li.querySelector('.todo-remove').addEventListener('click', function() {
        todoData.splice(todoData.indexOf(item), 1);
        localStorage.todoData  = JSON.stringify(todoData);
        addTodo();
      });
    });
  };

todoControl.addEventListener('submit', function (event) {
  event.preventDefault();
  if (checkSpaces(headerInput.value)) {
    const todoData = localStorage.todoData ? JSON.parse(localStorage.todoData) : [];

    todoData.push({
      value: headerInput.value.trim(),
      completed: false
    });
    localStorage.todoData  = JSON.stringify(todoData);
    headerInput.value = '';
    addTodo();
  }
});

addTodo();