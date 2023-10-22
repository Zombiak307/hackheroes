const { gql } = require('apollo-server-express');

const AdminTypeDefs = gql`
        directive @permission(level: Int = 0) on FIELD_DEFINITION

        type GuildConfig {
            guildId: ID!

            desc: String
            short_desc: String
            link:String
            color:String,
            gradient:[String],

            score:Int,
            tags:[String],

            flags:[String],

            premiumEnd:String,
            
            name:String!,
            members:String!,
            online:String!,
            icon:String!,
            off:Boolean!,
            reportable:Boolean,

            owner:String!,
            ownerId:String!,
        }

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
        }
        
        type CommunitySubmission {
            submissionId:String!,
            guildId:String!,
            appliesFor:String!,
            submissionDescription:String!,
            accepted:Boolean!,
            solved:Boolean!,
            userId:String!
        }

        scalar Date

        type Ban {
            bannedId:String!,
            isUser:Boolean!,
            reason:String!,
            modId:String!,
            banDate:Date!
            banId:String!
        }

        type ShortGuildConfig{
            name:String!,
            desc:String,
            short_desc:String
            link:String,

            guildId:String,
            guildReportable:Boolean,
        }

        type Report {
            userId:String,
            guildId:String,
            reportId:String,

            reportDesc:String,
            reportType:String,

            replyDesc:String,

            solved:Boolean,
            solvedAt:String,
            solvedBy:String,
            
            dataDeleted:Boolean,

            reportData:ShortGuildConfig,
        }

        type searchResult{
            #First part is here to allow getting the whole list of data, that meets certain criteria
            guilds:[GuildConfig],
            users:[User],
            reports:[Report],
            bans:[Ban]
            
            #Second part is here to allow getting just a single piece of data
            #Why it is like that? Well, I need only one query for the second part, that will return data about certain thing. I can't use two queries, one returning data about guilds and second one returning data about reports. It needs to be in one query, and that's why this whole mess have appeared
            guild:GuildConfig,
            user:User,
            report:Report,
            ban:Ban


        }

        type SubmissionList {
            closed: [CommunitySubmission],
            open: [CommunitySubmission]
        }

        type Announcement {
            content:String,
            author:String,
            date:Date,
            title:String,
            highlited:Boolean,
            id:Int,
        }

        type Banner{
            id:Int,
            userId:String,
            imgLink:String,
            redirectLink:String,
            canExpire:Boolean,
            expirationDate:Date,
            createdAt:Date,
            storedAmount:Int,
        }

        type CardAd{
            id:Int,
            userId:String,
            imgLink:String,
            redirectLink:String,
            canExpire:Boolean,
            expirationDate:Date,
            createdAt:Date,
            storedAmount:Int,
            title:String,
            desc:String
        }

        input BannerInput{
            userId:String!,
            imgLink:String!,
            redirectLink:String!,
            canExpire:Boolean!,
            expirationDate:Date!,
            storedAmount:Int!,
            id:Int,
        }

        input CardAdInput{
            userId:String!,
            imgLink:String!,
            redirectLink:String!,
            canExpire:Boolean!,
            expirationDate:Date!,
            storedAmount:Int!,
            title:String!,
            desc:String!,
            id:Int,
        }

        type Query {
            search(searchBy:String,valueToSearch:String):searchResult, @permission(level: 2)
            getBan(id:String!):Ban, @permission(level:2)
            getCommunitySubmissions:SubmissionList, @permission(level:3)
            getAnnouncements:[Announcement] @permission(level: 1)
            getAllBanners:[Banner] @permission(level: 4)
            getAllCardAds:[CardAd] @permission(level: 4)
        }
        type Mutation{
            setPremium(guildId:String!,remove:Boolean!,premiumEnd:Date):GuildConfig, @permission(level:4)
            ban(id:String!,isUser:Boolean!,reason:String!):Ban, @permission(level:4)
            unban(id:String!):Ban, @permission(level:4)
            setUserPerms(userId:String!,permsNumber:Int!):User, @permission(level:4)
            closeSubmission(submissionId:String!,accepted:Boolean!):CommunitySubmission, @permission(level:3)
            createAnnouncement(title:String!,desc:String!,highlited:Boolean!):Announcement, @permission(level:4)
            deleteAnnouncement(id:Int!):Announcement, @permission(level:4)
            sendNotification(userId:String!,highlited:Boolean!,desc:String!):Notification @permission(level:3)
            sendMassNotification(highlited:Boolean!,desc:String!,allTime:Boolean!,days:Int!):Int @permission(level:4)
            createBanner(bannerData:BannerInput):Banner, @permission(level:4)
            createCardAd(cardAdData:CardAdInput):CardAd, @permission(level:4)
            editBanner(bannerData:BannerInput):Banner @permission(level:4)
            editCardAd(cardAdData:CardAdInput):CardAd @permission(level:4)
        }
`;

module.exports.AdminTypeDefs = AdminTypeDefs