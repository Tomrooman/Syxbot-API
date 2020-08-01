'use strict';

import nodeMailer from 'nodemailer';
import config from '../../config.json';
import { Request, Response, NextFunction } from 'express';

export const sendMail = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.message && req.body.mail && req.body.object) {
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
        transporter.sendMail((_mailOptions: any, error: Error) => {
            if (error) {
                console.log('Error while sending mail : ', error);
            }
            else {
                res.mail = true;
            }
            next();
        });
    }
    else {
        next();
    }
};
