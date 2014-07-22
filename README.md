table-drag-sort-resize
======================

Adds basic functionality to html tables: dragging, sorting, resizing

!!WORK IN PROGRESS!!

###Demo

See ???? for a live demo.

###Description

table-drag-sort-resize is a small javascript component which adds basic functionality to html tables: Dragging, Sorting, Resizing. It is completely independent from other javascript libraries but should work side-by-side with any other library like jQuery,etc.

Any html tables which have a thead and tbody tag can be used, e.g.

```html
<table id="example" cellpadding="0" cellspacing="0" border="0" style="font-family: Segoe UI, sans-serif; font-size: 10pt;">
    <thead>
        <tr>
            <th>Name</th>
            <th>&Auml;nderungsdatum</th>
            <th>Typ</th>
            <th>Gr&ouml;&szlig;e</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>libraries</td>
            <td>08.10.2013 12:38</td>
            <td>Dateiordner</td>
            <td></td>
        </tr>
        <tr>
            <td>views</td>
            <td>08.10.2013 12:38</td>
            <td>Dateiordner</td>
            <td></td>
        </tr>
        <tr>
            <td>css</td>
            <td>18.05.2014 11:08</td>
            <td>Dateiordner</td>
            <td></td>
        </tr>
        <tr>
            <td>.htaccess</td>
            <td>03.06.2013 14:29</td>
            <td>HTACCESS-Datei</td>
            <td>1 KB</td>
        </tr>
        <tr>
            <td>config.php</td>
            <td>03.06.2013 14:29</td>
            <td>PHP-Datei</td>
            <td>3 KB</td>
        </tr>
        <tr>
            <td>blank.html</td>
            <td>18.05.2014 11:08</td>
            <td>HTLM-Datei</td>
            <td>1 KB</td>
        </tr>
    </tbody>
</table>
```

#####Supported Sorting Types

See [Javascript Natural Sort Algorithm With Unicode Support](http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support/) for a detailed description of supported sorting types

###How to use

In the head section of your html file put

```html
<link href='style-table-drag-sort-resize.css' rel='stylesheet'>
<script src='table-drag-sort-resize.min.js'></script>
```

Just before the end of your body section put

```html
<script>
  new TableDragSortResize(document.getElementById('example'));
</script>
```

###References

This small javascript component uses or is based on other javascript projects and code snippets:

- [Resizable Table Columns Demo](http://bz.var.ru/comp/web/resizable.html)
- [tablesort by tristen](http://tristen.ca/tablesort/demo/)
- [jquery dragtable by akottr](http://akottr.github.io/dragtable/)
- [dragtable: Visually reorder all your table columns](http://www.danvk.org/wp/dragtable/)
- [Javascript Natural Sort Algorithm With Unicode Support](http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support/)
- [mouse.js by jQuery](https://github.com/jquery/jquery-ui/blob/master/ui/mouse.js)
- [Reordering arrays on stackoverflow](http://stackoverflow.com/questions/2440700/reordering-arrays)
- [addEvent() recoding contest entry](http://ejohn.org/apps/jselect/event.html)
- [Get an Element's Position Using JavaScript](http://www.kirupa.com/html5/get_element_position_using_javascript.htm)
- [Swapping table columns](https://groups.google.com/forum/#!msg/comp.lang.javascript/durZ17iSD0I/rnH2FqrvkooJ)

### Licence

MIT
