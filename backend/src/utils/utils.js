const cryptoJS = require('crypto-js');
const User = require('../database/schemas/user')

function findMutualGuilds(botGuilds,userGuilds){
    const validGuilds = userGuilds.filter((guild) => (guild.permissions & 0x20) === 0x20)
    const included = []
    const excluded = validGuilds.filter((guild)=>{
        const findGuild = botGuilds.find((g)=> g.guildId === guild.id)
        if(!findGuild){
            guild.guildId = guild.id
            guild.icon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.guildId}/${guild.icon}` : `https://cdn.discordapp.com/embed/avatars/1.png`
            return guild
        }
        included.push(findGuild)
    })
    
    return {included,excluded}

}

async function encrypt(token){
    return await cryptoJS.AES.encrypt(token, process.env.SECRET_PASS).toString()
}
async function decrypt(token){
    return await cryptoJS.AES.decrypt(token, process.env.SECRET_PASS).toString(cryptoJS.enc.Utf8)
}

module.exports = {encrypt,decrypt,findMutualGuilds}