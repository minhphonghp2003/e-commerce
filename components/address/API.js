import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'

const router = express.Router()

router.get('/', cors({origin:'*'}),middleware.checkAuth, ctrler.getAddress)
router.post('/', cors({origin:'*'}),middleware.checkAuth, ctrler.addAddress)
router.put('/', cors({origin:'*'}),middleware.checkAuth, ctrler.updateAddress)



export default {router}