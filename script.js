const
  headerInput = document.querySelector('.header-input'),
  headerButton = document.getElementById('add'),
  toDoList = document.getElementById('todo'),
  toDoCompleted = document.getElementById('completed'),
  // нет смысла чистить text-todo при добавлении нового 
  // элемент всеравно будет присваевание его значения из инпута.
  newToDoItem = toDoList.querySelector('.todo-item').cloneNode(true);
  
  console.log(newToDoItem);