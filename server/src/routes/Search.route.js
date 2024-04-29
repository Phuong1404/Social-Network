const router = require('express').Router();
const SearchController = require('../controllers/Search.controller');
const AuthoMiddleware = require('../middlewares/Auth.middleware');

const { isAuth } = AuthoMiddleware;

router.get('/', isAuth, SearchController.searchUserAndPost);

module.exports = router;
