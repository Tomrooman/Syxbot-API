import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.query.guildId) {
        return res.send('No guildId');
    }
    res.send('get guildId');
});

router.post('/update', (req, res) => {
    console.log('Api data : ', req.data);
    res.send('Get the data');
});

export default router;