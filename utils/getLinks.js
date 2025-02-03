function getLinks(dom) {
    let links = Array.prototype.map.call(dom.window.document.querySelectorAll('*[href]'), link =>
        {
            var linkObject = {};
            linkObject.href = link.href;
            linkObject.nodeName = link.nodeName.toLowerCase();
            linkObject.outerHTML = link.outerHTML;
            linkObject.innerHTML = link.innerHTML;
            linkObject.parentElement = link.parentElement.nodeName.toLowerCase();
            return linkObject
        });
    return links;
}

module.exports = getLinks;