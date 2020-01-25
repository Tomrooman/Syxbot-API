import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
import docsRouter from './routes/docs.js';
import settingsRouter from './routes/settings.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/docs', docsRouter);
app.use('/settings', settingsRouter);

app.get('/*', (req, res) => {
    res.send('404 not found');
});

https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
}, app)
    .listen(9000, function () {
        console.log('HTTPS running on port 9000');
    });