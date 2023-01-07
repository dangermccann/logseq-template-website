var express = require('express');
var api = require('./data-access')
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

app.locals.formatLinks = function(line) {
    line = line.replaceAll(/\#([^\s]+)/g, '<span class="tag">#$1</span>')
    line = line.replaceAll(/\[\[(.*?)\]\]/g, '<span class="bracket">[[</span><span class="link">$1</span><span class="bracket">]]</span>')
    line = line.replaceAll(/\[(.*?)\]\([^\s]+\)/g, '<span class="external-link">$1</span>')
    return line
}

app.locals.formatMarkdown = function(line) {
    line = line.replaceAll(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    line = line.replaceAll(/\_(.*?)\_/g, '<i>$1</i>')
    line = line.replaceAll(/\~\~(.*?)\~\~/g, '<span class="strikethrough">$1</span>')
    line = line.replaceAll(/\^\^(.*?)\^\^/g, '<span class="highlight">$1</span>')
    line = line.replaceAll(/\`(.*?)\`/g, '<span class="code">$1</span>')
    return line
}

app.locals.formatTODOs = function(line) {
    const checkbox = '<input type="checkbox" disabled />'
    line = line.replaceAll(/\bNOW\b/g, checkbox)
    line = line.replaceAll(/\bLATER\b/g, checkbox)
    line = line.replaceAll(/\bDOING\b/g, checkbox)
    line = line.replaceAll(/\bTODO\b/g, checkbox)
    line = line.replaceAll(/\bDONE\b/g, checkbox)
    return line
}

// index page
app.get('/', async function(req, res) {
    let err = null;
    let templates = [];
    try {
        templates = await api.getMostPopularTemplates()
    }
    catch(e) {
        err = e
    }
    res.render('pages/index', {
        templates: templates,
        error: err
    });
});

app.use("/static", express.static('./static/'));

app.listen(8080);
console.log('Server is listening on port 8080');
