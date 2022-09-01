import pkg from 'pg';
import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid';
const {Pool} = pkg;



const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  })
  

const getUser =async  (id)  =>  {
  console.log("querying");
    let res  = await pool.query("select * from public.user where id = $1",[id]);
    let default_shipping = await pool.query("select * from public.address where id = $1",[res.rows[0].default_shipping_address])
    res.rows[0].default_shipping_address = default_shipping.rows[0]
    return res.rows[0];
}

export default {getUser};
