const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware');
const Post = require('./Post');
const Get = require('./Get');
const Del = require('./Delete');
const GetFromSocialMedia = require('./GetFromSocialMedia');
const GetOne = require('./GetOne');
const Compare = require('./Compare');
const RedirectUrl = require('../RedirectUrl');
const GetUrlAnalytics = require('./GetUrlAnalytics');
const GetAnalysisByTopic = require('./GetAnalysisByTopic');
// const GetAnalysisByTopic = require('./GetAnalysisByTopic');
const getOverallAnalysis = require('./GetOverAllAnalytics');


// router.post('/create', authMiddleware, Post);
router.post('/shorten', authMiddleware, Post);
router.post('/compare', authMiddleware, Compare);

//Get
router.get('/shorten/:alias', RedirectUrl);
router.get('/analytics/topic/:topic', authMiddleware, GetAnalysisByTopic);
router.get('/analytics/overall', authMiddleware, getOverallAnalysis);
router.get('/get', authMiddleware, Get);
router.get('/socials', authMiddleware, GetFromSocialMedia);
router.get('/get/:id', authMiddleware, GetOne);

//Delete
router.delete('/del', authMiddleware, Del);



module.exports = router;
