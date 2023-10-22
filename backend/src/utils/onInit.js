const miscDb = require(`../database/schemas/misc`)
const bans = require(`../database/schemas/bans`)
const User = require(`../database/schemas/user`)
const Banner = require(`../database/schemas/banner`)
const CardAd = require(`../database/schemas/cardAd`)
const { Collection } = require(`@discordjs/collection`)
module.exports = {

    async run(){
        const tagsDb = await miscDb.find({type:'tag'})
        const gradientDb = await miscDb.find({type:'gradient'})
        const users = await User.find()
        const bansDb = await bans.find()
        const today = new Date()
        today.setHours(0,0,0,0)
        const bannerDb = await Banner.find({$or:[{expirationDate : {$gt: today}}, {canExpire:false}]})
        const cardAdDb = await CardAd.find({$or:[{expirationDate : {$gt: today}}, {canExpire:false}]})
        global.tags = new Collection()
        global.userPerms = new Collection()
        global.banList = new Collection()
        global.gradientList = new Collection()
        global.bannerList = new Collection()
        global.cardAdList = new Collection()

        tagsDb.forEach((tag) => {
            global.tags.set(tag.tag,tag.tag)
        })
        gradientDb.forEach((gradient) => {
            global.gradientList.set(gradient.gradient[3],gradient.gradient)
        })
        users.forEach((user) => {
            if(user.permissionLevel) global.userPerms.set(user.discordId,user.permissionLevel)
        })

        bansDb.forEach((ban) => {
            global.banList.set(ban.bannedId,ban)
        })
        storedBanners = 0;
        bannerCount = 0;
        bannerDb.forEach((banner)=>{
            // Banners will be added a little bit differently. How? Just look at this!
            for(let i = 0; i < banner.storedAmount;i++){
                global.bannerList.set(storedBanners,banner);
                storedBanners++;
            }
            bannerCount++;
        })
        storedCardAds = 0;
        cardAdCount = 0;
        cardAdDb.forEach((cardAd)=>{
            // CardAds will be added a little bit differently. How? Just look at this!
            for(let i = 0; i < cardAd.storedAmount;i++){
                global.cardAdList.set(storedCardAds,cardAd);
                storedCardAds++;
            }
            cardAdCount++;
        })
        console.log(`${global.tags.size} tags exists`)
        console.log(`${global.gradientList.size} gradients exists`)
        console.log(`${bannerCount} banners active`)
        console.log(`${cardAdCount} card ads active`)
    }
    
}
