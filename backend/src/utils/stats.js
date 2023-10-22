const User = require(`../database/schemas/user`)
const Cron = require("croner");
const fetch = require(`node-fetch`)
const guildConfig = require(`../database/schemas/guildConfig`)
const Banner = require(`../database/schemas/banner`)
const stats = require(`../database/schemas/stats`)
const OAuth2Credentials = require(`../database/schemas/OAuth2Credentials`)
const {encrypt,decrypt} = require(`./utils`)
const moment = require("moment");

module.exports = {
	async run(){
		new Cron("1 0 * * *", async () => {
			const configsCount = await guildConfig.find({}).countDocuments()
			const accountsCount = await User.collection.countDocuments()
			const guildsOnListCount = await guildConfig.find({off:false}).countDocuments()

			await stats.create({
				date: moment().subtract(1, "days").format("YYYY-MM-DD"),
				configs: configsCount,
				accounts: accountsCount,
				guildsOnList: guildsOnListCount,
			}).catch(err => {console.error(err)})
		}) //stats

		new Cron("0 0 * * 6", async () => {
			const credentialsDB = await OAuth2Credentials.find()
			for (const credentials of credentialsDB) {
				const refreshToken = await decrypt(credentials.refreshToken)
				const body = new URLSearchParams({
					client_id:process.env.DASHBOARD_CLIENT_ID,
					client_secret:process.env.DASHBOARD_CLIENT_SECRET,
					'grant_type': 'refresh_token',
					refresh_token:refreshToken
				});

				const response = await fetch('https://discord.com/api/v8/oauth2/token', {
					method: 'post',
					body: body,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				});
				const data = await response.json();
				credentials.accessToken = await encrypt(data.access_token)
				credentials.refreshToken = await encrypt(data.access_token)
				await credentials.save()
			}
		}) // refresh token to spy on people ~~facebook moment~~

		// refresh bannerList and cardAdList
		new Cron("0 0 * * *", async () => {
			global.bannerList.clear()
			const today = new Date()
			today.setHours(0,0,0,0)
			const bannerDb = await Banner.find({$or:[{expirationDate : {$gt: today}}, {canExpire:false}]})
			storedBanners = 0;
        	bannerDb.forEach((banner)=>{
            	// Banners will be added a little bit differently. How? Just look at this!
            	for(let i = 0; i < banner.storedAmount;i++){
                	global.bannerList.set(storedBanners,banner);
                	storedBanners++;
            	}
        	})

			const cardAdDb = await CardAd.find({$or:[{expirationDate : {$gt: today}}, {canExpire:false}]})
			storedCardAds = 0;
       	 	cardAdDb.forEach((cardAd)=>{
            	// CardAds will be added a little bit differently. How? Just look at this!
            	for(let i = 0; i < cardAd.storedAmount;i++){
                	global.cardAdList.set(storedCardAds,cardAd);
                	storedCardAds++;
            	}
        	})
		})
	}
}

