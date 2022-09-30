import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'
import 'dotenv/config'

const router = express.Router()

router.delete('/', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.deleteAddress)
router.post('/', cors({origin:process.env.corsorg}), ctrler.addAddress)
router.put('/', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.updateAddress)
router.get('/', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.getAddress)



export default {router}