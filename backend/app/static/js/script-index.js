const API_HOST = "http://127.0.0.1:5000/api";
const todoColumn = document.getElementById("todo");
const doneColumn = document.getElementById("done");

// Check Login Status
const isLogin = localStorage.getItem("access_token");
if (!isLogin) {
  window.location.href = "http://127.0.0.1:5000/auth/login";
}

// Get All Task
window.onload = function () {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    window.location.href = "http://127.0.0.1:5000/auth/login";
  }

  // Init AJAX
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
  article.setAttribute("class", "border b-3 drag");
  article.setAttribute("ondragstart", "drag(event)");
  article.setAttribute("draggable", "true");
  article.setAttribute("id", task.id);

  badgeDelete.setAttribute("class", "badge bg-danger");
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

  //   Toast config
  const toastLive = document.getElementById("live-toast-add");
  const toastMsgAdd = document.getElementById("toast-body-add");
  const toast = new bootstrap.Toast(toastLive);

  //   Validation
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
      addForm.requestFullscreen();

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
