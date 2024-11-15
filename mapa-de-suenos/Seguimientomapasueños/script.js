document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskFormOverlay = document.getElementById("task-form-overlay");
    const saveTaskBtn = document.getElementById("save-task-btn");
    const cancelTaskBtn = document.getElementById("cancel-task-btn");
    const tasksList = document.getElementById("tasks-list");

    let editingTask = null;

    addTaskBtn.addEventListener("click", () => {
        taskFormOverlay.classList.add("active");
        editingTask = null;  // Reset task to create a new one
    });

    cancelTaskBtn.addEventListener("click", () => {
        taskFormOverlay.classList.remove("active");
        clearForm();
    });

    saveTaskBtn.addEventListener("click", () => {
        const taskName = document.getElementById("task-name").value;
        const taskDesc = document.getElementById("task-desc").value;
        const taskDate = document.getElementById("task-date").value;

        if (taskName && taskDate) {
            const task = { name: taskName, description: taskDesc, date: taskDate };

            if (editingTask) {
                // Update existing task
                updateTask(editingTask, task);
                editingTask = null;
            } else {
                // Save new task
                saveTask(task);
                addTaskToDOM(task);
            }

            taskFormOverlay.classList.remove("active");
            clearForm();
        }
    });

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(addTaskToDOM);
    }

    function addTaskToDOM(task) {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.innerHTML = `
        <h4>${task.name}</h4>
        <p class="task-date">${task.date}</p>
        <div class="icon-container">
            <button class="icon-btn edit-btn"><i class="fas fa-edit"></i></button>
            <button class="icon-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;
        taskCard.querySelector(".edit-btn").addEventListener("click", () => {
            editTask(task);
        });

        taskCard.querySelector(".delete-btn").addEventListener("click", () => {
            deleteTask(task, taskCard);
        });

        tasksList.appendChild(taskCard);
    }

    function editTask(task) {
        document.getElementById("task-name").value = task.name;
        document.getElementById("task-desc").value = task.description;
        document.getElementById("task-date").value = task.date;
        taskFormOverlay.classList.add("active");
        editingTask = task;
    }

    function updateTask(oldTask, newTask) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const taskIndex = tasks.findIndex(t => t.name === oldTask.name && t.date === oldTask.date);
        if (taskIndex > -1) {
            tasks[taskIndex] = newTask;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            tasksList.innerHTML = ""; // Clear the task list
            loadTasks(); // Reload tasks to show updated data
        }
    }

    function deleteTask(task, taskCard) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(t => !(t.name === task.name && t.date === task.date));
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskCard.remove();
    }

    function clearForm() {
        document.getElementById("task-name").value = "";
        document.getElementById("task-desc").value = "";
        document.getElementById("task-date").value = "";
    }

    loadTasks();
});
