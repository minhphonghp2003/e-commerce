import db from './DAL.js'
import firebase from '../../libraries/config.js'
import { getStorage, ref, uploadBytes, getBytes, deleteObject } from "firebase/storage";

const storage = getStorage(firebase.firebase_app)
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

const getMyOrder = async (id) => {
    let myOrder = await db.getMyOrder(id)
    await (async () => {

        for (let i of myOrder) {

            let getRef = ref(storage, i.p_image)
            let buffer = await getBytes(getRef)

           i.p_image = Buffer.from(buffer)

        }


    })()
    return myOrder 
}

export default { addOrder, getOrder, updateStatus, getAllOrder ,getMyOrder}