function positionMessage() {
    const elem = document.getElementById("message");
    elem.style.position = "absolute";
    elem.style.left = "50px";
    elem.style.top = "100px";

    moveElement('message', 125, 25, 20);
}

addLoadEvent(positionMessage);