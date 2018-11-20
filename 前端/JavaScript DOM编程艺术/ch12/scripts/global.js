//#region utils
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

function insertAfter(newElement, targetElement) {
    const parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

function addClass(element, value) {
    if (!element.clasName) {
        element.className = value;
    } else {
        element.className = `${element.className} ${value}`;
    }
}

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

function showSection(id) {
    const sections = document.querySelectorAll('section');
    for (const sec of sections) {
        if (sec.getAttribute('id') != id) {
            sec.style.display = 'none';
        } else {
            sec.style.display = 'block';
        }
    }
}
//#endregion

/**
 * 高亮导航按钮中当前页
 */
function highlightPage() {
    const links = document.querySelectorAll('header nav a');
    for (let link of links) {
        const linkUrl = link.getAttribute('href');
        if (window.location.href.indexOf(linkUrl) > -1) {
            link.className = 'here';
            const linkText = link.lastChild.nodeValue.toLowerCase();
            document.body.setAttribute('id', linkText);
        }
    }
}

/**
 * 为链接生成预览图像
 */
function prepareSlidshow() {
    const intro = document.querySelector('#intro');
    if (!intro)
        return false;

    const slideshow = document.createElement('div');
    slideshow.setAttribute('id', 'slideshow');

    const preview = document.createElement('img');
    preview.setAttribute('src', 'images/slideshow.gif');
    preview.setAttribute('alt', 'a glimpse of what you awaits you');
    preview.setAttribute('id', 'preview');
    slideshow.appendChild(preview);

    const frame = document.createElement('img');
    frame.setAttribute('src', 'images/frame.gif');
    frame.setAttribute('alt', '');
    frame.setAttribute('id', 'frame');
    slideshow.appendChild(frame);

    insertAfter(slideshow, intro);

    const links = document.querySelectorAll('a');
    for (const link of links) {
        link.onmouseover = function () {
            const dest = this.getAttribute('href');
            if (dest.indexOf('index.html') > -1) {
                moveElement('preview', 0, 0, 5);
            } else if (dest.indexOf('about.html') > -1) {
                moveElement('preview', -150, 0, 5);
            } else if (dest.indexOf('photos.html') > -1) {
                moveElement('preview', -300, 0, 5);
            } else if (dest.indexOf('live.html') > -1) {
                moveElement('preview', -450, 0, 5);
            } else if (dest.indexOf('contact.html') > -1) {
                moveElement('preview', -600, 0, 5);
            }
        }
    }
}

/**
 * 创建页面内部链接
 */
function prepareInternalnav() {
    const links = document.querySelectorAll('article nav a');
    if (links.length === 0)
        return false;

    for (const link of links) {
        const secId = link.getAttribute('href').split('#')[1];
        const sec = document.getElementById(secId);
        if (!sec)
            continue;
        sec.style.display = 'none';

        link.onclick = () => {
            showSection(secId);
            return false;
        }
    }
}

function preparePlaceholder() {
    if (!document.createElement) return false;
    if (!document.createTextNode) return false;
    if (!document.getElementById) return false;
    if (!document.getElementById("imagegallery")) return false;
    var placeholder = document.createElement("img");
    placeholder.setAttribute("id", "placeholder");
    placeholder.setAttribute("src", "images/placeholder.gif");
    placeholder.setAttribute("alt", "my image gallery");
    var description = document.createElement("p");
    description.setAttribute("id", "description");
    var desctext = document.createTextNode("Choose an image");
    description.appendChild(desctext);
    var gallery = document.getElementById("imagegallery");
    insertAfter(description, gallery);
    insertAfter(placeholder, description);
}

function prepareGallery() {
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;
    if (!document.getElementById("imagegallery")) return false;
    var gallery = document.getElementById("imagegallery");
    var links = gallery.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = function () {
            return showPic(this);
        }
        links[i].onkeypress = links[i].onclick;
    }
}

function showPic(whichpic) {
    if (!document.getElementById("placeholder")) return true;
    var source = whichpic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    placeholder.setAttribute("src", source);
    if (!document.getElementById("description")) return false;
    if (whichpic.getAttribute("title")) {
        var text = whichpic.getAttribute("title");
    } else {
        var text = "";
    }
    var description = document.getElementById("description");
    if (description.firstChild.nodeType == 3) {
        description.firstChild.nodeValue = text;
    }
    return false;
}

