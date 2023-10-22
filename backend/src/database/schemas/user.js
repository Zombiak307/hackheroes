const mongoose = require(`mongoose`)

const UserSchema = new mongoose.Schema({
    discordId:{
        type: String,
        required:true,
        unique:true,
    },
    discordTag:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    characters:{
        // Here player characters IDs will be stored
        type:Array,
        default:[]
    },
    games:{
        // Here player games(campaigns) will be stored.  
        type:Array,
        default:[]
    }

})

module.exports = mongoose.model(`user`,UserSchema)