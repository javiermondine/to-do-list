import { format } from 'date-fns';

const projectList = document.getElementById('project-list');
const projectTitle = document.getElementById('project-title');
const todoList = document.getElementById('todo-list');
const addProjectBtn = document.getElementById('add-project-btn');
const addTodoBtn = document.getElementById('add-todo-btn');
const projectModal = document.getElementById('project-modal');
const todoModal = document.getElementById('todo-modal');
const closeProjectModalBtn = projectModal.querySelector('.close-btn');
const closeTodoModalBtn = todoModal.querySelector('.close-btn');
const submitProjectBtn = document.getElementById('submit-project-btn');
const submitTodoBtn = document.getElementById('submit-todo-btn');
const projectNameInput = document.getElementById('project-name-input');
const todoTitleInput = document.getElementById('todo-title-input');
const todoDescriptionInput = document.getElementById('todo-description-input');
const todoDueDateInput = document.getElementById('todo-dueDate-input');
const todoPriorityInput = document.getElementById('todo-priority-input');
const todoIdInput = document.getElementById('todo-id');

function renderProjects(projects, currentProjectId, projectClickHandler, projectDeleteHandler) {
    projectList.innerHTML = '';
    projects.forEach(project => {
        const li = document.createElement('li');
        li.innerHTML = `<span><i class="fas fa-list-ul"></i> ${project.name}</span>`;
        li.dataset.projectId = project.id;
        if (project.id === currentProjectId) {
            li.classList.add('active');
        }
        li.addEventListener('click', () => projectClickHandler(project.id));
        
        if (projects.length > 1) { // Don't allow deleting the last project
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.classList.add('delete-project-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                projectDeleteHandler(project.id);
            });
            li.appendChild(deleteBtn);
        }

        projectList.appendChild(li);
    });
}

function renderTodos(project) {
    projectTitle.innerHTML = `<i class="fas fa-tasks"></i> ${project.name}`;
    todoList.innerHTML = '';
    project.todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item', `priority-${todo.priority}`);
        if (todo.completed) {
            todoItem.classList.add('completed');
        }

        const formattedDueDate = format(new Date(todo.dueDate), 'MMM do, yyyy');

        todoItem.innerHTML = `
            <div>
                <input type="checkbox" ${todo.completed ? 'checked' : ''} data-todo-id="${todo.id}">
                <div>
                    <strong>${todo.title}</strong>
                    <p>${todo.description}</p>
                </div>
            </div>
            <div class="todo-details">
                <span>${formattedDueDate}</span>
                <div class="actions">
                    <button class="edit-todo-btn" data-todo-id="${todo.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-todo-btn" data-todo-id="${todo.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
        todoList.appendChild(todoItem);
    });
}

function openProjectModal() {
    projectModal.style.display = 'block';
}

function closeProjectModal() {
    projectModal.style.display = 'none';
    projectNameInput.value = '';
}

function openTodoModal(todo = null) {
    if (todo) {
        todoIdInput.value = todo.id;
        todoTitleInput.value = todo.title;
        todoDescriptionInput.value = todo.description;
        todoDueDateInput.value = todo.dueDate;
        todoPriorityInput.value = todo.priority;
    } else {
        todoIdInput.value = '';
        todoTitleInput.value = '';
        todoDescriptionInput.value = '';
        todoDueDateInput.value = '';
        todoPriorityInput.value = 'low';
    }
    todoModal.style.display = 'block';
}

function closeTodoModal() {
    todoModal.style.display = 'none';
}

function getProjectData() {
    return { name: projectNameInput.value };
}

function getTodoData() {
    return {
        id: todoIdInput.value || null,
        title: todoTitleInput.value,
        description: todoDescriptionInput.value,
        dueDate: todoDueDateInput.value,
        priority: todoPriorityInput.value,
    };
}

export {
    renderProjects,
    renderTodos,
    openProjectModal,
    closeProjectModal,
    openTodoModal,
    closeTodoModal,
    getProjectData,
    getTodoData,
    addProjectBtn,
    addTodoBtn,
    closeProjectModalBtn,
    closeTodoModalBtn,
    submitProjectBtn,
    submitTodoBtn,
    todoList
};
