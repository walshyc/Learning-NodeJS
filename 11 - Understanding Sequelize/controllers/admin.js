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

    req.user.createProduct({
            title: title,
            imageURL: imageURL,
            price: price,
            description: description
        })
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
    Product.findByPk(prodID)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageURL = updatedURL;
            return product.save();
        })
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
    req.user
        .getProducts({
            where: {
                id: prodID
            }
        })
        // Product.findByPk(prodID)
        .then(
            products => {
                const product = products[0];
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
    req.user
        .getProducts()
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
    Product.findByPk(prodID)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log("Destroyed Product");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};