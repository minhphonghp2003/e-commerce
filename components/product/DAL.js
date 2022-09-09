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

const addProduct = async (product) => {
  const pid = uuidv4()
  product.status = 'pending'


  await pool.query("insert into public.product values ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)", [product.sku, product.name,
  product.price, product.category, product.id, product.description,
  product.date_end, product.seller, product.status, product.condition,
  product.min_increase, product.max_increase])
  return pid
}


const getAllProduct = async (cate) => {
  let data = await pool.query("select sku, name, date_end, status, image[0] from public.product  p inner join public.product_image as i on p.id  = i.product_id ")
  if (cate) {
    data = await pool.query("select sku, name, date_end, status, image[0] from public.product  p inner join public.product_image as i on p.id  = i.product_id where p.category = $1", [cate])
  }
  return data.rows

}

// const updateProduct = async ()

const getProduct = async (id) => {

  let data = await pool.query('select * from public.product p inner join public.category c on p.category = c.id left join public.product_image i on p.id = i.product_id where p.id = $1', [id])
  let bidders = await pool.query("select fullname,b.price  from public.bidder b join public.user u on b.bidder = u.id where b.product = $1 order by price desc"[id])
  return { prod: data.rows[0], bidders }
}

const updateStatus = async (status, id) => {
  let row = (await (pool.query("update public.product set status = $1 where id = $2", [status, id]))).rowCount
  return row
}

const addBid = async (product_id, customer_id, shipping_address, price) => {
  let sku = Date.now()
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  await pool.query("insert into public.bidder values($1,$2,$3) ", [customer_id, product_id, price])
  await pool.query("insert into public.order values($1,$2,$3,$4,$5) ", [sku, product_id, today, customer_id, shipping_address])
  await pool.query("update public.product set price = $1 where id = $2", [price, product_id])
  return
}

const getWinner = async (product_id) => {
  let data = await pool.query("select * from public.product p join public.bidder b on p.id = b.product join public.user u on b.bidder = u.id where p.id = $1 order by price", [product_id])
  return data.rows[0]

}


const udpateBid = async (product_id, customer_id, price) => {
  let row1 = (await pool.query("update public.product set price = $1 where id = $2"), [price, product_id]).rowCount
  let row2 = (await pool.query("update public.bidder set price = $1 where customer_id = $2 and product_id = $3"), [price, customer_id, product_id]).rowCount
  return row1 && row2
}


const delproduct = async (id) => {
  let row = (await pool.query("delete from public.product where id = $1", [id])).rowCount
  return row
}



// -------------category-----------------------



const getCategory = async () => {
  let allcate = await pool.query("select cate from public.category")
  return allcate.rows
}

const addCategory = async (cate) => {
  await pool.query("insert into public.category (cate) values ($1)", [cate])
  return
}


export default {
  addProduct, delproduct,
  getCategory, getAllProduct, getProduct,
  addCategory, updateStatus, addBid, udpateBid,
  getWinner
}
