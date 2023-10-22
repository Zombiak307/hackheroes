const router = require(`express`).Router()
const auth = require(`./auth`);
const logs = require(`./logs`);

router.use(`/auth`,auth)
router.use(`/logs`,logs)
module.exports = router