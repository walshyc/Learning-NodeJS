const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient
        .connect('mongodb+srv://conorw:zP5o2576NSCVhxvt@cluster0-srq59.mongodb.net/test?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected!');
            callback(client);
        })
        .catch(err => console.log(err));
};

module.exports = mongoConnect;