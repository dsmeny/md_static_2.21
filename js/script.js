class Element {
  constructor(element) {
    this.element = document.querySelector(element);
  }
}

window.addEventListener("DOMContentLoaded", displayStorageNodes);

let message = new Element(".doodle__message").element;

message.addEventListener("keydown", function(e) {
  let elem = e.target;
  elem.classList.add("--typed");

  if (e.keyCode === 13) {
    let string = elem.value;
    let elemName = createKeyName(string);
    let currentDoodle = addToDB(elemName, elem);
    createNode(currentDoodle);
    elem.value = "";
  }
});

function createNode(text) {
  let node = document.createElement("figure");
  let button = document.createElement("button");
  let textNode = document.createTextNode(text);
  node.appendChild(textNode);
  document.getElementById("container").appendChild(node);
  node.appendChild(button);
  node.classList.add("--styleFigure");
  button.classList.add("--styleButton");

  addRemoveStorageListener(button, "click");
}

function addRemoveStorageListener(node, event) {
  node.addEventListener(event, function(e) {
    e = e.target.parentNode;
    let key = createKeyName(e.innerText);
    document.getElementById("container").removeChild(e);
    localStorage.removeItem(`${key}`);
  });
}

function displayStorageNodes() {
  if (localStorage.length > 0) {
    for (let [key, value] of Object.entries(localStorage)) {
      let currentItem = localStorage.getItem(key);
      createNode(currentItem);
    }
    document.querySelector("footer").style.display = "none";
  } else
    document.getElementById(
      "container"
    ).innerHTML = `<p class="--emptyStorage">Storage is currently empty</p>`;
}

function addToDB(name, elem) {
  localStorage.setItem(`${name}`, elem.value);
  return localStorage.getItem(`${name}`);
}

function createKeyName(string) {
  let el = "";
  for (let i = 0; i <= Math.round(string.length / 4); i++) {
    el += string[i];
  }
  return el;
}
