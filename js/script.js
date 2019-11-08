class Element {
  constructor(element) {
    this.element = document.querySelector(element);
  }
}

window.addEventListener("DOMContentLoaded", displayStorageNodes);
let nodeList = document.querySelectorAll(".--styleInputs");

let message = new Element(".doodle__buttons__message").element;
let container = new Element("#container").element;
let header = new Element(".doodle__header").element;
let messageContainer = new Element(".doodle__buttons").element;
let doodleViews = new Element(".doodle__buttons__views").element;
let paraText, likeButton, deleteButton;

// handle like listeners
function handleLikeListener(elem) {
  localStorage.setItem(`db_${elem.parentElement.parentElement.keyName}`, 0);
  elem.addEventListener("click", likeTracker);
}

message.addEventListener("keydown", function(e) {
  let elem = e.target;
  typeMessage(e, elem);

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
      resetMessage();
    }
  }
});

function createNode(key, value) {
  const node = document.createElement("figure");
  document.getElementById("container").appendChild(node);
  const button = document.createElement("button");
  const text = document.createElement("p");
  const textNode = document.createTextNode(value);
  const likes = document.createElement("input");
  const buttonGroup = document.createElement("div");

  node.keyName = key;
  node.appendChild(text);
  node.appendChild(buttonGroup);
  buttonGroup.appendChild(likes);
  buttonGroup.appendChild(button);

  node.classList.add("--styleFigure");

  text.appendChild(textNode);
  // text.setAttribute("class", "para");
  // paraText = new Element(".para").element;

  likes.setAttribute("type", "image");
  likes.setAttribute("src", "/img/heart.svg");
  likes.classList.add("likes");
  buttonGroup.classList.add("buttonGroup");
  likeButton = document.querySelector(".likes");

  button.classList.add("--styleButton");
  deleteButton = document.querySelector(".--styleButton");

  addRemoveStorageListener(button, "click");
  handleLikeListener(likes);
}

function addRemoveStorageListener(node, event) {
  node.addEventListener(event, function(e) {
    e = e.target.parentNode.parentNode;
    let key = e.keyName;
    document.getElementById("container").removeChild(e);
    localStorage.removeItem(`${key}`);
    localStorage.removeItem(`db_${key}`);
    addRemoveStorageMessage();
  });
}

function displayStorageNodes() {
  if (localStorage.length > 0) {
    for (var [key, value] of Object.entries(localStorage)) {
      // console.log(`key: ${key}, value: ${value}`);
      createNode(key, value);
      ///////////////////////////////////////////////////
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
    resetMessage();
    header.firstElementChild.style.display = "initial";
  }
}

function setTileListListeners() {
  nodeList.forEach(node => {
    node.style.display = "initial";
    node.addEventListener("click", setFocus);

    // set default
    if (node.classList.contains("--addDimmer")) {
      setView(node);
      node.removeEventListener("click", setFocus);
      if (node.classList.contains("--addLinkHover")) {
        node.classList.remove("--addLinkHover");
      }
    } else {
      if (!node.classList.contains("--addLinkHover")) {
        node.classList.add("--addLinkHover");
      }
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

      n.childNodes[0].setAttribute("class", "--addTileViewParagraph");
      n.childNodes[1].classList.add("--addTileViewLikes");
      n.childNodes[1].classList.remove("--addListViewLikes");
      n.childNodes[1].childNodes[1].classList.add("--addDeleteButtonView");
    });
  } else {
    nodes.forEach(n => {
      n.classList.add("--listView");
      n.classList.remove("--tileView");

      n.childNodes[1].classList.remove("--addTileViewLikes");
      n.childNodes[1].classList.add("--addListViewLikes");
    });
  }
}

function likeTracker(e) {
  let elem = e.target;
  let count = localStorage.getItem(
    `db_${elem.parentElement.parentElement.keyName}`
  );
  count = parseInt(count);
  if (count === 0) {
    count++;
    localStorage.setItem(
      `db_${elem.parentElement.parentElement.keyName}`,
      count
    );
  } else if (count > 0) {
    count--;
  }
  elem.parentNode.insertAdjacentHTML(
    "afterbegin",
    `<span class="counter">${count}</span>`
  );
}

// observer for typed messages
function typeMessage(listener, target) {
  if (listener.composed) {
    header.classList.add("--moveToOrigin");
    header.firstElementChild.classList.add("--removeDisplay");
  }

  if (header.firstElementChild.classList.contains("--removeDisplay")) {
    messageContainer.classList.add("--setMessageColumnTwo");
  }
  messageContainer.style.margin = "0 auto";
  messageContainer.style.width = 100 + "%";
  messageContainer.classList.add("--addCentering");

  doodleViews.style.display = "none";

  target.classList.add("--styleInputs");
  target.classList.add("--addCharcoal");
  target.classList.add("--typed");
  target.classList.add("--addAnimation");
}

function resetMessage() {
  header.firstElementChild.classList.remove("--removeDisplay");
  messageContainer.classList.remove("--setMessageColumnTwo");
  doodleViews.style.display = "flex";
  messageContainer.classList.remove("--addCentering");
  message.classList.remove("--styleInputs");
  message.classList.remove("--typed");
  message.classList.remove("--addAnimation");
}

chromeHack();

function chromeHack() {
  let ua = window.navigator.vendor;
  let regex = new RegExp(/Google Inc./);
  let google = regex.test(ua);
  let watch = window.matchMedia("(min-width:1000px && max-width: 1280)");
  let mobileMatch = window.matchMedia(
    "(min-width: 600px && max-width: 1000px)"
  );

  if (google && watch.matches) {
    container.style.setProperty(
      "transform",
      "translateY(calc(16px + -2vh))",
      "important"
    );
  } else if (google && mobileMatch.matches) {
    container.style.setProperty(
      "transform",
      "translateY(calc(16px + 2vh))",
      "important"
    );
  }
}

// handles readonly tile/list view buttons
let observer = new MutationObserver(() => {
  if (localStorage.length > 0) {
    setTileListListeners();
  }
});

observer.observe(doodleViews, { subtree: true, attributes: true });
