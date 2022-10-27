const express = require('express')
const { authJwt } = require('../src/middleware')
// controller
const auth = require('./controllers/auth')
const category = require('./controllers/category')
const product = require('./controllers/product')
const order = require('./controllers/order')
const supplier = require('./controllers/supplier')
const user = require('./controllers/user')

// -----------------------------------------------------------------------------

const router = express.Router()

// [authJwt.verifyToken] => for session token check

/* ---------- AUTH ROUTES ---------- */
router.get('/auth', auth.verify) // user sign in
router.post('/auth/signin', auth.signin) // user sign in
router.post('/auth/signup', auth.signup) // user sign up
router.post('/auth/signout', auth.signout) // user sign out

/* ---------- CATEGORY ROUTES ---------- */
router.get('/category', [authJwt.verifyToken], category.getCategories) // get all

/* ---------- PRODUCT ROUTES ---------- */
router.get('/product', [authJwt.verifyToken], product.getProducts) // get all
router.get('/product/:slug', [authJwt.verifyToken], product.getProduct) // get detail by name
router.post('/product', [authJwt.verifyToken], product.createProduct) // create new data
router.get('/product/:id/edit', [authJwt.verifyToken], product.editProduct) // get detail by id for edit
router.patch('/product/:id/update', [authJwt.verifyToken], product.updateProduct) // update data by id
router.delete('/product/:id/delete', [authJwt.verifyToken], product.deleteProduct) // delete data by id

/* ---------- ORDER ROUTES ---------- */
router.get('/order', [authJwt.verifyToken], order.getOrders) // get all
router.get('/order/invoice', [authJwt.verifyToken], order.getOrder) // get detail by id
router.post('/order', [authJwt.verifyToken], order.createOrder) // create new data
router.get('/order/:id/edit', [authJwt.verifyToken], order.editOrder) // get detail by id for edit
router.patch('/order/:id/update', [authJwt.verifyToken], order.updateOrder) // update data by id
router.delete('/order/:id/delete', [authJwt.verifyToken], order.deleteOrder) // delete data by id

/* ---------- SUPPLIER ROUTES ---------- */
router.get('/supplier', [authJwt.verifyToken], supplier.getSuppliers) // get all
router.get('/supplier/:name', [authJwt.verifyToken], supplier.getSupplier) // get detail by name
router.post('/supplier', [authJwt.verifyToken], supplier.createSupplier) // create new data
router.get('/supplier/:id/edit', [authJwt.verifyToken], supplier.editSupplier) // get detail by id for edit
router.patch('/supplier/:id/update', [authJwt.verifyToken], supplier.updateSupplier) // update data by id
router.delete('/supplier/:id/delete', [authJwt.verifyToken], supplier.deleteSupplier)

/* ---------- USER ROUTES ---------- */
router.get('/user', [authJwt.verifyToken], user.getUsers) // get all
router.get('/user/:username', [authJwt.verifyToken], user.getUser) // get detail by username
router.post('/user', [authJwt.verifyToken], user.createUser) // create new data
router.get('/user/:id/edit', [authJwt.verifyToken], user.editUser) // get detail by id for edit
router.patch('/user/:id/update', [authJwt.verifyToken], user.updateUser) // update by id
router.delete('/user/:id/delete', [authJwt.verifyToken], user.deleteUser) // delete by id

module.exports = router
