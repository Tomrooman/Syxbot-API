import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookiesMiddleware from 'universal-cookie-express';
import fs from 'fs';
import https from 'https';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';
import dateFormat from 'dateformat';
import contactRouter from './lib/routes/contact';
import settingsRouter from './lib/routes/settings';
import tokenRouter from './lib/routes/token';
import notesRouter from './lib/routes/dofus/notes';
import dragodindesRouter from './lib/routes/dofus/dragodindes';
import { websiteAuthVerif, discordBotAuthVerif } from './lib/middleware/security';
import config from './config.json';

let discord_bot_connection = false;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookiesMiddleware());

app.use(
    websiteAuthVerif,
    discordBotAuthVerif,
    (_req: Request, _res: Response, next: NextFunction): void => {
        next();
    });

app.use('/docs', contactRouter);
app.use('/settings', settingsRouter);
app.use('/token', tokenRouter);
app.use('/dofus/notes', notesRouter);
app.use('/dofus/dragodindes', dragodindesRouter);

app.post('/bot/auth', (req: Request, res: Response) => {
    if (!discord_bot_connection) {
        discord_bot_connection = true;
        const signature = jwt.sign({ type: 'bot' }, config.security.secret);
        res.send({ jwt: signature });
    } else {
        res.status(401).json('Unhautorized call !');
    }
});

app.post('/bot/auth/close', (req: Request, res: Response) => {
    discord_bot_connection = false;
    res.sendStatus(200);
});

export const getDiscordConnection = (): boolean => {
    return discord_bot_connection;
};

app.post('/', (_req: Request, res: Response) => {
    res.sendStatus(200);
});

console.log(' ');
console.log('----- ' + dateFormat(Date.now(), 'HH:MM:ss dd/mm/yyyy') + ' -----');
if (config.WHAT === 'DEV') console.log(chalk.bgRgb(25, 108, 207)('         CONNECTION         '));
console.log('Connecting to database ...');

mongoose.connect('mongodb://db:27017/syxbot-database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    useFindAndModify: false
});
mongoose.connection.once('open', (): void => {
    console.log(' - Connected to database !');
    if (config.WHAT === 'DEV') console.log(chalk.bgRgb(60, 121, 0)(`\n         CONNECTED          `));
    https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/syxbot.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/syxbot.com/cert.pem')
    }, app)
        .listen(9000, (): void => {
            if (config.WHAT === 'DEV') console.log('      Port => 9000');
            else if (config.WHAT === 'MASTER') {
                console.log(' ');
                console.log('Port => 9000');
            }
        });
});
