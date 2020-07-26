import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
import chalk from 'chalk';
import dateFormat from 'dateformat';
import contactRouter from './lib/routes/contact';
import settingsRouter from './lib/routes/settings';
import tokenRouter from './lib/routes/token';
import notesRouter from './lib/routes/dofus/notes';
import dragodindesRouter from './lib/routes/dofus/dragodindes';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/docs', contactRouter);
app.use('/settings', settingsRouter);
app.use('/token', tokenRouter);
app.use('/dofus/notes', notesRouter);
app.use('/dofus/dragodindes', dragodindesRouter);

app.post('/', (_req: Request, res: Response) => {
    res.sendStatus(200);
});

console.log(' ');
console.log('----- ' + dateFormat(Date.now(), 'HH:MM:ss dd/mm/yyyy') + ' -----');
console.log(chalk.bgRgb(25, 108, 207)('         CONNECTION         '));
console.log('Connecting to database ...');
mongoose.connect('mongodb://localhost/syxbot-database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    useFindAndModify: false
});
mongoose.connection.once('open', () => {
    console.log(' - Connected to database !');
    console.log(chalk.bgRgb(60, 121, 0)(`\n         CONNECTED          `));
    https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/syxbot.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/syxbot.com/cert.pem')
    }, app)
        .listen(9000, function () {
            console.log('      port => 9000');
        });
});
