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
      let keyName = addToDB(string.substring(0, 3), string);
      createNode(keyName, string);
      addRemoveStorageMessage();
      setTileListListeners();
      elem.value = "";
    }
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
  // let map = new Map();
  if (localStorage.length > 0) {
    for (var [key, value] of Object.entries(localStorage)) {
      // let list = map.set(`${key}`, value);
      // console.log(key, value);
      createNode(key, value);
    }
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
  return keyName;
}

function addRemoveStorageMessage() {
  let emptyStorage = document.querySelector(".--emptyStorage");
  if (localStorage.length > 0) {
    if (emptyStorage === null) {
      return;
    } else {
      document.getElementById("container").removeChild(emptyStorage);
      document.querySelector("footer").style.display = "none";
    }
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

    // set default
    if (node.classList.contains("--addDimmer")) {
      setView(node);
    }
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

  // set view
  if (el.classList.contains("--addDimmer")) {
    setView(el);
  }
}

function setView(el) {
  const nodes = document.getElementById("container").childNodes;
  let attrib = el.getAttribute("id");
  let regex = RegExp(/show__(?=tile)/);
  if (regex.test(attrib)) {
    nodes.forEach(n => {
      n.classList.add("--tileView");
      n.classList.remove("--listView");
    });
  } else {
    nodes.forEach(n => {
      n.classList.add("--listView");
      n.classList.remove("--tileView");
    });
  }
}
