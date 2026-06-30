require('dotenv').config()
const express=require('express');
const ejs=require('ejs');
const ConnectDB=require('./app/config/db')
const path=require('path')
const cors=require('cors')
const Session=require('express-session')
const cookieParser=require('cookie-parser')
const connectflash=require('connect-flash')
const helmet=require('helmet')
const Limit=require('./app/utils/limite')
const morgan=require('morgan')

ConnectDB();
const app=express();

// security and middleware
app.use(cors())
app.use(helmet())
app.use(Limit)
app.use(morgan('dev'))
app.use(Session({
    secret:process.env.SESSION_SECRECT || "secret",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24 // 1 day
    }
}))
app.use(cookieParser())
app.use(connectflash())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// templates and static files
app.set('view engine','ejs')
app.set('views','views')
app.use(express.static('public'))
app.use('uploads',express.static(path.join(__dirname,'uploads')))
app.use('/uploads',express.static('uploads'))

// auth routes
const AuthEjsRoute=require('./app/routes/authEjsRouter')
app.use(AuthEjsRoute)

const PORT=process.env.PORT || 4000
app.listen(PORT,(error)=>{
    if(error){
        console.log(error);
    }else{
        console.log("server is running on port ",`http://localhost:${PORT}`);
    }
})

