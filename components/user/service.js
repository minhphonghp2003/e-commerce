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

const updateUser = async (userInfo) => {
    await db.updateUser(userInfo)
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

const getUser = async (id) => {
    let userData = await db.getUserBy(id)
    await (async () => {

        for (const u of userData.product) {
            let img = u.image

            if (img) {
                let getRef = ref(storage, img)
                let buffer = await getBytes(getRef)

                u.image = Buffer.from(buffer)

            }

        }


    })()

    return userData
}

const getMyData = async (id) => {
    let myData = await db.getMyData(id)
    await (async () => {

        for (const u of myData.product) {
            let img = u.image

            if (img) {
                let getRef = ref(storage, img)
                let buffer = await getBytes(getRef)

                u.image = Buffer.from(buffer)

            }

        }


    })()
    return myData

}

const getAllUser = async () => {
    return await db.getAllUser()
}

const getEmail = async(id)=>{
    return await db.getEmail(id)
}
const addResetEmail = async(email)=>{
    return await db.addForgotPassEmail(email)
}
const deleteResetEmail = async(id)=>{
    await db.deleteForgotPassEmail(id)
    return
}

export default {getEmail,addResetEmail,deleteResetEmail, register, login, updateUser, updatePassword, getUser, getAllUser, getMyData, newPassword }