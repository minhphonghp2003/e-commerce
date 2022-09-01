import db from './DAL.js'

const goHome = async (req, res) => {
    let uid = req.params.uid
    console.log(uid);
    try {
        let user = await db.getUser(uid)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(404).json(error)
    }

}

export default {goHome}