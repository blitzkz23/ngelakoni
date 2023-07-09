const API_HOST = "http://127.0.0.1:5000/api";
const todoColumn = document.getElementById("todo");
const doneColumn = document.getElementById("done");

// Drag N' Drop Functionality
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));

  const dataId = event.srcElement.lastChild.id;
  checkStatus(dataId);
}

function checkStatus(id) {
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/tasks/" + id;

  xhr.open("GET", url, true);
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(this.response);

      updateStatus(id, response.data.status);
    }
  };

  return xhr.send();
}

function updateStatus(id, status) {
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/tasks/status/" + id;

  const data = JSON.stringify({
    status: !status,
  });

  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.reload();
    }
  };

  xhr.send(data);
}
// End of Drag N Drop Related

// Generate Colors for Todo
function generateRandomPastelColor() {
  var colors = ["#F9EDC8", "#C9F9CD", "#C8EBF8", "#F9DFC8"];
  var randomColor = colors[Math.floor(Math.random() * colors.length)];
  return randomColor;
}

function generateLightGrayColor() {
  return "#D3D3D3";
}

// Check Login Status
const isLogin = localStorage.getItem("access_token");
if (!isLogin) {
  window.location.href = "http://127.0.0.1:5000/auth/login";
}

// Selector Onchange Event
const selector = document.getElementById("select-project");
selector.addEventListener("change", (e) => {
  e.preventDefault();
  const projectName = document.getElementById("project-name");
  const selectedOption = e.target.options[e.target.selectedIndex];
  const selectedOptionId = selectedOption.getAttribute("id");

  // Clear existing tasks
  todoColumn.innerHTML = "";
  doneColumn.innerHTML = "";

  // Recreate Header
  todoHeader = document.createElement("h2");
  todoHeader.appendChild(document.createTextNode("Todo"));
  todoColumn.appendChild(todoHeader);

  doneHeader = document.createElement("h2");
  doneHeader.appendChild(document.createTextNode("Done"));
  doneColumn.appendChild(doneHeader);

  if (selectedOptionId !== "Ubah Project") {
    projectName.innerHTML = selectedOption.value;

    // Init AJAX
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/projects/" + selectedOptionId + "/tasks";

    xhr.open("GET", url, true);
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.response);
        response.data.tasks.forEach((task) => {
          populateTodoItem(task);
        });
      }
    };

    xhr.send();
  }
});

// Add Project
const addFormProject = document.getElementById("add-form-project");
addFormProject.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get data from form
  const title = document.getElementById("title-project").value;

  // Toast config
  const toastLive = document.getElementById("live-toast-add-project");
  const toastMsgAdd = document.getElementById("toast-body-add-project");
  toastMsgAdd.innerHTML = "Judul tidak boleh kosong!";
  const toast = new bootstrap.Toast(toastLive);

  // Validation
  if (!title) return toast.show();

  // Payload
  const data = JSON.stringify({
    title: title,
  });

  // Init AJAX
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/projects";

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Close modal after adding data
      const myModalAddProject =
        bootstrap.Modal.getInstance("#myModalAddProject");
      myModalAddProject.hide();

      // Reset form
      addFormProject.reset();

      // Refresh page
      location.reload();
    } else {
      //konfigurasi toast berhasil
      const toastLive = document.getElementById("liveToast");
      const toastMsg = document.getElementById("toast-body");
      const toast = new bootstrap.Toast(toastLive);
      toastMsg.innerHTML = "Terjadi kesalahan";
      toast.show();
    }
  };
  xhr.send(data);
});

