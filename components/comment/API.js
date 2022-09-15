import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'
import 'dotenv/config'



const router = express.Router()

router.get('/', cors({origin:process.env.corsorg}), ctrler.getComment)
router.post('/', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.addComment)
router.delete('/', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.delComment)
router.put('/', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.updateComment)


export default {router}