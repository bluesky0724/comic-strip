const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { updateVisitCount, connectDB } = require('./db');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

connectDB();

app.get('/api/comic/:comicNumber', async (req, res) => {
    const { comicNumber } = req.params;
    try {
        const response = await axios.get(`https://xkcd.com/${comicNumber}/info.0.json`);
        const count_data = await updateVisitCount(comicNumber);
        res.json({ data: response.data, count: count_data?.count ?? 0 });
    } catch (error) {
        console.error(`Error fetching comic data for comic number ${comicNumber}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/latest', async (_, res) => {
    try {
        const response = await axios.get('https://xkcd.com/info.0.json');
        const count_data = await updateVisitCount(response.data.num);
        res.json({ data: response.data, count: count_data?.count ?? 0 });
    } catch (error) {
        console.error('Error fetching latest comic data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/latest-page-num', async (_, res) => {
    try {
        const response = await axios.get('https://xkcd.com/info.0.json');
        res.json(response.data.num);
    } catch (error) {
        console.error('Error fetching latest comic data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});