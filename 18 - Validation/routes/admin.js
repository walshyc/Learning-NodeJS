const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');
const {
    body
} = require('express-validator');
const router = express.Router();

// admin/add-product GET
router.get('/add-product', adminController.getAddProduct);

// admin/add-product POST
router.post('/add-product', [
    body('title', 'Your title must be more than 3 characters long')
    .isString()
    .isLength({
        min: 3
    })
    .trim(),
    body('imageURL').isURL(),
    body('price', 'You must enter a number')
    .isFloat(),    
    body('description')
    .isLength({
        min: 5,
        max: 400
    })
    .trim()

], adminController.postAddProduct);

// // admin/products GET
router.get('/products', adminController.getProducts);

router.get('/edit-product/:productID', adminController.getEditProduct);

router.post('/edit-product', [
    body('title', 'Your title must be more than 3 characters long')
    .isString()
    .isLength({
        min: 3
    })
    .trim(),
    body('price', 'You must enter a number')
    .isFloat(),    
    body('description')
    .isLength({
        min: 5,
        max: 400
    })
    .trim(),
    body('imageURL').isURL(),

], adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;