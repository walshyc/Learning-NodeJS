const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });

};

exports.getProduct = (req, res, next) => {
    const prodID = req.params.productID;
    selectedProduct = Product.findbyID(prodID, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: `${product.title} Information`,
            path: '/products'
        });
    });

};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodID = req.body.productID;
    Product.findbyID(prodID, product => {
        Cart.addProduct(prodID, product.price);
    });
    res.redirect('/cart');
};


exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty });
                }
            }

            const cartTotalPrice = Cart.totalPrice;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts,
                cartTotal: cartTotalPrice
            });
        });
    });

};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodID = req.body.productID;
    Product.findbyID(prodID, product => {
        Cart.deleteProduct(prodID, product.price);
        res.redirect('/cart');
    });
    
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};