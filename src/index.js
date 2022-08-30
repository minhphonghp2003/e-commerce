import express from "express";

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/', (req, res) => {
    let req_body = req.body
    res.send(req_body)
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})