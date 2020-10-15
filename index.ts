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
import enclosRouter from './lib/routes/dofus/enclos';
import dragodindesRouter from './lib/routes/dofus/dragodindes';
import { websiteAuthVerif, discordBotAuthVerif } from './lib/middleware/security';
import config from './config.json';

let discord_bot_connection = false;

const app = express();
const DB_url = `mongodb://${config.mongo.user}:${config.mongo.password}@localhost/` + (process.env.NODE_ENV === 'test' ? 'syxbot-database-test' : 'syxbot-database')

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
app.use('/dofus/enclos', enclosRouter);
app.use('/dofus/dragodindes', dragodindesRouter);

app.post('/bot/auth', (_req: Request, res: Response) => {
    if (!discord_bot_connection) {
        discord_bot_connection = true;
        const signature = jwt.sign({ type: 'bot' }, config.security.secret);
        res.send({ jwt: signature });
    }
    else {
        res.status(401).json('Unhautorized call !');
    }
});

app.post('/bot/auth/close', (_req: Request, res: Response) => {
    discord_bot_connection = false;
    res.sendStatus(200);
});

export const getDiscordConnection = (): boolean => {
    return discord_bot_connection;
};

app.post('/', (_req: Request, res: Response) => {
    res.sendStatus(200);
});

if (process.env.NODE_ENV !== 'test') {
    console.log(' ');
    console.log('----- ' + dateFormat(Date.now(), 'HH:MM:ss dd/mm/yyyy') + ' -----');
    if (config.env === 'DEV') console.log(chalk.bgRgb(25, 108, 207)('         CONNECTION         '));
    console.log('Connecting to database ...');
}

mongoose.connect(DB_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    useFindAndModify: false
});
mongoose.connection.once('open', (): void => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(' - Connected to database !');
        if (config.env === 'DEV') console.log(chalk.bgRgb(60, 121, 0)('\n         CONNECTED          '));
    }
    https.createServer({
        key: fs.readFileSync('./cert/privkey.pem'),
        cert: fs.readFileSync('./cert/cert.pem')
    }, app)
        .listen(9000, (): void => {
            if (process.env.NODE_ENV !== 'test') {
                if (config.env === 'DEV') {
                    console.log('      Port => 9000');
                }
                else if (config.env === 'MASTER') {
                    console.log(' ');
                    console.log('Port => 9000');
                }
            }
        });
});

export default app;