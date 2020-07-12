import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
import dateFormat from 'dateformat';
import contactRouter from './routes/contact.js';
import settingsRouter from './routes/settings.js';
import tokenRouter from './routes/token.js';
import notesRouter from './routes/dofus/notes.js';
import dragodindesRouter from './routes/dofus/dragodindes.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/docs', contactRouter);
app.use('/settings', settingsRouter);
app.use('/token', tokenRouter);
app.use('/dofus/notes', notesRouter);
app.use('/dofus/dragodindes', dragodindesRouter);

app.post('/', (req, res) => {
    res.sendStatus(200);
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
        key: fs.readFileSync('/etc/letsencrypt/live/syxbot.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/syxbot.com/cert.pem')
    }, app)
        .listen(9000, function () {
            console.log(' - API running | port : 9000');
        });
});
