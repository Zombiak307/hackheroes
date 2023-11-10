const GoogleStrategy = require("passport-google-oauth20")
const passport = require(`passport`)
const User = require(`../database/schemas/user`)
const { encrypt } = require(`../utils/utils`)

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: 'http://localhost:5500/api/auth/google/callback',
    scope: [ 'profile','email' ],
    state: true
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    //done(err, user) will return the user we got from fb
    done(null, formatGoogle(profile._json));
  }
));

const formatGoogle = (profile) => {
    return {
      firstName: profile.given_name,
      lastName: profile.family_name,
      email: profile.emaiL
    }
}