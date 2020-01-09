import express from 'express';
import nodeMailer from 'nodemailer';
import config from './../config.json';

const router = express.Router();

router.post('/contact', (req, res) => {
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
            res.send(false);
            return console.log('Error while sending mail : ', error);
        }
        else {
            res.send(true);
        }
    });
});

export default router;