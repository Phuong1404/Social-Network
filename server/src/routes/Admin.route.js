const router = require('express').Router();
const AdminController = require('../controllers/Admin.controller');
const RoleMiddleware = require('../middlewares/Role.middleware');
const AuthoMiddleware = require('../middlewares/Auth.middleware');
const ReportController = require('../controllers/Report.controller');
const UserController = require('../controllers/User.controller');
const ActivityController = require('../controllers/Activity.controler');
const AuthoController = require('../controllers/Auth.controller');

router.get('/dashboard', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.getDashboard);
router.get('/statictisUser', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.statictisUserPieChart);
router.get('/reports', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, ReportController.getAllReports);
router.get('/newUsers', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.getListNewUser);
router.get('/usersAccess', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.chartAccessUser);
router.get('/searchUser', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.searchUser);
router.get('/searchAdmin', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.searchAdmin);
router.get(
	'/activityUser/:id',
	AuthoMiddleware.isAuth,
	RoleMiddleware.IsAdmin,
	ActivityController.getAcitivityOfUserByUserId
);

router.post('/login', AdminController.login);
router.post('/refresh', AuthoController.refreshToken);
router.post('/createAccount', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, UserController.createAccountAdmin);

router.put('/unlockUser/:id', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, UserController.unlockAccount);
router.put('/lockUser/:id', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, UserController.lockAccount);
router.put('/changePW', AuthoMiddleware.isAuth, RoleMiddleware.IsAdmin, AdminController.changePassword);

module.exports = router;
