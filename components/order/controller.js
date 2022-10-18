import svc from './service.js'

const addOrder = async(req,res,next) =>{
    try {
        let uid = req.body.user_id
        let  product = req.body.product_id
        await svc.addOrder(uid,product)
        return res.status(200).send("DONE")
        
    } catch (error) {
       next(error) 
    }
}

const getOrder = async(req,res,next) =>{
    try {
        let uid = req.data.id
        let order = await svc.getOrder(uid,req.query.product) 
        return res.status(200).json(order)

    } catch (error) {
       next(error) 
    }
}

const updateStatus = async(req,res,next) =>{
    try {
    if(req.data.role != "shipper"){
            throw new Error("You are not shipper")
        }
       let {status,product_id} = req.body 
       await svc.updateStatus(status,product_id)
       return res.send("DONE")
    } catch (error) {
       next(error)
    }
}

const getAllOrder = async(req,res,next) =>{
    try {
        if(req.data.role != "shipper"){
            throw new Error("You are not shipper")
        }
        let orders = await svc.getAllOrder()
        return res.status(200).json(orders)
        
    } catch (error) {
       next(error) 
    }
}

const getMyOrder = async (req, res, next) => {

    try {
        let { id } = req.data
        let myOrder = await svc.getMyOrder(id)
        return res.status(200).json(myOrder)
    } catch (error) {
        next(error)
    }
}

export default { addOrder,getOrder,updateStatus, getAllOrder , getMyOrder}