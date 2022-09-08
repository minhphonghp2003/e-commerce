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

const addProduct = async (product) =>{
  const pid = uuidv4()

  await pool.query("insert into public.product values ($1, $2,$3,$4,$5,$6,$7,$8,$9)",[product.sku, product.name, product.price,product.category, product.id, product.description, product.date_end , product.bid, product.seller])
  return pid
}

const updateProduct = async (product) =>{
  let row = ( await pool.query("update public.product set name = $1, category = $2, description = $3, date_end = $4 where id = $5",[product.name, product.category, product.description, product.date_end, product.id])).rowCount
  return row
}

const getProduct = async (id)=>{
  let data = await pool.query("select * from public.product p inner join public.category c on p.category = c.id where p.id = $1",[id])
  return data.rows
}

const delProduct = async (id)=>{
  let row = (await pool.query("delete from public.product where id = $1", [id])).rowCount
  return row
}

const getCategory = async ()=>{
  let allCate = await pool.query("select cate from public.category")
  return allCate.rows
}


export default { addProduct, updateProduct,getProduct, delProduct, getCategory  }
