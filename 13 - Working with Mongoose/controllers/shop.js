const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.log(err));

};

exports.getProduct = (req, res, next) => {
    const prodID = req.params.productID;
    Product
        .findByID(prodID)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: `${product.title} Information`,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodID = req.body.productID;
    Product.findByID(prodID)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
            });
        })
        .catch(err => console.log(err));

};



exports.postCartDeleteProduct = (req, res, next) => {
    const prodID = req.body.productID;
    req.user
        .deletItemFromCart(prodID)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .addOrder()
        .then(result => res.redirect('/orders'))
        .catch(err => console.log(err));
};