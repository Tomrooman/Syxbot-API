import mongoose from 'mongoose';

describe('Index', () => {
    it('Connect to database', (done) => {
        mongoose.connect('mongodb://localhost/syxbot-database-test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            useFindAndModify: false
        });
        mongoose.connection.once('open', () => {
            done();
        });
    });
});