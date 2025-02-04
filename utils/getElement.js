/**
 * Takes a document object model (dom) and a target element string and returns
 * the text content of that element.
 * @param {jsdom.JSDOM} dom The document object model, an instance of the JSDOM class.
 * @param {string} elementString The HTML element to query.
 * @returns 
 * 
 * @example
 * ```javascript
 * // Search the dom for div element with id 'container'.
 * let elementString = "div#container"
 * getElementText(dom,elementString)
 * ```
 * This will return any text content in the container element.
 */
function getElementText(dom,elementString) {
    let elementText = Array.prototype.map.call(dom.window.document.querySelectorAll(elementString), element =>
    {
        var elementTextObject = {};
        elementTextObject.elementText = element.textContent.trim();
        elementTextObject.nodeName = element.nodeName.toLowerCase();
        elementTextObject.outerHTML = element.outerHTML;
        elementTextObject.innerHTML = element.innerHTML;
        elementTextObject.parentElement = element.parentElement.nodeName.toLowerCase();
        return elementTextObject;

    })
    return elementText;
}

module.exports = getElementText;