// Get All Task
window.onload = function () {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    window.location.href = "http://127.0.0.1:5000/auth/login";
  }

  // Init AJAX for projects
  const xhr2 = new XMLHttpRequest();
  const url2 = API_HOST + "/projects";

  xhr2.open("GET", url2, true);
  xhr2.setRequestHeader("Authorization", `Bearer ${accessToken}`);
  xhr2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const projects = JSON.parse(this.response);
      if (projects["data"].length != 0) {
        // If project is not empty assign the todo for the fies
        const defaultProject = projects["data"][0];
        const defaultProjectId = defaultProject.id;
        const projectName = document.getElementById("project-name");
        projectName.innerHTML = defaultProject.title;

        // Init AJAX to get todo
        const xhr3 = new XMLHttpRequest();
        const url = API_HOST + "/projects/" + defaultProjectId + "/tasks";

        xhr3.open("GET", url, true);
        xhr3.setRequestHeader(
          "Authorization",
          `Bearer ${localStorage.getItem("access_token")}`
        );
        xhr3.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.response);
            response.data.tasks.forEach((task) => {
              populateTodoItem(task);
            });
          }
        };

        xhr3.send();
      }

      // Drop down in the main menu
      const dropDown = document.getElementById("select-project");
      projects["data"].forEach((project) => {
        const selectItem = document.createElement("option");
        selectItem.setAttribute("id", project.id);
        selectItem.setAttribute("project-id", project.id);
        selectItem.setAttribute("project-title", project.title);
        selectItem.appendChild(document.createTextNode(project.title));
        dropDown.appendChild(selectItem);

        // Drop down in add button
        const dropDownAdd = document.getElementById("select-project-add");
        const selectItemAdd = document.createElement("option");
        selectItemAdd.setAttribute("id", project.id);
        selectItemAdd.setAttribute("project-id", project.id);
        selectItemAdd.setAttribute("project-title", project.title);
        selectItemAdd.appendChild(document.createTextNode(project.title));
        dropDownAdd.appendChild(selectItemAdd);
      });
    }
  };

  xhr2.send();
};

// Populate todo
function populateTodoItem(task) {
  // Create element of todo cards
  const article = document.createElement("article");
  const h4 = document.createElement("h4");
  const p = document.createElement("p");
  const badgeEdit = document.createElement("button");
  const badgeDelete = document.createElement("button");

  // Append data
  h4.appendChild(document.createTextNode(task.title));
  h4.setAttribute("id", task.id);
  p.appendChild(document.createTextNode(task.description));

  // Set bootrstrap attribute
  article.setAttribute("class", "p-2 drag mb-3");
  article.setAttribute("ondragstart", "drag(event)");
  article.setAttribute("draggable", "true");
  article.setAttribute("id", task.id);

  badgeDelete.setAttribute("class", "badge bg-danger me-2");
  badgeDelete.setAttribute("href", "#");
  badgeDelete.setAttribute("data-id", task.id);
  badgeDelete.setAttribute("data-bs-toggle", "modal");
  badgeDelete.setAttribute("data-bs-target", "#myModalDelete");
  badgeDelete.appendChild(document.createTextNode("Delete"));

  badgeEdit.setAttribute("class", "badge bg-info");
  badgeEdit.setAttribute("href", "#");
  badgeEdit.setAttribute("data-title", task.title);
  badgeEdit.setAttribute("data-description", task.description);
  badgeEdit.setAttribute("data-id", task.id);
  badgeEdit.setAttribute("data-bs-toggle", "modal");
  badgeEdit.setAttribute("data-bs-target", "#myModalEdit");
  badgeEdit.appendChild(document.createTextNode("Edit"));

  article.appendChild(h4);
  article.appendChild(p);
  article.appendChild(badgeDelete);
  article.appendChild(badgeEdit);

  if (task.status == true) {
    article.setAttribute("style", "text-decoration:line-through");
    const bgColor = generateLightGrayColor();
    article.style.backgroundColor = bgColor;
    doneColumn.appendChild(article);
  } else {
    const bgColor = generateRandomPastelColor();
    article.style.backgroundColor = bgColor;
    todoColumn.appendChild(article);
  }
}

