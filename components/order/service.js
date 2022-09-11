import db from './DAL.js'

const addOrder = async(customer, product)=>{
    let shippingAddr = (await db.getShippingAddress(customer)).id
    if(!shippingAddr){
        throw new Error("No shipping address")
    }
    await db.addOrder(customer,product,shippingAddr)
    return 
}

const getOrder = async(customer,product) =>{
    let order = await db.getOrder(customer,product)
    delete order.id
    return order
}

const updateStatus = async(status,id) =>{
    let row =await db.updateStatus(status,id)
    if(!row){
        throw new Error("No row updated")
    }
    return
}

const getAllOrder = async() =>{
    return await db.getAllOrder()
}

export default { addOrder, getOrder, updateStatus, getAllOrder }