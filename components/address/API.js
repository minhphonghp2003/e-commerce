import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'

const router = express.Router()

router.delete('/', cors({origin:'*'}),middleware.checkAuth, ctrler.deleteAddress)
router.post('/', cors({origin:'*'}),middleware.checkAuth, ctrler.addAddress)
router.put('/', cors({origin:'*'}),middleware.checkAuth, ctrler.updateAddress)



export default {router}