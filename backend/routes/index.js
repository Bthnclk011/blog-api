const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const postControllers = require('../controllers/postControllers');
const commentControllers = require('../controllers/commentControllers');
const utilityControllers = require('../controllers/utilityControllers');
const authControllers = require('../controllers/authControllers');

// USERS API REQUEST
router.get('/users', userControllers.get_users);
router.post('/users', userControllers.post_user);
router.get('/users/:userId', userControllers.get_user);
router.put('/users/:userId', userControllers.put_user);
router.delete('/users/:userId', userControllers.delete_user);

// POSTS API REQUEST
router.get('/posts', postControllers.get_posts);
router.post('/post-create', postControllers.post_posts);
router.get('/posts/:postId', postControllers.get_post_page);
router.put('/posts/:postId', postControllers.put_post_page);
router.delete('/posts/:postId', postControllers.delete_post_page);

//COMMENTS API REQUEST
router.get('/posts/:postId/comments', commentControllers.get_comments);
router.post('/posts/:postId/post-comment', commentControllers.post_comment);
router.get('/posts/:postId/:commentId', commentControllers.get_comment);
router.put('/posts/:postId/:commentId', commentControllers.put_comment);
router.delete('/posts/:postId/:commentId', commentControllers.delete_comment);

//CATEGORIES API REQUEST
router.get('/categories', utilityControllers.get_categories);
router.post('/categories', utilityControllers.post_categories);
router.put('/categories/:categoryId', utilityControllers.put_categories);
router.delete('/categories/:categoryId', utilityControllers.delete_categories);

//AUTH Controllers
router.get('/log-in', authControllers.login);
router.post('/sign-up', authControllers.sign_up);
router.get('/auth/me', authControllers.get_me);

module.exports = router;
