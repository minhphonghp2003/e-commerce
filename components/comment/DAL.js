import pkg from 'pg';
import 'dotenv/config'
import { v4 as uuidv4, v4 } from 'uuid';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})


const addComment = async (comment, images) => {
  let id = uuidv4()
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  await pool.query("insert into public.comment values($1, $2, $3,$4,$5,$6)", [today, id, ...Object.values(comment)])
  await pool.query("insert into public.comment_image values($1, $2)", [id, images])
  return id
}


const delComment = async (id) => {
  let images = await pool.query("select image from public.comment_image where comment_id = $1", [id])

  let row = await pool.query("delete from public.comment where id = $1", [id])
  if (!row.rowCount) {
    throw new Error("No row deleted")

  }
  return images.rows[0].image
}

const updateComment = async (comment, images) => {
  let old_images = await pool.query("select image from public.comment_image where comment_id = $1",[comment.id])
  let row = await pool.query("update public.comment set content = $1, rate  = $2 where product_id = $3 and customer_id = $4", [comment.content, comment.rate,comment.product_id, comment.customer_id])
  await pool.query('update public.comment_image set image = $1', [images])
  if (!row.rowCount) {
    throw new Error("No row deleted")

  }
  return old_images.rows[0].image
}

const getComment = async (product_id, customer_id)=>{
  let comments = (await pool.query("select * from public.comment where product_id = $1 and customer_id = $2",[product_id, customer_id])).rows
  let images = (await pool.query("select image from public.comment_image where comment_id = $1",[comments[0].id])).rows[0].image
  return {comments, images}
}


export default { delComment, addComment, updateComment, getComment }
