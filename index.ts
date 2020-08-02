import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookiesMiddleware from 'universal-cookie-express';
import fs from 'fs';
import https from 'https';
import chalk from 'chalk';
import bcrypt from 'bcrypt';
import dateFormat from 'dateformat';
import contactRouter from './lib/routes/contact';
import settingsRouter from './lib/routes/settings';
import tokenRouter from './lib/routes/token';
import notesRouter from './lib/routes/dofus/notes';
import dragodindesRouter from './lib/routes/dofus/dragodindes';
import config from './config.json';
import { ServerResponse } from 'http';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookiesMiddleware());

app.use(async (req: Request, res: Response, next: NextFunction): Promise<ServerResponse | void> => {
    if (req.body.token && req.body.token === config.security.token) {
        if (!req.body.type || req.body.type && req.body.type !== 'bot') {
            const syxbotInfos = req.universalCookies.get('syxbot_infos');
            const syxbot = req.universalCookies.get('syxbot');
            if (syxbot && syxbotInfos) {
                const compare = await bcrypt.compare(config.bcrypt.secret, syxbotInfos.secret);
                if (compare) {
                    req.body.userId = syxbotInfos.userId
                    return next();
                }
                return res.writeHead(401, 'Invalid token');
            }
        }
        return next();
    }
    return res.writeHead(401, 'Invalid token');
});

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
if (config.WHAT === 'DEV') console.log(chalk.bgRgb(25, 108, 207)('         CONNECTION         '));
console.log('Connecting to database ...');

mongoose.connect('mongodb://localhost/syxbot-database', {
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
