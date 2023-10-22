const {UserInputError,ApolloError, ForbiddenError} = require(`apollo-server-express`)
const moment = require('moment')
const guildConfig = require(`../../database/schemas/guildConfig`)
const User = require(`../../database/schemas/user`)
const Ban = require(`../../database/schemas/bans`)
const Report = require(`../../database/schemas/reports`)
const Submissions = require(`../../database/schemas/communitySubmissions`)
const Announcement = require(`../../database/schemas/announcement`)
const Banner = require(`../../database/schemas/banner`)
const CardAd = require(`../../database/schemas/cardAd`)

const { addToAuditLog, createNotification } = require('../../utils/utils')
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    Query: {
        async search(_,args,req){
           if(!args.searchBy) return null //On SearchPage value is not provided on initial load
           if(!args.valueToSearch) throw new UserInputError("valueToSearch not provided") // If button is pressed to search, but there is no value throw error
           
           if(args.searchBy === "id"){
               if(isNaN(parseInt(args.valueToSearch))) throw new UserInputError("valueToSearch is a text, not an id") 
               const guilds = await guildConfig.find({$or:[{ownerId:args.valueToSearch},{guildId:args.valueToSearch}]}).catch(err => {console.error(err);throw new ApolloError('Database error')})
               const users = await User.find({discordId:args.valueToSearch}).catch(err => {console.error(err);throw new ApolloError('Database error')})
               const reports = await Report.find({$or:[{reportId:args.valueToSearch},{userId:args.valueToSearch},{guildId:args.valueToSearch},{solvedBy:args.valueToSearch}]}).catch(err => {console.error(err);throw new ApolloError('Database error')})
               const bans = await Ban.find({$or: [{id:args.valueToSearch},{modId:args.valueToSearch},{bannedId:args.valueToSearch}]}).catch(err => {console.error(err);throw new ApolloError('Database error')});
               
               return{guilds,users,reports,bans}
           }
           else if(args.searchBy === "name"){
               const guilds = await guildConfig.find({$or:[{"name":{ "$regex": args.valueToSearch, "$options": "i" }},{"desc":{ "$regex": args.valueToSearch, "$options": "i" }},{"short_desc":{ "$regex": args.valueToSearch, "$options": "i" }},{"link":{ "$regex": args.valueToSearch, "$options": "i" }}]}).catch(err => {console.error(err);throw new ApolloError('Database error')})
               const users = await User.find({"discordTag":{ "$regex": args.valueToSearch, "$options": "i" }}).catch(err => {console.error(err);throw new ApolloError('Database error')})
               const reports = await Report.find({"reportData.name":{ "$regex": args.valueToSearch, "$options": "i" }}).catch(err => {console.error(err);throw new ApolloError('Database error')})
               return{guilds,users,reports,bans:[]}
           }
           else return null
           
        },
        async getBan(_,args,req){
            const ban = await Ban.findOne({banId:args.id}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!ban) throw new UserInputError("Invalid banId provided")
            return ban;
        },
        async getCommunitySubmissions(_,args,req){
            const closed = await Submissions.find({solved:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            const open = await Submissions.find({solved:false}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return {closed,open};
        },
        async getAnnouncements(_,args,req){ 
            const announcements = Announcement.find().sort({_id: -1}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return announcements;
        },
        async getAllBanners(_,args,req){
            const banners = await Banner.find().sort({_id: -1}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return banners;
        },
        async getAllCardAds(_,args,req){
            const cardAds = await CardAd.find().sort({_id: -1}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return cardAds;
        }
    },
    Mutation: {
        async setPremium(_,args,req){
            if(args.remove){
                const config = await guildConfig.findOne({guildId:args.guildId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
                if(!config) throw new UserInputError('No guild with provided id')
                if(config.flags.indexOf("PREMIUM") > -1){
                    config.flags.splice(config.flags.indexOf("PREMIUM"),1)
                    await config.save()
                }
                addToAuditLog(args.guildId,req.user.discordId,`Usuwanie premium`,true,req.user.discordTag, `Usuwanie premium dla serwera ID: ${config.guildId}`)
                createNotification(config.guildId,true,"Ten serwer nie posiada już premium") //powiadomienie panelu serwera
                const userDb = await User.findOne({userId:config.ownerId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
                if(!userDb) return config;
                userDb.unreadNotifications = userDb.unreadNotifications+1;
                await userDb.save().catch(err => {console.error(err);throw new ApolloError('Database error')})
                createNotification(userDb.discordId,true,"Jeden z Twoich serwerów nie posiada już premium!") //powiadomienie u usera(owner serwera)
                return config;
            }
            else{
                if(!args.premiumEnd) throw new UserInputError('premiumEnd not provided')     
                const config = await guildConfig.findOne({guildId:args.guildId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
                if(!config.flags.includes("PREMIUM")) config.flags.push("PREMIUM")
                config.premiumEnd = args.premiumEnd
                await config.save().catch(err => {console.error(err);throw new ApolloError('Database error')})
                addToAuditLog(args.guildId,req.user.discordId,`Nadawanie premium`,true,req.user.discordTag, `Nadanie premium dla serwera ID: ${config.guildId}`)
                return config;
            }
        },
        async ban(_,args,req){
            const ban = await Ban.findOne({bannedId:args.id}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(ban) throw new ForbiddenError('Provided id is already banned')
            
            const newBan = await Ban.create({
                bannedId:args.id,
                isUser:args.isUser,
                reason:args.reason,
                modId:req.user.discordId,
                banDate:new Date(),
                banId:await Ban.countDocuments(),
            }).catch(err => {console.error(err);throw new ApolloError('Database error')})

            if(args.isUser){
                const user = await User.findOneAndUpdate({discordId:args.id},{permissionLevel:0,flags:["BANNED"]},{new:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})
                if(!user) throw new UserInputError('User with provided id does not exists')
            }
            else{
                const config = await guildConfig.findOneAndUpdate({guildId:args.id},{off:true,flags:["BANNED"]},{new:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})
                if(!config) throw new UserInputError('Guild with provided id does not exists')    
            }
            
            addToAuditLog(args.id,req.user.discordId,`Banowanie ${args.isUser ? 'użytkownika' : 'serwera'}`,true,req.user.discordTag,args.reason)
            
            global.banList.set(newBan.bannedId,newBan)
            return newBan;
        },
        async unban(_,args,req){
            const ban = await Ban.findOne({banId:args.id}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!ban) throw new ForbiddenError('Invalid banId provided')
            if(ban.isUser){
                const user = await User.findOneAndUpdate({discordId:ban.bannedId},{permissionLevel:0,flags:["CAN_REPORT"]},{new:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})
                if(!user) throw new UserInputError('User with provided id does not exists')
            }
            else{
                const config = await guildConfig.findOneAndUpdate({guildId:ban.bannedId},{off:true,flags:["CAN_BE_REPORTED"]},{new:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})
                if(!config) throw new UserInputError('Guild with provided id does not exists')    
            }
            await ban.delete()
            addToAuditLog(ban.bannedId,req.user.discordId,`Odbanowywanie`,true,req.user.discordTag,`Odbanowywanie ${args.isUser ? 'użytkownika' : 'serwera'}`)
            
            global.banList.delete(ban.bannedId)
            return {reason:"Odbanowano"};
        },
        async setUserPerms(_,args,req){
            if(args.permsNumber >= 4 || args.permsNumber < 0) throw new UserInputError('Invalid permsNumber provided')
            const user = await User.findOneAndUpdate({discordId:args.userId},{permissionLevel:args.permsNumber},{new:true}).catch(err =>{console.error(err);throw new ApolloError('Database error')})
            if(!user) throw new UserInputError('User with provided id does not exist')
            addToAuditLog("Brak",req.user.discordId,'Ustawianie permów usera',true,req.user.discordTag,`Permy: ${args.permsNumber}, user: ${args.userId}`,)
                
            global.userPerms.set(args.userId,args.permsNumber)
            return user;
        },
        async closeSubmission(_,args,req){      
            const closedSubmission = await Submissions.findOne({submissionId:args.submissionId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!closedSubmission) throw new UserInputError('Invalid submissionId provided')
            closedSubmission.solved = true;
            closedSubmission.accepted = args.accepted;
            await closedSubmission.save().catch(err => {console.error(err);throw new ApolloError('Database error')})
            
            createNotification(closedSubmission.userId,true,`Twoje zgłoszenie serwera o id ${closedSubmission.guildId} do programu społecznościowego zostało rozpatrzone!`)
            addToAuditLog(closedSubmission.guildId, req.user.discordId, "Zamykanie zgłoszenia", true, req.user.discordTag, "Zamykanie zgłoszenia do programu społecznościowego")
            
            const config = await guildConfig.findOne({guildId:closedSubmission.guildId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            
            const userDb = await User.findOne({userId:config.ownerId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!userDb) return closedSubmission;
            userDb.unreadNotifications = userDb.unreadNotifications+1;
            await userDb.save().catch(err => {console.error(err);throw new ApolloError('Database error')})
            return closedSubmission;
        },
        async createAnnouncement(_,args,req){
            const lastAnnouncement = await Announcement.find().sort({date: -1}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            const newAnnouncement = Announcement.create({
                author:req.user.discordTag,
                date:new Date(),
                content:args.desc,
                title:args.title,
                highlited:args.highlited,
                id:lastAnnouncement[0] ? lastAnnouncement[0].id + 1 : 0
            }).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return newAnnouncement;
        },
        async deleteAnnouncement(_,args,req){
            const deletedAnnouncement = await Announcement.findOne({id:args.id}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            await deletedAnnouncement.delete().catch(err => {console.error(err);throw new ApolloError('Database error')})
            return deletedAnnouncement;
        },
        async sendNotification(_,args,req){
            const userDb = await User.findOne({discordId:args.userId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            userDb.unreadNotifications = userDb.unreadNotifications+1;
            await userDb.save().catch(err => {console.error(err);throw new ApolloError("Database error")})
            const newNotif = createNotification(args.userId,args.highlited,args.desc)
            return newNotif;
        },
        async sendMassNotification(_,args,req){
            if(args.allTime){
                const userDb = await User.find().catch(err => {console.error(err);throw new ApolloError('Database error')})
                userDb.forEach(async (user) => {
                    user.unreadNotifications = user.unreadNotifications+1;
                    await user.save().catch(err => {console.error(err);throw new ApolloError('Database error')})
                    const newNotif = createNotification(user.discordId,args.highlited,args.desc)
                })
                return userDb.length;
            }
            else{
                const userDb = await User.find({lastLogin:{"$gte":moment().locale("pl").startOf("day").subtract(args.days,"days")}}).catch(err => {console.error(err);throw new ApolloError('Database error')})
                userDb.forEach(async (user) => {
                    user.unreadNotifications = user.unreadNotifications+1;
                    await user.save().catch(err => {console.error(err);throw new ApolloError('Database error')})
                    const newNotif = createNotification(user.discordId,args.highlited,args.desc)
                })
                return userDb.length;
            }
        },
        async createBanner(_,args,req){
            const lastBanner = await Banner.find().sort({createdAt: -1}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            const newBanner = Banner.create({
                id:lastBanner[0] ? lastBanner[0].id + 1 : 0,
                userId: args.bannerData.userId,
                imgLink:args.bannerData.imgLink,
                redirectLink:args.bannerData.redirectLink,
                canExpire:args.bannerData.canExpire,
                expirationDate:args.bannerData.expirationDate,
                createdAt:new Date(),
                storedAmount:args.bannerData.storedAmount
            }).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return newBanner;
        },
        async createCardAd(_,args,req){
            const lastCardAd = await cardAd.find().sort({createdAt: -1}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            const newCardAd = cardAd.create({
                id:lastCardAd[0] ? lastCardAd[0].id + 1 : 0,
                userId: args.cardAdData.userId,
                imgLink:args.cardAdData.imgLink,
                redirectLink:args.cardAdData.redirectLink,
                canExpire:args.cardAdData.canExpire,
                expirationDate:args.cardAdData.expirationDate,
                createdAt:new Date(),
                storedAmount:args.cardAdData.storedAmount
            }).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return newCardAd;
        },
        async editBanner(_,args,req){
            const editedBanner = await Banner.findOneAndUpdate({id:args.bannerData.id},args.bannerData,{new:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return editedBanner;
        },
        async editCardAd(_,args,req){
            const editedCardAd = await CardAd.findOneAndUpdate({id:args.cardAdData.id},args.cardAdData,{new:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return editedCardAd;
        }
    }
}
