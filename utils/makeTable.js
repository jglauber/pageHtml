function makeTable(dom) {
    let headers = Array.prototype.map.call(dom.window.document.querySelectorAll('thead tr'), function(tr){
        return Array.prototype.map.call(tr.querySelectorAll('th'), function(th){
            return th.textContent.trim();
            });
        });

    let body = Array.prototype.map.call(dom.window.document.querySelectorAll('tbody tr'), function(tr){
        return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
            if (td.textContent.trim() === '') {
              let children = td.children;
              let div = children[0]
              if (children[0] !== undefined) {
                return div.title.trim();
              } else {
                return td.textContent.trim();
              }     
            }
            return td.textContent.trim();      
            });
        });

    let table = Array.prototype.concat(headers,body);
    
    return table;
}

module.exports = makeTable;

