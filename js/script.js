class Element {
  constructor(element) {
    this.element = document.querySelector(element);
  }
}

window.addEventListener("DOMContentLoaded", displayStorageNodes);
let nodeList = document.querySelectorAll(".--styleInputs");

let message = new Element(".doodle__buttons__message").element;
let container = new Element("#container").element;

message.addEventListener("keydown", function(e) {
  let elem = e.target;
  elem.classList.add("--typed");

  if (e.keyCode === 13) {
    let string = elem.value;
    if (string === "") {
      elem.classList.remove("--typed");
    } else {
      addToDB(string.substring(0, 3), string);
      displayStorageNodes();
      addRemoveStorageMessage();
      elem.value = "";
    }
  }
});

function createNode(obj) {
  let [key, value] = obj;
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
  let map = new Map();
  if (localStorage.length > 0) {
    for (var [key, value] of Object.entries(localStorage)) {
      map.set(key, value);
    }
    let iterator = map[Symbol.iterator]();
    createNode(iterator.next().value);
    setTileListListeners();
    document.querySelector("footer").style.display = "none";
  } else {
    addRemoveStorageMessage();
  }
}

function addToDB(name, stringVal) {
  let keyName;
  let item = localStorage.getItem(name);
  if (item) {
    keyName = `${name}_` + localStorage.length;
  } else {
    keyName = name;
  }
  localStorage.setItem(`${keyName}`, stringVal);
}

function addRemoveStorageMessage() {
  if (localStorage.length > 0) {
    if (container.contains(document.querySelector(".--emptyStorage"))) {
      document.querySelector(".--emptyStorage").style.display = "none";
      document.querySelector("footer").style.display = "none";
    }
    setTileListListeners();
  } else {
    document.getElementById(
      "container"
    ).innerHTML = `<p class="--emptyStorage">Storage is currently empty</p>`;
    document.querySelector("footer").style.display = "initial";
    nodeList[0].style.display = "none";
    nodeList[1].style.display = "none";
  }
}

function setTileListListeners() {
  nodeList.forEach(node => {
    node.style.display = "initial";
    node.addEventListener("click", setFocus);
  });
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

  /////////////////////////////////////////////////////////////////////////
  if (el.classList.contains("--addDimmer")) {
    let attrib = el.getAttribute("id");
    let regex = RegExp(/show__(? = tile)/);
    if (regex.test(attrib)) console.log("show tile");
    else console.log("show list");
  }
}
