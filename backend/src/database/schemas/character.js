const mongoose = require(`mongoose`)

const characteristicSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    startingValue:{
        type:Number,
        required:true,
    },
    advanceValue:{
        type:Number,
        required:true,
    },
    currentValue:{
        type:Number,
        required:true,
    },
    isSecondary:{
        type:Boolean,
        required:true,
    }
})

const weaponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    encumbrance:{
        type:Number,
        required:true,
    },
    group:{
        type:String,
        required:true,
    },
    weaponStrength:{
        type:String,
        required:true,
    },
    range:{
        type:Number,
        required:true,
    },
    reload:{
        type:Number,
        required:true,
    },
    quality:{
        type:String,
        required:true,
    },
})

const armourSchema = new mongoose.Schema({
    type:{
        //Leather, chain, plate or something else
        type:String,
        required:true,
    },
    encumbrance:{
        type:Number,
        required:true,
    },
    location:{
        // Defines what is protected by this armour
        type:String,
        required:true,
    },
    armourPoints:{
        type:Number,
        required:true,
    },
    quality:{
        type:String,
        required:true,
    },
})

const trappingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    encumbrance:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
    }
})

const skillSchema = new mongoose.Schema({
    basic:{
        type:Boolean,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    bonus:{
        // Available bonuses: 0,10,20
        type:Number,
    }
})

const talentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    }
})

const coinSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true,
    }
})

const CharacterSchema = new mongoose.Schema({
    characterId:{
        type: String,
        required:true,
        unique:true,
        // This will be date string
    },
    name:{
        type:String,
        required:true,
    },
    race:{
        type:String,
        required:true,
        // Basic races: Human, Elf, Dwarf, Halfling
    },
    career:{
        type:Array,
        required:true,
        // Thing indexed as '0' will be current career. Everything else is a previous career
    },

    description:{
        //To make this schema more readable, whole character description will be stored as array.
        //Data will be stored as it's written in the description section, read from left to right
        //So it looks like this: ['age','sex','eye colour',etc.]
        type:Array,
        required:true
    },

    // This refers to player characteristics, like Weapon Skill etc.
    characterProfile:{
        type:[characteristicSchema]
    },

    weapons:{
        type:[weaponSchema]
    },

    armour:{
        type:armourSchema
    },

    trappings:{
        type:[trappingSchema]
    },

    skills:{
        type:[skillSchema]
    },

    talents:{
        type:[talentSchema]
    },

    xp:{
        // ['unusedXP', 'allXpGathered']
        type:Array,
        required:true,
    },

    coins:{
        type:[coinSchema]
    }
})

module.exports = mongoose.model(`characters`,CharacterSchema)