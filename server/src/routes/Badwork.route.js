const router = require('express').Router();
const BadWordController = require('../controllers/BadWord.controller');
const AuthMiddleware = require('../middlewares/Auth.middleware');
const RoleMiddleware = require('../middlewares/Role.middleware');

const { isAuth } = AuthMiddleware;

router.get('/', isAuth, RoleMiddleware.IsAdmin, BadWordController.getAllBadWords);

router.post('/', isAuth, RoleMiddleware.IsAdmin, BadWordController.createBadWords);

router.put('/:id', isAuth, RoleMiddleware.IsAdmin, BadWordController.updateBadWords);

router.delete('/:id', isAuth, RoleMiddleware.IsAdmin, BadWordController.deleteBadWords);

module.exports = router;
