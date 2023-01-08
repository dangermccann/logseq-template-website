var express = require('express');
var api = require('./data-access')
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');


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

app.get(['/', '/popular'], async function(req, res) {
    let err = null;
    let templates = [];
    let title = 'Popular Templates | Logseq Template Gallery'
    try {
        templates = await api.getMostPopularTemplates()
    }
    catch(e) {
        err = e
    }
    res.render('pages/index', {
        templates: templates,
        mode: 'popular',
        title: title,
        error: err
    });
});

app.get('/recent', async function(req, res) {
    let err = null;
    let templates = [];
    let title = 'Recent Templates | Logseq Template Gallery'
    try {
        templates = await api.getMostRecentTemplates()
    }
    catch(e) {
        err = e
    }
    res.render('pages/index', {
        templates: templates,
        mode: 'recent',
        title: title,
        error: err
    });
});

app.get('/all', async function(req, res) {
    let err = null;
    let templates = [];
    let title = 'All Templates | Logseq Template Gallery'
    try {
        templates = await api.getAllTemplates()
    }
    catch(e) {
        err = e
    }
    res.render('pages/list', {
        templates: templates,
        mode: 'all',
        title: title,
        error: err
    });
});

app.get('/search', async function(req, res) {
    let err = null;
    let templates = [];
    let title = `${req.query.q} | Logseq Template Gallery`
    try {
        templates = await api.searchTemplates(req.query.q)
    }
    catch(e) {
        err = e
    }
    res.render('pages/index', {
        templates: templates,
        mode: 'search',
        query: req.query.q,
        title: title,
        error: err
    });
});

app.get('/u/:user', async function(req, res) {
    let err = null;
    let templates = [];
    let status = 200;
    let title = `Templates shared by ${req.params.user} | Logseq Template Gallery`
    try {
        templates = await api.getUserTemplates(req.params.user);
    }
    catch(e) {
        err = e
    }

    if(templates.length === 0)
        status = 404

    res.status(status).render('pages/index', {
        templates: templates,
        mode: 'user',
        user: req.params.user,
        title: title,
        error: err
    });
})

app.get('/t/:user/:template', async function(req, res) {
    let err = null;
    let template = null;
    let status = 404;
    let title = `${req.params.template} shared by ${req.params.user} | Logseq Template Gallery`
    let description = null;
    try {
        let templates = await api.getUserTemplates(req.params.user);
        templates.forEach(t => {
            if(t.Template === req.params.template) {
                template = t;
                description = t.Description;
                status = 200;
                return;
            }
        });
    }
    catch(e) {
        err = e
    }

    res.status(status).render('pages/template', {
        template: template,
        title: title,
        description: description,
        error: err
    });
});

app.get('/share', async function(req, res) {
    res.render('pages/share', {
        title: "Share a Template | Logseq Template Gallery"
    });
});

app.get('/about', async function(req, res) {
    res.render('pages/about', {
        title: "About Logseq Template Gallery"
    });
});

app.get('/privacy', async function(req, res) {
    res.render('pages/privacy', {
        title: "Privacy Policy | Logseq Template Gallery"
    });
});

app.get('/terms', async function(req, res) {
    res.render('pages/terms', {
        title: "Terms and Conditions | Logseq Template Gallery"
    });
});

app.use("/static", express.static('./static/'));

app.listen(8080);
console.log('Server is listening on port 8080');
