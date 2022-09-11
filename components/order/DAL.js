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

const getShippingAddress  =async(customer)=>{
  return (await pool.query("select a.id from public.user u left join public.address a on u.default_shipping_address = a.id where u.id = $1 ",[customer])).rows[0]

}


const getOrder = async (customer, product)=>{
  return (await pool.query("select o.sku as order_sku, o.order_date, o.status, p.sku as product_sku, p.name, p.price, p.description, u.fullname, u.phone, u.email, a.* from public.order o join public.product p on o.product_id = p.id join public.user u on o.customer_id = u.id left join public.address a on o.shipping_address = a.id where o.customer_id = $1  and o.product_id = $2",[customer,product])).rows[0]
  
}

const addOrder = async (customer, product,shipping_address)=>{
  let sku = Date.now()
  
  
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  let status = 'preparing'

  await pool.query("insert into public.order values( $1,$2,$3,$4,$5,$6)",[sku,product,today,customer,shipping_address,status])
  return
}

const updateStatus = async( status,id)=>{
  let row = (await pool.query("update public.order set status = $1 where product_id = $2", [status,id])).rowCount
  return row
}

const getAllOrder = async() =>{
  return (await pool.query("select p.name,p.price,u.fullname,u.email,u.phone,a.* from public.order o join public.product p on o.product_id = p.id join public.address a on o.shipping_address = a.id join public.user u on u.id = o.customer_id ")).rows
}

export default { getOrder, addOrder, getShippingAddress, updateStatus,getAllOrder };
