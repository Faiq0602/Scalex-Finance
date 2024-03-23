const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = 'Enter Your MongoDB Connection String here';

const apiUrl = 'https://api.dexscreener.com/latest/dex/tokens/inj19dtllzcquads0hu3ykda9m58llupksqwekkfnw';

const pairSchema = new mongoose.Schema({
    pairAddress: String,
    priceUsd: Number,
    volume: Number
});

const Pair = mongoose.model('Pair', pairSchema);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

app.get('/addData', async (req, res) => {
    try {

        const response = await axios.get(apiUrl);
        const pairsData = response.data.pairs.map(pair => ({
            pairAddress: pair.pairAddress,
            priceUsd: parseFloat(pair.priceUsd), 
            volume: parseFloat(pair.volume.h24) 
        }));

        // Saving the data
        await Pair.insertMany(pairsData);

        // Sending Response
        res.json({
            DataStatus : "Data Added Successfully in Database",
            pairsData : pairsData
        });
    } catch (error) {
        // Handling Errors
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/showData', async (req, res) => {
    try {
        // Fetching Data from MongoDB Collection
        const data = await Pair.find();

        // Sending the response containing all data
        res.json(data);
    } catch (error) {
        // Handling errors
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/deleteData', async (req, res) => {
    try {
        // Deleting all data from the MongoDB collection
        await Pair.deleteMany({});
        console.log('All data deleted from the database');
        res.send("All data deleted from the database"); // No content response
    } catch (error) {
        // Handling errors
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/updateData', async (req, res) => {
    const { pairAddress, priceUsd, volume } = req.body;

    try {
        // Checking if any data exists in the database for the given pairAddress
        const existingPair = await Pair.findOne({ pairAddress: pairAddress });
        if (!existingPair) {
            return res.status(400).json({ error: 'Invalid pairAddress. No data found.' });
        }

        // Updating the data in the MongoDB collection
        await Pair.updateOne({ pairAddress: pairAddress }, { $set: { priceUsd: priceUsd, volume: volume } });
        const updatedPair = await Pair.findOne({ pairAddress: pairAddress });
        res.json(updatedPair);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
