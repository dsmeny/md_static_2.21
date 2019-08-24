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
  doodleButtons
} = dom;

let clicked = localStorage.getItem("clicked");
let defValue = message.defaultValue;
let storage = localStorage;
let itemsList;

//***** ******/
// Observer
//***** ******/

const callback = () => {
  wrapper.style.height =
    Math.round(Math.floor(window.outerHeight * 1.5)) + "px";
};

const observer = new MutationObserver(callback);

observer.observe(wrapper, { subtree: true, childList: true });

//***** ******/
// mobile touch
//***** ******/

// User touch
doodleHeader.addEventListener("touchstart", e => {
  e.preventDefault();
  doodleHeader.scrollTo = 0 + "px";
});

//***** ******/
// on scrolled
//***** ******/

adjustToScrolled("--adjustWrapperHeight");

//***** ******/
// on resize
//***** ******/

// media query for logo resizing
window.addEventListener("resize", matchMobile);

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
  messageInput.style.transform = "translateY(5vh)";

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
    doodleButtons.classList.remove("--addFlex");

    // return everything as before
    doodleHeader.classList.remove("--moveToOrigin");
    messageInput.classList.remove("--typed");
    messageInput.classList.remove("--addAnimation");
    messageInput.style.transform = "none";
    doodleButtons.style.margin = "initial";
    logo.style.display = "initial";

    // If value is not a space
    if (html !== " ") {
      // Add to localStorage
      localStorage.setItem(`${html}`, html);

      let getStorageItem = localStorage.getItem(html);

      // remove empty storage message
      const emptyStorage = q(".--emptyStorage");
      if (wrapper.children[1].classList.contains("--emptyStorage")) {
        emptyStorage.style.display = "none";
        resetInput();
      }

      // send to the UI

      sendToPage(getStorageItem);
      applyView(clicked);

      // Show tile and list buttons
      showTileStorage.style.display = "inline-block";
      showListStorage.style.display = "inline-block";
      setClickListeners();

      //
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
  matchMobile();
  adjustToScrolled("--adjustWrapperHeight");

  // If there is storage
  if (storage.length > 1) {
    let storageArray = Array.from(Object.keys(storage));
    storageArray.forEach(store => {
      if (store !== "clicked") {
        sendToPage(store);
      }
    });

    // set view state and add listeners
    applyView(clicked);
    setClickListeners();
    //
  } else {
    doodleHeader.insertAdjacentHTML(
      "afterend",
      `<h2 class='--emptyStorage'>Make a nice doodle!</h2>`
    );

    showTileStorage.style.display = "none";
    showListStorage.style.display = "none";
    let watch = window.matchMedia("(max-width: 600px)");
    if (watch.matches) {
      doodleButtons.classList.add("--addFlex");
    } else if (doodleButtons.classList.contains("--addFlex")) {
      doodleButtons.classList.remove("--addFlex");
    }
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
function matchMobile() {
  let watch = window.matchMedia("(max-width: 600px)");

  if (watch.matches) {
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

function* createList(storObj) {
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
    generator = createList(oneItem);
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
  if (clicked === "true") {
    view = "listView";
  } else if (clicked === "false") {
    view = "tileView";
  } else {
    console.log("undefined. view is not set.");
  }

  // insert the list
  if (content.contains(itemsList)) {
    itemsList.innerHTML += elem;
  } else {
    content.insertAdjacentHTML(
      "afterbegin",
      `<ul id="itemsList" class='${view}'>${elem}</ul>`
    );

    itemsList = q("#itemsList");
  }
}

function sendToPage(item) {
  let generator = generateList(item);
  let listElement = generator.next().value;
  displayList(listElement);
  generator.next();
}

function setClickListeners() {
  doodleButtons.addEventListener("click", e => {
    if (e.target === showListStorage) {
      clicked = "true";
      localStorage.setItem("clicked", true);
      applyView(clicked);
    } else if (e.target === showTileStorage) {
      clicked = "false";
      localStorage.setItem("clicked", false);
      applyView(clicked);
      adjustToScrolled("--adjustWrapperHeight");
    }
  });

  doodleButtons.addEventListener("touchstart", e => {
    if (e.target === showListStorage) {
      clicked = "true";
      localStorage.setItem("clicked", true);
      applyView(clicked);
    } else if (e.target === showTileStorage) {
      clicked = "false";
      localStorage.setItem("clicked", false);
      applyView(clicked);
      adjustToScrolled("--adjustWrapperHeight");
    }
  });
}

function applyView(viewState) {
  // determine view defaults
  if (viewState === "true") {
    showListStorage.classList.add("--addDimmer");
    showTileStorage.classList.remove("--addDimmer");
    itemsList.classList.replace("tileView", "listView");
  } else if (viewState === "false") {
    showListStorage.classList.remove("--addDimmer");
    showTileStorage.classList.add("--addDimmer");
    itemsList.classList.replace("listView", "tileView");
  }
}

function scrolled() {
  if (window.scrollY >= 50) {
    document.body.style.paddingTop = 0.3 + "px";
    doodleHeader.classList.add("--sticky--header");
  } else {
    document.body.style.paddingTop = 0;
    doodleHeader.classList.remove("--sticky--header");
  }
}

function adjustToScrolled(wClass) {
  if (clicked === "true") {
    wrapper.classList.add(wClass);
  } else {
    wrapper.classList.remove(wClass);
    window.addEventListener("scroll", scrolled);
  }
}
