const {UserInputError,ApolloError,AuthenticationError,ForbiddenError} = require(`apollo-server-express`)
const Tasks = require('../database/schemas/tasks')

module.exports = {
    Query: {
        async getTask(_,args,req){
            const task = await Task.findOne({taskId:args.taskId}).catch(err => {console.error(err);throw new ApolloError('Database error')})
            return task;
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
    },
}
