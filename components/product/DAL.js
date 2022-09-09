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

const getProduct = async (id) => {

  let data = await pool.query('select *,ARRAY_LENGTH("bidder",1) as bidder_count from public.product p inner join public.category c on p.category = c.id left join public.product_image i on p.id = i.product_id where p.id = $1', [id])
  let bidders = await pool.query("select id,fullname from (select unnest(bidder) as b from public.product where id = $1)  b join public.user u on b.b = u.id ",[id])
  return { prod: data.rows, bidders }
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


export default { addProduct, delproduct, getCategory, getAllProduct, getProduct, addCategory }
