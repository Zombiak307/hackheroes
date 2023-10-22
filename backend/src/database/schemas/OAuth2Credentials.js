const mongoose = require(`mongoose`)

const OAuth2CredentialsSchema = new mongoose.Schema({
    discordId:{
        type: String,
        required:true,
        unique:true,
    },
    accessToken:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model(`OAuth2Credentials`,OAuth2CredentialsSchema)