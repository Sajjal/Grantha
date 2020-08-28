/********** Select Dom Elements *************/

function getElement(name) {
  return document.querySelector(`#${name}`);
}

//Pages
const signupLogin = getElement("signupLogin");
const navbar = getElement("navbar");
const dashboard = getElement("dashboard");
const addProject = getElement("addProject");
const manageProject = getElement("manageProject");
const exploreProject = getElement("exploreProject");
const help = getElement("help");

//Messages
const message = getElement("message");
const updateUserMessage = getElement("updateUserMessage");
const viewAPIKeyMessage = getElement("viewAPIKeyMessage");
const deleteProjectMessage = getElement("deleteProjectMessage");
const projectDeletedMessage = getElement("projectDeletedMessage");
const clickCollectionMessage = getElement("clickCollectionMessage");
const exploreProjectStatusMessage = getElement("exploreProjectStatusMessage");
const displayIDListMessage = getElement("displayIDListMessage");
const loginMessage = getElement("loginMessage");

//Page Elements
const signupForm = getElement("signupForm");
const loginForm = getElement("loginForm");
const gotoHome = getElement("gotoHome");
const gotoAdd = getElement("gotoAdd");
const gotoHelp = getElement("gotoHelp");
const logout = getElement("logout");
const loadingElement = getElement("loading");
const addProjectForm = getElement("addProjectForm");
const projectList = getElement("projectList");

const updateDBUserSection = getElement("updateDBUserSection");
const updateUserProjectName = getElement("updateUserProjectName");
const updateUserForm = getElement("updateUserForm");
const dbID = getElement("dbID");

const dangerZone = getElement("dangerZone");
const viewAPIKeyButton = getElement("viewAPIKeyButton");
const generateNewAPIKeyButton = getElement("generateNewAPIKeyButton");
const deleteProjectButton = getElement("deleteProjectButton");
const confirmDeleteProjectButton = getElement("confirmDeleteProjectButton");

const collectionList = getElement("collectionList");
const idList = getElement("idList");

/**************** Functions *********************/

//Initial View Screen
async function initialView(API_URL) {
  let response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    response = await response.json();
    signupLogin.style.display = "";
    loginMessage.style.display = "";
    loginMessage.textContent = response.error;
  } else showDashboard();
}
initialView("/dashboard");

//Signup or Login
async function signupORLogin(API_URL, form) {
  const formData = new FormData(form);
  const username = formData.get("username");
  const password = formData.get("password");
  const data = { username, password };

  let response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    response = await response.json();
    loginMessage.style.display = "";
    loginMessage.innerHTML = `<span style='color: #db2a07;'>${response.error}</span>`;
  } else if (response.ok && API_URL == "/signup") {
    response = await response.json();
    form.reset();
    message.textContent = response.message;
  } else {
    showDashboard();
  }
}

