const express = require('express');

const router = express.Router({ mergeParams: true });
const MessageController = require('../controllers/Message.controller');
const AuthoMiddleware = require('../middlewares/Auth.middleware');

const { isAuth } = AuthoMiddleware;
router.post('/', isAuth, MessageController.add);
// router.post('/chatbot', isAuth, MessageController.chatWithChatgpt);
router.get('/', isAuth, MessageController.fetchMessages);
router.delete('/:id', isAuth, MessageController.delete);
router.put('/:id', isAuth, MessageController.update);

module.exports = router;
