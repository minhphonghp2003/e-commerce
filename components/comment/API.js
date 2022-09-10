import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'
import multer from 'multer'
const upload = multer({storage:multer.memoryStorage()})


const router = express.Router()

router.get('/', cors({origin:'*'}), ctrler.getComment)
router.post('/', cors({origin:'*'}),middleware.checkAuth, ctrler.addComment)
router.delete('/', cors({origin:'*'}),middleware.checkAuth, ctrler.delComment)
router.put('/', cors({origin:'*'}),middleware.checkAuth, ctrler.updateComment)


export default {router}