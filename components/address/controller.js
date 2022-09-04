import db from './DAL.js'

const getAddress = async(req,res,next) =>{
    try {
        let id = req.query.id
       let address = await db.getAddress(id) 
       if(!address){
        return res.status(404).send("No address found")
       }
       return res.status(200).json(address)
    } catch (error) {
       next(error) 
    }
}

const addAddress = async (req,res,next) =>{
    try {
       await db.addAddress(req.body)  
       return res.status(200).send("DONE")
    } catch (error) {
       next(error) 
    }
}

const updateAddress = async (req,res,next) =>{
    try {
       await db.updateAddress(req.body) 
       return res.status(200).send("DONE")
    } catch (error) {
       next(error) 
    }
}


export default { addAddress,updateAddress, getAddress}
