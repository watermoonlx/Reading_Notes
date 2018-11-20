function displayAbbreviations() {
    const abbreviations = [...document.getElementsByTagName('abbr')];
    if (abbreviations.length < 1) {
        return false;
    }

    const defs = {};

    for (const abbr of abbreviations) {
        const key = abbr.lastChild.nodeValue;
        const def = abbr.getAttribute('title');
        defs[key] = def;
    }

    const dlist = document.createElement('dl');
    for (const key of Object.getOwnPropertyNames(defs)) {
        const dtitle = document.createElement('dt');
        const dtitle_text = document.createTextNode(key);
        dtitle.appendChild(dtitle_text);

        const ddesc = document.createElement('dd');
        const ddesc_text = document.createTextNode(defs[key]);
        ddesc.appendChild(ddesc_text);

        dlist.appendChild(dtitle);
        dlist.appendChild(ddesc);
    }

    const header = document.createElement('h2');
    const header_text = document.createTextNode('Abbreviations');
    header.appendChild(header_text);

    document.body.appendChild(header);
    document.body.appendChild(dlist);
}

addLoadEvent(displayAbbreviations);

