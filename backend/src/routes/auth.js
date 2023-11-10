const router = require(`express`).Router()
const passport = require(`passport`)

router.get(`/google/login`, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(`/google/callback`,  passport.authenticate("google", { failureRedirect: "/api/auth/google/login" }),
// Redirect user back to the mobile app using deep linking
(req, res) => {
  res.redirect(
    `hackheroes://app/login?firstName=${req.user.firstName}/lastName=${req.user.lastName}/email=${req.user.email}`
  );
}
);
    
router.get("/logout", function (req, res) {
  req.session.destroy(function () {
    res.redirect("/");
  });
});

module.exports = router