import express from 'express';
import _ from 'lodash';
import dofusModel from './../../models/dofus.js';

const router = express.Router();

router.post('/', (req, res) => {
    if (req.body.userId) {
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                if (dofus_infos) {
                    res.send(dofus_infos.notes);
                }
                else {
                    res.send(false);
                }
            }).catch(e => {
                console.log('Error /api/dofus/notes : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

router.post('/create', (req, res) => {
    if (req.body.userId && req.body.title && req.body.content) {
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                const dofusObj = {
                    userId: req.body.userId,
                    notes: [{
                        title: req.body.title,
                        content: req.body.content
                    }]
                };
                if (dofus_infos) {
                    dofus_infos.notes.push({ title: req.body.title, content: req.body.content });
                    dofus_infos.markModified('notes');
                    dofus_infos.save();
                    res.send(dofus_infos.notes);
                }
                else {
                    new dofusModel(dofusObj).save();
                    res.send(dofusObj.notes);
                }
            }).catch(e => {
                console.log('Error /api/dofus/notes/create : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

router.post('/update', (req, res) => {
    if (req.body.userId && req.body.title && req.body.oldContent && req.body.newContent) {
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                if (dofus_infos) {
                    dofus_infos.notes.map(note => {
                        if (note.title === req.body.title && note.content === req.body.oldContent) {
                            note.content = req.body.newContent;
                        }
                    });
                    dofus_infos.markModified('notes');
                    dofus_infos.save();
                    res.send(dofus_infos.notes);
                }
                else {
                    res.send(false);
                }
            }).catch(e => {
                console.log('Error /api/dofus/notes/update : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

router.post('/remove', (req, res) => {
    if (req.body.userId && req.body.title && req.body.content) {
        dofusModel.get(req.body.userId)
            .then(dofus_infos => {
                if (dofus_infos) {
                    dofus_infos.notes.map((n, index) => {
                        if (n.title === req.body.title && n.content === req.body.content) {
                            delete dofus_infos.notes[index];
                        }
                    });
                    dofus_infos.notes = _.compact(dofus_infos.notes);
                    dofus_infos.markModified('notes');
                    dofus_infos.save();
                    res.send(dofus_infos.notes);
                }
                else {
                    res.send(false);
                }
            }).catch(e => {
                console.log('Error /api/dofus/notes/remove : ', e.message);
                res.send(false);
            });
    }
    else {
        res.send(false);
    }
});

export default router;