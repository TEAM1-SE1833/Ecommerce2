const express = require('express');
const router = express.Router();
const { CartController } = require('../../../controllers/index');



router.post('/add-to-cart', CartController.addToCart);

router.put('/update', CartController.updateCart);

router.delete('/remove', CartController.removeFromCart);

router.get('/:userId', CartController.getCartById);
module.exports = router;