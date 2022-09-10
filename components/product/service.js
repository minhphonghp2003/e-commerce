import db from './DAL.js'
import firebase from '../../libraries/config.js'
import { getStorage, ref, uploadBytes, getBytes, deleteObject } from "firebase/storage";

const storage = getStorage(firebase.firebase_app)
const PAGINATE = 16

const addProduct = async (product, files) => {
    let images = []
    files.forEach(async image => {
        let file_name = (Date.now() % 1000000000 - Math.round(Math.random() * 100000000)) + '-' + image.originalname
        let dest_storage = image.fieldname + "/" + file_name
        images.push(dest_storage)
        let storageRef = ref(storage, dest_storage)
        let bytes = image.buffer
        await uploadBytes(storageRef, bytes)


    });
    let pid = await db.addProduct(product, images)
    return pid
}

const getAllProduct = async (cate, status, page) => {
    let products = await db.getAllProduct(cate)
    if (status) {
        for (i of products) {
            if (i.status != status) {
                products.splice(i)
            }
        }
    }
    if (cate) {
        for (i of products) {
            if (i.cate != cate) {
                products.splice(i)
            }
        }
    }

    await (async () => {

        for (const p of products) {

            let img = p.image
            let getRef = ref(storage, img)
            let buffer = await getBytes(getRef)

            d.image = buffer

        }


    })()
    
    let firstPageElement = PAGINATE * (page - 1)
    let lastPageElement = firstPageElement + PAGINATE
    if (lastPageElement > products.length) {
        lastPageElement = products.length
    }
    products = products.slice(firstPageElement, lastPageElement)


    return products
}

const getProduct = async (id) => {

    let product = await db.getProduct(id)
    product.bidder_count = product.bidders.length

    await (async () => {

        for (const i of product.prod.image) {

            let getRef = ref(storage, i)
            let buffer = await getBytes(getRef)

            i = buffer

        }


    })()

    return product
}

const updateStatus = async (status, id) => {
    let rowcount = await db.updateStatus(status, id)
    if (!rowcount) {
        throw new Error("No row updated")
    }
    return

}

const addBid = async (product_id, customer_id, price) => {
    let shipping_address =  await db.getShipingAddress(customer_id)
    await db.addBid(product_id, customer_id, shipping_address, price)
    return
}

const getWinner = async (product_id) => {
    return await db.getWinner(product_id)
}

const updateBid = async (product_id, customer_id, price) => {
    let row = await db.udpateBid(product_id, customer_id, price)
    if (!row) {
        throw new Error("No row updated")
    }
}

const delproduct = async (product_id) => {
    let { row, image } = await db.delproduct(product_id)
    for (let i of image) {
        const desertRef = ref(storage, i);
        await deleteObject(desertRef)
    }
    if (!row) {
        throw new Error("No row deleted")
    }
    return
}

const getCategory = async () => {
    return await db.getCategory()
}

const addCategory = async (cate) => {
    await db.addCategory(cate)
    return
}

export default {
    addProduct, getAllProduct, getProduct,
    updateStatus, addBid, getWinner,
    updateBid, delproduct, getCategory,
    addCategory
}