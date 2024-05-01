const express = require('express');

const router = express.Router();
const AuthoMiddleware = require('../middlewares/Auth.middleware');
const PostController = require('../controllers/Post.controller');


router.post('/', AuthoMiddleware.isAuth, PostController.add);

router.post('/:id/share', AuthoMiddleware.isAuth, PostController.share);


router.put('/:id/react', AuthoMiddleware.isAuth, PostController.react);

router.put('/:id', AuthoMiddleware.isAuth, PostController.update);


router.delete('/:id', AuthoMiddleware.isAuth, PostController.delete);

router.get('/home', AuthoMiddleware.isAuth, PostController.getPostInHome);

router.get('/user/:id', AuthoMiddleware.getUserFromToken, PostController.getAll);

router.get('/:id/reacts', PostController.getAllReactions);

router.get('/search', AuthoMiddleware.isAuth, PostController.search);

router.get('/:id', AuthoMiddleware.getUserFromToken, PostController.get);

router.get('/', AuthoMiddleware.isAuth, PostController.getAllPosts);

module.exports = router;
