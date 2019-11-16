class Element {
  constructor(element) {
    this.element = document.querySelector(element);
  }
}

window.addEventListener("DOMContentLoaded", displayStorageNodes);
let nodeList = document.querySelectorAll(".--styleInputs");

let message = new Element(".doodle__buttons__message").element,
  container = new Element("#container").element,
  header = new Element(".doodle__header").element,
  messageContainer = new Element(".doodle__buttons").element,
  doodleViews = new Element(".doodle__buttons__views").element,
  paraText,
  canvas,
  deleteButton,
  title = document.querySelector(".doodle__title"),
  wrapper = document.querySelector(".wrapper"),
  phone = window.matchMedia("(max-width: 600px)"),
  mobile = window.matchMedia("(max-width: 1000px)"),
  desktop = window.matchMedia("(max-width:1319px)"),
  lgScreen = window.matchMedia("(min-width:1320px)");

// handle like listeners
function handleLikeListener(elem) {
  localStorage.setItem(`db_${elem.parentElement.parentElement.keyName}`, 0);
  elem.addEventListener("click", likeTracker);
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

function ifFocus() {
  if (document.hasFocus()) console.log("has focus");
  else console.log("no focus");
}

ifFocus();

// scroll event for sticky header
// removes scroll choppiness

window.addEventListener("scroll", scrolled);

function scrolled() {
  if (window.scrollY > 50) {
    header.classList.add("sticky--header");
  } else {
    header.classList.remove("sticky--header");
  }
}

window.addEventListener("scroll", scrolled);

message.addEventListener("keydown", function(e) {
  let elem = e.target;
  typeMessage(e, elem);
  if (localStorage.length === 0) {
    document.querySelector(".--emptyStorage").style.display = "none";
  }

  if (e.keyCode === 13) {
    let string = elem.value;
    if (string === "") {
      elem.classList.remove("--addAnimation");
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
  const buttonGroup = document.createElement("div");
  const canvasElem = document.createElement("canvas");

  node.keyName = key;
  node.appendChild(text);
  node.appendChild(buttonGroup);
  buttonGroup.appendChild(canvasElem);
  buttonGroup.appendChild(button);

  node.classList.add("--styleFigure");

  text.appendChild(textNode);

  canvasElem.setAttribute("id", "canvas");
  canvas = document.getElementById("canvas");
  buttonGroup.classList.add("buttonGroup");

  button.classList.add("--styleButton");
  button.textContent = "-";
  deleteButton = document.querySelector(".--styleButton");

  paintImageSprite(canvas, "/img/heart.svg");
  addRemoveStorageListener(button, "click");
  handleLikeListener(canvas);
}

function paintImageSprite(elem, source) {
  elem.style.width = 46 + "px";
  elem.style.height = 30 + "px";
  const ctx = elem.getContext("2d");

  const image = new Image(140, 200);
  image.onload = drawImageActualSize;

  image.src = source;

  function drawImageActualSize() {
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;

    ctx.drawImage(this, 0, 0, this.width, this.height);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
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

// observer for typed messages
function typeMessage(listener, target) {
  if (listener.composed) {
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
  target.classList.add("--addAnimation");
}

function resetMessage() {
  header.firstElementChild.classList.remove("--removeDisplay");
  messageContainer.classList.remove("--setMessageColumnTwo");
  doodleViews.style.display = "flex";
  messageContainer.classList.remove("--addCentering");
  message.classList.remove("--styleInputs");
  message.classList.remove("--addAnimation");
}

window.addEventListener("resize", logo);
window.addEventListener("load", logo);

// observer for sticky header responsive message positioning
let responsiveTitleSpacing = new MutationObserver(logo);

responsiveTitleSpacing.observe(header, {
  subtree: true,
  attributes: true
});

function logo() {
  if (phone.matches) {
    title.textContent = "MD";
    title.style.marginTop = "-1vh";

    if (header.classList.contains("sticky--header")) {
      messageContainer.style.transform = "translateX(-5vw)";
    } else messageContainer.style.transform = "none";

    setVerticalPosition(container, -2);
    // wrapper.style.backgroundColor = "yellow";
  } else if (mobile.matches) {
    if (header.classList.contains("sticky--header")) {
      title.textContent = "MD";
      // before.style.display = "none";
    } else {
      title.textContent = "Morning Doodle";
    }
    title.style.marginTop = "11vh";
    setVerticalPosition(container, 8);
    // wrapper.style.backgroundColor = "blue";
  } else if (desktop.matches) {
    title.textContent = "Morning Doodle";
    setVerticalPosition(container, 17);
    // wrapper.style.backgroundColor = "red";
  } else if (lgScreen.matches) {
    title.textContent = "Morning Doodle";
    setVerticalPosition(container, 35);

    // wrapper.classList.add("gradient");
  }
}

function setVerticalPosition(element, position) {
  element.style.setProperty(
    "transform",
    `translateY(calc(16px + ${position}vh))`,
    "important"
  );
}

// handles readonly tile/list view buttons
let observer = new MutationObserver(() => {
  if (localStorage.length > 0) {
    setTileListListeners();
  }
});

observer.observe(doodleViews, { subtree: true, attributes: true });
