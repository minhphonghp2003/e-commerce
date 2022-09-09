import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'


const router = express.Router()

router.post('/register', cors({origin:'*'}), ctrler.register)
router.post('/login', cors({origin:'*'}), ctrler.login)
router.get('/', cors({origin:'*'}), ctrler.getUser)
router.put('/password', cors({origin:'*'}), ctrler.updatePassword)
router.put('/update', cors({origin:'*'}),middleware.checkAuth, ctrler.updateUser)
router.get('/alluser', cors({origin:'*'}),middleware.checkAuth, ctrler.getAllUser)


export default {router}