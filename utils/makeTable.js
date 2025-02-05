/**
 * Takes an instance of the JSDOM class and returns all html tables as an array of arrays.
 * @param {jsdom.JSDOM} dom The document object model, an instance of the JSDOM class.
 * @returns {string[]} tables
 */
function makeTable(dom) {
    headers = Array.prototype.map.call(dom.window.document.querySelectorAll('table'), table => 
      Array.prototype.map.call(table.querySelectorAll('thead tr'), tr =>
          Array.prototype.map.call(tr.querySelectorAll('th'), th =>
              th.textContent.trim())));

    body = Array.prototype.map.call(dom.window.document.querySelectorAll('tbody'), tbody => 
        Array.prototype.map.call(tbody.querySelectorAll('tr'),tr => 
            Array.prototype.map.call(tr.querySelectorAll('td, th'), td =>
                td.textContent.trim())));

    tables = [];
    for (let i = 0; i < headers.length; i++) {
        content = headers[i].concat(body[i]);
        tables.push(content);
    }
    
    return tables;
}

module.exports = makeTable;

