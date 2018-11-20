function displayAccesskeys() {
    const links = [...document.getElementsByTagName('a')];
    const acceessKeys = {};
    for (const link of links) {
        if (!link.getAttribute('accesskey'))
            continue;

        const key = link.getAttribute('accesskey');
        const text = link.lastChild.nodeValue;
        acceessKeys[key] = text;
    }

    const list = document.createElement('ul');
    for (key of Object.getOwnPropertyNames(acceessKeys)) {
        const text = acceessKeys[key];
        const str = key + ": " + text;
        const item = document.createElement("li");
        const item_text = document.createTextNode(str);
        item.appendChild(item_text);
        list.appendChild(item);
    }

    const header = document.createElement("h3");
    const header_text = document.createTextNode("Accesskeys");
    header.appendChild(header_text);

    document.body.appendChild(header);
    document.body.appendChild(list);
}

addLoadEvent(displayAccesskeys);