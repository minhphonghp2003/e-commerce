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


const getAddress = async(id)=>{
    return (await pool.query("select * from public.address where id = $1", [id])).rows[0]
}

const addAddress = async(addr)=>{
   await pool.query("insert into public.address (city,district,commune_ward,street) values($1,$2,$3,$4) ",Object.values(addr))
  return
}

const updateAddress = async (data)=>{
  let rowCount = (await pool.query("update public.address set city =$2 , district = $3, commune_ward = $4, street =$5  where id = $1 ", Object.values(data))).rowCount
  if(!rowCount) {
    throw new Error("No address updated")
  }
  return
}

export default { addAddress, updateAddress, getAddress}