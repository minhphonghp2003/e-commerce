import pkg from 'pg';
import 'dotenv/config'
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})


const addImage =async (path)=>{
    await pool.query("INSERT into public.image (path) values ($1)",[path])
    return
}

const updateImage = async (id,path)=>{
  let rowCount = (await pool.query("update public.image set path = $2  where id = $1 ", [id,path])).rowCount
  if(!rowCount) {
    throw new Error("No address updated")
  }
  return
}


