import express from "express";
import 'dotenv/config'
import user from './components/user/API.js'
import address from './components/address/API.js'
import comment from './components/comment/API.js'
import order from './components/order/API.js'
import product from './components/product/API.js'
import morgan from 'morgan'


const app = express()
const port = process.env.PORT || 3000

app.use(morgan("combined"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers")
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
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

app.listen(port)