function stripeTables() {
    if (!document.getElementsByTagName)
        return false;

    var tables = document.getElementsByTagName('table');
    for (const table of tables) {
        let odd = false;
        const rows = table.getElementsByTagName('tr');
        for (const row of rows) {
            if (odd) {
                addClass(row, 'odd');
            }
            odd = !odd;
        }
    }
}

function hightlightRows() {
    if (!document.getElementsByTagName) return false;

    const rows = document.getElementsByTagName('tr');
    for (const row of rows) {
        row.oldClassName = row.className;
        row.onmouseover = function () {
            addClass(this, 'highlight');
        }
        row.onmouseout = function () {
            row.className = row.oldClassName;
        }
    }
}

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

    if (dlist.childNodes.length < 1)
        return false;

    const header = document.createElement('h3');
    const header_text = document.createTextNode('Abbreviations');
    header.appendChild(header_text);

    const articles = document.querySelectorAll('article');
    if (articles.length === 0)
        return false;

    const container = articles[0];
    container.appendChild(header);
    container.appendChild(dlist);
}

function focusLabels() {
    const labels = document.querySelectorAll('label');
    for (const label of labels) {
        if (!label.getAttribute('for'))
            continue;

        label.onclick = function () {
            const id = this.getAttribute('for');
            if (!document.getElementById(id))
                return false;
            const elem = document.getElementById(id);
            elem.focus();
        }
    }
}

function resetFields(whichForm) {
    if (Modernizr.input.placeholder)
        return;

    for (const elem of whichForm.elements) {
        if (elem.type === 'submit')
            continue;

        const check = elem.placeholder || elem.getAttribute('placeholder');
        if (!check)
            continue;

        elem.onfocus = function () {
            const text = this.placeholder || this.getAttribute('placeholder');
            if (this.value === text) {
                this.className = '';
                this.value = '';
            }
        }

        elem.onblur = function () {
            if (this.value === '') {
                this.className = 'placeholder';
                this.value = this.placeholder || this.getAttribute('placeholder');
            }
        }

        elem.onblur();
    }
}

function prepareForms() {
    for (const form of document.forms) {
        resetFields(form);
        form.onsubmit = function () {
            return validateForm(this);
        }
    }
}

function isFilled(field) {
    if (field.value.replace(' ', '').length === 0)
        return false;
    
    const placeholder = field.placeholder || field.getAttribute('placeholder');
    return field.value !== placeholder;
}

function isEmail(field) {
    return field.value.indexOf('@') != -1 && field.value.indexOf('.') != -1;
}

function validateForm(whichForm) {
    for (const elem of whichForm.elements) {
        if (elem.required === 'required') {
            if (!isFilled(elem)) {
                alert(`Please fill in the ${elem.name} field.`);
                return false;
            }
        }

        if (elem.type === 'email') {
            if (!isEmail(elem)) {
                alert(`The ${elem.name} field must be a valid email address.`);
            }
            return false;
        }
    }
    return true;
}

function getHTTPObject() {
    if (typeof XMLHttpRequest === 'undefined') {
        XMLHttpRequest = function () {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP.6.0');
            }
            catch (e) { }

            try {
                return new ActiveXObject('Msxml2.XMLHTTP.3.0');
            }
            catch (e) { }

            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch (e) { }

            return false;
        }
    }
    return new XMLHttpRequest();
}

function displayAjaxLoading(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }

    const content = document.createElement('img');
    content.setAttribute('src', 'images/loading.gif');
    content.setAttribute('alt', 'Loading...');
    element.appendChild(content);
}

addLoadEvent(highlightPage);
addLoadEvent(prepareSlidshow);
addLoadEvent(prepareInternalnav);
addLoadEvent(preparePlaceholder);
addLoadEvent(prepareGallery);
addLoadEvent(stripeTables);
addLoadEvent(hightlightRows);
addLoadEvent(displayAbbreviations);
addLoadEvent(focusLabels);
addLoadEvent(prepareForms);


