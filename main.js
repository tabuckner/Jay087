const boxes = Array.from(document.querySelectorAll(".box"));
const wrapper = document.querySelector(".wrapper");
const body = document.querySelector("body");
const box = document.querySelectorAll(".box");
let leftMargin = 60; //px
let panelsAreExtended = false; // flag to update if on hover panels are extended
let boxesFlagArray = []; // flag for stacked panels
for (var i = 0; i < boxes.length; i++) {
  boxesFlagArray.push({
    "isStacked": false,
    "isExpanded": false
  });
}

wrapper.addEventListener("scroll", scrollWrap);
boxes.forEach((box, index) => box.addEventListener("mouseenter", hoverAnimations));
boxes.forEach((box, index) => box.addEventListener("mouseleave", hoverAnimations));

function scrollWrap(e) {
  let scrollCoord = wrapper.scrollLeft; // horizontal scroll value

  boxes.forEach((box, index) => {
    let leftMarginStop = (index) * leftMargin; // calculation for left margin stop (60, 120, 180,...)
    const boxCoord = box.getBoundingClientRect();
    const leftSideOfCurrent = boxCoord.left; // coordinarion of left side of panel
    const rightSideOfCurrent = boxCoord.right; // coordinarion of right side of panel
    const leftSideOfNextItem = (index < boxes.length - 1) ? box.nextElementSibling.getBoundingClientRect().left : 0; // coordinarion of left side of NEXT panel (when index is 8, the next sibling is 0 if it is less than 8 than it is next sibling)

    box.style.left = `${leftMarginStop}px`;

    // control shadow of all 0+ elements
    if (leftSideOfCurrent <= leftMarginStop) {
      box.nextElementSibling.classList.add("shadow");
    }
    // control removal of shadow of all 0+ elements
    if (leftSideOfNextItem === rightSideOfCurrent) {
      box.nextElementSibling.classList.remove("shadow");
    }
    // when panel 5 reach left margin, left margin change from 60 to 30 to all panels
    if (index > 4 && leftSideOfCurrent <= leftMarginStop) {
      leftMargin = 20;
    } else if (index < 6 && leftSideOfCurrent > leftMarginStop && !boxes[index].classList.contains('shadow')) {
      leftMargin = 60;
    }
    // setting flag (true/false) to stacked panels (reached leftMarginStop)
    if (leftMarginStop == leftSideOfCurrent && index > 0) {
      if (!boxesFlagArray[index - 1].isStacked) {
        boxesFlagArray[index - 1].isStacked = true;
      }
    }
    if (leftMarginStop != leftSideOfCurrent && index > 0) {
      if (boxesFlagArray[index - 1].isStacked) {
        boxesFlagArray[index - 1].isStacked = false;
      }
    }

  });
}

function hoverAnimations(event) {
  console.log(event);
  let meta = {};
  meta.targetElementIndex = boxes.indexOf(this); // TODO: Do we need this?
  meta.isPanelStacked = boxesFlagArray[boxes.indexOf(this)].isStacked;
  meta.fromBoxIndex = boxes.indexOf(event.fromElement);
  meta.toBoxIndex = boxes.indexOf(event.toElement);
  meta.fromBodyOrWrapper = (event.fromElement == body || event.fromElement == wrapper);
  // Is there an edge case we're missing? ^
  meta.fromBox = event.fromElement.classList.contains('box')
  meta.isBox = event.toElement.classList.contains("box");
  
  if (event.type === 'mouseenter' && meta) {
    onHover(event, meta);
  } else if (event.type === 'mouseleave' && meta) {
    onHoverLeave(event, meta)
  }
}

function onHover(event, meta) {
  const boxShouldAnim = meta.fromBodyOrWrapper && meta.isBox && meta.isPanelStacked && !meta.panelsAreExtended;

  if (boxShouldAnim) {
    // when from body to box, extend all pannels from hover + 100px
    for (let box of boxes) {
      const boxIndex = boxes.indexOf(box);
      if (boxIndex > meta.targetElementIndex) {
        const boxCoord = box.getBoundingClientRect();
        box.style.left = `${boxCoord.left + 100}px`;
        boxesFlagArray[boxIndex].isExpanded = true; // TODO: Change isExpanded to somethign that makes more sense. 
      }
    }
    panelsAreExtended = true;
  }
}

function onHoverLeave(event, meta) {
  // const boxShouldAnim = meta.fromBodyOrWrapper && meta.isBox && meta.panelsAreExtended;
  // Is this logic correct? ^
  const boxShouldAnim = meta.fromBox;

  if (boxShouldAnim) {
    // control the mouse from box to body when left margin is narrow or extended
    if (leftMargin === 20) {
      revertMargin(20);
    } else if (leftMargin === 60) {
      revertMargin(60);
    }
    panelsAreExtended = false;
  }
}

function revertMargin(multiplier) { // TODO: Refactor onHoverLeave to avoid iterating through entire array
  multiplier = Number(multiplier);

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].style.left = `${multiplier * i}px`;
    boxesFlagArray[i].isExpanded = true;
  }
}