const router = require(`express`).Router()
const passport = require(`passport`)

router.get(`/discord/login`,passport.authenticate(`discord`,{
    failureRedirect:`${process.env.FRONTEND_URL}/`,
    successRedirect:`${process.env.FRONTEND_URL}/`,
    failureFlash:false,
}))

router.get(`/discord/redirect`,function(req, res, next) {
    passport.authenticate(`discord`, function(err, user, info) {
      if (err) {
        console.log(`[User-side login error] ${err}`); // will generate a 500 error
        return res.redirect(`${process.env.FRONTEND_URL}/`);
    }
      // Generate a JSON response reflecting authentication status
      if (! user) {
        console.log(`[User-side login error] ${err}`); // will generate a 500 error
        return res.redirect(`${process.env.FRONTEND_URL}/`);
      }
      // ***********************************************************************
      // "Note that when using a custom callback, it becomes the application's
      // responsibility to establish a session (by calling req.login()) and send
      // a response."
      // Source: http://passportjs.org/docs
      // ***********************************************************************
      req.login(user, loginErr => {
        if (loginErr) {
            console.log(`[Server-side login error] ${err}`); // will generate a 500 error
            return res.redirect(`${process.env.FRONTEND_URL}/`);
        }
        return res.redirect(`${process.env.FRONTEND_URL}/`);
      });      
    })(req, res, next);
  });
    
router.get('/logout', function(req, res){
    if(req.user)
    {
        req.logout();
        res.status(200).redirect(`${process.env.FRONTEND_URL}/`)
        //na stronę wylogowano czy coś przenieś
    }
    else
    {
        res.redirect(`${process.env.FRONTEND_URL}/`)
    }
  });

router.get('/added',function(req,res){
    const index = req.url.indexOf('&') + 10
    const guildId = req.url.slice(index,index+18)
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/${guildId}/info`)
})
module.exports = router