const {register, getOne} = require('../controllers/userController')
const uploads = require('../middleware/multer')
const router = require('express').Router();

router.post('/register',uploads.single('profilePicture'), register)
router.get('/getOne/:id',getOne)

module.exports = router
