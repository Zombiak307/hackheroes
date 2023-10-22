const tagsDb = require('../../database/schemas/misc')
const logs = require('../../database/schemas/logs')
const miscDb = require(`../../database/schemas/misc`)
const User = require('../../database/schemas/user')
const statistics = require(`../../database/schemas/stats`)
const notifications = require(`../../database/schemas/notification`)
const {UserInputError,ApolloError,AuthenticationError, ForbiddenError} = require(`apollo-server-express`)
const moment = require('moment')
const {getUserGuilds} = require('../../utils/api')
module.exports = {
    Query: {
        async getUser(_,args,req){
            if(args.userId){
                const user = await User.findOne({discordId:args.userId})
                return user;        
            }
            if(req.user && args.allowedGuilds){
                req.user.allowedGuilds = global.allowedGuilds.get(req.user.discordId)
            }
            return req.user ? req.user : null
        },
        async getUserData(_,args,req){
            const user = await User.findOne({discordId:args.userId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(global.banList.get(user.discordId)) user.banId = global.banList.get(user.discordId).banId
            const guilds = await getUserGuilds(args.userId).catch(err => {console.error(err);throw new ApolloError('Database error')})
            const auditLog = await logs.find({userId:args.userId}).sort({performedAt:-1}).limit(30).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return {user,guilds,auditLog}
        },
        getAllTags(){
            return global.tags.map(tag => tag);
        },
        getGradientValues(){
            return global.gradientList.map(gradient => gradient)
        },
        async getAuditLog(_,args,req){
            if(!args.searchType) return
            if(args.searchType === 'user') return await logs.find({userId:req.user.discordId}).sort({performedAt:-1}).limit(10)
            else{
                if(req.user.permissionLevel >=3){
                    return await logs.find({guildId:args.id}).sort({performedAt:-1}).limit(20)
                }
                else{
                    const foundLogs = await logs.find({guildId:args.id}).sort({performedAt:-1}).limit(20)
                    foundLogs.forEach(log => {
                        if(!log.adminOnly) return log;
                        log.discordTag = "Dane ukryte";
                        log.discordId = "Dane ukryte";
                        return log;
                    })
                    return foundLogs;
                }
            }
        },
        async getStats(_,args,req){
            const thisWeekStats = await statistics.find({
                date: {"$lte": moment().locale("pl").endOf("week").format("YYYY-MM-DD"), "$gte": moment().locale("pl").startOf("week").format("YYYY-MM-DD")}
            }).sort({ date: 1 }).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 
            const lastWeekStats = await statistics.find({
                date: {"$lte": moment().locale("pl").subtract(1,"weeks").endOf("week").format("YYYY-MM-DD"), "$gte": moment().locale("pl").subtract(1,"weeks").startOf("week").format("YYYY-MM-DD")}
            }).sort({ date: 1 }).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 
                 
            const thisMonthStats = await statistics.find({
                date: {"$lte": moment().locale("pl").endOf("month").format("YYYY-MM-DD"), "$gte": moment().locale("pl").startOf("month").format("YYYY-MM-DD")}
            }).sort({ date: 1 }).catch(err =>{console.error(err);throw new ApolloError('Database error')})
            const lastMonthStats = await statistics.find({
                date: {"$lte": moment().locale("pl").subtract(1,"month").endOf("month").format("YYYY-MM-DD"), "$gte": moment().locale("pl").subtract(1,"month").startOf("month").format("YYYY-MM-DD")}
            }).sort({ date: 1 }).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 

            const threeMonthStats = await statistics.find({
                date: {"$gte": moment().locale("pl").subtract(3,"month").format("YYYY-MM-DD")}
            }).sort({ date: 1 }).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 

            let theNewestData = await statistics.findOne({}).sort({date: -1}).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 
            if(!theNewestData){
                theNewestData = {configs: 0, accounts: 0, guildsOnList: 0}
            }
            let lastWeekData = await statistics.findOne({date: moment().locale("pl").subtract(1,"weeks").endOf("week").format("YYYY-MM-DD")}).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 
            if(!lastWeekData){
                lastWeekData = {configs: 0, accounts: 0, guildsOnList: 0}
            }
            const summaryThisWeek = {configs: theNewestData.configs-lastWeekData.configs, accounts: theNewestData.accounts-lastWeekData.accounts, guildsOnList: theNewestData.guildsOnList-lastWeekData.guildsOnList}
            
            let lastLastWeekData = await statistics.findOne({date: moment().locale("pl").subtract(2,"weeks").endOf("week").format("YYYY-MM-DD")}).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 
            if(!lastLastWeekData){
                lastLastWeekData = {configs: 0, accounts: 0, guildsOnList: 0}
            }
            const summaryLastWeek = {configs: lastWeekData.configs-lastLastWeekData.configs, accounts: lastWeekData.accounts-lastLastWeekData.accounts, guildsOnList: lastWeekData.guildsOnList-lastLastWeekData.guildsOnList}
            
            let lastMonthData = await statistics.findOne({date: moment().locale("pl").subtract(1,"month").endOf("month").format("YYYY-MM-DD")}).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 
            if(!lastMonthData){
                lastMonthData = {configs: 0, accounts: 0, guildsOnList: 0}
            }
            const summaryThisMonth = {configs: theNewestData.configs-lastMonthData.configs, accounts: theNewestData.accounts-lastMonthData.accounts, guildsOnList: theNewestData.guildsOnList-lastMonthData.guildsOnList}
            
            let lastLastMonthData = await statistics.findOne({date: moment().locale("pl").subtract(2,"month").endOf("month").format("YYYY-MM-DD")}).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 
            if(!lastLastMonthData){
                lastLastMonthData = {configs: 0, accounts: 0, guildsOnList: 0}
            }
            const summaryLastMonth = {configs: lastMonthData.configs-lastLastMonthData.configs, accounts: lastMonthData.accounts-lastLastMonthData.accounts, guildsOnList: lastMonthData.guildsOnList-lastLastMonthData.guildsOnList}
            
            let threeMonthData = await statistics.findOne({date: moment().locale("pl").subtract(3,"month").format("YYYY-MM-DD")}).catch(err =>{console.error(err);throw new ApolloError('Database error')}) 
            if(!threeMonthData){
                threeMonthData = {configs: 0, accounts: 0, guildsOnList: 0}
            }
            const summaryThreeMonth = {configs: theNewestData.configs-threeMonthData.configs, accounts: theNewestData.accounts-threeMonthData.accounts, guildsOnList: theNewestData.guildsOnList-threeMonthData.guildsOnList}
            
            return {
                thisWeek: thisWeekStats,
                lastWeek:lastWeekStats,
                thisMonth:thisMonthStats,
                lastMonth:lastMonthStats,
                threeMonth:threeMonthStats,
                
                thisWeekSummary: summaryThisWeek,
                lastWeekSummary: summaryLastWeek,
                thisMonthSummary: summaryThisMonth,
                lastMonthSummary: summaryLastMonth,
                threeMonthSummary: summaryThreeMonth,
            };      
        },
        async getNotifications(_,args,req){
            if(args.type === "user"){
                const notifs = await notifications.find({notifiedId:req.user.discordId}).sort({date:-1}).limit(20)
                return notifs;
            }else{
                const notifs = await notifications.find({notifiedId:args.guildId}).sort({date:-1}).limit(20)
                return notifs;
            }
        },
        async getBanner(_,args,req){
            min = Math.ceil(0);
            max = Math.floor(global.bannerList.size);
            const banner = global.bannerList.get(Math.floor(Math.random() * (max - min)) + min)
            return banner;
        },
        async getCardAd(_,args,req){
            min = Math.ceil(0);
            max = Math.floor(global.cardAdList.size);
            const cardAd = global.cardAdList.get(Math.floor(Math.random() * (max - min)) + min)
            return cardAd;
        }
    },
    Mutation: {
       async addTag(_,{tag},req){
        const foundTag = await tagsDb.findOne({tag}).catch(err => console.error(err))
        if(foundTag) throw new UserInputError('This tag already exists')
        const newTag = await tagsDb.create({tag:tag,type:"tag"}).catch(err => {console.error(err);throw new ApolloError('Database error')})
        global.tags.set(newTag.tag,newTag.tag)
        return "done";
       },
       async removeTag(_,{tag},req){
        const foundTag = await tagsDb.findOne({tag:tag,type:"tag"}).catch(err => {console.error(err);throw new ApolloError('Database error')})
        if(!foundTag) throw new UserInputError(`This tag does not exists`)
        await foundTag.delete()
        global.tags.delete(tag)
        return "done";
       },
       async changeGradientValue(_,args,req){
        await miscDb.findOneAndUpdate({type:"gradient",gradient:global.gradientList.get(args.id)},{gradient:[args.direction,args.colorOne,args.colorTwo,args.id]},{new:true})
        global.gradientList.set(args.id,[args.direction,args.colorOne,args.colorTwo,args.id])
        return global.gradientList.get(args.id)
       },
       async updateUserData(_,{userId,values},req){
        const newValues = JSON.parse(values)
        
        const newData = await User.findOneAndUpdate({discordId:userId},newValues,{new:true}).catch(err => {console.error(err);throw new ApolloError('Databasae error')})
       
        return newData;
       },
       async readNotification(_,args,req){
           req.user.unreadNotifications = req.user.unreadNotifications - 1;
           const notif = await notifications.findOneAndUpdate({_id:args.id},{unread:false},{new:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})
           const user = await User.findOneAndUpdate({discordId:req.user.discordId},{unreadNotifications: req.user.unreadNotifications},{new:true})
           return notif;
       }
    }

}
