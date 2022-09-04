import db from './DAL.js'

const deleteAddress = async(req,res,next) =>{
    try {
      let id = req.body.id

      console.log(req.body.id);
      await db.delAddress(id) 
      return res.status(200).send("Done")
      
    } catch (error) {
       next(error) 
    }
}

const addAddress = async (req,res,next) =>{
    try {
       let addr_id = await db.addAddress(req.body)  
       return res.status(200).send({addr_id})
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


export default { addAddress,updateAddress, deleteAddress}
