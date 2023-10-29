require('custom-env').env(process.env.NODE_ENV === 'development' ? 'development' : 'production')
require(`./strategies/local.js`)

const express = require('express')
const app = express()
const passport = require(`passport`)
const mongoose = require(`mongoose`)
const session = require(`express-session`)
const Store = require(`connect-mongo`)(session)
//To zapisze dane o sesji z 'session' i jak będzie reinicjalizacja strony(restart), to włączy sesje
const cors = require(`cors`)
const {startApolloServer} = require('./graphql/index')
const upload = require('./uploads/upload')
//Graphql itd.


//Stats initialization
const PORT = process.env.PORT || 3002
const routes = require(`./routes`)

mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useFindAndModify:false,
  useCreateIndex:true,
})  
//27017 to domyślny port mongo
app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use(cors({
  origin: [process.env.FRONTEND_URL, `http://192.168.0.16:3000`, `https://studio.apollographql.com`],
  credentials:true,
}))


app.use(session({
  secret: `ah&dugpd%o3fdgje$`,
  cookie:{
    maxAge: process.env.NODE_ENV === 'development' ? 1000 * 60 * 60 * 24 * 7 : 1000*60*60*24*3//1 second -> 1 minute -> 1 hour -> 24 hours -> 1 week
  },
  resave:false,
  saveUninitialized:true,
  store: new Store({mongooseConnection: mongoose.connection})
})) 
//mówiłem o sesji wyżej

app.use(passport.initialize())
app.use(passport.session())


startApolloServer(app)

app.get('/', function(req, res) {
  res.sendFile(__dirname+`/index.html`);
});

/* 
WAŻNE! WAŻNE!
Graphql zainicjalizowany __dopiero__ po passport, bo inaczej to będzie unauthorized i w ogóle źle
*/
app.use(`/api`,routes)
app.use('/static',express.static(__dirname + '/uploads/img'))
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`))
