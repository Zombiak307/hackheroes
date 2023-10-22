const router = require(`express`).Router()
const fetch = require('node-fetch');

router.put('/apolloError', async function (req, res) {
    if(!req.headers.origin || req.headers.origin !== process.env.FRONTEND_URL) return
    const {msg,msg2} = req.body
    if(!msg) return

    const params = {
        username: "Apollo error",
        embeds: [
            {
                "title": "**BŁĄD**",
                "color": 0xff0000,
                "description": msg + "\n\n" + (msg2 ? msg2 : "")
            }
        ]
    };

    await fetch(process.env.WEBHOOK_ERROR_LOG, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(params)
    })

})

module.exports = router