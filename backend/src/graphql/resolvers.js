const {UserInputError,ApolloError,AuthenticationError,ForbiddenError} = require(`apollo-server-express`)
const Tasks = require('../database/schemas/tasks')
const Users = require('../database/schemas/user')
module.exports = {
    Query: {
        async getTask(_,args,req){
            const task = await Task.findOne({taskId:args.taskId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return task;
        },
        async getTasks(_,args,req){
            let tasks;
            if(args.userId) tasks = await Tasks.find({userId:args.userId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            else tasks = await Tasks.find().catch(err => {console.error(err);throw new ApolloError('Database error')})
            return tasks;
        }
    },
    Mutation: {
        async createTask(_,args,req){
            const newTask = await Tasks.create({
                userId:req.user.userId,
                taskId:Date.now(),
                deadline: args.deadline,
                taskName:args.taskName,
                score:0,
            }).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return newTask;
        },
        async createUser(_,args,req){
            const newUser = await Users.create({
                userId:Date.now(),
                username: args.username,
                password:args.password,
            }).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return newUser;
        },
        async editTask(_,args,req){
            const task = await Tasks.findOneAndUpdate({taskId:args.taskId},args).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return task
        }
    },
}
