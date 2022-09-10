import svc from './service.js'

const addProduct = async (req, res, next) => {
    try {
        if (req.data.role != 'seller') {
            throw new Error("You are not seller")
        }
        let product = req.body
        product.seller = req.data.id
        let images = req.files
        let pid = await svc.addProduct(product, images)
        return res.status(200).json({ pid })

    } catch (error) {
        next(error)
    }
}

const getAllProduct = async (req, res, next) => {
    try {
        let { cate, status, page } = req.query
        let products = await svc.getAllProduct(cate, status, page)
        return res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

const getProduct = async (req, res, next) => {
    try {
        let id = req.params.id
        let product = await svc.getProduct(id)

        return res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

const updateStatus = async (req, res, next) => {
    try {

        if (req.data.role != 'admin') {
            throw new Error("You are not admin")
        }
        let status = req.body.status
        let product_id = req.body.id
        await svc.updateStatus(status, product_id)
        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}

const addBid = async (req, res, next) => {
    try {

        let { product_id, price } = req.body
        let customer_id = req.data.id
        await svc.addBid(product_id, customer_id, price)
        return res.status(200).send("DONE")

    } catch (error) {
        next(error)
    }
}

const updateBid = async (req, res, next) => {
    try {
        let customer_id = req.data.id
        let { product_id, price } = req.body
        await svc.updateBid(product_id, customer_id, price)
        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}
const getWinner = async (req, res, next) => {
    try {
        let product_id = req.query.id
        let winner = await svc.getWinner(product_id)
        return res.status(200).json(winner)
    } catch (error) {

        next(error)
    }
}
// 
const delProduct = async (req, res, next) => {
    try {
        let product_id = req.body.id
        await svc.delProduct(product_id)
        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}

// ----------------category-------------------------

const getCategory = async (req, res, next) => {
    try {
        let category = await svc.getCategory()
        return res.status(200).json(category)
    } catch (error) {
        next(error)
    }
}

const addCategory = async (req, res, next) => {
    try {
        if (req.data.role != 'admin') {
            throw new Error("You are not admin")
        }
        await svc.addCategory(req.body.category)
        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}


export default {
    addProduct, getAllProduct, getProduct,
    updateStatus, getCategory, addCategory, addBid,
    updateBid, getWinner, delProduct
}