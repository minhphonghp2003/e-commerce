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
        let user = await svc.login(req.body)

        return res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        let userInfo = req.body
        userInfo.id = req.data.id
        await svc.updateUser(userInfo)

        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}

const updatePassword = async (req, res, next) => {
    try {

        let id = req.data.id
        let cre = {id,password : req.body.password}
        await svc.updatePassword(cre)
        return res.status(200).send("DONE")
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {

        let userData = await svc.getUser(req.query.id)
        return res.status(200).json(userData)
    } catch (error) {
        next(error)
    }
}

const getMyData = async(req,res,next) =>{
    try {
        let id =req.data.id 
        let mydata = await svc.getMyData(id)
        return res.status(200).json(mydata)
        
    } catch (error) {
       next(error) 
    }
}

const getAllUser = async (req, res, next) => {
    try {
        if (req.data.role != 'admin') {
            return res.status(400).send("You are not allowed")
        }
        let users = await svc.getAllUser()
        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}


export default { register, login, updateUser, updatePassword, getUser, getAllUser, getMyData }