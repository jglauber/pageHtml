/**
 * Takes an instance of the JSDOM class and returns all href links.
 * @param {jsdom.JSDOM} dom The document object model, an instance of the JSDOM class.
 * @returns {Array.<{href: string,
 * nodeName: string,
 * outerHTML: string,
 * innerHTML: string,
 * parentElement: string}>}
 * links: an array of objects containing relevant link information.
 */
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