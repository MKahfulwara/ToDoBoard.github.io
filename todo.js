const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");

kanbanData = {
  todo: [],
  doing: [],
  done: [],
};
function appendTasks(tasks, ulElement) {
  tasks.forEach((task) => {
    let li = taskCreater(task.title);
    ulElement.appendChild(li);
  });
}
function findTaskById(id, list) {
  return kanbanData[list].find((task) => task.id == id);
}
function PopUp(e, action, list) {
  var divToHide = document.getElementById("task-card");
  if (action == "open") {
    divToHide.style.display = "flex";
    foundTask = findTaskById(e.target.id, list);
    document.getElementById("id").name = `${foundTask.id}`;
    document.getElementById("priority-select").value = `${foundTask.priority}`;
    document.getElementById("card-title").value = `${foundTask.title}`;
    document.getElementById("card-desc").value = `${foundTask.description}`;
    document.getElementById("end-date").value = foundTask.endDate;
    document.getElementById(
      "list-position"
    ).innerText = `${foundTask.position}`;
  } else if (action == "close") {
    divToHide.style.display = "none";
  }
}

console.log(document.getElementById("priority-select").selected);
function saveData(event) {
  event.preventDefault();
  const position = document.getElementById("list-position").innerText;
  const title = document.getElementById("card-title").value;
  const description = document.getElementById("card-desc").value;
  const priority = document.getElementById("priority-select").value;
  const endDate = document.getElementById("end-date").value;
  const taskId = document.getElementById("id").name;
  document.getElementById(`${taskId}`).querySelector("p").innerHTML = title;
  kanbanData[position].forEach((task) => {
    if (task.id == taskId) {
      task.title = title;
      task.description = description;
      task.priority = priority;
      task.position = position;
      task.endDate = endDate;
    }
  });
  PopUp(event, "close", position);
}

let movingTask = null;
function setMovingTask(task) {
  movingTask = task;
}
function getMovingTask() {
  return movingTask;
}
function getParentNodeId(node) {
  id = node.parentNode.id;
  [list, lane] = id.split("-");
  return list;
}
function taskCreater(value) {
  const li = document.createElement("li");
  const del = document.createElement("button");
  del.innerHTML = "&#128465;";
  del.classList.add("del-btn");
  del.classList.add("hide");

  del.addEventListener("click", function (event) {
    event.stopPropagation();
    parentElement = del.parentNode;

    lis = getParentNodeId(this.parentElement);
    kanbanData[list] = kanbanData[list].filter((task) => task.id != li.id);
    if (parentElement) {
      parentElement.parentNode.removeChild(parentElement); // Remove the parent element
    }
  });
  li.appendChild(document.createElement("p")).innerHTML = `${value}`;
  li.appendChild(del);

  li.classList.add("task");
  li.classList.add("flex");
  li.classList.add("space");
  li.addEventListener("mouseenter", function () {
    del.style.display = "inline-block";
  });

  li.addEventListener("mouseleave", function () {
    del.style.display = "none";
  });

  li.addEventListener("click", function (event) {
    list = getParentNodeId(event.target);
    PopUp(event, "open", list);
  });
  li.setAttribute("draggable", "true");
  li.addEventListener("dragstart", () => {
    list = getParentNodeId(li);
    result = kanbanData[list].reduce(
      (accumulator, task) => {
        if (task.id != li.id) {
          accumulator.filtered.push(task);
        } else {
          accumulator.removed.push(task);
        }
        return accumulator;
      },
      { filtered: [], removed: [] }
    );
    setMovingTask(...result.removed);
    kanbanData[list] = result.filtered;

    li.classList.add("is-dragging");
  });
  li.addEventListener("dragend", () => {
    list = getParentNodeId(li);
    task = getMovingTask();
    console.log("dragend", task, list);
    task.position = list;

    kanbanData[list].push(task);
    li.classList.remove("is-dragging");
  });
  return li;
}
const todoTasksList = document.getElementById("todo-lane");
const doingTasksList = document.getElementById("doing-lane");
const doneTasksList = document.getElementById("done-lane");

appendTasks(kanbanData.todo, todoTasksList);
appendTasks(kanbanData.doing, doingTasksList);
appendTasks(kanbanData.done, doneTasksList);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value;

  if (!value) return;

  let newTask = taskCreater(value);
  newTask.id =
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  kanbanData.todo.push({
    id: newTask.id,
    title: newTask.querySelector("p").innerText,
    description: "",
    priority: 0,
    position: "todo",
    endDate: "2025-01-01",
  });

  todoLane.appendChild(newTask);

  input.value = "";
});

function sortTodo(list) {
  kanbanData[list].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return new Date(a.endDate) - new Date(b.endDate);
  });
  const Lane = document.getElementById(`${list}-lane`);
  const Tasks = Lane.querySelectorAll("li.task");
  kanbanData[list].map((task, index) => {
    Tasks[index].id = task.id;
    Tasks[index].querySelector("p").innerHTML = task.title;
  });
}
