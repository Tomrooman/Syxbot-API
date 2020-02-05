import assert from 'assert';
import mongoose from 'mongoose';
import tokenSchema from '../models/token.js';

describe('Token', function () {
    const tokenObj = {
        userId: '1234554321',
        access_token: 'bad access token',
        token_type: 'little type',
        expire_at: '10000',
        refresh_token: 'big refresh token',
        scope: 'identify guilds'
    };

    it('Token should be empty', function (done) {
        tokenSchema.find()
            .then(token => {
                assert.equal(token.length, 0);
                done();
            });
    });
    it('Add first token', function (done) {
        const promise = new tokenSchema(tokenObj).save();
        assert.ok(promise instanceof Promise);
        promise.then(() => {
            tokenSchema.find()
                .then(token => {
                    assert.equal(token.length, 1);
                    assert.equal(token[0].userId, tokenObj.userId);
                    assert.equal(token[0].access_token, tokenObj.access_token);
                    assert.equal(token[0].token_type, tokenObj.token_type);
                    assert.equal(token[0].expire_at, tokenObj.expire_at);
                    assert.equal(token[0].refresh_token, tokenObj.refresh_token);
                    assert.equal(token[0].scope, tokenObj.scope);
                    done();
                });
        });
    });
    it('get() Get first token', function (done) {
        tokenSchema.get(tokenObj.userId)
            .then(token => {
                assert.equal(token.userId, tokenObj.userId);
                assert.equal(token.access_token, tokenObj.access_token);
                assert.equal(token.token_type, tokenObj.token_type);
                assert.equal(token.expire_at, tokenObj.expire_at);
                assert.equal(token.refresh_token, tokenObj.refresh_token);
                assert.equal(token.scope, tokenObj.scope);
                done();
            });
    });
    it('Add second token', function (done) {
        tokenObj.userId = '987656789';
        tokenObj.access_token = 'good good';
        const promise = new tokenSchema(tokenObj).save();
        assert.ok(promise instanceof Promise);
        promise.then(() => {
            tokenSchema.find()
                .then(token => {
                    assert.equal(token.length, 2);
                    assert.equal(token[1].userId, '987656789');
                    assert.equal(token[1].access_token, 'good good');
                    assert.equal(token[1].token_type, tokenObj.token_type);
                    assert.equal(token[1].expire_at, tokenObj.expire_at);
                    assert.equal(token[1].refresh_token, tokenObj.refresh_token);
                    assert.equal(token[1].scope, tokenObj.scope);
                    done();
                });
        });
    });
    it('get() Get second token', function (done) {
        tokenSchema.get(tokenObj.userId)
            .then(token => {
                assert.equal(token.userId, '987656789');
                assert.equal(token.access_token, 'good good');
                assert.equal(token.token_type, tokenObj.token_type);
                assert.equal(token.expire_at, tokenObj.expire_at);
                assert.equal(token.refresh_token, tokenObj.refresh_token);
                assert.equal(token.scope, tokenObj.scope);
                done();
            });
    });
    it('Remove first token', function (done) {
        tokenSchema.deleteOne({ userId: '1234554321' }, err => {
            tokenSchema.find()
                .then(token => {
                    assert.equal(token.length, 1);
                    done();
                });
        })
    });
    it('Should drop test database', function (done) {
        mongoose.connection.db.dropDatabase();
        tokenSchema.find()
            .then(token => {
                assert.equal(token.length, 0);
                done();
            });
    });
});