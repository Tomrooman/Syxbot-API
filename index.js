import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
import nodeMailer from 'nodemailer';
import config from './config.json';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/docs/contact', (req, res) => {
    // setTimeout(() => {
    //     res.send(true);
    // }, 4000);
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

app.get('/*', (req, res) => {
    res.send('404 not found');
});

https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
}, app)
    .listen(9000, function () {
        console.log('HTTPS running on port 9000');
    });