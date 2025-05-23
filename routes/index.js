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
router.get(routes.edit, articleController.edit);
router.post(routes.firebasePost, articleController.firebasePost);
router.post(routes.firebaseEdit, articleController.firebaseEdit);
router.post(routes.firebaseDelete, articleController.firebaseDelete);

module.exports = router;
