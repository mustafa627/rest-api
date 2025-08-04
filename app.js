// app.js
import express from 'express';
import axios from 'axios';
import cors from "cors"
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())

 
const prices = {
  // product_id: { value: 13.49, currency_code: 'USD' }
};

 
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  console.log(productId)

  try {
    // Step 1: Get product title from fakestoreapi
    const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
    const product = response.data;

    const price = prices[productId];

    if (!price) {
      return res.status(404).json({ error: 'Price not found in memory' });
    }

    res.json({
      id: parseInt(productId),
      title: product.title,
      current_price: price
    });

  } catch (err) {
    res.status(404).json({ error: 'Product not found from external API' });
  }
});

app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { current_price } = req.body;

  if (!current_price?.value || !current_price?.currency_code) {
    return res.status(400).json({ error: 'Invalid input format' });
  }

  prices[productId] = current_price;

  res.json({ message: 'Price updated successfully (in memory)' });
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
