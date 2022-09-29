import db from './DAL.js'
import { keygen } from '../../libraries/jwt.js';
import firebase from '../../libraries/config.js'
import { getStorage, ref, uploadBytes, getBytes, deleteObject } from "firebase/storage";

const storage = getStorage(firebase.firebase_app)

const register = async (userInfo) => {
    let id = await db.addUser(userInfo)
    let role = 'customer'
    let token = await keygen(id, role)

    return { id, token }


}

const login = async (userInfo) => {
    let { username, password } = userInfo
    let { isValid, id, role } = await db.getAvailableUserCred(username, password)
    if (isValid) {
        let token = await keygen(id, role)
        return { token, id }
    }
    return { error: "Wrong password" }


}

const updateUser = async (userInfo, image) => {
    
    let old_avatar = (await db.getMyData(userInfo.id)).user.avatar
    let file_name = (Date.now() % 1000000000 - Math.round(Math.random() * 100000000)) + '-' + image.originalname
    let dest_storage = image.fieldname + "/" + file_name
    let storageRef = ref(storage, dest_storage)
    let bytes = image.buffer
    await uploadBytes(storageRef, bytes)
    image = dest_storage
    await db.updateUser(userInfo, image)
    if(old_avatar != 'user_images/avatar.jpg'){
        const desertRef = ref(storage, old_avatar);
        await deleteObject(desertRef)
    }
    return
}

const updatePassword = async (userInfo) => {
    let { id, password } = userInfo
    await db.updatePassword(id, password)
    return
}

const newPassword = async (userInfo) => {
    let { email, password } = userInfo
    await db.newPassword(email, password)
    return
}
// 
const getUser = async (id) => {
    let userData = await db.getUserBy(id)
    let userAvatar = userData.user.avatar
    await (async () => {

        for (const u of userData.product) {
            let img = u.image

            if (img) {
                let getRef = ref(storage, img)
                let buffer = await getBytes(getRef)

                u.image = Buffer.from(buffer)

            }

        }
        let getRef = ref(storage, userAvatar)
        let buffer = await getBytes(getRef)
        userData.user.avatar = Buffer.from(buffer)

    })()

    return userData
}
const getMyData = async (id) => {
    let myData = await db.getMyData(id)
    let myAvatar = myData.user.avatar
    await (async () => {

        for (const u of myData.product) {
            let img = u.image

            if (img) {
                let getRef = ref(storage, img)
                let buffer = await getBytes(getRef)

                u.image = Buffer.from(buffer)

            }

        }
        let getRef = ref(storage, myAvatar)
        let buffer = await getBytes(getRef)

        myData.user.avatar = Buffer.from(buffer)




    })()
    return myData

}

const getAllUser = async () => {
    let userData = await db.getAllUser()
    await (async () => {

        for (const u of userData) {
            let img = u.avatar

            if (img) {
                let getRef = ref(storage, img)
                let buffer = await getBytes(getRef)

                u.avatar = Buffer.from(buffer)

            }

        }

    })()
    return userData
}

const getEmail = async (id) => {
    return await db.getEmail(id)
}
const addResetEmail = async (email) => {
    return await db.addForgotPassEmail(email)
}
const deleteResetEmail = async (id) => {
    await db.deleteForgotPassEmail(id)
    return
}

export default { getEmail, addResetEmail, deleteResetEmail, register, login, updateUser, updatePassword, getUser, getAllUser, getMyData, newPassword }