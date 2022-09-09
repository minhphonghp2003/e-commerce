import pkg from 'pg';
import 'dotenv/config'
import { v4 as uuidv4, v4 } from 'uuid';
const { Pool } = pkg;
import bcrypt from 'bcrypt'

const saltRounds = 5;


const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

const getAllUser = async ()=>{
  return (await pool.query("select * from public.user")).rows
}

const getUserBy = async (id, username) => {
  let res
  if (id) {
    res = await pool.query("select * from public.user where id = $1", [id]);

  }
  else if (username) {
    res = await pool.query("select * from public.user where username = $1", [username]);
  }

  let default_shipping = await pool.query("select * from public.address where id = $1", [res.rows[0].default_shipping_address])
  res.rows[0].default_shipping_address = default_shipping.rows[0]
  return res.rows[0];

}

const addUser = async ({ username, password, fullname, phone, email }) => {
  try {
    let id = uuidv4()

    const hash = await bcrypt.hash(password, saltRounds)
    await pool.query("insert into public.user(id,username,password,fullname,phone,email,role) values ($1,$2,$3,$4,$5,$6,$7)", [id, username, hash, fullname, phone, email, 'customer'])
    return id
  } catch (error) {
    throw new Error(error)
  }
}

const checkAvailableUser = async (username, password) => {

  let hash = await pool.query("select password from public.user where username = $1", [username])
  let isValid = await bcrypt.compare(password, hash.rows[0].password)
  return isValid

}

const updateUser = async (data) => {


  const hash = await bcrypt.hash(data.password, saltRounds)
  data.password = hash
  await pool.query("UPDATE public.user SET  password = $2 , fullname = $3,phone= $6, email =$4 ,country = $5,default_shipping_address=$7, role = $8 WHERE id = $1;", Object.values(data))
  return

}

const updatePassword = async (username, password) => {

  const hash = await bcrypt.hash(password, saltRounds)
  let row = await pool.query("UPDATE public.user SET  password = $1 WHERE username = $2;", [hash, username])
  if (!row.rowCount) {
    throw new Error("No username found")
  }

  return


}




export default { updateUser, getUserBy, addUser, checkAvailableUser, updatePassword, getAllUser };
