const router = require('express').Router();
const ReportController = require('../controllers/Report.controller');
const AuthoMiddleware = require('../middlewares/Auth.middleware');
const RoleMiddleware = require('../middlewares/Role.middleware');

const { isAuth } = AuthoMiddleware;

router.get('/:id', isAuth, RoleMiddleware.IsAdmin, ReportController.getReportById);
router.get('/', isAuth, RoleMiddleware.IsAdmin, ReportController.getAllReports);

router.post('/', isAuth, ReportController.createReport);

router.put('/:id/approve', isAuth, RoleMiddleware.IsAdmin, ReportController.handleReport);
router.put('/:id/reject', isAuth, RoleMiddleware.IsAdmin, ReportController.rejectReport);
module.exports = router;
