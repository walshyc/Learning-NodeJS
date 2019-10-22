const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageURL);
    product
        .save()
        .then(result => {
            console.log('created a product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};


exports.postEditProduct = (req, res, next) => {
    const prodID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedURL = req.body.imageURL;

    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedURL, prodID);
    product
        .save()
        .then(result => {
            console.log("Updated Product");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const prodID = req.params.productID;
    Product
        .findByID(prodID)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        }).catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodID = req.body.productID;
    Product
        .deleteByID(prodID)
        .then(() => {})
        .then(result => {
            console.log("Destroyed Product");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};