import express from "express";
const { authMiddleware } = require("../../helper/jwt")
const postcardController = require("./postcard_controller");
const postMiddleware = require("./postcard_middleware");
const router = express.Router();

router.post('/post_card/create', authMiddleware, postMiddleware.postcard_validator,postcardController.createPostcard)
router.get('/post_card/getall', authMiddleware, postcardController.getAllPostCards);
router.get('/post_card/get_data/:token', postcardController.getPostData);
router.post('/post_card/get_token/:id', authMiddleware, postcardController.getPostCardToken);

module.exports = router;