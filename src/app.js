import Project from './Project.js';
import Todo from './Todo.js';
import * as DOM from './dom.js';

class App {
    constructor() {
        this.projects = [];
        this.currentProjectId = null;
        this.loadProjects();
        this.bindEvents();
        this.render();
    }

    loadProjects() {
        const projects = JSON.parse(localStorage.getItem('todoApp.projects'));
        if (projects) {
            this.projects = projects.map(p => {
                const project = new Project(p.name, p.id);
                project.todos = p.todos.map(t => new Todo(t.title, t.description, t.dueDate, t.priority, t.id));
                return project;
            });
        } else {
            const defaultProject = new Project('Default Project');
            this.projects.push(defaultProject);
        }
        this.currentProjectId = localStorage.getItem('todoApp.currentProjectId') || this.projects[0].id;
    }

    save() {
        localStorage.setItem('todoApp.projects', JSON.stringify(this.projects));
        localStorage.setItem('todoApp.currentProjectId', this.currentProjectId);
    }

    bindEvents() {
        DOM.addProjectBtn.addEventListener('click', () => DOM.openProjectModal());
        DOM.closeProjectModalBtn.addEventListener('click', () => DOM.closeProjectModal());
        DOM.submitProjectBtn.addEventListener('click', () => this.addProject());

        DOM.addTodoBtn.addEventListener('click', () => DOM.openTodoModal());
        DOM.closeTodoModalBtn.addEventListener('click', () => DOM.closeTodoModal());
        DOM.submitTodoBtn.addEventListener('click', () => this.addOrUpdateTodo());

        DOM.todoList.addEventListener('click', (e) => {
            if (e.target.matches('.delete-todo-btn')) {
                this.deleteTodo(parseInt(e.target.dataset.todoId));
            } else if (e.target.matches('.edit-todo-btn')) {
                this.editTodo(parseInt(e.target.dataset.todoId));
            } else if (e.target.matches('input[type="checkbox"]')) {
                this.toggleTodoCompletion(parseInt(e.target.dataset.todoId));
            }
        });
    }

    addProject() {
        const { name } = DOM.getProjectData();
        if (name) {
            const newProject = new Project(name);
            this.projects.push(newProject);
            this.currentProjectId = newProject.id;
            this.save();
            this.render();
            DOM.closeProjectModal();
        }
    }
    
    deleteProject(projectId) {
        if (this.projects.length <= 1) {
            alert("You cannot delete the last project.");
            return;
        }
        this.projects = this.projects.filter(p => p.id !== projectId);
        if (this.currentProjectId === projectId) {
            this.currentProjectId = this.projects[0].id;
        }
        this.save();
        this.render();
    }

    addOrUpdateTodo() {
        const data = DOM.getTodoData();
        if (data.title && data.dueDate) {
            const currentProject = this.getCurrentProject();
            if (data.id) { // Update existing todo
                const todo = currentProject.getTodo(parseInt(data.id));
                if (todo) {
                    todo.title = data.title;
                    todo.description = data.description;
                    todo.dueDate = data.dueDate;
                    todo.priority = data.priority;
                }
            } else { // Add new todo
                const newTodo = new Todo(data.title, data.description, data.dueDate, data.priority);
                currentProject.addTodo(newTodo);
            }
            this.save();
            this.render();
            DOM.closeTodoModal();
        }
    }

    deleteTodo(todoId) {
        const currentProject = this.getCurrentProject();
        currentProject.removeTodo(todoId);
        this.save();
        this.render();
    }

    editTodo(todoId) {
        const todo = this.getCurrentProject().getTodo(todoId);
        if (todo) {
            DOM.openTodoModal(todo);
        }
    }

    toggleTodoCompletion(todoId) {
        const todo = this.getCurrentProject().getTodo(todoId);
        if (todo) {
            todo.toggleCompleted();
            this.save();
            this.render();
        }
    }

    getCurrentProject() {
        return this.projects.find(p => p.id === this.currentProjectId);
    }

    handleProjectClick(projectId) {
        this.currentProjectId = projectId;
        this.save();
        this.render();
    }

    render() {
        DOM.renderProjects(this.projects, this.currentProjectId, this.handleProjectClick.bind(this), this.deleteProject.bind(this));
        const currentProject = this.getCurrentProject();
        if (currentProject) {
            DOM.renderTodos(currentProject);
        }
    }
}

export default App;
