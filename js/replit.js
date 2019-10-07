"use strict";

/* MD20_classHandler */

"use strict";

// creating a class element
class Elem {
  constructor(element, iterate) {
    this.iterate = iterate;
    this.element = (function() {
      if (iterate) {
        let nodes = document.querySelectorAll(element);
        return new Set(nodes);
      } else {
        return document.querySelector(element);
      }
    })();
  }
}

// extending to class element properties and methods
class Props extends Elem {
  constructor(element, iterate) {
    super(element, iterate);
  }

  method(pName, node, val, rule, { setListener = true, event = "click" } = {}) {
    const eStyler = node => {
      if (setListener && node.target.parentElement !== document.body) {
        node = node.target.parentElement;
      } else if (setListener && node.target) {
        node = node.target;
      } else node;

      if (pName === "classlist") {
        node.classList[`${val}`](rule);
      } else if (pName === "setAttribute") {
        node.setAttribute(val, rule);
      } else if (pName === "style") {
        node.style[`${val}`] = rule;
      } else console.log("pName has no matching value");
    };

    if (setListener) {
      if (node.size > 1) {
        node.forEach(n => {
          n.addEventListener(event, eStyler);
        });
      } else {
        node.addEventListener(event, eStyler);
      }
    } else {
      if (node.size > 1) {
        node.forEach(n => {
          eStyler(n);
        });
      } else eStyler(node);
    }
  }
}

// destructuring Props methods
let { method } = new Props();

// preparing for state management
function init(setObj) {
  if (setObj.element.size > 1) {
    let iterator = setObj.element[Symbol.iterator]();

    const newMap = new Map();
    let count = 1;
    while (count <= setObj.element.size) {
      newMap.set(`list${count}`, iterator.next().value);
      count++;
    }
    return newMap;
  } else {
    return setObj.element;
  }
}

// initializing constructs
let newSet = new Props(".--styleLists", true);
let mapElements = init(newSet);

let anotherSet = new Props("h3", false);
let h3 = init(anotherSet);
let body = document.querySelector("body");

let list1 = mapElements.get("list1");
let list2 = mapElements.get("list2");
let list3 = mapElements.get("list3");
let list4 = mapElements.get("list4");

// method('classlist', list4, 'add', 'addPurple');
// method('classlist', list3, 'add', 'addBlue');
// method('classlist', body, 'add', 'makeFat', {setListener: false});
// method('classlist', list1, 'add', 'makeItalic');
// method('classlist', h3, 'add', 'makeItalic');

// method('classlist', list1, 'add', 'addRed', {setListener: false});
// method('classlist', mapElements, 'add', 'addRed');
// method('classlist', list2, 'add', 'addGreen');
// method('style', mapElements, 'backgroundColor', 'lightgrey', {setListener: true});

// method('setAttribute', mapElements, 'value', 'brad', {setListener: false});

// method('style', list2, 'backgroundColor', 'lightgreen');
// method('style', list2, 'lineHeight', 4 + 'rem');
