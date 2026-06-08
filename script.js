function getBrowserName() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Edg")) {
    return "Microsoft Edge";
  } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    return "Opera";
  } else if (userAgent.includes("Chrome")) {
    return "Google Chrome";
  } else if (userAgent.includes("Firefox")) {
    return "Mozilla Firefox";
  } else if (userAgent.includes("Safari")) {
    return "Apple Safari";
  } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
    return "Internet Explorer";
  }
  
  return "Unknown Browser";
}

function updateInformation() {
    let browserName = getBrowserName();
    let timeString = new Date().toLocaleTimeString();
    let dateString = new Date().toLocaleDateString();

    let browserEl = document.getElementById("browser");
    let timeEl = document.getElementById("time");
    let dateEl = document.getElementById("date");

    browserEl.textContent = browserName;
    timeEl.textContent = timeString;
    dateEl.textContent = dateString;
}

// Adapted from (https://jams.hackclub.com/batch/webOS/part-3), originally W3 School
// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
    // Step 2: Set up variables to keep track of the element's position.
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;

    windowNavEl = element.parentElement.querySelector('.window-header');
    windowEl = element.parentElement;
    // Step 3: Check if there is a special header element associated with the draggable element.
    if (windowNavEl) {
        // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
        // This allows you to drag the window around by its header.
        windowNavEl.onmousedown = startDragging;
    } else {
        // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
        // This allows you to drag the window by holding down anywhere on the window.
        element.onmousedown = startDragging;
    }

    // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();
        // Step 7: Get the mouse cursor position at startup.
        initialX = e.clientX;
        initialY = e.clientY;
        // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
        document.onmouseup = stopDragging;
        document.onmousemove = dragElement;
    }

    // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
    function dragElement(e) {
        e = e || window.event;
        e.preventDefault();
        // Step 10: Calculate the new cursor position.
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
        windowEl.style.top = (windowEl.offsetTop - currentY) + "px";
        windowEl.style.left = (windowEl.offsetLeft - currentX) + "px";
    }

    // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


// ---------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    setInterval(updateInformation, 1000)
    
    document.querySelectorAll(".window-nav").forEach((el) => dragElement(el))
    
    document.querySelectorAll(".window-nav .btn-close").forEach((el) => {
        el.addEventListener("click", () => el.parentElement.parentElement.style.display = "none");
    })
});


