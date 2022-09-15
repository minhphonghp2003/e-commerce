import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'
import 'dotenv/config'

const router = express.Router()

router.get('/',cors({origin:process.env.corsorg}), middleware.checkAuth,ctrler.getOrder)
router.get('/all',cors({origin:process.env.corsorg}), middleware.checkAuth,ctrler.getAllOrder)
router.post('/',cors({origin:process.env.corsorg}), middleware.checkAuth,ctrler.addOrder)
router.put('/',cors({origin:process.env.corsorg}), middleware.checkAuth,ctrler.updateStatus)


export default {router}