import express from "express";
import cors from 'cors'
import 'dotenv/config'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/register', cors({origin:process.env.corsorg}), ctrler.register)
router.post('/email', cors({origin:process.env.corsorg}), ctrler.addResetEmail)
router.get('/email', cors({origin:process.env.corsorg}), ctrler.getResetEmail)
router.delete('/email', cors({origin:process.env.corsorg}), ctrler.deleteResetEmail)
router.post('/login', cors({origin:process.env.corsorg}), ctrler.login)
router.put('/password', cors({origin:process.env.corsorg}), middleware.checkAuth,ctrler.updatePassword)
router.put('/newpassword', cors({origin:process.env.corsorg}), ctrler.newPassword)
router.put('/update', cors({origin:process.env.corsorg}),middleware.checkAuth,upload.single('user_images'), ctrler.updateUser)
router.get('/alluser', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.getAllUser)
router.get('/mydata', cors({origin:process.env.corsorg}),middleware.checkAuth, ctrler.getMyData)
router.get('/', cors({origin:process.env.corsorg}), ctrler.getUser)


export default {router}