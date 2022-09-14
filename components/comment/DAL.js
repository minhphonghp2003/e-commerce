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


const addComment = async (comment) => {
  let id = uuidv4()
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  await pool.query("insert into public.comment values($1, $2, $3,$4,$5,$6)", [today, id, ...Object.values(comment)])
  return id
}


const delComment = async (id) => {

  let row = await pool.query("delete from public.comment where id = $1", [id])
  if (!row.rowCount) {
    throw new Error("No row deleted")

  }
  return 
}

const updateComment = async (comment) => {
  let row = await pool.query("update public.comment set content = $1, rate  = $2 where id = $3 ", [comment.content, comment.rate,comment.comment_id])
  if (!row.rowCount) {
    throw new Error("No row deleted")

  }
  return 
}

const getComment = async (product_id)=>{
  console.log(product_id);
  let comments = (await pool.query("select c.id as cid,date,content,rate, u.fullname, u.id as uid  from public.comment as c join public.user u on c.customer_id = u.id where c.product_id = $1",[product_id])).rows
  
  return comments
}


export default { delComment, addComment, updateComment, getComment }
