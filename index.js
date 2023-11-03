var express = require('express')
var cors = require('cors')
const { productObjectList } = require("./productsDatabase.js");
var app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
     extended: true
}))

const port = 8080;
// Stage 1
app.get('/products', function (req, res) {
     res.send({
          data: productObjectList
     })
});
// Stage 2
app.post('/products', (req, res) => {
     const newProduct = req.body;
     const findMaxId = (list) => {
          if (!list) return 0;

          let maxId = list[0].id;
          for (let i = 0; i < list.length; i++) {
               if (list[i].id > maxId) {
                    maxId = list[i].id;
               }
          }

          return maxId;
     }
     const createdNewProduct = {
          id: findMaxId(productObjectList) + 1,
          ...newProduct
     }
     productObjectList.push(createdNewProduct)
     res.send({
          data: createdNewProduct
     })
})
// Stage 3
app.post('/orders', (req, res) => {
     const { orders } = req.body
     const mappedOrdersWithPrice = orders.map((item) => {
          const { id, quantity } = item
          const product = productObjectList.find(prod => prod.id === id)
          return {
               id,
               quantity,
               totalPrice: quantity * product.price
          }
     })
     const orderTotalPrice = mappedOrdersWithPrice.reduce((prev, curr) => prev + curr.totalPrice, 0)
     res.send({
          data: {
               orders: mappedOrdersWithPrice,
               totalPrice: orderTotalPrice
          }
     })
})

app.listen(port, function () {
     console.log(`App listening on port ${port}`);
})