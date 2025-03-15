const express = require('express');
const router = express.Router();
const routes = require("../config.js");
const homeController = require('../controllers/homeController');
const articleController = require('../controllers/articleController');

router.get(routes.home, homeController.home);
router.get(routes.pageNotFound, homeController.missing_page);
router.get(routes.adminPage, homeController.admin);
router.post(routes.authenticate, homeController.authenticate);

router.get(routes.article, articleController.dynamic);
router.get(routes.gallery, articleController.gallery);
router.get(routes.createEntry, articleController.create);
router.post(routes.firebasePost, articleController.firebasePost);

module.exports = router;