//Show Dashboard
async function showDashboard() {
  loginMessage.style.display = "none";
  loadingElement.style.display = "";
  projectList.innerHTML = "";
  help.style.display = "none";
  signupLogin.style.display = "none";
  addProject.style.display = "none";
  manageProject.style.display = "none";
  exploreProject.style.display = "none";
  deleteProjectMessage.style.display = "none";
  confirmDeleteProjectButton.style.display = "none";
  navbar.style.display = "";
  dashboard.style.display = "";
  let response = await fetch("/dashboard", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  response = await response.json();
  message.textContent = response.message;
  let projects = response.projects;

  const html = ejs.render(
    `<% projects.forEach(project => { %>
      <div class="posts">
        <div>
          <h3><%= project.name %></h3>
        </div>
        <div>
         <button class="btn btn_edit_group" value="<%= project._id %>|<%= project.name %>" onclick="exploreButtonFunction(this.value)">Explore</button>
         <button class="btn btn_edit_group" value="<%= project._id %>|<%= project.name %>" onclick="manageButtonFunction(this.value)">Manage</button>
        </div>
      </div>
    <% }) %>`,
    { projects: projects }
  );
  projectList.innerHTML = html;
  loadingElement.style.display = "none";
}

//Add new Project
async function addNewProject(API_URL) {
  const formData = new FormData(addProjectForm);
  const name = formData.get("name");
  const db = formData.get("dbName");
  const user = formData.get("username");
  const pass = formData.get("password");

  const data = { name, db, user, pass };

  let response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  response = await response.json();
  if (response.error) {
    message.innerHTML = `<span style='color: #db2a07;'>${response.error}</span>`;
    loadingElement.style.display = "none";
  } else {
    showDashboard();
  }
  addProjectForm.reset();
}

async function updateDatabaseUser(API_URL) {
  loadingElement.style.display = "";
  const formData = new FormData(updateUserForm);
  const dbUser = formData.get("dbUser");
  const dbPass = formData.get("dbPass");
  const dbID = formData.get("dbID");
  const data = { dbUser, dbPass, dbID };

  let response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  response = await response.json();
  if (response.message) {
    updateUserMessage.textContent = response.message;
    viewAPIKeyMessage.textContent = "➡️ Previous API key is Invalid, use the new one!";
  }
  updateUserForm.reset();
  loadingElement.style.display = "none";
}

async function deleteProject(API_URL, data) {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
}

async function viewAPIKey(API_URL, data) {
  loadingElement.style.display = "";
  let response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  response = await response.json();
  if (response.message) {
    generateNewAPIKeyButton.style.display = "none";
    viewAPIKeyMessage.innerHTML =
      "➡️ This API key will be hidden afterwards. Keep it in a safe place! Do not share!!!<br><br>" + response.message;
  }
  if (response.error) {
    viewAPIKeyMessage.innerHTML = response.error;
    generateNewAPIKeyButton.style.display = "";
  }
  loadingElement.style.display = "none";
}

async function generateNewAPIKey(API_URL, data) {
  loadingElement.style.display = "";
  let response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  generateNewAPIKeyButton.style.display = "none";
  response = await response.json();
  viewAPIKeyMessage.innerHTML = response.message;
  loadingElement.style.display = "none";
}

async function exploreDatabase(API_URL, data) {
  loadingElement.style.display = "";
  let response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  response = await response.json();
  exploreProjectStatusMessage.textContent = "Database Statistics (MB):";
  clickCollectionMessage.innerHTML = "<pre>" + response.message + "</pre>";
  collections = response.collections;

  if (collections[0] == "") {
    collectionList.innerHTML = "➡️ You don't have any collections!";
  } else {
    const html = ejs.render(
      `<% collections.forEach(collection => { %>
        <div>
          <button value="<%= collection %>|${data.id}" 
          style="border: none;outline: none;
          background-color: inherit;
          padding: 3px 3px;
          font-size: 16px;
          cursor: pointer;" 
          onclick="getIDList(this.value)">➡️ <%= collection %></button>
        </div>
    <% }) %>`,
      { collections: collections }
    );
    collectionList.innerHTML = html;
  }
  loadingElement.style.display = "none";
}

async function getIDListData(API_URL, data) {
  loadingElement.style.display = "";
  let response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  response = await response.json();
  ids = response.message;

  const html = ejs.render(
    `<% ids.forEach(id => { %>
        <div>
          <button value="<%= id %>|${data.id}|${data.collection}" 
          style="border: none;outline: none;
          background-color: inherit;
          padding-bottom: 15px;
          font-size: 16px;
          cursor: pointer;" 
          onclick="getCollection(this.value)"><%= id %></button>
        </div>
    <% }) %>`,
    { ids: ids }
  );
  idList.innerHTML = html;
  loadingElement.style.display = "none";
}

async function getCollectionData(API_URL, data) {
  loadingElement.style.display = "";
  let response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  response = await response.json();
  const newResponse = response.message.split(",").join(",\n").split("{").join("{\n").split("}").join("\n  }");
  clickCollectionMessage.innerHTML = `<pre>  ${newResponse} </pre>`;
  loadingElement.style.display = "none";
}

async function deleteCollectionData(data) {
  loadingElement.style.display = "";
  data = data.split("|");
  data = { id: data[0], db: data[1], collection: data[2] };
  let response = await fetch("/dashboard/deleteCollectionData", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  }).then(() => {
    data = `${data.collection}|${data.db}`;
    getIDList(data);
    exploreProjectStatusMessage.innerHTML = `<span style='color: #db2a07;'>Record Removed!</span>`;
    loadingElement.style.display = "none";
  });
}

