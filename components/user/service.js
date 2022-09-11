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
    let {id, password } = userInfo
    await db.updatePassword(id, password)
    return


}

const getUser = async (id) => {
    let userData = await db.getUserBy(id)
    return userData
}

const getAllUser = async () => {
    return await db.getAllUser()
}



export default { register, login, updateUser, updatePassword, getUser, getAllUser }