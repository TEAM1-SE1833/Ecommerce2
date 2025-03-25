const express = require('express');
const router = express.Router();
const { BrandController } = require('../../../controllers/index');


router.get('/', BrandController.getAllBrands);
router.post('/', BrandController.createBrand);
router.get('/:id', BrandController.getBrandById);
router.put('/:id', BrandController.updateBrand);
router.delete('/:id', BrandController.deleteBrand);
module.exports = router;