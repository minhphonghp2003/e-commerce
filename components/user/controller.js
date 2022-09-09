import svc from './service.js'


const register = async (req, res, next) => {
    try {
        let userData = await svc.register(req.body)
        return res.status(200).json(userData)

    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        let response = await svc.login(req.body)

        return res.status(400).json(response)

    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        await svc.updateUser(req.body)

        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}

const updatePassword = async (req, res, next) => {
    try {

        await svc.updatePassword(req.body)
        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {

        let userData = await svc.getUser(req.query.username)
        return res.status(200).json(userData)
    } catch (error) {
        next(error)
    }
}

const getAllUser = async (req,res,next)=>{
    try {
       if(req.data.role != 'admin') {
        return res.status(400).send("You are not allowed")
       }
       let users = await svc.getAllUser()
       return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export default { register, login, updateUser, updatePassword, getUser, getAllUser }