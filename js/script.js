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
  doodleButtons: q(".doodle__buttons"),
  styleLists: q(".--styleLists"),
  footer: q("footer"),
  styleInputs: q(".--styleInputs")
};
let {
  wrapper,
  doodleHeader,
  message,
  output,
  content,
  showTileStorage,
  showListStorage,
  logo,
  doodleButtons,
  styleLists,
  footer,
  styleInputs
} = dom;

let clicked = localStorage.getItem("clicked");
let defValue = message.defaultValue;
let storage = localStorage;
let itemsList;
let mobileWatch = mobileWatcher();

//***** ******/
// on scrolled
//***** ******/

adjustToScrolled("--adjustWrapperHeight");
addElementShadow(footer);

//***** ******/
// on resize
//***** ******/

// media query for logo resizing

window.addEventListener("resize", setLogoView(mobileWatch));

//***** ******/
// on keypress
//***** ******/

message.addEventListener("keydown", messageClicked);
message.addEventListener("click", handlePostClick);

//***** ******/
// on load
//***** ******/

window.addEventListener("DOMContentLoaded", e => {
  // changes logo appearance
  setLogoView(mobileWatch);
  adjustToScrolled("--adjustWrapperHeight");

  // If there is storage send to UI
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
    insertEmptyMessage(doodleHeader);

    // Set clicked state if storage is empty
    if (localStorage.length < 1) {
      localStorage.setItem("clicked", false);
    }

    showTileStorage.style.display = "none";
    showListStorage.style.display = "none";

    let watch = window.matchMedia("(max-width: 600px)");
    if (watch.matches) {
      doodleButtons.classList.add("--addFlex");
      displaySvg(styleInputs);
      message.removeEventListener("keydown", messageClicked);
      message.blur();
    } else if (doodleButtons.classList.contains("--addFlex")) {
      doodleButtons.classList.remove("--addFlex");
      message.focus();
    }
  }
});

// message click
function messageClicked(e) {
  let messageInput = e.target;

  // header
  // message input
  messageInput.classList.add("--typed");
  messageInput.classList.add("--addAnimation");

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
    doodleButtons.classList.remove("--addCentering");

    // return everything as before
    doodleHeader.classList.remove("--moveToOrigin");
    messageInput.classList.remove("--typed");
    messageInput.classList.remove("--addAnimation");
    messageInput.style.transform = "none";
    doodleButtons.style.margin = "initial";
    logo.style.display = "initial";

    // If value is not a space and not empty
    if (html !== " " && html !== "") {
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
      message.defaultValue = defValue;
    }
    resetInput();
  }
}

// handle post click in message box
function handlePostClick(e) {
  if (defValue) e.srcElement.value = "";
  else e.srcElemen.defaultValue = defValue;
}

// remove buttons
function* removeOneElement(node) {
  let addClickEvent = () => {
    if (node.hasChildNodes()) {
      let nList = Array.from(node.childNodes);
      let item = nList[3];
      item.addEventListener("click", removeStorage);
    }
  };

  yield addClickEvent();
}

// find each list item
// remove storage and dom element.
function removeStorage(e) {
  let targetButton = e.target;
  let targetElem = targetButton.parentElement;

  localStorage.removeItem(`${targetElem.firstElementChild.textContent}`);
  targetElem.remove();

  //if storage is empty
  if (localStorage.length <= 1) {
    location.reload();
    message.focus();
    insertEmptyMessage(doodleHeader);
  }
}

// media query for mobile
function setLogoView(value) {
  if (value) {
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

  // return the last member of the nodelist array
  // itemsList = document.getElementById("itemsList");
  // let mostRecentItem = itemsList.lastChild;
  // mostRecentItem.id = Math.random;

  generator.next();
  generator.next(mostRecentItem);

  return;
}

function displayList(elem) {
  // set the view
  let view;
  if (clicked === "true") {
    view = "listView";
  } else if (clicked === "false") {
    view = "tileView";
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

  // doodleButtons.addEventListener("touchstart", e => {
  //   if (e.target === showListStorage) {
  //     clicked = "true";
  //     localStorage.setItem("clicked", true);
  //     applyView(clicked);
  //   } else if (e.target === showTileStorage) {
  //     clicked = "false";
  //     localStorage.setItem("clicked", false);
  //     applyView(clicked);
  //     adjustToScrolled("--adjustWrapperHeight");
  //   }
  // });

  // doodleHeader.addEventListener("touchstart", e => {
  //   e.preventDefault();
  //   doodleHeader.scrollTo = 0 + "px";
  // });
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
  message.focus();
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
    // observer
    addStickyObserver();
  }
}

function mobileWatcher() {
  let watch = window.matchMedia("(max-width: 600px)");
  return watch.matches;
}

function addStickyObserver() {
  function callback() {
    let classAttrib = doodleHeader.classList.contains("--sticky--header");
    if (classAttrib) {
      console.log("mutation activated");
    }
  }

  let observer = new MutationObserver(callback);
  observer.observe(wrapper, { subtree: true, childList: true });
}

function addElementShadow(elem) {
  window.addEventListener("scroll", function(e) {
    if (window.scrollY >= 5) {
      elem.style.boxShadow = "0px -26px 47px rgba(0, 0, 0, 0.07)";
    } else {
      elem.style.boxShadow = "none";
    }
  });
}

function displaySvg(elem) {
  let html = `<svg class="doodle__button" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 210 209") <g id="Artboard_1" data-name="Artboard 1"> <path class="cls-1"
  d="M159.5,22A87.5,87.5,0,1,1,72,109.5,87.5,87.5,0,0,1,159.5,22ZM161,44V176m83-68M76,108m145,2L95,109" transform="translate(-55 -2)"></path></g></svg>`;

  elem.insertAdjacentHTML("beforebegin", html);
}

///////////
// FUNCTIONS
//////////
function chromeHack() {
  let ua = window.navigator.vendor;
  let regex = new RegExp(/Google Inc./);
  let google = regex.test(ua);
  console.log(typeof google);
  let watch = window.matchMedia("(min-width:1000px)");

  if (google && watch.matches) {
    content.style.setProperty(
      "transform",
      "translateY(calc(16px + -6vh))",
      "important"
    );
  } else {
    content.style.setProperty(
      "transform",
      "translateY(calc(16px + -7vh))",
      "important"
    );
  }
}
chromeHack();

function insertEmptyMessage(element) {
  element.insertAdjacentHTML(
    "afterend",
    `<h2 class='--emptyStorage'>Time to make a doodle!</h2>`
  );
}
