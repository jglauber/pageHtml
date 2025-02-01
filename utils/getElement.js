function getElement(dom,elementString) {
    return dom.window.document.querySelector(elementString).textContent;
}

module.exports = getElement;