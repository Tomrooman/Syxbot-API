/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */

import tokenSchema from '../lib/models/token';
import chai from 'chai';
import server from '../index';
import { tokenType } from '../lib/@types/models/token';

const expect = chai.expect;

describe('TOKEN', function () {
    this.timeout(5000);
    const tokenObj = {
        userID: '1234554321',
        access_token: 'bad access token',
        token_type: 'test type',
        expire_at: '2000',
        refresh_token: 'big refresh token',
        scope: 'identify guilds'
    };

    const modifiedTokenObj = {
        ...tokenObj,
        access_token: 'test access token',
        token_type: 'test token type',
        refresh_token: 'little test refresh token'
    };

    describe('Routes', () => {
        let websiteCookies: string;
        let websiteSession: { type: string, token: string };

        before(() => {
            websiteCookies = global.websiteCookies;
            websiteSession = global.websiteSession;
        });

        after(async () => {
            await tokenSchema.deleteMany({});
        });

        it('Token should be empty', async () => {
            const token = await tokenSchema.find();
            expect(token).to.be.an('array').that.is.empty;
        });

        it('/token/update => Return created token', done => {
            chai.request(server)
                .put('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...tokenObj, ...websiteSession, expires_in: 200 })
                .end((_err, res) => {
                    expect(res).to.have.status(201);
                    expect(Object.keys(res.body)).to.be.an('array').that.have.lengthOf(7);
                    expect(res.body._id).to.be.string;
                    expect(res.body.userID).to.equal(tokenObj.userID);
                    expect(res.body.access_token).to.equal(tokenObj.access_token);
                    expect(res.body.token_type).to.equal(tokenObj.token_type);
                    expect(res.body.expire_at).to.exist;
                    expect(res.body.refresh_token).to.equal(tokenObj.refresh_token);
                    expect(res.body.scope).to.equal(tokenObj.scope);
                    done();
                });
        });

        it('/token/update => Return updated token', done => {
            chai.request(server)
                .put('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...modifiedTokenObj, ...websiteSession, expire_at: 2000 })
                .end((_err, res) => {
                    expect(res).to.have.status(200);
                    expect(Object.keys(res.body)).to.be.an('array').that.have.lengthOf(7);
                    expect(res.body._id).to.be.string;
                    expect(res.body.userID).to.equal(tokenObj.userID);
                    expect(res.body.access_token).to.equal(modifiedTokenObj.access_token);
                    expect(res.body.token_type).to.equal(modifiedTokenObj.token_type);
                    expect(res.body.expire_at).to.exist;
                    expect(res.body.refresh_token).to.equal(modifiedTokenObj.refresh_token);
                    expect(res.body.scope).to.equal(tokenObj.scope);
                    done();
                });
        });

        it('/token/expiration => Return existing token + 500 because requesting discord api with false value', done => {
            chai.request(server)
                .post('/token/expiration')
                .set('Cookie', websiteCookies)
                .send(websiteSession)
                .end((_err, res) => {
                    expect(res).to.have.status(500);
                    expect(Object.keys(res.body)).to.be.an('array').that.have.lengthOf(7);
                    expect(res.body._id).to.be.string;
                    expect(res.body.userID).to.equal(tokenObj.userID);
                    expect(res.body.access_token).to.equal(modifiedTokenObj.access_token);
                    expect(res.body.token_type).to.equal(modifiedTokenObj.token_type);
                    expect(res.body.expire_at).to.exist;
                    expect(res.body.refresh_token).to.equal(modifiedTokenObj.refresh_token);
                    expect(res.body.scope).to.equal(tokenObj.scope);
                    done();
                });
        });

        it('/token/remove => Return delete confirmation', done => {
            chai.request(server)
                .delete('/token/remove')
                .set('Cookie', websiteCookies)
                .send({ ...tokenObj, ...websiteSession })
                .end((_err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.true;
                    done();
                });
        });

        it('/token/expiration => Return false + 400 if no token send', done => {
            chai.request(server)
                .post('/token/expiration')
                .set('Cookie', websiteCookies)
                .send(websiteSession)
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.false;
                    done();
                });
        });

        it('/token/remove => Return false + 400 if token does not exist', done => {
            chai.request(server)
                .delete('/token/remove')
                .set('Cookie', websiteCookies)
                .send({ ...tokenObj, ...websiteSession })
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.false;
                    done();
                });
        });

        it('/token/createCookie => Return false + 400 if no code send', done => {
            chai.request(server)
                .post('/token/createCookie')
                .set('Cookie', websiteCookies)
                .send(websiteSession)
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.false;
                    done();
                });
        });

        it('/token/createCookie => Return false + 500 even with code because requesting discord api with false value', done => {
            chai.request(server)
                .post('/token/createCookie')
                .set('Cookie', websiteCookies)
                .send({ ...websiteSession, code: 'fake' })
                .end((_err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body).to.be.false;
                    done();
                });
        });

        it('/token/update => Return false + 400 if access_token not send', done => {
            const alternativeTokenObj = {
                ...tokenObj,
                access_token: undefined
            };
            chai.request(server)
                .put('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...alternativeTokenObj, ...websiteSession })
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.false;
                    done();
                });
        });

        it('/token/update => Return false + 400 if refresh_token not send', done => {
            const alternativeTokenObj = {
                ...tokenObj,
                refresh_token: undefined
            };
            chai.request(server)
                .put('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...alternativeTokenObj, ...websiteSession })
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.false;
                    done();
                });
        });

        it('/token/update => Return false + 400 if scope not send', done => {
            const alternativeTokenObj = {
                ...tokenObj,
                scope: undefined
            };
            chai.request(server)
                .put('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...alternativeTokenObj, ...websiteSession })
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.false;
                    done();
                });
        });

        it('/token/update => Return false + 400 if token_type not send', done => {
            const alternativeTokenObj = {
                ...tokenObj,
                token_type: undefined
            };
            chai.request(server)
                .put('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...alternativeTokenObj, ...websiteSession })
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.false;
                    done();
                });
        });
    });

    describe('Model', () => {
        let savedToken: tokenType;

        after(async () => {
            await tokenSchema.deleteMany({});
        });

        it('Must not save without one property', done => {
            let token = new tokenSchema({ ...tokenObj, userID: undefined });
            let err = token.validateSync();
            expect(err).to.exist;
            token = new tokenSchema({ ...tokenObj, access_token: undefined });
            err = token.validateSync();
            expect(err).to.exist;
            token = new tokenSchema({ ...tokenObj, token_type: undefined });
            err = token.validateSync();
            expect(err).to.exist;
            token = new tokenSchema({ ...tokenObj, expire_at: undefined });
            err = token.validateSync();
            expect(err).to.exist;
            token = new tokenSchema({ ...tokenObj, refresh_token: undefined });
            err = token.validateSync();
            expect(err).to.exist;
            token = new tokenSchema({ ...tokenObj, scope: undefined });
            err = token.validateSync();
            expect(err).to.exist;
            done();
        });

        it('get() => Token should be empty', async () => {
            let token = await tokenSchema.get(tokenObj.userID);
            expect(token).to.be.false;
            token = await tokenSchema.get('');
            expect(token).to.be.false;
        });

        it('createToken() => Return created token', async () => {
            const token = await tokenSchema.createToken(tokenObj, 200) as tokenType;
            const noTokenObj = await tokenSchema.createToken({} as tokenType, 200);
            const noExpiresIn = await tokenSchema.createToken(tokenObj, 0);
            expect(Object.keys(token)).to.be.an('array').that.have.lengthOf(7);
            expect(token._id).to.be.string;
            expect(token.userID).to.equal(tokenObj.userID);
            expect(token.access_token).to.equal(tokenObj.access_token);
            expect(token.token_type).to.equal(tokenObj.token_type);
            expect(token.expire_at).to.exist;
            expect(token.refresh_token).to.equal(tokenObj.refresh_token);
            expect(token.scope).to.equal(tokenObj.scope);
            expect(noTokenObj).to.be.false;
            expect(noExpiresIn).to.be.false;
        });

        it('get() => Get one token', async () => {
            const token = await tokenSchema.get(tokenObj.userID) as tokenType;
            expect(Object.keys(token)).to.be.an('array').that.have.lengthOf(7);
            expect(token._id).to.be.string;
            expect(token.userID).to.equal(tokenObj.userID);
            expect(token.access_token).to.equal(tokenObj.access_token);
            expect(token.token_type).to.equal(tokenObj.token_type);
            expect(token.expire_at).to.exist;
            expect(token.refresh_token).to.equal(tokenObj.refresh_token);
            expect(token.scope).to.equal(tokenObj.scope);
            savedToken = token;
        });

        it('updateToken() => Return updated token', async () => {
            const updatedToken = {
                userID: tokenObj.userID,
                access_token: 'modified access token',
                token_type: 'modified type',
                refresh_token: 'modified refresh token',
                scope: tokenObj.scope
            };
            const token = await tokenSchema.updateToken(savedToken, updatedToken, 2000) as tokenType;
            const noTokenInfos = await tokenSchema.updateToken({} as tokenType, updatedToken, 2000);
            const noTokenObj = await tokenSchema.updateToken(savedToken, {} as tokenType, 2000);
            const noExpireAt = await tokenSchema.updateToken(savedToken, updatedToken, 0);
            expect(Object.keys(token)).to.be.an('array').that.have.lengthOf(7);
            expect(token._id).to.be.string;
            expect(token.userID).to.equal(tokenObj.userID);
            expect(token.access_token).to.equal(updatedToken.access_token);
            expect(token.token_type).to.equal(updatedToken.token_type);
            expect(token.expire_at).to.equal(tokenObj.expire_at);
            expect(token.refresh_token).to.equal(updatedToken.refresh_token);
            expect(token.scope).to.equal(tokenObj.scope);
            expect(noTokenInfos).to.be.false;
            expect(noTokenObj).to.be.false;
            expect(noExpireAt).to.be.false;
        });

        it('deleteToken() => Return delete confirmation', async () => {
            const token = await tokenSchema.deleteToken(tokenObj.userID);
            const nouserID = await tokenSchema.deleteToken('');
            const noExist = await tokenSchema.deleteToken(tokenObj.userID);
            expect(token).to.be.true;
            expect(nouserID).to.be.false;
            expect(noExist).to.be.false;
        });
    });
});