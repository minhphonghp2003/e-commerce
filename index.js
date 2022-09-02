import express from "express";
import 'dotenv/config'
import user from './components/user/API.js'
import morgan from 'morgan'


const app = express()
const port = process.env.PORT || 3000

app.use(morgan("combined"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/user', user.router)

app.use((err, req, res, next) => {
    res.status(500).send(err.stack)
  })
  
  

app.listen(port)