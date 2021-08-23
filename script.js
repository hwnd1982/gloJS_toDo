'use strict';

const
  headerInput = document.querySelector('.header-input'),
  headerButton = document.getElementById('add'),
  toDoList = document.getElementById('todo'),
  toDoCompleted = document.getElementById('completed'),
  newToDoItem = toDoList.querySelector('.todo-item').cloneNode(true),
  checkSpaces = function(str) {
    return !str ? str : str.trim() !== '';
  },
  isNumber = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
  childOf = (childElem, className) => {
    if (childElem === document.documentElement || childElem === document.body) {return false;}
    while(!childElem.classList.contains(className)) {
      childElem = childElem.parentNode; 
      if (childElem === document.body) {return false;}
    }
    return childElem; 
  },
  toggleStates = function (event) {
    let selectedTask = childOf(event.target, 'todo-item');

    if (selectedTask) {
      if (selectedTask.parentNode.classList.contains('todo-list')) {
        toDoCompleted.prepend(selectedTask);
      } else {
        toDoList.prepend(selectedTask);
      }
    }
  },
  deleteTask = function (event) {
    let selectedTask = childOf(event.target, 'todo-item');
    
    if (selectedTask) {
      selectedTask.remove();
    }
  },
  addNewTask = function (event) {
    event.preventDefault();
    if (checkSpaces(headerInput.value) && !isNumber(headerInput.value)) {
      let newTask = newToDoItem.cloneNode(true);
      
      newTask.querySelector('.text-todo').textContent = headerInput.value.trim();
      toDoList.prepend(newTask);
      newTask.querySelector('.todo-complete').addEventListener('click', toggleStates);
      newTask.querySelector('.todo-remove').addEventListener('click', deleteTask);
    }
    headerInput.value = '';
  };

  headerButton.addEventListener('click', addNewTask);
  document.querySelectorAll('.todo-item').forEach(function (item) {
    item.querySelector('.todo-complete').addEventListener('click', toggleStates);
    item.querySelector('.todo-remove').addEventListener('click', deleteTask);
  });