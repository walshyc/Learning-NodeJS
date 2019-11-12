const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');
const PDFDocument = require('pdfkit');


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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });

};

exports.getProduct = (req, res, next) => {
    const prodID = req.params.productID;
    Product
        .findById(prodID)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: `${product.title} Information`,
                path: '/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
};

exports.postCart = (req, res, next) => {
    const prodID = req.body.productId;
    Product.findById(prodID)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
};


exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            const total = user.cart.cartTotal;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                total: total
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });

};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodID = req.body.productId;
    req.user
        .removeFromCart(prodID)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
};

exports.getOrders = (req, res, next) => {
    Order.find({
            'user.userId': req.user._id
        })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {

                return {
                    quantity: i.quantity,
                    product: {
                        ...i.productId._doc
                    }
                };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products,
                total: req.user.cart.cartTotal
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();

        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorised'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('------------------------');
            order.products.forEach(prod => {
                pdfDoc.fontSize(14).text(prod.product.title + " - " + prod.quantity + " x " + "€" + prod.product.price);
            });
            pdfDoc.fontSize(26).text('------------------------');
            pdfDoc.fontSize(22).text('Order Total:' + '€'+ order.total);


            pdfDoc.end();

            // const file = fs.createReadStream(invoicePath);

            // file.pipe(res);

        })
        .catch(err => next(err));

};