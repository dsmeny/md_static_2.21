class Element {
  constructor(element) {
    this.element = document.querySelector(element);
  }
}

window.addEventListener("DOMContentLoaded", displayStorageNodes);
let nodeList = document.querySelectorAll(".--styleInputs");

let message = new Element(".doodle__buttons__message").element;

message.addEventListener("keydown", function(e) {
  let elem = e.target;
  elem.classList.add("--typed");

  if (e.keyCode === 13) {
    let string = elem.value;
    addToDB(createKeyName(string), string);
    addRemoveStorageMessage();
    elem.value = "";
  }
});

function createNode(key, value) {
  let node = document.createElement("figure");
  let button = document.createElement("button");
  let textNode = document.createTextNode(value);

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
    addRemoveStorageMessage();
  });
}

function displayStorageNodes() {
  let key, value;
  if (localStorage.length > 0) {
    for ([key, value] of Object.entries(localStorage)) {
      createNode(key, value);
    }
    document.querySelector("footer").style.display = "none";
  } else {
    addRemoveStorageMessage();
  }
}

function addToDB(name, stringVal) {
  localStorage.setItem(`${name}`, stringVal);
  createNode(`${name}`, stringVal);
}

function addRemoveStorageMessage() {
  if (localStorage.length > 0) {
    document.querySelector(".--emptyStorage").style.display = "none";
    setTileListListeners(nodeList);
  } else {
    document.getElementById(
      "container"
    ).innerHTML = `<p class="--emptyStorage">Storage is currently empty</p>`;
    nodeList[0].style.display = "none";
    nodeList[1].style.display = "none";
  }
}

function setTileListListeners(nodelist) {
  nodelist.forEach(node => {
    node.style.display = "initial";
    node.addEventListener("click", setFocus);
  });
}

function createKeyName(stringVal) {
  let el = "";
  for (let i = 0; i <= Math.round(stringVal.length / 4); i++) {
    el += stringVal[i];
  }
  return el;
}

function setFocus(e) {
  let el = e.target;
  if (el.previousElementSibling) {
    el.classList.toggle("--addDimmer");
    el.previousElementSibling.classList.toggle("--addDimmer");
  } else {
    el.classList.toggle("--addDimmer");
    el.nextElementSibling.classList.toggle("--addDimmer");
  }
}
