import express from 'express';
import * as dragodindesMiddleware from './../../middleware/dofus/dragodindes';

const router = express.Router();

router.post('/',
    dragodindesMiddleware.getDragodindes,
    (req, res) => {
        res.send(res.dragodindes || false);
    });

router.post('/notif/all',
    dragodindesMiddleware.getAllDragodindesNotifInfos,
    (req, res) => {
        res.send(res.dragodindesNotif || false);
    });

router.post('/notif',
    dragodindesMiddleware.getDofusInfos,
    dragodindesMiddleware.SetNotificationsByStatus,
    (req, res) => {
        res.send(res.dragodindes || false);
    });

router.post('/create',
    dragodindesMiddleware.CreateOrAddDragodindes,
    (req, res) => {
        res.send(res.dragodindes || false);
    });

router.post('/status/:type/:action',
    dragodindesMiddleware.modifyDragodindesStatus,
    (req, res) => {
        res.send(res.dragodindes || false);
    });

router.post('/remove',
    dragodindesMiddleware.removeDragodindes,
    (req, res) => {
        res.send(res.dragodindes || false);
    });

export default router;
