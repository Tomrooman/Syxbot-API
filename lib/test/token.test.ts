import mongoose from 'mongoose';
import tokenSchema from '../models/token';
import chai from 'chai';

const expect = chai.expect;

describe('Token', () => {
    const tokenObj = {
        userId: '1234554321',
        access_token: 'bad access token',
        token_type: 'little type',
        expire_at: '10000',
        refresh_token: 'big refresh token',
        scope: 'identify guilds'
    };

    it('Token should be empty', async () => {
        const token = await tokenSchema.find();

        expect(token).to.be.an('array').that.is.empty;
    });

    it('Add first token', async () => {
        await new tokenSchema(tokenObj).save();
        const token = await tokenSchema.find();

        expect(token).to.be.an('array').that.have.lengthOf(1);
        expect(token[0].userId).to.equal(tokenObj.userId);
        expect(token[0].access_token).to.equal(tokenObj.access_token);
        expect(token[0].token_type).to.equal(tokenObj.token_type);
        expect(token[0].expire_at).to.equal(tokenObj.expire_at);
        expect(token[0].refresh_token).to.equal(tokenObj.refresh_token);
        expect(token[0].scope).to.equal(tokenObj.scope);
    });

    it('get() Get first token', async () => {
        const token = await tokenSchema.get(tokenObj.userId);
        if (token) {
            expect(token.userId).to.equal(tokenObj.userId);
            expect(token.access_token).to.equal(tokenObj.access_token);
            expect(token.token_type).to.equal(tokenObj.token_type);
            expect(token.expire_at).to.equal(tokenObj.expire_at);
            expect(token.refresh_token).to.equal(tokenObj.refresh_token);
            expect(token.scope).to.equal(tokenObj.scope);
        }
    });

    it('Add second token', async () => {
        tokenObj.userId = '987656789';
        tokenObj.access_token = 'good good';

        await new tokenSchema(tokenObj).save();
        const token = await tokenSchema.find();

        expect(token).to.be.an('array').that.have.lengthOf(2);
        expect(token[1].userId).to.equal('987656789');
        expect(token[1].access_token).to.equal('good good');
        expect(token[1].token_type).to.equal(tokenObj.token_type);
        expect(token[1].expire_at).to.equal(tokenObj.expire_at);
        expect(token[1].refresh_token).to.equal(tokenObj.refresh_token);
        expect(token[1].scope).to.equal(tokenObj.scope);
    });

    it('get() Get second token', async () => {
        const token = await tokenSchema.get(tokenObj.userId);
        if (token) {
            expect(token.userId).to.equal('987656789');
            expect(token.access_token).to.equal('good good');
            expect(token.token_type).to.equal(tokenObj.token_type);
            expect(token.expire_at).to.equal(tokenObj.expire_at);
            expect(token.refresh_token).to.equal(tokenObj.refresh_token);
            expect(token.scope).to.equal(tokenObj.scope);
        }
    });

    it('Remove first token', async () => {
        await tokenSchema.deleteOne({ userId: '1234554321' });
        const token = await tokenSchema.find();

        expect(token).to.be.an('array').that.have.lengthOf(1);
    });

    it('Should drop test database', async () => {
        mongoose.connection.db.dropDatabase();
        const token = await tokenSchema.find();

        expect(token).to.be.an('array').that.is.empty;
    });
});