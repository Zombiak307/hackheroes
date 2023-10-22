const characterData = require(`../../database/schemas/character`);

module.exports = {
  Query: {
    async getHelloWorld(_, args, req) {
      return "Hello world!";
    },
    async getCharacterData(_, args, req) {
        const character = await characterData.findOne({characterId:args.characterId ? args.characterId : process.env.TEST_CHARACTER_ID}).catch((err) => console.error(err) );
        if(!character) return null;
        return character;
    },
  },
  Mutation: {
    async createDummyCharacter(_, args, req) {
      const newCharacter = await characterData
        .create({
          characterId: Date.now(),
          name: "Aldon Hetler",
          race: "Arayan",
          career: ["Führer", "Politician"],

          description: [
            56,
            "Male",
            "Blue",
            "70kg/154 Freedom Units",
            "Blonde",
            "1.7m",
            "The Witchling Star",
            "Altdorf",
            "Based moustache",
          ],

          characterProfile:[{
            name:"Weapon Skill",
            startingValue:0,
            advanceValue:0,
            currentValue:0,
            isSecondary:false,
          }],

          weapons: [
            {
              name: "Stick",
              encumbrance: 0,
              group: "None",
              weaponStrength: "2",
              range: 0,
              reload: 0,
              quality: "It belongs to Führer!",
            },
          ],

          armour:{
            type: "Leather",
            encumbrance: 0,
            location: "Whole body",
            armourPoints: 1,
            quality: "It belongs to Führer!",
          },

          trappings: [
            {
            name: "Dummy item",
            encumbrance: 2,
            description: "Dummy description",
            },
          ],

          skills: [
            {
              basic: false,
              name: "Read&Write",
              bonus: 0,
            },
            {
              basic: true,
              name: "Haggle",
              bonus: 10,
            },
          ],

          talents: [
            {
              name: "Aethyric Attunement",
              description: "Grants +10 to all Channelling Tests",
            },
          ],

          xp: [100, 200],

          coins: [
            { name: "Gold Coin", amount: 10 },
            { name: "Silver Shilling", amount: 5 },
          ],
        })
        .catch((err) => console.error(err));
      return newCharacter;
    },
  },
};
