function moveElement(elementID, final_x, final_y, interval) {
    const elem = document.getElementById(elementID);

    if (elem.movement) {
        clearTimeout(elem.movement);
    }

    let cur_x = parseInt(elem.style.left || 0);
    let cur_y = parseInt(elem.style.top || 0);

    if (cur_x === final_x && cur_y === final_y) {
        return;
    }

    const dist_x = Math.abs(final_x - cur_x);
    const step_x = Math.ceil(dist_x / 10);

    if (cur_x < final_x) {
        cur_x += step_x;
    }
    if (cur_x > final_x) {
        cur_x -= step_x;
    }

    const dist_y = Math.abs(final_y - cur_y);
    const step_y = Math.ceil(dist_y / 10);

    if (cur_y < final_y) {
        cur_y += step_y;
    }
    if (cur_y > final_y) {
        cur_y -= step_y;
    }

    elem.style.left = `${cur_x}px`;
    elem.style.top = `${cur_y}px`;

    elem.movement = setTimeout(() => {
        moveElement(elementID, final_x, final_y, interval);
    }, interval);
}