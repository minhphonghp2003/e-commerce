import express from "express";
import 'dotenv/config'
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })


const router = express.Router()

router.post('/', cors({ origin: process.env.corsorg }), middleware.checkAuth, upload.array('product_images'), ctrler.addProduct)
router.post('/category', cors({ origin: process.env.corsorg }), middleware.checkAuth,  ctrler.addCategory)
router.post('/bid', cors({ origin: process.env.corsorg }), middleware.checkAuth,  ctrler.addBid)
router.put('/status', cors({ origin: process.env.corsorg }), middleware.checkAuth, ctrler.updateStatus)
router.put('/bid', cors({ origin: process.env.corsorg }), middleware.checkAuth, ctrler.updateBid)
router.get('/all', cors({ origin: process.env.corsorg }), ctrler.getAllProduct)
router.get('/category', cors({ origin: process.env.corsorg }), ctrler.getCategory)
router.get('/pagecount', cors({ origin: process.env.corsorg }), ctrler.countPage)
router.get('/winner', cors({ origin: process.env.corsorg }), ctrler.getWinner)
router.delete('/', cors({ origin: process.env.corsorg }),middleware.checkAuth, ctrler.delProduct)
router.get('/:id', cors({ origin: process.env.corsorg }), ctrler.getProduct)


export default { router }