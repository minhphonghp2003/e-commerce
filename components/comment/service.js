import db from './DAL.js'

const addComment = async (comment) => {

    let id = await db.addComment(comment)

    return id


}

const delComment = async (id) => {

    await db.delComment(id)
    return


}

const updateComment = async (comment) => {
    await db.updateComment(comment)

    return

}

const getComment = async (product_id) => {
    let data = await db.getComment(product_id)

    return data

}


export default { addComment, delComment, updateComment, getComment }