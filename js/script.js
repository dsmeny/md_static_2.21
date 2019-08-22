function q(selector) {
  return document.querySelector(selector);
}

const dom = {
  wrapper: q(".wrapper"),
  doodleHeader: q(".doodle"),
  message: q(".doodle__message"),
  output: q(".listView"),
  content: q(".content"),
  showTileStorage: q("#show__tile__Storage"),
  showListStorage: q("#show__list__Storage"),
  logo: q(".doodle__title"),
  doodleItems: q(".doodle__items"),
  doodleButtons: q(".doodle__buttons")
};
const {
  wrapper,
  doodleHeader,
  message,
  output,
  content,
  showTileStorage,
  showListStorage,
  logo,
  doodleItems,
  doodleButtons
} = dom;

let defValue = message.defaultValue;
let clicked = true;
localStorage.clicked = clicked;
let storage = localStorage;

//***** ******/
// on keypress
//***** ******/

message.addEventListener("keydown", e => {
  let messageInput = e.target;

  // header
  // message input
  messageInput.classList.add("--typed");
  messageInput.classList.add("--addAnimation");
  messageInput.defaultValue = " ";
  messageInput.style.transform = "translateY(4vh)";

  // message input buttons
  ///////////
  // happens when typing //
  doodleButtons.style.margin = "0 auto";
  doodleButtons.style.width = "100%";
  doodleButtons.classList.add("--addCentering");

  // removing logo, tile and list buttons
  logo.style.display = "none";
  showTileStorage.style.display = "none";
  showListStorage.style.display = "none";

  // if typing, move header up top
  if (e.composed) {
    doodleHeader.classList.add("--moveToOrigin");
  }

  // if the enter button is selected
  if (e.keyCode === 13) {
    let html = messageInput.value;

    // return everything as before
    doodleHeader.classList.remove("--moveToOrigin");
    messageInput.classList.remove("--typed");
    messageInput.classList.remove("--addAnimation");
    messageInput.style.transform = "none";
    doodleButtons.style.width = "40%";
    doodleButtons.style.margin = "initial";
    logo.style.display = "initial";

    // If value is not a space
    if (html !== " ") {
      // Add to localStorage
      localStorage.setItem(`${html}`, html);

      let getStorageItem = localStorage.getItem(html);

      // Show tile and list buttons
      showTileStorage.style.display = "inline-block";
      showListStorage.style.display = "inline-block";

      // remove empty storage message
      const emptyStorage = q(".--emptyStorage");
      if (wrapper.children[1].classList.contains("--emptyStorage"))
        emptyStorage.style.display = "none";
      resetInput();

      // send to the UI
      sendToPage(getStorageItem);
    } else {
      resetInput();
      message.value = defValue;
    }
    resetInput();
  }
});

// handle post click in message box
message.addEventListener("click", e => {
  if (defValue) message.value = "";
  else message.value = defValue;
});

//***** ******/
// on load
//***** ******/

window.addEventListener("DOMContentLoaded", e => {
  // changes logo appearance
  let ev = window.matchMedia("(max-width: 600px)");
  matchMobile(ev);

  if (storage.length > 1) {
    let storageArray = Array.from(Object.keys(storage));
    storageArray.forEach(store => {
      if (store !== "clicked") {
        sendToPage(store);
      }
    });
  } else {
    doodleHeader.insertAdjacentHTML(
      "afterend",
      `<h2 class='--emptyStorage'>Your storage is currently empty. Make a doodle!</h2>`
    );
  }

  message.focus();
});

// remove buttons
function* removeOneElement(node) {
  let clicklist = () => {
    if (node.hasChildNodes()) {
      let nList = Array.from(node.childNodes);
      nList.forEach(node => {
        let childnode = node.childNodes[3];
        childnode.addEventListener("click", removeStorage);
      });
    } else {
      console.log("Nodes are not present.");
    }
  };

  yield clicklist();
}

// find each list item
// remove storage and dom element.
function removeStorage(e) {
  localStorage.removeItem(`${e.path[1].childNodes[1].textContent}`);
  e.path[1].remove();
  if (localStorage.length <= 1) {
    location.reload();
    message.focus();
  }
}

// media query for mobile
function matchMobile(e) {
  if (e.matches || visualViewport.width < 600) {
    logo.innerText = "MD";
  } else {
    logo.innerText = "Morning Doodle";
  }
}

// Reset input
function resetInput() {
  if (message.value !== defValue) {
    message.value = "";
    message.focus();
  }
}

function* showView(storObj) {
  // create the html
  yield `<li class='--styleLists'>
        <label>${storObj}</label>
        <input type='button' class='removeStorage' value='-'/>
        </li>`;

  let listNode = yield;

  // return listeners on remove buttons
  yield* removeOneElement(listNode);
}

function* generateList(oneItem) {
  // set view
  let generator,
    itemsList,
    html = "";

  // show view depending on selected button

  if (oneItem !== "clicked") {
    generator = showView(oneItem);
    html += generator.next().value;
  }

  yield html;
  itemsList = document.getElementById("itemsList");

  generator.next();
  generator.next(itemsList);

  return;
}

function displayList(elem) {
  // set the view
  let view;
  if (clicked) {
    view = "listView";
  } else {
    view = "tileView";
  }

  // insert the list
  content.insertAdjacentHTML(
    "afterbegin",
    `<ul id="itemsList" class='${view}'>${elem}</ul>`
  );
}

function sendToPage(item) {
  let generator = generateList(item);
  let listElement = generator.next().value;
  displayList(listElement);
  generator.next();
}
