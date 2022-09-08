import svc from './service.js'


const addComment = async (req, res, next) => {
    try {
        let comment = req.body
        comment.customer_id = req.data.id
        let id = await svc.addComment(comment, req.files)
        return res.status(200).json({ id })

    } catch (error) {
        next(error)
    }
}

const delComment = async (req, res, next) => {
    try {
        
        let comment_id = req.body.id
        await svc.delComment(comment_id)
        return res.send("Done")

    } catch (error) {
        next(error)
    }
}

const updateComment = async (req, res, next) => {
    try {
        let comment = req.body 
        if(req.data.id == comment.customer_id){

            await svc.updateComment(comment,req.files)
            return res.send("DONE")
        }
        return res.status(400).send("You're not allowed")
    } catch (error) {
        next(error)
    }
}

const getComment = async (req, res, next) => {
    try {
        let data = await svc.getComment(req.query.product_id)
        return res.status(200).json(data)

    } catch (error) {
        next(error)
    }


}


export default { addComment, delComment, updateComment, getComment }