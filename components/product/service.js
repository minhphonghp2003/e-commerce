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

    let product = await db.getAllProduct()
    if (status) {
        for (let i = 0; i < product.data.length; i++) {
            if (product.data[i].status != status) {
   
                product.data.splice(i,1)

                i--
            }
        }
    }
    if (cate) {
        for (let i = 0; i < product.data.length; i++) {
            if (product.data[i].category != cate) {
                product.data.splice(i,1)
                i--
            }
        }
    }

   

    let first_PageElement = PAGINATE * (page - 1)
    let last_PageElement = first_PageElement + PAGINATE
    if (last_PageElement > product.data.length) {
        last_PageElement = product.data.length
    }
    product.data = product.data.slice(first_PageElement, last_PageElement)


     await (async () => {

        for (const p of product.data) {
            let img = p.image

            if (img) {
                let getRef = ref(storage, img)
                let buffer = await getBytes(getRef)
              
                p.image = Buffer.from(buffer)

            }

        }


    })()


    return product
}

const getProduct = async (id) => {

    let product = await db.getProduct(id)

    product.bidder_count = product.bidders.length

    await (async () => {

        for (let i in product.prod.image) {

            let getRef = ref(storage, product.prod.image[i])
            let buffer = await getBytes(getRef)

            product.prod.image[i] = Buffer.from(buffer)

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
    await db.addBid(product_id, customer_id, price)
    return
}


const updateBid = async (product_id, customer_id, price) => {
    let row = await db.udpateBid(product_id, customer_id, price)
    if (!row) {
        throw new Error("No row updated")
    }
    return
}

const getWinner = async (product_id) => {
    return await db.getWinner(product_id)
}
const delProduct = async (product_id) => {
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
    updateBid, delProduct, getCategory,
    addCategory
}