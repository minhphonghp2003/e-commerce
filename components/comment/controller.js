import svc from './service.js'


const addComment = async (req, res, next) => {
    try {
        let comment = req.body
        comment.customer_id = req.data.id
        let id = await svc.addComment(comment)

        return res.status(200).json({ id })

    } catch (error) {
        next(error)
    }
}

const delComment = async (req, res, next) => {
    try {
        if (req.body.uid !== req.data.id) {
            throw new Error("You are not allowed")
        }
        let comment_id = req.body.comment_id

        await svc.delComment(comment_id)
        return res.send("Done")

    } catch (error) {
        next(error)
    }
}

const updateComment = async (req, res, next) => {
    try {
        if (req.body.uid !== req.data.id) {
            throw new Error("You are not allowed")
        }
        let comment = req.body

        await svc.updateComment(comment)
        return res.send("DONE")
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