import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'
import multer from 'multer'
const upload = multer({storage:multer.memoryStorage()})


const router = express.Router()

router.post('/image', cors({origin:'*'}),middleware.checkAuth,upload.array('cmt_image'), ctrler.addComment)
router.delete('/image', cors({origin:'*'}),middleware.checkAuth, ctrler.delComment)


export default {router}