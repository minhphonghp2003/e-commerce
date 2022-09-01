import express from "express";
import 'dotenv/config'
import user from './components/user/API.js'



const app = express()
const port = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.use('/user',user.router)
app.get('/',(req,res)=>{
  res.send("HOME");
})

app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})