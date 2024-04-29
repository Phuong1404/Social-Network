const router = require('express').Router();
const RoleController = require('../controllers/Role.controller');
const AuthoMiddleware = require('../middlewares/Auth.middleware');
const RoleMiddleware = require('../middlewares/Role.middleware');

router.post('/', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.create);
router.put('/:id', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.update);
router.get('/', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.getAll);
router.delete('/:id', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, RoleController.delete);

module.exports = router;