// Create New Task
const addForm = document.getElementById("add-form");
addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get data from form
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const projectSelector = document.getElementById("select-project-add");
  const selectedIndex = projectSelector.selectedIndex;
  const selectedOption = projectSelector.options[selectedIndex];
  const selectedOptionId = selectedOption.getAttribute("id");

  // Toast config
  const toastLive = document.getElementById("live-toast-add");
  const toastMsgAdd = document.getElementById("toast-body-add");
  const toast = new bootstrap.Toast(toastLive);

  // Validation
  if (!title | !description) {
    toastMsgAdd.innerHTML = "Judul/deskripsi tidak boleh kosong";
    toast.show();
  }

  if (!selectedOptionId) {
    toastMsgAdd.innerHTML =
      "Anda belum memiliki project, silahkan buat terlebih dahulu!";
    toast.show();
  }

  const data = JSON.stringify({
    title: title,
    description: description,
    project_id: selectedOptionId,
  });

  // Init AJAX
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/tasks";

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Close modal after adding data
      const myModalAdd = bootstrap.Modal.getInstance("#myModalAdd");
      myModalAdd.hide();

      // Reset form
      addForm.reset();

      // Refresh page
      location.reload();
    } else {
      //konfigurasi toast berhasil
      const toastLive = document.getElementById("live-toast-add");
      const toastMsg = document.getElementById("toast-body-add");
      const toast = new bootstrap.Toast(toastLive);
      toastMsg.innerHTML = "Terjadi kesalahan";
      toast.show();
    }
  };
  xhr.send(data);
});

// Edit task
const myModalEdit = document.getElementById("myModalEdit");
myModalEdit.addEventListener("show.bs.modal", (e) => {
  const dataId = e.relatedTarget.attributes["data-id"];

  // Init AJAX
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/tasks/" + dataId.value;

  // Get old task value first
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.response);
      const oldTitle = document.getElementById("edit-title");
      const oldDescription = document.getElementById("edit-description");

      oldTitle.value = data.data.title;
      oldDescription.value = data.data.description;
    }
  };

  xhr.send();

  // Get edit task value and update data
  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get data from form
    const newTitle = document.getElementById("edit-title").value;
    const newDescription = document.getElementById("edit-description").value;

    // Toast config
    const toastLive = document.getElementById("live-toast-edit");
    const toastMsgEdit = document.getElementById("toast-body-edit");
    const toast = new bootstrap.Toast(toastLive);

    // Validation
    if (!newTitle | !newDescription) {
      toastMsgEdit.innerHTML = "Isi dari judul/deskripsi tidak boleh kosong!";
      toast.show();
    }

    const data = JSON.stringify({
      title: newTitle,
      description: newDescription,
    });

    // Init AJAX
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/tasks/" + dataId.value;
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        //close the modal after edit data
        const myModalEdit = bootstrap.Modal.getInstance("#myModalEdit");
        myModalEdit.hide();
        //reset form and reload page
        editForm.reset();
        location.reload();
      }
    };
    xhr.send(data);
  });
});

// Delete Task
const myModalDelete = document.getElementById("myModalDelete");
myModalDelete.addEventListener("show.bs.modal", (e) => {
  const dataId = e.relatedTarget.attributes["data-id"];
  const deleteForm = document.getElementById("delete-form");

  deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Init AJAX
    const xhr = new XMLHttpRequest();
    const url = API_HOST + "/tasks/" + dataId.value;

    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.response) {
        const response = JSON.parse(this.response);

        const myModalDelete = bootstrap.Modal.getInstance("#myModalDelete");
        myModalDelete.hide();

        const alertLoc = document.getElementById("alert-loc");
        const alertEl = document.createElement("div");
        alertEl.setAttribute("class", "alert alert-success");
        alertEl.setAttribute("role", "alert");
        alertEl.innerHTML = response.message;

        alertLoc.append(alertEl);

        document.getElementById(dataId.value).classList.add("d-none");
        var delayInMilliseconds = 3000;
        setTimeout(function () {
          alertEl.classList.add("d-none");
        }, delayInMilliseconds);
      }
    };
    xhr.send();
  });
});

// Clock Function
let p = document.getElementById("jam");

function myTime() {
  let jam = new Date();
  p.innerHTML = jam.toLocaleTimeString([], {
    hour12: false,
  });
}
setInterval(myTime, 1000);

// Logout Function
const logout = document.getElementById("logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();

  // Init AJAX
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/auth/logout";

  xhr.open("POST", url, true);
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );

  xhr.onreadystatechange = function () {
    if (this.status == 200) {
      localStorage.removeItem("access_token");
      window.location.href = "http://127.0.0.1:5000/auth/login";
    }
    // Token expired
    if (this.status == 401) {
      localStorage.removeItem("access_token");
      window.location.href = "http://127.0.0.1:5000/auth/login";
    }
  };

  xhr.send();
});
