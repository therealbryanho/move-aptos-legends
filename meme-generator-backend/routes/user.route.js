const { generateNFTImageAndJson, generateDominatedImage } = require('../controllers/user.controller');
const verifyRequest = require('../middlewares/authenticateRequest.middleware');

const router = require('express').Router();

router.post("/generateNFTImageAndJson", verifyRequest, generateNFTImageAndJson)
router.post("/generateDominatedImage", verifyRequest, generateDominatedImage)
router.post("/allDominatedImages", verifyRequest, allDominatedImages)

module.exports = router;
