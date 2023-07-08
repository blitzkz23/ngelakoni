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

// Check Login Status
const isLogin = localStorage.getItem("access_token");
if (!isLogin) {
  window.location.href = "http://127.0.0.1:5000/auth/login";
}

// Selector Onchange Event
const selector = document.getElementById("select-project");
selector.addEventListener("change", (e) => {
  const projectName = document.getElementById("project-name");
  const selectedItem = e.target.value;

  if (selectedItem != "Ubah Project") {
    projectName.innerHTML = selectedItem;
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
      const myModalAddProject = bootstrap.Modal.getInstance("#myModalAddProject");
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

  // Init AJAX for tasks
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/tasks";

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const tasks = JSON.parse(this.response);
      tasks["data"].forEach((task) => {
        populateTodoItem(task);
      });
    }
  };

  xhr.send();

  // Init AJAX for projects
  const xhr2 = new XMLHttpRequest();
  const url2 = API_HOST + "/projects";

  xhr2.open("GET", url2, true);
  xhr2.setRequestHeader("Authorization", `Bearer ${accessToken}`);
  xhr2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const projects = JSON.parse(this.response);
      const dropDown = document.getElementById("select-project");
      projects["data"].forEach((project) => {
        const selectItem = document.createElement("option");
        selectItem.setAttribute("id", "project" + project.id);
        selectItem.setAttribute("project-id", project.id);
        selectItem.setAttribute("project-title", project.title);
        selectItem.appendChild(document.createTextNode(project.title));
        dropDown.appendChild(selectItem);
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
  article.setAttribute("class", "border p-2 drag mb-2");
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
    doneColumn.appendChild(article);
  } else {
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

  // Toast config
  const toastLive = document.getElementById("live-toast-add");
  const toastMsgAdd = document.getElementById("toast-body-add");
  const toast = new bootstrap.Toast(toastLive);

  // Validation
  if (!title | !description) {
    toastMsgAdd.innerHTML = "Judul/deskripsi tidak boleh kosong";
    toast.show();
  }

  const data = JSON.stringify({
    title: title,
    description: description,
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
      const toastLive = document.getElementById("liveToast");
      const toastMsg = document.getElementById("toast-body");
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
    } else {
      alert("Something went wrong");
    }
  };

  xhr.send();
});
