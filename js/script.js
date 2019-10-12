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
    addToDB(elemName, string);
    displayStorageNodes();
    elem.value = "";
  }
});

function createNode(text, key) {
  let node = document.createElement("figure");
  let button = document.createElement("button");
  let textNode = document.createTextNode(text);
  node.appendChild(textNode);
  document.getElementById("container").appendChild(node);
  node.keyName = key;
  node.appendChild(button);
  node.classList.add("--styleFigure");
  button.classList.add("--styleButton");

  addRemoveStorageListener(button, "click");
}

function addRemoveStorageListener(node, event) {
  node.addEventListener(event, function(e) {
    e = e.target.parentNode;
    let key = e.keyName;
    document.getElementById("container").removeChild(e);
    localStorage.removeItem(`${key}`);
  });
}

function displayStorageNodes() {
  if (localStorage.length > 0) {
    for (let [key, value] of Object.entries(localStorage)) {
      createNode(value, key);
    }
    document.querySelector("footer").style.display = "none";
  } else
    document.getElementById(
      "container"
    ).innerHTML = `<p class="--emptyStorage">Storage is currently empty</p>`;
}

function addToDB(name, stringVal) {
  localStorage.setItem(`${name}`, stringVal);
}

function createKeyName(stringVal) {
  let el = "";
  for (let i = 0; i <= Math.round(stringVal.length / 4); i++) {
    el += stringVal[i];
  }
  return el;
}
