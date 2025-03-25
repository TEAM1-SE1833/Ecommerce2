const express = require('express');
const router = express.Router();
const { UserController } = require('../../../controllers/index');
const AuthMiddleware = require('../../../middlewares/auth.middleware');



router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.get('/verify-email', UserController.verifyEmail);
router.post('/refresh-token', UserController.refreshAccessToken);
router.post('/logout', AuthMiddleware.verifyToken, UserController.logout);

router.put('/profile', AuthMiddleware.verifyToken, UserController.updateProfile);
router.put('/change-password', AuthMiddleware.verifyToken, UserController.changePassword);
router.get('/profile', AuthMiddleware.verifyToken, UserController.getProfile);

router.get("/find", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.getAllUsers);
router.post("/create", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.createUser);
router.put("/update/:id", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.updateUser);
router.delete("/delete/:id", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.deleteUser);
router.get("/get-paginated-users", AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['admin']), UserController.getPaginatedUsers)

module.exports = router;
