/* TODO
    * Keyboard shortcuts
        * Search bar
    * Fake files
    * Light dark mode
*/
/* Apps:
    * Calculator
    * Notes
    * Stopwatch
    * Browser
*/

function getBrowserName() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Edg")) {
        return "Edge";
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
        return "Opera";
    } else if (userAgent.includes("Chrome")) {
        return "Chrome";
    } else if (userAgent.includes("Firefox")) {
        return "Firefox";
    } else if (userAgent.includes("Safari")) {
        return "Safari";
    } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
        return "Internet Explorer";
    }

    return "Unknown Browser";
}
function getOSName() {
  const ua = navigator.userAgent;

  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";

  return "Unknown";
}

const browserName = getBrowserName();
const OSName = getOSName();


const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function updateInformation() {
    // let browserName = getBrowserName();
    // let OSName = getOSName();
    let timeString = new Date().toLocaleTimeString();
    let dateString = new Date().toLocaleDateString();

    let browserEl = document.getElementById("browser");
    let timeEl = document.getElementById("time");
    let dateEl = document.getElementById("date");

    browserEl.textContent = `${browserName}/${OSName}`;
    timeEl.textContent = timeString;
    dateEl.textContent = dateString;
}

function closeWindow(windowEl) {
    windowEl.style.display = "none";
}
function openWindow(windowEl) {
    windowEl.style.display = "flex";
    bringToFront(windowEl);
}

function saveWindowData() {
    let windowData = {};
    windows.forEach((windowEl) => {
        let name = windowEl.getAttribute("name");
        let data = {};

        data["left"] = windowEl.style.left;
        data["top"] = windowEl.style.top;
        data["width"] = windowEl.style.width;
        data["height"] = windowEl.style.height;
        data["zIndex"] = windowEl.style.zIndex;
        data["isOpen"] = windowEl.style.display != "none";

        windowData[name] = data;
    });

    console.log(document.getElementById("note-app-note").value)
    windowData["noteContent"] = [document.getElementById("note-app-note").value];

    window.localStorage.setItem("windowData", JSON.stringify(windowData));
}

function loadWindowData() {
    // Update window positions
    let windowData = JSON.parse(window.localStorage.getItem("windowData"));
    if (windowData) {
        windows.forEach((windowEl) => {
            let name = windowEl.getAttribute("name");
            let data = windowData[name];

            if (data) {

                let desktopEl = document.getElementById("desktop");
                let desktopNavEl = document.getElementById("desktop-nav");
                let windowNavEl = windowEl.querySelector(".window-nav");

                const minX = - (windowNavEl.clientWidth / 2);
                const maxX = (desktopEl.clientWidth - windowNavEl.clientWidth) + (windowNavEl.clientWidth / 2);
                const minY = desktopNavEl.clientHeight;
                const maxY = desktopNavEl.clientHeight + desktopEl.clientHeight - windowNavEl.clientHeight;
                
                windowEl.style.left = data["left"];
                windowEl.style.top = data["top"];
                windowEl.style.width = data["width"];
                windowEl.style.height = data["height"];
                windowEl.style.zIndex = data["zIndex"];
                windowEl.style.display = data["isOpen"] ? "flex" : "none";

                windowEl.style.left = clamp(parseInt(windowEl.style.left), minX, maxX) + "px";
                windowEl.style.top = clamp(parseInt(windowEl.style.top), minY, maxY) + "px";
            }

            console.log(windowData["noteContent"][0])
            document.getElementById("note-app-note").value = windowData["noteContent"][0];
            console.log(document.getElementById("note-app-note").value)
        });

    }
}

function resetWindowData() {
    window.localStorage.removeItem("windowData");
}

function navigate(url) {
    const page = document.getElementById("browser-page");
    
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    page.src = url;
}

function handleBrowser() {
    const form = document.getElementById("search-form");
    const urlBar = document.getElementById("url-bar");
    const goBtn = document.getElementById("search");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); 

        let url = urlBar.value.trim();
        navigate(url);
    });

}

