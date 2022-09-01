import express from "express";
import 'dotenv/config'
import { pool } from '../test.js'



const app = express()
const port = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/', async (req, res) => {
  try {
    const cate = await pool.query("select * from category")
    return res.status(200).json(cate.rows)

  } catch (err) {
    console.log(err.stack)
  }

})
app.post('/', (req, res) => {
  let req_body = req.body
  res.send(req_body)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})