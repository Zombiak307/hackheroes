const passport = require(`passport`)
const LocalStrategy = require(`passport-local`)
const User = require(`../database/schemas/user`)
const { encrypt } = require(`../utils/utils`)

passport.serializeUser((user,done)=>{
    try{
        done(null,user.discordId)

    }catch(err){
        console.error(err)
        done(err,null)
    }
}) 
passport.deserializeUser(async(discordId,done)=>{
   try{
       const user = await User.findOne({discordId})
       return user ? done(null,user):done(null,null)
   }catch(err)
   {
       console.error(err)
       done(err,null)
   }
})

passport.use(new LocalStrategy(async function verify(username, password, cb) {
      const usr = await User.findOne({username, password}).catch(err => {
        console.error(err)
        return cb(err);
      })
      if (!usr) { return cb(null, false, { message: 'Incorrect username or password.' }); }
      return cb(null, user);
}));