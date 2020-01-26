import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
import dateFormat from 'dateformat';
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
console.log(' ');
console.log('----- ' + dateFormat(Date.now(), 'HH:MM:ss dd/mm/yyyy') + ' -----');
console.log('Connecting to database ...');
mongoose.connect('mongodb://localhost/syxbot-database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    useFindAndModify: false
});
mongoose.connection.once('open', () => {
    console.log('Connected to database !');
    https.createServer({
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.crt')
    }, app)
        .listen(9000, function () {
            console.log(' - API running | port : 9000');
        });
});
