const{products} = require('../controllers/productController')
const router = require('express').Router();
const uploads = require('../middleware/multer')
router.post('/products', uploads.array('productImages', 5), products);

module.exports = router