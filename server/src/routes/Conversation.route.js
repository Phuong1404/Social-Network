const express = require('express');

const router = express.Router();
const AuthoMiddleware = require('../middlewares/Auth.middleware');
const ConversationController = require('../controllers/Conversation.controller');

const { isAuth } = AuthoMiddleware;

router.post('/', isAuth, ConversationController.add);
// router.get('/random', ConversationController.createRandomConversation);
router.get('/video-call', isAuth, ConversationController.createRoomIDVideoCall);




router.get('/getAll', ConversationController.getAll);
router.get('/search', isAuth, ConversationController.search);
router.get('/', isAuth, ConversationController.getConversationOfUser);
router.get('/:id', isAuth, ConversationController.getConversationById);

router.get('/find/:userId', isAuth, ConversationController.getConversationByUserIds);

router.get('/:id/files/:type', isAuth, ConversationController.getAllMedia);



router.patch('/:id/members/:type', isAuth, ConversationController.updateMembers);
router.put('/:id/leave', isAuth, ConversationController.leaveConversation);
router.put('/:id', isAuth, ConversationController.update);


router.delete('/user-deleted/:id', isAuth, ConversationController.userDeletedAllMessages);

router.delete('/:id', isAuth, ConversationController.delete);

module.exports = router;
