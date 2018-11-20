function hightlightRows() {
    if (!document.getElementsByTagName) return false;

    const rows = document.getElementsByTagName('tr');
    for (const row of rows) {
        row.onmouseover = function () {
            console.log('over');
            this.style.fontWeight = "bold";
        }
        row.onmouseout = function () {
            console.log('out');
            this.style.fontWeight = "normal";
        }
    }
}

addLoadEvent(hightlightRows);