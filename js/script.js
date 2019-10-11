class Element {
  constructor(element) {
    this.element = document.querySelector(element);
  }
}

window.addEventListener("DOMContentLoaded", displayStorageNodes);

let message = new Element(".doodle__message").element;

message.addEventListener("keydown", function(e) {
  let elem = e.target;

  if (e.keyCode === 13) {
    let elemName = "";
    let string = elem.value;
    for (let i = 0; i <= Math.round(string.length / 4); i++) {
      elemName += string[i];
    }
    let currentDoodle = addToDB(elemName, elem);
    createNode(elemName, currentDoodle);
  }
});

function createNode(text, localStorKey = null) {
  let node = document.createElement("figure");
  let button = document.createElement("button");
  let textNode = document.createTextNode(text);
  node.appendChild(textNode);
  document.getElementById("container").appendChild(node);
  node.appendChild(button);
  node.classList.add("--styleFigure");
  button.classList.add("--styleButton");
  button.addEventListener("click", function(e) {
    e = e.target.parentNode;
    deleteNode(e);
    localStorage.removeItem(localStorKey);
  });
}

function displayStorageNodes() {
  if (localStorage.length > 0) {
    for (let [key, value] of Object.entries(localStorage)) {
      let currentItem = localStorage.getItem(key);
      createNode(currentItem);
    }
  } else
    document.getElementById(
      "container"
    ).innerHTML = `<p class="--emptyStorage">Storage is currently empty</p>`;
}

function deleteNode(node) {
  document.getElementById("container").removeChild(node);
}

function addToDB(name, elem) {
  localStorage.setItem(`${name}`, elem.value);
  return localStorage.getItem(`${name}`);
}