/**************** Event Listeners ***********/

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signupORLogin("/", loginForm);
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signupORLogin("/signup", signupForm);
});

gotoHome.addEventListener("click", (event) => {
  showDashboard();
});

gotoHelp.addEventListener("click", (event) => {
  addProject.style.display = "none";
  dashboard.style.display = "none";
  manageProject.style.display = "none";
  exploreProject.style.display = "none";
  help.style.display = "";
  message.textContent = "Documentation";
});

gotoAdd.addEventListener("click", (event) => {
  addProject.style.display = "";
  dashboard.style.display = "none";
  manageProject.style.display = "none";
  exploreProject.style.display = "none";
  help.style.display = "none";
  message.textContent = "Add New Project";
});

logout.addEventListener("click", (event) => {
  signupForm.reset();
  loginForm.reset();
  navbar.style.display = "none";
  dashboard.style.display = "none";
  addProject.style.display = "none";
  manageProject.style.display = "none";
  exploreProject.style.display = "none";
  help.style.display = "none";
  initialView("/logout");
});

addProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loadingElement.style.display = "";
  addNewProject("/database");
});

function manageButtonFunction(value) {
  dashboard.style.display = "none";
  generateNewAPIKeyButton.style.display = "none";
  manageProject.style.display = "";
  newValueManage = value.split("|");
  dbID.value = newValueManage[0];
  message.textContent = newValueManage[1];
  updateDBUserSection.style.display = "";
  updateUserMessage.textContent = "*Invalidates Previous API Key";
  dangerZone.style.display = "";
  projectDeletedMessage.textContent = "";
  viewAPIKeyMessage.textContent = "";
  viewAPIKeyButton.value = newValueManage[0];
  confirmDeleteProjectButton.value = newValueManage[0];
}

updateUserForm.addEventListener("submit", (event) => {
  event.preventDefault();
  generateNewAPIKeyButton.style.display = "none";
  updateDatabaseUser("/database/updateDBUser");
});

viewAPIKeyButton.addEventListener("click", (event) => {
  deleteProjectMessage.style.display = "none";
  confirmDeleteProjectButton.style.display = "none";
  viewAPIKey("/dashboard/viewAPIKey", { id: viewAPIKeyButton.value });
});

generateNewAPIKeyButton.addEventListener("click", (event) => {
  generateNewAPIKey("/database/generateNewAPIKey", { id: viewAPIKeyButton.value });
});

deleteProjectButton.addEventListener("click", (event) => {
  generateNewAPIKeyButton.style.display = "none";
  viewAPIKeyMessage.textContent = "";
  deleteProjectMessage.style.display = "";
  confirmDeleteProjectButton.style.display = "";
});

confirmDeleteProjectButton.addEventListener("click", (event) => {
  dangerZone.style.display = "none";
  updateDBUserSection.style.display = "none";
  deleteProject("/database/deleteProject", { id: confirmDeleteProjectButton.value });
  message.innerHTML = `<span style='color: #db2a07;'>Project Deleted !</span>`;
});

function exploreButtonFunction(value) {
  exploreProjectStatusMessage.textContent = "Loading...";
  clickCollectionMessage.innerHTML = "";
  dashboard.style.display = "none";
  exploreProject.style.display = "";
  idList.textContent = "*Select a Collection!";
  displayIDListMessage.textContent = "IDs";
  newValueExplore = value.split("|");
  message.textContent = newValueExplore[1];
  exploreDatabase("/dashboard/explore", { id: newValueExplore[0] });
}

function getIDList(value) {
  exploreProjectStatusMessage.textContent = "Select an ID!";
  clickCollectionMessage.innerHTML = "";
  const idListValue = value.split("|");
  displayIDListMessage.textContent = idListValue[0];
  getIDListData("/dashboard/getCollectionID", { id: idListValue[1], collection: idListValue[0] });
}

function getCollection(value) {
  const collectionValue = value.split("|");
  data = { id: collectionValue[0], db: collectionValue[1], collection: collectionValue[2] };
  const html = ejs.render(`${collectionValue[0]}
  <button class="btn_delete_data" value="${value}" 
  onclick="deleteCollectionData(this.value)">🚫</button>`);
  exploreProjectStatusMessage.innerHTML = html;
  getCollectionData("/dashboard/getCollectionData", data);
}
