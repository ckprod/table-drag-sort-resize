;
if (typeof DEBUG === "undefined") DEBUG = true;

// debugging utils
function log() {
    var a = arguments[0],
                    s = arguments.length > 1 ? Array.prototype.slice.call(arguments) : a;

    if (typeof console !== "undefined" && typeof console.log !== "undefined") {
        console[/error/i.test(a) ? 'error' : /warn/i.test(a) ? 'warn' : 'log'](s);
    } else {
        alert(s);
    }
}

function benchmark(text, time) {
    log(text + " (" + (new Date().getTime() - time.getTime()) + "ms)");
}

(function () {
    "use strict";
  
    // This simple and small javascript solution for dragging html tables
    // is roughly based on
    // http://akottr.github.io/dragtable/
    // and
    // http://www.danvk.org/wp/dragtable/
    function TableDragSortResize(table, options) {
        if (table && table.tagName !== 'TABLE') {
            DEBUG && log('ERROR: DOM element/input is not a table!');
            console.log('ERROR: DOM element/input is not a table!');
            return '';
        }
        
        this.init(table, options || {});

        // The overriden placeholder methods
        this.mouseStart = function(event) {
            // check possible event (e.g. drag, etc.)
            this.dragSort = false;
            this.drag = false;
            this.resize = false;
            
            // last column, initial column
            this.lc = this.ic = event.target.parentNode.parentNode.cellIndex;
            //DEBUG && log('last column: ' + this.lc + ' initial column: ' + this.ic);
            
            var initialColumn = this.ic;

            if (!this.hr || initialColumn < 0 || this.hr.length < initialColumn) return false;
            
            if (hasClass(event.target, 'resize-text')) { // drag
                this.dragSort = true;
                //DEBUG && log('resize: ' + this.resize + ' dragSort: ' + this.dragSort);
                this.options.distance = 20;
                    
                // initial left, shifted left
                this.il = new Array(this.nc);
                this.sl = new Array(this.nc);
                
                // permutation memory
                this.pm = new Array(this.nhc);
                
                var tablePosition = getElementPosition(table),
                    initCellWidth = this.hr.cells[this.ic].offsetWidth;
                
                //DEBUG && log(tablePosition);
                //DEBUG && log('initCellWidth: ' + initCellWidth);
    
                // overlay - back
                var back = document.createElement("div");
                back.className = 'drag-base';
                back.id = 'drag-base';
                back.style.left = tablePosition.x + 'px';
                back.style.top = tablePosition.y + 'px';
                back.style.width = table.offsetWidth + 'px';
                back.style.height = this.hr.offsetHeight + 'px';
                back.style.zIndex = (table.style.zIndex || 0) + 1;
    
                // overlay - front
                for (var i = 0; i < this.nc; i++) {
                    this.pm[i] = i;
                    
                    var cell = this.hr.cells[i];
                    var pos = getElementPosition(cell);
                    this.il[i] = pos.x-tablePosition.x;
                    if (i<this.ic)
                        this.sl[i] = pos.x-tablePosition.x+initCellWidth;
                    if (i>this.ic)
                        this.sl[i] = pos.x-tablePosition.x-initCellWidth; 
                    if (i==this.ic)
                        this.sl[i] = pos.x-tablePosition.x;
                    
                    var front = document.createElement("div");
                    front.style.cssText = copyStyles(cell);
                    // doesnt work properly with firefox
                    //front.style.cssText = window.getComputedStyle(cell, "").cssText;
                    front.style.position = 'absolute';
                    front.style.left = pos.x - tablePosition.x + 'px';
                    front.style.backgroundColor = window.getComputedStyle(table, "").getPropertyValue("background-color");
                    front.style.zIndex = back.style.zIndex + 1;
                    front.innerHTML = cell.innerHTML;
    
                    // drag element
                    if (i == this.ic) this.de = front;
                    back.appendChild(front);
                }
                
                this.overlay = back;
                
                //DEBUG && log(this.il);
                //DEBUG && log(this.sl);
                //DEBUG && log(this.de);

            } else { // resize
                this.resize = true;
                //DEBUG && log('resize: ' + this.resize + ' dragSort: ' + this.dragSort);
                this.options.distance = 0;
                
                // set true width
                var cell = this.hr.cells[initialColumn],
                    width = window.getComputedStyle(cell, null).getPropertyValue("width");
                for (var i = 0; i < this.nr; i++) {
                    cell = table.rows[i].cells[initialColumn];
                    cell.style.maxWidth = cell.style.width = width;
                }                
                
                // replace current document cursor
                this.cur = document.body.style.cursor;
                document.body.style.cursor = 'col-resize';
            }

            return true;
        };        
        this.mouseDrag = function(event) {
            
            if (this.mouseDistanceMet(event)) {
                
                var dist = event.pageX - this.mouseDownEvent.pageX,
                    initialColumn = this.ic,
                    cell = this.hr.cells[initialColumn],
                    width = parseInt(cell.style.width);
                
                //DEBUG && log(width + ' - ' + dist);
                
                if (this.dragSort) { // drag
                    //DEBUG && log('drag: ' + this.drag);
                    if (!this.drag) {
                        document.body.appendChild(this.overlay);
                        
                        // replace current document cursor
                        this.cur = document.body.style.cursor;
                        document.body.style.cursor = 'move';
                    }
                    
                    this.drag = true;
                    
                    this.de.style.left = parseInt(this.de.style.left) + dist + 'px';
                    
                    var col = getTableColumn(table, event, this.lc),
                        layer = this.overlay.childNodes[this.pm[col]];
                    
                    if (col != this.lc) { // bubble
                        var direction = col - this.lc,
                            initialLeft = this.il[this.pm[col]],
                            shiftedLeft = this.sl[this.pm[col]];
                            
                        //DEBUG && log('last column: ' + this.lc + ' initial column: ' + this.ic + ' event column: ' + col);
                        //DEBUG && log('direction: ' + direction + ' initial left: ' + initialLeft + ' shifted left: ' + shiftedLeft);
                        if (direction<0) { // to the left
                            if (this.lc<=this.ic) { //left from drag column
                                layer.style.left = shiftedLeft+'px';
                            } else { // right from drag column
                                layer.style.left = initialLeft+'px';                        
                            }                    
                        } else { // to the right
                            if (this.lc>=this.ic) { //right from drag column
                                layer.style.left = shiftedLeft+'px';
                            } else { // left from drag column
                                layer.style.left = initialLeft+'px';
                            } 
                        }
                        // shift
                        this.pm.move(this.lc, col);
                        //DEBUG && log(this.pm);
                        // set new column
                        this.lc = col;
                    }
                    
                    this.mouseDownEvent = event;
                    
                } else { // resize
                    if (width <= -dist) {
                        this.mouseUp(event);
                    } else {
                        var newWidth = width + dist;
                        if (newWidth > this.options.minWidth) {
        
                            for (var i = 0; i < this.nr; i++) {
                                cell = table.rows[i].cells[initialColumn];
                                cell.style.maxWidth = cell.style.width = newWidth + 'px';
                            }
        
                            this.mouseDownEvent = event;
                        }
                    }
                }
            }
        };
        
        this.mouseStop = function(event) {
            
            if (this.dragSort) { // drag or sort
                if (!this.drag) { // sort (minimum drag distance not met)
                    //DEBUG && log('was sort');                    
                   
                    for (var j = 0; j < this.nc; j++) {
                        if (hasClass(this.hr.cells[j], 'sort-up') || hasClass(this.hr.cells[j], 'sort-down')) {
                            if (j !== this.ic) {
                                this.hr.cells[j].className = this.hr.cells[j].className.replace(' sort-down', '')
                                    .replace(' sort-up', '');
                            }
                        }
                    }
  
                    this.sort(this, table);
                } else { // drag
                    //DEBUG && log('was drag'); 
                    // remove overlay
                    document.body.removeChild(this.overlay);
                    
                    // move column if neccessary
                    var col = getTableColumn(table, event, this.lc);
                    //DEBUG && log('last column: ' + this.lc + ' initial column: ' + this.ic + ' event column: ' + col);
                    if (col != this.ic)
                        moveTableColumn(table,this.ic,col);
                }
            } else { // resize
                //DEBUG && log('was resize'); 
                var initialColumn = this.ic,
                    cell = this.hr.cells[initialColumn],
                    width = window.getComputedStyle(cell, null).getPropertyValue("width");
    
                for (var i = 0; i < this.nr; i++) {
                    cell = table.rows[i].cells[initialColumn];
                    cell.style.maxWidth = cell.style.width = width;
                }
            }
           
            // restore mouse cursor
            document.body.style.cursor = this.cur;
            // reset all
            this.options.distance = 0;
        };

        this.sort = function (cellh, table) {
            // store rows for sorting
            var sortRows = [];
            for (var i = 1; i < table.rows.length; i++) {
                sortRows.push(table.rows[i]);
            }

            var cell = this.hr.cells[this.ic];
            // sort
            sortRows.sort(function (a, b) {
                var x = a.cells[cell.cellIndex].textContent,
                    y = b.cells[cell.cellIndex].textContent;

                return naturalSort(x, y);
            });

            if (hasClass(cell, 'sort-down')) {
                this.hr.cells[this.ic].className = cell.className.replace(/ sort-down/, '');
                this.hr.cells[this.ic].className += ' sort-up';
            } else {
                this.hr.cells[this.ic].className = cell.className.replace(/ sort-up/, '');
                this.hr.cells[this.ic].className += ' sort-down';
            }

            // Before we append should we reverse the new array or not?
            if (hasClass(cell, 'sort-down')) {
                sortRows.reverse();
            }

            for (i = 0; i < sortRows.length; i++) {
                // appendChild(x) moves x if already present somewhere else in the DOM
                table.tBodies[0].appendChild(sortRows[i]);
            }
        };
    }

    TableDragSortResize.prototype = {
        options: {
            distance: 0, // minimum of all distance restrictions, in px
            minWidth: 30 // resize option, in px
        },

        init: function (table, options) {
            // check empty table
            if (!(table && table.rows && table.rows.length > 0)) {
                DEBUG && log('WARNING: Empty table.');
                return '';
            }

            // header row
            this.hr = table.rows[0];
            // number of cells
            this.nc = this.hr.cells.length;
            // number of rows
            this.nr = table.rows.length;
            // to keep context
            var that = this;

            DEBUG && log('Number of cells: ' + this.nc);
            DEBUG && log('Number of rows: ' + this.nr + ' (including header row)');
            
            // attach handlers to each cell of the header row.
            for (var i = 0; i < this.nc; i++) {
                var cell = this.hr.cells[i];

                // sort
                cell.className += ' sort-header';
                
                // resize & sort
                cell.style.cursor = 'default';
                addEvent(cell, 'mousedown', function (event) {
                    that.mouseDown(event);
                });
                
                // drag
                cell.innerHTML = '<div class=\"resize-base\"><div class=\"resize-elem\"></div><div class=\"resize-text\">' + cell.innerHTML + '</div></div>';
                addEvent(cell.childNodes[0].childNodes[0], 'mousedown', function (event) {
                    that.mouseDown(event);
                });
            }
            
            //DEBUG && log('init finished');
        },
        
        // This simple javascript code is based on 
        // https://github.com/jquery/jquery-ui/blob/master/ui/mouse.js
        mouseDown: function (event) {

            // we may have missed mouseup (out of window) - clean start, reset all
            (this.mouseStarted && this.mouseUp(event));
            
            // to compute the first (and the following) resize move correctly
            this.mouseDownEvent = event;
            
            // only left mouse button down is of interest
            if (event.which !== 1) {
                return true;
            }
            
            // lets start
            if (this.mouseDistanceMet(event)) {
                this.mouseStarted = (this.mouseStart(event) !== false);
                if (!this.mouseStarted) {
                    event.preventDefault();
                    return true;
                }
            }
            
            // to keep context
            var that = this;
            this.mouseMoveDelegate = function(event) {
                return that.mouseMove(event);
            };
            this.mouseUpDelegate = function(event) {
                return that.mouseUp(event);
            };
            
            addEvent(document.body, 'mousemove', this.mouseMoveDelegate);
            addEvent(document.body, 'mouseup', this.mouseUpDelegate);
    
            event.preventDefault();
    
            return true;
        },
        
        // This simple javascript code is based on 
        // https://github.com/jquery/jquery-ui/blob/master/ui/mouse.js
        mouseMove: function(event) {
            // Iframe mouseup check - mouseup occurred in another document
            if ( !event.which ) {
                return this.mouseUp( event );
            }
    
            // drag functionality
            if (this.mouseStarted) {
                this.mouseDrag(event);
                return event.preventDefault();
            }
    
            // within no action circle
            if (this.mouseDistanceMet(event)) {
                this.mouseStarted = (this.mouseStart(this.mouseDownEvent,event) !== false);

                (this.mouseStarted ? this.mouseDrag(event) : this.mouseUp(event));
            }
            
            return !this.mouseStarted;
        },
        
        // This simple javascript code is based on
        // https://github.com/jquery/jquery-ui/blob/master/ui/mouse.js
        mouseUp: function(event) {
            removeEvent(document.body, 'mousemove', this.mouseMoveDelegate);
            removeEvent(document.body, 'mouseup', this.mouseUpDelegate);
    
            if (this.mouseStarted) {
                this.mouseStarted = false;
    
                this.mouseStop(event);
            }
    
            return false;
        },

        // This simple javascript code is roughly based on 
        // https://github.com/jquery/jquery-ui/blob/master/ui/mouse.js
        mouseDistanceMet: function(event) {
            var x = Math.abs(this.mouseDownEvent.pageX - event.pageX),
                y = Math.abs(this.mouseDownEvent.pageY - event.pageY);
            return (Math.sqrt(x*x + y*y)) >= this.options.distance;
        },

        // These are placeholder methods, to be overriden by extentions
        mouseStart: function() {},
        mouseDrag: function() {},
        mouseStop: function() {},
    };

    // http://stackoverflow.com/questions/2440700/reordering-arrays
    Array.prototype.move = function(from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
    };
    
    // http://ejohn.org/apps/jselect/event.html
    function addEvent( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function () {
            obj['e'+type+fn]( window.event );
        };
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else
        obj.addEventListener( type, fn, false );
    }
    function removeEvent( obj, type, fn ) {
      if ( obj.detachEvent ) {
        obj.detachEvent( 'on'+type, obj[type+fn] );
        obj[type+fn] = null;
      } else
        obj.removeEventListener( type, fn, false );
    }
    
    function getTableColumn(table, event, defaultColumn) {
        var cells = table.rows[0].cells,
            ex = event.pageX;
        for (var i = 0; i < cells.length; i++) {
            var tx = getElementPosition(cells[i]).x;
            if (tx <= ex && ex <= tx + cells[i].offsetWidth) {
                return i;
            }
        }
        return (defaultColumn || -1); 
    }
    
    function copyStyles(el) {
        var cs = window.getComputedStyle(el,null),
            css = '';
        for (var i=0; i<cs.length; i++) {
            var style = cs[i];
            css += style + ': ' + cs.getPropertyValue(style) + ';';
            //DEBUG && log(style + ': ' + cs.getPropertyValue(style) + ';');
        }
        return css;
    }
    
    // based on
    // http://www.kirupa.com/html5/get_element_position_using_javascript.htm
    function getElementPosition(el) {
        var ex = 0, ey = 0;
        do {
            ex += el.offsetLeft - el.scrollLeft + el.clientLeft;
            ey += el.offsetTop - el.scrollTop + el.clientTop;
        } while (el = el.offsetParent);
        //DEBUG && log(ex + ' ' + ey);
        return {x: ex, y: ey};
    }
    
    // based on
    // https://groups.google.com/forum/#!msg/comp.lang.javascript/durZ17iSD0I/rnH2FqrvkooJ
    function moveTableColumn(table, start, end) {
        var row,
            i = table.rows.length;
        while (i--) {
          row = table.rows[i];
          var x = row.removeChild(row.cells[start]);
          row.insertBefore(x, row.cells[end]);
        }
    }
    
    // Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
    // Author: Jim Palmer (based on chunking idea from Dave Koelle)
    // http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support/
    function naturalSort(a, b) {
        var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
            sre = /(^[ ]*|[ ]*$)/g,
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
            i = function (s) { return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s; },
            // convert all to strings strip whitespace
            x = i(a).replace(sre, '') || '',
            y = i(b).replace(sre, '') || '',
            // chunk/tokenize
            xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
            yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
            // numeric, hex or date detection
            xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
            yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
            oFxNcL, oFyNcL;
        // first try and sort Hex codes or Dates
        if (yD)
            if (xD < yD) return -1;
            else if (xD > yD) return 1;
        // natural sorting through split numeric strings and default strings
        for (var cLoc = 0, numS = Math.max(xN.length, yN.length) ; cLoc < numS; cLoc++) {
            // find floats not starting with '0', string or 0 if not defined (Clint Priest)
            oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
            oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
            // handle numeric vs string comparison - number < string - (Kyle Adams)
            if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
                // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
            else if (typeof oFxNcL !== typeof oFyNcL) {
                oFxNcL += '';
                oFyNcL += '';
            }
            if (oFxNcL < oFyNcL) return -1;
            if (oFxNcL > oFyNcL) return 1;
        }
        return 0;
    }

    // https://github.com/tristen/tablesort/blob/gh-pages/src/tablesort.js
    // line 280 - 282
    var hasClass = function (el, c) {
        return (' ' + el.className + ' ').indexOf(' ' + c + ' ') > -1;
    };
    
    // based on
    // https://github.com/tristen/tablesort/blob/gh-pages/src/tablesort.js
    // line 297 - 301
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TableDragSortResize;
    } else {
        window.TableDragSortResize = TableDragSortResize;
    }
})();