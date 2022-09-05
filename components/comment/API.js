import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'
import multer from 'multer'
const upload = multer({storage:multer.memoryStorage()})


const router = express.Router()

router.get('/', cors({origin:'*'}),middleware.checkAuth, ctrler.getComment)
router.post('/', cors({origin:'*'}),middleware.checkAuth,upload.array('cmt_image'), ctrler.addComment)
router.delete('/', cors({origin:'*'}),middleware.checkAuth, ctrler.delComment)
router.put('/', cors({origin:'*'}),middleware.checkAuth,upload.array('cmt_image'), ctrler.updateComment)


export default {router}