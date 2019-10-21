const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class Product {
    constructor(title, price, description, imageURL) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageURL = imageURL;
    }

    save() {
        const db = getDB();
        return db
            .collection('products')
            .insertOne(this)
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDB();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => console.log(err));
    }

    static findByID(prodID) {
        const db = getDB();
        return db
            .collection('products')
            .find({
                _id: new mongodb.ObjectId(prodID)
            })
            .next()
            .then(product => {
                return product;
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;