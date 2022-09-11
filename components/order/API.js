import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'


const router = express.Router()

router.get('/',cors({origin:"*"}), middleware.checkAuth,ctrler.getOrder)
router.get('/all',cors({origin:"*"}), middleware.checkAuth,ctrler.getAllOrder)
router.post('/',cors({origin:"*"}), middleware.checkAuth,ctrler.addOrder)
router.put('/',cors({origin:"*"}), middleware.checkAuth,ctrler.updateStatus)


export default {router}