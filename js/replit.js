'use strict';

// creating a class element
class Elem {
   constructor(element, iterate){
    this.iterate = iterate;
    this.element = function(){
      if(iterate){
        let nodes;  
        nodes = document.querySelectorAll(element);  
        return new Set(nodes);

      } else{
         return document.querySelector(element);
      }
    }();
  }
}

// extending to class element properties and methods
class Props extends Elem {
  constructor(element, iterate){
    super(element, iterate)
  }

  classlist(node, val, rule, {setListener = true, event = 'click', global = null} = {}) {
    if(setListener){
      if(global){
        global.addEventListener(event, function() {
          node.classList[`${val}`](rule);
        });
      } else {
         node.addEventListener(event, function() {
          this.classList[`${val}`](rule);
        });
      } 
      
    } else {
       node.classList[`${val}`](rule);
    }
  }

  setAttrib(node, val, rule, {setListener = false, event = 'click', global = null} = {}){
     if(setListener){
        node.addEventListener(event, function() {
          this.setAttribute(val, rule);
        });
     } else {
        node.setAttribute(val, rule);
     }
  }

  stylelist(node, val, rule, {setListener = false, event = 'click', global = null} = {}){
    if(setListener){
      if(global){
          global.addEventListener(event, function() {
            node.style[`${val}`] = rule;
        }); 
      }
      else {
          node.addEventListener(event, function() {
          this.style[`${val}`] = rule;
      });
    }
       
    } else {
        node.style[`${val}`] = rule;
    }
  }
}

// create nodelist && iterator
let newSet = new Props('.--styleLists', true);
let anotherSet = new Props('h3', false);

let {classlist, stylelist, setAttrib} = new Props();

// preparing for localStorage and state management
// assigning element values.
function init(setObj){
  if(setObj.element.size > 1){
    let iterator = setObj.element[Symbol.iterator]();

    const newMap = new Map();
    let count = 1;
    while(count <= setObj.element.size){
     newMap.set(`list${count}`, iterator.next().value);
      count++;
    }
    return newMap;
  } else {
    return setObj.element;
  }
}


// let list1 = iterator.next().value;
// let list2 = iterator.next().value;
// let list3 = iterator.next().value;
// let list4 = iterator.next().value;
// let h3 = anotherSet.element;
let h3 = init(anotherSet);

let mapElements = init(newSet);

let list1 = mapElements.get('list1');


// console.log(newSet.element.size);

// classlist(list4, 'add', 'addPurple');
// classlist(list3, 'add', 'addBlue');
// classlist(list1, 'add', 'makeFat', {event: 'load', global: this});
// classlist(list1, 'add', 'makeItalic');
classlist(h3, 'add', 'makeItalic', {setListener: true});

classlist(list1, 'add', 'addRed');
// classlist(list2, 'add', 'addGreen');

// stylelist(list1, 'backgroundColor', 'lightgrey', {setListener: false});

// setAttrib(list1, 'value', 'brad');

// stylelist(list2, 'backgroundColor', 'lightgreen');
// stylelist(list2, 'lineHeight', 4 + 'rem');
