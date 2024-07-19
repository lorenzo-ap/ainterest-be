import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from '../mongodb/connect.js';
import postRoutes from '../routes/postRoutes.js';
import imageGeneratorRoutes from '../routes/imageGeneratorRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/image-generator', imageGeneratorRoutes);

app.get('/', (req, res) => {
    res.send('Hello !');
});

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);

        app.listen(9999, () => console.log('Server has started on http://localhost:9999'));
    } catch (error) {
        console.log(error);
    }
};

startServer();
