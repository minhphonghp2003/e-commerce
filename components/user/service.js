import db from './DAL.js'
import { keygen } from '../../libraries/jwt.js';


const register = async (userInfo) => {
    let id = await db.addUser(userInfo)
    let role = 'customer'
    let token = await keygen(id, role)

    return { id, token }


}

const login = async (userInfo) => {
    let { username, password } = userInfo
    let isValid = await db.checkAvailableUser(username, password)
    if (isValid) {
        let userData = await db.getUserBy(0, username)
        let token = await keygen(userData.id, userData.role)
        return { token, id: userData.id }
    }
    return { error: "Wrong password" }


}

const updateUser = async (userInfo) => {
    await db.updateUser(userInfo)
    return
}

const updatePassword = async (userInfo) => {
    let { username, password } = userInfo
    await db.updatePassword(username, password)
    return


}

const getUser = async (username) => {
    let userData = await db.getUserBy(0, username)
    return userData
}

const getAllUser = async ()=>{
    return await db.getAllUser()
}



export default { register, login, updateUser, updatePassword, getUser, getAllUser }