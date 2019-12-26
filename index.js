const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')
const https = require('https')
const nodeMailer = require('nodemailer')
const config = require('./config.json')

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/docs/contact', (req, res) => {
    console.log('req body : ', req.body)
    res.send('Données reçues');
    const transporter = nodeMailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: true,
        auth: {
            user: 'syxbot@hotmail.com',
            pass: config.email.password
        }
    });
    const mailOptions = {
        from: req.body.mail,
        to: 'syxbot@hotmail.com',
        subject: req.body.object,
        text: req.body.message,
        html: '<b>test du body html</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error while sending mail : ', error);
        }
        console.log('Message response info : ', info);
        res.send(true)
    });
});

app.get('/*', (req, res) => {
    res.send('404 not found')
})

https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
}, app)
    .listen(9000, function () {
        console.log('HTTPS running on port 9000')
    })