const express = require('express')
// auth
const { login } = require('./controllers/auth')
// product
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('./controllers/product')
// order
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('./controllers/order')
// supplier
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('./controllers/supplier')
// user
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('./controllers/user')

// -----------------------------------------------------------------------------

const router = express.Router()

router.post('/auth', login)

// product routes
router.get('/product', getProducts)
router.get('/product/:id', getProduct)
router.post('/product', createProduct)
router.patch('/product/:id', updateProduct)
router.delete('/product/:id', deleteProduct)

// order routes
router.get('/order', getOrders)
router.get('/order/:id', getOrder)
router.post('/order', createOrder)
router.patch('/order/:id', updateOrder)
router.delete('/order/:id', deleteOrder)

// supplier routes
router.get('/supplier', getSuppliers)
router.get('/supplier/:id', getSupplier)
router.post('/supplier', createSupplier)
router.patch('/supplier/:id', updateSupplier)
router.delete('/supplier/:id', deleteSupplier)

// user routes
router.get('/user', getUsers)
router.get('/user/:username', getUser)
router.post('/user', createUser)
router.patch('/user/:username', updateUser)
router.delete('/user/:id', deleteUser)

module.exports = router
