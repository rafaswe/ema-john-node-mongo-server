// Username = emaJohnDB
// Password= kkwXTZVoGKCVLnQf

// step1 
const express = require('express');

const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

// step2
const app = express();
// step3
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghkwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connecting code with mongobd 
        await client.connect();
        //creating database using client  
        const database = client.db('online_shop');
        //products name ekta table khuje rakhbe or na thakle baniye niye then rakhbe
        const productCollections = database.collection('products');
        const orderCollection = database.collection('orders');

        //Get products API
        app.get('/products', async (req, res) => {
            // console.log(req.query)
            //if we want all value, then will be query = {};
            //Again if we dont want to show our values in our created formate,then their is no need of using options

            const cursor = productCollections.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const count = await cursor.count();
            if (page) {
                // cursor e jei value gula ashbe, oigula k array te convert kore felte hobe.  
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                // cursor e jei value gula ashbe, oigula k array te convert kore felte hobe.  
                products = await cursor.toArray();
            }



            res.send({
                count, products
            });
        });

        //use post to get data by keys
        app.post('/products/byKeys', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await productCollections.find(query).toArray();
            res.json(products)
        });

        //Add orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            // console.log("ORDER = ", order)
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })


    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);


// step4 starts
app.get('/', (req, res) => {
    res.send('Ema jon Server is running');
});

// step5 starts
app.listen(port, () => {
    console.log("Listing from port = ", port);
})
