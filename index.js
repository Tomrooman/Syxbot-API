const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.post('/docs/contact', (req, res) => {
    console.log('req body : ', req.body)
    res.send('Données reçues');
});

app.get('/*', (req, res) => {
    res.send('404 not found')
})

https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
}, app)
    .listen(9000, function () {
        console.log('HTTPS running on port 9000')
    })