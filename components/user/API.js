import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'


const router = express.Router()

router.post('/register', cors({origin:'*'}), ctrler.register)
router.post('/login', cors({origin:'*'}), ctrler.login)
router.put('/update', cors({origin:'*'}),middleware.checkAuth, ctrler.updateUser)

export default {router}