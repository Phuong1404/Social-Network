const router = require('express').Router();
const HobbyController = require('../controllers/User.controller');
const AuthoMiddleware = require('../middlewares/Auth.middleware');
const RoleMiddleware = require('../middlewares/Role.middleware');

const { isAuth } = AuthoMiddleware;

router.get('/', isAuth, HobbyController.getAllHobby);

router.post('/', isAuth, RoleMiddleware.IsAdmin, HobbyController.createNewHobby);

router.put('/:id', isAuth, RoleMiddleware.IsAdmin, HobbyController.updateHobby);

router.delete('/:id', isAuth, RoleMiddleware.IsAdmin, HobbyController.deleteHobby);

module.exports = router;
