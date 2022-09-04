import pkg from 'pg';
import 'dotenv/config'
const { Pool } = pkg;
import { v4 as uuidv4, v4 } from 'uuid';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})


const delAddress = async(id)=>{
    let row = (await pool.query("delete from public.address where id = $1", [id])).rowCount
    if(!row){
      throw new Error("No rows affected")
    
    }
    console.log(data);
    return
}

const addAddress = async(addr)=>{
  addr.id = uuidv4()
 await pool.query("insert into public.address (city,district,commune_ward,street,id) values($1,$2,$3,$4,$5) ",Object.values(addr))
 
  return addr.id
}

const updateAddress = async (data)=>{
  let rowCount = (await pool.query("update public.address set city =$2 , district = $3, commune_ward = $4, street =$5  where id = $1 ", Object.values(data))).rowCount
  if(!rowCount) {
    

    throw new Error("No address updated")
  }
  return
}

export default { addAddress, updateAddress, delAddress}