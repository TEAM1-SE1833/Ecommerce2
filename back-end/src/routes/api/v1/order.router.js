const express = require('express');
const router = express.Router();
const { OrderController } = require('../../../controllers/index');
const AuthMiddleware = require('../../../middlewares/auth.middleware');

// Public routes
router.post('/create_order', OrderController.createOrder);
router.get('/orders/top-selling-products', OrderController.getTopSellingProducts);
router.get('/user/:userId', OrderController.getOrdersByUserId);

// Protected routes
router.put('/update_order/:orderId', AuthMiddleware.verifyToken, OrderController.updateOrder);
router.get('/detail_order/:orderId', AuthMiddleware.verifyToken, OrderController.getOrder);
router.get('/', AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), OrderController.getOrders);
router.delete('/delete_order/:orderId', AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), OrderController.deleteOrder);

// Admin routes
router.get('/get-paginated-orders', AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin', 'sales manager']), OrderController.getPaginatedAllOrders);


module.exports = router;