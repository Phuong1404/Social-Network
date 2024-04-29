const router = require('express').Router();
const passport = require('passport');
const AuthController = require('../controllers/Auth.controller');
const AuthMiddleware = require('../middlewares/Auth.middleware');

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	AuthController.loginGoogle
);

router.post('/otp/set-password', AuthMiddleware.isAuth, AuthController.sendOTP);
router.post('/otp/register', AuthController.sendOTPverify);

router.post('/refresh', AuthController.refreshToken);

router.post('/register', AuthController.registerUser);

router.post('/login', AuthController.login);

router.post('/password-reset', AuthController.sendLinkForgottenPassword);

router.post('/password-reset/:userId/:token', AuthController.resetPassword);

router.put('/change-password', AuthMiddleware.isAuth, AuthController.changePassword);

router.put('/set-password', AuthMiddleware.isAuth, AuthController.setPassword);
