const { gql } = require('apollo-server-express');

const TypeDefs = gql`

        scalar Date

        type Task {
            userId:String,
            taskName:String,
            score:Int,
            deadline:Date,
            taskId:String,
        }

        type Query{
           getTask(taskId:String!):Task, 
        }
        type Mutation{
            createTask(taskName:String!,score:Int!,deadline:Date!):Task
        }
`;

module.exports.TypeDefs = TypeDefs