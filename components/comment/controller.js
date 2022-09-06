import db from './DAL.js'
import firebase from '../../libraries/config.js'
import { getStorage, ref, uploadBytes, getBytes, deleteObject } from "firebase/storage";

const storage = getStorage(firebase.firebase_app)


const addComment = async (req, res, next) => {
    try {
        let comment = req.body
        let images = []
        req.files.forEach(async image => {
            let file_name = (Date.now() % 1000000000 - Math.round(Math.random() * 100000000)) + '-' + image.originalname
            let dest_storage = image.fieldname + "/" + file_name
            images.push(dest_storage)
            let storageRef = ref(storage, dest_storage)
            let bytes = image.buffer
            await uploadBytes(storageRef, bytes)
            // console.log(Date.now(), images);


        });
        let id = await db.addComment(comment, images)
        // console.log(Date.now(), id);

        return res.status(200).json({ id })

    } catch (error) {
        next(error)
    }
}

const delComment = async (req, res, next) => {
    try {
        let comment_id = req.body.id

        let images = await db.delComment(comment_id)
        images.forEach(async i => {
            const deleteRef = ref(storage, i)
            await deleteObject(deleteRef)

        });
        return res.send("Done")

    } catch (error) {
        next(error)
    }
}

const updateComment = async (req, res, next) => {
    try {
        let images = []
        req.files.forEach(async image => {
            let file_name = (Date.now() % 1000000000 - Math.round(Math.random() * 100000000)) + '-' + image.originalname
            let dest_storage = image.fieldname + "/" + file_name
            images.push(dest_storage)
            let storageRef = ref(storage, dest_storage)
            let bytes = image.buffer
            await uploadBytes(storageRef, bytes)
        });

        let old_images = await db.updateComment(req.body, images)
        old_images.forEach(async i => {
            const deleteRef = ref(storage, i)
            await deleteObject(deleteRef)

        });
        return res.send("DONE")
    } catch (error) {
        next(error)
    }
}

const getComment = async (req, res, next) => {
    try {
        let data = await db.getComment(req.query.product_id, req.query.customer_id)
        let images = []


        data.images.forEach(async img => {
            let getRef = ref(storage, img)
            let buffer = await getBytes(getRef)

            images.push(Buffer.from(buffer))
            data.images = images
            console.log(data);
        })


        return res.status(200).json(data)


    } catch (error) {
        next(error)
    }


}


export default { addComment, delComment, updateComment, getComment }