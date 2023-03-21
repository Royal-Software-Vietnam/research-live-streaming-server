const node_media_server = require('./services/media_server')
const path = require('path')
const express = require('express')
const Session = require('express-session')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const middleware = require('connect-ensure-login')
const FileStore = require('session-file-store')(Session)
const config = require('./services/config')
const flash = require('connect-flash')

const passport = require('./passport')

const port = 4444
const app = express()

// Mongoose connection
mongoose.connect('mongodb://mongo:9Xl0cqcVE4cqtePOhAUM@containers-us-west-201.railway.app:7731' , { useNewUrlParser: true }).then(res => {
    console.log(`<--Success-->`)
}).catch(err => {console.log(err)});

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.use(express.static('public'))
app.use(flash())
app.use(require('cookie-parser')())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({extended: true}))

app.use(Session({
    store: new FileStore({
        path : './server/sessions'
    }),
    secret: config.server.secret,
    maxAge : Date().now + (60 * 1000 * 30)
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res) => {
    res.render('index')
})

// app.use('/login', require('./routes/login'));
// app.use('/register', require('./routes/register'));

app.listen(port, () => console.log(`Server is running on port localhost:${port}`))
node_media_server.run();