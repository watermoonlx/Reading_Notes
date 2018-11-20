function addLoadEvent(func) {
    const oldOnload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = () => {
            oldOnload();
            func();
        }
    }
}