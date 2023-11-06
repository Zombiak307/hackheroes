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
        type User{
            userId:String,
            username:String,
            password:String
        }

        type Query{
           getTasks(userId:String):[Task],
           getTask(taskId:String!):Task, 
           getUser:User,
        }
        type Mutation{
            createTask(taskName:String!,score:Int!,deadline:Date!):Task
            createUser(username:String!,password:String):User,
            editTask(taskId:String!,score:Int):Task
        }
`;

module.exports.TypeDefs = TypeDefs
