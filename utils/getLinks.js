function getLinks(dom) {
    let links = Array.prototype.map.call(dom.window.document.querySelectorAll('*[href]'),
    (link) => {return link.href});
    return links;
}

module.exports = getLinks;