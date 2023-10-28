const mongoose = require(`mongoose`)

const TaskSchema = new mongoose.Schema({
    userId:{
        type: String,
        required:true,
    },
    taskName:{
        type:String,
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    deadline:{
        type:String,
        required:true,
    },
    taskId:{
        type:String,
        required:true,
        unique:true,
    }
})

module.exports = mongoose.model(`tasks`,TaskSchema)