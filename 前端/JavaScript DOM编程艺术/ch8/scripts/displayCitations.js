function displayCitations() {
    const quotes = [...document.getElementsByTagName('blockquote')];

    for (const quote of quotes) {
        if (!quote.getAttribute('cite'))
            continue;
        
        const url = quote.getAttribute('cite');
        const quoteChildren = quote.getElementsByTagName('*');
        if (quoteChildren.length < 1)
            continue;
        const elem = quoteChildren[quoteChildren.length - 1];

        const link = document.createElement('a');
        const link_text = document.createTextNode('source');
        link.appendChild(link_text);
        link.setAttribute('href', url);

        const superscript = document.createElement('sup');
        superscript.appendChild(link);
        elem.appendChild(superscript);
    }
}

addLoadEvent(displayCitations);