let activeWindow = null;
// Adapted from (https://jams.hackclub.com/batch/webOS/part-3), originally W3 School
// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
    // Step 2: Set up variables to keep track of the element's position.
    var initialX = 0;
    var initialY = 0;
    var deltaX = 0;
    var deltaY = 0;
    var dragOffsetX = 0;
    var dragOffsetY = 0;

    let snapBackDist = 20

    let desktopEl = document.getElementById("desktop");
    let desktopNavEl = document.getElementById("desktop-nav");
    let windowEl = element;
    let windowNavEl = element.querySelector(".window-nav");
    let windowContentEl = element.querySelector(".window-content");
    let windowName = element.getAttribute("name");

    const minX = - (windowNavEl.clientWidth / 2);
    const maxX = (desktopEl.clientWidth - windowNavEl.clientWidth) + (windowNavEl.clientWidth / 2);
    const minY = desktopNavEl.clientHeight;
    const maxY = desktopNavEl.clientHeight + desktopEl.clientHeight - windowNavEl.clientHeight;

    // Make double click fullscreen the window
    windowNavEl.addEventListener("dblclick", (e) => {
        windowEl.style.width = "100%";
        windowEl.style.height = "100%";
        let positionX = ((desktopEl.style.width) / 2) - ((windowEl.style.width) / 2)
        let positionY = ((desktopEl.style.height) / 2) - ((windowEl.style.height) / 2)
        windowEl.style.left = clamp(positionX, minX, maxX) + "px";
        windowEl.style.top = clamp(positionY, minY, maxY) + "px";
    })

    // Step 3: Check if there is a special header element associated with the draggable element.
    if (windowNavEl) {
        // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
        // This allows you to drag the window around by its header.
        windowNavEl.addEventListener("mousedown", startDragging);
    } else {
        // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
        // This allows you to drag the window by holding down anywhere on the window.
        windowEl.onmousedown = startDragging;
    }

    // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();
        // Step 7: Get the mouse cursor position at startup.
        initialX = e.clientX;
        initialY = e.clientY;

        // Get the viewport-relative bounding rectangle of the target element
        const rect = e.currentTarget.getBoundingClientRect();

        // Calculate X and Y mouse pos relative to element
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
        document.addEventListener("mouseup", stopDragging);
        document.addEventListener("mousemove", elementDrag);
    }

    // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
    function elementDrag(e) {

        e = e || window.event;
        e.preventDefault();
        // Step 10: Calculate the new cursor position.
        deltaX = initialX - e.clientX;
        deltaY = initialY - e.clientY;

        positionX = initialX - deltaX - dragOffsetX;
        positionY = initialY - deltaY - dragOffsetY;

        // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
        windowEl.style.left = clamp(positionX, minX, maxX) + "px";
        windowEl.style.top = clamp(positionY, minY, maxY) + "px";
        // windowEl.style.left = positionX + "px";
        // windowEl.style.top = positionY + "px";
    }

    // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
    function stopDragging() {
        document.removeEventListener("mouseup", stopDragging)
        document.removeEventListener("mousemove", elementDrag)

        windowEl.style.left = clamp(parseInt(windowEl.style.left), minX + snapBackDist, maxX - snapBackDist) + "px";
        windowEl.style.top = clamp(parseInt(windowEl.style.top), minY, maxY - snapBackDist) + "px";

        window.localStorage.setItem(windowName, [windowEl.style.left, windowEl.style.top]);
    }
}

function bringToFront(windowEl) {
    activeWindow = windowEl;
    windows.forEach((el) => {
        el.style.zIndex = clamp((el.style.zIndex - 1), 3, 999);
    });
    activeWindow.style.zIndex = windows.length + 2;
}

function toggleFullScreen(element) {
    const documentEl = document.documentElement;

    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) {
        if (!document.fullscreenElement) {
            // If the document can fullscreen and is not already in full screen mode
            // make the element full screen
            requestMethod.call(element);
        } else {
            // Otherwise exit the full screen
            document.exitFullscreen?.();
        }
    } else {
        if (!document.fullscreenElement) {
            documentEl.requestFullscreen?.();
        } else {
            documentEl.exitFullscreen?.();
        }
    }
}





// ---------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    windows = document.querySelectorAll(".window");
    
    // Update clock, date, etc. once per second
    setInterval(updateInformation, 1000);
    
    loadWindowData();
    
    // Make all windows draggable
    windows.forEach((el) => {
        dragElement(el);
        
        // Make windows go to front when clicked
        el.addEventListener("mousedown", e => bringToFront(el))
    });
    
    // Make close buttons work
    document.querySelectorAll(".window-nav .btn-close").forEach((el) => {
        el.addEventListener("click", () => closeWindow(el.parentElement.parentElement));
    })

    // Make inlinks open windows
    document.querySelectorAll(".inlink").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            openWindow(document.querySelector(`[name='${link.getAttribute("data-window")}']`))

        })
    });

    // Make menu bar open context menu
    document.querySelectorAll("#menus > li").forEach((item) => {
        let menuEl = item.querySelector(".menu");
        item.addEventListener("click", (e) => {
            e.stopPropagation();

            menuEl.style.display = "flex";
            menuEl.style.opacity = 1;
            const closeMenu = () => {
                // Smooth transition
                document.removeEventListener("click", closeMenu)
                menuEl.style.opacity = 0;
                setTimeout(() => {menuEl.style.display = "none"; menuEl.style.opacity = 1;}, 200);
            };

            document.addEventListener("click", closeMenu);
        });
    });

    // Make menu buttons open windows and do things
    document.querySelectorAll("#menus li ul li").forEach((menuItem) => {
        menuItem.addEventListener("click", (e) => {
            if (menuItem.getAttribute("data-window")) {
                e.preventDefault();
                openWindow(document.querySelector(`[name='${menuItem.getAttribute("data-window")}']`))
            }
            switch (menuItem.getAttribute("id")) {
                case "menu-window-fullscreen-os": 
                    e.preventDefault();
                    toggleFullScreen(document);
                    break;

                case "menu-window-fullscreen-window":
                    e.preventDefault();
                    activeWindow.style.width = "100%";
                    activeWindow.style.height = "100%";
                    let desktopEl = document.getElementById("desktop");
                    let desktopNavEl = document.getElementById("desktop-nav");
                    let positionX = ((desktopEl.style.width) / 2) - ((activeWindow.style.width) / 2)
                    let positionY = ((desktopEl.style.height) / 2) - ((activeWindow.style.height) / 2)
                    activeWindow.style.left = clamp(positionX, minX, maxX) + "px";
                    activeWindow.style.top = clamp(positionY, minY, maxY) + "px";
                    break;

                case "menu-window-close-window":
                    closeWindow(activeWindow);
                    console.log("a")
                    break;

                case "menu-window-close-all":
                    windows.forEach((win) => {closeWindow(win)})
                    break;
            }

        })
    });

    handleBrowser();

});

// Save windows every 5 seconds
setInterval(saveWindowData, 5000);

