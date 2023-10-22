const guildConfig = require('../../database/schemas/guildConfig')
const Submission = require('../../database/schemas/communitySubmissions')
const User = require('../../database/schemas/user')
const {UserInputError,ApolloError,AuthenticationError, ForbiddenError} = require(`apollo-server-express`)
const { getUserGuilds } = require('../../utils/api')
const { findMutualGuilds,addToAuditLog } = require('../../utils/utils')
const { Collection } = require(`@discordjs/collection`)

global.allowedGuilds = new Collection()

module.exports = {
    Query: {
        async getGuildConfig(_,args,req){
            const config = await guildConfig.findOne({guildId:args.guildId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!config) return null
            if(global.banList.get(config.guildId)) config.banId = global.banList.get(config.guildId).banId
            return config;
        },
        async getMutualGuilds(_,args,req){
            if(!req.user) throw new AuthenticationError('User not logged in')
            const userGuilds = await getUserGuilds(req.user.discordId)
            if(!userGuilds) throw new ApolloError("Discord API error")
            const botGuilds = await guildConfig.find({off:false}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            const mutuals = findMutualGuilds(botGuilds,userGuilds)
            const arrayHelper = []
            mutuals.included.forEach(guild => {
                arrayHelper.push(guild.guildId)
            })
            mutuals.excluded.forEach(guild => {
                arrayHelper.push(guild.id)
            })

            const foundUser = await User.findOne({discordId:req.user.discordId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!foundUser) throw new ApolloError('User not found')
            foundUser.allowedGuilds = arrayHelper
            await foundUser.save().catch(err => {console.error(err);throw new ApolloError('Database error')})

            allowedGuilds.set(req.user.discordId,arrayHelper)
            
            return mutuals;
        },
        async getGuildFromLink(_,args,req){
           const config = await guildConfig.findOne({link:args.link}).catch(err => {console.error(err);throw new ApolloError('Database error')})
           return config; 
        },

        //List queries starts here
        async getMainPageGuilds(){
                const bumped = await guildConfig.find({off:false}).sort({ bumped: -1 }).limit(10).catch(err => {console.error(err);throw new ApolloError('Database error')})
   
                const featured = await guildConfig.find({off:false,flags:{$in:["VERIFICATED", "PREMIUM","PARTNERSHIP"]}}).sort({score: -1}).limit(6).catch(err => {console.error(err);throw new ApolloError('Database error')})
                return {bumped,featured}
        },
        async getVoteList(_,{currentPage}){
            currentPage = currentPage*20

            const config = await guildConfig.find({off:false}).skip(currentPage-20).limit(20).sort('-score').catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!config[0]) return {listEnded:true}
            return {voteList:config}
        },
        async getBumpList(_,{currentPage}){
            currentPage = currentPage*20
            //.skip(currentPage-20).limit(20)
            const config = await guildConfig.find({off:false}).sort({ bumped: -1 }).skip(currentPage-20).limit(20).catch(err => {console.error(err);throw new ApolloError('Database error')})
            
            if(!config[0])return {listEnded:true}
            return {bumpList:config}
        },
        async getTagList(_,args){
            let currentPage = args.currentPage*20
            const config = await guildConfig.find({tags:{$in:args.tag}, off:false}).sort('-score').skip(currentPage-20).limit(20).catch(err => {console.error(err);throw new ApolloError('Database error')})
           
            if(!config[0]) return {listEnded:true,tag:args.tag}  
            return {tagList:config,tag:args.tag}
        },
        async getSearchList(_,args,req){
            const guilds = await guildConfig.find({$or:[{"name":{ "$regex": args.valueToSearch, "$options": "i" }}]}).sort("-score").limit(20).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return guilds;
        },
        //List queries ends here
        async getGuildSubmission(_,args,req){
            if(!req.user) throw new AuthenticationError('User not logged in')
            const submission = await Submission.findOne({guildId:args.guildId}).sort({_id: -1}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return submission;
        }
    },
    Mutation:{
        async updateGuildConfig(_,{guildId,values,adminEdit},req){
            const foundUser = await User.findOne({discordId:req.user.discordId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!foundUser) throw new ApolloError('User not found')
            if(!JSON.stringify(foundUser.allowedGuilds).includes(guildId) && !global.userPerms.get(req.user.discordId) >= 3) throw new ForbiddenError("User cannot change config of this guild")
            const newValues = JSON.parse(values)
            if(newValues.link){
                const guildWithSameLink = await guildConfig.findOne({link:newValues.link}).catch(err => {console.error(err);throw new ApolloError('Database error')})
                if(guildWithSameLink  && guildWithSameLink.guildId !== guildId) throw new UserInputError("Link taken")
            }
            //FIXME: Z niewiadomych przyczyn tagi i gradient się "nullują", kiedy to query jest wywołane z panelu admina. Sprawdzić!
            //NOTE: Chyba naprawione, nie mogę tego buga odtworzyć
            if(newValues.tags){
                for(let i = 0; i < newValues.tags.length; i++){
                    newValues.tags[i] = newValues.tags[i].label
                }
            }

            let reason = "Zmiana"
            const oldData = await guildConfig.findOne({guildId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            
            if(!oldData.flags.includes("PREMIUM")){
                newValues.cardGradient = null
            };
            if(newValues.gradient){
                newValues.gradient = global.gradientList.get(newValues.gradient)
            }
            
            if(newValues.lastEditedGradient ==='custom' && (oldData.flags.includes("PREMIUM") || oldData.flags.includes("PARTNERSHIP"))){
                newValues.gradient = newValues.customGradient
            }       

            if(newValues.link && newValues.link !== oldData.link){
                reason = reason+", linku"
                if(newValues.link){
                    if(!/^[a-z0-9]+$/.test(newValues.link) || newValues.link.length > 32) throw new UserInputError("Link does not matches regex")
                } 
            }
            

            if(newValues.tags && JSON.stringify(oldData.tags) !== JSON.stringify(newValues.tags)) reason = reason+", tagów"
            
            if(newValues.gradient && JSON.stringify(oldData.gradient) !== JSON.stringify(newValues.gradient)) reason = reason+", gradientu"
           
            if(newValues.short_desc !== oldData.short_desc){
                reason = reason+", krótkiego opisu"
                if(newValues.short_desc && newValues.short_desc.length > 256) throw new UserInputError("Short_desc is too big")
            }
            if(newValues.desc !== oldData.desc){
                reason = reason+", opisu"
                if(newValues.desc && newValues.desc.length > 2000) throw new UserInputError("Desc is too big")
            }
            
            reason = reason+"."
            
            const newData = await guildConfig.findOneAndUpdate({guildId},newValues,{new:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})   
            addToAuditLog(guildId,req.user.discordId,`Zmiana ustawień serwera`,adminEdit,req.user.discordTag,reason)
            return newData;
        },
        async deleteGuildData(_,{guildId},req){
            const config = await guildConfig.findOne({guildId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(config.ownerId !== req.user.discordId) throw new ForbiddenError('Action not allowed')
            config.desc = null
            config.short_desc = null
            config.link = null
            config.gradient = []
            config.tags = []
            config.cardGradient = null
            config.premiumEnd = null,
            config.flags = ["CAN_BE_REPORTED"]
            config.off = true;
            await config.save().catch(err => {console.error(err);throw new ApolloError('Database error')})

            addToAuditLog(guildId,req.user.discordId,"Usuwanie danych serwera",false,req.user.discordTag)
            return config;
        },
        async createSubmission(_,args,req){
            const foundUser = await User.findOne({discordId:req.user.discordId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!foundUser) throw new ApolloError('User not found')
            if(!JSON.stringify(foundUser.allowedGuilds).includes(args.guildId) && !global.userPerms.get(req.user.discordId) >= 3) throw new ForbiddenError("User cannot change config of this guild")

            const newSubmissions = await Submission.create({
                submissionId:await Submission.countDocuments(),
                userId:req.user.discordId,
                guildId:args.guildId,
                appliesFor:args.appliesFor,
                submissionDescription:args.desc,
                accepted:false,
                solved:false,
            }).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return newSubmissions;
        }
    }
}
