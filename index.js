import express from "express";
import 'dotenv/config'
import user from './components/user/API.js'
import address from './components/address/API.js'
import comment from './components/comment/API.js'
import order from './components/order/API.js'
import product from './components/product/API.js'
import morgan from 'morgan'
import session from 'express-session'
import redis from 'connect-redis'
import { createClient } from 'redis'
import { Server } from "socket.io";
import { createServer } from "http";

const app = express()
let RedisStore = redis(session)

let redisClient = createClient({
  
  password: 'TSxACFT8A0BVKsCEgV7Cd0UtNqLLkwfE',
  url: 'redis://redis-11204.c91.us-east-1-3.ec2.cloud.redislabs.com:11204',
  legacyMode: true
})
redisClient.connect().catch(console.error)
app.use(session({
  store: new RedisStore({

    client: redisClient,
    logErrors: true
  }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.corsorg
  }
});

io.on("connection", (socket) => {
  socket.on('newmsg', value => {
    io.emit('showmsg', value)
  })
  socket.on('newbid', price => {
    io.emit('setnewprice', price)
  })

});
const port = process.env.PORT || 4000

app.use(morgan("combined"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.corsorg)
  res.setHeader("Access-Control-Allow-Headers", "*")
  res.setHeader("Access-Control-Allow-Methods", "*")
  next();
});
app.use('/user', user.router)
app.use('/address', address.router)
app.use('/comment', comment.router)
app.use('/product', product.router)
app.use('/order', order.router)



app.use((err, req, res, next) => {
  res.status(400).send(err.stack)
})

app.use((req, res, next) => {
  res.status(404).send("404. Sorry can't find that! ")
})

httpServer.listen(port, () => {
  console.log(port);
})