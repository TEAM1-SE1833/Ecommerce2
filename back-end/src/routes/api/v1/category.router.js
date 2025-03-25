const express = require('express');
const router = express.Router();
const { CategoryController } = require('../../../controllers/index');


router.get('/', CategoryController.getAllCategories);
router.post('/', CategoryController.createCategory);
router.get('/:id', CategoryController.getCategoryById);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;