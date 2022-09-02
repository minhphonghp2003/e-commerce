import db from './DAL.js'
import { keygen } from '../../libraries/jwt.js';



const register = async (req, res, next) => {
    try {
        let id = await db.addUser(req.body)
        let role = 'customer'
        let token = await keygen(id, role)
        return res.status(200).json({ id, token })

    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        let { username, password } = req.body
        let isValid = await db.checkAvailableUser(username, password)
        if (isValid) {
            let userData = await db.getUserBy(0, username)
            let token = await keygen(userData.id, userData.role)
            return res.status(200).json({token,id:userData.id})
        }
        return res.status(400).json({ error: "Wrong password" })

    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        await db.updateUser(req.body)
        
        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}


export default { register, login, updateUser }