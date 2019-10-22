const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDB();

        return db
            .collection('users')
            .insertOne(this);
    }

    addToCart(product) {
        // const cartProduct = this.cart.items.findIndex(cp => {
        //     return cartProduct._id === product._id;
        // });
        product.quantity = 1;
        const updatedCart = {
            items: [{
                productId: new mongodb.ObjectId(product._id),
                quantity: 1
            }]
        };

        const db = getDB();
        return db
            .collection('users')
            .updateOne({
                _id: new mongodb.ObjectId(this._id)
            }, {
                $set: {
                    cart: updatedCart
                }
            });

    }

    static findById(userId) {
        const db = getDB();
        return db
            .collection('users')
            .findOne({
                _id: new mongodb.ObjectId(userId)
            })
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => console.log(err));
    }
}

module.exports = User;