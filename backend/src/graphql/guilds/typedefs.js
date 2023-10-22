const { gql } = require('apollo-server-express');

const GuildTypeDefs = gql`
        type GuildConfig {
            guildId: ID!

            desc: String
            short_desc: String
            link:String
            color:String,
            gradient:[String],
            cardGradient:[String],

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

            invite:String,
            
            banId:String,
        }
        
        type GuildList {
            bumped: [GuildConfig],
            featured: [GuildConfig]

            voteList:[GuildConfig]
            bumpList:[GuildConfig]
            tagList:[GuildConfig]

            listEnded:Boolean,
            tag:String,
        },

        type MutualGuilds {
            included: [GuildConfig],
            excluded: [GuildConfig],
        }

        type User {
            discordTag:String
            discordId:String
            avatar:String
            canReport:Boolean
            createdAt:String
            votedAt:String

            allowedGuilds:[String]
        }

        type Tags {
            tags:[String]
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

        type Query{
            getGuildConfig(guildId: String!):GuildConfig,
            getMutualGuilds:MutualGuilds,
            getGuildFromLink(link:String!):GuildConfig

            #List queries starts here
            getMainPageGuilds:GuildList,
            getVoteList(currentPage:Int!):GuildList,
            getBumpList(currentPage:Int!):GuildList,
            getTagList(currentPage:Int!,tag:String!):GuildList,
            getSearchList(valueToSearch:String!):[GuildConfig],
            #List queries ends here
            getGuildSubmission(guildId:String!):CommunitySubmission @permission
        }
        type Mutation {
            updateGuildConfig(guildId:String!,values:String!,adminEdit:Boolean):GuildConfig, @permission
            deleteGuildData(guildId:String!):GuildConfig, @permission
            createSubmission(guildId:String!,desc:String!,appliesFor:String):CommunitySubmission @permission
        }
`;

module.exports.GuildTypeDefs = GuildTypeDefs