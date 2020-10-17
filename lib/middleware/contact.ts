'use strict';

import nodeMailer from 'nodemailer';
import config from '../../config.json';
import { Request, Response, NextFunction } from 'express';

export const sendMail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.message && req.body.mail && req.body.object) {
        if (req.body.test) {
            res.status(200);
            return next();
        }
        let message = req.body.message.split('\n');
        message = message.join('</br>');
        const transporter = nodeMailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            auth: {
                user: 'syxbot@hotmail.com',
                pass: config.email.password
            }
        });
        const mailOptions = {
            from: 'syxbot@hotmail.com',
            to: 'syxbot@hotmail.com',
            subject: req.body.object,
            html: '<b>Email de la personne : </b>' + req.body.mail + '</br></br>' + message
        };
        transporter.sendMail(mailOptions, (err: Error, info: { envelope: string, messageId: string }) => {
            if (err) console.log('Error while sending mail : ', err);
            else res.mail = true;
            res.status(200);
            console.log('Info : ', info);
            next();
        });
    }
    else res.status(400);
    next();
};
