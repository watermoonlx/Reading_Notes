function stripeTables() {
    if (!document.getElementsByTagName)
        return false;

    var tables = document.getElementsByTagName('table');
    for (const table of tables) {
        let odd = false;
        const rows = table.getElementsByTagName('tr');
        for (const row of rows) {
            if (odd) {
                row.style.backgroundColor = "#ffc";
            }
            odd = !odd;
        }
    }
}

addLoadEvent(stripeTables);