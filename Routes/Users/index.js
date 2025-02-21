const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware');
const Get = require('./Get');
const Post = require('./Post');
const Login = require('./Login');
const KeepSignin = require('./KeepSignin');

router.get('/', authMiddleware, Get);
router.get('/keep-signin', authMiddleware, KeepSignin);
router.post('/', Post);
router.post('/login', Login);



module.exports = router;
