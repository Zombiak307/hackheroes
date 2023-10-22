const fetch = require(`node-fetch`)
const OAuth2Credenitals = require(`../database/schemas/OAuth2Credentials`)
const TOKEN = process.env.BOT_TOKEN
const guildConfig = require(`../database/schemas/guildConfig`)
const {decrypt} = require('./utils')

async function getUserGuilds(discordId){
    const credenitals = await OAuth2Credenitals.findOne({discordId:discordId})
    if(!credenitals) throw new Error("No credentials")
    const response = await fetch("https://discord.com/api/v8/users/@me/guilds",{
        method: 'GET',
        headers: {
            Authorization: `Bearer ${await decrypt(credenitals.accessToken)}`
        }
    })
    if(response.status !== 200) return null
    return response.json()
}


async function getGuildInfo(guildId)
{
    const response = await fetch(`https://discord.com/api/v8/guilds/${guildId}?with_counts=true`,{
        method: 'GET',  
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    })
    let toJson = await response.json()
    if(toJson.code === 5001) return null
    const {id,icon} = toJson 
    if(!icon) return null
    toJson.icon = `https://cdn.discordapp.com/icons/${id}/${icon}`
    return toJson
}

module.exports = {getUserGuilds,getGuildInfo}
