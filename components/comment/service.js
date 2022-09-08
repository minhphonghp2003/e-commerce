import db from './DAL.js'
import firebase from '../../libraries/config.js'
import { getStorage, ref, uploadBytes, getBytes, deleteObject } from "firebase/storage";

const storage = getStorage(firebase.firebase_app)


const addComment = async (comment, files) => {

    let images = []
    files.forEach(async image => {
        let file_name = (Date.now() % 1000000000 - Math.round(Math.random() * 100000000)) + '-' + image.originalname
        let dest_storage = image.fieldname + "/" + file_name
        images.push(dest_storage)
        let storageRef = ref(storage, dest_storage)
        let bytes = image.buffer
        await uploadBytes(storageRef, bytes)


    });
    let id = await db.addComment(comment, images)

    return id


}

const delComment = async (id) => {


    let images = await db.delComment(id)
    images.forEach(async i => {
        const deleteRef = ref(storage, i)
        await deleteObject(deleteRef)

    });
    return


}

const updateComment = async (comment, files) => {
    let images = []
    files.forEach(async image => {
        let file_name = (Date.now() % 1000000000 - Math.round(Math.random() * 100000000)) + '-' + image.originalname
        let dest_storage = image.fieldname + "/" + file_name
        images.push(dest_storage)
        let storageRef = ref(storage, dest_storage)
        let bytes = image.buffer
        await uploadBytes(storageRef, bytes)
    });

    let old_images = await db.updateComment(comment, images)
    old_images.forEach(async i => {
        const deleteRef = ref(storage, i)
        await deleteObject(deleteRef)

    });
    return

}

const getComment = async (product_id) => {
    let data = await db.getComment(product_id)


    await (async () => {

        for (const d of data) {
            let images = []
            for (let img of d.image) {
                let getRef = ref(storage, img)
                let buffer = await getBytes(getRef)

                images.push(Buffer.from(buffer))
            }
            d.image = images

        }


    })()
    return data

}


export default { addComment, delComment, updateComment, getComment }