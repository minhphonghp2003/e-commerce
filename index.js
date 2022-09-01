import express from "express";
import 'dotenv/config'



const app = express()
const port = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})