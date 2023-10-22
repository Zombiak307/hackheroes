const {UserInputError,ApolloError,AuthenticationError,ForbiddenError} = require(`apollo-server-express`)
const guildConfig = require('../../database/schemas/guildConfig')
const users = require('../../database/schemas/user')
const reports = require('../../database/schemas/reports')
const {addToAuditLog,createNotification} = require('../../utils/utils')

module.exports = {
    Query: {
        async getReports(_,args,req){
            if(global.userPerms.get(req.user.discordId) >= 2){
                const open = await reports.find({solved:false}).sort('-1').limit(20).catch(err => {console.error(err);throw new ApolloError('Database error')})
                const closed = await reports.find({solved:true}).sort('-1').limit(20).catch(err => {console.error(err);throw new ApolloError('Database error')})
                return {open,closed};
            }
            const open = await reports.find({solved:false}).sort('-1').limit(20).catch(err => {console.error(err);throw new ApolloError('Databasae error')})
            return {open};
           
        },
        async getReport(_,args,req){
            const report = await reports.findOne({reportId:args.reportId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return report;
           
        }
    },
    Mutation: {
        async createReport(_,args,req){
            if(!req.user.flags.includes("CAN_REPORT") || !args.guildConfig.flags.includes("CAN_BE_REPORTED")) throw new ForbiddenError('Action not allowed')
            
            const newReport = await reports.create({

                userId:req.user.discordId,
                guildId:args.guildConfig.guildId,
                reportId: await reports.countDocuments(),
                
                solved:false,
                dataDeleted:false,
                reportDate: Date.now(),
                reportData:args.guildConfig,

                reportType:args.reason,
                reportDesc:args.reportDesc,
            }).catch(err => {console.error(err);throw new ApolloError('Database error')})

            if(await reports.find({guildId:args.guildConfig.guildId,solved:false}).countDocuments() >= 2){
                const guild = await guildConfig.findOne({guildId:args.guildConfig.guildId})
                if(guild.flags.indexOf("CAN_BE_REPORTED") > -1){
                    guild.flags.splice(guild.flags.indexOf("CAN_BE_REPORTED"),1)
                }
               
                await guild.save()
            }
            if(await reports.find({solved:false,userId:req.user.discordId}).countDocuments() >= 3){
                const user = await users.findOne({discordId:req.user.discordId})
                user.flags.splice(user.flags.indexOf("CAN_REPORT"),1)
                req.user.flags.splice(req.user.flags.indexOf("CAN_REPORT"),1)
                await user.save()
            }

            return newReport;
        },
        async closeReport(_,args,req){
            const closedReport = await reports.findOneAndUpdate({reportId:args.reportId},{dataDeleted:args.dataDeleted,replyDesc:args.replyDesc,solved:true,solvedAt:Date.now(), solvedBy:req.user.discordId},{new:true}).catch(err => {console.error(err);throw new ApolloError('Databasae error')})
            if(!closedReport) throw new UserInputError('Invalid reportId provided')
            const guild = await guildConfig.findOne({guildId:args.guildId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            if(!guild.flags.includes("CAN_BE_REPORTED")){
                guild.flags.push("CAN_BE_REPORTED")
                await guild.save()
            }
            const user = await users.findOne({discordId:closedReport.userId})
            if(!user.flags.includes("CAN_REPORT")){
                user.flags.push("CAN_REPORT")
                await user.save()
                req.user.flags.push("CAN_REPORT")
                req.user.unreadNotifications = req.user.unreadNotifications + 1;
                createNotification(user.discordId,true,"Znowu możesz zgłaszać serwery!",req.user)
            }
            addToAuditLog(args.guildId,req.user.discordId,"Zamykanie reportu",true,req.user.discordTag,args.replyDesc)
            
            if(args.dataDeleted){
                createNotification(args.guildId,true,`Część danych Twojego serwera została usunięta z powodu naruszeń regulaminu. Skontaktuj się z nami aby rozwiązać ten problem`)
                if(args.reportType == "desc"){
                    guild.desc = "";
                    await guild.save()
                }
                else if(args.reportType == "short_desc"){
                    guild.short_desc = "";
                    await guild.save()
                }
                else if(args.reportType == "name"){
                    guild.name = "Nazwa usunięta z powodu naruszeń regulaminu";
                    await guild.save()
                }
                else if(args.reportType == "icon"){
                    guild.icon = "https://cdn.discordapp.com/embed/avatars/1.png";
                    await guild.save()
                }
                else if(args.reportType == "link"){
                    guild.desc = "";
                    await guild.save()
                }
            }
            return closedReport;
        },
        async guildVote(_,{guildId},req){
            const config = await guildConfig.findOne({guildId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            config.score = config.score+1;
            await config.save().catch(err => {console.error(err);throw new ApolloError('Database error')})
            req.user.votedAt = new Date(Date.now())
            await users.findOneAndUpdate({discordId: req.user.discordId}, {votedAt: Date.now()},{new:true}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return true;
        },
    },
}
