const mongodb = require('mongodb');
const getDB = require('../util/database');

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDB();

        return db
            .collection('users')
            .insertOne(this);
    }

    static findById(userId) {
        const db = getDB();
        return db
            .collection('users')
            .findOne({
                _id: new mongodb.ObjectId(userId)
            });
    }
}

module.exports = User;