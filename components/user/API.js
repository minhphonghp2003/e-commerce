import express from "express";
import cors from 'cors'
import ctrler from './controller.js'


const router = express.Router()

router.get('/:uid',cors({origin:'*'}),ctrler.goHome)


export default {router}