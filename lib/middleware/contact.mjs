'use strict';

import nodeMailer from 'nodemailer';
import config from './../../config.json';

const sendMail = async (req, res, next) => {
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
        transporter.sendMail(mailOptions, error => {
            if (error) {
                console.log('Error while sending mail : ', error);
            }
            else {
                res.mailStatus = true;
            }
            next();
        });
    }
    else {
        next();
    }
};

export {
    sendMail
};
