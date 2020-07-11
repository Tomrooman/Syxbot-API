import express from 'express';
import testMiddleware from './../middleware/test.js';

const router = express.Router();

router.get('/',
    testMiddleware.firstFunc,
    (req, res) => {
        console.log('Test route : ', res.tom);
        res.send(res.tom);
    });

export default router;