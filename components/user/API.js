import express from "express";
import cors from 'cors'
import 'dotenv/config'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'


const router = express.Router()

router.post('/register', cors({origin:process.env.corsorg}), ctrler.register)
router.post('/login', cors({origin:process.env.corsorg}), ctrler.login)
router.put('/password', cors({origin:process.env.corsorg}), middleware.checkAuth,ctrler.updatePassword)
router.put('/update', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.updateUser)
router.get('/alluser', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.getAllUser)
router.get('/mydata', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.getMyData)
router.get('/', cors({origin:process.env.corsorg}), ctrler.getUser)


export default {router}