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
  await pool.query("insert into public.comment values($1, $2, $3,$4,$5,$6)", [today,id,...Object.values(comment)])
  await pool.query("insert into public.comment_image values($1, $2)", [id,images])
  return id
}


const delComment = async (comment) =>{
  let row = await pool.query("delete from public.comment where id = $1",[comment])
  if(!row.rowCount){
    throw new Error("No row deleted")

  }
  return
}


export default { delComment, addComment }
