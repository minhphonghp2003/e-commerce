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
        });

        let id = await db.addComment(comment, images)

        return res.status(200).json({ id })

    } catch (error) {
        next(error)
    }
}

const delComment = async (req, res, next) => {
    try {
        let comment_id = req.body.id
        console.log(comment_id);
        await db.delComment(comment_id)
        return res.send("DONE")

    } catch (error) {
        next(error)
    }
}

export default { addComment, delComment }