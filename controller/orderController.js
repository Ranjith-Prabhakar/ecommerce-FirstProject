
const { errorHandler } = require('../middleWare/errorMiddleWare')
const UserModal = require('../model/userModal')
const ProductModal = require('../model/productModal')

const getOrderManagement = async (req, res, next) => {
  try {

    let orders = await UserModal.find({}, { firstName: 1, lastName: 1, orders: 1,shippingAddress:1 });
    let orderObject = []
    for (let i = 0; i < orders.length; i++) {
      for(let j = 0;j < orders[i].orders.length;j++){
        let shippingAddress = orders[i].shippingAddress.find((SA)=>SA._id.toString() === orders[i].orders[j].addressToShip.toString())
        orderObject.push({
          userId: orders[i]._id,
          firstName: orders[i].firstName,
          lastName: orders[i].lastName,
          total:orders[i].orders[j].total,
          addressToShip:shippingAddress,
          orderId:orders[i].orders[j]._id,
          orderDate:orders[i].orders[j].orderDate,
          status:orders[i].orders[j].status
        })
      }
    }

    orderObject.sort((a,b)=>b.orderDate - a.orderDate)

    console.log("orders", orders);
    console.log("orders[0].orders", orders[0].orders);
    console.log("orders[0].orders[0].product", orders[0].orders[0].product);
    console.log("orderObject", orderObject);


    res.render('./admin/orderManagement/orderManagement', { orderObject })
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

const postOrderStatusEdit = async(req,res,next)=>{
  try {
    let{userId,orderId,status} =req.body.orderData 
    await UserModal.updateOne({_id:userId, "orders._id":orderId},{"orders.$.status":status})
    res.json({success:true})
    console.log("success");
  } catch (error) {
    errorHandler(error,req,res,next)
    
  }
}
const getOrderDetailPage = async(req,res,next)=>{
  try {
    let {userId,orderId} = req.query
    const user = await UserModal.findOne({ _id:userId});
    let orders = await UserModal.findOne({ _id: userId }, { _id: 0, orders: 1 }).lean();
    let order = orders.orders.find((order) => order._id.toString() === orderId.toString());
    console.log("order", order);
    console.log("order.product", order.product);

    let completeData = await Promise.all(order.product.map(async (products) => {
        try {
            const product = await ProductModal.findOne({ _id: products.productId }).lean();
    
            if (product) {
                // Populate the 'gallery' and 'specification' fields
                const populatedProduct = await ProductModal.populate(product, {
                    path: 'gallery', // Assuming 'gallery' is an array of strings
                    select: 'specification' // Specify the fields to populate
                });
    
                // Merge the populated fields into the original product
                const mergedProduct = { ...product, ...populatedProduct };
    
                // Merge with the product-specific order data
                return { ...mergedProduct, ...products };
            }
        } catch (error) {
            console.log(error.message);
        }
    }));
    
    const addressToShip = user.shippingAddress.find((shippingAddress)=> shippingAddress._id.toString() === order.addressToShip.toString())
    console.log("completeData", completeData);
    

    console.log("order.product (after populating)", order.product);
    console.log(order.addressToShip);
    console.log("addressToShip",addressToShip);

    res.render('./admin/orderManagement/orderSinglePage', { order:completeData,addressToShip });
} catch (error) {
    errorHandler(error, req, res, next);
}
}

module.exports = {
  getOrderManagement,
  postOrderStatusEdit,
  getOrderDetailPage
}