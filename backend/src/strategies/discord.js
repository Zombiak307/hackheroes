const passport = require(`passport`)
const discordStrategy = require(`passport-discord`)
const User = require(`../database/schemas/user`)
const OAuth2Credentials = require(`../database/schemas/OAuth2Credentials`) 
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

passport.use(new discordStrategy({
    clientID:process.env.DASHBOARD_CLIENT_ID,
    clientSecret: process.env.DASHBOARD_CLIENT_SECRET,
    callbackURL: process.env.DASHBOARD_CALLBACK_URL,
    scope: [`identify`,`guilds`]
},async (accessToken, refreshToken, profile,done)=>{
    const encryptedAccessToken = await encrypt(accessToken)
    const encryptedRefreshToken = await encrypt(refreshToken)
    const {id,username,discriminator,avatar} = profile;

    try{
    const findUser = await User.findOneAndUpdate({discordId:id},{
        discordTag: `${username}#${discriminator}`,
        avatar: avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}` : `https://cdn.discordapp.com/embed/avatars/${discriminator%5}.png`,
        allowedGuilds:[],
        lastLogin:new Date()
    }, {new: true}).catch(err => {console.error(err);return done(null,null)})
    const findCredentials = await OAuth2Credentials.findOneAndUpdate({discordId:id},{
        accessToken:encryptedAccessToken,
        refreshToken:encryptedRefreshToken,
    }).catch(err => {console.error(err);return done(null,null)})
    if(findUser)
    {
        if(findUser.flags.includes("BANNED")) return done("You have been banned",null)
        if(!findCredentials){
            const newCredentials = await OAuth2Credentials.create({
                discordId:id,
                accessToken:encryptedAccessToken,
                refreshToken:encryptedRefreshToken,
            })
        }
        return done(null,findUser)
    }
    else
    {
        const EPOCH = isNaN(parseInt(process.env.SNOWFLAKE_EPOCH)) ? 1420070400000 : parseInt(process.env.SNOWFLAKE_EPOCH)
        const timestamp = new Date(id / 4194304 + EPOCH)
        const newUser = await User.create({
                discordId:id,
                discordTag: `${username}#${discriminator}`,
                avatar: avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}` : `https://cdn.discordapp.com/embed/avatars/${discriminator%5}.png`,
                canReport:true,
                createdAt: timestamp,
                votedAt: new Date().getTime() -  (12 * 60 * 60 * 1000),
                allowedGuilds:[],
                flags:["CAN_REPORT"],
                lastLogin:new Date()
        })
        const newCredentials = await OAuth2Credentials.create({
            discordId:id,
            accessToken:encryptedAccessToken,
            refreshToken:encryptedRefreshToken,
        })
        return done(null,newUser)
    }
}
catch(err)
{console.error(err)
return done(err,null)}
})
)