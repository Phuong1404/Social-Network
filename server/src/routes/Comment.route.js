const express = require('express');

const router = express.Router({ mergeParams: true });
const AuthoMiddleware = require('../middlewares/Auth.middleware');
const CommentController = require('../controllers/Comment.controller');

router.post('/:id/reply', AuthoMiddleware.isAuth, CommentController.addReply);
router.post('/', AuthoMiddleware.isAuth, CommentController.add);

router.put('/:id/react', AuthoMiddleware.isAuth, CommentController.react);
router.put('/:id', AuthoMiddleware.isAuth, CommentController.update);

router.delete('/:id', AuthoMiddleware.isAuth, CommentController.delete);

router.get('/:id/replies', AuthoMiddleware.getUserFromToken, CommentController.getAllReplies);
router.get('/:id', AuthoMiddleware.getUserFromToken, CommentController.get);
router.get('/', AuthoMiddleware.getUserFromToken, CommentController.getAllOfPost);

module.exports = router;
