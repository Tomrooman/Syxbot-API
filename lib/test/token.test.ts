import tokenSchema from '../models/token';
import chai from 'chai';
import server from './../../index';

const expect = chai.expect;

describe('TOKEN', () => {
    const tokenObj = {
        userId: '1234554321',
        access_token: 'bad access token',
        token_type: 'test type',
        refresh_token: 'big refresh token',
        scope: 'identify guilds'
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

        it('/token/update => Add token', done => {
            chai.request(server)
                .post('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...tokenObj, ...websiteSession, expires_in: 200 })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(Object.keys(res.body)).to.be.an('array').that.have.lengthOf(7);
                    expect(res.body._id).to.be.string;
                    expect(res.body.userId).to.equal(tokenObj.userId);
                    expect(res.body.access_token).to.equal(tokenObj.access_token);
                    expect(res.body.token_type).to.equal(tokenObj.token_type);
                    expect(res.body.expire_at).to.exist;
                    expect(res.body.refresh_token).to.equal(tokenObj.refresh_token);
                    expect(res.body.scope).to.equal(tokenObj.scope);
                    done();
                });
        });

        it('/token/update => Update token', done => {
            const modifiedTokenObj = {
                ...tokenObj,
                access_token: 'test access token',
                token_type: 'test token type',
                refresh_token: 'little test refresh token',
            };
            chai.request(server)
                .post('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...modifiedTokenObj, ...websiteSession, expire_at: 2000 })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(Object.keys(res.body)).to.be.an('array').that.have.lengthOf(7);
                    expect(res.body._id).to.be.string;
                    expect(res.body.userId).to.equal(tokenObj.userId);
                    expect(res.body.access_token).to.equal(modifiedTokenObj.access_token);
                    expect(res.body.token_type).to.equal(modifiedTokenObj.token_type);
                    expect(res.body.expire_at).to.exist;
                    expect(res.body.refresh_token).to.equal(modifiedTokenObj.refresh_token);
                    expect(res.body.scope).to.equal(tokenObj.scope);
                    done();
                });
        });

        it('/token/remove => Remove token', done => {
            chai.request(server)
                .post('/token/remove')
                .set('Cookie', websiteCookies)
                .send({ ...tokenObj, ...websiteSession })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.true;
                    done();
                });
        });

        it('/token/remove => Return false if token does not exist', done => {
            chai.request(server)
                .post('/token/remove')
                .set('Cookie', websiteCookies)
                .send({ ...tokenObj, ...websiteSession })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.false;
                    done();
                });
        });

        it('/token/update => Return false without access_token', done => {
            const modifiedTokenObj = {
                ...tokenObj,
                access_token: undefined,
            };
            chai.request(server)
                .post('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...modifiedTokenObj, ...websiteSession })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('boolean').that.be.false;
                    done();
                });
        });

        it('/token/update => Return false without refresh_token', done => {
            const modifiedTokenObj = {
                ...tokenObj,
                refresh_token: undefined,
            };
            chai.request(server)
                .post('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...modifiedTokenObj, ...websiteSession })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('boolean').that.be.false;
                    done();
                });
        });

        it('/token/update => Return false without scope', done => {
            const modifiedTokenObj = {
                ...tokenObj,
                scope: undefined,
            };
            chai.request(server)
                .post('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...modifiedTokenObj, ...websiteSession })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('boolean').that.be.false;
                    done();
                });
        });

        it('/token/update => Return false without token_type', done => {
            const modifiedTokenObj = {
                ...tokenObj,
                token_type: undefined,
            };
            chai.request(server)
                .post('/token/update')
                .set('Cookie', websiteCookies)
                .send({ ...modifiedTokenObj, ...websiteSession })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('boolean').that.be.false;
                    done();
                });
        });
    });
});