'use strict';

const getDragodindesByUserId = (req, res, next) => {
    console.log('first func good export');
    res.tom = 'tom le fou';
    next();
};

exports.getDragodindesByUserId = getDragodindesByUserId;
