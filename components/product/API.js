import express from "express";
import cors from 'cors'
import ctrler from './controller.js'
import middleware from '../../libraries/middleware/checkauth.js'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })


const router = express.Router()

router.post('/', cors({ origin: '*' }), middleware.checkAuth, upload.array('product_images'), ctrler.addProduct)
router.post('/category', cors({ origin: '*' }), middleware.checkAuth,  ctrler.addCategory)
router.post('/bid', cors({ origin: '*' }), middleware.checkAuth,  ctrler.addBid)
router.put('/status', cors({ origin: '*' }), middleware.checkAuth, ctrler.updateStatus)
router.put('/bid', cors({ origin: '*' }), middleware.checkAuth, ctrler.updateBid)
router.get('/all', cors({ origin: '*' }), ctrler.getAllProduct)
router.get('/category', cors({ origin: '*' }), ctrler.getCategory)
router.get('/winner', cors({ origin: '*' }), ctrler.getWinner)
router.delete('/', cors({ origin: '*' }),middleware.checkAuth, ctrler.delProduct)
router.get('/:id', cors({ origin: '*' }), ctrler.getProduct)


export default { router }