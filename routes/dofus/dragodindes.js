import express from 'express';
import _ from 'lodash';
import dofusMiddleware from './../../middleware/dofus/dragodindes.js';
import dofusModel from './../../models/dofus.js';

const router = express.Router();

router.post('/', (req, res) => {
    if (req.body.userId) {
        console.log('Get dragodindes routes');
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                if (dofus_infos) {
                    res.send(dofus_infos.dragodindes);
                }
                else {
                    res.send(false);
                }
            }).catch(e => {
                console.log('Error /api/dofus/dragodindes : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

router.post('/create', (req, res) => {
    if (req.body.userId && req.body.dragodindes) {
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                const dofusObj = {
                    userId: req.body.userId,
                    dragodindes: []
                };
                if (dofus_infos) {
                    req.body.dragodindes.map(drago => {
                        dofus_infos.dragodindes.push(drago);
                    });
                    dofus_infos.markModified('dragodindes');
                    dofus_infos.save();
                    res.send(dofus_infos.dragodindes);
                }
                else {
                    req.body.dragodindes.map(drago => {
                        dofusObj.dragodindes.push(drago);
                    });
                    new dofusModel(dofusObj).save();
                    res.send(dofusObj.dragodindes);
                }
            }).catch(e => {
                console.log('Error /api/dofus/dragodindes/create : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

router.post('/last/update', (req, res) => {
    if (req.body.userId && req.body.dragodindes) {
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                if (dofus_infos) {
                    if (req.body.dragodindes.length >= 1) {
                        dofus_infos.dragodindes.map(drago => {
                            if (drago.name === req.body.dragodindes[0].name) {
                                drago.last = {
                                    status: true,
                                    date: Date.now()
                                };
                                drago.used = false;
                            }
                            else {
                                drago.last = {
                                    status: false
                                };
                            }
                        });
                        dofus_infos.markModified('dragodindes');
                        dofus_infos.save();
                    }
                    res.send(dofus_infos.dragodindes);
                }
                else {
                    res.send(false);
                }
            }).catch(e => {
                console.log('Error /api/dofus/dragodindes/last/update : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

router.post('/last/remove', (req, res) => {
    if (req.body.userId && req.body.dragodindes) {
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                if (dofus_infos) {
                    if (req.body.dragodindes.length >= 1) {
                        dofus_infos.dragodindes.map(drago => {
                            if (drago.name === req.body.dragodindes[0].name) {
                                drago.last = {
                                    status: false
                                };
                            }
                        });
                        dofus_infos.markModified('dragodindes');
                        dofus_infos.save();
                    }
                    res.send(dofus_infos.dragodindes);
                }
                else {
                    res.send(false);
                }
            }).catch(e => {
                console.log('Error /api/dofus/dragodindes/last/remove : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

router.post('/used/update', (req, res) => {
    if (req.body.userId && req.body.dragodindes) {
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                if (dofus_infos) {
                    if (req.body.dragodindes.length >= 1) {
                        req.body.dragodindes.map(drago => {
                            dofus_infos.dragodindes.map(d => {
                                if (d.name === drago.name) {
                                    d.used = true;
                                    d.last = {
                                        status: false
                                    };
                                }
                            });
                        });
                        dofus_infos.markModified('dragodindes');
                        dofus_infos.save();
                    }
                    res.send(dofus_infos.dragodindes);
                }
                else {
                    res.send(false);
                }
            }).catch(e => {
                console.log('Error /api/dofus/dragodindes/used/update : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

router.post('/used/remove', (req, res) => {
    if (req.body.userId && req.body.dragodindes) {
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                if (dofus_infos) {
                    if (req.body.dragodindes.length >= 1) {
                        req.body.dragodindes.map(drago => {
                            dofus_infos.dragodindes.map(d => {
                                if (d.name === drago.name) {
                                    d.used = false;
                                }
                            });
                        });
                        dofus_infos.markModified('dragodindes');
                        dofus_infos.save();
                    }
                    res.send(dofus_infos.dragodindes);
                }
                else {
                    res.send(false);
                }
            }).catch(e => {
                console.log('Error /api/dofus/dragodindes/used/remove : ', e.message);
                res.send(false);
            });
    }
});

router.post('/remove', (req, res) => {
    dofusModel.get(req.body.userId)
        .then(dofus_infos => {
            req.body.dragodindes.map(drago => {
                dofus_infos.dragodindes.map((d, index) => {
                    if (d.name === drago.name) {
                        delete dofus_infos.dragodindes[index];
                        dofus_infos.dragodindes = _.compact(dofus_infos.dragodindes);
                    }
                });
            });
            dofus_infos.markModified('dragodindes');
            dofus_infos.save();
            res.send(dofus_infos.dragodindes);
        })
        .catch(e => {
            console.log('Error /api/dofus/dragodindes/remove : ', e.message);
            res.send(false);
        });
});

export default router;