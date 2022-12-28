let todoData = [];  
let todoId = 3
 



const renderTodos = () => {
  localStorage.setItem('data', JSON.stringify(todoData))
  analyzeFooter()
  document.querySelector('.container').textContent = ''
  todoData.forEach((todo) => {
    if(todo.onEdit){
      changeTodoText(todo)
    }else{
      createTodo(todo)
    }
  });
}


const createTodo = (todo) => {
  const div = document.createElement('div')
  div.className = 'todo'
  
  const leftDiv = document.createElement('div')
  leftDiv.className = 'left-div'
  
  const rightDiv = document.createElement('div')
  rightDiv.className = 'right-div'

  const inputCheck = document.createElement('input')
  inputCheck.checked = todo.completed
  inputCheck.addEventListener('click', () => {
    TodoCompletedStatus(todo.id)
  })
  inputCheck.setAttribute('type', 'checkbox')
 
  const text = document.createElement('span')
  if(todo.completed){
    text.classList.add('text-completed')
  }else{
    text.classList.remove('text-completed')
  }
  text.textContent = todo.title

  const changeBtn = document.createElement('button')
  changeBtn.className = 'change-btn'
  changeBtn.onclick = () => {
    TodoOnEditStatus(todo.id)
  }
  const penImage = document.createElement('i')
  penImage.classList.add('fa-solid', 'fa-pen')
  changeBtn.append(penImage)

  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'delete-btn'
  deleteBtn.onclick = () => {
    deleteTodo(todo.id)
  }
  const trashImage = document.createElement('i')
  trashImage.classList.add("fa-solid", "fa-trash")
  deleteBtn.append(trashImage)

  leftDiv.append(inputCheck, text)
  rightDiv.append(changeBtn, deleteBtn)
  div.append(leftDiv, rightDiv)
  document.querySelector('.container').append(div)
}

const changeTodoText = (todo) => {
  let inputText = todo.title

  const div = document.createElement('div')
  div.className = 'todo-input'

  const input = document.createElement('input')
  input.setAttribute('value', todo.title)
  input.setAttribute('type', 'input')

  const applyBtn = document.createElement('button')
  applyBtn.className = 'apply-btn'
  applyBtn.onclick = (event) => {
    applyChangeText(input.value, todo.id)
  }
  const checkImage = document.createElement('i')
  checkImage.classList.add("fa-solid", "fa-check")
  applyBtn.append(checkImage)


  const cancelBtn = document.createElement('button')
  cancelBtn.className = 'cancel-btn'
  cancelBtn.onclick = (event) => {
    applyChangeText(inputText, todo.id)
  }
  const xmarkImage = document.createElement('i')
  xmarkImage.classList.add("fa-solid", "fa-xmark")
  cancelBtn.append(xmarkImage)
 
  div.append(input, cancelBtn, applyBtn)
  document.querySelector('.container').append(div)
}

const addTodo = (text) => {
  todoId++
  const newTodo = {
    userId: 1,
    id: todoId,
    title: text,
    completed: false,
  }
  todoData.push(newTodo)
}

const deleteTodo = (id) =>{
  const idx = todoData.findIndex((todo) => todo.id === id);
  todoData = [
    ...todoData.slice(0, idx),
    ...todoData.slice(idx + 1),
  ];
  renderTodos()
}

const TodoCompletedStatus = (id) => {
  const changingTodo = todoData.find((todo) => todo.id === id)
  changingTodo.completed = !changingTodo.completed
  const idx = todoData.findIndex((todo) => todo.id === id);
  todoData = [
    ...todoData.slice(0, idx),
    changingTodo,
    ...todoData.slice(idx + 1),
  ]
  renderTodos()
  console.log(changingTodo);
}

const TodoOnEditStatus = (id) => {
  const changingTodo = todoData.find((todo) => todo.id === id)
  changingTodo.onEdit = !changingTodo.onEdit
  const idx = todoData.findIndex((todo) => todo.id === id);
  todoData = [
    ...todoData.slice(0, idx),
    changingTodo,
    ...todoData.slice(idx + 1),
  ]
  renderTodos()
  console.log(changingTodo);
}

const applyChangeText = (text, id) => {
  const changingTodo = todoData.find((todo) => todo.id === id)
  changingTodo.title = text
  changingTodo.onEdit = false
  const idx = todoData.findIndex((todo) => todo.id === id);
  todoData = [
    ...todoData.slice(0, idx),
    changingTodo,
    ...todoData.slice(idx + 1),
  ]
  renderTodos()
  console.log(changingTodo);
}

document.querySelector('.add-btn').addEventListener('click', (e) => {
    addTodo(document.querySelector('.add-input').value)
    renderTodos()
    document.querySelector('.add-input').value = ''
})

document.querySelector('.add-input').addEventListener('keydown', (e) => {
  if(e.key == 'Enter'){
    addTodo(e.path[0].value)
    renderTodos()
    e.target.value = ''
  }
})

const analyzeFooter = () => {
  const totalTodos = todoData.length
  const activeTodos = todoData.reduce((acc, todo) => {
    if(!todo.completed){
      return acc + 1
    }
    return acc
  }, 0)
  document.querySelector('.active').textContent = activeTodos
  document.querySelector('.total').textContent = totalTodos
}

const getFirstData = async () => {
  if(localStorage.getItem('data')){
    todoData = JSON.parse(localStorage.getItem('data'))
    renderTodos()
  }else{
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos`)
    const data = await response.json()
    todoData = data.splice(0, 3)
    renderTodos()
  }
}

getFirstData()