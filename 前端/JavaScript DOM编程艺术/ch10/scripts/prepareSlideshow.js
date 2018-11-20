function prepareSlideshow() {

    const slideshow = document.createElement('div');
    slideshow.setAttribute('id', 'slideshow');

    const preview = document.createElement('img');
    preview.setAttribute('src', 'images/topics.jpg');
    preview.setAttribute('alt', 'building blocks of web design');
    preview.setAttribute('id', 'preview');
    slideshow.appendChild(preview);

    const list = document.getElementById('linklist');
    insertAfter(slideshow, list);

    const links = document.querySelectorAll('#linklist a');

    const step = -72;
    for (let index = 1; index <= links.length; index++) {
        links[index - 1].onmouseover = function () {
            moveElement('preview', step * index, 0, 5);
        }
    }
}

addLoadEvent(prepareSlideshow);