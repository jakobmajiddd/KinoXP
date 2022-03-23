const overlay = document.querySelector("#overlay");

document.querySelector(".close").addEventListener("click", closeModal);

let modalTitle = document.querySelector(".modal-title");
let modalInputField = document.querySelector(".modal-input-field");

let form = document.querySelector(".modal-input-field");

let method;
let showForm = false;
const submitBtn = document.getElementById("submit");
const deleteButton = document.createElement("button");


////////////// Create modals /////////////////////

function createMovie() {
  setMethod("post");
  setTitle("Create Movie");
  setFormDestination("http://localhost:8080/api/movies", "post");

  createInput("Movie name", "Batman...", "name", "text");
  createInput("Movie genre", "Action...", "genre", "text");
  createInput("Age limit", "12...", "ageLimit", "number")
  createInput("Image Url", "Url...", "imageUrl", "text");
  createInput("Duration", "...", "duration", "number");
  createInput("Price", "...", "price", "number");

  setupSubmitButton();

  openModal();
}

async function createShow() {
  await setMethod("post");
  await setTitle("Create show");
  await setFormDestination("http://localhost:8080/api/shows", "post")
  await createInput("Run time", "", "startDate", "time");
  await createDropdownInput("http://localhost:8080/api/rooms", "Room", "room");
  await createDropdownInput("http://localhost:8080/api/movies", "Movie", "movie");


  await setupSubmitButton();
  showForm = true;

  await openModal();
}

function editMovie(movie) {
  setMethod("put");
  setTitle("Edit movie");
  setFormDestination("http://localhost:8080/api/movies/movie/" + movie.id, "put")

  createInput("Movie name", "Batman...", "name", "text", movie.name);
  createInput("Movie genre", "Action...", "genre", "text", movie.genre);
  createInput("Age limit", "12...", "ageLimit", "number", movie.ageLimit)
  createInput("Image Url", "Url...", "imageUrl", "text", movie.imageUrl);
  createInput("Duration", "...", "duration", "number", movie.duration);

  displayShows(movie)

  createDeleteButton("http://localhost:8080/api/movies/" + movie.id);
  setupSubmitButton();

  openModal();
}

async function displayShows(movie) {
  const shows = await fetchEntities("http://localhost:8080/api/shows/" + movie.id);
  const header = document.createElement("p");
  header.textContent = "Shows:";
  header.style.fontWeight = "bold";
  form.appendChild(header);
  shows.forEach(s => {
    const div = document.createElement("div");
    div.textContent = s.startDate;
    form.appendChild(div);
  });


}

function createDeleteButton(url) {
  const modalFooter = document.querySelector(".modal-footer")

  deleteButton.id = "delete";
  deleteButton.className = "btn btn-danger remove";
  deleteButton.textContent = "Delete";

  modalFooter.appendChild(deleteButton);

  deleteButton.addEventListener("click", async () => {

    await deleteEntity(url);
    location.reload();
  });
}

function setupSubmitButton() {
  submitBtn.addEventListener("click", async () => {
    await createFormEventListener();
    location.reload();
  });
}

function deleteEntity(url) {
  const fetchOptions = {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(url, fetchOptions);
}

//////////////// Modal build functions ///////////////

function setTitle(title) {
  modalTitle.textContent = title;
}

function setMethod(method) {
  this.method = method;
}

function setFormDestination(action, method) {
  form.setAttribute("action", action);
  form.setAttribute("method", method);
}

function createInput(inputName, placeHolder, idName, type, value) {
  const title = document.createElement("p");
  const text = document.createTextNode(inputName);
  title.appendChild(text);

  const input = document.createElement("input");
  input.id = idName;
  input.name = idName;
  input.type = type;
  input.placeholder = placeHolder;
  if (value !== undefined) {
    input.value = value;
  }
  input.classList.add("js-input");


  form.appendChild(title);
  form.appendChild(input);
}

async function createDropdownInput(url, inputName, idName) {
  const title = document.createElement("p");
  const text = document.createTextNode(inputName);
  title.appendChild(text);

  const entities = await fetchEntities(url);
  const select = document.createElement("select");
  select.id = idName;
  select.name = idName;

  //test = entities[0];
//
  //for (let i = 0; i < entities.length; i++) {
  //  let entity = entities[i];
  //  const option = document.createElement("option");
  //  //option.value = entity.id;
  //  option.setAttribute("data-value", entity.id);
//
  //  option.textContent = entity.name;
  //  select.appendChild(option);
  //}

  //entities.forEach((element, key) => select.add(new Option(element, key);

  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];
    select.add(new Option(entity.name, entity.id));
  }

  form.appendChild(title);
  form.appendChild(select);

}


function openModal() {
  overlay.style.display = "block";
}

function closeModal() {
  overlay.style.display = "none";
  clearModal();
}

function clearModal() {
  modalTitle.textContent = "";
  deleteButton.remove();


  form.reset();

  while (modalInputField.hasChildNodes()) {
    modalInputField.removeChild(modalInputField.firstChild);
  }
}

//////////////////////////////////////////////////////////////////

const showContainer = document.getElementById("show-container");

loadShows();

async function loadShows() {
  const shows = await fetchEntities("http://localhost:8080/api/movies");

  for (let i = 0; i < shows.length; i++) {
    let show = shows[i];
    const showContainerElement = document.createElement("a");

    const showContainerElementId = document.createElement("div");
    const showContainerElementTitle = document.createElement("div");
    const showContainerElementDateFD = document.createElement("div");
    const showContainerElementDateSD = document.createElement("div");

    //slet denne kommentar
    showContainerElementId.textContent = show.id;
    showContainerElementTitle.textContent = show.name;
    showContainerElementDateSD.textContent = show.startDate;

    showContainerElement.classList.add("show-container-element");
    showContainerElementId.classList.add("show-container-element-id");
    showContainerElementTitle.classList.add("show-container-element-title");
    showContainerElementDateSD.classList.add("show-container-element-date");

    showContainerElement.addEventListener("click", () => editMovie(show));

    showContainerElement.appendChild(showContainerElementId);
    showContainerElement.appendChild(showContainerElementTitle);
    showContainerElement.appendChild(showContainerElementDateFD);
    showContainerElement.appendChild(showContainerElementDateSD);

    showContainer.appendChild(showContainerElement);

  }

}


function fetchEntities(url) {
  return fetch(url).then(response => response.json());

}

/////////////////////////////////////////////////////////////////

function createFormEventListener() {

  form.addEventListener("submit", handleFormSubmit);
  //alert(form.getAttribute("movie"));
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const formEvent = event.currentTarget;
  const url = formEvent.action;

  try {
    const formData = new FormData(formEvent);

    await postFormDataAsJson(url, formData);
  } catch (err) {

  }
}

// meget dårlig måde at fixe problemet på
function parseHack(str) {
  str = str.replace('"room":"', '"room":{"id":');
  str = str.replace('","m', '},"m');
  str = str.replace('"movie":"', '"movie":{"id":');
  str = str.replace('"}', '}}');
  return str;
}

async function postFormDataAsJson(url, formData) {
  const plainFormData = Object.fromEntries(formData.entries());
  let formDataJsonString = JSON.stringify(plainFormData);


  if (showForm) {
    formDataJsonString = parseHack(formDataJsonString);
    showForm = false;
  }

  const fetchOptions = {
    method: this.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: formDataJsonString
  };


  const response = await fetch(url, fetchOptions);

  if (!response) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}



