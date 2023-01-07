var express = require('express');
var api = require('./data-access')
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {
    let templates = await api.getMostPopularTemplates()
    res.render('pages/index', {
        templates: templates
    });
});

app.use("/static", express.static('./static/'));

app.listen(8080);
console.log('Server is listening on port 8080');
