const { gql } = require('apollo-server-express');

const DummyTypeDefs = gql`
        type Characteristic{
            name:String,
            startingValue:Int,
            advanceValue:Int,
            currentValue:Int,
            isSecondary:Boolean,
        }

        type Weapon{
            name:String,
            encumbrance:Int,
            group:String,
            weaponStrength:String,
            range:Int,
            reload:Int,
            quality:String
        }

        type Armour{
            type:String,
            encumbrance:Int,
            location:String,
            armourPoints:Int,
            quality:String,
        }

        type Trapping{
            name:String,
            encumbrance:Int,
            description:String,
        }

        type Skill{
            name:String,
            basic:Boolean,
            bonus:Int,
        }

        type Talent{
            name:String,
            description:String,
        }

        type Coin{
            name:String,
            amount:Int
        }

        type CharacterData{
            characterId:String,
            name:String,
            race:String,
            career:[String],

            characterProfile:[Characteristic],

            description: [String],
            weapons:[Weapon],
            armour:Armour,
            trappings:[Trapping],
            skills:[Skill],
            talents:[Talent],
            xp:[Int],
            coins:[Coin]
        }

        type Query{
            getHelloWorld:String!,
            getCharacterData(characterId:String):CharacterData
        }

        type Mutation{
            createDummyCharacter:CharacterData!
        }
`;

module.exports.DummyTypeDefs = DummyTypeDefs