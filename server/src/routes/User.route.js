const router = require('express').Router();
const UserController = require('../controllers/User.controller');
const AuthoMiddleware = require('../middlewares/Auth.middleware');
const PostController = require('../controllers/Post.controller');
const NotificationController = require('../controllers/Notification.controller');
const RoleMiddleware = require('../middlewares/Role.middleware');
const ActivityController = require('../controllers/Activity.controler');
const FileController = require('../controllers/File.controller');
const AlbumController = require('../controllers/Album.controller');

const { isAuth } = AuthoMiddleware;
const { getUserFromToken } = AuthoMiddleware;
router.get('/profile', isAuth, async (req, res) => {
	res.send(req.user);
});
router.delete('/:id', isAuth, RoleMiddleware.IsAdmin, UserController.delete);
router.get('/online', isAuth, RoleMiddleware.IsAdmin, UserController.getAllUserOnline);
router.get('/suggests', isAuth, UserController.suggestFriends);
router.get('/friends', isAuth, UserController.getFriendsList);
router.get('/notifications', isAuth, NotificationController.getNotifications);
router.get('/activities', isAuth, ActivityController.getAllActivityOfUser);
router.get('/searchUser/:type', isAuth, UserController.searchFriends);
router.get('/search', UserController.search);
router.get('/all', isAuth, RoleMiddleware.IsAdmin, UserController.getAllUsers);
router.get('/:id/friends', getUserFromToken, UserController.getFriendsListById);
router.get('/:id/posts', getUserFromToken, PostController.getAll);
router.get('/:id/medias', getUserFromToken, FileController.getAllMedia);
router.get('/:id/albums', getUserFromToken, AlbumController.getListAlbumByUserId);

router.get('/:id', getUserFromToken, UserController.getUserInfo);
router.get('/', UserController.getUser);
router.put('/hobbies', isAuth, UserController.addHobbies);
router.put('/remove-notification', isAuth, NotificationController.removeNotification);
router.put('/update-profile', isAuth, UserController.update);
router.put('/password', isAuth, UserController.updatePassword);
router.put('/set-password', isAuth, UserController.setPassword);
router.put('/:id/friend-request', isAuth, UserController.sendFriendRequest);
router.put('/:id/accept-friend', isAuth, UserController.acceptFriendRequest);
router.put('/:id/reject-request', isAuth, UserController.rejectFriendRequest);
router.put('/:id/unfriend', isAuth, UserController.unfriend);
router.delete('/activities/:id', isAuth, ActivityController.deleteActivity);

module.exports = router;
