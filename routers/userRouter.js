const router = require('express').Router()
const {userController} = require('../controllers')
const { verifyToken, checkRole } = require('../middleware/auth')
const { multerUpload } = require('../middleware/multer')
const { checkRegister } = require('../middleware/validator')

router.post('/', checkRegister, userController.register)
router.get('/', verifyToken, checkRole, userController.getAll)
router.post('/login', userController.login)
router.get('/keep-login', verifyToken, userController.keeplogin)
router.patch('/', verifyToken, userController.updateUser);
router.patch('/update-password', verifyToken, userController.updatePassword);
router.patch('/update-admin', verifyToken, userController.updateAdmin);
router.patch('/change-img', verifyToken, multerUpload().single('file'), userController.updateImage)

module.exports = router;