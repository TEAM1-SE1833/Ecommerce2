const brandRouter = require('./brand.router');
const cartRouter = require('./cart.router');
const categoryRouter = require('./category.router');
const orderRouter = require('./order.router');
const productRouter = require('./product.router');
const userRouter = require('./user.router');
const reviewRouter = require('./review.router');
const express = require('express');
const router = express.Router();

router.use('/brand', brandRouter);
router.use('/cart', cartRouter);
router.use('/category', categoryRouter);
router.use('/order', orderRouter);
router.use('/product', productRouter);
router.use('/user', userRouter);
router.use('/review', reviewRouter);
module.exports = router;
