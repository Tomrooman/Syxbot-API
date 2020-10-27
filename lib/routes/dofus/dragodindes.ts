'use strict';

import express from 'express';
import * as dragodindesMiddleware from '../../middleware/dofus/dragodindes';
const router = express.Router();

router.post('/',
    dragodindesMiddleware.getDragodindes,
    (_req, res) => {
        res.send(res.dragodindes || false);
    });

router.post('/create',
    dragodindesMiddleware.CreateOrAddDragodindes,
    (_req, res) => {
        res.send(res.dragodindes || false);
    });

router.post('/fecondator',
    dragodindesMiddleware.getDragodindes,
    dragodindesMiddleware.callMakeEndParams,
    (_req, res) => {
        res.send({
            dragodindes: res.fecondator || false,
            ddFecond: res.ddFecond || false
        });
    });

router.post('/fecondator/automatic',
    dragodindesMiddleware.modifyAutomaticDragodindesStatus,
    (_req, res) => {
        res.send(res.dragodindes || false);
    });

router.post('/notif',
    dragodindesMiddleware.getDofusInfos,
    dragodindesMiddleware.SetNotificationsByStatus,
    (_req, res) => {
        res.send(res.dragodindes || false);
    });

router.post('/notif/verify',
    dragodindesMiddleware.verifySendedDragodindesNotif,
    dragodindesMiddleware.setDragodindesToSend,
    (_req, res) => {
        res.send(res.notifArray || false);
    });

router.post('/notif/all',
    dragodindesMiddleware.getAllDragodindesNotifInfos,
    (_req, res) => {
        res.send(res.dragodindesNotif || false);
    });

router.post('/status/:type/:action',
    dragodindesMiddleware.modifyDragodindesStatus,
    (_req, res) => {
        res.send(res.dragodindes || false);
    });

router.post('/remove',
    dragodindesMiddleware.removeDragodindes,
    (_req, res) => {
        res.send(res.dragodindes || false);
    });

export default router;
