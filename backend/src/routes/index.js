const router = require(`express`).Router()
const auth = require(`./auth`);
const files = require(`./files`);

router.use(`/auth`,auth)
router.use(`/files`,files)
module.exports = router