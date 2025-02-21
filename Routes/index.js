//Packages
const express = require('express');
const router = express.Router();

// import Routes 
const Users = require('./Users');
const Urls = require('./Url');

//import Redirect
const RedirectUrl = require('./RedirectUrl');

//routes
router.use('/user', Users);
router.use('/api', Urls);




//redirecting
router.get('/:shortUrl', RedirectUrl);

module.exports = router;
