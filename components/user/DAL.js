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


const getAllUser = async () => {
  return (await pool.query("select * from public.user")).rows
}

const getMyData = async (id) => {
  let product = await pool.query("select sku, name, date_end, status, image[1] as image from public.product  p inner join public.product_image as i on p.id  = i.product_id where p.seller = $1", [id])
  let user = await pool.query("select * from public.user where id = $1", [id]);

  return { user: user.rows[0], product: product.rows }
}
const getUserBy = async (id) => {


  let product = await pool.query("select sku, name, date_end, status, image[1] as image from public.product  p inner join public.product_image as i on p.id  = i.product_id where p.seller = $1", [id])
  let user = await pool.query("select fullname,email,country,phone,role from public.user where id = $1", [id]);

  return { user: user.rows[0], product: product.rows }

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

const getAvailableUserCred = async (username, password) => {

  let cre = await pool.query("select role, id, password from public.user where username = $1", [username])
  let isValid = await bcrypt.compare(password, cre.rows[0].password)
  return { isValid, id: cre.rows[0].id, role: cre.rows[0].role }

}

const updateUser = async (data) => {
  await pool.query("UPDATE public.user SET  fullname = $1,phone= $2, email =$3 ,country = $4,default_shipping_address=$5, role = $6 WHERE id = $7;", Object.values(data))
  return

}

const updatePassword = async (id, password) => {

  const hash = await bcrypt.hash(password, saltRounds)
  let row = await pool.query("UPDATE public.user SET  password = $1 WHERE id = $2;", [hash, id])
  if (!row.rowCount) {
    throw new Error("No username found")
  }

  return


}

const newPassword = async (email, password) => {
  const hash = await bcrypt.hash(password, saltRounds)
  let row = await pool.query("UPDATE public.user SET  password = $1 WHERE email = $2;", [hash, email])
  if (!row.rowCount) {
    throw new Error("No username found")
  }

  return


}

const getEmail = async (id) => {
 

    let email = (await pool.query("select email from public.passwdforgot_email where id = $1", [id])).rows[0]
    return email
 
}

const addForgotPassEmail = async (email) => {
  
    let checkEmail = (await pool.query("select email from public.user")).rows[0]
    if (!checkEmail) {
      throw new Error("No email valid")
    }
    let e_id = uuidv4()
    await pool.query("insert into public.passwdforgot_email values($1,$2)",[email,e_id])
    return e_id

  
}

const deleteForgotPassEmail = async(id)=>{
  
    await pool.query("delete from public.passwdforgot_email where id = $1",[id])
    return
  
}

export default {getEmail,addForgotPassEmail,deleteForgotPassEmail, updateUser, getUserBy, addUser, getAvailableUserCred, updatePassword, getAllUser, getMyData, newPassword };