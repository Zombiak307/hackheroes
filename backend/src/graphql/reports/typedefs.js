const { gql } = require('apollo-server-express');

const ReportsTypeDefs = gql`

        input ShortGuildConfigInput{
            name:String!,
            desc:String,
            short_desc:String
            link:String,
            icon:String,

            guildId:String,
            flags:[String],
        }

        type ShortGuildConfig{
            name:String!,
            guildId:String,

            desc:String,
            short_desc:String
            link:String,
            icon:String,
      
            flags:String,
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

        type ReportList{
            closed:[Report],
            open:[Report],
        }

        type Query{
           getReports:ReportList, @permission(level:1)
           getReport(reportId:String!):Report, @permission(level:1)
        }
        type Mutation{
            createReport(guildConfig:ShortGuildConfigInput!,reportDesc:String!,reason:String!):Report @permission
            closeReport(guildId: String!,reportId:String!,dataDeleted:Boolean!,replyDesc:String!,reportType:String!):Report, @permission(level:1)
            guildVote(guildId:String!):Boolean, @permission
        }
`;

module.exports.ReportsTypeDefs = ReportsTypeDefs