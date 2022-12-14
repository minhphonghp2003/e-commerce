import pkg from 'pg';
import 'dotenv/config'
import { v4 as uuidv4, v4 } from 'uuid';
import order from '../order/DAL.js'
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})



const addProduct = async (product, images) => {
  const pid = uuidv4()
  product.status = 'pending'


  await pool.query("insert into public.product values ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)", [product.sku, product.name,
  product.price, product.category, pid, product.description,
  product.date_end, product.seller, product.status, product.condition,
  product.min_increase, product.max_increase])

  await pool.query('insert into public.product_image values($1,$2)', [pid, images])

  return pid
}


const getAllProduct = async () => {
  let data = await pool.query("select p.id, sku, name,c.cate as category, date_end, status, image[1] as image from public.product  p inner join public.product_image as i on p.id  = i.product_id  join public.category c on p.category = c.id")
  let bidder = await pool.query("select count(bidder.bidder), product from bidder group by product order by count desc")
  
  return {data:data.rows, bidder_count:bidder.rows}

}


const getProduct = async (id) => {
  let product = await pool.query('select * from public.product p inner join public.category c on p.category = c.id left join public.product_image i on p.id = i.product_id where p.id = $1', [id])
  let seller = await pool.query("select fullname from public.user where id = $1", [product.rows[0].seller])
  let bidders = (await pool.query("select fullname,b.price  from public.bidder b join public.user u on b.bidder = u.id where b.product = $1 order by price desc", [id])).rows

  return { prod: product.rows[0], bidders, seller_name: seller.rows[0].fullname }
}

const updateStatus = async (status, id) => {
  let row = (await (pool.query("update public.product set status = $1 where id = $2", [status, id]))).rowCount
  return row
}

const addBid = async (product_id, customer_id, price) => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  await pool.query("insert into public.bidder values($1,$2,$3) ", [customer_id, product_id, price])
  await pool.query("update public.product set price = $1 where id = $2", [price, product_id])
  return
}

const udpateBid = async (product_id, customer_id, price) => {

  let row1 = (await pool.query("update public.product set price = $1 where id = $2", [price, product_id])).rowCount
  let row2 = (await pool.query("update public.bidder set price = $1 where bidder = $2 and product = $3", [price, customer_id, product_id])).rowCount
  return row1 && row2
}


const getWinner = async (product_id) => {
  let data = await pool.query("select p.status, p.id as product_id, p.name as product_name,fullname,b.bidder as bidder,b.price,description,sku from public.product p join public.bidder b on p.id = b.product join public.user u on b.bidder = u.id where p.id = $1 order by price desc", [product_id])
  if(!data.rows[0]){
  let fake_data = {
    status:'closed',
    fullname:'',

  }
  return fake_data
  }
  let status = data.rows[0].status
  
  if(status!= 'sold'){
    let shipping_address = await order.getShippingAddress(data.rows[0].bidder)
    await order.addOrder(data.rows[0].bidder,product_id,shipping_address.id)
    updateStatus('sold',product_id)
    data.rows[0].status = 'sold'
  }
  
  return data.rows[0]

}



const delproduct = async (id) => {
  let image = (await pool.query("select image from product_image where product_id = $1", [id])).rows[0].image
  let row = (await pool.query("delete from public.product where id = $1", [id])).rowCount
  return { image, row }
}


const countPage = async()=>{
  let page = (await pool.query("select count(sku) as count from public.product ")).rows[0].count
  return page
}


// -------------category-----------------------



const getCategory = async () => {
  let allcate = await pool.query("select * from public.category")
  return allcate.rows
}

const addCategory = async (cate) => {
  await pool.query("insert into public.category (cate) values ($1)", [cate])
  return
}


const getMyBid = async(id)=>{
  let myBid = (await pool.query("select product as product_id,image[1] as p_image, b.price, p.name as product_name from public.bidder b join public.user u on b.bidder =  u.id join public.product as p on p.id = b.product join public.product_image i on i.product_id = p.id where u.id = $1",[id])).rows
  return myBid 
}



export default {
  addProduct, delproduct,
  getCategory, getAllProduct, getProduct,
  addCategory, updateStatus, addBid, udpateBid,
  getWinner,countPage,getMyBid
}
