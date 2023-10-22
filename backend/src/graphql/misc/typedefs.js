const { gql } = require('apollo-server-express');

const MiscTypeDefs = gql`
        scalar Date
        type User {
            discordTag:String
            discordId:String
            avatar:String
            canReport:Boolean
            createdAt:String
            votedAt:String

            allowedGuilds:[String],
            permissionLevel:Int,
            flags:[String],

            banId:String,
            unreadNotifications:Int,
            lastLogin:Date
        }

        type DiscordGuild{
            id:String,
            name:String,
            icon:String,
        }

        type UserData{
            user:User,
            guilds:[DiscordGuild],
            auditLog:[AuditLog]
        }

        type AuditLog {
            userId:String,
            discordTag:String,
            guildId:String,
            actionType:String,
            reason:String,
            adminOnly:Boolean,
            performedAt:Date,
        }

        type Statistic {
            date:Date,
            configs:Int,
            accounts:Int,
            guildsOnList:Int,
        }

        type StatisticSummary {
            configs:Int,
            accounts:Int,
            guildsOnList:Int,
        }

        type StatisticList {
            thisWeek:[Statistic],
            lastWeek:[Statistic],
            thisMonth:[Statistic],
            lastMonth:[Statistic],
            threeMonth:[Statistic],
            
            thisWeekSummary:StatisticSummary,
            lastWeekSummary:StatisticSummary,
            thisMonthSummary:StatisticSummary,
            lastMonthSummary:StatisticSummary,
            threeMonthSummary:StatisticSummary,
        }

        type Notification{
            desc:String,
            date:Date,
            highlited:Boolean,
            unread:Boolean,
            _id:String,
        }

        type Query{
            getAllTags:[String],
            getUser(allowedGuilds:Boolean,userId:String):User,
            getUserData(userId:String!):UserData @permission(level:2)
            getAuditLog(searchType:String!,id:String):[AuditLog], @permission
            getGradientValues:[[String]],
            getStats:StatisticList!, @permission(level:4)
            getNotifications(type:String!,guildId:String):[Notification] @permission
            getBanner:Banner
            getCardAd:CardAd
        }
        type Mutation{
            addTag(tag:String!):String, @permission(level:4)
            removeTag(tag:String!):String, @permission(level:4)
            updateUserData(userId:String!,values:String!):User, @permission(level: 3)
            changeGradientValue(id:String,colorOne:String!,colorTwo:String!,direction:String!):[String], @permission(level:4)
            readNotification(id:String!):Notification, @permission
        }
`;

module.exports.MiscTypeDefs = MiscTypeDefs